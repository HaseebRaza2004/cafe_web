"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, ChevronRight, X } from "lucide-react";

export default function OrderTrackerPill() {
    const [tracker, setTracker] = useState({
        orderId: null,
        status: null,
        isVisible: false,
    });

    const router = useRouter();

    // Fetch and Poll Logic
    useEffect(() => {
        if (typeof window === "undefined") return;

        const storedOrderId = localStorage.getItem("active_order");
        if (!storedOrderId) return;

        let isMounted = true;

        const checkStatus = async () => {
            try {
                const res = await fetch(`/api/orders/${storedOrderId}`, {
                    cache: "no-store",
                });
                const json = await res.json();

                if (!isMounted) return;

                if (json.success && json.data) {
                    setTracker({
                        orderId: storedOrderId,
                        status: json.data.status,
                        isVisible: true,
                    });
                } else {
                    localStorage.removeItem("active_order");
                    setTracker((prev) => ({ ...prev, isVisible: false }));
                }
            } catch (error) {
                console.error("Tracker Sync Failed", error);
            }
        };

        checkStatus();

        const intervalId = setInterval(checkStatus, 20000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, []);

    // Auto-Cleanup (Destroy after 5 mins if Delivered or Cancelled)
    useEffect(() => {
        if (!tracker.isVisible) return;

        if (tracker.status === "Delivered" || tracker.status === "Cancelled") {
            const cleanupTimer = setTimeout(() => {
                localStorage.removeItem("active_order");
                setTracker((prev) => ({ ...prev, isVisible: false }));
            }, 5 * 60 * 1000); // 5 minutes

            return () => clearTimeout(cleanupTimer);
        }
    }, [tracker.status, tracker.isVisible]);

    if (!tracker.isVisible || !tracker.orderId || !tracker.status) return null;

    const isActive = tracker.status === "Pending" || tracker.status === "Cooking";
    const isDelivered = tracker.status === "Delivered";
    const isCancelled = tracker.status === "Cancelled";

    const closePill = (e) => {
        e.stopPropagation();
        setTracker((prev) => ({ ...prev, isVisible: false }));
    };

    return (
        <div
            onClick={() => router.push(`/order-success/${tracker.orderId}`)}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-full shadow-2xl cursor-pointer border backdrop-blur-md transition-all animate-in slide-in-from-bottom-10 fade-in duration-500 hover:scale-105 ${isActive
                    ? "bg-black/80 border-(--color-gold) shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                    : isDelivered
                        ? "bg-green-950/80 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                        : "bg-red-950/80 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                }`}
        >
            {isActive && <Loader2 className="w-5 h-5 text-(--color-gold) animate-spin" />}
            {isDelivered && <CheckCircle2 className="w-5 h-5 text-green-400" />}
            {isCancelled && <XCircle className="w-5 h-5 text-red-400" />}

            <div className="flex flex-col pr-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                    Order #{tracker.orderId.slice(-6)}
                </span>
                <span
                    className={`text-sm font-semibold ${isActive ? "text-(--color-gold)" : isDelivered ? "text-green-400" : "text-red-400"
                        }`}
                >
                    {isActive ? `${tracker.status}...` : tracker.status}
                </span>
            </div>

            {isCancelled ? (
                <button
                    onClick={closePill}
                    className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                    aria-label="Close tracking pill"
                >
                    <X className="w-4 h-4 text-gray-400" />
                </button>
            ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
        </div>
    );
};