"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit2, Trash2, Loader2, Tag } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function DealsListPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error: showError } = useToast();

  // 🔥 FIX: Moved fetchDeals inside useEffect
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
  }, [showError]); // Added dependency to satisfy linter

  const handleDelete = async (id) => {
    if (!confirm("Delete this deal?")) return;
    try {
      const res = await fetch(`/api/deals/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeals(deals.filter((d) => d._id !== id));
        success("Deal Deleted");
      }
    } catch (err) {
      showError("Failed to delete");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-(--color-gold) animate-spin" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Active Deals
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your combo offers.
          </p>
        </div>
        <Link
          href="/admin/deals/add"
          className="bg-(--color-gold) text-black px-5 py-2 rounded-xl font-bold hover:bg-[#d4af66] flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(197,160,89,0.2)]"
        >
          <Plus className="w-5 h-5" /> Create Deal
        </Link>
      </div>

      {deals.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
          <Tag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl text-gray-400 font-bold">No Deals Found</h3>
          <p className="text-gray-500 text-sm">
            Create your first deal to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <div
              key={deal._id}
              className="group bg-black/40 border border-white/10 rounded-2xl overflow-hidden hover:border-(--color-gold)/50 transition-all"
            >
              {/* Image */}
              <div className="relative h-48 w-full">
                <Image
                  src={deal.image || "/placeholder.jpg"}
                  alt={deal.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-(--color-gold) font-bold text-sm border border-white/10">
                  Rs {deal.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                  {deal.title}
                </h3>
                <p className="text-gray-400 text-xs line-clamp-2 mb-4 h-8">
                  {deal.desc}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500 font-mono mb-4 bg-black/30 p-2 rounded border border-white/5">
                  <span className="text-(--color-gold)">
                    {deal.itemGroups?.length || 0} Steps:
                  </span>
                  {deal.itemGroups?.map((g) => g.heading).join(", ") || "None"}
                </div>

                <div className="flex gap-3 mt-auto">
                  <Link
                    href={`/admin/deals/add?id=${deal._id}`}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 border border-white/10 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(deal._id)}
                    className="px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}