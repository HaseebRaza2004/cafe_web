"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { dealsData } from "@/lib/data";
import Card from "./Card";

const HotDeals = () => {
    const featuredDeals = dealsData.slice(0, 4);
    return (
        <section className="relative w-full pt-16 md:pt-24 overflow-hidden">
            <div className="container mx-auto px-4">

                {/* --- HEADING WITH LINES (As per your image) --- */}
                <div className="flex items-center justify-center mb-12 md:mb-16">
                    {/* Left Line */}
                    <div className="h-px md:h-0.5 w-16 md:w-36 bg-(--color-gold) opacity-70"></div>

                    {/* Text */}
                    <h2 className="mx-4 md:mx-8 text-2xl md:text-4xl lg:text-5xl font-bold uppercase tracking-widest text-(--color-gold) text-center whitespace-nowrap">
                        Hot Deals
                    </h2>

                    {/* Right Line */}
                    <div className="h-px md:h-0.5 w-16 md:w-36 bg-(--color-gold) opacity-70"></div>
                </div>

                {/* --- DEALS GRID --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
                    {featuredDeals.map((deal, index) => (
                        <Card key={deal.id} deal={deal} index={index} />
                    ))}
                </div>

                {/* --- SEE ALL BUTTON --- */}
                <div className="flex justify-center mt-12 md:mt-16">
                    <Link href="/deals">
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-(--color-gold) text-(--color-gold) hover:bg-(--color-gold) hover:text-black px-10 py-6 font-bold text-lg rounded-md uppercase tracking-widest transition-all duration-400 hover:scale-105"
                        >
                            See All Deals <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default HotDeals;