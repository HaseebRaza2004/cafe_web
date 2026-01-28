"use client";
import React from "react";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";

const CartHeader = () => {
    return (
        <SheetHeader className="p-6 border-b border-white/10 bg-black/50 shrink-0 z-10 backdrop-blur-md">
            <div className="flex items-center justify-between">
                <SheetTitle className="text-2xl font-bold font-display text-white tracking-wide">
                    Your <span className="text-(--color-gold)">Order</span>
                </SheetTitle>
            </div>
        </SheetHeader>
    );
};

export default CartHeader;