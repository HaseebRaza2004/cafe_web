"use client";

import { useState } from "react";
import { Clock, MapPin, Phone, Loader2, Mail, FileText } from "lucide-react";

export default function OrderCard({ order, handleStatusChange }) {
    const [isUpdating, setIsUpdating] = useState(false);

    const changeStatus = async (newStatus) => {
        if (order.status === newStatus) return;
        setIsUpdating(true);
        await handleStatusChange(order._id, newStatus);
        setIsUpdating(false);
    };

    // status color classes
    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
            case "Cooking": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
            case "Delivered": return "text-green-400 bg-green-400/10 border-green-400/20";
            case "Cancelled": return "text-red-400 bg-red-400/10 border-red-400/20";
            default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
        }
    };

    // Format date/time
    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
        });
    };

    return (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 md:p-6 hover:border-gold/40 transition-all shadow-lg flex flex-col">

            {/* ID & Date/Time */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                <span className="text-(--color-gold) font-mono text-sm md:text-base font-bold bg-(--color-gold)/10 px-2 py-0.5 rounded border border-(--color-gold)/20 shrink-0">
                    #{order._id.slice(-8).toUpperCase()}
                </span>
                <span className="text-gray-400 text-xs md:text-sm flex items-center gap-1.5 font-medium shrink-0 text-right">
                    <Clock className="w-3.5 h-3.5 text-(--color-gold)" />
                    {formatDateTime(order.createdAt)}
                </span>
            </div>

            {/* Name & Status Controls */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
                <h3 className="text-white font-display font-bold text-xl md:text-2xl tracking-wide uppercase">
                    {order.customerName}
                </h3>

                {/* 1-Click Status Controls */}
                <div className="flex items-center justify-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide shrink-0">
                    {isUpdating && <Loader2 className="w-5 h-5 text-(--color-gold) animate-spin shrink-0" />}
                    <div className={`flex p-1 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md shrink-0 ${getStatusColor(order.status)}`}>
                        {["Pending", "Cooking", "Delivered", "Cancelled"].map((status) => (
                            <button
                                key={status}
                                onClick={() => changeStatus(status)}
                                disabled={isUpdating}
                                className={`px-2 md:px-4 py-1.5 text-xs md:text-sm font-bold rounded-md transition-all whitespace-nowrap cursor-pointer disabled:opacity-50 ${order.status === status
                                        ? "bg-white/15 text-white shadow-md"
                                        : "text-gray-500 hover:text-white"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Items/Bill & Delivery Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 flex-1">

                {/* LEFT SIDE: Cart Items & Billing */}
                <div className="flex flex-col h-full">
                    <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                        Order Details
                    </p>
                    
                    {/* Items Scrollable List */}
                    <div className="space-y-4 max-h-62.5 overflow-y-auto custom-scrollbar pr-2 flex-1">
                        {order.cartItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                <div className="flex-1 pr-3">
                                    <p className="text-gray-200 font-medium">
                                        <span className="text-(--color-gold) font-black mr-2">{item.quantity}x</span>
                                        {item.title}
                                    </p>
                                    
                                    {/* Item Variations/Addons */}
                                    {item.selectedOptions?.length > 0 && (
                                        <div className="text-xs text-gray-500 mt-1 flex flex-col gap-0.5 pl-6">
                                            {item.selectedOptions.map((opt, i) => (
                                                <span key={i}>+ {opt.name}</span>
                                            ))}
                                        </div>
                                    )}

                                    {/* 🟢 CUSTOMER NOTE (Specific to this item) */}
                                    {item.customerNote && (
                                        <div className="text-xs text-yellow-500/90 mt-1.5 pl-6 flex items-start gap-1">
                                            <FileText className="w-3 h-3 shrink-0 mt-0.5" />
                                            <span className="italic leading-tight">Note: {item.customerNote}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="text-gray-400 font-mono shrink-0 font-medium">
                                    Rs {(item.price * item.quantity).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Detailed Billing Breakdown */}
                    <div className="border-t border-white/10 pt-3 mt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-400 font-medium">
                            <span>Subtotal</span>
                            <span>Rs {Math.round(order.subtotal).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-400 font-medium">
                            <span>Tax</span>
                            <span>Rs {Math.round(order.tax).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-400 font-medium">
                            <span>Delivery Fee</span>
                            <span>Rs {Math.round(order.deliveryFee).toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between items-end font-bold pt-2 border-t border-white/5">
                            <span className="text-white text-sm uppercase tracking-widest">Grand Total</span>
                            <span className="text-(--color-gold) text-xl">
                                Rs {Math.round(order.totalAmount).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Delivery & Customer Info */}
                <div className="space-y-4 lg:border-l lg:border-white/10 lg:pl-8 flex flex-col pt-6 lg:pt-0 border-t border-white/5 lg:border-t-0">
                    <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Delivery Information
                    </p>

                    <div className="space-y-3.5">
                        {/* Phone */}
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <Phone className="w-4 h-4 text-(--color-gold) shrink-0" />
                            <a href={`tel:${order.phone}`} className="hover:text-(--color-gold) transition-colors font-medium">
                                {order.phone}
                            </a>
                        </div>

                        {/* 🟢 Alternate Phone (Optional) */}
                        {order.altPhone && (
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                                <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Alt:</span>
                                <a href={`tel:${order.altPhone}`} className="hover:text-white transition-colors">
                                    {order.altPhone}
                                </a>
                            </div>
                        )}

                        {/* Email (Optional) */}
                        {order.email && (
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <Mail className="w-4 h-4 text-(--color-gold) shrink-0" />
                                <a href={`mailto:${order.email}`} className="hover:text-(--color-gold) transition-colors">
                                    {order.email}
                                </a>
                            </div>
                        )}

                        {/* Address & Area & Landmark */}
                        <div className="flex items-start gap-3 text-sm text-gray-300">
                            <MapPin className="w-4 h-4 text-(--color-gold) shrink-0 mt-0.5" />
                            <span className="leading-relaxed">
                                {order.address}
                                
                                {/* 🟢 Nearest Landmark (Optional) */}
                                {order.landmark && (
                                    <span className="block mt-1 text-gray-400 text-xs italic">
                                        <span className="text-gray-500 font-bold not-italic">Landmark:</span> {order.landmark}
                                    </span>
                                )}
                                
                                <span className="block mt-1 text-(--color-gold) text-xs font-bold uppercase tracking-wider">
                                    Area: {order.deliveryArea}
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* Order Level Notes (Change Request & Instructions) */}
                    <div className="mt-auto space-y-2 pt-4">
                        {order.changeRequest && (
                            <div className="bg-gold/10 border border-gold/20 p-3 rounded-lg text-xs text-(--color-gold) font-medium">
                                <span className="font-bold text-white uppercase tracking-wider mr-2">Change For:</span>
                                Rs {order.changeRequest}
                            </div>
                        )}

                        {order.instruction && (
                            <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg text-xs text-yellow-300 leading-relaxed">
                                <span className="font-bold text-yellow-500 uppercase tracking-wider block mb-1">Customer Note:</span>
                                {order.instruction}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}