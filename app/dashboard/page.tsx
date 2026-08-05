"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";
import StatCard from "../components/statCard";
import { Users, Rocket, Phone } from "lucide-react";
import { getDashboardStats } from "@/services/dashboard";
import { getCustomers, Customer } from "@/services/customers";

interface DashboardStats {
  totalCustomers: number;
  activeLeads: number;
  contactedThisWeek: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    activeLeads: 0,
    contactedThisWeek: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const data = await getDashboardStats();
      let customerCount = data?.totalCustomers ?? 0;

      // Fallback if backend dashboard stats route returns 0 or missing
      if (!customerCount) {
        try {
          const customers: Customer[] = await getCustomers();
          if (Array.isArray(customers)) {
            customerCount = customers.length;
          }
        } catch (err) {
          console.warn("Could not fetch customer count fallback:", err);
        }
      }

      setStats({
        totalCustomers: customerCount,
        activeLeads: data?.activeLeads ?? 0,
        contactedThisWeek: data?.contactedThisWeek ?? 0,
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-slate-950 text-slate-100 font-sans antialiased overflow-x-hidden">
      {/* Background Glass Ambient Lights */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[140px]" />
      <div className="pointer-events-none fixed top-1/2 -right-40 h-[500px] w-[500px] rounded-full bg-purple-600/15 blur-[140px]" />
      <div className="pointer-events-none fixed -bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />

      {/* Sidebar (Includes mobile top header automatically) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar - Hidden on mobile so it matches Contacts page layout behavior */}
        <div className="hidden md:block">
          <Topbar />
        </div>

        {/* Dashboard Main Container */}
        <main className="flex-1 p-4 sm:p-6 md:p-10 space-y-8 max-w-7xl w-full mx-auto">
          {/* Header Section */}
          <div className="flex flex-col gap-1 pt-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-slate-400">
              Welcome back! Here's an overview of your CRM performance today.
            </p>
          </div>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="transition-transform duration-300 hover:-translate-y-1">
              <StatCard
                title="Total Customers"
                value={
                  loading
                    ? "..."
                    : stats.totalCustomers.toLocaleString()
                }
                icon={Users}
                iconBg="#1E3A8A"
                iconColor="#60A5FA"
                percentage="+3.2%"
              />
            </div>

            <div className="transition-transform duration-300 hover:-translate-y-1">
              <StatCard
                title="Active Leads"
                value={
                  loading
                    ? "..."
                    : stats.activeLeads.toLocaleString()
                }
                icon={Rocket}
                iconBg="#14532D"
                iconColor="#4ADE80"
                percentage="+5.8%"
              />
            </div>

            <div className="transition-transform duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <StatCard
                title="Contacted This Week"
                value={
                  loading
                    ? "..."
                    : stats.contactedThisWeek.toLocaleString()
                }
                icon={Phone}
                iconBg="#7C2D12"
                iconColor="#FB923C"
                percentage="-1.3%"
                positive={false}
              />
            </div>
          </div>

          {/* Recent Activity Container */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-white">
              Recent Activity
            </h2>

            <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center text-sm text-slate-400">
              Activity data will appear here.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}