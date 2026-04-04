"use client";

import { Loader2, PackageX } from "lucide-react";
import OrderCard from "./OrderCard";

export default function OrderList({ orders, loading, handleStatusChange }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 text-(--color-gold) animate-spin" />
        <p className="text-gray-400 font-medium tracking-widest uppercase text-sm">Syncing Orders...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-[#111] border border-white/5 rounded-2xl">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
           <PackageX className="w-10 h-10 text-gray-500" />
        </div>
        <h3 className="text-xl font-bold text-white font-display uppercase tracking-widest mb-2">No Orders Found</h3>
        <p className="text-gray-500 text-sm max-w-sm text-center">
          We couldn&apos;t find any orders matching your current filters. Try adjusting your search or date range.
        </p>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {orders.map((order) => (
        <OrderCard 
          key={order._id} 
          order={order} 
          handleStatusChange={handleStatusChange} 
        />
      ))}
    </div>
  );
}