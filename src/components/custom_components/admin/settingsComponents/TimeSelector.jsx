"use client";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function TimeSelector({ label, type, timeObj, handleTimeChange }) {
    return (
        <div className="w-full">
            <Label className="text-xs text-gray-400 block mb-4 font-bold tracking-wider">
                {label}
            </Label>
            <div className="flex items-center gap-2">
                {/* Hour */}
                <Select value={timeObj.hour} onValueChange={(v) => handleTimeChange(type, "hour", v)}>
                    <SelectTrigger className="w-20 h-11 bg-black/50 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold) cursor-pointer">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10 text-white z-9999">
                        {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((h) => (
                            <SelectItem key={h} value={h} className="focus:bg-(--color-gold) focus:text-black cursor-pointer">
                                {h}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <span className="text-white font-bold">:</span>

                {/* Minute */}
                <Select value={timeObj.minute} onValueChange={(v) => handleTimeChange(type, "minute", v)}>
                    <SelectTrigger className="w-20 h-11 bg-black/50 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold) cursor-pointer">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10 text-white z-9999">
                        {["00", "15", "30", "45"].map((m) => (
                            <SelectItem key={m} value={m} className="focus:bg-(--color-gold) focus:text-black cursor-pointer">
                                {m}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Period (AM/PM) */}
                <Select value={timeObj.period} onValueChange={(v) => handleTimeChange(type, "period", v)}>
                    <SelectTrigger className="w-20 h-11 bg-black/50 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold) cursor-pointer">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10 text-white z-9999">
                        <SelectItem value="AM" className="focus:bg-(--color-gold) focus:text-black cursor-pointer">AM</SelectItem>
                        <SelectItem value="PM" className="focus:bg-(--color-gold) focus:text-black cursor-pointer">PM</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}