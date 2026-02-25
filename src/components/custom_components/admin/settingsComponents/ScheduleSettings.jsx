"use client";
import { Clock } from "lucide-react";
import TimeSelector from "./TimeSelector";

export default function ScheduleSettings({ openTime12, closeTime12, handleTimeChange }) {
    return (
        <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md space-y-6">
            <h3 className="text-(--color-gold) font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4" /> Automatic Schedule
            </h3>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <TimeSelector
                    label="OPENING TIME"
                    type="open"
                    timeObj={openTime12}
                    handleTimeChange={handleTimeChange}
                />

                <TimeSelector
                    label="CLOSING TIME"
                    type="close"
                    timeObj={closeTime12}
                    handleTimeChange={handleTimeChange}
                />

            </div>
        </div>
    );
}