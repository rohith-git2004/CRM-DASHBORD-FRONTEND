"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/services/auth";
import {
  X,
  Mail,
  Phone,
  Building2,
  Calendar,
  FileText,
  Pencil,
  Trash2,
  UserCheck,
} from "lucide-react";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  notes?: string;
  lastContact?: string;
  createdAt?: string;
  updatedAt?: string;

  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

interface CustomerDetailsModalProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onEdit?: (customer: Customer) => void;
  onDelete?: (id: string) => void;
}

export default function CustomerDetailsModal({
  open,
  customer,
  onClose,
  onEdit,
  onDelete,
}: CustomerDetailsModalProps) {
  const [loggedInUser, setLoggedInUser] = useState<{ name?: string } | null>(null);

  useEffect(() => {
    if (open) {
      const user = getUser();
      setLoggedInUser(user);
    }
  }, [open]);

  if (!open || !customer) return null;

  const initials = customer.name
    ? customer.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "CU";

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? null
      : date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  };

  const formattedLastContact = formatDate(customer.lastContact);
  const formattedCreatedAt = formatDate(customer.createdAt);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in">
      <div className="flex max-h-[88vh] w-full max-w-lg flex-col rounded-2xl border border-slate-700 bg-[#1c2233] shadow-2xl transition-all duration-200 animate-in zoom-in-95 ease-out">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/80 px-6 py-4.5">
          <h2 className="text-xl font-bold text-white">Customer Details</h2>

          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="space-y-5 overflow-y-auto p-6 text-sm">
          
          {/* Customer Header Badge & Actions */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-700/60 pb-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-xl font-bold text-white shadow-md">
                {initials}
              </div>

              <div>
                <h1 className="text-lg font-bold text-white leading-snug">
                  {customer.name}
                </h1>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {customer.company || "No Company"}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      customer.status === "Active"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : customer.status === "Inactive"
                        ? "bg-red-500/15 text-red-400"
                        : "bg-amber-500/15 text-amber-400"
                    }`}
                  >
                    {customer.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Quick Actions */}
            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(customer)}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600/90 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-500 active:scale-95"
                >
                  <Pencil size={14} />
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(customer._id)}
                  className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500 hover:text-white active:scale-95"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-700/50 bg-[#111827] p-3.5">
              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-blue-400" />
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-400">Email</p>
                  <p className="truncate text-xs font-medium text-white">
                    {customer.email || "N/A"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 border-t border-slate-800 pt-2.5">
                <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-[11px] text-gray-400">Mobile Number</p>
                  <p className="text-xs font-medium text-white">
                    {customer.phone || "N/A"}
                  </p>
                </div>
              </div>

              {/* Company */}
              <div className="flex items-center gap-3 border-t border-slate-800 pt-2.5">
                <Building2 className="h-4 w-4 shrink-0 text-amber-400" />
                <div>
                  <p className="text-[11px] text-gray-400">Company</p>
                  <p className="text-xs font-medium text-white">
                    {customer.company || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details & Dates */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Account Metadata
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {/* Last Contacted */}
              <div className="rounded-xl border border-slate-700/50 bg-[#111827] p-3">
                <div className="mb-1 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-blue-400" />
                  <p className="text-[11px] text-gray-400">Last Contact</p>
                </div>
                <p className="text-xs font-medium text-white">
                  {formattedLastContact || "No Contact Yet"}
                </p>
              </div>

              {/* Created Date */}
              <div className="rounded-xl border border-slate-700/50 bg-[#111827] p-3">
                <div className="mb-1 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                  <p className="text-[11px] text-gray-400">Created Date</p>
                </div>
                <p className="text-xs font-medium text-white">
                  {formattedCreatedAt || "Not Available"}
                </p>
              </div>
            </div>

            {/* Account Owner */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-[#111827] p-3">
              <UserCheck className="h-4 w-4 shrink-0 text-indigo-400" />
              <div>
                <p className="text-[11px] text-gray-400">Account Owner</p>
                <p className="text-xs font-medium text-white">
                  {loggedInUser?.name || "Unknown User"}
                </p>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <FileText className="h-3.5 w-3.5 text-blue-400" />
              Notes & Interactions
            </h3>

            <div className="rounded-xl border border-slate-700/50 bg-[#111827] p-3.5">
              <p className="whitespace-pre-wrap text-xs leading-relaxed text-gray-300">
                {customer.notes?.trim()
                  ? customer.notes
                  : "No notes available for this customer."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-[#374151] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-gray-700/80 px-5 py-2.5 text-xs font-medium text-white transition-colors hover:bg-gray-600 active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}