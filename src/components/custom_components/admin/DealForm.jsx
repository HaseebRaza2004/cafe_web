"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/custom_components/ConfirmModal";
import DealBasicInfo from "./deal-form/DealBasicInfo";
import DealImage from "./deal-form/DealImage";
import DealSteps from "./deal-form/DealSteps";

export default function DealForm({ initialData = null, isEdit = false }) {
    const router = useRouter();
    const { success, error: showError } = useToast() || {};

    const [loading, setLoading] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const [categories, setCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        desc: initialData?.desc || "",
        price: initialData?.price || "",
        image: initialData?.image || "",
        sortOrder: initialData?.sortOrder || 0,
        itemGroups: initialData?.itemGroups || []
    });

    // Fetch Resources
    useEffect(() => {
        let isMounted = true;
        async function fetchResources() {
            try {
                const [catRes, prodRes] = await Promise.all([
                    fetch("/api/categories"),
                    fetch("/api/products")
                ]);
                if (isMounted) {
                    const c = await catRes.json();
                    const p = await prodRes.json();
                    if (c.success) setCategories(c.data);
                    if (p.success) setAllProducts(p.data);
                }
            } catch (err) { console.error("Error loading data"); }
        }
        fetchResources();
        return () => { isMounted = false; };
    }, []);

    // Validation
    const isFormValid = formData.title && formData.price && formData.image;

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (!isFormValid) {
            if (showError) showError("Please fill Title, Price and Image.");
            return;
        }
        if (isEdit) setIsConfirmOpen(true);
        else submitData();
    };

    const submitData = async () => {
        setLoading(true);
        const payload = {
            ...formData,
            itemGroups: formData.itemGroups.map(group => ({
                heading: group.heading,
                minSelection: group.minSelection,
                maxSelection: group.maxSelection,
                specificProducts: group.specificProducts.map(sp => ({
                    product: typeof sp.product === 'object' ? sp.product._id : sp.product,
                    extraPrice: sp.extraPrice || 0
                }))
            }))
        };

        try {
            const url = isEdit ? `/api/deals/${initialData._id}` : "/api/deals";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const result = await res.json();

            if (res.ok) {
                if (success) success(isEdit ? "Deal Updated" : "Deal Created");
                router.push("/admin/deals");
                router.refresh();
            } else {
                if (showError) showError(result.error || "Failed");
            }
        } catch (err) {
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
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Deals
                </Button>

                <h1 className="text-3xl font-bold text-white tracking-wider font-display w-full text-center md:text-right md:w-auto">
                    {isEdit ? `Edit: ${initialData.title}` : "Create New Deal"}
                </h1>
            </div>

            <form onSubmit={handleSubmitClick} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: Main Info & Configuration */}
                <div className="lg:col-span-2 space-y-8">
                    <DealBasicInfo formData={formData} setFormData={setFormData} />

                    <DealSteps
                        itemGroups={formData.itemGroups}
                        setFormData={setFormData}
                        allProducts={allProducts}
                        categories={categories}
                    />
                </div>

                {/* RIGHT COLUMN: Image & Actions s */}
                <div className="space-y-8">
                    <DealImage image={formData.image} setFormData={setFormData} />

                    {/* Action Card */}
                    <div className="bg-black/40 border border-white/10 p-6 lg:p-4 min-[1060px]:p-6 rounded-2xl backdrop-blur-md sticky top-24">
                        <h3 className="text-(--color-gold) font-bold uppercase text-xs tracking-wider mb-4">
                            Actions
                        </h3>
                        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                            {isEdit
                                ? "Updating will affect the live menu immediately."
                                : "This deal will be active once created."}
                        </p>

                        <Button
                            type="submit"
                            disabled={loading || !isFormValid}
                            className="w-full h-12 bg-(--color-gold) text-black font-bold hover:bg-[#b89445] text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                                <div className="flex items-center gap-2">
                                    <Save className="w-5 h-5" />
                                    <span>{isEdit ? "UPDATE DEAL" : "PUBLISH DEAL"}</span>
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </form>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={submitData}
                title="Update Deal?"
                description="This will update the deal on the live website. Ensure prices and items are correct."
                confirmText="Yes, Update"
                variant="default"
            />
        </div>
    );
}