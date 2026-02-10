"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import AdminCard from "./AdminCard";

export default function ProductsClient({ initialProducts }) {
    const [products, setProducts] = useState(initialProducts);
    const [searchQuery, setSearchQuery] = useState("");

    // Filtering
    const filteredProducts = useMemo(() => {
        if (!searchQuery) return products;
        const lowerQuery = searchQuery.toLowerCase();
        return products.filter((p) =>
            p.title.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)
        );
    }, [searchQuery, products]);

    // handle Delete
    const handleDelete = useCallback(async (id) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        
        // Optimistic update: Remove from UI immediately
        const previousProducts = products;
        setProducts(prev => prev.filter(p => p._id !== id));

        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed");
        } catch (err) {
            alert("Error deleting item");
            setProducts(previousProducts);
        }
    }, [products]);

    // Grouping Logic
    const groupedMenu = useMemo(() => filteredProducts.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {}), [filteredProducts]);

    return (
        <div className="animate-in fade-in zoom-in-95 duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Menu Items</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage food & deals</p>
                </div>
                <Link href="/admin/products/add" className="bg-(--color-gold)] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#d4af66] flex items-center gap-2 shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all active:scale-95">
                    <Plus className="w-5 h-5" /> Add New Item
                </Link>
            </div>

            {/* Search Bar */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-xl mb-10 flex gap-4 backdrop-blur-md sticky top-4 z-20">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:border-(--color-gold) outline-none transition-colors"
                    />
                </div>
            </div>

            {/* Grid */}
            {Object.keys(groupedMenu).length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-white/5 rounded-xl border border-white/5">
                    No products found matching your search.
                </div>
            ) : (
                Object.entries(groupedMenu).map(([category, items]) => (
                    <div key={category} className="mb-12">
                        {/* Category Heading */}
                        <div className="flex items-center mb-6">
                            <div className="h-6 w-1.5 bg-(--color-gold) mr-3 rounded-sm shadow-[0_0_10px_var(--color-gold)]"></div>
                            <h2 className="text-2xl font-bold uppercase tracking-wide text-white">{category}</h2>
                            <div className="h-px bg-white/10 grow ml-4"></div>
                        </div>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {items.map((product) => (
                                <AdminCard 
                                    key={product._id} 
                                    data={product} 
                                    type="product" 
                                    onDelete={handleDelete} 
                                />
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}