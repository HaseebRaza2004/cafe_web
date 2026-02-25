"use client";
import { Power, MessageSquareWarning } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function GeneralSettings({ settings, setSettings }) {
    return (
        <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md space-y-6">

            {/* Emergency Close Toggle */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <Power className="w-4 h-4 text-red-500" /> Emergency Close
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Force close the shop instantly.</p>
                </div>

                {/* Custom Premium Toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.isForceClosed}
                        onChange={(e) => setSettings({ ...settings, isForceClosed: e.target.checked })}
                    />
                    <div className="w-12 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600 peer-checked:after:bg-white border border-white/10"></div>
                </label>
            </div>

            {/* Global Note */}
            <div>
                <label className="flex items-center gap-2 text-sm font-bold text-(--color-gold) mb-3">
                    <MessageSquareWarning className="w-4 h-4" /> Global Notification Note
                </label>
                <Textarea
                    rows={3}
                    placeholder="Enter message to display on website load..."
                    className="w-full bg-black/50 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold) resize-none"
                    value={settings.generalNote}
                    onChange={(e) => setSettings({ ...settings, generalNote: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-2">
                    Note: This message will popup as an Alert whenever someone visits the website.
                </p>
            </div>
        </div>
    );
}