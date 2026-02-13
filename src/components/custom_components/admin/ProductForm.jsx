"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/custom_components/ConfirmModal";
import BasicInfo from "./product-form/BasicInfo";
import Variations from "./product-form/Variations";
import Addons from "./product-form/Addons";
import ImageUploader from "./product-form/ImageUploader";

export default function ProductForm({ initialData = null, isEdit = false }) {
    const router = useRouter();
    const { success, error: showError } = useToast() || {};

    const [loading, setLoading] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const [availableGroups, setAvailableGroups] = useState([]);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        desc: initialData?.desc || "",
        price: initialData?.price || "",
        category: initialData?.category || "",
        image: initialData?.image || "",
        isAvailable: initialData?.isAvailable ?? true,
        sortOrder: initialData?.sortOrder || 0,
        variations: initialData?.variations || [],
        productOptions: initialData?.productOptions || []
    });

    // --- FETCH DATA ---
    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            try {
                const [groupRes, catRes] = await Promise.all([
                    fetch("/api/option-groups"),
                    fetch("/api/categories")
                ]);

                const groupJson = await groupRes.json();
                const catJson = await catRes.json();

                if (isMounted) {
                    if (groupJson.success) setAvailableGroups(groupJson.data);
                    if (catJson.success) setCategories(catJson.data);
                }
            } catch (err) {
                console.error("Fetch error", err);
                if (showError) showError("Failed to load form data");
            }
        }
        fetchData();
        return () => { isMounted = false; };
    }, [isEdit, showError]);

    // --- HANDLERS ---
    const isFormValid = formData.title && formData.price && formData.category && formData.image;

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (!isFormValid) {
            if (showError) showError("Please fill all required fields (Title, Price, Image).");
            return;
        }

        if (isEdit) {
            setIsConfirmOpen(true);
        } else {
            submitData();
        }
    };

    const submitData = async () => {
        setLoading(true);
        try {
            const url = isEdit ? `/api/products/${initialData._id}` : "/api/products";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await res.json();

            if (res.ok) {
                if (success) success(isEdit ? "Product updated successfully" : "Product created successfully");
                router.push("/admin/products");
                router.refresh();
            } else {
                if (showError) showError(result.message || "Operation failed");
            }
        } catch (err) {
            console.error(err);
            if (showError) showError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="text-gray-400 hover:text-white pl-0 hover:bg-transparent self-start"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
                </Button>
                <h1 className="text-3xl font-bold text-white tracking-wider font-display w-full text-center md:text-right md:w-auto">
                    {isEdit ? `Edit: ${initialData.title}` : "Add New Item"}
                </h1>
            </div>

            <form onSubmit={handleSubmitClick} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column (Main Data) */}
                <div className="lg:col-span-2 space-y-8">
                    <BasicInfo
                        formData={formData}
                        setFormData={setFormData}
                        categories={categories}
                    />

                    <Variations
                        variations={formData.variations}
                        setFormData={setFormData}
                    />

                    <Addons
                        productOptions={formData.productOptions}
                        availableGroups={availableGroups}
                        setFormData={setFormData}
                    />
                </div>

                {/* Right Column (Image & Actions) */}
                <div className="space-y-8">
                    <ImageUploader
                        image={formData.image}
                        setFormData={setFormData}
                    />

                    {/* Action Card */}
                    <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md sticky top-24">
                        <h3 className="text-(--color-gold) font-bold uppercase text-xs tracking-wider mb-4">
                            Publish Action
                        </h3>
                        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                            {isEdit
                                ? "Updating will affect the live menu immediately. Ensure prices are correct."
                                : "This item will be live once published. You can edit it later."}
                        </p>

                        <Button
                            type="submit"
                            disabled={loading || !isFormValid}
                            className="w-full h-12 bg-(--color-gold) text-black font-bold hover:bg-[#b89445] text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                                <div className="flex items-center gap-2">
                                    <Save className="w-5 h-5" />
                                    <span>{isEdit ? "UPDATE ITEM" : "PUBLISH ITEM"}</span>
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </form>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={submitData}
                title="Update Product?"
                description="Are you sure you want to save these changes? This will update the product on the live website."
                confirmText="Yes, Update"
                variant="default"
            />
        </div>
    );
}