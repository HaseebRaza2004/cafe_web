"use client";
import { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/custom_components/ConfirmModal";

export default function CategoriesHeader({ onSaveOrder, isSavingOrder }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleConfirm = () => {
        setIsModalOpen(false);
        onSaveOrder();
    };

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="w-full text-center md:text-left">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Menu Categories
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Manage categories and their display order.
                    </p>
                </div>

                <Button
                    onClick={() => setIsModalOpen(true)}
                    disabled={isSavingOrder}
                    className="w-full md:w-auto bg-(--color-gold) text-black font-bold rounded-xl hover:bg-[#d4af66] h-11 px-5 py-2  shadow-[0_0_15px_rgba(197,160,89,0.2)] cursor-pointer  transition-all active:scale-95"
                >
                    {isSavingOrder ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4 mr-1" />
                    )}
                    Save Order
                </Button>
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirm}
                title="Save Category Order?"
                description="This will update the order of categories on the live menu."
                confirmText="Yes, Save Order"
                variant="default"
            />
        </>
    );
}