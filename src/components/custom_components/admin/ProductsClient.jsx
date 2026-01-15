"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, Search } from "lucide-react";

export default function ProductsClient({ initialProducts }) {
    const [products, setProducts] = useState(initialProducts);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = useMemo(() => {
        const lowerQuery = searchQuery.toLowerCase();
        return products.filter((p) =>
            p.title.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)
        );
    }, [searchQuery, products]);

    // --- Delete Logic ---
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (res.ok) {
                setProducts(products.filter(p => p._id !== id));
            } else {
                alert("Failed to delete");
            }
        } catch (err) { alert("Error deleting"); }
    };

    // --- Grouping Logic ---
    const groupedMenu = filteredProducts.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    return (
        <div className="animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Menu Items</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage food & deals</p>
                </div>
                <Link href="/admin/products/add" className="bg-(--color-gold) text-black px-6 py-3 rounded-xl font-bold hover:bg-[#d4af66] flex items-center gap-2 shadow-[0_0_20px_rgba(197,160,89,0.3)]">
                    <Plus className="w-5 h-5" /> Add New Item
                </Link>
            </div>

            {/* Search Bar */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-xl mb-10 flex gap-4 backdrop-blur-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:border-(--color-gold) outline-none"
                    />
                </div>
            </div>

            {/* Grid */}
            {Object.keys(groupedMenu).length === 0 ? (
                <div className="text-center py-20 text-gray-500">No products found.</div>
            ) : (
                Object.entries(groupedMenu).map(([category, items]) => (
                    <div key={category} className="mb-12">
                        <div className="flex items-center mb-6">
                            <div className="h-6 w-1.5 bg-(--color-gold) mr-3 rounded-sm"></div>
                            <h2 className="text-2xl font-bold uppercase tracking-wide text-white">{category}</h2>
                            <div className="h-px bg-white/10 grow ml-4"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {items.map((product) => (
                                <div key={product._id} className="group bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-gold/50 transition-all duration-300 flex flex-col h-full">

                                    {/* Image */}
                                    <div className="relative h-48 w-full overflow-hidden shrink-0">
                                        <Image src={product.image} alt={product.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                        {!product.isAvailable && (
                                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                                <span className="text-red-500 font-bold border border-red-500 px-2 py-1 rounded text-xs uppercase transform -rotate-12">Not Available</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-white leading-tight line-clamp-1 mr-2">{product.title}</h3>
                                            <span className="text-(--color-gold) font-bold whitespace-nowrap">Rs {product.price}</span>
                                        </div>
                                        <p className="text-gray-400 text-xs line-clamp-2 mb-4 flex-1">{product.desc}</p>

                                        {/* Buttons */}
                                        <div className="flex gap-2 pt-3 border-t border-white/10 mt-auto">
                                            <Link href={`/admin/products/${product._id}`} className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-xs font-bold text-gray-300 flex items-center justify-center gap-2 transition-colors">
                                                <Edit className="w-3 h-3" /> EDIT
                                            </Link>
                                            <button onClick={() => handleDelete(product._id)} className="flex-1 bg-red-500/10 hover:bg-red-500/20 py-2 rounded-lg text-xs font-bold text-red-500 flex items-center justify-center gap-2 transition-colors">
                                                <Trash2 className="w-3 h-3" /> DELETE
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}