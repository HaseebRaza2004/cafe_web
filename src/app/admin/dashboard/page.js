"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import DashboardStats from "@/components/custom_components/admin/dashboardComponents/DashboardStats";
import RevenueChart from "@/components/custom_components/admin/dashboardComponents/RevenueChart";
import OrderStatusChart from "@/components/custom_components/admin/dashboardComponents/OrderStatusChart";
import TopSellersList from "@/components/custom_components/admin/dashboardComponents/TopSellersList";
import TrafficChart from "@/components/custom_components/admin/dashboardComponents/TrafficChart";
import { useToast } from "@/context/ToastContext";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { error: showError, success: showSuccess } = useToast();

  // Fetch analytics data from the API
  const fetchStats = useCallback(
    async (isManual = false) => {
      if (isManual) setLoading(true);

      try {
        const res = await fetch("/api/analytics", { cache: "no-store" });
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to load analytics data.");
        }

        setStats(json.data);
        if (isManual) showSuccess("Dashboard synced successfully!");
      } catch (err) {
        showError(
          err.message || "Network error. Please check your connection.",
        );
      } finally {
        setLoading(false);
      }
    },
    [showError, showSuccess],
  );

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading && !stats) {
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
        <div className="px-4 py-2 bg-(--color-gold)/10 border border-(--color-gold)/30 rounded-full">
          <p className="text-(--color-gold) text-sm font-bold tracking-wider uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-(--color-gold) animate-pulse"></span>
            Live Data
          </p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <DashboardStats stats={stats} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <RevenueChart revenueData={stats?.revenue} />
        </div>

        {/* Order Status */}
        <div className="lg:col-span-1">
          <OrderStatusChart statusData={stats?.orderStatus} />
        </div>
      </div>

      {/* Top Sellers & Traffic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Top Sellers */}
        <TopSellersList topSellersData={stats?.topSellers} />

        {/* Placeholder for GA4 Traffic Chart */}
        <TrafficChart />
      </div>
    </div>
  );
}
