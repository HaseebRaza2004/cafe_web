"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Activity, Loader2, AlertCircle } from "lucide-react";
import DashboardDropdown from "./DashboardDropdown";
import DashboardTooltip from "./DashboardToolTip"; // Tumhara existing tooltip

export default function TrafficChart() {
    const [timeRange, setTimeRange] = useState("This Week");
    const [trafficData, setTrafficData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMock, setIsMock] = useState(false); // To show "Setup Needed" warning

    const fetchTraffic = useCallback(async (range) => {
        setLoading(true);
        try {
            // Passing the range to the API so Google only calculates what's needed
            const res = await fetch(`/api/traffic?range=${range}`, { cache: "no-store" });
            const json = await res.json();

            if (json.success) {
                setTrafficData(json.data);
                setIsMock(json.isMock);
            }
        } catch (error) {
            console.error("Traffic fetch error", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch data whenever timeRange changes
    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            fetchTraffic(timeRange);
        }

        return () => { isMounted = false; };
    }, [timeRange, fetchTraffic]);

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl h-full flex flex-col relative">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <Activity className="w-6 h-6 text-blue-400" />
                        <h3 className="text-white font-bold text-lg tracking-wider font-display uppercase">
                            Website Traffic
                        </h3>
                    </div>
                    {/* Warning badge if GA4 keys are missing */}
                    {isMock && !loading && (
                        <p className="text-[10px] text-orange-400 mt-1 flex items-center gap-1 uppercase tracking-widest font-bold">
                            <AlertCircle className="w-3 h-3" /> GA4 Setup Required (Showing Demo Data)
                        </p>
                    )}
                </div>

                <DashboardDropdown
                    options={["This Week", "This Month"]} // Excluded Year to keep Bar Chart clean, add if needed
                    value={timeRange}
                    onChange={setTimeRange}
                />
            </div>

            <div className="flex-1 w-full h-62.5 min-h-62.5 relative [&_*:focus]:outline-none [&_.recharts-surface]:outline-none">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin opacity-50" />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={250} minWidth={1}>
                        <BarChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />

                            <Tooltip
                                content={<DashboardTooltip />}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />

                            <Bar
                                name="Page Views"
                                dataKey="views"
                                fill="rgba(59, 130, 246, 0.8)" // Blue-500
                                radius={[4, 4, 0, 0]}
                                barSize={20}
                            />
                            <Bar
                                name="Unique Visitors"
                                dataKey="visitors"
                                fill="var(--color-gold)"
                                radius={[4, 4, 0, 0]}
                                barSize={20}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}