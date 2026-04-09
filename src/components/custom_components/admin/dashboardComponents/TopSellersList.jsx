"use client";

import { Crown, TrendingUp, ChevronRight } from "lucide-react";

// Temporary Mock Data (API ready hole amra eita replace korbo)
const topSellers = [
    { id: 1, name: "Zinger Burger", category: "Fast Food", sales: 450, revenue: 135000, trend: "+12%" },
    { id: 2, name: "Chicken Tikka Pizza", category: "Pizza", sales: 320, revenue: 256000, trend: "+8%" },
    { id: 3, name: "Loaded Fries", category: "Snacks", sales: 290, revenue: 58000, trend: "+15%" },
    { id: 4, name: "Caramel Frappe", category: "Beverages", sales: 210, revenue: 84000, trend: "+5%" },
    { id: 5, name: "BBQ Wings", category: "Appetizers", sales: 185, revenue: 74000, trend: "+2%" },
];

export default function TopSellersList({ data = topSellers }) {
    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl h-full flex flex-col">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Crown className="w-6 h-6 text-(--color-gold)" />
                    <h3 className="text-white font-bold text-lg tracking-wider font-display uppercase">
                        Top Sellers
                    </h3>
                </div>
                <button className="text-xs text-(--color-gold) hover:text-white transition-colors flex items-center cursor-pointer">
                    View All <ChevronRight className="w-3 h-3 ml-1" />
                </button>
            </div>

            {/* List Section */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 min-h-[250px]">
                {data.map((item, index) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-(--color-gold)/30 transition-all group cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            {/* Rank Badge */}
                            <div className="w-10 h-10 rounded-lg bg-(--color-gold)/10 border border-(--color-gold)/30 flex items-center justify-center font-bold text-(--color-gold) shadow-inner group-hover:bg-(--color-gold) group-hover:text-black transition-colors">
                                #{index + 1}
                            </div>
                            {/* Item Info */}
                            <div>
                                <h4 className="text-sm font-bold text-white group-hover:text-(--color-gold) transition-colors">
                                    {item.name}
                                </h4>
                                <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                            </div>
                        </div>

                        {/* Sales Stats */}
                        <div className="text-right">
                            <p className="text-sm font-bold text-white">
                                {item.sales} <span className="text-[10px] font-normal text-gray-500 uppercase tracking-wider">sold</span>
                            </p>
                            <p className="text-xs text-green-400 flex items-center justify-end gap-1 mt-1">
                                <TrendingUp className="w-3 h-3" /> {item.trend}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}