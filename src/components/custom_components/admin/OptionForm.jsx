"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Save, ArrowLeft } from "lucide-react";

export default function OptionForm({ initialData = null, isEdit = false }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Initial State setup
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        type: initialData?.type || "single",
        options: initialData?.options || [{ name: "", price: 0, isAvailable: true }]
    });

    // --- Handlers ---

    // Add new empty option row
    const addOptionRow = () => {
        setFormData({
            ...formData,
            options: [...formData.options, { name: "", price: 0, isAvailable: true }]
        });
    };

    // Remove option row
    const removeOptionRow = (index) => {
        const updated = formData.options.filter((_, i) => i !== index);
        setFormData({ ...formData, options: updated });
    };

    // Update specific field in an option row
    const updateOptionRow = (index, field, value) => {
        const updated = [...formData.options];
        updated[index][field] = value;
        setFormData({ ...formData, options: updated });
    };

    // Submit to API
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit
                ? `/api/option-groups/${initialData._id}`
                : "/api/option-groups";

            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Operation Failed");

            router.push("/admin/options");
            router.refresh();
        } catch (error) {
            alert("Something went wrong! Check console.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button onClick={() => router.back()} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <h1 className="text-2xl font-bold text-white tracking-wider">
                    {isEdit ? "Edit Group" : "Create New Group"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Card 1: Group Info */}
                <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-(--color-gold) mb-2 uppercase">Group Name</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Cold Drinks / Extra Toppings"
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-(--color-gold) mb-2 uppercase">Selection Type</label>
                            <select
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="single">Single Select (Radio) - e.g. Flavor</option>
                                <option value="multiple">Multi Select (Checkbox) - e.g. Toppings</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Card 2: Options List */}
                <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Options Items</h3>
                        <button
                            type="button"
                            onClick={addOptionRow}
                            className="bg-white/5 hover:bg-white/10 text-(--color-gold) px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Add Item
                        </button>
                    </div>

                    <div className="space-y-3">
                        {formData.options.map((opt, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-3 items-center bg-black/30 p-3 rounded-xl border border-white/5">

                                {/* Name */}
                                <input
                                    type="text"
                                    placeholder="Item Name (e.g. Coke)"
                                    className="flex-1 w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-(--color-gold) outline-none"
                                    value={opt.name}
                                    onChange={(e) => updateOptionRow(index, "name", e.target.value)}
                                />

                                {/* Price */}
                                <div className="relative w-full md:w-32">
                                    <span className="absolute left-3 top-2 text-gray-500 text-xs">Rs</span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 pl-8 text-sm text-white focus:border-(--color-gold) outline-none"
                                        value={opt.price}
                                        onChange={(e) => updateOptionRow(index, "price", Number(e.target.value))}
                                    />
                                </div>

                                {/* Availability Toggle */}
                                <button
                                    type="button"
                                    onClick={() => updateOptionRow(index, "isAvailable", !opt.isAvailable)}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all ${opt.isAvailable ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}
                                >
                                    {opt.isAvailable ? "In Stock" : "No Stock"}
                                </button>

                                {/* Delete */}
                                <button
                                    type="button"
                                    onClick={() => removeOptionRow(index)}
                                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-(--color-gold) text-black font-bold py-4 rounded-xl hover:bg-[#b89445] transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(197,160,89,0.2)]"
                >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Save className="w-5 h-5" /> SAVE GROUP</>}
                </button>

            </form>
        </div>
    );
}