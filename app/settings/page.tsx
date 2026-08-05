"use client";

import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";
import { Settings, Sparkles } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-[#111827]">
      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0">
        <div className="hidden md:block">
          <Topbar />
        </div>

        <main className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-3xl rounded-3xl border border-[#374151] bg-[#1F2937] p-6 sm:p-12 text-center shadow-2xl">

            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-blue-500/10">
              <Settings className="h-12 w-12 text-blue-400" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Settings
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-300">
              This section is currently under development.
              We're building a powerful settings experience that will
              allow you to personalize your CRM, manage your account,
              configure notifications, security, preferences, and much more.
            </p>

            <div className="mt-10 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6">
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="h-6 w-6 text-blue-400" />

                <h2 className="text-xl font-semibold text-blue-300">
                  Coming Soon
                </h2>
              </div>

              <p className="mt-4 text-sm sm:text-base text-gray-300">
                Thank you for using our CRM.
                We're continuously improving the platform to provide
                a better experience. Stay tuned for future updates.
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}