"use client";
import React from "react";

const VariationSelector = ({ variations, selectedVariation, onSelect }) => {
    if (!variations || variations.length === 0) return null;

    return (
        <div className="mb-2">
            <h3 className="text-(--color-gold) font-bold uppercase text-[10px] md:text-xs tracking-wider mb-3">
                Select Size / Variation
            </h3>
            <div className="flex flex-wrap gap-3">
                {variations.map((variant, idx) => {
                    const isSelected = selectedVariation &&
                        (selectedVariation._id ? selectedVariation._id === variant._id : selectedVariation.title === variant.title);

                    const key = variant._id || idx;

                    return (
                        <div
                            key={key}
                            onClick={() => variant.isAvailable && onSelect(variant)}
                            className={
                                `relative flex items-center space-x-3 px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer
                            ${isSelected
                                    ? "border-(--color-gold) bg-gold/10 shadow-[0_0_15px_rgba(197,160,89,0.15)]"
                                    : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30"
                                }
                            ${!variant.isAvailable ? "opacity-50 cursor-not-allowed grayscale" : ""}
                                    `}>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? "border-(--color-gold)" : "border-gray-500"}`}>
                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-(--color-gold)" />}
                            </div>

                            <div className="flex flex-col">
                                <span className={`text-sm font-bold tracking-wide ${isSelected ? "text-white" : "text-gray-300"}`}>
                                    {variant.title}
                                </span>
                                <span className="text-xs text-(--color-gold) font-mono mt-0.5">
                                    Rs {variant.price}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VariationSelector;