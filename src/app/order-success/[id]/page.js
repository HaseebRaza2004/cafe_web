"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Printer, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderSuccessPage() {
  const { id } = useParams(); 
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const json = await res.json();
        if (json.success) {
          setOrder(json.data);
        }
        // else {
        //   router.push("/");
        // }
      } catch (err) {
        console.error("Fetch error");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchOrder();
  }, [id, router]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-10 h-10 text-(--color-gold) animate-spin" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 flex flex-col items-center">
      {/* Non-Printable Header Info */}
      <div className="text-center space-y-4 mb-8 px-4 print:hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-(--color-gold) uppercase tracking-widest">
          Order Secured
        </h1>
        <p className="text-gray-400 max-w-md mx-auto text-sm md:text-base">
          Thank you,{" "}
          <span className="text-white font-bold">{order.customerName}</span>.
          Your premium meal is being prepared.
        </p>
      </div>

      {/* The Receipt Card (Styled for both Screen & Print) */}
      <div className="w-full max-w-xl px-4 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:border-none print:shadow-none print:m-0 print:p-0">
          {/* Print Watermark Logo */}
          <div className="hidden print:block text-center mb-6 border-b border-gray-300 pb-4">
            <h2 className="text-2xl font-bold font-display uppercase tracking-widest">
              Luxury Cafe
            </h2>
            <p className="text-xs text-gray-500">Premium Dining Experience</p>
          </div>

          <div className="flex justify-between items-start mb-8 border-b border-white/10 print:border-gray-300 pb-6">
            <div>
              <p className="text-xs text-gray-500 print:text-gray-600 uppercase tracking-wider font-bold mb-1">
                Order ID
              </p>
              <p className="font-mono text-sm md:text-base">
                {order._id.slice(-8).toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 print:text-gray-600 uppercase tracking-wider font-bold mb-1">
                Date
              </p>
              <p className="text-sm md:text-base">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-4 mb-8">
            {order.cartItems.map((item, i) => (
              <div key={i} className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-bold text-sm md:text-base">
                    <span className="text-(--color-gold) print:text-black mr-2">
                      {item.quantity}x
                    </span>
                    {item.title}
                  </p>
                  {item.selectedOptions?.length > 0 && (
                    <p className="text-xs text-gray-400 print:text-gray-600 mt-1 pl-6">
                      + {item.selectedOptions.map((opt) => opt.name).join(", ")}
                    </p>
                  )}
                </div>
                <p className="font-mono text-sm md:text-base font-medium">
                  Rs {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Bill Summary */}
          <div className="bg-black/40 print:bg-gray-50 rounded-xl p-4 space-y-3 border border-white/5 print:border-gray-200">
            <div className="flex justify-between text-sm text-gray-400 print:text-gray-600">
              <span>Subtotal</span>
              <span>Rs {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400 print:text-gray-600">
              <span>Tax (15%)</span>
              <span>Rs {Math.round(order.tax).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400 print:text-gray-600">
              <span>Delivery Fee ({order.deliveryArea})</span>
              <span>Rs {order.deliveryFee.toLocaleString()}</span>
            </div>
            <div className="h-px bg-white/10 print:bg-gray-300 my-2" />
            <div className="flex justify-between font-bold text-lg md:text-xl text-(--color-gold) print:text-black">
              <span>Total Amount</span>
              <span>Rs {Math.round(order.totalAmount).toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500 print:block">
            <p>
              Payment Method:{" "}
              <span className="font-bold text-white print:text-black">
                {order.paymentMethod}
              </span>
            </p>
            {order.changeRequest && (
              <p>Change requested for: Rs {order.changeRequest}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons (Hidden when printing) */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 px-4 w-full max-w-xl print:hidden animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
        <Button
          onClick={handlePrint}
          variant="outline"
          className="flex-1 h-14 border-(--color-gold) text-(--color-gold) hover:bg-(--color-gold) hover:text-black uppercase tracking-widest font-bold"
        >
          <Printer className="w-5 h-5 mr-2" /> Download Receipt
        </Button>
        <Link href="/" className="flex-1">
          <Button className="w-full h-14 bg-white/10 hover:bg-white/20 text-white uppercase tracking-widest font-bold border-none">
            <ArrowLeft className="w-5 h-5 mr-2" /> Return to Menu
          </Button>
        </Link>
      </div>
    </div>
  );
}