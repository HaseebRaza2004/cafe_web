"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Activity, Loader2, BarChart3 } from "lucide-react";
import DashboardDropdown from "./DashboardDropdown";
import DashboardTooltip from "./DashboardToolTip";
import { useToast } from "@/context/ToastContext";

export default function TrafficChart() {
    const [timeRange, setTimeRange] = useState("This Week");
    const [trafficData, setTrafficData] = useState([]);
    const [loading, setLoading] = useState(true);

    const { error: showError } = useToast();

    const fetchTraffic = useCallback(async (range) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/traffic?range=${range}`, { cache: "no-store" });
            const json = await res.json();

            if (!res.ok || !json.success) {
                throw new Error(json.error || "Failed to load traffic data.");
            }

            setTrafficData(json.data || []);
        } catch (err) {
            showError(err.message || "Network error. Failed to sync GA4.");
            setTrafficData([]);
        } finally {
            setLoading(false);
        }
    }, [showError]);

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            fetchTraffic(timeRange);
        }

        return () => { isMounted = false; };
    }, [timeRange, fetchTraffic]);

    // Memoized chart data with Past and Future data handling
    const chartData = useMemo(() => {
        const now = new Date();
        const result = [];

        const normalizeDate = (d) => d.toLocaleDateString("en-US", { day: "numeric", month: "short" });

        if (timeRange === "This Week") {
            const day = now.getDay();
            const diff = now.getDate() - day + (day === 0 ? -6 : 1);
            const monday = new Date(now.getFullYear(), now.getMonth(), diff);

            for (let i = 0; i < 7; i++) {
                const currentDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
                const targetName = normalizeDate(currentDate);

                const existing = trafficData?.find(d => d.name === targetName);

                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const isFuture = currentDate > today;

                const daysStr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                result.push({
                    name: daysStr[currentDate.getDay()],
                    views: isFuture ? null : (existing ? existing.views : 0),
                    visitors: isFuture ? null : (existing ? existing.visitors : 0),
                });
            }
        } else if (timeRange === "This Month") {
            const year = now.getFullYear();
            const month = now.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let i = 1; i <= daysInMonth; i++) {
                const currentDate = new Date(year, month, i);
                const targetName = normalizeDate(currentDate);

                const existing = trafficData?.find(d => d.name === targetName);

                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const isFuture = currentDate > today;

                result.push({
                    name: `${i}`,
                    views: isFuture ? null : (existing ? existing.views : 0),
                    visitors: isFuture ? null : (existing ? existing.visitors : 0),
                });
            }
        }

        return result;
    }, [trafficData, timeRange]);

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl h-full flex flex-col relative">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                    <Activity className="w-6 h-6 text-blue-400" />
                    <h3 className="text-white font-bold text-lg tracking-wider font-display uppercase">
                        Website Traffic
                    </h3>
                </div>

                <DashboardDropdown
                    options={["This Week", "This Month"]}
                    value={timeRange}
                    onChange={setTimeRange}
                />
            </div>

            <div className="flex-1 w-full min-h-62.5 relative [&_*:focus]:outline-none [&_.recharts-surface]:outline-none">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin opacity-50" />
                    </div>
                ) : trafficData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250} minWidth={1}>
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                            <Tooltip
                                content={<DashboardTooltip />}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />

                            <Bar
                                name="Page Views"
                                dataKey="views"
                                fill="rgba(59, 130, 246, 0.8)" // Blue
                                radius={[4, 4, 0, 0]}
                                barSize={20}
                                minPointSize={3}
                            />
                            <Bar
                                name="Unique Visitors"
                                dataKey="visitors"
                                fill="var(--color-gold)" // Gold
                                radius={[4, 4, 0, 0]}
                                barSize={20}
                                minPointSize={3}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    //  HANDLING: No data vs. Loading 
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-50">
                        <BarChart3 className="w-10 h-10 text-gray-500 mb-3" />
                        <p className="text-gray-400 font-medium text-sm">No traffic data recorded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}