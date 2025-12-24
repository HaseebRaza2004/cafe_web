"use client";

import React from "react";
import { UtensilsCrossed } from "lucide-react";

const Logo = () => {
    return (
        // Outer Container for Logo
        <div className="relative flex items-center justify-center w-20 h-20">

            {/* 1. Rotating Text Ring */}
            <div className="absolute inset-0 w-full h-full animate-[spin_12s_linear_infinite]">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                        id="circlePath"
                        d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                        fill="none"
                    />
                    {/* Circular Text */}
                    <text className="font-bold uppercase tracking-[0.18em] text-[8.5px]">
                        <textPath
                            href="#circlePath"
                            className="fill-(--color-gold)"
                            startOffset="50%"
                            textAnchor="middle"
                        >
                            • CAFE ONLINE • LUXURY DINING
                        </textPath>
                    </text>
                </svg>
            </div>

            {/* 2. Center Icon */}
            <div className="absolute z-10 flex items-center justify-center w-10 h-10 bg-black rounded-full border border-(--color-gold) shadow-[0_0_20px_rgba(197,160,89,0.2)]">
                <UtensilsCrossed className="w-8 h-8 text-(--color-gold)" />
            </div>

            {/* 3. Glow Effect behind icon */}
            <div className="absolute inset-0 rounded-full bg-(--color-gold) opacity-5 blur-xl"></div>

        </div>
    );
};

export default Logo;