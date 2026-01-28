"use client";
import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

const ProductImage = ({ image, title, onClose }) => {
    return (
        <div className="relative w-full md:w-[45%] h-40 md:h-auto shrink-0 bg-black/50">
            <Image
                src={image || "/placeholder.jpg"}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority={true}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent md:bg-linear-to-r md:from-transparent md:to-black/90" />
            {/* Mobile Close Button */}
            <button
                onClick={onClose}
                className="absolute top-3 left-3 md:hidden z-20 bg-black/40 backdrop-blur-md p-2 rounded-full text-white border border-white/10"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default ProductImage;