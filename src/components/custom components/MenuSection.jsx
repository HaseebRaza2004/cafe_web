"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { menuData } from "@/lib/data"; // Data import
import Card from "./Card";

const MenuSection = () => {
    const [searchQuery, setSearchQuery] = useState("");

    // --- SEARCH LOGIC ---
    const filteredData = menuData.filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
            item.title.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );
    });

    // --- GROUPING LOGIC ---
    const groupedMenu = filteredData.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    return (
        <section className="min-h-screen text-white py-16 md:py-24 relative">
            <div className="container mx-auto px-4">

                {/* --- 1. SEARCH BAR --- */}
                <div className="flex flex-col items-center justify-center mb-16">
                    <div className="relative w-full max-w-2xl">
                        <input
                            type="text"
                            placeholder="Search for pizza, burger..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/20 text-white rounded-full py-4 pl-14 pr-6 focus:outline-none focus:border-(--color-gold) focus:ring-1 focus:ring-(--color-gold) transition-all placeholder:text-gray-500 text-lg"
                        />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                    </div>
                </div>

                {/* --- 2. MENU CONTENT --- */}

                {/* CASE A: Agar search karne par kuch na mile */}
                {Object.keys(groupedMenu).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
                        <p className="text-xl md:text-2xl text-gray-400">
                            🚫 Your search for - <span className="text-(--color-gold) font-bold">{searchQuery}</span> - did not match any items in the menu.
                        </p>
                    </div>
                ) : (
                    /* CASE B: Items mil gaye -> Category wise show karo */
                    Object.entries(groupedMenu).map(([category, items]) => (
                        <div key={category} className="mb-16 md:mb-24 last:mb-0">

                            {/* Category Heading (Pizza, Burger, etc.) */}
                            <div className="flex items-center mb-8">
                                <div className="h-8 w-2 bg-(--color-gold) mr-4 rounded-sm"></div>
                                <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-wide text-white">
                                    {category}
                                </h2>
                                <div className="h-px bg-white/20 grow ml-6"></div>
                            </div>

                            {/* Items Grid (Same responsive logic: Mobile=2, Desktop=4) */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
                                {items.map((item, index) => (
                                    <Card key={item.id} deal={item} index={index} />
                                ))}
                            </div>
                        </div>
                    ))
                )}

            </div>
        </section>
    );
};

export default MenuSection;