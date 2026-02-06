"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { X, Share2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import ShareMenu from "@/components/custom_components/ShareMenu";
import DealImage from "./DealImage";
import DealInfo from "./DealInfo";
import StepSelector from "./StepSelector";
import DealFooter from "./DealFooter";
import NoteInput from "../ProductModal/NoteInput";


const DealModal = ({ deal, isOpen, setIsOpen, initialState }) => {
    const { addToCart, updateItemInCart } = useCart();
    const { error: showError } = useToast() || {};
    const [currentStep, setCurrentStep] = useState(0);
    const [selections, setSelections] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [note, setNote] = useState("");
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    const groups = useMemo(() => Array.isArray(deal?.itemGroups) ? deal.itemGroups : [], [deal]);
    const currentGroup = groups[currentStep];
    const isFixedDeal = groups.length === 0;

    // INITIALIZE (Edit Mode Logic) 
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setShowShareMenu(false);

                if (initialState) {
                    setQuantity(initialState.quantity);
                    setNote(initialState.note);
                    setCurrentStep(0);
                    const restoredSelections = {};

                    initialState.selections.forEach(opt => {
                        const groupIndex = groups.findIndex(g => g.heading === opt.group);
                        if (groupIndex > -1) {
                            if (!restoredSelections[groupIndex]) restoredSelections[groupIndex] = {};

                            const groupItem = groups[groupIndex].specificProducts.find(
                                sp => sp.product.title === opt.name.replace(/\s\(\+\d+\)$/, "")
                            );

                            if (groupItem) {
                                const pId = groupItem.product._id;
                                restoredSelections[groupIndex][pId] = (restoredSelections[groupIndex][pId] || 0) + 1;
                            }
                        }
                    });
                    setSelections(restoredSelections);
                } else {
                    setCurrentStep(0);
                    setSelections({});
                    setQuantity(1);
                    setNote("");
                }
            }, 0);
            return () => clearTimeout(timer)
        }
    }, [isOpen, deal, groups, initialState]);

    const updateSelectionQuantity = useCallback((productId, change) => {
        if (!currentGroup) return;

        setSelections(prev => {
            const currentStepSelections = prev[currentStep] || {};
            const currentQty = currentStepSelections[productId] || 0;
            const totalSelected = Object.values(currentStepSelections).reduce((a, b) => a + b, 0);
            const maxSel = currentGroup.maxSelection || 1;

            if (change > 0) {
                if (maxSel === 1) return { ...prev, [currentStep]: { [productId]: 1 } };
                if (totalSelected < maxSel) {
                    return { ...prev, [currentStep]: { ...currentStepSelections, [productId]: currentQty + 1 } };
                } else {
                    if (showError) showError(`Limit reached: Max ${maxSel} items.`);
                    return prev;
                }
            } else {
                if (currentQty > 0) {
                    const newQty = currentQty - 1;
                    const newStepSel = { ...currentStepSelections, [productId]: newQty };
                    if (newQty === 0) delete newStepSel[productId];
                    return { ...prev, [currentStep]: newStepSel };
                }
                return prev;
            }
        });
    }, [currentGroup, currentStep, showError]);

    const validateStep = () => {
        if (isFixedDeal) return true;
        const currentStepSelections = selections[currentStep] || {};
        const totalSelected = Object.values(currentStepSelections).reduce((a, b) => a + b, 0);
        const minSel = currentGroup?.minSelection || 1;
        if (totalSelected < minSel) {
            if (showError) showError(`Please select at least ${minSel} items.`);
            return false;
        }
        return true;
    };

    const handleAction = () => {
        if (!validateStep()) return;
        if (currentStep < groups.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            const formattedOptions = [];
            let extraPriceTotal = 0;
            Object.entries(selections).forEach(([stepIdx, stepData]) => {
                const group = groups[stepIdx];
                Object.entries(stepData).forEach(([prodId, qty]) => {
                    const conf = group.specificProducts?.find(p => (p.product?._id || p.product) === prodId);
                    const prodTitle = conf?.product?.title || "Item";
                    const extra = conf?.extraPrice || 0;
                    extraPriceTotal += (extra * qty);
                    for (let i = 0; i < qty; i++) {
                        formattedOptions.push({
                            group: group.heading,
                            name: prodTitle + (extra > 0 ? ` (+${extra})` : ""),
                            price: extra
                        });
                    }
                });
            });
            const unitPrice = deal.price + extraPriceTotal;
            const finalTotalPrice = unitPrice * quantity;

            if (initialState?.signature) {
                updateItemInCart(
                    initialState.signature,
                    deal,
                    quantity,
                    formattedOptions,
                    finalTotalPrice,
                    note,
                    "deal"
                );
            } else {
                addToCart(deal, quantity, formattedOptions, finalTotalPrice, note, "deal");
            }
            setIsOpen(false);
        }
    };

    // share logic
    const generateShareLink = () => typeof window !== "undefined" ? `${window.location.origin}/?deal=${deal?._id}` : "";
    const handleCopyLink = () => { navigator.clipboard.writeText(generateShareLink()); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    const handleShare = (platform) => {
        const link = generateShareLink();
        const urls = { whatsapp: `https://wa.me/?text=${encodeURIComponent(" " + link)}`, facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}` };
        if (urls[platform]) window.open(urls[platform], "_blank");
    };

    const currentExtraTotal = useMemo(() => {
        let total = 0;
        Object.entries(selections).forEach(([stepIdx, stepData]) => {
            const group = groups[stepIdx];
            if (!group) return;
            Object.entries(stepData).forEach(([prodId, qty]) => {
                const conf = group.specificProducts?.find(p => (p.product?._id || p.product) === prodId);
                total += (conf?.extraPrice || 0) * qty;
            });
        });
        return total;
    }, [selections, groups]);
    const displayTotal = (deal?.price + currentExtraTotal) * quantity;

    if (!deal) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent aria-describedby={undefined} className="w-[95vw] sm:max-w-[95vw] md:max-w-3xl lg:max-w-5xl h-[80vh] md:h-[70vh] lg:h-[90vh] p-0 gap-0 flex flex-col bg-black/60 backdrop-blur-xl border border-(--color-gold) text-white overflow-hidden rounded-2xl shadow-2xl [&>button:last-child]:hidden">
                <DialogTitle className="sr-only">{deal?.title}</DialogTitle>
                <DialogDescription className="sr-only">Customize Deal</DialogDescription>
                <div className="absolute top-4 right-4 z-50 flex gap-2">
                    <div className="relative">
                        <button
                            onClick={() => setShowShareMenu(!showShareMenu)}
                            className="group bg-black/40 backdrop-blur-md p-2 rounded-full text-white hover:text-(--color-gold) transition-all duration-300"
                        >
                            <Share2 className="w-4 h-4 transition-transform duration-300 group-hover:scale-125" />
                        </button>
                        {showShareMenu && (
                            <ShareMenu onShare={handleShare} onCopy={handleCopyLink} copied={copied} />
                        )}
                    </div>
                    <DialogClose asChild>
                        <button
                            className="group bg-black/40 backdrop-blur-md p-2 rounded-full text-white hover:text-red-500 transition-all duration-300"
                        >
                            <X className="w-4 h-4 transition-transform duration-300 group-hover:scale-125" />
                        </button>
                    </DialogClose>
                </div>
                <div className="flex flex-col md:flex-row h-full">
                    <DealImage image={deal?.image} title={deal?.title} onClose={() => setIsOpen(false)} />
                    <div className="flex flex-col w-full md:w-[55%] h-full relative overflow-scroll no-scrollbar">
                        <div className="flex-1 overflow-y-auto no-scrollbar p-5 md:p-8 space-y-6">
                            <DealInfo title={deal?.title} desc={deal?.desc} price={deal?.price} />
                            <div className="h-px bg-white/10 w-full" />
                            {isFixedDeal ? (
                                <div />
                            ) : (
                                <StepSelector
                                    currentStep={currentStep}
                                    groups={groups}
                                    selections={selections}
                                    onUpdateQuantity={updateSelectionQuantity}
                                />
                            )}
                            <NoteInput value={note} onChange={(e) => setNote(e.target.value)} />
                        </div>

                        <DealFooter
                            isFixedDeal={isFixedDeal}
                            isLastStep={currentStep === groups.length - 1}
                            quantity={quantity}
                            setQuantity={setQuantity}
                            onAction={handleAction}
                            totalPrice={displayTotal}
                            isEditing={!!initialState}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DealModal;