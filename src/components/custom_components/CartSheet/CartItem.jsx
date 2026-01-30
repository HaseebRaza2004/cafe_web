"use client";
import React from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useModal } from "@/context/ModalContext";

const CartItem = ({ item, updateQuantity, confirmRemoveItem }) => {
    const { openEditModal } = useModal();

    const handleEdit = () => {
        const type = item.type || "product";
        openEditModal(type, item);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50, height: 0, marginBottom: 0 }}
            className="group relative flex gap-4 bg-white/5 border border-white/5 rounded-xl p-4 hover:border-gold/30 transition-all cursor-pointer"
            onClick={handleEdit}
        >
            {/* Image */}
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10 self-start mt-1">
                <Image src={item.image || "/placeholder.jpg"} alt={item.title} fill className="object-cover" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-white truncate pr-2">{item.title}</h4>
                    <span className="font-bold text-white text-sm whitespace-nowrap">
                        Rs {(item.price * item.quantity).toLocaleString()}
                    </span>
                </div>

                <div className="h-px w-full bg-white/10 mb-2" />

                <div className="text-[10px] font-mono text-(--color-gold) mb-2 opacity-80">
                    @ Rs {item.price.toLocaleString()}
                </div>

                {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <div className="mb-3 space-y-1 bg-black/20 p-2 rounded-md">
                        {item.selectedOptions.map((opt, idx) => (
                            <div key={idx} className="flex justify-between text-[10px] text-gray-400">
                                <span>• {opt.group}: {opt.name}</span>
                                {opt.price > 0 && <span>+{opt.price}</span>}
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-end mt-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-3 bg-black/40 rounded-lg p-1 border border-white/10">
                        <button onClick={() => item.quantity > 1 ? updateQuantity(item.signature, -1) : confirmRemoveItem(item.signature)} className="w-6 h-6 flex items-center justify-center rounded bg-white/10 hover:bg-(--color-gold) hover:text-black transition-colors">
                            {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-red-400" /> : <Minus className="w-3 h-3" />}
                        </button>
                        <span className="text-xs font-mono font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.signature, 1)} className="w-6 h-6 flex items-center justify-center rounded bg-white/10 hover:bg-(--color-gold) hover:text-black transition-colors">
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>
                    {item.customerNote && <div className="text-[10px] text-gray-500 italic max-w-30 truncate text-right">Note: {item.customerNote}</div>}
                </div>
            </div>
        </motion.div>
    );
};

export default CartItem;