"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Customer } from "@/services/customers";

interface CustomerTableProps {
  customers: Customer[];
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

/**
 * Safely formats any date string, timestamp, or Date object into a readable string.
 */
function formatDateDisplay(dateVal?: string | number | Date | null): string {
  if (!dateVal) return "N/A";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return "N/A";

  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CustomerTable({
  customers,
  onView,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#374151] bg-[#1F2937]">
      <table className="w-full">
        <thead className="bg-[#111827]">
          <tr className="text-left text-sm text-gray-400">
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Phone</th>
            <th className="px-6 py-4">Company</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Last Contact</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="py-8 text-center text-gray-400"
              >
                No Customers Found
              </td>
            </tr>
          ) : (
            customers.map((customer) => {
              const rawDate =
                (customer as any).lastContact ??
                (customer as any).lastContactDate;

              return (
                <tr
                  key={customer._id}
                  className="border-t border-[#374151] hover:bg-[#273548]"
                >
                  <td className="px-6 py-5 text-white">{customer.name}</td>

                  <td className="px-6 py-5 text-gray-300">
                    {customer.email}
                  </td>

                  <td className="px-6 py-5 text-gray-300">
                    {customer.phone}
                  </td>

                  <td className="px-6 py-5 text-gray-300">
                    {customer.company}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        customer.status === "Active"
                          ? "bg-green-600/20 text-green-400"
                          : customer.status === "Inactive"
                          ? "bg-red-600/20 text-red-400"
                          : "bg-yellow-600/20 text-yellow-400"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>

                  {/* Last Contact Column */}
                  <td className="px-6 py-5 font-mono text-xs text-gray-300">
                    {formatDateDisplay(rawDate)}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-3">
                      {/* View */}
                      <button
                        onClick={() => onView(customer)}
                        className="text-sky-400 hover:text-sky-300"
                      >
                        <Eye size={18} />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => onEdit(customer)}
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (customer._id) {
                            onDelete(customer._id);
                          }
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}