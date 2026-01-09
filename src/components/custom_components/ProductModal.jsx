"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, X, Share2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ShareMenu from "./ShareMenu";

const ADDONS = [
    { id: "cheese", name: "Extra Cheese", price: 150 },
    { id: "meat", name: "Extra Meat/Patty", price: 300 },
    { id: "sauce", name: "Special Sauce", price: 80 },
];

const ProductModal = ({ product, isOpen, setIsOpen, trigger }) => {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [sauceLevel, setSauceLevel] = useState("normal");
    const [note, setNote] = useState("");

    // Share States
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    // Derived Logic (No State Loop)
    const basePrice = parseInt(product.price.replace(/[^0-9]/g, "")) || 0;
    const addonsCost = selectedAddons.reduce((total, id) => {
        const addon = ADDONS.find((a) => a.id === id);
        return total + (addon ? addon.price : 0);
    }, 0);
    const totalPrice = (basePrice + addonsCost) * quantity;

    const toggleAddon = (addonId) => {
        setSelectedAddons((prev) => prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]);
    };

    const handleAddToCart = () => {
        addToCart(product, quantity, selectedAddons, totalPrice);
        setIsOpen(false);
    };

    // Share Logic (UI Only)
    const generateShareLink = () => {
        if (typeof window !== "undefined") {
            return `${window.location.origin}/?product=${product.id}`;
        }
        return "";
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(generateShareLink());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = (platform) => {
        const link = generateShareLink();
        const text = `Check out this amazing ${product.title} at Cafe Online!`;
        const urls = {
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + link)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`
        };
        if (urls[platform]) window.open(urls[platform], "_blank");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>

            {/* Trigger Safety Check */}
            {trigger && (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            )}

            <DialogContent className="w-[95vw] sm:max-w-[95vw] md:max-w-3xl lg:max-w-5xl h-[90vh] md:h-auto md:max-h-[85vh] p-0 gap-0 flex flex-col bg-black/60 backdrop-blur-xl border border-(--color-gold) text-white overflow-hidden rounded-2xl shadow-2xl">
                <DialogTitle className="sr-only">{product.title}</DialogTitle>
                <DialogDescription className="sr-only">Customize your meal</DialogDescription>

                {/* --- DESKTOP CONTROLS (Top Right) --- */}
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

                    {/* --- LEFT: IMAGE SECTION --- */}
                    <div className="relative w-full md:w-[45%] h-40 md:h-auto shrink-0 bg-black/50">
                        <Image src={product.image} alt={product.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority={true} />
                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent md:bg-linear-to-r md:from-transparent md:to-black/90" />

                        {/* --- MOBILE CONTROLS (Fixed Alignment) --- */}

                        {/* 1. Close Button (LEFT Side) */}
                        <button onClick={() => setIsOpen(false)} className="absolute top-3 left-3 md:hidden z-20 bg-black/40 backdrop-blur-md p-2 rounded-full text-white border border-white/10">
                            <X className="w-4 h-4" />
                        </button>

                        {/* 2. Share Button (RIGHT Side) */}
                        <div className="absolute top-3 right-3 md:hidden z-20">
                            <button
                                onClick={() => setShowShareMenu(!showShareMenu)}
                                className="bg-black/40 backdrop-blur-md p-2 rounded-full text-white border border-white/10">
                                <Share2 className="w-4 h-4" />
                            </button>
                            {/* Mobile Share Dropdown (Adjusted Position) */}
                            {showShareMenu && (
                                <div className="absolute top-10 right-0">
                                    <ShareMenu onShare={handleShare} onCopy={handleCopyLink} copied={copied} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- RIGHT: CONTENT SECTION --- */}
                    <div className="flex flex-col w-full md:w-[55%] min-h-0 relative">
                        <div className="flex-1 overflow-y-auto no-scrollbar p-5 md:p-8 space-y-6">
                            <div>
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-white mb-2 leading-tight pr-8">{product.title}</h2>
                                <p className="text-gray-300 text-xs md:text-sm leading-relaxed opacity-80">{product.desc}</p>
                                <div className="mt-3 inline-block px-3 py-1 rounded-full border border-(--color-gold) text-(--color-gold) text-sm md:text-base font-bold font-mono bg-gold/10">{product.price}</div>
                            </div>
                            <div className="h-px bg-white/10 w-full" />

                            {/* Addons, Sauce, Notes (No changes needed here) */}
                            <div>
                                <h3 className="text-(--color-gold) font-bold uppercase text-[10px] md:text-xs tracking-wider mb-3">Add-ons</h3>
                                <div className="space-y-2">
                                    {ADDONS.map((addon) => (
                                        <div key={addon.id} onClick={() => toggleAddon(addon.id)} className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${selectedAddons.includes(addon.id) ? "border-(--color-gold) bg-gold/20 shadow-[0_0_10px_rgba(197,160,89,0.1)]" : "border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10"}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedAddons.includes(addon.id) ? "bg-(--color-gold) border-(--color-gold)" : "border-gray-500"}`}>
                                                    {selectedAddons.includes(addon.id) && <div className="w-2.5 h-2.5 bg-black rounded-[1px]" />}
                                                </div>
                                                <span className="text-sm font-medium text-gray-200">{addon.name}</span>
                                            </div>
                                            <span className="text-sm text-(--color-gold)">+Rs {addon.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sauce Logic */}
                            <div>
                                <h3 className="text-(--color-gold) font-bold uppercase text-[10px] md:text-xs tracking-wider mb-3">Sauce Level</h3>
                                <RadioGroup defaultValue="normal" onValueChange={setSauceLevel} className="flex gap-3">
                                    {['Low', 'Normal', 'Extra'].map((level) => (
                                        <div key={level} className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-2 rounded-lg hover:border-(--color-gold) transition-colors cursor-pointer">
                                            <RadioGroupItem value={level.toLowerCase()} id={level} className="border-(--color-gold) text-(--color-gold) w-4 h-4 cursor-pointer" />
                                            <Label htmlFor={level} className="text-gray-300 text-sm cursor-pointer font-medium">{level}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            {/* Notes */}
                            <div>
                                <h3 className="text-(--color-gold) font-bold uppercase text-[10px] md:text-xs tracking-wider mb-3">Note</h3>
                                <Textarea placeholder="E.g. No onions, make it spicy..." value={note} onChange={(e) => setNote(e.target.value)} className="bg-white/5 border-white/10 focus:border-(--color-gold) text-white resize-none h-24 text-sm rounded-lg" />
                            </div>
                            <div className="h-4"></div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 md:p-6 border-t border-white/10 bg-black/60 backdrop-blur-xl shrink-0 z-10">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-white/5 rounded-lg border border-white/10 h-12">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 h-full hover:text-(--color-gold) hover:bg-white/5 transition-colors"><Minus className="w-4 h-4" /></button>
                                    <span className="w-10 text-center font-bold text-lg font-mono">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="px-4 h-full hover:text-(--color-gold) hover:bg-white/5 transition-colors"><Plus className="w-4 h-4" /></button>
                                </div>
                                <Button onClick={handleAddToCart} className="flex-1 h-12 bg-(--color-gold) text-black hover:bg-[#a68545] font-bold text-sm md:text-base uppercase tracking-widest transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(197,160,89,0.3)]">Add • Rs {totalPrice}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductModal;