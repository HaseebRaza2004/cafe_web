"use client";
import React from "react";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";

const AddonsSelector = ({ productOptions, selections, onSelection }) => {
    if (!productOptions || productOptions.length === 0) return null;

    return (
        <div className="space-y-6">
            {productOptions.map((groupConfig) => {
                const group = groupConfig.optionGroupId;
                if (!group) return null;
                const isMulti = group.type === 'multiple';

                return (
                    <div key={group._id}>
                        <h3 className="text-(--color-gold) font-bold uppercase text-[10px] md:text-xs tracking-wider mb-3">
                            {group.name} {isMulti ? "(Select Multiple)" : "(Choose One)"}
                        </h3>

                        <div className={`flex flex-wrap gap-3 ${isMulti ? "flex-col" : ""}`}>
                            {group.options.map((option) => {
                                const isSelected = selections[group._id]?.includes(option.name);
                                const isDisabled = !option.isAvailable;

                                if (isMulti) {
                                    // CHECKBOX STYLE
                                    return (
                                        <div
                                            key={option._id || option.name}
                                            onClick={() => !isDisabled && onSelection(group._id, "multiple", option.name)}
                                            className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${isSelected ? "border-(--color-gold) bg-gold/20" : "border-white/10 hover:bg-white/5"} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isSelected ? "bg-(--color-gold) border-(--color-gold)" : "border-gray-500"}`}>
                                                    {isSelected && <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />}
                                                </div>
                                                <span className="text-sm font-medium text-gray-200">{option.name}</span>
                                            </div>
                                            <span className="text-sm text-(--color-gold)">
                                                {option.price > 0 ? `+Rs ${option.price}` : "Free"}
                                            </span>
                                        </div>
                                    );
                                } else {
                                    // RADIO STYLE
                                    return (
                                        <div
                                            key={option._id || option.name}
                                            onClick={() => onSelection(group._id, "single", option.name)}
                                            className={`flex items-center space-x-2 bg-white/5 border px-3 py-2 rounded-lg transition-colors cursor-pointer ${isSelected ? "border-(--color-gold) text-(--color-gold)" : "border-white/10 hover:border-(--color-gold)"}`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "border-(--color-gold)" : "border-gray-500"}`}>
                                                {isSelected && <div className="w-2 h-2 rounded-full bg-(--color-gold)" />}
                                            </div>
                                            <Label className="text-inherit text-sm cursor-pointer font-medium">{option.name}</Label>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AddonsSelector;