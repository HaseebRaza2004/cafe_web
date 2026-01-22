"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export default function DealModal({ deal, isOpen, setIsOpen }) {
    const { addToCart } = useCart();
    const { error: showError } = useToast();

    const [currentStep, setCurrentStep] = useState(0);
    const [selections, setSelections] = useState({});
    const [quantity, setQuantity] = useState(1);

    const groups = useMemo(() => deal?.itemGroups || [], [deal]);
    const currentGroup = groups[currentStep];
    const isFixedDeal = groups.length === 0;

    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                setCurrentStep(0);
                setSelections({});
                setQuantity(1);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const extraPriceTotal = useMemo(() => {
        let total = 0;
        Object.entries(selections).forEach(([stepIdx, stepData]) => {
            const group = groups[stepIdx];
            if (!group) return;

            Object.entries(stepData).forEach(([prodId, qty]) => {
                let extra = 0;
                if (group.specificProducts?.length > 0) {
                    const conf = group.specificProducts.find(p => (p.product?._id === prodId || p.product === prodId));
                    extra = conf?.extraPrice || 0;
                }
                total += (extra * qty);
            });
        });
        return total;
    }, [selections, groups]);

    const stepItems = useMemo(() => {
        if (!deal || !currentGroup) return [];

        if (currentGroup.specificProducts && currentGroup.specificProducts.length > 0) {
            return currentGroup.specificProducts.map(item => {
                const productObj = item.product;
                if (!productObj || typeof productObj !== 'object') return null;
                return {
                    ...productObj,
                    _id: productObj._id,
                    extraCharge: item.extraPrice || 0
                };
            }).filter(Boolean);
        }

        return [];
    }, [deal, currentGroup]);

    const updateQuantity = (productId, change) => {
        if (!currentGroup) return;
        const currentStepSelections = selections[currentStep] || {};
        const currentQty = currentStepSelections[productId] || 0;
        const totalSelectedInStep = Object.values(currentStepSelections).reduce((a, b) => a + b, 0);
        const maxSel = currentGroup?.maxSelection || 1;

        if (maxSel === 1) {
            if (change > 0) setSelections(prev => ({ ...prev, [currentStep]: { [productId]: 1 } }));
            return;
        }

        if (change > 0) {
            if (totalSelectedInStep < maxSel) {
                setSelections(prev => ({ ...prev, [currentStep]: { ...currentStepSelections, [productId]: currentQty + 1 } }));
            } else {
                showError(`Max limit reached (${maxSel})`);
            }
        } else {
            if (currentQty > 0) {
                const newQty = currentQty - 1;
                const newStepSelections = { ...currentStepSelections, [productId]: newQty };
                if (newQty === 0) delete newStepSelections[productId];
                setSelections(prev => ({ ...prev, [currentStep]: newStepSelections }));
            }
        }
    };

    const handleNext = () => {
        const currentStepSelections = selections[currentStep] || {};
        const totalSelected = Object.values(currentStepSelections).reduce((a, b) => a + b, 0);
        const minSel = currentGroup?.minSelection || 1;

        if (totalSelected < minSel) {
            showError(`Select at least ${minSel} items.`);
            return;
        }
        if (currentStep < groups.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleAddToCart();
        }
    };

    const handleAddToCart = () => {
        const formattedOptions = [];
        Object.entries(selections).forEach(([stepIdx, stepData]) => {
            const group = groups[stepIdx];
            Object.entries(stepData).forEach(([prodId, qty]) => {
                let prodTitle = "Item";
                let extra = 0;

                if (group?.specificProducts) {
                    const conf = group.specificProducts.find(p => p.product?._id === prodId);
                    if (conf && conf.product) {
                        prodTitle = conf.product.title;
                        extra = conf.extraPrice || 0;
                    }
                }

                for (let i = 0; i < qty; i++) {
                    formattedOptions.push({
                        group: group?.heading || "Option",
                        name: prodTitle + (extra > 0 ? ` (+${extra})` : "")
                    });
                }
            });
        });

        const finalPrice = (deal.price + extraPriceTotal) * quantity;
        addToCart(deal, quantity, formattedOptions, finalPrice);
        setIsOpen(false);
    };

    if (!deal) return null;

    const currentStepSelections = selections[currentStep] || {};
    const totalSelectedInStep = Object.values(currentStepSelections).reduce((a, b) => a + b, 0);
    const isSingleSelect = (currentGroup?.maxSelection || 1) === 1;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="w-[95vw] sm:max-w-[95vw] md:max-w-3xl lg:max-w-5xl h-[90vh] md:h-auto md:max-h-[85vh] p-0 gap-0 flex flex-col bg-black/60 backdrop-blur-xl border border-(--color-gold) text-white overflow-hidden rounded-2xl shadow-2xl">
                <VisuallyHidden.Root>
                    <DialogTitle>{deal.title}</DialogTitle>
                    <DialogDescription>Customize Deal</DialogDescription>
                </VisuallyHidden.Root>

                <div className="absolute top-4 right-4 z-50 hidden md:flex gap-2">
                    <button onClick={() => setIsOpen(false)} className="bg-black/40 backdrop-blur-md p-2 rounded-full text-white border border-white/10 hover:bg-red-500/20 hover:text-red-500 transition-all"><X className="w-5 h-5" /></button>
                </div>

                <div className="flex flex-col md:flex-row flex-1 min-h-0">
                    {/* LEFT: IMAGE */}
                    <div className="relative w-full md:w-[45%] h-40 md:h-auto shrink-0 bg-black/50">
                        <Image src={deal.image || "/placeholder.jpg"} alt={deal.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority={true} />
                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent md:bg-linear-to-r md:from-transparent md:to-black/90" />
                        <button onClick={() => setIsOpen(false)} className="absolute top-3 left-3 md:hidden z-20 bg-black/40 backdrop-blur-md p-2 rounded-full text-white border border-white/10"><X className="w-4 h-4" /></button>
                    </div>

                    {/* RIGHT: CONTENT */}
                    <div className="flex flex-col w-full md:w-[55%] min-h-0 relative">
                        <div className="flex-1 overflow-y-auto no-scrollbar p-5 md:p-8 space-y-6">
                            <div>
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-white mb-2 leading-tight pr-8">{deal.title}</h2>
                                <p className="text-gray-300 text-xs md:text-sm leading-relaxed opacity-80">{deal.desc}</p>
                                <div className="mt-3 inline-block px-3 py-1 rounded-full border border-(--color-gold) text-(--color-gold) text-sm md:text-base font-bold font-mono bg-gold/10">Rs {deal.price}</div>
                            </div>
                            <div className="h-px bg-white/10 w-full" />

                            {isFixedDeal ? (
                                <div className="py-10 text-center">
                                    <div className="inline-flex bg-white/5 p-4 rounded-full mb-4 border border-white/10">
                                        <ShoppingBag className="w-8 h-8 text-(--color-gold)" />
                                    </div>
                                    <p className="text-gray-400 text-sm">This is a complete package. <br />Add to cart directly.</p>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <span className="text-(--color-gold) font-bold uppercase text-[10px] md:text-xs tracking-wider mb-1 block">Step {currentStep + 1} / {groups.length}</span>
                                            <h3 className="text-lg md:text-xl font-bold text-white">{currentGroup.heading}</h3>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-gray-500 text-[10px] uppercase tracking-wider block mb-1">Required</span>
                                            <div className="bg-white/5 px-3 py-1 rounded border border-white/10 text-xs font-mono text-white">{totalSelectedInStep} / {currentGroup.maxSelection}</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        {stepItems.map((prod) => {
                                            const qty = currentStepSelections[prod._id] || 0;
                                            const isSelected = qty > 0;
                                            return (
                                                <div key={prod._id} onClick={() => isSingleSelect ? updateQuantity(prod._id, 1) : null} className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-200 select-none cursor-pointer ${isSelected ? "border-(--color-gold) bg-gold/10 shadow-[0_0_10px_rgba(197,160,89,0.1)]" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                                                    <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-black border border-white/5">
                                                        <Image src={prod.image || "/placeholder.jpg"} alt={prod.title} fill className="object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className={`text-sm font-bold truncate ${isSelected ? "text-(--color-gold)" : "text-white"}`}>{prod.title}</h4>
                                                        {prod.extraCharge > 0 && <span className="text-[10px] text-gray-400 bg-white/5 px-1.5 py-0.5 rounded mt-1 inline-block border border-white/10">+ Rs {prod.extraCharge}</span>}
                                                    </div>
                                                    {isSingleSelect ? (
                                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isSelected ? "border-(--color-gold) bg-(--color-gold)" : "border-gray-600"}`}>{isSelected && <div className="w-2 h-2 bg-black rounded-full" />}</div>
                                                    ) : (
                                                        <div className="flex items-center gap-3 bg-black/40 rounded-lg p-1 border border-white/10" onClick={(e) => e.stopPropagation()}>
                                                            <button onClick={() => updateQuantity(prod._id, -1)} className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors ${qty > 0 ? "bg-white/10 hover:bg-red-500/20 text-white" : "text-gray-600 cursor-not-allowed"}`} disabled={qty === 0}><Minus className="w-3 h-3" /></button>
                                                            <span className="text-sm font-bold w-4 text-center text-white">{qty}</span>
                                                            <button onClick={() => updateQuantity(prod._id, 1)} className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors ${totalSelectedInStep < currentGroup.maxSelection ? "bg-white/10 hover:bg-green-500/20 text-white" : "text-gray-600 cursor-not-allowed"}`} disabled={totalSelectedInStep >= currentGroup.maxSelection}><Plus className="w-3 h-3" /></button>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                        {stepItems.length === 0 && <div className="flex flex-col items-center justify-center text-gray-500 gap-3 py-10"><ShoppingBag className="w-8 h-8 opacity-20" /><p className="text-xs">No items configured.</p></div>}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 md:p-6 border-t border-white/10 bg-black/60 backdrop-blur-xl shrink-0 z-10">
                            <div className="flex items-center gap-4">
                                {currentStep > 0 ? (
                                    <Button onClick={() => setCurrentStep(prev => prev - 1)} className="h-12 bg-white/10 hover:bg-white/20 text-white font-bold px-6">Back</Button>
                                ) : (
                                    <div className="flex items-center bg-white/5 rounded-lg border border-white/10 h-12">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 h-full hover:text-(--color-gold) hover:bg-white/5 transition-colors"><Minus className="w-4 h-4" /></button>
                                        <span className="w-10 text-center font-bold text-lg font-mono">{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className="px-4 h-full hover:text-(--color-gold) hover:bg-white/5 transition-colors"><Plus className="w-4 h-4" /></button>
                                    </div>
                                )}
                                <Button onClick={isFixedDeal || currentStep === groups.length - 1 ? handleAddToCart : handleNext} className="flex-1 h-12 bg-(--color-gold) text-black hover:bg-[#a68545] font-bold text-sm md:text-base uppercase tracking-widest transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(197,160,89,0.3)]">
                                    {isFixedDeal || currentStep === groups.length - 1 ? <>Add Deal • Rs {(deal.price + extraPriceTotal) * quantity}</> : <>Next Step</>}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}