"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/sidebar";
import Topbar from "../../components/topbar";
import { ArrowLeft, Save, Menu, CheckCircle2, X } from "lucide-react";
import Link from "next/link";

import { createTask } from "@/services/tasks";

export default function NewTaskPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<
    "Pending" | "In Progress" | "Completed"
  >("Pending");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!description.trim()) {
      setError("Task description is required.");
      return;
    }

    try {
      setLoading(true);

      await createTask({
        title: title.trim(),
        description: description.trim(),
        status,
      });

      // Show success modal instead of immediate redirect
      setShowSuccessModal(true);
      
      // Automatically redirect after 1.5 seconds
      setTimeout(() => {
        router.push("/tasks");
      }, 1500);
    } catch (err: any) {
      console.error("Create Task Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create task. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#030712] text-white relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar - Responsive Drawer for Mobile, Static for Desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transform bg-[#030712] transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="hidden md:block">
          <Topbar />
        </div>

        {/* Mobile Header with Hamburger */}
        <div className="flex items-center justify-between border-b border-[#374151] px-4 py-3 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl border border-[#374151] p-2 text-gray-400 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <span className="font-semibold">Task Manager</span>
          <div className="w-8" /> {/* Spacer */}
        </div>

        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <div className="mb-8">
              <Link
                href="/tasks"
                className="mb-5 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
              >
                <ArrowLeft size={17} />
                Back to Tasks
              </Link>

              <h1 className="text-3xl font-bold text-white">
                Add New Task
              </h1>

              <p className="mt-1 text-gray-400">
                Create a new task and manage its status
              </p>
            </div>

            {/* Form Card */}
            <div className="rounded-2xl border border-[#374151] bg-[#1F2937] p-5 sm:p-7">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-medium text-gray-200"
                  >
                    Task Title
                  </label>

                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title"
                    className="w-full rounded-xl border border-[#374151] bg-[#111827] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-gray-200"
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter task description"
                    rows={6}
                    className="w-full resize-none rounded-xl border border-[#374151] bg-[#111827] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="mb-2 block text-sm font-medium text-gray-200"
                  >
                    Status
                  </label>

                  <select
                    id="status"
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target.value as
                          | "Pending"
                          | "In Progress"
                          | "Completed"
                      )
                    }
                    className="w-full rounded-xl border border-[#374151] bg-[#111827] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    disabled={loading}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex flex-col-reverse gap-3 border-t border-[#374151] pt-6 sm:flex-row sm:justify-end">
                  <Link
                    href="/tasks"
                    className="inline-flex items-center justify-center rounded-xl border border-[#374151] px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-[#374151] hover:text-white"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={17} />

                    {loading ? "Creating Task..." : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* Success Modal Popup */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-[#374151] bg-[#1F2937] p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 size={30} />
            </div>
            <h3 className="text-xl font-bold text-white">Task Created!</h3>
            <p className="mt-2 text-sm text-gray-300">
              Your task has been created successfully. Redirecting...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}