"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function OrderStatusChart({ pending = 0 }) {
    // Mock Data (will use real data later)
    const data = [
        { name: "Delivered", value: 124, color: "#22c55e" }, // Green
        { name: "Cooking", value: 15, color: "#eab308" }, // Yellow
        { name: "Pending", value: pending || 8, color: "var(--color-gold)" }, // Gold
        { name: "Cancelled", value: 12, color: "#ef4444" }, // Red
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg shadow-xl">
                    <p className="font-bold" style={{ color: payload[0].payload.color }}>
                        {payload[0].name}: {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl h-full flex flex-col">
            <h3 className="text-white font-bold text-lg tracking-wider font-display uppercase mb-4">
                Order Status
            </h3>

            <div className="flex-1 min-h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip content={<CustomTooltip />} />
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {/* Inner Text overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold text-white">{data.reduce((acc, curr) => acc + curr.value, 0)}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-widest">Total</span>
                </div>
            </div>

            {/* Legend */}
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
}