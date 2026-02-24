"use client";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const TimeSelector = ({ label, type, timeObj, handleTimeChange }) => (
    <div className="w-full">
        <Label className="text-xs text-gray-400 block mb-3 font-bold tracking-wider">
            {label}
        </Label>
        <div className="flex items-center gap-2">
            {/* Hour */}
            <Select value={timeObj.hour} onValueChange={(v) => handleTimeChange(type, "hour", v)}>
                <SelectTrigger className="w-20 h-11 bg-black/50 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10 text-white z-9999">
                    {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((h) => (
                        <SelectItem key={h} value={h} className="focus:bg-(--color-gold) focus:text-black">
                            {h}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <span className="text-white font-bold">:</span>

            {/* Minute */}
            <Select value={timeObj.minute} onValueChange={(v) => handleTimeChange(type, "minute", v)}>
                <SelectTrigger className="w-20 h-11 bg-black/50 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10 text-white z-9999">
                    {["00", "15", "30", "45"].map((m) => (
                        <SelectItem key={m} value={m} className="focus:bg-(--color-gold) focus:text-black">
                            {m}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Period (AM/PM) */}
            <Select value={timeObj.period} onValueChange={(v) => handleTimeChange(type, "period", v)}>
                <SelectTrigger className="w-20 h-11 bg-black/50 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10 text-white z-9999">
                    <SelectItem value="AM" className="focus:bg-(--color-gold) focus:text-black">AM</SelectItem>
                    <SelectItem value="PM" className="focus:bg-(--color-gold) focus:text-black">PM</SelectItem>
                </SelectContent>
            </Select>
        </div>
    </div>
);

// MAIN COMPONENT
export default function ScheduleSettings({ openTime12, closeTime12, handleTimeChange }) {
    return (
        <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md space-y-6">
            <h3 className="text-(--color-gold) font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4" /> Automatic Schedule
            </h3>
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