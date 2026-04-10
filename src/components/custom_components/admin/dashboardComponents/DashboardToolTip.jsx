"use client";

export default function DashboardTooltip({ active, payload, label, isCurrency = false }) {
    if (active && payload && payload.length) {
        const data = payload[0];

        // Smart checks for both AreaChart (Revenue) and PieChart (Status)
        const color = data.payload.color || "var(--color-gold)";
        const title = label || data.name;
        const value = isCurrency
            ? `Rs ${data.value.toLocaleString()}`
            : data.value;

        return (
            <div className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl shadow-2xl outline-none transition-all">
                <p className="text-gray-400 mb-1 text-xs uppercase tracking-wider font-bold">
                    {title}
                </p>
                <p className="font-bold text-lg drop-shadow-md" style={{ color: color }}>
                    {value}
                </p>
            </div>
        );
    }
    return null;
};