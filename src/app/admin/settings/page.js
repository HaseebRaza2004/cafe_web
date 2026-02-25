"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/custom_components/ConfirmModal";
import SettingsHeader from "@/components/custom_components/admin/settingsComponents/SettingsHeader";
import ScheduleSettings from "@/components/custom_components/admin/settingsComponents/ScheduleSettings";
import GeneralSettings from "@/components/custom_components/admin/settingsComponents/GeneralSettings";

// Helpers to convert between 24h and 12h formats
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

export default function SettingsPage() {
  const router = useRouter();
  const { success, error: showError } = useToast() || {};
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
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

  // Fetch
  const loadSettings = useCallback(
    async (isInitial = false) => {
      if (isInitial) setLoading(true);
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
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
        if (showError) showError("Failed to load settings");
      } finally {
        if (isInitial) setLoading(false);
      }
    },
    [showError],
  );

  useEffect(() => {
    loadSettings(true);
  }, [loadSettings]);

  // Handlers
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

  const initiateSave = (e) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const confirmSave = async () => {
    setIsConfirmOpen(false);
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        if (success) success("Settings saved successfully!");

        await loadSettings(false);
        router.refresh();
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) {
      if (showError) showError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-(--color-gold) animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500 pb-20">
      <SettingsHeader currentStatus={currentStatus} />

      <form onSubmit={initiateSave} className="space-y-6">
        <ScheduleSettings
          openTime12={openTime12}
          closeTime12={closeTime12}
          handleTimeChange={handleTimeChange}
        />

        <GeneralSettings settings={settings} setSettings={setSettings} />

        <Button
          type="submit"
          disabled={saving}
          className="w-full h-14 bg-(--color-gold) text-black font-bold rounded-xl hover:bg-[#b89445] transition-all shadow-[0_0_20px_rgba(197,160,89,0.2)] text-base cursor-pointer"
        >
          {saving ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" /> Save Changes
            </>
          )}
        </Button>
      </form>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmSave}
        title="Update Store Settings?"
        description="Are you sure you want to save these changes? This will immediately affect the live website's status."
        confirmText="Yes, Save Settings"
        variant="default"
      />
    </div>
  );
};