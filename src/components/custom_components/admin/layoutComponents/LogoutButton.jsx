"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/custom_components/ConfirmModal";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
    const router = useRouter();
    const { success, error: showError } = useToast() || {};
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        setIsModalOpen(false);
        try {
            const res = await fetch("/api/admin/logout", { method: "POST" });
            if (res.ok) {
                if (success) success("Logged out successfully");
                router.push("/admin/login");
                router.refresh();
            } else {
                throw new Error("Logout failed");
            }
        } catch (err) {
            if (showError) showError("Failed to log out. Try again.");
            setIsLoggingOut(false);
        }
    };

    return (
        <>
            <div className="p-4 border-t border-white/10">
                <Button
                    variant="ghost"
                    onClick={() => setIsModalOpen(true)}
                    disabled={isLoggingOut}
                    className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-medium h-12"
                >
                    {isLoggingOut ? (
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    ) : (
                        <LogOut className="w-5 h-5 mr-3" />
                    )}
                    <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                </Button>
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleLogout}
                title="Confirm Logout"
                description="Are you sure you want to log out of the admin panel?"
                confirmText="Yes, Logout"
                variant="destructive"
            />
        </>
    );
}