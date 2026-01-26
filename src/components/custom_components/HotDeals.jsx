"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Card from "./Card";

const HotDeals = ({ deals, allProducts = [] }) => {
    if (!deals || deals.length === 0) return null;

    return (
        <section className="py-16 relative">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-wide text-white">
                            Hot <span className="text-(--color-gold)">Deals</span>
                        </h2>
                        <p className="text-gray-400 mt-2">Limited time offers you can&apos;t resist.</p>
                    </div>

                    {/* Note: Deals Page abhi separate banega, filhal link /deals par hai */}
                    <Link href="/deals" className="group flex items-center gap-2 text-(--color-gold) font-bold uppercase tracking-wider text-sm hover:text-white transition-colors">
                        See All Deals <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* 4 Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {deals.map((deal, index) => (
                        <Card
                            key={deal._id}
                            deal={deal}
                            index={index}
                            allProducts={allProducts} // Pass products down for Deal logic
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default HotDeals;