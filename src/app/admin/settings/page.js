"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Save,
  Store,
  Clock,
  Power,
  MessageSquareWarning,
} from "lucide-react";
import { useToast } from "@/context/ToastContext"; 

export default function SettingsPage() {
  const toast = useToast(); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(false);

  const [settings, setSettings] = useState({
    openingTime: "16:00",
    closingTime: "02:00",
    isForceClosed: false,
    generalNote: "",
  });

  const [openTime12, setOpenTime12] = useState({
    hour: "04",
    minute: "00",
    period: "PM",
  });
  const [closeTime12, setCloseTime12] = useState({
    hour: "02",
    minute: "00",
    period: "AM",
  });

  // Time conversion helpers 
  const to12h = (time24) => {
    if (!time24) return { hour: "12", minute: "00", period: "AM" };
    const [h, m] = time24.split(":");
    let hour = parseInt(h);
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return { hour: String(hour).padStart(2, "0"), minute: m, period };
  };

  const to24h = (hour, minute, period) => {
    let h = parseInt(hour);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${minute}`;
  };

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();

        if (json.success) {
          const data = {
            openingTime: json.data.openingTime || "16:00",
            closingTime: json.data.closingTime || "02:00",
            isForceClosed: json.data.isForceClosed || false,
            generalNote: json.data.generalNote || "",
          };
          setSettings(data);
          setCurrentStatus(json.data.isOpen);
          setOpenTime12(to12h(data.openingTime));
          setCloseTime12(to12h(data.closingTime));
        }
      } catch (err) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [toast]);

  const handleTimeChange = (type, field, value) => {
    if (type === "open") {
      const updated = { ...openTime12, [field]: value };
      setOpenTime12(updated);
      setSettings((prev) => ({
        ...prev,
        openingTime: to24h(updated.hour, updated.minute, updated.period),
      }));
    } else {
      const updated = { ...closeTime12, [field]: value };
      setCloseTime12(updated);
      setSettings((prev) => ({
        ...prev,
        closingTime: to24h(updated.hour, updated.minute, updated.period),
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success("Settings saved successfully!");
        window.location.reload();
      } else {
        toast.error("Failed to save settings.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-(--color-gold) animate-spin" />
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <h1 className="text-3xl font-bold text-white mb-8">Store Automation</h1>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Status Card */}
        <div
          className={`border p-6 rounded-2xl backdrop-blur-md transition-all ${
            currentStatus
              ? "bg-green-500/10 border-green-500/20"
              : "bg-red-500/10 border-red-500/20"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-full ${
                currentStatus
                  ? "bg-green-500 text-black"
                  : "bg-red-500 text-white"
              }`}
            >
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3
                className={`font-bold text-lg ${
                  currentStatus ? "text-green-400" : "text-red-400"
                }`}
              >
                {currentStatus ? "Store is OPEN" : "Store is CLOSED"}
              </h3>
              <p className="text-sm text-gray-400">
                System automatically checks Pakistan Time.
              </p>
            </div>
          </div>
        </div>

        {/* Time Schedule (Same as before) */}
        <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md space-y-6">
          <h3 className="text-(--color-gold) font-bold text-sm uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4" /> Automatic Schedule (PKT)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Opening Time */}
            <div>
              <label className="text-xs text-gray-400 block mb-2 font-bold">
                OPENING TIME
              </label>
              <div className="flex gap-2">
                <select
                  className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none w-20 text-center"
                  value={openTime12.hour}
                  onChange={(e) =>
                    handleTimeChange("open", "hour", e.target.value)
                  }
                >
                  {Array.from({ length: 12 }, (_, i) =>
                    String(i + 1).padStart(2, "0")
                  ).map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                <span className="text-white self-center">:</span>
                <select
                  className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none w-20 text-center"
                  value={openTime12.minute}
                  onChange={(e) =>
                    handleTimeChange("open", "minute", e.target.value)
                  }
                >
                  {["00", "15", "30", "45"].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none w-20"
                  value={openTime12.period}
                  onChange={(e) =>
                    handleTimeChange("open", "period", e.target.value)
                  }
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
            {/* Closing Time */}
            <div>
              <label className="text-xs text-gray-400 block mb-2 font-bold">
                CLOSING TIME
              </label>
              <div className="flex gap-2">
                <select
                  className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none w-20 text-center"
                  value={closeTime12.hour}
                  onChange={(e) =>
                    handleTimeChange("close", "hour", e.target.value)
                  }
                >
                  {Array.from({ length: 12 }, (_, i) =>
                    String(i + 1).padStart(2, "0")
                  ).map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                <span className="text-white self-center">:</span>
                <select
                  className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none w-20 text-center"
                  value={closeTime12.minute}
                  onChange={(e) =>
                    handleTimeChange("close", "minute", e.target.value)
                  }
                >
                  {["00", "15", "30", "45"].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none w-20"
                  value={closeTime12.period}
                  onChange={(e) =>
                    handleTimeChange("close", "period", e.target.value)
                  }
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* General Note & Emergency */}
        <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div>
              <h3 className="text-white font-bold flex items-center gap-2">
                <Power className="w-4 h-4 text-red-500" /> Emergency Close
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Force close the shop instantly.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.isForceClosed}
                onChange={(e) =>
                  setSettings({ ...settings, isForceClosed: e.target.checked })
                }
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-(--color-gold) mb-2">
              <MessageSquareWarning className="w-4 h-4" /> Global Notification
              Note
            </label>
            <textarea
              rows="3"
              placeholder="Enter message to display on website load..."
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none resize-none"
              value={settings.generalNote}
              onChange={(e) =>
                setSettings({ ...settings, generalNote: e.target.value })
              }
            />
            <p className="text-xs text-gray-500 mt-2">
              Note: This message will popup as an Alert whenever someone visits
              the website.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-(--color-gold) text-black font-bold py-4 rounded-xl hover:bg-[#b89445] transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          {saving ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <>
              <Save className="w-5 h-5" /> Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}
