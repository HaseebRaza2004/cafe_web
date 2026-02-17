"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/custom_components/ConfirmModal";
import OptionBasicInfo from "./optionsGroupComponents/OptionBasicInfo";
import OptionList from "./optionsGroupComponents/OptionList";

export default function OptionForm({ initialData = null, isEdit = false }) {
    const router = useRouter();
    const { success, error: showError } = useToast() || {};

    const [loading, setLoading] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        type: initialData?.type || "single",
        options: initialData?.options || [{ name: "", price: "", isAvailable: true }]
    });

    // --- Validation ---
    const isFormValid =
        formData.name.trim() !== "" &&
        formData.options.length > 0 &&
        formData.options.every(opt => opt.name.trim() !== "" && opt.price !== "");

    // --- Handlers ---
    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (!isFormValid) {
            if (showError) showError("Please fill Group Name and all Option fields.");
            return;
        }
        if (isEdit) setIsConfirmOpen(true);
        else submitData();
    };

    const submitData = async () => {
        setLoading(true);
        try {
            const url = isEdit ? `/api/option-groups/${initialData._id}` : "/api/option-groups";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (res.ok) {
                if (success) success(isEdit ? "Option Group Updated" : "Option Group Created");
                router.push("/admin/options");
                router.refresh();
            } else {
                if (showError) showError(result.error || "Operation Failed");
            }
        } catch (error) {
            console.error(error);
            if (showError) showError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 p-4">

            {/* Header - Responsive Layout */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="text-gray-400 hover:text-white pl-0 hover:bg-transparent self-start cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>

                <h1 className="text-3xl font-bold text-white tracking-wider font-display w-full text-center md:text-right md:w-auto">
                    {isEdit ? "Edit Group" : "Create New Group"}
                </h1>
            </div>

            <form onSubmit={handleSubmitClick} className="space-y-8">

                {/* Basic Info */}
                <OptionBasicInfo formData={formData} setFormData={setFormData} />

                {/* Options List */}
                <OptionList options={formData.options} setFormData={setFormData} />

                {/* Submit Action */}
                <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md sticky bottom-6 shadow-2xl">
                    <Button
                        type="submit"
                        disabled={loading || !isFormValid}
                        className="w-full h-12 bg-(--color-gold) text-black font-bold hover:bg-[#b89445] text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                            <div className="flex items-center gap-2">
                                <Save className="w-5 h-5" />
                                <span>{isEdit ? "UPDATE GROUP" : "SAVE GROUP"}</span>
                            </div>
                        )}
                    </Button>
                </div>

            </form>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={submitData}
                title="Update Option Group?"
                description="Changes here will update all products using this group. Ensure prices are correct."
                confirmText="Yes, Update"
                variant="default"
            />
        </div>
    );
}