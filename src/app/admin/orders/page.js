"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  RefreshCw,
  Clock,
  MapPin,
  Phone,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); 

  // Fetch Orders
  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      const json = await res.json();
      if (json.success) setOrders(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle Status Change
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders(
          orders.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o
          )
        );
      }
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  // Status Colors Helper
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "Cooking":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "Delivered":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "Cancelled":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Live Orders
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage realtime customer orders
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="bg-white/5 hover:bg-white/10 text-(--color-gold) px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all border border-white/10"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />{" "}
          Refresh List
        </button>
      </div>

      {/* Orders List (Cards for Mobile-First) */}
      <div className="space-y-4">
        {loading && orders.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-(--color-gold) animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No orders found yet.
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-black/40 border border-white/10 rounded-xl p-5 hover:border-gold/30 transition-all"
            >
              {/* Top Row: ID, Time, Status */}
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-white/5 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-(--color-gold) font-mono text-sm">
                      #{order._id.slice(-6)}
                    </span>
                    <span className="text-gray-500 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg mt-1">
                    {order.customerName}
                  </h3>
                </div>

                {/* Status Dropdown (Custom UI for Luxury Feel) */}
                <div className="flex items-center gap-3">
                  {updating === order._id && (
                    <Loader2 className="w-4 h-4 text-(--color-gold) animate-spin" />
                  )}
                  <div
                    className={`flex p-1 rounded-lg bg-black/50 border border-white/10 ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {["Pending", "Cooking", "Delivered", "Cancelled"].map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(order._id, status)}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                            order.status === status
                              ? "bg-white/10 text-white shadow-sm"
                              : "text-gray-500 hover:text-gray-300"
                          }`}
                        >
                          {status}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Middle Row: Items & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cart Items */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Order Items
                  </p>
                  {order.cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-start text-sm"
                    >
                      <div className="text-gray-300">
                        <span className="text-(--color-gold) font-bold">
                          {item.qty}x{" "}
                        </span>
                        {item.title}
                        {item.variations && (
                          <span className="text-gray-500 text-xs ml-1">
                            ({item.variations})
                          </span>
                        )}
                      </div>
                      <div className="text-gray-400">
                        Rs {item.price * item.qty}
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-2 mt-2 flex justify-between font-bold text-white">
                    <span>Total Amount</span>
                    <span className="text-(--color-gold) text-lg">
                      Rs {order.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-3 md:border-l md:border-white/10 md:pl-6">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Delivery Details
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Phone className="w-4 h-4 text-(--color-gold)" />
                    <a
                      href={`tel:${order.phone}`}
                      className="hover:text-white underline"
                    >
                      {order.phone}
                    </a>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-gray-300">
                    <MapPin className="w-4 h-4 text-(--color-gold) shrink-0 mt-0.5" />
                    <span>{order.address}</span>
                  </div>

                  {order.instruction && (
                    <div className="bg-yellow-500/5 border border-yellow-500/20 p-2 rounded text-xs text-yellow-200 mt-2">
                      <span className="font-bold">Note:</span>{" "}
                      {order.instruction}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
