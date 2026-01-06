"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, ShoppingCart, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ProductModal from "./ProductModal";

const CartSheet = () => {
    const { cartItems, removeFromCart, updateItemQuantity, subtotal, tax, deliveryFee, grandTotal, deliveryArea, setDeliveryArea, deliveryCharges } = useCart();

    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle Opening Modal
    const openItemDetail = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };
    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    {/* Header ka Cart Button yahan aa gaya */}
                    <Button
                        variant="ghost"
                        className="relative w-16 h-16 rounded-full hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                    >
                        <ShoppingCart className="w-9! h-9! text-white group-hover:text-(--color-gold) transition-colors" />
                        {cartItems.length > 0 && (
                            <span className="absolute top-2 right-2 w-5 h-5 bg-(--color-gold) text-black text-[10px] font-bold flex items-center justify-center rounded-full animate-bounce shadow-lg border border-black">
                                {cartItems.length}
                            </span>
                        )}
                    </Button>
                </SheetTrigger>

                {/* Sheet Content - Luxury Theme */}
                <SheetContent side="right" className="w-full sm:max-w-md bg-black/60 backdrop-blur-xl border-l border-(--color-gold) text-white p-0 flex flex-col">

                    <SheetHeader className="p-6 border-b border-white/10 bg-black/50">
                        <SheetTitle className="text-2xl font-display text-(--color-gold) uppercase tracking-wider">Your Order</SheetTitle>
                        <SheetDescription className="sr-only">
                            Review your selected items and proceed to checkout.
                        </SheetDescription>
                    </SheetHeader>

                    {/* --- CART ITEMS LIST --- */}
                    <div className="flex-1 overflow-hidden relative">
                        {cartItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                                <ShoppingCart className="w-16 h-16 opacity-20 text-(--color-gold)" />
                                <p>Your cart is empty.</p>
                            </div>
                        ) : (
                            <ScrollArea className="h-full p-6">
                                <div className="space-y-6">
                                    {cartItems.map((item, index) => (
                                        <div
                                            key={index}
                                            onClick={() => openItemDetail(item)}
                                            className="flex gap-4 bg-white/5 p-3 rounded-lg border border-white/10 hover:border-gold/50 transition-all cursor-pointer group"
                                        >
                                            {/* Item Image */}
                                            <div className="relative w-20 h-24 rounded-md overflow-hidden shrink-0">
                                                <Image src={item.image} alt={item.title} fill className="object-cover" />
                                            </div>

                                            {/* Item Details */}
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-(--color-gold) transition-colors">{item.title}</h4>
                                                    </div>

                                                    {/* Addons List */}
                                                    {item.addons.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-1 mb-2">
                                                            {item.addons.map(addon => (
                                                                <span key={addon} className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400 capitalize">
                                                                    {addon}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-end justify-between mt-2">
                                                    <p className="text-xs text-(--color-gold) font-mono font-bold">Rs {item.totalPrice}</p>

                                                    {/* --- QUANTITY CONTROLS --- */}
                                                    <div
                                                        className="flex items-center bg-black border border-white/20 rounded-md h-7"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {/* MINUS / TRASH BUTTON */}
                                                        <button
                                                            onClick={() => updateItemQuantity(index, item.quantity - 1)}
                                                            className="w-7 h-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white/5 transition-colors"
                                                        >
                                                            {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                                                        </button>

                                                        {/* QUANTITY NUMBER */}
                                                        <span className="w-6 text-center text-[10px] font-bold text-white">{item.quantity}</span>

                                                        {/* PLUS BUTTON */}
                                                        <button
                                                            onClick={() => updateItemQuantity(index, item.quantity + 1)}
                                                            className="w-7 h-full flex items-center justify-center text-gray-400 hover:text-(--color-gold) hover:bg-white/5 transition-colors"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </div>

                    {/* --- FOOTER (Totals & Checkout) --- */}
                    <div className="p-6 bg-black border-t border-(--color-gold) space-y-4">

                        {/* Delivery Area Selector */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Delivery Area:</span>
                            <Select value={deliveryArea} onValueChange={setDeliveryArea}>
                                <SelectTrigger className="w-45 h-8 bg-white/5 border-white/20 text-white text-xs">
                                    <SelectValue placeholder="Select Area" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1a1a1a] border-(--color-gold) text-white">
                                    {Object.entries(deliveryCharges).map(([area, charge]) => (
                                        <SelectItem key={area} value={area} className="focus:bg-(--color-gold) focus:text-black cursor-pointer">
                                            {area.toUpperCase()} (Rs {charge})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Bill Breakdown */}
                        <div className="space-y-2 pt-4 border-t border-white/10 text-sm">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal</span>
                                <span>Rs {subtotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Tax (15%)</span>
                                <span>Rs {tax}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Delivery Fee</span>
                                <span>Rs {deliveryFee}</span>
                            </div>
                            <div className="flex justify-between text-(--color-gold) font-bold text-lg pt-2 border-t border-white/10">
                                <span>Total</span>
                                <span>Rs {grandTotal}</span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <Button className="w-full bg-(--color-gold) hover:bg-(--color-gold-dark) text-black font-bold uppercase tracking-widest h-12">
                            Checkout (WhatsApp)
                        </Button>
                    </div>

                </SheetContent>
            </Sheet>

            {/* --- PRODUCT DETAIL MODAL --- */}
            {
                selectedItem && (
                    <ProductModal
                        product={selectedItem}
                        isOpen={isModalOpen}
                        setIsOpen={setIsModalOpen}
                        trigger={null}
                    />
                )
            }
        </>
    );
};

export default CartSheet;