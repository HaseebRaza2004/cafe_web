"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import DashboardStats from "@/components/custom_components/admin/dashboardComponents/DashboardStats";
import RevenueChart from "@/components/custom_components/admin/dashboardComponents/RevenueChart";
import OrderStatusChart from "@/components/custom_components/admin/dashboardComponents/OrderStatusChart";
import TopSellersList from "@/components/custom_components/admin/dashboardComponents/TopSellersList";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      try {
        const res = await fetch("/api/analytics", { cache: "no-store" });
        const json = await res.json();
        if (isMounted && json.success) {
          setStats(json.data);
        }
      } catch (err) {
        console.error("Dashboard Sync Failed:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-(--color-gold) animate-spin mb-4" />
        <p className="text-gray-400 tracking-widest uppercase text-sm font-medium animate-pulse">
          Loading Analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 w-full pb-20">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-display uppercase">
            Business Intelligence
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-2">
            Real-time insights and performance metrics.
          </p>
        </div>
        <div className="px-4 py-2 bg-gold/10 border border-gold/20 rounded-full">
          <p className="text-(--color-gold) text-sm font-bold tracking-wider uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-(--color-gold) animate-pulse"></span>
            Live Data
          </p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <DashboardStats stats={stats} />

      {/* Charts Row  */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* Order Status */}
        <div className="lg:col-span-1">
          <OrderStatusChart pending={stats?.pendingOrders} />
        </div>
      </div>

      {/* Top Sellers & Traffic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <TopSellersList />

        {/* Placeholder for GA4 Traffic Chart (To be implemented) */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center min-h-87.5">
          <h3 className="text-gray-400 font-display text-xl uppercase tracking-widest mb-2">
            Live Traffic
          </h3>
          <p className="text-gray-600 text-sm text-center">
            Google Analytics (GA4) Integration Pending...
          </p>
        </div>
      </div>
    </div>
  );
};