"use client";

import { useState } from "react";
import { Bell, Search, Power, AlertCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    // Remove login token
    localStorage.removeItem("token");

    // Redirect to login page
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 sm:h-20 w-full items-center justify-between gap-4 border-b border-white/10 bg-slate-900/70 px-6 sm:px-8 backdrop-blur-xl transition-all duration-300">
        {/* Search Container with internal spacing */}
        <div className="flex-1 max-w-xl">
          <div className="group relative flex items-center w-full">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 z-10 text-slate-400 transition-colors group-focus-within:text-indigo-400"
            />

            <input
              type="text"
              placeholder="Search CRM..."
              className="h-10 sm:h-11 w-full rounded-xl border border-white/10 bg-slate-800/50 pl-10 pr-4 text-sm sm:text-base text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-indigo-500/50 focus:bg-slate-800/80 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* Notification */}
          <button
            aria-label="Notifications"
            className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-800/50 text-slate-300 transition-all duration-200 hover:bg-slate-800 hover:text-white active:scale-95"
          >
            <Bell size={18} className="sm:w-5 sm:h-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-slate-900 animate-pulse"></span>
          </button>

          {/* Rounded Power/Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            aria-label="Logout"
            title="Logout"
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-md shadow-rose-600/10 transition-all duration-200 hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-lg hover:shadow-rose-600/30 active:scale-95"
          >
            <Power size={18} className="sm:w-5 sm:h-5 shrink-0" />
          </button>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="flex w-full max-w-sm flex-col rounded-2xl border border-slate-800 bg-[#161b22] p-6 shadow-2xl transition-all animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-400 ring-4 ring-rose-500/10">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Confirm Logout</h3>
                  <p className="text-xs text-slate-400">End your current session</p>
                </div>
              </div>

              <button
                onClick={() => setShowLogoutModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-4 text-sm text-slate-300">
              Are you sure you want to logout? You will need to sign back in to access your account.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-800/80 pt-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-700 hover:text-white active:scale-95"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-rose-600/25 transition-all hover:bg-rose-500 active:scale-95"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}