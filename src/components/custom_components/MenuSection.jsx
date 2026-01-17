"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import Card from "./Card";

const MenuSection = ({ initialMenuData = [] }) => {
    const [searchQuery, setSearchQuery] = useState("");

    // --- SEARCH LOGIC ---
    let displayMenu = initialMenuData;

    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        displayMenu = initialMenuData.map(group => {
            const filteredItems = group.items.filter(item =>
                item.title.toLowerCase().includes(query) ||
                group.category.toLowerCase().includes(query)
            );
            return { ...group, items: filteredItems };
        }).filter(group => group.items.length > 0);
    }

    return (
        <section className="min-h-screen text-white py-16 md:py-24 relative">
            <div className="container mx-auto px-4">

                {/* --- SEARCH BAR --- */}
                <div className="flex flex-col items-center justify-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-wide text-white mb-8">
                        Our <span className="text-(--color-gold)">Menu</span>
                    </h2>

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

                {/* --- MENU GRID --- */}
                {displayMenu.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
                        <p className="text-xl md:text-2xl text-gray-400">
                            🚫 Your search for - <span className="text-(--color-gold) font-bold">{searchQuery}</span> - did not match any items.
                        </p>
                    </div>
                ) : (
                    displayMenu.map((group, index) => (
                        <div key={group.category + index} className="mb-16 md:mb-24 last:mb-0 animate-in fade-in slide-in-from-bottom-4 duration-700">

                            {/* Category Heading */}
                            <div className="flex items-center mb-8">
                                <div className="h-8 w-2 bg-(--color-gold) mr-4 rounded-sm"></div>
                                <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-wide text-white">
                                    {group.category}
                                </h2>
                                <div className="h-px bg-white/20 grow ml-6"></div>
                            </div>

                            {/* Items Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
                                {group.items.map((item, idx) => (
                                    <Card key={item._id} deal={item} index={idx} />
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