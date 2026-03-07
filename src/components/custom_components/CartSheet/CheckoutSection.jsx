"use client";

import React, { useMemo, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/custom_components/ConfirmModal";
import { useCart } from "@/context/CartContext";

const CheckoutSection = ({ deliveryFee, handleCheckout }) => {
    const { storeStatus } = useCart();
    const { isOpen, isForceClosed, loadingStatus, openTimeMsg, closeTimeMsg } = storeStatus;
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

    // Time Calculation
    const deliveryEstimate = useMemo(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 45);

        const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
        const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

        const formattedDate = now.toLocaleDateString('en-US', dateOptions);
        const formattedTime = now.toLocaleTimeString('en-US', timeOptions);

        return { date: formattedDate, time: formattedTime };
    }, []);

    const onCheckoutClick = (e) => {
        if (!loadingStatus && !isOpen) {
            e.preventDefault();
            setIsAlertModalOpen(true);
        } else {
            handleCheckout();
        }
    };

    return (
        <div className="mt-6 space-y-3">

            <SheetClose asChild>
                <Button
                    onClick={onCheckoutClick}
                    disabled={deliveryFee === 0 || loadingStatus}
                    className="w-full bg-(--color-gold) text-black hover:bg-[#b89445] font-bold h-14 text-sm tracking-widest uppercase rounded-xl shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loadingStatus ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <>
                            Secure Checkout <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </Button>
            </SheetClose>

            <div className="text-[10px] text-center text-gray-500 leading-relaxed px-2 mb-24">
                <p>
                    Your order will be delivered approximately in <span className="text-white font-bold">45 minutes</span> on <br />
                    <span className="text-(--color-gold)">{deliveryEstimate.date}</span> at <span className="text-(--color-gold)">{deliveryEstimate.time}</span>
                </p>
            </div>

            {/* ALERT MODAL */}
            <ConfirmModal
                isOpen={isAlertModalOpen}
                onClose={() => setIsAlertModalOpen(false)}
                onConfirm={() => setIsAlertModalOpen(false)}
                title={isForceClosed ? "System Maintenance" : "Store Closed"}
                description={
                    isForceClosed
                        ? "Due to scheduled maintenance, our system is temporarily paused. Please check back shortly for a premium experience."
                        : `We are currently closed. Our operating hours are from ${openTimeMsg} to ${closeTimeMsg} PKT. Orders will be accepted during these hours.`
                }
                confirmText="Understood"
                variant="default"
            />
        </div>
    );
};

export default CheckoutSection;