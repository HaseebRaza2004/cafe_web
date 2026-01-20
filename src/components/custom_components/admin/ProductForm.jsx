"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, UploadCloud, Plus, X, Save, ArrowLeft, Check, ChevronDown } from "lucide-react";

export default function ProductForm({ initialData = null, isEdit = false }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [availableGroups, setAvailableGroups] = useState([]);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        desc: initialData?.desc || "",
        price: initialData?.price || "",
        discountPrice: initialData?.discountPrice || "",
        category: initialData?.category || "",
        image: initialData?.image || "",
        isAvailable: initialData?.isAvailable ?? true,
        sortOrder: initialData?.sortOrder || 0,
        variations: initialData?.variations || [],
        productOptions: initialData?.productOptions || []
    });

    // Fetch Data (Groups & Categories)
    useEffect(() => {
        async function fetchData() {
            try {
                const groupRes = await fetch("/api/option-groups");
                const groupJson = await groupRes.json();
                if (groupJson.success) setAvailableGroups(groupJson.data);

                const catRes = await fetch("/api/categories");
                const catJson = await catRes.json();
                if (catJson.success) {
                    setCategories(catJson.data);
                    if (!isEdit && catJson.data.length > 0 && !formData.category) {
                        setFormData(prev => ({ ...prev, category: catJson.data[0].name }));
                    }
                }
            } catch (err) {
                console.error("Failed to fetch data", err);
            }
        }
        fetchData();
    }, [formData.category, isEdit]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const data = new FormData();
        data.append("file", file);
        try {
            const res = await fetch("/api/upload", { method: "POST", body: data });
            const result = await res.json();
            if (result.success) setFormData({ ...formData, image: result.url });
        } catch (err) { alert("Upload Failed"); } finally { setUploading(false); }
    };

    const addVariation = () => setFormData({ ...formData, variations: [...formData.variations, { title: "", price: "", isAvailable: true }] });
    const updateVariation = (index, field, value) => {
        const updated = [...formData.variations];
        updated[index][field] = value;
        setFormData({ ...formData, variations: updated });
    };
    const removeVariation = (index) => setFormData({ ...formData, variations: formData.variations.filter((_, i) => i !== index) });

    const toggleOptionGroup = (groupId) => {
        const exists = formData.productOptions.find(po => po.optionGroupId === groupId);
        if (exists) {
            setFormData({ ...formData, productOptions: formData.productOptions.filter(po => po.optionGroupId !== groupId) });
        } else {
            setFormData({ ...formData, productOptions: [...formData.productOptions, { optionGroupId: groupId, allowedVariations: [] }] });
        }
    };

    const toggleAllowedFlavor = (groupId, flavorName, allOptionsInGroup) => {
        const updated = formData.productOptions.map(po => {
            if (po.optionGroupId === groupId) {
                let currentAllowed = po.allowedVariations || [];
                if (currentAllowed.length === 0) currentAllowed = allOptionsInGroup.map(o => o.name);
                let newAllowed = currentAllowed.includes(flavorName)
                    ? currentAllowed.filter(v => v !== flavorName)
                    : [...currentAllowed, flavorName];
                return { ...po, allowedVariations: newAllowed };
            }
            return po;
        });
        setFormData({ ...formData, productOptions: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = isEdit ? `/api/products/${initialData._id}` : "/api/products";
            const method = isEdit ? "PUT" : "POST";
            const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
            if (res.ok) { router.push("/admin/products"); router.refresh(); }
            else { alert("Failed"); }
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="flex items-center justify-between mb-6">
                <button onClick={() => router.back()} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Menu
                </button>
                <h1 className="text-2xl font-bold text-white tracking-wider">{isEdit ? `Edit: ${initialData.title}` : "Add New Item"}</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">

                    {/* Basic Info */}
                    <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                        <h3 className="text-(--color-gold) font-bold mb-4 uppercase text-xs tracking-wider">Basic Details</h3>
                        <div className="space-y-4">
                            <input required type="text" placeholder="Title" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            <textarea required rows="3" placeholder="Description..." className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none resize-none" value={formData.desc} onChange={(e) => setFormData({ ...formData, desc: e.target.value })} />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Price</label>
                                    <input required type="number" placeholder="500" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
                                </div>

                                {/* 🔥 UPDATED: Category Dropdown */}
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Category</label>
                                    <div className="relative">
                                        <select
                                            required
                                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none appearance-none"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="" disabled>Select Category</option>
                                            {categories.map((cat) => (
                                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                                            ))}
                                            {/* Deals Option Manually Added */}
                                            <option value="Deals" className="text-(--color-gold) font-bold">Deals (Special)</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Sort Order Input (Optional) */}
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Priority Order (1 = Top)</label>
                                <input
                                    type="number"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none"
                                    value={formData.sortOrder}
                                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                                />
                            </div>

                        </div>
                    </div>

                    {/* ... Variations & Options Section ... */}
                    <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-(--color-gold) font-bold uppercase text-xs tracking-wider">Variations</h3>
                            <button type="button" onClick={addVariation} className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full flex items-center gap-1 transition-colors"><Plus className="w-3 h-3" /> Add</button>
                        </div>
                        {formData.variations.map((variant, index) => (
                            <div key={index} className="flex gap-3 items-center mb-2">
                                <input type="text" placeholder="Size" className="flex-1 bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white outline-none" value={variant.title} onChange={(e) => updateVariation(index, "title", e.target.value)} />
                                <input type="number" placeholder="Price" className="w-24 bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white outline-none" value={variant.price} onChange={(e) => updateVariation(index, "price", Number(e.target.value))} />
                                <button type="button" onClick={() => removeVariation(index)} className="p-2 text-red-500"><X className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>

                    <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                        <h3 className="text-(--color-gold) font-bold mb-4 uppercase text-xs tracking-wider">Add-ons</h3>
                        <div className="space-y-2">
                            {availableGroups.map((group) => {
                                const isSelected = formData.productOptions.find(po => po.optionGroupId === group._id);
                                return (
                                    <div key={group._id} className={`border rounded-xl transition-all ${isSelected ? "border-(--color-gold)/50 bg-(--color-gold)/5" : "border-white/5 bg-black/30"}`}>
                                        <div className="p-3 flex items-center justify-between cursor-pointer" onClick={() => toggleOptionGroup(group._id)}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? "bg-(--color-gold) border-(--color-gold)" : "border-gray-500"}`}>{isSelected && <Check className="w-3 h-3 text-black" />}</div>
                                                <span className={`text-sm font-medium ${isSelected ? "text-white" : "text-gray-400"}`}>{group.name}</span>
                                            </div>
                                            {isSelected && <ChevronDown className="w-4 h-4 text-gray-400" />}
                                        </div>
                                        {isSelected && group.options.length > 0 && (
                                            <div className="p-3 pt-0 ml-8 border-l border-white/10 pl-4 grid grid-cols-2 gap-2 mt-2">
                                                {group.options.map((opt, idx) => {
                                                    const currentConfig = formData.productOptions.find(po => po.optionGroupId === group._id);
                                                    const isAllowed = currentConfig.allowedVariations.length === 0 || currentConfig.allowedVariations.includes(opt.name);
                                                    return (
                                                        <label key={idx} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded">
                                                            <input type="checkbox" className="accent-(--color-gold)" checked={isAllowed}
                                                                onChange={() => toggleAllowedFlavor(group._id, opt.name, group.options)}
                                                            />
                                                            <span className="text-xs text-gray-300">{opt.name || "Option"}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>

                {/* Right Column: Image */}
                <div className="space-y-6">
                    <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                        <h3 className="text-(--color-gold) font-bold mb-4 uppercase text-xs tracking-wider">Image</h3>
                        <div className="w-full aspect-square bg-black/50 border-2 border-dashed border-white/10 rounded-xl overflow-hidden relative flex flex-col items-center justify-center group">
                            {formData.image ? <Image src={formData.image} alt="Preview" fill className="object-cover" /> : <><UploadCloud className="w-10 h-10 text-gray-600 mb-2" /><span className="text-xs text-gray-500">Upload</span></>}
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} disabled={uploading} />
                            {uploading && <div className="absolute inset-0 bg-black/80 flex items-center justify-center"><Loader2 className="w-8 h-8 text-(--color-gold) animate-spin" /></div>}
                        </div>
                    </div>
                    <button type="submit" disabled={loading || uploading} className="w-full bg-(--color-gold) text-black font-bold py-4 rounded-xl hover:bg-[#b89445] transition-all flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Save className="w-5 h-5" /> {isEdit ? "UPDATE" : "PUBLISH"}</>}
                    </button>
                </div>
            </form>
        </div>
    );
}