"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { X, Share2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ShareMenu from "../ShareMenu"; 

// Import Sub-Components
import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import VariationSelector from "./VariationSelector";
import AddonsSelector from "./AddonsSelector";
import NoteInput from "./NoteInput";
import ModalFooter from "./ModalFooter";

const ProductModal = ({ product, isOpen, setIsOpen, trigger }) => {
    const { addToCart } = useCart();

    // 1. Hook Declarations
    const [quantity, setQuantity] = useState(1);
    const [selections, setSelections] = useState({});
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [note, setNote] = useState("");
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    // 2. Logic & Effects
    const hasVariations = useMemo(() => Array.isArray(product?.variations) && product.variations.length > 0, [product]);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setQuantity(1);
                setSelections({});
                setNote("");
                setShowShareMenu(false);
                if (hasVariations) {
                    setSelectedVariation(product.variations[0]);
                } else {
                    setSelectedVariation(null);
                }
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isOpen, product, hasVariations]);

    const basePrice = selectedVariation ? Number(selectedVariation.price) : (Number(product.price) || 0);

    const extrasCost = product.productOptions?.reduce((total, groupConfig) => {
        const group = groupConfig.optionGroupId;
        if (!group || !group.options) return total;
        const userSelected = selections[group._id] || [];
        const groupCost = group.options
            .filter(opt => userSelected.includes(opt.name))
            .reduce((sum, opt) => sum + (Number(opt.price) || 0), 0);
        return total + groupCost;
    }, 0) || 0;

    const totalPrice = (basePrice + extrasCost) * quantity;

    const handleSelection = (groupId, type, optionName) => {
        setSelections(prev => {
            const current = prev[groupId] || [];
            if (type === "single") return { ...prev, [groupId]: [optionName] };
            if (current.includes(optionName)) return { ...prev, [groupId]: current.filter(item => item !== optionName) };
            return { ...prev, [groupId]: [...current, optionName] };
        });
    };

    const handleAddToCart = () => {
        const selectedOptionsList = Object.entries(selections).flatMap(([groupId, selectedNames]) => {
            const groupConfig = product.productOptions.find(po => po.optionGroupId._id === groupId);
            const groupName = groupConfig?.optionGroupId?.name || "Option";
            return selectedNames.map(name => {
                const optDef = groupConfig?.optionGroupId?.options?.find(o => o.name === name);
                return { group: groupName, name: name, price: optDef ? Number(optDef.price) : 0 };
            });
        });

        // Add Signature Logic for Variation (Size)
        if (selectedVariation) {
            selectedOptionsList.unshift({
                group: "Size",
                name: selectedVariation.title,
                price: 0
            });
        }

        addToCart(product, quantity, selectedOptionsList, totalPrice, note);
        setIsOpen(false);
    };

    // Share Handlers
    const generateShareLink = () => typeof window !== "undefined" ? `${window.location.origin}/?product=${product._id}` : "";
    const handleCopyLink = () => { navigator.clipboard.writeText(generateShareLink()); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    const handleShare = (platform) => {
        const link = generateShareLink();
        const text = `Check out this amazing ${product.title}!`;
        const urls = { whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + link)}`, facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}` };
        if (urls[platform]) window.open(urls[platform], "_blank");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent aria-describedby={undefined} className="w-[95vw] sm:max-w-[95vw] md:max-w-3xl lg:max-w-5xl h-[90vh] md:h-auto md:max-h-[85vh] p-0 gap-0 flex flex-col bg-black/60 backdrop-blur-xl border border-(--color-gold) text-white overflow-hidden rounded-2xl shadow-2xl">
                <DialogTitle className="sr-only">{product.title}</DialogTitle>
                <DialogDescription className="sr-only">Customize your meal</DialogDescription>

                {/* Top Controls */}
                <div className="absolute top-4 right-4 z-50 hidden md:flex gap-2">
                    <div className="relative">
                        <button onClick={() => setShowShareMenu(!showShareMenu)} className="bg-black/40 backdrop-blur-md p-2 rounded-full text-white border border-white/10 hover:border-(--color-gold) hover:text-(--color-gold) transition-all"><Share2 className="w-5 h-5" /></button>
                        {showShareMenu && <ShareMenu onShare={handleShare} onCopy={handleCopyLink} copied={copied} />}
                    </div>
                    <button onClick={() => setIsOpen(false)} className="bg-black/40 backdrop-blur-md p-2 rounded-full text-white border border-white/10 hover:bg-red-500/20 hover:text-red-500 transition-all"><X className="w-5 h-5" /></button>
                </div>

                <div className="flex flex-col md:flex-row flex-1 min-h-0">
                    <ProductImage image={product.image} title={product.title} onClose={() => setIsOpen(false)} />
                    <div className="flex flex-col w-full md:w-[55%] min-h-0 relative">
                        <div className="flex-1 overflow-y-auto no-scrollbar p-5 md:p-8 space-y-6">
                            <ProductInfo title={product.title} desc={product.desc} basePrice={basePrice} />
                            <div className="h-px bg-white/10 w-full" />
                            <VariationSelector variations={product.variations} selectedVariation={selectedVariation} onSelect={setSelectedVariation} />
                            <AddonsSelector productOptions={product.productOptions} selections={selections} onSelection={handleSelection} />
                            <NoteInput value={note} onChange={(e) => setNote(e.target.value)} />
                        </div>
                        <ModalFooter quantity={quantity} setQuantity={setQuantity} onAdd={handleAddToCart} totalPrice={totalPrice} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductModal;