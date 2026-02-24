"use client";
import { Store } from "lucide-react";

export default function SettingsHeader({ currentStatus }) {
    return (
        <div className="mb-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Store Automation</h1>
                <p className="text-gray-400 text-sm mt-1">Manage store timings and emergency settings.</p>
            </div>

            <div
                className={`border p-6 rounded-2xl backdrop-blur-md transition-all ${currentStatus
                        ? "bg-green-500/10 border-green-500/20"
                        : "bg-red-500/10 border-red-500/20"
                    }`}
            >
                <div className="flex items-center gap-4">
                    <div
                        className={`p-3 rounded-full ${currentStatus ? "bg-green-500 text-black" : "bg-red-500 text-white"
                            }`}
                    >
                        <Store className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className={`font-bold text-lg ${currentStatus ? "text-green-400" : "text-red-400"}`}>
                            {currentStatus ? "Store is OPEN" : "Store is CLOSED"}
                        </h3>
                        <p className="text-sm text-gray-400">System automatically checks Pakistan Time (PKT).</p>
                    </div>
                </div>
            </div>
        </div>
    );
}