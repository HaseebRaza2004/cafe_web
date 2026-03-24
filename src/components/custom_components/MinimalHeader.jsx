"use client";

import Link from "next/link";
import Logo from "./Logo";

export default function MinimalHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-22 bg-black/60 backdrop-blur-md border-b border-white/10 shadow-xl print:hidden transition-all duration-500">
            <div className="container mx-auto px-4 h-full flex items-center justify-center relative">
                <div className="absolute left-1/2 top-4 -translate-x-1/2 transition-all duration-500 z-50">
                    <Link href="/">
                        <div className="rounded-full p-2 bg-black/40 backdrop-blur-md border border-(--color-gold)/30 shadow-[0_0_20px_rgba(197,160,89,0.15)] scale-80 cursor-pointer hover:scale-85 transition-transform duration-300">
                            <div className="scale-100">
                                <Logo />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
};