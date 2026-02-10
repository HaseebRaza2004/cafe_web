"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Card from "./Card";

const HotDeals = ({ deals, allProducts = [] }) => {
    if (!deals || deals.length === 0) return null;
    return (
        <section className="py-12 md:py-20 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                {/* --- HEADER SECTION --- */}
                <div className="w-full mb-12 md:mb-16">

                    <div className="flex items-center gap-4 md:gap-8 mb-6">
                        <div className="h-px flex-1 bg-linear-to-r from-transparent via-(--color-gold) to-(--color-gold) opacity-40" />
                        <h2 className="shrink-0 text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.15em] text-white drop-shadow-lg">
                            Hot <span className="text-(--color-gold)">Deals</span>
                        </h2>
                        <div className="h-px flex-1 bg-linear-to-r from-(--color-gold) via-(--color-gold) to-transparent opacity-40" />
                    </div>

                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 px-2 md:px-0">
                        <p className="text-gray-400 text-sm sm:text-base font-medium tracking-wide max-w-lg text-center md:text-left leading-relaxed">
                            Experience our exclusive offers tailored just for you.
                            <span className="hidden sm:inline"> Limited time premium selections.</span>
                        </p>
                        <Link
                            href="/deals"
                            className="group flex items-center gap-3 px-6 py-2 border border-gold/30 rounded-full hover:bg-gold/10 transition-all duration-300"
                        >
                            <span className="text-(--color-gold) font-bold uppercase tracking-[0.2em] text-xs">
                                See All Deals
                            </span>
                            <div className="w-6 h-6 rounded-full bg-(--color-gold) flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                                <ArrowRight className="w-3 h-3" />
                            </div>
                        </Link>

                    </div>
                </div>

                {/* --- CARDS GRID SECTION --- */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {deals.map((deal, index) => (
                        <Card
                            key={deal._id}
                            deal={deal}
                            index={index}
                            allProducts={allProducts}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HotDeals;