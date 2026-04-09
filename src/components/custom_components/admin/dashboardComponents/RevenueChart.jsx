"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Temporary Mock Data (Until Aggregation API is ready)
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
    // Custom Tooltip for Glassmorphism
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl">
                    <p className="text-gray-400 mb-1 text-sm">{label}</p>
                    <p className="text-(--color-gold) font-bold text-lg">
                        Rs {payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold text-lg tracking-wider font-display uppercase">
                    Revenue Trend
                </h3>
                <select className="bg-black/50 text-xs text-gray-400 border border-white/10 rounded-md px-3 py-1 outline-none cursor-pointer">
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>This Year</option>
                </select>
            </div>

            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
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
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="var(--color-gold)"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            activeDot={{ r: 6, fill: "var(--color-gold)", stroke: "#000", strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}