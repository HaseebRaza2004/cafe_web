"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ProductModal from "./ProductModal";

const Card = ({ deal, index }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => setIsModalOpen(true)}
                className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-(--color-gold) transition-all duration-300 hover:shadow-[0_0_20px_var(--color-gold)]/20 cursor-pointer"
            >
                {/* Image Section */}
                <div className="relative w-full aspect-square overflow-hidden">
                    <Image
                        src={deal.image || "/placeholder.jpg"}
                        alt={deal.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60"></div>
                </div>

                {/* Content Section */}
                <div className="p-3 md:p-5 flex flex-col justify-between h-40 md:h-50">
                    <div>
                        <h3 className="text-sm md:text-xl font-bold text-white mb-1 md:mb-2 line-clamp-1 group-hover:text-(--color-gold) transition-colors">
                            {deal.title}
                        </h3>
                        <p className="text-[10px] md:text-sm text-gray-400 line-clamp-2 leading-tight">
                            {deal.desc}
                        </p>
                    </div>

                    <div>
                        <div className="text-(--color-gold) font-bold text-base md:text-lg mb-3">
                            Rs {deal.price}
                        </div>
                        <Button className="w-full h-8 md:h-10 text-[10px] md:text-sm bg-(--color-gold) text-black hover:bg-[#b89445] rounded-md font-bold uppercase tracking-wide">
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* --- MODAL --- */}
            <ProductModal
                product={deal}
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                trigger={null}
            />
        </>
    );
};

export default Card;