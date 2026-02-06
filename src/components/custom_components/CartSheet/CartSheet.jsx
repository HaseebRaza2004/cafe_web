"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import ConfirmModal from "../ConfirmModal";
import CartHeader from "./CartHeader";
import CartItem from "./CartItem";
import DeliverySelector from "./DeliverySelector";
import CheckoutSection from "./CheckoutSection";
import CartSkeleton from "@/components/custom_components/skeletons/CartSkeleton";

const CartSheet = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, isLoaded, deliveryFee, setDeliveryInfo } = useCart();
    const router = useRouter();

    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const TAX_RATE = 0.15;
    const taxAmount = cartTotal > 0 ? cartTotal * TAX_RATE : 0;
    const grandTotal = cartTotal + taxAmount + deliveryFee;

    const handleCheckout = () => router.push(`/checkout`);

    const confirmRemoveItem = (signature) => {
        setItemToDelete(signature);
        setIsDeleteModalOpen(true);
    };

    const onAreaSelect = (price, name) => setDeliveryInfo(price, name);

    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <button className="relative p-2 hover:bg-white/10 rounded-full transition-colors group">
                        <ShoppingBag className="w-6 h-6 text-white group-hover:text-(--color-gold) transition-colors cursor-pointer" />
                        {isLoaded && cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-(--color-gold) text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-in zoom-in">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </SheetTrigger>

                <SheetContent side="right" aria-describedby={undefined} className="w-full sm:max-w-md bg-black/95 border-l border-white/10 backdrop-blur-xl p-0 flex flex-col h-dvh text-white">
                    <SheetDescription className="sr-only">Cart Summary</SheetDescription>
                    <CartHeader />

                    <ScrollArea className="flex-1 w-full h-full">
                        <div className="flex flex-col min-h-full">

                            {/* HYDRATION SKELETON */}
                            {!isLoaded ? (
                                <CartSkeleton />
                            ) : (
                                <>
                                    {/* Empty State */}
                                    {cartItems.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-6 p-6">
                                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                                                <ShoppingBag className="w-8 h-8 opacity-40" />
                                            </div>
                                            <div className="text-center space-y-2">
                                                <p className="text-xl font-bold text-(--color-gold) tracking-wide">Your Cart is Empty</p>
                                                <p className="text-sm text-gray-400 max-w-50 mx-auto leading-relaxed">Delicious food is just a click away.</p>
                                            </div>
                                            <SheetClose asChild>
                                                <Button
                                                    variant="outline"
                                                    className="bg-(--color-gold) border-none text-black hover:bg-(--color-gold-dark) px-8 py-6 text-lg rounded-md uppercase tracking-widest font-bold transition-all duration-400 hover:scale-105"
                                                >
                                                    Browse Menu
                                                </Button>
                                            </SheetClose>
                                        </div>
                                    )}

                                    {/* Items List */}
                                    {cartItems.length > 0 && (
                                        <div className="p-6 pb-0 space-y-4">
                                            <AnimatePresence initial={false}>
                                                {cartItems.map((item) => (
                                                    <CartItem
                                                        key={item.signature}
                                                        item={item}
                                                        updateQuantity={updateQuantity}
                                                        confirmRemoveItem={confirmRemoveItem}
                                                    />
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    )}

                                    {/* Bill Section */}
                                    {cartItems.length > 0 && (
                                        <div className="p-6 pt-8 mt-auto">
                                            <Separator className="bg-white/10 mb-6" />
                                            <DeliverySelector onSelect={onAreaSelect} selectedPrice={deliveryFee} />

                                            <div className="space-y-3 mt-6 bg-white/5 p-4 rounded-xl border border-white/5">
                                                <div className="flex justify-between text-xs text-gray-400"><span>Subtotal</span><span>Rs {cartTotal.toLocaleString()}</span></div>
                                                <div className="flex justify-between text-xs text-gray-400"><span>Tax (15%)</span><span>Rs {Math.round(taxAmount).toLocaleString()}</span></div>
                                                <div className="flex justify-between text-xs text-gray-400">
                                                    <span>Delivery Fee</span>
                                                    <span className={deliveryFee > 0 ? "text-white" : "text-gray-600"}>{deliveryFee > 0 ? `Rs ${deliveryFee}` : "Calculated at checkout"}</span>
                                                </div>
                                                <div className="h-px bg-white/10 my-2" />
                                                <div className="flex justify-between text-base font-bold text-white items-end">
                                                    <span className="uppercase text-xs tracking-wider text-(--color-gold)">Grand Total</span>
                                                    <span className="text-xl font-mono">Rs {Math.round(grandTotal).toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <CheckoutSection deliveryFee={deliveryFee} handleCheckout={handleCheckout} />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => removeFromCart(itemToDelete)}
                title="Remove Item?"
                description="Are you sure you want to remove this item?"
                confirmText="Remove"
                variant="destructive"
            />
        </>
    );
};

export default CartSheet;