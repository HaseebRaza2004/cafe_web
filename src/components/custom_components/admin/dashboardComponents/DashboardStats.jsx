"use client";

import { useMemo } from "react";
import { TrendingUp, ShoppingBag, UtensilsCrossed, Target } from "lucide-react";
import StatCard from "@/components/custom_components/admin/StatCard";

export default function DashboardStats({ stats }) {

    const calculatedStats = useMemo(() => {
        const revenue = stats?.totalRevenue || 0;
        const orders = stats?.totalOrders || 0;
        const items = stats?.totalProducts || 0;

        const aov = orders > 0 ? (revenue / orders).toFixed(0) : 0;

        let completionRate = "0%";
        if (orders > 0 && stats?.orderStatus?.["This Month"]) {
            const deliveredObj = stats.orderStatus["This Month"].find(s => s.name === "Delivered");
            const deliveredCount = deliveredObj ? deliveredObj.value : 0;
            const rate = ((deliveredCount / orders) * 100).toFixed(1);
            completionRate = `${rate}%`;
        }

        return { revenue, orders, items, aov, completionRate };
    }, [stats]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Total Revenue"
                value={`Rs ${calculatedStats.revenue.toLocaleString()}`}
                icon={TrendingUp}
                color="text-(--color-gold)"
                bg="bg-(--color-gold)/10"
            />
            <StatCard
                title="Total Orders"
                value={calculatedStats.orders.toLocaleString()}
                icon={ShoppingBag}
                color="text-white"
                bg="bg-white/10"
            />
            <StatCard
                title="Avg. Order Value"
                value={`Rs ${calculatedStats.aov}`}
                icon={Target}
                color="text-blue-400"
                bg="bg-blue-400/10"
            />
            <StatCard
                title="Completion Rate"
                value={calculatedStats.completionRate}
                icon={UtensilsCrossed}
                color="text-green-400"
                bg="bg-green-400/10"
            />
        </div>
    );
};