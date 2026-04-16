"use client";

import Link from "next/link";
import Logo from "./Logo";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function MinimalFooter() {
    return (
        <footer className="w-full bg-black/60 backdrop-blur-md border-t border-gold/50 pt-16 pb-8 flex flex-col items-center justify-center print:hidden relative z-50 mt-10">

            <div className="container mx-auto px-4 flex flex-col items-center">
                <div className="scale-110 mb-6">
                    <Logo />
                </div>
                <p className="text-gray-400 text-xs md:text-sm text-center max-w-md leading-relaxed">
                    Experience the art of premium dining. We serve passion on a plate with the finest ingredients and luxury ambiance.
                </p>

                {/* Social Icons */}
                <div className="flex gap-4 mt-8">
                    <Link href="#" aria-label="Visit Our Facebook Page" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-(--color-gold) hover:border-(--color-gold) hover:text-black transition-all duration-300 shadow-md">
                        <Facebook className="w-4 h-4" />
                    </Link>
                    <Link href="#" aria-label="Visit Our Instagram Page" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-(--color-gold) hover:border-(--color-gold) hover:text-black transition-all duration-300 shadow-md">
                        <Instagram className="w-4 h-4" />
                    </Link>
                    <Link href="#" aria-label="Visit Our Twitter Page" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-(--color-gold) hover:border-(--color-gold) hover:text-black transition-all duration-300 shadow-md">
                        <Twitter className="w-4 h-4" />
                    </Link>
                </div>

                <div className="w-full border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-xs md:text-sm text-center">
                        © {new Date().getFullYear()} <span className="text-(--color-gold)">Cafe Online</span>. All Rights Reserved.
                    </p>
                    <p className="text-gray-600 text-[10px] md:text-xs text-center flex items-center gap-1">
                        Designed & Developed by <span className="text-gray-400 font-bold">Haseeb Raza</span>
                    </p>
                </div>
            </div>

        </footer>
    );
}