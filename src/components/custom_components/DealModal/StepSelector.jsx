"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import { Minus, Plus, Check } from "lucide-react";

const StepSelector = ({ currentStep, groups, selections, onUpdateQuantity }) => {
    const currentGroup = groups[currentStep];
    const currentStepSelections = selections[currentStep] || {};
    const totalSelectedInStep = Object.values(currentStepSelections).reduce((a, b) => a + b, 0);
    const maxSel = currentGroup?.maxSelection || 1;
    const isSingleSelect = maxSel === 1;
    const minSel = currentGroup?.minSelection || 1;
    const isStepValid = totalSelectedInStep >= minSel;

    const stepItems = useMemo(() => {
        if (!currentGroup?.specificProducts) return [];
        return currentGroup.specificProducts.map(item => {
            const productObj = item.product;
            if (!productObj || typeof productObj !== 'object') return null;
            return {
                ...productObj,
                _id: productObj._id,
                extraCharge: item.extraPrice || 0
            };
        }).filter(Boolean);
    }, [currentGroup]);

    return (
        <div className="mt-2">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <span className="text-(--color-gold) font-bold uppercase text-[10px] md:text-xs tracking-wider mb-1 block">
                        Step {currentStep + 1} / {groups.length}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold text-white">
                        {currentGroup?.heading}
                    </h3>
                </div>
                <div className="text-right">
                    <span className={`text-[10px] uppercase tracking-wider block mb-1 ${isStepValid ? 'text-green-500' : 'text-gray-500'}`}>
                        {isStepValid ? 'Completed' : 'Required'}
                    </span>
                    <div className={`px-3 py-1 rounded border text-xs font-mono transition-colors ${isStepValid ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-white'}`}>
                        {totalSelectedInStep} / {maxSel}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {stepItems.map((prod) => {
                    const qty = currentStepSelections[prod._id] || 0;
                    const isSelected = qty > 0;

                    return (
                        <div
                            key={prod._id}
                            onClick={() => isSingleSelect ? onUpdateQuantity(prod._id, 1) : null}
                            className={`
                                flex items-center gap-4 p-3 rounded-xl border transition-all duration-200 select-none
                                ${isSelected
                                    ? "border-(--color-gold) bg-gold/10 shadow-[0_0_10px_rgba(197,160,89,0.1)]"
                                    : "border-white/10 bg-white/5 hover:bg-white/10"
                                }
                            `}
                        >
                            <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-black border border-white/5">
                                <Image
                                    src={prod.image || "/placeholder.jpg"}
                                    alt={prod.title}
                                    fill
                                    sizes="64px"
                                    className="object-cover" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className={`text-sm font-bold truncate ${isSelected ? "text-(--color-gold)" : "text-white"}`}>
                                    {prod.title}
                                </h4>
                                {prod.extraCharge > 0 && (
                                    <span className="text-[10px] text-gray-400 bg-white/5 px-1.5 py-0.5 rounded mt-1 inline-block border border-white/10">
                                        + Rs {prod.extraCharge}
                                    </span>
                                )}
                            </div>

                            {isSingleSelect ? (
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isSelected ? "border-(--color-gold) bg-(--color-gold)" : "border-gray-600"}`}>
                                    {isSelected && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 bg-black/40 rounded-lg p-1 border border-white/10" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => onUpdateQuantity(prod._id, -1)}
                                        className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors  
                                    ${qty > 0 ? "bg-white/10 hover:bg-red-500/20 text-white cursor-pointer" : "text-gray-600 cursor-not-allowed"}`}
                                        disabled={qty === 0}
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="text-sm font-bold w-4 text-center text-white">{qty}</span>
                                    <button
                                        onClick={() => onUpdateQuantity(prod._id, 1)}
                                        className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors  
                                    ${totalSelectedInStep < maxSel ? "bg-white/10 hover:bg-green-500/20 text-white cursor-pointer" : "text-gray-600 cursor-not-allowed"}`}
                                        disabled={totalSelectedInStep >= maxSel}
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StepSelector;