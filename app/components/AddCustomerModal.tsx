"use client";

import { useEffect, useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  createCustomer,
  updateCustomer,
  type Customer,
} from "@/services/customers";

interface AddCustomerModalProps {
  open: boolean;
  onClose: () => void;
  customer?: Customer | null;
}

export default function AddCustomerModal({
  open,
  onClose,
  customer,
}: AddCustomerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "Active",
    notes: "",
    lastContact: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!open) return;

    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company,
        status: customer.status,
        notes: customer.notes || "",
        lastContact: customer.lastContact
          ? customer.lastContact.split("T")[0]
          : "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "Active",
        notes: "",
        lastContact: "",
      });
    }
  }, [customer, open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        status: formData.status,
        notes: formData.notes,
        lastContact: formData.lastContact,
      };

      if (customer?._id) {
        await updateCustomer(customer._id, payload);
        setSuccessMessage("Customer updated successfully!");
      } else {
        await createCustomer(payload);
        setSuccessMessage("Customer added successfully!");
      }

      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to save customer.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  const handleErrorClose = () => {
    setShowErrorModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in">
        <div className="flex max-h-[88vh] w-full max-w-lg flex-col rounded-2xl border border-slate-700 bg-[#1c2233] shadow-2xl transition-all duration-200 animate-in zoom-in-95 ease-out">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700/80 px-6 py-4.5">
            <h2 className="text-2xl font-bold text-white">
              {customer ? "Edit Customer" : "Add Customer"}
            </h2>

            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-slate-700 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Form Body */}
          <div className="space-y-4.5 overflow-y-auto p-6 text-sm">
            {/* Name */}
            <div>
              <label className="mb-1.5 block font-medium text-gray-300">
                Name <span className="text-red-400">*</span>
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4.5 w-4.5 text-gray-400" />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-slate-600 bg-[#111827] py-2.5 pl-10 pr-10 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {formData.name && (
                  <CheckCircle2 className="absolute right-3.5 h-4.5 w-4.5 text-emerald-500" />
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block font-medium text-gray-300">
                Email <span className="text-red-400">*</span>
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4.5 w-4.5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-slate-600 bg-[#111827] py-2.5 pl-10 pr-10 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {formData.email && (
                  <CheckCircle2 className="absolute right-3.5 h-4.5 w-4.5 text-emerald-500" />
                )}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 block font-medium text-gray-300">
                Mobile Number <span className="text-red-400">*</span>
              </label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3.5 h-4.5 w-4.5 text-gray-400" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full rounded-xl border border-gray-600 bg-[#111827] py-2.5 pl-10 pr-3.5 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="mb-1.5 block font-medium text-gray-300">
                Company
              </label>
              <div className="relative flex items-center">
                <Building2 className="absolute left-3.5 h-4.5 w-4.5 text-gray-400" />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                  className="w-full rounded-xl border border-gray-600 bg-[#111827] py-2.5 pl-10 pr-3.5 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Status + Last Contact */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block font-medium text-gray-300">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full cursor-pointer rounded-xl border border-gray-600 bg-[#111827] px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Active">Active Customer</option>
                  <option value="Inactive">Inactive Customer</option>
                  <option value="Pending">Pending Customer</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block font-medium text-gray-300">
                  Last Contact Date
                </label>
                <div className="relative flex items-center">
                  <Calendar className="pointer-events-none absolute left-3.5 h-4.5 w-4.5 text-gray-400" />
                  <input
                    type="date"
                    name="lastContact"
                    value={formData.lastContact}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-600 bg-[#111827] py-2.5 pl-10 pr-2.5 text-sm text-white outline-none transition [color-scheme:dark] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="mb-1.5 block font-medium text-gray-300">
                Notes
              </label>
              <textarea
                rows={3.5}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Meeting notes and follow-up items..."
                className="w-full resize-none rounded-xl border border-gray-600 bg-[#111827] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-[#374151] px-6 py-4">
            <button
              onClick={onClose}
              className="rounded-xl bg-gray-700/80 px-5 py-2.5 font-medium text-white transition-colors hover:bg-gray-600 active:scale-95"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-md transition hover:bg-blue-500 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
              {loading
                ? "Saving..."
                : customer
                ? "Update Customer"
                : "Add Customer"}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-slate-700 bg-[#1c2233] p-6 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-8 ring-emerald-500/10">
              <CheckCircle2 className="h-10 w-10 animate-in zoom-in duration-300" />
            </div>

            <h3 className="text-xl font-bold text-white">Success!</h3>

            <p className="mt-2 text-sm text-gray-300">{successMessage}</p>

            <button
              onClick={handleSuccessClose}
              className="mt-6 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-500 active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-slate-700 bg-[#1c2233] p-6 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/15 text-rose-400 ring-8 ring-rose-500/10">
              <AlertCircle className="h-10 w-10 animate-in zoom-in duration-300" />
            </div>

            <h3 className="text-xl font-bold text-white">Error</h3>

            <p className="mt-2 text-sm text-gray-300">{errorMessage}</p>

            <button
              onClick={handleErrorClose}
              className="mt-6 w-full rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-rose-500 active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}