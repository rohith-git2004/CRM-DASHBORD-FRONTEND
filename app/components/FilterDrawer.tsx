"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { X, ChevronDown, Star, Trash2 } from "lucide-react";

export interface Filters {
  status: string[];
  company: string[];
  email: string;
  phone: string;
  fromDate: string;
  toDate: string;
}

export interface SavedFilterItem {
  id: string;
  name: string;
  filters: Filters;
  isStarred?: boolean;
}

// Matches API Customer Interface
export interface CustomerRecord {
  _id?: string;
  id?: string | number;
  email?: string | null;
  phone?: string | null;
  status?: string | null;
  company?: string | null;
  lastContact?: string | number | Date | null;
  lastContactDate?: string | number | Date | null;
  [key: string]: any;
}

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: Filters) => void;
  availableCompanies: string[];
  availableStatuses: string[];
  /** Current active filters from parent state */
  currentFilters?: Filters;
  /** Optional customer list from API to display a live count of matching records */
  customers?: CustomerRecord[];
}

export const EMPTY_FILTERS: Filters = {
  status: [],
  company: [],
  email: "",
  phone: "",
  fromDate: "",
  toDate: "",
};

/**
 * Case-insensitive & trimmed email filter matching.
 */
export const isEmailInFilter = (
  recordEmail?: string | null,
  filterEmail?: string
): boolean => {
  if (!filterEmail || !filterEmail.trim()) return true;
  if (!recordEmail) return false;

  return recordEmail
    .trim()
    .toLowerCase()
    .includes(filterEmail.trim().toLowerCase());
};

/**
 * Helper to convert any valid date representation into a standardized timestamp.
 */
const parseToTimestamp = (
  dateInput?: string | number | Date | null
): number | null => {
  if (!dateInput) return null;

  try {
    // Already Date object
    if (dateInput instanceof Date) {
      const time = dateInput.getTime();
      return isNaN(time) ? null : time;
    }

    // Unix timestamp
    if (typeof dateInput === "number") {
      return dateInput;
    }

    if (typeof dateInput === "string") {
      // YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
        const [year, month, day] = dateInput.split("-").map(Number);
        return Date.UTC(year, month - 1, day);
      }

      // DD/MM/YYYY format
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateInput)) {
        const [day, month, year] = dateInput.split("/").map(Number);
        return Date.UTC(year, month - 1, day);
      }

      // ISO date from MongoDB or standard date string
      const parsed = new Date(dateInput).getTime();

      return isNaN(parsed) ? null : parsed;
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Robust Utility Function for Date Range Comparison.
 * Correctly evaluates ISO strings (from API) & YYYY-MM-DD formats.
 */
export const isDateInFilterRange = (
  recordDateInput?: string | number | Date | null,
  fromDateStr?: string,
  toDateStr?: string
): boolean => {
  // If no date filters applied, allow everything
  if (!fromDateStr && !toDateStr) return true;

  const recordTime = parseToTimestamp(recordDateInput);
  if (recordTime === null) return false;

  if (fromDateStr) {
    const [y, m, d] = fromDateStr.split("-").map(Number);
    const startDate = Date.UTC(y, m - 1, d, 0, 0, 0, 0);
    if (recordTime < startDate) {
      return false;
    }
  }

  if (toDateStr) {
    const [y, m, d] = toDateStr.split("-").map(Number);
    const endDate = Date.UTC(y, m - 1, d, 23, 59, 59, 999);
    if (recordTime > endDate) {
      return false;
    }
  }

  return true;
};

/**
 * Single function to validate a customer record against active filters.
 */
export const isRecordMatch = (
  record: CustomerRecord,
  filters: Filters
): boolean => {
  const contactDate =
    record.lastContact ??
    record.lastContactDate ??
    record.createdAt ??
    null;

  if (!isEmailInFilter(record.email, filters.email)) {
    return false;
  }

  if (
    !isDateInFilterRange(
      contactDate,
      filters.fromDate,
      filters.toDate
    )
  ) {
    return false;
  }

  if (
    filters.status.length > 0 &&
    (!record.status || !filters.status.includes(record.status))
  ) {
    return false;
  }

  if (
    filters.company.length > 0 &&
    (!record.company || !filters.company.includes(record.company))
  ) {
    return false;
  }

  if (filters.phone && filters.phone.trim()) {
    const cleanRecordPhone = (record.phone || "").replace(/\D/g, "");
    const cleanFilterPhone = filters.phone.replace(/\D/g, "");

    if (!cleanRecordPhone.includes(cleanFilterPhone)) {
      return false;
    }
  }

  return true;
};

