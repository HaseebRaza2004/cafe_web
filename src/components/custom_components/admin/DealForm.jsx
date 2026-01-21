"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, UploadCloud, Plus, Trash2, Check, Search, Save, ArrowLeft } from "lucide-react";

export default function DealForm({ initialData = null, isEdit = false }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Resources
    const [categories, setCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

    // UI Helpers (Filter state for Admin only)
    const [filterCategory, setFilterCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

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

    // --- Dynamic Group Logic ---

    const addGroup = () => {
        setFormData(prev => ({
            ...prev,
            itemGroups: [...prev.itemGroups, { heading: "", minSelection: 1, maxSelection: 1, specificProducts: [] }]
        }));
    };

    const removeGroup = (index) => {
        const updated = formData.itemGroups.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, itemGroups: updated }));
    };

    const updateGroup = (index, field, value) => {
        const updated = [...formData.itemGroups];
        updated[index][field] = value;
        setFormData(prev => ({ ...prev, itemGroups: updated }));
    };

    // Toggle Product Selection
    const toggleProductInGroup = (groupIndex, productId) => {
        const updated = [...formData.itemGroups];
        const currentProducts = updated[groupIndex].specificProducts || [];

        // Find if product exists (Handle Populated Objects vs ID strings)
        const existsIndex = currentProducts.findIndex(p =>
            (typeof p.product === 'object' ? p.product._id : p.product) === productId
        );

        if (existsIndex > -1) {
            // Remove
            updated[groupIndex].specificProducts = currentProducts.filter((_, i) => i !== existsIndex);
        } else {
            // Add
            updated[groupIndex].specificProducts = [...currentProducts, { product: productId, extraPrice: 0 }];
        }
        setFormData(prev => ({ ...prev, itemGroups: updated }));
    };

    // Update Extra Price
    const updateProductExtraPrice = (groupIndex, productId, price) => {
        const updated = [...formData.itemGroups];
        updated[groupIndex].specificProducts = updated[groupIndex].specificProducts.map(p => {
            const pId = typeof p.product === 'object' ? p.product._id : p.product;
            if (pId === productId) return { ...p, extraPrice: Number(price) };
            return p;
        });
        setFormData(prev => ({ ...prev, itemGroups: updated }));
    };

    // --- Submit Logic (Clean Data before Sending) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Clean Data: Ensure only IDs are sent, not full objects (if populated)
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

            if (res.ok) {
                router.push("/admin/deals");
                router.refresh();
            } else {
                const err = await res.json();
                alert(`Failed to save: ${err.error || "Unknown error"}`);
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Filter Products Helper
    const filteredProducts = allProducts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory ? p.category === filterCategory : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
                <button onClick={() => router.back()} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"><ArrowLeft className="w-4 h-4" /> Back</button>
                <h1 className="text-2xl font-bold text-white tracking-wider">{isEdit ? `Edit Deal` : "Create New Deal"}</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Basic Info */}
                <div className="space-y-6">
                    <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                        <h3 className="text-(--color-gold) font-bold mb-4 uppercase text-xs tracking-wider">Deal Info</h3>
                        <div className="space-y-4">
                            <input required type="text" placeholder="Title" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            <textarea required rows="3" placeholder="Description" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none resize-none" value={formData.desc} onChange={(e) => setFormData({ ...formData, desc: e.target.value })} />
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="number" placeholder="Price" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
                                <input type="number" placeholder="Sort Order" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })} />
                            </div>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                        <h3 className="text-[var(--color-gold)] font-bold mb-4 uppercase text-xs tracking-wider">Image</h3>
                        <div className="w-full aspect-video bg-black/50 border-2 border-dashed border-white/10 rounded-xl overflow-hidden relative flex flex-col items-center justify-center group">
                            {formData.image ? <Image src={formData.image} alt="Preview" fill className="object-cover" /> : <><UploadCloud className="w-10 h-10 text-gray-600 mb-2" /><span className="text-xs text-gray-500">Upload</span></>}
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} disabled={uploading} />
                            {uploading && <div className="absolute inset-0 bg-black/80 flex items-center justify-center"><Loader2 className="w-8 h-8 text-[var(--color-gold)] animate-spin" /></div>}
                        </div>
                    </div>
                </div>

                {/* Right Column: Groups Configuration */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-white">Deal Configuration</h3>
                            <p className="text-xs text-gray-400">If no steps added, Deal will be &quot;Direct Add to Cart&quot;.</p>
                        </div>
                        <button type="button" onClick={addGroup} className="bg-[var(--color-gold)] text-black px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[#b89445] transition-all"><Plus className="w-4 h-4" /> Add Selection Step</button>
                    </div>

                    {formData.itemGroups.length === 0 && (
                        <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center text-gray-500">
                            This deal is currently <strong>Fixed</strong> (Direct Add to Cart). <br />
                            Add a step if you want the user to choose items (e.g. Flavors, Drinks).
                        </div>
                    )}

                    {formData.itemGroups.map((group, index) => (
                        <div key={index} className="bg-black/40 border border-white/10 p-5 rounded-2xl relative">
                            <button type="button" onClick={() => removeGroup(index)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>

                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-white/10 text-white w-6 h-6 rounded flex items-center justify-center text-xs font-mono">{index + 1}</span>
                                <input type="text" placeholder="Step Title (e.g. Choose Your Burger)" className="flex-1 bg-transparent border-b border-white/10 focus:border-[var(--color-gold)] text-white py-1 outline-none font-bold" value={group.heading} onChange={(e) => updateGroup(index, "heading", e.target.value)} />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div><label className="text-[10px] uppercase text-gray-500 font-bold">Min Select</label><input type="number" className="w-full bg-black/50 border border-white/10 rounded p-2 text-white text-sm" value={group.minSelection} onChange={(e) => updateGroup(index, "minSelection", Number(e.target.value))} /></div>
                                <div><label className="text-[10px] uppercase text-gray-500 font-bold">Max Select</label><input type="number" className="w-full bg-black/50 border border-white/10 rounded p-2 text-white text-sm" value={group.maxSelection} onChange={(e) => updateGroup(index, "maxSelection", Number(e.target.value))} /></div>
                            </div>

                            {/* Product Selection Area */}
                            <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                                <div className="flex gap-2 mb-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-2 top-2 w-4 h-4 text-gray-500" />
                                        <input type="text" placeholder="Search items..." className="w-full bg-black/50 border border-white/10 rounded pl-8 p-1.5 text-sm text-white outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                    </div>
                                    <select className="bg-black/50 border border-white/10 rounded text-sm text-white outline-none px-2 max-w-[120px]" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                                        <option value="">All Cats</option>
                                        {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>

                                <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
                                    {filteredProducts.map(prod => {
                                        // Check if this product is selected in THIS group
                                        const selectedItem = group.specificProducts?.find(p => (p.product === prod._id || p.product?._id === prod._id));
                                        const isChecked = !!selectedItem;

                                        return (
                                            <div key={prod._id} className={`flex items-center gap-3 p-2 rounded border transition-colors ${isChecked ? "bg-[var(--color-gold)]/10 border-[var(--color-gold)]/30" : "hover:bg-white/5 border-transparent"}`}>
                                                <div onClick={() => toggleProductInGroup(index, prod._id)} className="flex items-center gap-3 cursor-pointer flex-1">
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? "bg-[var(--color-gold)] border-[var(--color-gold)]" : "border-gray-600"}`}>
                                                        {isChecked && <Check className="w-3 h-3 text-black" />}
                                                    </div>
                                                    <span className={`text-xs ${isChecked ? "text-white font-medium" : "text-gray-400"}`}>{prod.title}</span>
                                                </div>

                                                {/* Extra Price Input - Only Shows when Checked */}
                                                {isChecked && (
                                                    <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded">
                                                        <span className="text-[10px] text-[var(--color-gold)]">+Rs</span>
                                                        <input
                                                            type="number"
                                                            className="w-12 bg-transparent border-b border-white/20 text-xs text-white text-center focus:border-[var(--color-gold)] outline-none"
                                                            value={selectedItem.extraPrice}
                                                            onChange={(e) => updateProductExtraPrice(index, prod._id, e.target.value)}
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}

                    <button type="submit" disabled={loading || uploading} className="w-full bg-[var(--color-gold)] text-black font-bold py-4 rounded-xl hover:bg-[#b89445] transition-all flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Save className="w-5 h-5" /> SAVE DEAL</>}
                    </button>
                </div>
            </form>
        </div>
    );
}