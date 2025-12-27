"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";

const ADDONS = [
    { id: "cheese", name: "Extra Cheese", price: 150 },
    { id: "meat", name: "Extra Meat/Patty", price: 300 },
    { id: "sauce", name: "Special Sauce", price: 80 },
];

const ProductModal = ({ product, isOpen, setIsOpen, trigger }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [sauceLevel, setSauceLevel] = useState("normal");
    const [note, setNote] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);

    // Parse Base Price (e.g., "Rs 650" -> 650)
    const basePrice = parseInt(product.price.replace(/[^0-9]/g, "")) || 0;

    // --- PRICE CALCULATION LOGIC [cite: 68] ---
    useEffect(() => {
        let addonsCost = selectedAddons.reduce((total, id) => {
            const addon = ADDONS.find((a) => a.id === id);
            return total + (addon ? addon.price : 0);
        }, 0);

        const finalPrice = (basePrice + addonsCost) * quantity;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTotalPrice(finalPrice);
    }, [quantity, selectedAddons, basePrice]);

    // Handle Addon Toggle
    const toggleAddon = (addonId) => {
        setSelectedAddons((prev) =>
            prev.includes(addonId)
                ? prev.filter((id) => id !== addonId)
                : [...prev, addonId]
        );
    };

    const handleAddToCart = () => {
        console.log("Order Data:", {
            product: product.title,
            price: totalPrice,
            addons: selectedAddons,
            sauce: sauceLevel,
            note: note,
            qty: quantity
        });
        setIsOpen(false); // Close modal
        // Yahan hum future main Context API call karenge cart update ke liye
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* Trigger Button (Jo DealCard se pass hoga) */}
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>

            {/* Modal Content - Styled for Luxury Theme */}
            <DialogContent className="max-w-4xl w-[95%] p-0 bg-[#0a0a0a] border border-(--color-gold) text-white overflow-hidden rounded-xl shadow-[0_0_50px_rgba(197,160,89,0.15)]">

                {/* Hidden Title for Accessibility */}
                <DialogTitle className="sr-only">{product.title}</DialogTitle>
                <DialogDescription className="sr-only">Customize your order</DialogDescription>

                <div className="flex flex-col md:flex-row h-[85vh] md:h-150">

                    {/* --- LEFT SIDE: IMAGE  --- */}
                    <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-black">
                        <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                            priority
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-transparent md:bg-linear-to-r md:from-transparent md:to-[#0a0a0a]/80" />

                        {/* Mobile Close Button Overlay */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 md:hidden bg-black/50 p-2 rounded-full text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* --- RIGHT SIDE: DETAILS & CUSTOMIZATION  --- */}
                    <div className="w-full md:w-1/2 flex flex-col h-full">
                        <ScrollArea className="flex-1 p-6 md:p-8">

                            {/* Header */}
                            <div className="mb-6">
                                <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-2">{product.title}</h2>
                                <p className="text-gray-400 text-sm md:text-base">{product.desc}</p>
                                <div className="mt-2 text-(--color-gold) text-xl font-bold font-mono">
                                    Base Price: {product.price}
                                </div>
                            </div>

                            {/* Separator */}
                            <div className="h-px w-full bg-white/10 mb-6" />

                            {/* --- CUSTOMIZATION OPTIONS [cite: 60] --- */}
                            <div className="space-y-6">

                                {/* 1. Add-ons (Checkboxes) */}
                                <div>
                                    <h3 className="text-(--color-gold) font-bold uppercase tracking-wider text-xs mb-3">Add-ons</h3>
                                    <div className="space-y-3">
                                        {ADDONS.map((addon) => (
                                            <div key={addon.id}
                                                className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${selectedAddons.includes(addon.id) ? 'border-(--color-gold) bg-gold/10' : 'border-white/10 hover:border-white/30'}`}
                                                onClick={() => toggleAddon(addon.id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedAddons.includes(addon.id) ? 'bg-(--color-gold) border-(--color-gold)' : 'border-gray-500'}`}>
                                                        {selectedAddons.includes(addon.id) && <div className="w-2 h-2 bg-black rounded-sm" />}
                                                    </div>
                                                    <span className="text-sm font-medium">{addon.name}</span>
                                                </div>
                                                <span className="text-sm text-gray-400">+Rs {addon.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. Sauce Level (Radio) [cite: 64] */}
                                <div>
                                    <h3 className="text-(--color-gold) font-bold uppercase tracking-wider text-xs mb-3">Sauce Level</h3>
                                    <RadioGroup defaultValue="normal" onValueChange={setSauceLevel} className="flex gap-4">
                                        {['Low', 'Normal', 'Extra'].map((level) => (
                                            <div key={level} className="flex items-center space-x-2">
                                                <RadioGroupItem value={level.toLowerCase()} id={level} className="border-(--color-gold) text-(--color-gold)" />
                                                <Label htmlFor={level} className="text-gray-300 text-sm cursor-pointer">{level}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>

                                {/* 3. Special Instructions [cite: 65] */}
                                <div>
                                    <h3 className="text-(--color-gold) font-bold uppercase tracking-wider text-xs mb-3">Special Instructions</h3>
                                    <Textarea
                                        placeholder="e.g. No onions, extra spicy..."
                                        className="bg-white/5 border-white/10 focus:border-(--color-gold) text-white placeholder:text-gray-600 resize-none"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                    />
                                </div>

                            </div>
                        </ScrollArea>

                        {/* --- BOTTOM ACTION BAR (Sticky) --- */}
                        <div className="p-4 md:p-6 border-t border-white/10 bg-[#0a0a0a]">
                            <div className="flex items-center justify-between gap-4">

                                {/* Quantity Selector [cite: 66] */}
                                <div className="flex items-center bg-white/5 rounded-md border border-white/10">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-3 hover:text-(--color-gold) transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-bold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-3 hover:text-(--color-gold) transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Add To Cart Button [cite: 69] */}
                                <Button
                                    onClick={handleAddToCart}
                                    className="flex-1 h-12 bg-(--color-gold) hover:bg-(--color-gold-dark) text-black font-bold uppercase tracking-wide text-sm md:text-base"
                                >
                                    <span className="mr-2">Add to Cart</span>
                                    <span>•</span>
                                    <span className="ml-2 font-mono">Rs {totalPrice}</span>
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