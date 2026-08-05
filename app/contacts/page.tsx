"use client";

import { useEffect, useState } from "react";

import Sidebar from "../components/sidebar";
import CustomerTable from "../components/CustomerTable";
import AddCustomerModal from "../components/AddCustomerModal";
import CustomerDetailsModal from "../components/CustomerDetailsModal";
import FilterDrawer, {
  isDateInFilterRange,
  type Filters,
} from "../components/FilterDrawer";

import { Plus, Search, ChevronDown, Trash2, CheckCircle2 } from "lucide-react";

import {
  getCustomers,
  deleteCustomer,
  type Customer,
} from "@/services/customers";

export default function ContactsPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");

  const [openModal, setOpenModal] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  // Delete Confirmation Modal State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    let filtered = [...customers];

    if (search) {
      const value = search.toLowerCase();

      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(value) ||
          customer.email.toLowerCase().includes(value) ||
          customer.phone.toLowerCase().includes(value) ||
          customer.company.toLowerCase().includes(value)
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    if (companyFilter !== "All") {
      filtered = filtered.filter((c) => c.company === companyFilter);
    }

    setFilteredCustomers(filtered);
  }, [search, customers, statusFilter, companyFilter]);

  const companies = [
    "All",
    ...new Set(customers.map((c) => c.company)),
  ];

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const data = await getCustomers();

      setCustomers(data);
      setFilteredCustomers(data);
    } finally {
      setLoading(false);
    }
  };

  // Open confirmation modal
  const handleDelete = (id: string) => {
    setDeleteId(id);
    setShowConfirmModal(true);
  };

  // Cancel deletion -> Return directly to table
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setDeleteId(null);
    if (openDetails) {
      setOpenDetails(false);
      setSelectedCustomer(null);
    }
  };

  // Confirm deletion -> Perform delete and show success modal
  const confirmDelete = async () => {
    if (!deleteId) return;

    await deleteCustomer(deleteId);

    setShowConfirmModal(false);
    setDeleteId(null);

    if (openDetails) {
      setOpenDetails(false);
      setSelectedCustomer(null);
    }

    setSuccessMessage("Customer deleted successfully!");
    setShowSuccessModal(true);

    loadCustomers();
  };

  const handleApplyFilters = (filters: Filters) => {
    let filtered = [...customers];

    if (filters.status.length > 0) {
      filtered = filtered.filter((customer) =>
        filters.status.includes(customer.status)
      );
    }

    if (filters.company.length > 0) {
      filtered = filtered.filter((customer) =>
        filters.company.includes(customer.company)
      );
    }

    if (filters.email.trim()) {
      filtered = filtered.filter((customer) =>
        customer.email
          .toLowerCase()
          .includes(filters.email.toLowerCase())
      );
    }

    if (filters.phone.trim()) {
      filtered = filtered.filter((customer) =>
        customer.phone.includes(filters.phone)
      );
    }

    if (filters.fromDate || filters.toDate) {
      filtered = filtered.filter((customer) => {
        const contactDate =
          customer.lastContact || customer.createdAt || null;
        return isDateInFilterRange(
          contactDate,
          filters.fromDate,
          filters.toDate
        );
      });
    }

    setFilteredCustomers(filtered);
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-[#111827]">
      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            
            {/* Left side: Heading + Search bar inline */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white shrink-0">Customers</h1>

              {/* Search */}
              <div className="relative w-full sm:w-[240px] lg:w-[280px]">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search customers..."
                  className="h-10 w-full rounded-xl border border-gray-700 bg-[#1B2330] pl-10 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Right side: Filters and Actions */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {/* Status */}
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 w-full sm:w-auto appearance-none rounded-xl border border-gray-700 bg-[#1B2330] px-3.5 pr-8 text-sm text-white"
                >
                  <option value="All">Status : All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              {/* Company */}
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="h-10 w-full sm:w-auto appearance-none rounded-xl border border-gray-700 bg-[#1B2330] px-3.5 pr-8 text-sm text-white"
                >
                  {companies.map((company) => (
                    <option key={company} value={company}>
                      {company === "All" ? "Company : All" : company}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              {/* Advanced Filter Button */}
              <button
                onClick={() => setOpenFilter(true)}
                className="flex h-10 flex-1 sm:flex-none items-center justify-center rounded-xl border border-gray-700 bg-[#1B2330] px-4 text-sm font-semibold text-white hover:bg-[#2A3444]"
              >
                Filters
              </button>

              {/* Add Customer Button */}
              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setOpenModal(true);
                }}
                className="flex h-10 w-full sm:w-auto items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus size={16} className="mr-1.5 shrink-0" />
                Add Customer
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex h-[400px] sm:h-[500px] items-center justify-center rounded-2xl border border-gray-700 bg-[#1B2330]">
              <p className="text-lg text-gray-400">Loading Customers...</p>
            </div>
          ) : (
            <>
              {/* Table Card */}
              <div className="overflow-x-auto rounded-2xl border border-gray-700 bg-[#1B2330] shadow-2xl">
                <div className="min-w-[700px]">
                  <CustomerTable
                    customers={filteredCustomers}
                    onView={(customer) => {
                      setSelectedCustomer(customer);
                      setOpenDetails(true);
                    }}
                    onEdit={(customer) => {
                      setSelectedCustomer(customer);
                      setOpenModal(true);
                    }}
                    onDelete={handleDelete}
                  />
                </div>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-400 text-center sm:text-left">
                  Showing{" "}
                  <span className="font-semibold text-white">
                    {filteredCustomers.length === 0 ? 0 : 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-white">
                    {filteredCustomers.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-white">
                    {customers.length}
                  </span>{" "}
                  entries
                </p>

                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                  <button className="rounded-lg border border-gray-700 bg-[#111827] px-3 sm:px-4 py-2 text-sm text-gray-300 hover:bg-[#2A3444]">
                    Previous
                  </button>

                  <button className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-blue-600 text-sm font-semibold text-white">
                    1
                  </button>

                  <button className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg border border-gray-700 bg-[#111827] text-sm text-gray-300 hover:bg-[#2A3444]">
                    2
                  </button>

                  <button className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg border border-gray-700 bg-[#111827] text-sm text-gray-300 hover:bg-[#2A3444]">
                    3
                  </button>

                  <span className="px-1 sm:px-2 text-gray-500">...</span>

                  <button className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg border border-gray-700 bg-[#111827] text-sm text-gray-300 hover:bg-[#2A3444]">
                    15
                  </button>

                  <button className="rounded-lg border border-gray-700 bg-[#111827] px-3 sm:px-4 py-2 text-sm text-gray-300 hover:bg-[#2A3444]">
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        open={openModal}
        customer={selectedCustomer}
        onClose={() => {
          setOpenModal(false);
          setSelectedCustomer(null);
          loadCustomers();
        }}
      />

      {/* Customer Details */}
      <CustomerDetailsModal
        open={openDetails}
        customer={selectedCustomer}
        onClose={() => {
          setOpenDetails(false);
          setSelectedCustomer(null);
        }}
        onEdit={(customer) => {
          setOpenDetails(false);
          setSelectedCustomer(customer);
          setOpenModal(true);
        }}
        onDelete={handleDelete}
      />

      {/* Advanced Filter Drawer */}
      <FilterDrawer
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        onApply={handleApplyFilters}
        availableCompanies={[
          ...new Set(customers.map((c) => c.company)),
        ]}
        availableStatuses={[
          ...new Set(customers.map((c) => c.status)),
        ]}
      />

      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-slate-700 bg-[#1c2233] p-6 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/15 text-rose-400 ring-8 ring-rose-500/10">
              <Trash2 className="h-8 w-8 animate-in zoom-in duration-300" />
            </div>

            <h3 className="text-xl font-bold text-white">Delete Customer</h3>

            <p className="mt-2 text-sm text-gray-300">
              Are you sure you want to delete this customer?
            </p>

            <div className="mt-6 flex w-full gap-3">
              <button
                onClick={handleCancelDelete}
                className="w-1/2 rounded-xl bg-gray-700/80 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-600 active:scale-95"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="w-1/2 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-rose-500 active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-slate-700 bg-[#1c2233] p-6 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-8 ring-emerald-500/10">
              <CheckCircle2 className="h-10 w-10 animate-in zoom-in duration-300" />
            </div>

            <h3 className="text-xl font-bold text-white">Success!</h3>

            <p className="mt-2 text-sm text-gray-300">{successMessage}</p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-6 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-500 active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}