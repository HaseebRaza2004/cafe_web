"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, ChevronLeft, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export default function DealModal({ deal, isOpen, setIsOpen, allProducts = [] }) {
    const { addToCart } = useCart();
    const { error: showError } = useToast();

    // --- 1. Hooks ---
    const [currentStep, setCurrentStep] = useState(0);
    const [selections, setSelections] = useState({});
    const [quantity, setQuantity] = useState(1);

    // Derived State with Fallbacks
    const groups = deal?.itemGroups || [];
    const currentGroup = groups[currentStep]; // Can be undefined

    // --- Filter Products Logic (Safe Version) ---
    const stepProducts = useMemo(() => {
        // 🔥 CRITICAL FIX: If group is missing, return empty array immediately
        if (!deal || !currentGroup) return [];

        // Option A: Specific Products
        if (currentGroup.specificProducts && currentGroup.specificProducts.length > 0) {
            return currentGroup.specificProducts.map(p =>
                typeof p === 'object' ? p : allProducts.find(ap => ap._id === p)
            ).filter(Boolean);
        }

        // Option B: Category
        if (currentGroup.category) {
            const catId = typeof currentGroup.category === 'object' ? currentGroup.category._id : currentGroup.category;
            const catName = typeof currentGroup.category === 'object' ? currentGroup.category.name : null;

            return allProducts.filter(p =>
                (catId && p.category === catId) ||
                (catName && p.category === catName) ||
                (p.category === catName)
            );
        }
        return [];
    }, [deal, currentGroup, allProducts]);

    // --- 2. Handlers ---
    const toggleSelection = (productId) => {
        if (!currentGroup) return; // Safety check

        const currentSelected = selections[currentStep] || [];
        const isSelected = currentSelected.includes(productId);

        if (isSelected) {
            setSelections(prev => ({ ...prev, [currentStep]: currentSelected.filter(id => id !== productId) }));
        } else {
            if (currentSelected.length >= currentGroup.maxSelection) {
                if (currentGroup.maxSelection === 1) {
                    setSelections(prev => ({ ...prev, [currentStep]: [productId] }));
                } else {
                    showError(`You can only select ${currentGroup.maxSelection} items.`);
                }
            } else {
                setSelections(prev => ({ ...prev, [currentStep]: [...currentSelected, productId] }));
            }
        }
    };

    const handleNext = () => {
        if (!currentGroup) return; // Safety check

        const currentSelected = selections[currentStep] || [];
        if (currentSelected.length < currentGroup.minSelection) {
            showError(`Select at least ${currentGroup.minSelection} items.`);
            return;
        }
        if (currentStep < groups.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleAddToCart();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    const handleAddToCart = () => {
        const finalSelections = Object.entries(selections).map(([stepIdx, productIds]) => {
            const group = groups[stepIdx];
            const items = productIds.map(id => {
                const prod = stepProducts.find(p => p._id === id) || allProducts.find(p => p._id === id);
                return prod ? prod.title : "Unknown Item";
            });
            return { groupName: group?.heading || "Option", items: items };
        });

        const formattedOptions = finalSelections.flatMap(fs =>
            fs.items.map(item => ({ group: fs.groupName, name: item }))
        );

        addToCart(deal, quantity, formattedOptions, deal.price * quantity);
        setIsOpen(false);
        setTimeout(() => {
            setCurrentStep(0);
            setSelections({});
        }, 300);
    };

    // --- 3. Safety Returns ---
    if (!deal) return null;

    // 🔥 CRITICAL FIX: Don't render UI if currentGroup is missing
    if (!currentGroup) {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="bg-black border-white/10 text-white">
                    <VisuallyHidden.Root>
                        <DialogTitle>Unavailable</DialogTitle>
                    </VisuallyHidden.Root>
                    <div className="p-4 text-center text-gray-400">
                        This deal is not properly configured. Please contact support.
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="w-[95vw] max-w-5xl h-[85vh] p-0 bg-[#0a0a0a] border border-(--color-gold) text-white overflow-hidden flex flex-col md:flex-row rounded-3xl shadow-2xl">

                <VisuallyHidden.Root>
                    <DialogTitle>{deal.title} Customization</DialogTitle>
                    <DialogDescription>Select options for {deal.title}</DialogDescription>
                </VisuallyHidden.Root>

                {/* LEFT: Hero Image & Info */}
                <div className="w-full md:w-[40%] bg-[#111] relative flex flex-col h-40 md:h-auto border-b md:border-b-0 md:border-r border-white/10">
                    <div className="relative h-full w-full">
                        <Image src={deal.image || "/placeholder.jpg"} alt={deal.title} fill className="object-cover opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />

                        <button onClick={() => setIsOpen(false)} className="absolute top-4 left-4 p-2 bg-black/60 rounded-full md:hidden text-white border border-white/10 z-10"><X className="w-5 h-5" /></button>

                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                            <span className="bg-(--color-gold) text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block shadow-lg">Combo Deal</span>
                            <h2 className="text-2xl md:text-4xl font-bold font-display text-white leading-none mb-2">{deal.title}</h2>
                            <p className="text-gray-400 text-sm line-clamp-2">{deal.desc}</p>
                            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                                <span className="text-gray-500 text-xs uppercase tracking-widest">Base Price</span>
                                <span className="text-2xl font-bold text-(--color-gold)">Rs {deal.price}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Interaction Area (List View) */}
                <div className="flex-1 flex flex-col min-h-0 bg-[#0a0a0a] relative">

                    <button onClick={() => setIsOpen(false)} className="hidden md:block absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-20 text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>

                    <div className="px-6 py-6 md:pt-10 md:px-8 border-b border-white/5 bg-[#0a0a0a]">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <span className="text-(--color-gold) text-xs font-bold uppercase tracking-widest mb-1 block">
                                    Step {currentStep + 1} / {groups.length}
                                </span>
                                <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">{currentGroup.heading}</h3>
                            </div>
                            <div className="text-right">
                                <span className="text-gray-500 text-xs block mb-1">Required</span>
                                <div className="bg-white/5 px-3 py-1 rounded-md text-white font-mono text-sm border border-white/10">
                                    {selections[currentStep]?.length || 0} / {currentGroup.maxSelection}
                                </div>
                            </div>
                        </div>
                        <div className="h-1 w-full bg-white/10 rounded-full mt-3 overflow-hidden">
                            <div className="h-full bg-(--color-gold) transition-all duration-500 ease-out" style={{ width: `${((currentStep + 1) / groups.length) * 100}%` }} />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-[#0a0a0a]">
                        <div className="flex flex-col gap-3">
                            {stepProducts.map((prod) => {
                                const isSelected = selections[currentStep]?.includes(prod._id);
                                return (
                                    <div
                                        key={prod._id}
                                        onClick={() => toggleSelection(prod._id)}
                                        className={`group flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all duration-200 
                                            ${isSelected
                                                ? "border-(--color-gold) bg-(--color-gold)/10 shadow-[0_0_15px_rgba(197,160,89,0.1)]"
                                                : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                                            }`}
                                    >
                                        <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-black">
                                            <Image src={prod.image || "/placeholder.jpg"} alt={prod.title} fill className="object-cover" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className={`text-sm font-bold truncate ${isSelected ? "text-(--color-gold)" : "text-white"}`}>
                                                {prod.title}
                                            </h4>
                                        </div>

                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all 
                                            ${isSelected
                                                ? "bg-(--color-gold) border-(--color-gold)"
                                                : "border-gray-600 group-hover:border-gray-400"
                                            }`}>
                                            {isSelected && <Check className="w-4 h-4 text-black stroke-[3]" />}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {stepProducts.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3 py-10">
                                <ShoppingBag className="w-10 h-10 opacity-20" />
                                <p className="text-sm">No items available in this step.</p>
                            </div>
                        )}
                    </div>

                    <div className="p-5 md:p-6 border-t border-white/5 bg-[#0a0a0a] flex items-center justify-between">
                        {currentStep > 0 ? (
                            <Button onClick={handleBack} variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5 px-4">
                                <ChevronLeft className="w-4 h-4 mr-2" /> Back
                            </Button>
                        ) : (
                            <div />
                        )}

                        <Button
                            onClick={handleNext}
                            className="bg-(--color-gold) text-black font-bold px-8 h-12 rounded-xl hover:bg-[#d4af66] transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(197,160,89,0.2)]"
                        >
                            {currentStep === groups.length - 1 ? (
                                <>Add to Order — Rs {deal.price * quantity}</>
                            ) : (
                                <>Next Step <ChevronRight className="w-4 h-4 ml-2" /></>
                            )}
                        </Button>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}