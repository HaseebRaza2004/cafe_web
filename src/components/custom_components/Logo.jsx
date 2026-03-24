"use client";

import React from "react";
import { UtensilsCrossed } from "lucide-react";

const Logo = () => {
    return (

        <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32">

            {/* Rotating Text Ring  */}
            <div className="absolute inset-0 w-full h-full animate-[spin_12s_linear_infinite]">
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                    <path
                        id="circlePath"
                        d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                        fill="none"
                    />
                    <text className="font-bold uppercase tracking-[0.2em] text-[10px] fill-(--color-gold,orange)">
                        <textPath
                            href="#circlePath"
                            startOffset="50%"
                            textAnchor="middle"
                        >
                            • CAFE ONLINE • LUXURY DINING
                        </textPath>
                    </text>
                </svg>
            </div>

            {/* Center Icon */}
            <div className="absolute z-10 flex items-center justify-center w-14 h-14 bg-black rounded-full border-2 border-(--color-gold,orange) shadow-[0_0_20px_rgba(197,160,89,0.4)]">
                <UtensilsCrossed className="w-7 h-7 text-(--color-gold,orange)" />
            </div>

            {/* Outer Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-(--color-gold,orange) opacity-10 blur-2xl"></div>

        </div>
    );
};

export default Logo;