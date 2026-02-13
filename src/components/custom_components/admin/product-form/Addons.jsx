"use client";
import { Check, ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Addons({ productOptions, availableGroups, setFormData }) {

    const toggleOptionGroup = (groupId) => {
        const exists = productOptions.find((po) => po.optionGroupId === groupId);
        if (exists) {
            setFormData((prev) => ({
                ...prev,
                productOptions: prev.productOptions.filter((po) => po.optionGroupId !== groupId),
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                productOptions: [
                    ...prev.productOptions,
                    { optionGroupId: groupId, allowedVariations: [] },
                ],
            }));
        }
    };

    const toggleAllowedFlavor = (groupId, flavorName, allOptions) => {
        setFormData((prev) => ({
            ...prev,
            productOptions: prev.productOptions.map((po) => {
                if (po.optionGroupId === groupId) {
                    let currentAllowed = po.allowedVariations || [];
                    if (currentAllowed.length === 0) currentAllowed = allOptions.map(o => o.name); // Default all if empty logic

                    const newAllowed = currentAllowed.includes(flavorName)
                        ? currentAllowed.filter((v) => v !== flavorName)
                        : [...currentAllowed, flavorName];

                    return { ...po, allowedVariations: newAllowed };
                }
                return po;
            }),
        }));
    };

    return (
        <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
            <h3 className="text-(--color-gold) font-bold uppercase text-xs tracking-wider mb-4">
                Add-ons & Options
            </h3>
            <div className="space-y-3">
                {availableGroups.length === 0 && <p className="text-gray-500 text-sm">No option groups found.</p>}

                {availableGroups.map((group) => {
                    const isSelected = productOptions.find(
                        (po) => po.optionGroupId === group._id
                    );

                    return (
                        <div
                            key={group._id}
                            className={`border rounded-xl transition-all overflow-hidden ${isSelected
                                ? "border-gold/50 bg-gold/5"
                                : "border-white/5 bg-black/30 hover:border-white/20"
                                }`}
                        >
                            <div
                                className="p-3 flex items-center justify-between cursor-pointer"
                                onClick={() => toggleOptionGroup(group._id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected
                                            ? "bg-(--color-gold) border-(--color-gold)"
                                            : "border-gray-500"
                                            }`}
                                    >
                                        {isSelected && <Check className="w-3 h-3 text-black" />}
                                    </div>
                                    <span
                                        className={`text-sm font-medium ${isSelected ? "text-white" : "text-gray-400"
                                            }`}
                                    >
                                        {group.name}
                                    </span>
                                </div>
                                {isSelected && <ChevronDown className="w-4 h-4 text-gray-400" />}
                            </div>

                            {/* Nested Checkboxes for specific flavors inside group */}
                            {isSelected && group.options.length > 0 && (
                                <div className="p-3 pt-0 ml-8 border-l border-white/10 pl-4 grid grid-cols-2 gap-3 mt-1 pb-4">
                                    {group.options.map((opt, idx) => {
                                        const currentConfig = productOptions.find(
                                            (po) => po.optionGroupId === group._id
                                        );
                                        const isAllowed =
                                            !currentConfig.allowedVariations ||
                                            currentConfig.allowedVariations.length === 0 ||
                                            currentConfig.allowedVariations.includes(opt.name);

                                        return (
                                            <div key={idx} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`${group._id}-${idx}`}
                                                    checked={isAllowed}
                                                    onCheckedChange={() => toggleAllowedFlavor(group._id, opt.name, group.options)}
                                                    className="border-white/30 data-[state=checked]:bg-(--color-gold) data-[state=checked]:text-black"
                                                />
                                                <Label
                                                    htmlFor={`${group._id}-${idx}`}
                                                    className="text-xs text-gray-300 cursor-pointer"
                                                >
                                                    {opt.name || "Option"}
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}