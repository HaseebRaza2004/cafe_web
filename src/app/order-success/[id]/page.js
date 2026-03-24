"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Printer, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderTracker from "@/components/custom_components/order-success/OrderTracker";
import OrderReceipt from "@/components/custom_components/order-success/OrderReceipt";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Background Polling Logic
  const fetchOrder = useCallback(async (isBackground = false) => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      const json = await res.json();
      if (json.success) {
        setOrder(json.data);
      } else {
        if (!isBackground) router.push("/");
      }
    } catch (err) {
      console.error("Fetch error");
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) {
      fetchOrder(false);
      const interval = setInterval(() => fetchOrder(true), 15000); 
      return () => clearInterval(interval);
    }
  }, [id, fetchOrder]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-(--color-gold) animate-spin" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen text-white pt-24 pb-20 flex flex-col items-center print:pt-0 print:pb-0 print:bg-white print:block">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-4 mb-8 mt-20 px-4 print:hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-gold uppercase tracking-widest">
          {order.status === "Cancelled" ? "Order Cancelled" : "Order Secured"}
        </h1>
        <p className="text-gray-400 max-w-md mx-auto text-sm md:text-base">
          {order.status === "Cancelled" 
            ? "Your order has been cancelled." 
            : <span>Thank you, <span className="text-gold font-bold">{order.customerName}</span>. Your meal is processing.</span>
          }
        </p>
      </div>

      {/* STEPPER COMPONENT */}
      <OrderTracker status={order.status} />

      {/* RECEIPT COMPONENT */}
      <OrderReceipt order={order} />

      {/* ACTION BUTTONS (Hidden in print) */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 px-4 w-full max-w-xl print:hidden animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
        <Button 
          onClick={handlePrint}
          variant="outline"
          disabled={order.status === "Cancelled"}
          className="flex-1 h-14 border-(--color-gold) text-(--color-gold) hover:bg-(--color-gold) hover:text-black uppercase tracking-widest font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Printer className="w-5 h-5 mr-2" /> Download Receipt
        </Button>
        <Link href="/" className="flex-1">
          <Button className="w-full h-14 bg-white/10 hover:bg-white/20 text-white uppercase tracking-widest font-bold border-none transition-all">
            <ArrowLeft className="w-5 h-5 mr-2" /> Return to Menu
          </Button>
        </Link>
      </div>

    </div>
  );
}