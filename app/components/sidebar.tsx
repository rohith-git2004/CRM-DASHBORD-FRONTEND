"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  CheckSquare,
  Settings,
  Menu,
  X,
} from "lucide-react";

import { getUser } from "@/services/auth";

const menus = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Contacts",
    href: "/contacts",
    icon: Users,
  },
  {
    name: "Deals",
    href: "/deals",
    icon: BriefcaseBusiness,
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface UserProfile {
  _id?: string;
  name?: string;
  email?: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loggedInUser = getUser();

    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  // Close mobile sidebar automatically on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const sidebarContent = (
    <>
      {/* Profile Section */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-sm font-bold text-white shadow-md shadow-indigo-500/20 ring-2 ring-white/10">
            <span>
              {(user?.name || "U").charAt(0).toUpperCase()}
            </span>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
          </div>

          <div className="flex flex-col min-w-0">
            <h2 className="truncate text-base font-bold text-white tracking-wide">
              {user?.name || "User"}
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              Online
            </span>
          </div>
        </div>

        {/* Close Button for Mobile Drawer */}
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2 px-3.5 py-5 overflow-y-auto">
        {menus.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-base font-semibold transition-all duration-200 ${
                active
                  ? "bg-indigo-600/90 text-white shadow-lg shadow-indigo-500/25 backdrop-blur-md border border-indigo-500/40"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-white shadow-sm" />
              )}
              <Icon
                size={20}
                className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  active ? "text-white" : "text-slate-400 group-hover:text-white"
                }`}
              />
              <span className="tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Top Header with Profile and Hamburger Bar Icon */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-slate-900/80 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-xs font-bold text-white shadow-md shadow-indigo-500/20 ring-2 ring-white/10">
            <span>
              {(user?.name || "U").charAt(0).toUpperCase()}
            </span>
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
          </div>
          <h2 className="truncate text-sm font-bold text-white tracking-wide">
            {user?.name || "User"}
          </h2>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors border border-white/10"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Mobile Sidebar Drawer (Slides from Left) */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-900 border-r border-white/10 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex sticky top-0 z-30 h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-slate-900/70 backdrop-blur-xl transition-all duration-300">
        {sidebarContent}
      </aside>
    </>
  );
}