"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2, MapPin, ArrowRight, Search, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import ConfirmModal from "./ConfirmModal";

// --- MOCK DATA: Delivery Areas (Add your 50+ areas here) ---
const DELIVERY_AREAS = [
    { id: "gulshan", label: "Gulshan-e-Iqbal", price: 100 },
    { id: "jauhar", label: "Gulistan-e-Jauhar", price: 150 },
    { id: "pechs", label: "PECHS", price: 150 },
    { id: "dha", label: "DHA Phase 1-8", price: 250 },
    { id: "clifton", label: "Clifton", price: 250 },
    { id: "nazimabad", label: "Nazimabad", price: 120 },
    { id: "north-nazimabad", label: "North Nazimabad", price: 150 },
    { id: "fb-area", label: "Federal B. Area", price: 120 },
    { id: "malir", label: "Malir Cantt", price: 300 },
    { id: "bahria", label: "Bahria Town", price: 500 },
];

// --- CUSTOM COMPONENT: Searchable Dropdown (No Library Needed) ---
const SearchableAreaSelector = ({ onSelect, selectedPrice }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedLabel, setSelectedLabel] = useState("");
    const dropdownRef = useRef(null);

    // Filter Areas
    const filteredAreas = useMemo(() => {
        return DELIVERY_AREAS.filter(area =>
            area.label.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    // Handle Click Outside to Close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (area) => {
        setSelectedLabel(area.label);
        onSelect(area.price, area.label); // Pass price & name back to parent
        setIsOpen(false);
        setSearch(""); // Reset search on select
    };

    return (
        <div className="relative space-y-2" ref={dropdownRef}>
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Delivery Area
            </label>

            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-12 px-3 rounded-xl border flex items-center justify-between text-xs transition-all ${isOpen ? "border-(--color-gold) bg-black" : "border-white/10 bg-white/5 hover:border-white/30"}`}
            >
                <span className={selectedLabel ? "text-white font-medium" : "text-gray-400"}>
                    {selectedLabel || "Search your area..."}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180 text-(--color-gold)" : ""}`} />
            </button>

            {/* Dropdown Content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1a] border border-gold/30 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-75"
                    >
                        {/* Search Input */}
                        <div className="p-2 border-b border-white/10 bg-[#0a0a0a] sticky top-0 z-10">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Type to search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-white/10 border border-transparent focus:border-(--color-gold) rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-gray-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="overflow-y-auto flex-1 p-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                            {filteredAreas.length > 0 ? (
                                filteredAreas.map((area) => (
                                    <button
                                        key={area.id}
                                        onClick={() => handleSelect(area)}
                                        className="w-full text-left flex justify-between items-center px-3 py-2.5 hover:bg-white/5 rounded-lg group transition-colors"
                                    >
                                        <span className="text-gray-300 text-xs group-hover:text-white transition-colors">{area.label}</span>
                                        <span className="text-(--color-gold) text-[10px] font-mono bg-(--color-gold)/10 px-1.5 py-0.5 rounded">
                                            Rs {area.price}
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500 text-xs">No areas found.</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- MAIN COMPONENT ---
const CartSheet = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
    const router = useRouter();

    // State
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [selectedAreaName, setSelectedAreaName] = useState("");
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Calculations
    const TAX_RATE = 0.15; // 15%
    // Only apply tax if cart is not empty (Logic can be adjusted)
    const taxAmount = cartTotal > 0 ? cartTotal * TAX_RATE : 0;
    const grandTotal = cartTotal + taxAmount + deliveryFee;

    // Handlers
    const handleCheckout = () => {
        // Pass details via Query Params or Global State (Context recommended for production)
        const params = new URLSearchParams({
            area: selectedAreaName,
            fee: deliveryFee
        });
        router.push(`/checkout?${params.toString()}`);
    };

    const confirmRemoveItem = (signature) => {
        setItemToDelete(signature);
        setIsDeleteModalOpen(true);
    };

    // Callback for Custom Dropdown
    const onAreaSelect = (price, name) => {
        setDeliveryFee(price);
        setSelectedAreaName(name);
    };

    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <button className="relative p-2 hover:bg-white/10 rounded-full transition-colors group">
                        <ShoppingBag className="w-6 h-6 text-white group-hover:text-(--color-gold) transition-colors" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-(--color-gold) text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-in zoom-in">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </SheetTrigger>

                {/* LAYOUT CHANGE: 
                    - h-[100dvh] ensures full mobile height.
                    - We DO NOT separate Footer. Everything is inside ONE ScrollArea.
                */}
                <SheetContent side="right" aria-describedby={undefined} className="w-full sm:max-w-md bg-black/95 border-l border-white/10 backdrop-blur-xl p-0 flex flex-col h-dvh text-white">

                    <SheetDescription className="sr-only">Cart Summary</SheetDescription>

                    {/* Header (Kept Fixed for better UX, but content scrolls underneath) */}
                    <SheetHeader className="p-6 border-b border-white/10 bg-black/50 shrink-0 z-10 backdrop-blur-md">
                        <div className="flex items-center justify-between">
                            <SheetTitle className="text-2xl font-bold font-display text-white tracking-wide">
                                Your <span className="text-(--color-gold)">Order</span>
                            </SheetTitle>
                        </div>
                    </SheetHeader>

                    {/* SINGLE SCROLLABLE CONTAINER FOR EVERYTHING */}
                    <ScrollArea className="flex-1 w-full h-full">
                        <div className="flex flex-col min-h-full">

                            {/* 1. ITEMS LIST */}
                            <div className="p-6 pb-0">
                                {cartItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-6">
                                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                                            <ShoppingBag className="w-8 h-8 opacity-40" />
                                        </div>
                                        <div className="text-center space-y-2">
                                            <p className="text-lg font-bold text-white tracking-wide">Your Cart is Empty</p>
                                            <p className="text-xs text-gray-400 max-w-50 mx-auto leading-relaxed">
                                                Delicious food is just a click away.
                                            </p>
                                        </div>
                                        <SheetClose asChild>
                                            <Button
                                                variant="outline"
                                                className="border-(--color-gold) text-(--color-gold) hover:bg-(--color-gold) hover:text-black uppercase text-xs tracking-widest px-8"
                                            >
                                                Browse Menu
                                            </Button>
                                        </SheetClose>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <AnimatePresence initial={false}>
                                            {cartItems.map((item) => (
                                                <motion.div
                                                    key={item.signature}
                                                    layout
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, x: -50, height: 0, marginBottom: 0 }}
                                                    className="group relative flex gap-4 bg-white/5 border border-white/5 rounded-xl p-4 hover:border-gold/30 transition-all"
                                                >
                                                    {/* Image */}
                                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10 self-start mt-1">
                                                        <Image
                                                            src={item.image || "/placeholder.jpg"}
                                                            alt={item.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <h4 className="font-bold text-sm text-white truncate pr-2">{item.title}</h4>
                                                            <span className="font-bold text-white text-sm whitespace-nowrap">
                                                                Rs {(item.price * item.quantity).toLocaleString()}
                                                            </span>
                                                        </div>

                                                        <div className="h-px w-full bg-white/10 mb-2" />

                                                        <div className="text-[10px] font-mono text-(--color-gold) mb-2 opacity-80">
                                                            @ Rs {item.price.toLocaleString()}
                                                        </div>

                                                        {item.selectedOptions && item.selectedOptions.length > 0 && (
                                                            <div className="mb-3 space-y-1 bg-black/20 p-2 rounded-md">
                                                                {item.selectedOptions.map((opt, idx) => (
                                                                    <div key={idx} className="flex justify-between text-[10px] text-gray-400">
                                                                        <span>• {opt.group}: {opt.name}</span>
                                                                        {opt.price > 0 && <span>+{opt.price}</span>}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div className="flex justify-between items-end mt-2">
                                                            <div className="flex items-center gap-3 bg-black/40 rounded-lg p-1 border border-white/10">
                                                                <button onClick={() => item.quantity > 1 ? updateQuantity(item.signature, -1) : confirmRemoveItem(item.signature)} className="w-6 h-6 flex items-center justify-center rounded bg-white/10 hover:bg-(--color-gold) hover:text-black transition-colors">
                                                                    {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-red-400" /> : <Minus className="w-3 h-3" />}
                                                                </button>
                                                                <span className="text-xs font-mono font-bold w-4 text-center">{item.quantity}</span>
                                                                <button onClick={() => updateQuantity(item.signature, 1)} className="w-6 h-6 flex items-center justify-center rounded bg-white/10 hover:bg-(--color-gold) hover:text-black transition-colors">
                                                                    <Plus className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                            {item.customerNote && <div className="text-[10px] text-gray-500 italic max-w-30 truncate text-right">Note: {item.customerNote}</div>}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>

                            {/* 2. BILL & CHECKOUT (SCROLLS WITH ITEMS) */}
                            {cartItems.length > 0 && (
                                <div className="p-6 pt-8 mt-auto">
                                    <Separator className="bg-white/10 mb-6" />

                                    {/* Custom Searchable Dropdown */}
                                    <SearchableAreaSelector onSelect={onAreaSelect} selectedPrice={deliveryFee} />

                                    {/* Bill Breakdown */}
                                    <div className="space-y-3 mt-6 bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span>Subtotal</span>
                                            <span>Rs {cartTotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span>Tax (15%)</span>
                                            <span>Rs {Math.round(taxAmount).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span>Delivery Fee</span>
                                            <span className={deliveryFee > 0 ? "text-white" : "text-gray-600"}>
                                                {deliveryFee > 0 ? `Rs ${deliveryFee}` : "Calculated at checkout"}
                                            </span>
                                        </div>
                                        <div className="h-px bg-white/10 my-2" />
                                        <div className="flex justify-between text-base font-bold text-white items-end">
                                            <span className="uppercase text-xs tracking-wider text-(--color-gold)">Grand Total</span>
                                            <span className="text-xl font-mono">Rs {Math.round(grandTotal).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <div className="mt-6 space-y-3">
                                        <SheetClose asChild>
                                            <Button
                                                onClick={handleCheckout}
                                                disabled={deliveryFee === 0} // Optional: Force area selection?
                                                className="w-full bg-(--color-gold) text-black hover:bg-[#b89445] font-bold h-14 text-sm tracking-widest uppercase rounded-xl shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Secure Checkout <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </SheetClose>
                                        <p className="text-[10px] text-center text-gray-600 leading-tight px-4">
                                            *Please select a delivery area to proceed. Taxes are calculated on the base price.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => removeFromCart(itemToDelete)}
                title="Remove Item?"
                description="Are you sure you want to remove this item from your cart?"
                confirmText="Remove"
                variant="destructive"
            />
        </>
    );
};

export default CartSheet;