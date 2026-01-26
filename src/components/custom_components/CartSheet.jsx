"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";

const CartSheet = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
    const router = useRouter();

    const handleCheckout = () => {
        // Close sheet logic is handled by Sheet primitive usually, 
        // but we can programmatically navigate.
        // SheetClose can wrap the button if we want auto-close.
        router.push("/checkout");
    };

    return (
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

            <SheetContent side="right" aria-describedby={undefined} className="w-full sm:max-w-md bg-black/95 border-l border-white/10 backdrop-blur-xl p-0 flex flex-col h-full text-white">

                <SheetDescription className="sr-only">
                    Review your selected items before checkout
                </SheetDescription>

                {/* --- SHEET HEADER --- */}
                <SheetHeader className="p-6 border-b border-white/10 bg-black/50">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-2xl font-bold font-display text-white tracking-wide">
                            Your <span className="text-(--color-gold)">Order</span>
                        </SheetTitle>
                        {/* Close button is auto-added by Shadcn, but we can customize if needed */}
                    </div>
                </SheetHeader>

                {/* --- CART ITEMS SCROLL AREA --- */}
                <ScrollArea className="flex-1 p-6">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500 space-y-4">
                            <ShoppingBag className="w-16 h-16 opacity-20" />
                            <p className="text-sm uppercase tracking-widest">Cart is Empty</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <AnimatePresence initial={false}>
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item.signature}
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20, height: 0 }}
                                        className="group flex gap-4 bg-white/5 border border-white/5 rounded-xl p-3 hover:border-gold/30 transition-all"
                                    >
                                        {/* Image */}
                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-white/10">
                                            <Image
                                                src={item.image || "/placeholder.jpg"}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Content Container */}
                                        <div className="flex-1 flex flex-col justify-between min-w-0">

                                            {/* ZONE 1: Header (Title & Controls) */}
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-sm md:text-base text-white truncate pr-2">
                                                    {item.title}
                                                </h4>

                                                {/* Quantity Controls - Compact */}
                                                <div className="flex items-center gap-2 bg-black/40 rounded-lg p-1 border border-white/10">
                                                    <button
                                                        onClick={() => item.quantity > 1 ? updateQuantity(item.signature, -1) : removeFromCart(item.signature)}
                                                        className="w-5 h-5 flex items-center justify-center rounded bg-white/10 hover:bg-(--color-gold) hover:text-black transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-xs font-mono font-bold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.signature, 1)}
                                                        className="w-5 h-5 flex items-center justify-center rounded bg-white/10 hover:bg-(--color-gold) hover:text-black transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* ZONE 2: Body (Selected Options) */}
                                            {item.selectedOptions && item.selectedOptions.length > 0 && (
                                                <div className="mt-1 text-[11px] text-gray-400 space-y-0.5">
                                                    {item.selectedOptions.map((opt, idx) => (
                                                        <div key={idx} className="flex justify-between">
                                                            <span>• {opt.name}</span>
                                                            {opt.price > 0 && <span className="text-gray-500">+Rs {opt.price}</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* ZONE 3: Footer (Note & Price) */}
                                            <div className="flex justify-between items-end mt-2">
                                                <div className="flex-1 pr-2">
                                                    {item.customerNote && (
                                                        <p className="text-[10px] text-gold/80 italic line-clamp-1">
                                                            &quot;{item.customerNote}&quot;
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="font-bold text-(--color-gold) text-sm">
                                                    Rs {(item.price * item.quantity).toLocaleString()}
                                                </div>
                                            </div>

                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </ScrollArea>

                {/* --- SHEET FOOTER (Checkout) --- */}
                {cartItems.length > 0 && (
                    <div className="p-6 bg-black/80 border-t border-white/10 space-y-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal</span>
                                <span>Rs {cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-white font-bold text-lg">
                                <span>Total</span>
                                <span className="text-(--color-gold)">Rs {cartTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <SheetClose asChild>
                            <Button
                                onClick={handleCheckout}
                                className="w-full bg-(--color-gold) text-black hover:bg-[#b89445] font-bold py-6 text-base tracking-widest uppercase rounded-xl"
                            >
                                Proceed to Checkout
                            </Button>
                        </SheetClose>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default CartSheet;