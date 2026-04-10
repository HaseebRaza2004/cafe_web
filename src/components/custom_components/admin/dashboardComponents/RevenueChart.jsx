"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import DashboardDropdown from "./DashboardDropdown";
import DashboardTooltip from "./DashboardToolTip";

// Mock Data
const mockData = [
    { name: "Mon", revenue: 12000 },
    { name: "Tue", revenue: 19000 },
    { name: "Wed", revenue: 15000 },
    { name: "Thu", revenue: 22000 },
    { name: "Fri", revenue: 28000 },
    { name: "Sat", revenue: 35000 },
    { name: "Sun", revenue: 31000 },
];

export default function RevenueChart({ data = mockData }) {
    const [timeRange, setTimeRange] = useState("This Week");

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
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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