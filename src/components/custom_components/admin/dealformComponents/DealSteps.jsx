"use client";
import { useState, useMemo } from "react";
import { Plus, Trash2, Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function DealSteps({ itemGroups, setFormData, allProducts, categories }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");

    const addGroup = () => {
        setFormData((prev) => ({
            ...prev,
            itemGroups: [
                ...prev.itemGroups,
                { heading: "", minSelection: 1, maxSelection: 1, specificProducts: [] },
            ],
        }));
    };

    const removeGroup = (index) => {
        setFormData((prev) => ({
            ...prev,
            itemGroups: prev.itemGroups.filter((_, i) => i !== index),
        }));
    };

    const updateGroup = (index, field, value) => {
        const updated = [...itemGroups];
        updated[index][field] = value;
        setFormData((prev) => ({ ...prev, itemGroups: updated }));
    };

    const toggleProductInGroup = (groupIndex, productId) => {
        const updated = [...itemGroups];
        const currentProducts = updated[groupIndex].specificProducts || [];

        // Check ID logic
        const existsIndex = currentProducts.findIndex(p =>
            (typeof p.product === 'object' ? p.product._id : p.product) === productId
        );

        if (existsIndex > -1) {
            updated[groupIndex].specificProducts = currentProducts.filter((_, i) => i !== existsIndex);
        } else {
            updated[groupIndex].specificProducts = [...currentProducts, { product: productId, extraPrice: 0 }];
        }
        setFormData((prev) => ({ ...prev, itemGroups: updated }));
    };

    const updateProductExtraPrice = (groupIndex, productId, price) => {
        const updated = [...itemGroups];
        updated[groupIndex].specificProducts = updated[groupIndex].specificProducts.map((p) => {
            const pId = typeof p.product === 'object' ? p.product._id : p.product;
            if (pId === productId) return { ...p, extraPrice: Number(price) };
            return p;
        });
        setFormData((prev) => ({ ...prev, itemGroups: updated }));
    };

    // Filter Products for Selection
    const filteredProducts = useMemo(() => {
        return allProducts.filter((p) => {
            const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = filterCategory === "all" || p.category === filterCategory;
            return matchesSearch && matchesCategory;
        });
    }, [allProducts, searchQuery, filterCategory]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-xl font-bold text-white">Configuration</h3>
                    <p className="text-xs text-gray-400">Define selection steps (e.g. &quot;Choose Burger&quot;).</p>
                </div>
                <Button onClick={addGroup} type="button" variant="secondary" className="bg-white/10 text-white hover:bg-white/20 cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" /> Add Step
                </Button>
            </div>

            {itemGroups.length === 0 && (
                <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center text-gray-500 bg-white/5">
                    <p className="mb-1 text-sm font-bold text-gray-400">Fixed Deal (Direct Cart)</p>
                    <p className="text-xs">Add a step if user needs to make choices.</p>
                </div>
            )}

            {itemGroups.map((group, index) => (
                <div key={index} className="bg-black/40 border border-white/10 p-5 rounded-2xl relative animate-in fade-in slide-in-from-bottom-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeGroup(index)}
                        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>

                    {/* Group Header */}
                    <div className="flex items-center gap-3 mb-6 pr-10">
                        <span className="bg-white/10 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border border-white/10">
                            {index + 1}
                        </span>
                        <div className="flex-1">
                            <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Step Title</Label>
                            <Input
                                placeholder="e.g. Choose Your Flavor"
                                value={group.heading}
                                onChange={(e) => updateGroup(index, "heading", e.target.value)}
                                className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 h-8 focus-visible:ring-0 focus-visible:border-(--color-gold) text-white font-bold placeholder:font-normal placeholder:text-gray-600"
                            />
                        </div>
                    </div>

                    {/* Min/Max Settings */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="space-y-1">
                            <Label className="text-gray-500 text-xs">Min Select</Label>
                            <Input
                                type="number"
                                value={group.minSelection}
                                onChange={(e) => updateGroup(index, "minSelection", Number(e.target.value))}
                                className="bg-black/50 border-white/10 h-10 text-sm focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold)"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-gray-500 text-xs">Max Select</Label>
                            <Input
                                type="number"
                                value={group.maxSelection}
                                onChange={(e) => updateGroup(index, "maxSelection", Number(e.target.value))}
                                className="bg-black/50 border-white/10 h-10 text-sm focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold)"
                            />
                        </div>
                    </div>

                    {/* Product Selector */}
                    <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                        {/* Filter Bar */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <Input
                                    placeholder="Search items to add..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-black/50 border-white/10 pl-9 h-10 text-sm focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold)"
                                />
                            </div>

                            {/* Category */}
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger
                                    className="w-full sm:w-35 bg-black/50 border-white/10 h-10! text-sm focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold)"
                                >
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent className="bg-black border-white/10 text-white z-9999">
                                    <SelectItem
                                        value="all"
                                        className="focus:bg-(--color-gold) focus:text-black cursor-pointer"
                                    >
                                        All Cats
                                    </SelectItem>
                                    {categories.map((c) => (
                                        <SelectItem
                                            key={c._id}
                                            value={c.name}
                                            className="focus:bg-(--color-gold) focus:text-black cursor-pointer"
                                        >
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* List */}
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                            {filteredProducts.map((prod) => {
                                const selectedItem = group.specificProducts?.find(
                                    (p) => (typeof p.product === 'object' ? p.product._id : p.product) === prod._id
                                );
                                const isChecked = !!selectedItem;

                                return (
                                    <div
                                        key={prod._id}
                                        onClick={() => toggleProductInGroup(index, prod._id)}
                                        className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 rounded border transition-colors cursor-pointer ${isChecked
                                            ? "bg-(--color-gold)/10 border-gold/30"
                                            : "hover:bg-white/5 border-transparent"
                                            }`}
                                    >
                                        {/* Checkbox & Name */}
                                        <div className="flex items-center gap-3 w-full sm:flex-1">
                                            <div
                                                className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${isChecked
                                                    ? "bg-(--color-gold) border-(--color-gold)"
                                                    : "border-gray-600"
                                                    }`}
                                            >
                                                {isChecked && <Check className="w-3 h-3 text-black" />}
                                            </div>

                                            <span className={`text-sm ${isChecked ? "text-white font-medium" : "text-gray-400"}`}>
                                                {prod.title}
                                            </span>
                                        </div>

                                        {/* Extra Price Input */}
                                        {isChecked && (
                                            <div
                                                className="flex items-center gap-2 w-full sm:w-auto pl-8 sm:pl-0 animate-in fade-in slide-in-from-top-1 duration-200"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <span className="text-[10px] text-(--color-gold) whitespace-nowrap font-bold uppercase tracking-wider">
                                                    + (Rs)
                                                </span>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    className="h-8 w-full sm:w-20 bg-black/60 border-white/10 text-xs text-white text-center focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:border-(--color-gold) focus-visible:ring-offset-0"
                                                    value={selectedItem.extraPrice}
                                                    onChange={(e) => updateProductExtraPrice(index, prod._id, e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}