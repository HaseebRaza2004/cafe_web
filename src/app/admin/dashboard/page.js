"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  ShoppingBag,
  DollarSign,
  UtensilsCrossed,
  AlertCircle,
} from "lucide-react";
import StatCard from "@/components/custom_components/admin/StatCard";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();
        if (json.success) setStats(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 text-(--color-gold) animate-spin" />
      </div>
    );

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-400 text-sm mt-1">Overview of your business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`Rs ${stats?.totalRevenue || 0}`}
          icon={DollarSign}
          color="text-green-400"
          bg="bg-green-400/10"
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={ShoppingBag}
          color="text-blue-400"
          bg="bg-blue-400/10"
        />
        <StatCard
          title="Menu Items"
          value={stats?.totalProducts || 0}
          icon={UtensilsCrossed}
          color="text-purple-400"
          bg="bg-purple-400/10"
        />
        <StatCard
          title="Pending Orders"
          value={stats?.pendingOrders || 0}
          icon={AlertCircle}
          color="text-yellow-400"
          bg="bg-yellow-400/10"
        />
      </div>

      {/* Quick Links or Recent Activity can go here */}
      <div className="p-6 bg-black/40 border border-white/10 rounded-xl">
        <h3 className="text-white font-bold mb-2">System Status</h3>
        <p className="text-green-500 text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          All Systems Operational
        </p>
      </div>
    </div>
  );
}
