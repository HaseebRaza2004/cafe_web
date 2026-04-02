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
  const fetchOrder = useCallback(
    async (isBackground = false) => {
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
    },
    [id, router],
  );

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
          {order.status === "Cancelled" ? (
            "Your order has been cancelled."
          ) : (
            <span>
              Thank you,{" "}
              <span className="text-gold font-bold">{order.customerName}</span>.
              Your meal is processing.
            </span>
          )}
        </p>
      </div>

      {/* STEPPER COMPONENT */}
      <OrderTracker status={order.status} />

      {/* RECEIPT COMPONENT */}
      <OrderReceipt order={order} />

      {/* ACTION BUTTONS */}
      <div className="mt-10 flex flex-col md:flex-row gap-4 px-4 w-full max-w-xl mx-auto print:hidden animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
        
        <Button 
          onClick={handlePrint}
          variant="outline"
          disabled={order.status === "Cancelled"}
          className="flex-1 min-h-14 bg-(--color-gold) text-black hover:bg-(--color-gold-dark) border-none uppercase tracking-widest duration-400 hover:scale-105 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <Printer className="w-5 h-5 mr-2 shrink-0" /> Download Receipt
        </Button>

        <Button 
          asChild
          className="flex-1 min-h-14 bg-white/90 hover:bg-gold hover:text-black text-gold-dark uppercase tracking-widest font-bold border-none rounded-md text-lg duration-400 hover:scale-105 transition-all cursor-pointer"
        >                             
          <Link href="/">
            <ArrowLeft className="w-5 h-5 mr-2 shrink-0" /> Return to Menu
          </Link>
        </Button>

      </div>
    </div>
  );
}
