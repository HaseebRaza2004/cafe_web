"use client";

import { BellRing, BellOff, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminOrdersHeader({
    alertsEnabled,
    toggleAlerts,
    handleExportCSV,
}) {
    return (
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-8 bg-black/40 p-6 rounded-2xl border border-white/10 shadow-lg">

            <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-display uppercase">
                    Order Command Center
                </h1>
                <p className="text-gray-400 text-sm md:text-base mt-2 flex items-center gap-2">
                    <span className="relative flex h-3 w-3 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    Real-time synchronization active
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 w-full lg:w-64 shrink-0">
                <Button
                    variant=""
                    onClick={toggleAlerts}
                    className={`w-full min-h-12 uppercase tracking-widest duration-400 hover:scale-105 font-bold text-lg transition-all cursor-pointer ${alertsEnabled
                        ? "bg-green-500/10 border-green-500/50 text-green-400 border"
                        : "bg-(--color-gold) text-black hover:bg-(--color-gold-dark) border-none"
                        }`}
                >
                    {alertsEnabled ? (
                        <BellRing className="w-5 h-5 mr-2 md:mr-0.5 animate-pulse shrink-0" />
                    ) : (
                        <BellOff className="w-5 h-5 mr-2 md:mr-0.5 shrink-0" />
                    )}
                    {alertsEnabled ? "Alerts ON" : "Enable Alerts"}
                </Button>

                <Button
                    onClick={handleExportCSV}
                    className="w-full min-h-12 bg-white/90 hover:bg-gold hover:text-black text-gold-dark uppercase tracking-widest font-bold border-none rounded-md text-lg duration-400 hover:scale-105 transition-all cursor-pointer"
                >
                    <Download className="w-5 h-5 mr-2 md:mr-0.5 shrink-0" /> Export CSV
                </Button>
            </div>

        </div>
    );
}