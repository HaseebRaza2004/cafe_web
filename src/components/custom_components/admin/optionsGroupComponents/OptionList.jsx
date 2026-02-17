"use client";
import { Plus, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OptionList({ options, setFormData }) {

    const addOptionRow = () => {
        setFormData((prev) => ({
            ...prev,
            options: [...prev.options, { name: "", price: "", isAvailable: true }],
        }));
    };

    const removeOptionRow = (index) => {
        const updated = options.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, options: updated }));
    };

    const updateOptionRow = (index, field, value) => {
        const updated = [...options];
        updated[index][field] = value;
        setFormData((prev) => ({ ...prev, options: updated }));
    };

    return (
        <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
            {/* Header */}
            <div className="flex flex-col min-[390px]:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="text-lg font-bold text-white text-center min-[390px]:text-left w-full min-[380px]:w-auto">
                    Option Items
                </h3>
                <Button
                    type="button"
                    onClick={addOptionRow}
                    className="bg-white/5 hover:bg-white/10 text-(--color-gold) border border-white/10 w-full min-[390px]:w-auto cursor-pointer"
                >
                    <Plus className="w-4 h-4 mr-1" /> Add Item
                </Button>
            </div>

            <div className="space-y-3">
                {options.map((opt, index) => (
                    <div
                        key={index}
                        className="flex flex-col lg:flex-row gap-3 lg:items-center bg-black/30 p-4 rounded-xl border border-white/5 transition-all hover:border-white/10"
                    >
                        {/* AddsOn Name */}
                        <Input
                            type="text"
                            placeholder="Item Name (e.g. Coke)"
                            value={opt.name}
                            onChange={(e) => updateOptionRow(index, "name", e.target.value)}
                            className="w-full lg:flex-1 bg-black/50 border-white/10 h-11! text-sm focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold)"
                        />

                        <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto items-stretch md:items-center">

                            {/* Price */}
                            <div className="relative w-full md:w-32 lg:w-32">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">
                                    Rs
                                </span>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={opt.price}
                                    onChange={(e) => updateOptionRow(index, "price", Number(e.target.value))}
                                    className="w-full bg-black/50 border-white/10 pl-8 h-11! text-sm focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold)"
                                />
                            </div>

                            <div className="flex gap-2 w-full md:w-auto">
                                {/* Stock Toggle */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => updateOptionRow(index, "isAvailable", !opt.isAvailable)}
                                    className={`flex-1 md:w-28 h-11! border transition-all cursor-pointer ${opt.isAvailable
                                        ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20 hover:text-green-400"
                                        : "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 hover:text-red-400"
                                        }`}
                                >
                                    {opt.isAvailable ? (
                                        <><Check className="w-3 h-3 mr-1" /> In Stock</>
                                    ) : (
                                        <><X className="w-3 h-3 mr-1" /> No Stock</>
                                    )}
                                </Button>

                                {/* Delete */}
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => removeOptionRow(index)}
                                    className="h-11! w-11 p-0 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}