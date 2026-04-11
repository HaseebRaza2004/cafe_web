"use client";

import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import DashboardDropdown from "./DashboardDropdown";
import DashboardTooltip from "./DashboardToolTip";

export default function RevenueChart({ revenueData }) {
    const [timeRange, setTimeRange] = useState("This Week");

    // Memoized chart data with future data handling
    const chartData = useMemo(() => {
        if (!revenueData || !revenueData[timeRange]) return [];

        const rawData = revenueData[timeRange];
        const now = new Date();

        return rawData.map((item, index) => {
            let isFuture = false;

            if (timeRange === "This Week") {
                const currentDayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1;
                isFuture = index > currentDayIndex;
            }
            else if (timeRange === "This Month") {
                const currentDateIndex = now.getDate() - 1;
                isFuture = index > currentDateIndex;
            }
            else if (timeRange === "This Year") {
                const currentMonthIndex = now.getMonth();
                isFuture = index > currentMonthIndex;
            }

            return {
                ...item,
                revenue: isFuture ? null : item.revenue
            };
        });
    }, [revenueData, timeRange]);

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold text-lg tracking-wider font-display uppercase">
                    Revenue Trend
                </h3>

                <DashboardDropdown
                    options={["This Week", "This Month", "This Year"]}
                    value={timeRange}
                    onChange={setTimeRange}
                />
            </div>

            <div className="flex-1 w-full h-75 min-h-75 [&_*:focus]:outline-none [&_.recharts-surface]:outline-none">
                <ResponsiveContainer width="100%" height={300} minWidth={1}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-gold)" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="var(--color-gold)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Rs ${val / 1000}k`} />
                        <Tooltip content={<DashboardTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="var(--color-gold)"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            activeDot={{ r: 6, fill: "var(--color-gold)", stroke: "#000", strokeWidth: 2, outline: "none" }}
                            style={{ outline: "none" }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};