"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Loader2, Tag } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import AdminCard from "@/components/custom_components/admin/AdminCard"; // IMPORTED

export default function DealsListPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error: showError } = useToast();

  // Fetch Logic
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
    return () => { isMounted = false; };
  }, [showError]); 

  // Delete Logic
  const handleDelete = useCallback(async (id) => {
    if (!confirm("Delete this deal?")) return;
    try {
        const res = await fetch(`/api/deals/${id}`, { method: "DELETE" });
        if (res.ok) {
            setDeals((prev) => prev.filter((d) => d._id !== id));
            success("Deal Deleted Successfully");
        } else {
            showError("Failed to delete deal");
        }
    } catch (err) {
        showError("Error deleting deal");
    }
  }, [success, showError]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-(--color-gold) animate-spin" />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-500 pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Active Deals</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your combo offers.</p>
        </div>
        <Link
          href="/admin/deals/add"
          className="bg-(--color-gold) text-black px-5 py-2 rounded-xl font-bold hover:bg-[#d4af66] flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(197,160,89,0.2)] active:scale-95"
        >
          <Plus className="w-5 h-5" /> Create Deal
        </Link>
      </div>

      {/* Grid */}
      {deals.length === 0 ? (
        <div className="text-center py-24 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
          <Tag className="w-12 h-12 text-gray-600 mb-4" />
          <h3 className="text-xl text-gray-300 font-bold">No Deals Found</h3>
          <p className="text-gray-500 text-sm mt-2">Create your first deal to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {deals.map((deal) => (
            <AdminCard 
                key={deal._id} 
                data={deal} 
                type="deal" 
                onDelete={handleDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
}