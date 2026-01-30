"use client";
import React, { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const CheckoutSection = ({ deliveryFee, handleCheckout }) => {
    // Dynamic Date Calculation
    const deliveryEstimate = useMemo(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 45);

        // Formatting
        const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
        const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

        const formattedDate = now.toLocaleDateString('en-US', dateOptions);
        const formattedTime = now.toLocaleTimeString('en-US', timeOptions);

        return { date: formattedDate, time: formattedTime };
    }, []); 

    return (
        <div className="mt-6 space-y-3">
            <SheetClose asChild>
                <Button
                    onClick={handleCheckout}
                    disabled={deliveryFee === 0}
                    className="w-full bg-(--color-gold) text-black hover:bg-[#b89445] font-bold h-14 text-sm tracking-widest uppercase rounded-xl shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Secure Checkout <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </SheetClose>

            {/* Dynamic Delivery Estimate Text */}
            <div className="text-[10px] text-center text-gray-500 leading-relaxed px-2 mb-24">
                <p>
                    Your order will be delivered approximately in <span className="text-white font-bold">45 minutes</span> on <br />
                    <span className="text-(--color-gold)">{deliveryEstimate.date}</span> at <span className="text-(--color-gold)">{deliveryEstimate.time}</span>
                </p>
            </div>
        </div>
    );
};

export default CheckoutSection;