export default function FilterDrawer({
  open,
  onClose,
  onApply,
  availableCompanies,
  availableStatuses,
  currentFilters,
  customers = [],
}: FilterDrawerProps) {
  // Local active filters state
  const [filters, setFilters] = useState<Filters>(
    currentFilters || EMPTY_FILTERS
  );
  const [savedFilters, setSavedFilters] = useState<SavedFilterItem[]>([]);

  const [showSaveInput, setShowSaveInput] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const [companySearch, setCompanySearch] = useState("");
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync state whenever drawer opens or external filters change
  useEffect(() => {
    if (open && currentFilters) {
      setFilters(currentFilters);
    }
  }, [open, currentFilters]);

  // Load saved presets on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("savedFilters");
    if (saved) {
      try {
        setSavedFilters(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading saved filters:", e);
      }
    }
  }, []);

  // Handle outside click for company dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsCompanyDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const updateFilters = (data: Filters) => {
    setFilters(data);
    if (isSaved) setIsSaved(false);
  };

  const activeCount = useMemo(() => {
    return (
      filters.status.length +
      filters.company.length +
      (filters.email ? 1 : 0) +
      (filters.phone ? 1 : 0) +
      (filters.fromDate ? 1 : 0) +
      (filters.toDate ? 1 : 0)
    );
  }, [filters]);

  // Real-time matching customer count calculation
  const matchingCustomersCount = useMemo(() => {
    if (!customers || customers.length === 0) return 0;
    return customers.filter((c) => isRecordMatch(c, filters)).length;
  }, [customers, filters]);

  // Sort presets with starred ones first
  const sortedSavedFilters = useMemo(() => {
    return [...savedFilters].sort((a, b) => {
      if (a.isStarred && !b.isStarred) return -1;
      if (!a.isStarred && b.isStarred) return 1;
      return 0;
    });
  }, [savedFilters]);

  const toggleStatus = (status: string) => {
    const updated = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    updateFilters({ ...filters, status: updated });
  };

  const selectCompany = (company: string) => {
    if (!filters.company.includes(company)) {
      updateFilters({ ...filters, company: [...filters.company, company] });
    }
    setCompanySearch("");
    setIsCompanyDropdownOpen(false);
  };

  const removeCompany = (company: string) => {
    updateFilters({
      ...filters,
      company: filters.company.filter((c) => c !== company),
    });
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setIsSaved(false);
  };

  const saveFilter = () => {
    if (!filterName.trim()) return;

    const newFilter: SavedFilterItem = {
      id: Date.now().toString(),
      name: filterName.trim(),
      filters: { ...filters },
      isStarred: false,
    };

    const updatedFilters = [...savedFilters, newFilter];
    setSavedFilters(updatedFilters);
    localStorage.setItem("savedFilters", JSON.stringify(updatedFilters));

    setIsSaved(true);
    setFilterName("");
    setShowSaveInput(false);

    setTimeout(() => setIsSaved(false), 3000);
  };

  const toggleStarFilter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedFilters.map((item) =>
      item.id === id ? { ...item, isStarred: !item.isStarred } : item
    );
    setSavedFilters(updated);
    localStorage.setItem("savedFilters", JSON.stringify(updated));
  };

  const deleteSavedFilter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedFilters.filter((item) => item.id !== id);
    setSavedFilters(updated);
    localStorage.setItem("savedFilters", JSON.stringify(updated));
  };

  const applyFilter = () => {
    onApply(filters);
    onClose();
  };

  const filteredCompanies = availableCompanies.filter((company) =>
    company.toLowerCase().includes(companySearch.toLowerCase())
  );

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed right-0 top-0 z-50 flex h-screen w-[380px] flex-col border-l border-gray-700 bg-[#0F1722] text-white transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 p-5">
          <div>
            <h2 className="flex items-center text-lg font-semibold">
              Filters
              {activeCount > 0 && (
                <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs">
                  {activeCount}
                </span>
              )}
            </h2>
            {customers.length > 0 && (
              <p className="mt-0.5 text-xs text-gray-400">
                {matchingCustomersCount} of {customers.length} customers match
              </p>
            )}
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          {/* Preset Saver */}
          {isSaved ? (
            <div className="w-full rounded-lg border border-green-500/50 bg-green-600/20 py-2 text-center text-sm font-medium text-green-300">
              Filter Saved ✓
            </div>
          ) : !showSaveInput ? (
            <button
              onClick={() => setShowSaveInput(true)}
              className="w-full rounded-lg border border-gray-700 py-2 text-sm font-medium transition hover:bg-gray-800"
            >
              Save Current Filter
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                value={filterName}
                placeholder="Filter preset name..."
                onChange={(e) => setFilterName(e.target.value)}
                className="flex-1 rounded border border-gray-700 bg-[#16202E] px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={saveFilter}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          )}

          {/* Status Filter */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold">Status</label>
              {activeCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Clear All
                </button>
              )}
            </div>

            {availableStatuses.map((status) => (
              <label
                key={status}
                className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-gray-300 hover:text-white"
              >
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={() => toggleStatus(status)}
                  className="rounded border-gray-700 bg-[#16202E]"
                />
                {status}
              </label>
            ))}
          </div>

          {/* Company Multi-Select */}
          <div>
            <label className="text-sm font-semibold">Company</label>

            <div ref={dropdownRef} className="relative mt-2">
              <div
                onClick={() => setIsCompanyDropdownOpen(true)}
                className="flex min-h-[40px] cursor-pointer flex-wrap items-center gap-2 rounded border border-gray-700 bg-[#16202E] p-2"
              >
                {filters.company.map((company) => (
                  <span
                    key={company}
                    className="flex items-center gap-1 rounded bg-gray-700 px-2 py-0.5 text-xs"
                  >
                    {company}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCompany(company);
                      }}
                      className="hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}

                <input
                  value={companySearch}
                  onChange={(e) => {
                    setCompanySearch(e.target.value);
                    setIsCompanyDropdownOpen(true);
                  }}
                  placeholder={
                    filters.company.length === 0 ? "Search company..." : ""
                  }
                  className="flex-1 bg-transparent text-sm outline-none"
                />

                <ChevronDown size={16} className="text-gray-400" />
              </div>

              {isCompanyDropdownOpen && (
                <div className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded border border-gray-700 bg-[#16202E]">
                  {filteredCompanies.length === 0 ? (
                    <div className="p-2 text-xs text-gray-400">
                      No options found
                    </div>
                  ) : (
                    filteredCompanies.map((company) => (
                      <div
                        key={company}
                        onClick={() => selectCompany(company)}
                        className="cursor-pointer p-2 text-sm hover:bg-gray-700"
                      >
                        {company}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Last Contact Date Filter */}
          <div>
            <label className="text-sm font-semibold">Last Contact Date</label>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <span className="mb-1 block text-xs text-gray-400">From</span>
                <input
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) =>
                    updateFilters({ ...filters, fromDate: e.target.value })
                  }
                  className="w-full rounded border border-gray-700 bg-[#16202E] p-2 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <span className="mb-1 block text-xs text-gray-400">To</span>
                <input
                  type="date"
                  value={filters.toDate}
                  onChange={(e) =>
                    updateFilters({ ...filters, toDate: e.target.value })
                  }
                  className="w-full rounded border border-gray-700 bg-[#16202E] p-2 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Phone Filter */}
          <div>
            <label className="text-sm font-semibold">Phone</label>
            <input
              placeholder="Filter by phone..."
              value={filters.phone}
              onChange={(e) =>
                updateFilters({ ...filters, phone: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-700 bg-[#16202E] p-2 text-sm text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Email Filter */}
          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              placeholder="Filter by email..."
              value={filters.email}
              onChange={(e) =>
                updateFilters({ ...filters, email: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-700 bg-[#16202E] p-2 text-sm text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Saved Filter List */}
          <div>
            <label className="text-sm font-semibold">Saved Presets</label>

            <div className="mt-3 space-y-2">
              {sortedSavedFilters.length === 0 ? (
                <p className="text-xs text-gray-400">No saved presets</p>
              ) : (
                sortedSavedFilters.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => updateFilters({ ...item.filters })}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-700 bg-[#16202E] px-3 py-2 text-sm transition hover:bg-gray-700"
                  >
                    <span className="truncate pr-2">{item.name}</span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => toggleStarFilter(item.id, e)}
                        className={`p-1 transition ${
                          item.isStarred
                            ? "text-yellow-400"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                        title={
                          item.isStarred ? "Unstar preset" : "Star preset"
                        }
                      >
                        <Star
                          size={14}
                          className={item.isStarred ? "fill-yellow-400" : ""}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => deleteSavedFilter(item.id, e)}
                        className="p-1 text-gray-400 transition hover:text-red-400"
                        title="Delete preset"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer Apply Action */}
        <div className="border-t border-gray-700 p-4">
          <button
            onClick={applyFilter}
            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold transition hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}