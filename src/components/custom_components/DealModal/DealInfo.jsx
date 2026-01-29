"use client";
import React from "react";

const DealInfo = ({ title, desc, price }) => {
    return (
        <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-white mb-2 leading-tight pr-8">
                {title}
            </h2>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed opacity-80">
                {desc}
            </p>
            <div className="mt-3 inline-block px-3 py-1 rounded-full border border-(--color-gold) text-(--color-gold) text-sm md:text-base font-bold font-mono bg-gold/10">
                Rs {price}
            </div>
        </div>
    );
};

export default DealInfo;