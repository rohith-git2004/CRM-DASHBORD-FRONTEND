"use client";

import { useEffect, useState } from "react";

import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";

import {
  DollarSign,
  TrendingUp,
  CircleCheck,
  CircleX,
} from "lucide-react";

import { Deal, getDeals } from "@/services/deals";

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const data = await getDeals();
      setDeals(data);
    } catch (error) {
      console.error("Deal Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const newDeals = deals.filter(
    (deal: Deal) => deal.stage === "New"
  );

  const negotiationDeals = deals.filter(
    (deal: Deal) => deal.stage === "Negotiation"
  );

  const wonDeals = deals.filter(
    (deal: Deal) => deal.stage === "Won"
  );

  const lostDeals = deals.filter(
    (deal: Deal) => deal.stage === "Lost"
  );

  const DealCard = ({ deal }: { deal: Deal }) => {
    return (
      <div className="rounded-xl border border-[#374151] bg-[#1F2937] p-4 hover:border-blue-500 transition">

        <h3 className="font-semibold text-white">
          {deal.company}
        </h3>

        <p className="mt-2 font-bold text-blue-400">
          ₹{deal.value.toLocaleString()}
        </p>

        <p className="mt-3 text-sm text-gray-400">
          {deal.person}
        </p>

      </div>
    );
  };

  const DealColumn = ({
    title,
    icon,
    items,
  }: {
    title: string;
    icon: React.ReactNode;
    items: Deal[];
  }) => (
    <div>

      <div className="mb-5 flex items-center gap-2">

        {icon}

        <h2 className="font-semibold text-white">
          {title}
        </h2>

      </div>

      <div className="space-y-4">

        {items.length === 0 ? (
          <div className="rounded-xl border border-[#374151] bg-[#1F2937] p-5 text-center text-gray-400">
            No Deals Found
          </div>
        ) : (
          items.map((deal) => (
            <DealCard
              key={deal._id}
              deal={deal}
            />
          ))
        )}

      </div>

    </div>
  );

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-[#111827]">

      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0">

        <div className="hidden md:block">
          <Topbar />
        </div>

        <main className="p-4 sm:p-6 md:p-8">

          <h1 className="mb-8 text-3xl font-bold text-white">
            Deals
          </h1>

          {loading ? (
            <div className="py-20 text-center text-white">
              Loading Deals...
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">

              <DealColumn
                title="New"
                icon={<DollarSign className="text-blue-400" />}
                items={newDeals}
              />

              <DealColumn
                title="Negotiation"
                icon={<TrendingUp className="text-yellow-400" />}
                items={negotiationDeals}
              />

              <DealColumn
                title="Won"
                icon={<CircleCheck className="text-green-400" />}
                items={wonDeals}
              />

              <DealColumn
                title="Lost"
                icon={<CircleX className="text-red-400" />}
                items={lostDeals}
              />

            </div>
          )}

        </main>

      </div>

    </div>
  );
}