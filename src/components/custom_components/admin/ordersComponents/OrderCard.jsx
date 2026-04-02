"use client";

import { useState } from "react";
import { Clock, MapPin, Phone, Loader2, Mail } from "lucide-react";

export default function OrderCard({ order, handleStatusChange }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const changeStatus = async (newStatus) => {
        if (order.status === newStatus) return;
        setIsUpdating(true);
        await handleStatusChange(order._id, newStatus);
        setIsUpdating(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
            case "Cooking": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
            case "Delivered": return "text-green-400 bg-green-400/10 border-green-400/20";
            case "Cancelled": return "text-red-400 bg-red-400/10 border-red-400/20";
            default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
        }
    };

    return (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 md:p-6 hover:border-gold/40 transition-all shadow-lg flex flex-col">

            {/* Top Row: ID, Time, Status */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4 mb-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-(--color-gold) font-mono text-sm md:text-base font-bold bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
                            #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <span className="text-gray-400 text-xs md:text-sm flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(order.createdAt).toLocaleString()}
                        </span>
                    </div>
                    <h3 className="text-white font-display font-bold text-lg md:text-xl tracking-wide uppercase">
                        {order.customerName}
                    </h3>
                </div>

                {/* 1-Click Status Controls */}
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {isUpdating && <Loader2 className="w-5 h-5 text-(--color-gold) animate-spin shrink-0" />}
                    <div className={`flex p-1 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md shrink-0 ${getStatusColor(order.status)}`}>
                        {["Pending", "Cooking", "Delivered", "Cancelled"].map((status) => (
                            <button
                                key={status}
                                onClick={() => changeStatus(status)}
                                disabled={isUpdating}
                                className={`px-3 md:px-4 py-1.5 text-xs md:text-sm font-bold rounded-md transition-all whitespace-nowrap disabled:opacity-50 ${order.status === status
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

            {/* Middle Row: Items & Address */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 flex-1">

                {/* Cart Items */}
                <div className="space-y-3">
                    <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Order Items
                    </p>
                    <div className="space-y-3 max-h-50 overflow-y-auto pr-2 custom-scrollbar">
                        {order.cartItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                <div className="flex-1 pr-3">
                                    <p className="text-gray-200 font-medium">
                                        <span className="text-(--color-gold) font-black mr-2">{item.quantity}x</span>
                                        {item.title}
                                    </p>
                                    {item.selectedOptions?.length > 0 && (
                                        <div className="text-xs text-gray-500 mt-1 flex flex-col gap-0.5 pl-6">
                                            {item.selectedOptions.map((opt, i) => (
                                                <span key={i}>+ {opt.name}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="text-gray-400 font-mono shrink-0 font-medium">
                                    Rs {(item.price * item.quantity).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white/10 pt-3 mt-auto flex justify-between items-end font-bold">
                        <span className="text-white text-sm uppercase tracking-widest">Grand Total</span>
                        <span className="text-(--color-gold) text-lg md:text-xl">
                            Rs {Math.round(order.totalAmount).toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Customer & Delivery Details */}
                <div className="space-y-4 lg:border-l lg:border-white/10 lg:pl-8 flex flex-col">
                    <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Delivery Information
                    </p>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <Phone className="w-4 h-4 text-(--color-gold) shrink-0" />
                            <a href={`tel:${order.phone}`} className="hover:text-(--color-gold) transition-colors font-medium">
                                {order.phone}
                            </a>
                        </div>

                        {order.email && (
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <Mail className="w-4 h-4 text-(--color-gold) shrink-0" />
                                <a href={`mailto:${order.email}`} className="hover:text-(--color-gold) transition-colors">
                                    {order.email}
                                </a>
                            </div>
                        )}

                        <div className="flex items-start gap-3 text-sm text-gray-300">
                            <MapPin className="w-4 h-4 text-(--color-gold) shrink-0 mt-0.5" />
                            <span className="leading-relaxed">
                                {order.address}
                                <span className="block mt-1 text-gray-500 text-xs font-bold uppercase">Area: {order.deliveryArea}</span>
                            </span>
                        </div>
                    </div>

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