"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, UploadCloud, Plus, X, Save, ArrowLeft, Trash2, ChevronDown, Check } from "lucide-react";

export default function DealForm({ initialData = null, isEdit = false }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Data for Dropdowns
    const [categories, setCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

    // Main Form State
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        desc: initialData?.desc || "",
        price: initialData?.price || "",
        discountPrice: initialData?.discountPrice || "",
        image: initialData?.image || "",
        isAvailable: initialData?.isAvailable ?? true,
        sortOrder: initialData?.sortOrder || 0,
        itemGroups: initialData?.itemGroups || []
    });

    // Fetch Categories & Products for Selection
    useEffect(() => {
        let isMounted = true;
        async function fetchResources() {
            try {
                const [catRes, prodRes] = await Promise.all([
                    fetch("/api/categories"),
                    fetch("/api/products")
                ]);

                if (isMounted) {
                    const catJson = await catRes.json();
                    const prodJson = await prodRes.json();
                    if (catJson.success) setCategories(catJson.data);
                    if (prodJson.success) setAllProducts(prodJson.data);
                }
            } catch (err) {
                console.error("Failed to load resources");
            }
        }
        fetchResources();
        return () => { isMounted = false; };
    }, []);

    // --- Handlers ---

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const data = new FormData();
        data.append("file", file);
        try {
            const res = await fetch("/api/upload", { method: "POST", body: data });
            const result = await res.json();
            if (result.success) setFormData(prev => ({ ...prev, image: result.url }));
        } catch (err) { alert("Upload Failed"); } finally { setUploading(false); }
    };

    // --- Dynamic Deal Logic (The Complex Part) ---

    const addGroup = () => {
        setFormData(prev => ({
            ...prev,
            itemGroups: [
                ...prev.itemGroups,
                { heading: "", minSelection: 1, maxSelection: 1, category: "", specificProducts: [] }
            ]
        }));
    };

    const removeGroup = (index) => {
        const updated = formData.itemGroups.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, itemGroups: updated }));
    };

    const updateGroup = (index, field, value) => {
        const updated = [...formData.itemGroups];
        updated[index][field] = value;
        // Logic: Agar category select ki to products clear kro, aur vice versa
        if (field === 'category') updated[index].specificProducts = [];
        setFormData(prev => ({ ...prev, itemGroups: updated }));
    };

    const toggleProductInGroup = (groupIndex, productId) => {
        const updated = [...formData.itemGroups];
        const currentProducts = updated[groupIndex].specificProducts || [];

        if (currentProducts.includes(productId)) {
            updated[groupIndex].specificProducts = currentProducts.filter(id => id !== productId);
        } else {
            updated[groupIndex].specificProducts = [...currentProducts, productId];
            updated[groupIndex].category = ""; // Clear category if picking specific products
        }
        setFormData(prev => ({ ...prev, itemGroups: updated }));
    };

    // --- Submit ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = isEdit ? `/api/deals/${initialData._id}` : "/api/deals";
            const method = isEdit ? "PUT" : "POST";
            const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
            if (res.ok) { router.push("/admin/deals"); router.refresh(); }
            else { alert("Failed to save deal"); }
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button onClick={() => router.back()} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Deals
                </button>
                <h1 className="text-2xl font-bold text-white tracking-wider">{isEdit ? `Edit Deal` : "Create New Deal"}</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: Basic Details */}
                <div className="space-y-6">
                    <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                        <h3 className="text-(--color-gold) font-bold mb-4 uppercase text-xs tracking-wider">Deal Info</h3>
                        <div className="space-y-4">
                            <input required type="text" placeholder="Deal Title (e.g. Family Feast)" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            <textarea required rows="3" placeholder="Description..." className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none resize-none" value={formData.desc} onChange={(e) => setFormData({ ...formData, desc: e.target.value })} />

                            <div className="grid grid-cols-2 gap-4">
                                <input required type="number" placeholder="Price" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
                                <input type="number" placeholder="Sort Order (1=Top)" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })} />
                            </div>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                        <h3 className="text-(--color-gold) font-bold mb-4 uppercase text-xs tracking-wider">Deal Banner</h3>
                        <div className="w-full aspect-video bg-black/50 border-2 border-dashed border-white/10 rounded-xl overflow-hidden relative flex flex-col items-center justify-center group hover:border-(--color-gold)/50 transition-colors">
                            {formData.image ? <Image src={formData.image} alt="Preview" fill className="object-cover" /> : <><UploadCloud className="w-10 h-10 text-gray-600 mb-2" /><span className="text-xs text-gray-500">Upload Image</span></>}
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} disabled={uploading} />
                            {uploading && <div className="absolute inset-0 bg-black/80 flex items-center justify-center"><Loader2 className="w-8 h-8 text-(--color-gold) animate-spin" /></div>}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: The Deal Builder */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white">Deal Configuration</h3>
                        <button type="button" onClick={addGroup} className="bg-(--color-gold) text-black px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[#b89445] transition-all">
                            <Plus className="w-4 h-4" /> Add Selection Step
                        </button>
                    </div>

                    {formData.itemGroups.length === 0 ? (
                        <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl text-gray-500">
                            No steps added. Click &quot;Add Selection Step&quot; to start building the deal.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {formData.itemGroups.map((group, index) => (
                                <div key={index} className="bg-black/40 border border-white/10 p-5 rounded-2xl relative animate-in slide-in-from-right-4 duration-300">
                                    <button type="button" onClick={() => removeGroup(index)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>

                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="bg-white/10 text-white w-6 h-6 rounded flex items-center justify-center text-xs font-mono">{index + 1}</span>
                                        <input type="text" placeholder="Step Title (e.g. Choose Your Pizza)" className="flex-1 bg-transparent border-b border-white/10 focus:border-(--color-gold) text-white py-1 outline-none font-bold" value={group.heading} onChange={(e) => updateGroup(index, "heading", e.target.value)} />
                                    </div>

                                    {/* Logic Config */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="text-[10px] uppercase text-gray-500 font-bold">Min Selection</label>
                                            <input type="number" className="w-full bg-black/50 border border-white/10 rounded p-2 text-white text-sm" value={group.minSelection} onChange={(e) => updateGroup(index, "minSelection", Number(e.target.value))} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase text-gray-500 font-bold">Max Selection</label>
                                            <input type="number" className="w-full bg-black/50 border border-white/10 rounded p-2 text-white text-sm" value={group.maxSelection} onChange={(e) => updateGroup(index, "maxSelection", Number(e.target.value))} />
                                        </div>
                                    </div>

                                    {/* Source Selection */}
                                    <div className="space-y-3">
                                        <label className="text-xs text-(--color-gold) font-bold uppercase tracking-wider">Source (Where to pick items from?)</label>

                                        {/* Option A: Category */}
                                        <select
                                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white text-sm outline-none"
                                            value={group.category || ""}
                                            onChange={(e) => updateGroup(index, "category", e.target.value)}
                                        >
                                            <option value="">-- Or Select a Whole Category --</option>
                                            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                        </select>

                                        <div className="text-center text-xs text-gray-500">- OR Pick Specific Items -</div>

                                        {/* Option B: Specific Products */}
                                        <div className="max-h-40 overflow-y-auto bg-black/50 border border-white/10 rounded-lg p-2 space-y-1 custom-scrollbar">
                                            {allProducts.map(prod => {
                                                const isChecked = group.specificProducts?.includes(prod._id);
                                                return (
                                                    <div key={prod._id} onClick={() => toggleProductInGroup(index, prod._id)} className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${isChecked ? "bg-gold/20" : "hover:bg-white/5"}`}>
                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? "bg-(--color-gold) border-(--color-gold)" : "border-gray-600"}`}>
                                                            {isChecked && <Check className="w-3 h-3 text-black" />}
                                                        </div>
                                                        <span className={`text-xs ${isChecked ? "text-(--color-gold)" : "text-gray-300"}`}>{prod.title}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <button type="submit" disabled={loading || uploading} className="w-full bg-(--color-gold) text-black font-bold py-4 rounded-xl hover:bg-[#b89445] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(197,160,89,0.2)]">
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Save className="w-5 h-5" /> PUBLISH DEAL</>}
                    </button>
                </div>
            </form>
        </div>
    );
}