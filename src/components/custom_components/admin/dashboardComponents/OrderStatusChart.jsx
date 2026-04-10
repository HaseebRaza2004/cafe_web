"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import DashboardDropdown from "./DashboardDropdown";
import DashboardTooltip from "./DashboardToolTip";

export default function OrderStatusChart({ pending = 0 }) {
    const [timeRange, setTimeRange] = useState("Today");

    const data = [
        { name: "Delivered", value: 124, color: "#22c55e" },
        { name: "Cooking", value: 15, color: "#eab308" },
        { name: "Pending", value: pending || 8, color: "var(--color-gold)" },
        { name: "Cancelled", value: 12, color: "#ef4444" },
    ];

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold text-lg tracking-wider font-display uppercase">
                    Order Status
                </h3>
                <DashboardDropdown
                    options={["Today", "This Week", "This Month"]}
                    value={timeRange}
                    onChange={setTimeRange}
                />
            </div>

            <div className="flex-1 w-full h-62.5 min-h-62.5 relative [&_*:focus]:outline-none [&_.recharts-surface]:outline-none">
                <ResponsiveContainer width="100%" height={250} minWidth={1}>
                    <PieChart>
                        <Tooltip content={<DashboardTooltip />} />
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            style={{ outline: "none" }}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: "none" }} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold text-white">{data.reduce((acc, curr) => acc + curr.value, 0)}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-widest">Total</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
                {data.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-gray-400">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};