"use client";
import { CheckCircle2, ChefHat, MapPin, XCircle } from "lucide-react";

// Individual Step UI
const TrackStep = ({ title, icon: Icon, isCompleted, isActive }) => (
    <div className="flex flex-col items-center relative z-10 w-24">
        <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 shadow-lg border-2 
      ${isCompleted || isActive
                    ? "bg-[#111] border-(--color-gold) text-(--color-gold) shadow-[0_0_15px_rgba(197,160,89,0.5)]"
                    : "bg-black border-white/20 text-gray-500"
                }`}
        >
            <Icon className={`w-5 h-5 ${isActive ? "animate-pulse" : ""}`} />
        </div>
        <p className={`mt-3 text-xs md:text-sm font-bold text-center transition-colors duration-500 tracking-wider uppercase
      ${isCompleted || isActive ? "text-white" : "text-gray-500"}
    `}>
            {title}
        </p>
    </div>
);

export default function OrderTracker({ status }) {
    const isCancelled = status === "Cancelled";
    const step2Done = status === "Cooking" || status === "Delivered";
    const step3Done = status === "Delivered";

    // 🔴 If Cancelled: Show ONLY Cancel Note (No Line, No Steps)
    if (isCancelled) {
        return (
            <div className="w-full max-w-2xl px-4 mb-10 print:hidden animate-in fade-in zoom-in-95 duration-700 delay-100">
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                    <XCircle className="w-16 h-16 text-red-500 mb-4 animate-pulse" />
                    <h3 className="text-lg md:text-xl font-bold text-red-500 uppercase tracking-widest">Order Cancelled</h3>
                    <p className="text-red-400/80 mt-2 text-xs md:text-sm max-w-md">Your order has been cancelled by the management. Please contact support for more details.</p>
                </div>
            </div>
        );
    }

    // 🟢 Normal Flow (Secured -> Cooking -> Delivered)
    return (
        <div className="w-full max-w-2xl px-4 mb-12 print:hidden animate-in fade-in zoom-in-95 duration-700 delay-100">
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden">

                {/* 🌟 Thin Solid Gold Line */}
                <div className="absolute top-13.75 left-[15%] right-[15%] h-0.5 bg-white/10 hidden sm:block rounded-full">
                    <div
                        className={`h-full bg-(--color-gold) transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(197,160,89,0.8)]
              ${step3Done ? "w-full" : step2Done ? "w-1/2" : "w-0"}
            `}
                    />
                </div>

                <div className="flex justify-between items-start sm:px-8 relative z-10">
                    <TrackStep title="Secured" icon={CheckCircle2} isCompleted={true} isActive={status === "Pending"} />
                    <TrackStep title="Cooking" icon={ChefHat} isCompleted={step2Done} isActive={status === "Cooking"} />
                    <TrackStep title="Delivered" icon={MapPin} isCompleted={step3Done} isActive={status === "Delivered"} />
                </div>
            </div>
        </div>
    );
}