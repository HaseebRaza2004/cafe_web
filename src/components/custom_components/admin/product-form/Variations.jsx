"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

export default function Variations({ variations, setFormData }) {
    const addVariation = () => {
        setFormData((prev) => ({
            ...prev,
            variations: [...prev.variations, { title: "", price: "", isAvailable: true }],
        }));
    };

    const updateVariation = (index, field, value) => {
        const updated = [...variations];
        updated[index][field] = value;
        setFormData((prev) => ({ ...prev, variations: updated }));
    };

    const removeVariation = (index) => {
        setFormData((prev) => ({
            ...prev,
            variations: prev.variations.filter((_, i) => i !== index),
        }));
    };

    return (
        <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-(--color-gold) font-bold uppercase text-xs tracking-wider">
                    Variations
                </h3>
                <Button
                    type="button"
                    onClick={addVariation}
                    size="sm"
                    variant="secondary"
                    className="bg-white/10 text-white hover:bg-white/20 hover:text-(--color-gold) cursor-pointer"
                >
                    <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
            </div>

            <div className="space-y-3">
                {variations.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No variations added.</p>
                )}

                {variations.map((variant, index) => (
                    <div
                        key={index}
                        className="flex flex-col sm:flex-row gap-3 items-start sm:items-end bg-white/5 p-3 rounded-lg border border-white/5 transition-all hover:border-gold/30"
                    >
                        {/* Title Input */}
                        <div className="w-full sm:flex-1 space-y-1">
                            <Label className="text-xs text-gray-400 sm:hidden">Size / Name</Label>
                            <Input
                                placeholder="Size (e.g. Small)"
                                value={variant.title}
                                onChange={(e) => updateVariation(index, "title", e.target.value)}
                                className="bg-black/50 border-white/10 h-12 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0"
                            />
                        </div>

                        {/* Price & Delete */}
                        <div className="flex gap-3 w-full sm:w-auto items-end">
                            <div className="w-full sm:w-28 space-y-1">
                                <Label className="text-xs text-gray-400 sm:hidden">Price</Label>
                                <Input
                                    type="number"
                                    placeholder="Price"
                                    value={variant.price}
                                    onChange={(e) =>
                                        updateVariation(index, "price", Number(e.target.value))
                                    }
                                    className="bg-black/50 border-white/10 h-12 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0"
                                />
                            </div>

                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeVariation(index)}
                                className="shrink-0 h-12 w-12 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer"
                            >
                                <Trash2 className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}