"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const OrderSummary = ({ handlePlaceOrder }) => {
    const { cartItems, cartTotal, tax, deliveryFee, grandTotal, deliveryArea } = useCart();

    return (
        <div className="bg-black/60 backdrop-blur-md border border-(--color-gold) rounded-xl p-6 sticky top-28 shadow-[0_0_30px_rgba(197,160,89,0.1)]">
            <h3 className="text-2xl font-display font-bold text-white mb-6 tracking-wide">
                Your Order
            </h3>

            {/* Items List */}
            <div className="space-y-4 mb-6 max-h-100 overflow-y-auto pr-2 no-scrollbar">
                {cartItems.length === 0 ? (
                    <div className="py-8 text-center border border-dashed border-white/20 rounded-lg">
                        <p className="text-gray-500 mb-2">Your cart is empty.</p>
                        <Link href="/" className="text-(--color-gold) hover:underline text-sm font-bold">
                            Go to Menu
                        </Link>
                    </div>
                ) : (
                    cartItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-start border-b border-white/10 pb-4 last:border-0">
                            <div className="flex-1">
                                <p className="text-base font-bold text-white">
                                    <span className="text-(--color-gold) mr-2">{item?.quantity}x</span>
                                    {item?.title}
                                </p>
                                {item?.selectedOptions?.length > 0 && (
                                    <p className="text-xs text-gray-400 mt-1 pl-6">
                                        + {item?.selectedOptions.map(opt => opt.name).join(", ")}
                                    </p>
                                )}
                            </div>
                            <p className="text-base font-mono text-gray-300 font-medium">
                                Rs {(item?.price * item?.quantity).toLocaleString()}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* Bill Details */}
            <div className="space-y-3 pt-4 border-t border-white/20 text-sm">
                <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>Rs {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                    <span>Tax (15%)</span>
                    <span>Rs {Math.round(tax).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                    <span>Delivery Fee {deliveryArea ? `(${deliveryArea})` : ""}</span>
                    <span>Rs {deliveryFee}</span>
                </div>

                <div className="h-px bg-(--color-gold) opacity-30 my-4"></div>

                <div className="flex justify-between text-(--color-gold) font-bold text-xl md:text-2xl">
                    <span>Grand Total</span>
                    <span>Rs {Math.round(grandTotal).toLocaleString()}</span>
                </div>
            </div>

            {/* Place Order Button */}
            <Button
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0}
                className="w-full mt-8 h-14 bg-(--color-gold) hover:bg-[#a68545] text-black font-bold uppercase tracking-widest text-lg shadow-lg hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
                Place Order
            </Button>

            <div className="mt-4 text-center">
                <Link href="/" className="text-sm text-gray-500 hover:text-white underline decoration-dotted transition-colors">
                    &larr; Continue to add more items
                </Link>
            </div>
        </div>
    );
};

export default OrderSummary;