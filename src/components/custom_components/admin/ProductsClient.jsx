"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import AdminCard from "./AdminCard";
import ConfirmModal from "@/components/custom_components/ConfirmModal";
import { useToast } from "@/context/ToastContext";
import { Input } from "@/components/ui/input";

export default function ProductsClient({ initialProducts }) {
    const [products, setProducts] = useState(initialProducts);
    const [searchQuery, setSearchQuery] = useState("");
    const { success, error: showError } = useToast() || {};
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

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
    const requestDelete = useCallback((id) => {
        setProductToDelete(id);
        setIsDeleteModalOpen(true);
    }, []);

    const confirmDelete = async () => {
        if (!productToDelete) return;
        const previousProducts = products;
        setProducts(prev => prev.filter(p => p._id !== productToDelete));
        setIsDeleteModalOpen(false);

        try {
            const res = await fetch(`/api/products/${productToDelete}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed");
            if (success) success("Product deleted successfully");
        } catch (err) {
            setProducts(previousProducts);
            if (showError) showError("Failed to delete product");
        } finally {
            setProductToDelete(null);
        }
    };

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
                    <p className="text-gray-400 text-sm mt-1">Manage food & drinks</p>
                </div>
                <Link
                    href="/admin/products/add"
                    className="bg-(--color-gold) text-black text-lg px-6 py-3 rounded-xl font-bold hover:bg-[#d4af66] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Add New Item
                </Link>
            </div>

            {/* Search Bar */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-xl mb-10 flex gap-4 backdrop-blur-md sticky top-20 md:top-4 z-20 shadow-lg">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 z-10" />
                    <Input
                        type="text"
                        placeholder="Search by name or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/50 border-white/10 pl-10 text-white placeholder:text-gray-500 h-12! focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold) transition-colors outline-none rounded-lg"
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
                                    onDelete={requestDelete}
                                />
                            ))}
                        </div>
                    </div>
                ))
            )}

            {/* --- NEW CONFIRM MODAL --- */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Item?"
                description="Are you sure you want to delete this item? This action cannot be undone and will remove it from the live menu."
                confirmText="Yes, Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </div>
    );
}