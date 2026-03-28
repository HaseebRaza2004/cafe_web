"use client";

import { useState, useEffect } from "react";
import { Search, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderFilters({
    searchQuery,
    setSearchQuery,
    selectedDate,
    setSelectedDate,
    quickFilter,
    setQuickFilter,
    totalResults
}) {
    // Local state for debouncing
    const [localSearch, setLocalSearch] = useState(searchQuery);

    // Debounce Logic: 300ms delay before triggering parent search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(localSearch);
        }, 300);
        return () => clearTimeout(timer);
    }, [localSearch, setSearchQuery]);

    const quickFilters = ["All", "Today", "Week", "Month"];

    return (
        <div className="bg-[#111] border border-white/10 rounded-2xl p-5 mb-8 shadow-lg flex flex-col gap-5">

            {/* Top Row: Search & Date */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Name, Phone or Email..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-(--color-gold) focus:ring-1 focus:ring-(--color-gold) transition-all placeholder:text-gray-600 text-sm md:text-base"
                    />
                </div>

                {/* Specific Date Picker */}
                <div className="relative w-full md:w-48 shrink-0">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            if (e.target.value) setQuickFilter("All"); // Reset quick filter if specific date is chosen
                        }}
                        className="w-full h-12 pl-10 pr-4 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-(--color-gold) transition-all text-sm md:text-base scheme-dark"
                    />
                </div>
            </div>

            {/* Bottom Row: Quick Filters & Results Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-white/5">
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {quickFilters.map((filter) => (
                        <Button
                            key={filter}
                            onClick={() => {
                                setQuickFilter(filter);
                                setSelectedDate(""); // Clear specific date
                            }}
                            variant="outline"
                            className={`h-9 px-4 rounded-lg text-xs md:text-sm transition-all flex-1 sm:flex-none ${quickFilter === filter && !selectedDate
                                    ? "bg-(--color-gold) text-black border-(--color-gold) font-bold"
                                    : "bg-transparent text-gray-400 border-white/10 hover:bg-white/5"
                                }`}
                        >
                            {filter}
                        </Button>
                    ))}
                </div>

                <div className="text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-lg border border-white/5 font-medium shrink-0 w-full sm:w-auto text-center">
                    Found: <span className="text-(--color-gold) font-bold">{totalResults}</span> Orders
                </div>
            </div>
        </div>
    );
}