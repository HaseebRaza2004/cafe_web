"use client";
import React from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const DealFooter = ({
    isFixedDeal,
    isLastStep,
    quantity,
    setQuantity,
    onAction,
    totalPrice,
    isEditing
}) => {
    return (
        <div className="p-4 md:p-6 border-t border-white/10 bg-black/60 backdrop-blur-xl shrink-0 z-10 w-full mt-auto">
            <div className="flex items-center gap-4">

                {/* Quantity Control */}
                {(!isFixedDeal && !isLastStep) ? (
                    <div className="h-12 w-12 hidden md:block" />
                ) : (
                    <div className="flex items-center bg-white/5 rounded-lg border border-white/10 h-12">
                        <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        className="px-4 h-full hover:text-(--color-gold) hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            <Minus className="w-4 h-4" />
                            </button>
                        <span className="w-10 text-center font-bold text-lg font-mono">{quantity}</span>
                        <button 
                        onClick={() => setQuantity(quantity + 1)} 
                        className="px-4 h-full hover:text-(--color-gold) hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            </button>
                    </div>
                )}

                <Button
                    onClick={onAction}
                    className="flex-1 h-12 bg-(--color-gold) text-black hover:bg-[#a68545] font-bold text-sm md:text-base uppercase tracking-widest transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(197,160,89,0.3)] cursor-pointer"
                >
                    {(isFixedDeal || isLastStep)
                        ? (isEditing
                            ? `Update Deal • Rs ${totalPrice.toLocaleString()}`
                            : `Add Deal • Rs ${totalPrice.toLocaleString()}`)
                        : "Next Step"
                    }
                </Button>
            </div>
        </div>
    );
};

export default DealFooter;