"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, X, Share2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ShareMenu from "./ShareMenu";

const ProductModal = ({ product, isOpen, setIsOpen, trigger }) => {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    // Dynamic Selections State
    // Format: { "groupId": ["optionName1", "optionName2"] }
    const [selections, setSelections] = useState({});

    const [note, setNote] = useState("");
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    // --- Price Calculation Logic ---
    const basePrice = Number(product.price) || 0;

    // Calculate Extra Cost from Selections
    const extrasCost = product.productOptions?.reduce((total, groupConfig) => {
        const group = groupConfig.optionGroupId;
        if (!group || !group.options) return total;

        const userSelected = selections[group._id] || [];

        // Find selected options in this group and sum their prices
        const groupCost = group.options
            .filter(opt => userSelected.includes(opt.name))
            .reduce((sum, opt) => sum + (Number(opt.price) || 0), 0);

        return total + groupCost;
    }, 0) || 0;

    const totalPrice = (basePrice + extrasCost) * quantity;

    // --- Handlers ---
    const handleSelection = (groupId, type, optionName) => {
        setSelections(prev => {
            const current = prev[groupId] || [];
            if (type === "single") {
                return { ...prev, [groupId]: [optionName] };
            } else {
                if (current.includes(optionName)) {
                    return { ...prev, [groupId]: current.filter(item => item !== optionName) };
                } else {
                    return { ...prev, [groupId]: [...current, optionName] };
                }
            }
        });
    };

    const handleAddToCart = () => {
        // Prepare selection details for Cart
        const selectedOptionsList = Object.entries(selections).flatMap(([groupId, selectedNames]) => {
            const groupConfig = product.productOptions.find(po => po.optionGroupId._id === groupId);
            const groupName = groupConfig?.optionGroupId?.name || "Option";
            return selectedNames.map(name => ({ group: groupName, name: name }));
        });

        addToCart(product, quantity, selectedOptionsList, totalPrice);
        setIsOpen(false);
    };

    // --- Share Logic ---
    const generateShareLink = () => typeof window !== "undefined" ? `${window.location.origin}/?product=${product._id}` : "";
    const handleCopyLink = () => { navigator.clipboard.writeText(generateShareLink()); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    const handleShare = (platform) => {
        const link = generateShareLink();
        const text = `Check out this amazing ${product.title}!`;
        const urls = { whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + link)}`, facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}` };
        if (urls[platform]) window.open(urls[platform], "_blank");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

            <DialogContent className="w-[95vw] sm:max-w-[95vw] md:max-w-3xl lg:max-w-5xl h-[90vh] md:h-auto md:max-h-[85vh] p-0 gap-0 flex flex-col bg-black/60 backdrop-blur-xl border border-(--color-gold) text-white overflow-hidden rounded-2xl shadow-2xl">
                <DialogTitle className="sr-only">{product.title}</DialogTitle>
                <DialogDescription className="sr-only">Customize your meal</DialogDescription>

                {/* DESKTOP CONTROLS */}
                <div className="absolute top-4 right-4 z-50 hidden md:flex gap-2">
                    <div className="relative">
                        <button onClick={() => setShowShareMenu(!showShareMenu)} className="bg-black/40 backdrop-blur-md p-2 rounded-full text-white border border-white/10 hover:border-(--color-gold) hover:text-(--color-gold) transition-all">
                            <Share2 className="w-5 h-5" />
                        </button>
                        {showShareMenu && <ShareMenu onShare={handleShare} onCopy={handleCopyLink} copied={copied} />}
                    </div>
                    <button onClick={() => setIsOpen(false)} className="bg-black/40 backdrop-blur-md p-2 rounded-full text-white border border-white/10 hover:bg-red-500/20 hover:text-red-500 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row flex-1 min-h-0">

                    {/* LEFT: IMAGE */}
                    <div className="relative w-full md:w-[45%] h-40 md:h-auto shrink-0 bg-black/50">
                        <Image src={product.image || "/placeholder.jpg"} alt={product.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority={true} />
                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent md:bg-linear-to-r md:from-transparent md:to-black/90" />

                        {/* MOBILE CONTROLS */}
                        <button onClick={() => setIsOpen(false)} className="absolute top-3 left-3 md:hidden z-20 bg-black/40 backdrop-blur-md p-2 rounded-full text-white border border-white/10">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* RIGHT: CONTENT */}
                    <div className="flex flex-col w-full md:w-[55%] min-h-0 relative">
                        <div className="flex-1 overflow-y-auto no-scrollbar p-5 md:p-8 space-y-6">

                            {/* Title & Price */}
                            <div>
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-white mb-2 leading-tight pr-8">{product.title}</h2>
                                <p className="text-gray-300 text-xs md:text-sm leading-relaxed opacity-80">{product.desc}</p>
                                <div className="mt-3 inline-block px-3 py-1 rounded-full border border-(--color-gold) text-(--color-gold) text-sm md:text-base font-bold font-mono bg-gold/10">Rs {product.price}</div>
                            </div>
                            <div className="h-px bg-white/10 w-full" />

                            {/* --- DYNAMIC OPTIONS (Replaces hardcoded Addons) --- */}
                            {product.productOptions && product.productOptions.length > 0 && product.productOptions.map((groupConfig, idx) => {
                                const group = groupConfig.optionGroupId;
                                if (!group) return null; // Skip if broken link

                                const isMulti = group.type === 'multiple';

                                return (
                                    <div key={group._id}>
                                        <h3 className="text-(--color-gold) font-bold uppercase text-[10px] md:text-xs tracking-wider mb-3">
                                            {group.name} {isMulti ? "(Select Multiple)" : "(Choose One)"}
                                        </h3>

                                        {isMulti ? (
                                            // CHECKBOX STYLE (Like your Addons)
                                            <div className="space-y-2">
                                                {group.options.map((option) => {
                                                    const isSelected = selections[group._id]?.includes(option.name);
                                                    const isDisabled = !option.isAvailable;

                                                    const newLocal = "text-sm font-medium text-gray-200";
                                                    return (
                                                        <div
                                                            key={option._id || option.name}
                                                            onClick={() => !isDisabled && handleSelection(group._id, "multiple", option.name)}
                                                            className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${isSelected ? "border-(--color-gold) bg-gold/20 shadow-[0_0_10px_rgba(197,160,89,0.1)]" : "border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10"} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isSelected ? "bg-(--color-gold) border-(--color-gold)" : "border-gray-500"}`}>
                                                                    {isSelected && <div className="w-2.5 h-2.5 bg-black rounded-[1px]" />}
                                                                </div>
                                                                <span className={newLocal}>{option.name}</span>
                                                            </div>
                                                            <span className="text-sm text-(--color-gold)">
                                                                {option.price > 0 ? `+Rs ${option.price}` : "Free"}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            // RADIO STYLE (Like your Sauce Level)
                                            <div className="flex flex-wrap gap-3">
                                                {group.options.map((option) => {
                                                    const isSelected = selections[group._id]?.includes(option.name);
                                                    return (
                                                        <div
                                                            key={option._id || option.name}
                                                            onClick={() => handleSelection(group._id, "single", option.name)}
                                                            className={`flex items-center space-x-2 bg-white/5 border px-3 py-2 rounded-lg transition-colors cursor-pointer ${isSelected ? "border-(--color-gold) text-(--color-gold)" : "border-white/10 hover:border-(--color-gold)"}`}
                                                        >
                                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "border-(--color-gold)" : "border-gray-500"}`}>
                                                                {isSelected && <div className="w-2 h-2 rounded-full bg-(--color-gold)" />}
                                                            </div>
                                                            <Label className="text-gray-300 text-sm cursor-pointer font-medium">{option.name}</Label>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                        <div className="h-4"></div>
                                    </div>
                                );
                            })}

                            {/* Note Section (Same) */}
                            <div>
                                <h3 className="text-(--color-gold) font-bold uppercase text-[10px] md:text-xs tracking-wider mb-3">Note</h3>
                                <Textarea
                                    placeholder="E.g. No onions, make it spicy..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="bg-white/5 border-white/10 focus:border-(--color-gold) text-white resize-none h-24 text-sm rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Footer (Same) */}
                        <div className="p-4 md:p-6 border-t border-white/10 bg-black/60 backdrop-blur-xl shrink-0 z-10">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-white/5 rounded-lg border border-white/10 h-12">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 h-full hover:text-(--color-gold) hover:bg-white/5 transition-colors"><Minus className="w-4 h-4" /></button>
                                    <span className="w-10 text-center font-bold text-lg font-mono">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="px-4 h-full hover:text-(--color-gold) hover:bg-white/5 transition-colors"><Plus className="w-4 h-4" /></button>
                                </div>
                                <Button onClick={handleAddToCart} className="flex-1 h-12 bg-(--color-gold) text-black hover:bg-[#a68545] font-bold text-sm md:text-base uppercase tracking-widest transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(197,160,89,0.3)]">
                                    Add • Rs {totalPrice}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductModal;