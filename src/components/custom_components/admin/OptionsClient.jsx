"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/custom_components/ConfirmModal";
import OptionCard from "./optionsGroupComponents/OptionCard";

export default function OptionsClient({ initialGroups }) {
    const [groups, setGroups] = useState(initialGroups);
    const [searchQuery, setSearchQuery] = useState("");
    const { success, error: showError } = useToast() || {};
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);

    // Filter Logic
    const filteredGroups = useMemo(() => {
        if (!searchQuery) return groups;
        return groups.filter(g =>
            g.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [groups, searchQuery]);

    // Handle Delete
    const requestDelete = useCallback((id) => {
        setGroupToDelete(id);
        setIsDeleteModalOpen(true);
    }, []);

    const confirmDelete = async () => {
        if (!groupToDelete) return;

        const previousGroups = groups;
        setGroups(prev => prev.filter(g => g._id !== groupToDelete));
        setIsDeleteModalOpen(false);

        try {
            const res = await fetch(`/api/option-groups/${groupToDelete}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed");
            if (success) success("Option Group deleted successfully");
        } catch (err) {
            setGroups(previousGroups);
            if (showError) showError("Failed to delete group");
        } finally {
            setGroupToDelete(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-500 pb-20">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Option Groups</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage add-ons like Flavors, Sizes, Drinks.</p>
                </div>
                <Link
                    href="/admin/options/add"
                    className="bg-(--color-gold) text-black px-6 py-3 rounded-xl font-bold hover:bg-[#d4af66] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add New Group
                </Link>
            </div>

            {/* Search */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-xl mb-10 flex gap-4 backdrop-blur-md sticky top-4 z-20 shadow-lg">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                    <Input
                        type="text"
                        placeholder="Search groups..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/50 border-white/10 pl-10 text-white placeholder:text-gray-500 h-12! focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold)"
                    />
                </div>
            </div>

            {/* Grid */}
            {filteredGroups.length === 0 ? (
                <div className="text-center py-24 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
                    <Layers className="w-12 h-12 text-gray-600 mb-4" />
                    <h3 className="text-xl text-gray-300 font-bold">No Option Groups Found</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in slide-in-from-bottom-4 duration-700">
                    {filteredGroups.map((group) => (
                        <OptionCard
                            key={group._id}
                            group={group}
                            onDelete={requestDelete}
                        />
                    ))}
                </div>
            )}

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Option Group?"
                description="Are you sure? This might affect products using this group."
                confirmText="Yes, Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </div>
    );
};