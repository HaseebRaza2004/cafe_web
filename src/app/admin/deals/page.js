"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Plus, Loader2, Tag, Search } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import AdminCard from "@/components/custom_components/admin/AdminCard";
import ConfirmModal from "@/components/custom_components/ConfirmModal";
import { Input } from "@/components/ui/input";

export default function DealsListPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState(null);

  const { success, error: showError } = useToast() || {};

  // Fetch data
  useEffect(() => {
    let isMounted = true;
    async function fetchDeals() {
      try {
        const res = await fetch("/api/deals");
        const json = await res.json();
        if (isMounted && json.success) setDeals(json.data);
      } catch (err) {
        if (isMounted) showError("Failed to load deals");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchDeals();
    return () => {
      isMounted = false;
    };
  }, [showError]);

  // Search Logic
  const filteredDeals = useMemo(() => {
    if (!searchQuery) return deals;
    const lowerQuery = searchQuery.toLowerCase();
    return deals.filter(
      (d) =>
        d.title.toLowerCase().includes(lowerQuery) ||
        d.desc?.toLowerCase().includes(lowerQuery),
    );
  }, [deals, searchQuery]);

  // Handle Delete
  const requestDelete = useCallback((id) => {
    setDealToDelete(id);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = async () => {
    if (!dealToDelete) return;

    const previousDeals = deals;
    setDeals((prev) => prev.filter((d) => d._id !== dealToDelete));
    setIsDeleteModalOpen(false);

    try {
      const res = await fetch(`/api/deals/${dealToDelete}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (success) success("Deal Deleted Successfully");
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      setDeals(previousDeals);
      if (showError) showError("Error deleting deal");
    } finally {
      setDealToDelete(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-(--color-gold) animate-spin" />
      </div>
    );

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Deals
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your deals & offers
          </p>
        </div>
        <Link
          href="/admin/deals/add"
          className="bg-(--color-gold) text-black px-6 py-3 rounded-xl font-bold hover:bg-[#d4af66] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> Create Deal
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-black/40 border border-white/10 p-4 rounded-xl mb-10 flex gap-4 backdrop-blur-md sticky top-20 md:top-4 z-20 shadow-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 z-10" />
          <Input
            type="text"
            placeholder="Search deals by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/50 border-white/10 pl-10 text-white placeholder:text-gray-500 h-12! focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold) transition-colors outline-none rounded-lg"
          />
        </div>
      </div>

      {/* Grid Content */}
      {filteredDeals.length === 0 ? (
        <div className="text-center py-24 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
          <Tag className="w-12 h-12 text-gray-600 mb-4" />
          <h3 className="text-xl text-gray-300 font-bold">
            {searchQuery ? "No deals match your search" : "No Deals Found"}
          </h3>
          {!searchQuery && (
            <p className="text-gray-500 text-sm mt-2">
              Create your first deal to get started.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-700">
          {filteredDeals.map((deal) => (
            <AdminCard
              key={deal._id}
              data={deal}
              type="deal"
              onDelete={requestDelete}
            />
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Deal?"
        description="Are you sure you want to delete this deal? This action cannot be undone and will remove it from the live website."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
