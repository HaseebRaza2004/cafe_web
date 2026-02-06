"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { X, Share2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useModal } from "@/context/ModalContext";
import ShareMenu from "@/components/custom_components/ShareMenu";

import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import VariationSelector from "./VariationSelector";
import AddonsSelector from "./AddonsSelector";
import NoteInput from "./NoteInput";
import ModalFooter from "./ModalFooter";

const ProductModal = ({ product, isOpen, setIsOpen, initialState }) => {
    const { addToCart, updateItemInCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selections, setSelections] = useState({});
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [note, setNote] = useState("");
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    const hasVariations = useMemo(() => Array.isArray(product?.variations) && product.variations.length > 0, [product]);

    // Handles Edit Mode
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setShowShareMenu(false);

                if (initialState) {
                    setQuantity(initialState.quantity);
                    setNote(initialState.note);

                    const restoredSelections = {};
                    let restoredVariation = null;

                    initialState.selections.forEach(opt => {
                        if (opt.group === "Variation" || opt.group === "Size") {
                            restoredVariation = product.variations?.find(v => v.title === opt.name);
                        } else {
                            const groupConfig = product.productOptions?.find(po => po.optionGroupId.name === opt.group);
                            if (groupConfig) {
                                const gId = groupConfig.optionGroupId._id;
                                if (!restoredSelections[gId]) restoredSelections[gId] = [];
                                restoredSelections[gId].push(opt.name);
                            }
                        }
                    });

                    setSelections(restoredSelections);
                    if (hasVariations) setSelectedVariation(restoredVariation || product.variations[0]);

                } else {
                    setQuantity(1);
                    setSelections({});
                    setNote("");
                    if (hasVariations) setSelectedVariation(product.variations[0]);
                    else setSelectedVariation(null);
                }
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isOpen, product, hasVariations, initialState]);

    const basePrice = selectedVariation ? Number(selectedVariation.price) : (Number(product.price) || 0);

    const extrasCost = product?.productOptions?.reduce((total, groupConfig) => {
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

        if (selectedVariation) {
            selectedOptionsList.unshift({
                group: "Variation",
                name: selectedVariation.title,
                price: 0
            });
        }

        if (initialState?.signature) {
            updateItemInCart(
                initialState.signature,
                product,
                quantity,
                selectedOptionsList,
                totalPrice,
                note,
                "product"
            );
        } else {
            addToCart(product, quantity, selectedOptionsList, totalPrice, note, "product");
        }

        setIsOpen(false);
    };

    // Share Logic
    const generateShareLink = () => typeof window !== "undefined" ? `${window.location.origin}/?product=${product._id}` : "";
    const handleCopyLink = () => { navigator.clipboard.writeText(generateShareLink()); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    const handleShare = (platform) => {
        const link = generateShareLink();
        const urls = { whatsapp: `https://wa.me/?text=${encodeURIComponent(" " + link)}`, facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}` };
        if (urls[platform]) window.open(urls[platform], "_blank");
    };

    if (!product) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent aria-describedby={undefined} className="w-[95vw] sm:max-w-[95vw] md:max-w-3xl lg:max-w-5xl h-[80vh] md:h-[70vh] lg:h-[90vh] p-0 gap-0 flex flex-col bg-black/60 backdrop-blur-xl border border-(--color-gold) text-white overflow-hidden rounded-2xl shadow-2xl [&>button:last-child]:hidden">
                <DialogTitle className="sr-only">{product.title}</DialogTitle>
                <DialogDescription className="sr-only">Customize Product</DialogDescription>

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
                    <ProductImage image={product.image} title={product.title} onClose={() => setIsOpen(false)} />
                    <div className="flex flex-col w-full md:w-[55%] h-full relative overflow-scroll no-scrollbar">
                        <div className="flex-1 overflow-y-auto no-scrollbar p-5 md:p-8 space-y-6">
                            <ProductInfo title={product.title} desc={product.desc} basePrice={basePrice} />
                            <div className="h-px bg-white/10 w-full" />
                            <VariationSelector variations={product.variations} selectedVariation={selectedVariation} onSelect={setSelectedVariation} />
                            <AddonsSelector productOptions={product.productOptions} selections={selections} onSelection={handleSelection} />
                            <NoteInput value={note} onChange={(e) => setNote(e.target.value)} />
                        </div>
                        <ModalFooter
                            quantity={quantity}
                            setQuantity={setQuantity}
                            onAdd={handleAddToCart}
                            totalPrice={totalPrice}
                            isEditing={!!initialState}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductModal;