"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Pusher from "pusher-js";
import { BellRing, BellOff, Download } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/button";
import OrderList from "@/components/custom_components/admin/ordersComponents/OrderList";
import OrderFilters from "@/components/custom_components/admin/ordersComponents/OrderFilters";
import AdminOrdersHeader from "@/components/custom_components/admin/ordersComponents/AdminOrdersHeader";

export default function AdminOrdersPage() {
  const { success, error: showError, info } = useToast() || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [audio, setAudio] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [quickFilter, setQuickFilter] = useState("All");
  const alertsRef = useRef(alertsEnabled);
  const audioRef = useRef(audio);
  const successRef = useRef(success);

  // Keep Refs updated silently
  useEffect(() => {
    alertsRef.current = alertsEnabled;
  }, [alertsEnabled]);
  useEffect(() => {
    audioRef.current = audio;
  }, [audio]);
  useEffect(() => {
    successRef.current = success;
  }, [success]);

  // Initialize Audio
  useEffect(() => {
    setAudio(new Audio("/bell.mp3"));
  }, []);

  const toggleAlerts = () => {
    if (!alertsEnabled) {
      if (audio) {
        audio
          .play()
          .catch((e) => console.log("Audio play failed on enable", e));
      }
      if (success) success("Real-Time Audio Alerts Enabled!");
    } else {
      if (info) info("Audio Alerts Disabled.");
    }
    setAlertsEnabled(!alertsEnabled);
  };

  // Fetch Initial Orders
  const fetchOrders = useCallback(
    async (showLoader = true) => {
      if (showLoader) setLoading(true);
      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        const json = await res.json();
        if (json.success) setOrders(json.data);
      } catch (err) {
        if (showError) showError("Failed to fetch initial orders.");
      } finally {
        if (showLoader) setLoading(false);
      }
    },
    [showError],
  );

  // Offline Sync (When internet comes back)
  useEffect(() => {
    const handleOnline = () => {
      if (info) info("Internet restored. Syncing missed orders...");
      fetchOrders(false);
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [fetchOrders, info]);

  // Initial Load & Pusher Setup
  useEffect(() => {
    fetchOrders(true);
  }, [fetchOrders]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe("admin-channel");

    channel.bind("new-order", (data) => {
      if (data && data.order) {
        setOrders((prevOrders) => [data.order, ...prevOrders]);

        if (successRef.current)
          successRef.current(
            `New Order Received from ${data.order.customerName}!`,
          );

        if (alertsRef.current && audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current
            .play()
            .catch((err) => console.log("Audio blocked by browser:", err));
        }
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  // Handle Status Update (Passed down to child)
  const handleStatusChange = async (orderId, newStatus) => {
    const previousOrders = [...orders];
    setOrders(
      orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)),
    );

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);
      if (success) success(`Order status changed to ${newStatus}`);
    } catch (err) {
      setOrders(previousOrders);
      if (showError) showError(err.message || "Failed to update status");
    }
  };

  // FILTERING LOGIC
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search By (Name, Phone, ID)
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.customerName.toLowerCase().includes(lowerQuery) ||
          o.phone.includes(lowerQuery) ||
          o._id.toLowerCase().includes(lowerQuery) ||
          (o.email && o.email.toLowerCase().includes(lowerQuery)),
      );
    }

    if (selectedDate) {
      result = result.filter((o) => {
        const orderDate = new Date(o.createdAt).toISOString().split("T")[0];
        return orderDate === selectedDate;
      });
    }

    // Quick Filters (Today, Week, Month)
    if (quickFilter !== "All" && !selectedDate) {
      const now = new Date();
      result = result.filter((o) => {
        const orderDate = new Date(o.createdAt);
        if (quickFilter === "Today") {
          return orderDate.toDateString() === now.toDateString();
        }
        if (quickFilter === "Week") {
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return orderDate >= oneWeekAgo;
        }
        if (quickFilter === "Month") {
          return (
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          );
        }
        return true;
      });
    }

    return result;
  }, [orders, searchQuery, selectedDate, quickFilter]);

  // EXPORT TO CSV LOGIC
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      if (showError) showError("No data to export!");
      return;
    }

    // Prepare Headers
    const headers = [
      "Order ID",
      "Date",
      "Customer",
      "Phone",
      "Area",
      "Status",
      "Items Count",
      "Subtotal",
      "Tax",
      "Delivery Fee",
      "Total Amount",
    ];

    // Prepare Rows
    const rows = filteredOrders.map((o) => [
      o._id,
      new Date(o.createdAt).toLocaleString(),
      `"${o.customerName}"`,
      o.phone,
      o.deliveryArea,
      o.status,
      o.cartItems.reduce((acc, item) => acc + item.quantity, 0),
      o.subtotal,
      o.tax,
      o.deliveryFee,
      o.totalAmount,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `LuxuryCafe_Orders_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (success) success("CSV Report Downloaded Successfully!");
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <AdminOrdersHeader
        alertsEnabled={alertsEnabled}
        toggleAlerts={toggleAlerts}
        handleExportCSV={handleExportCSV}
      />

      {/* Advanced Filters Component */}
      <OrderFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        quickFilter={quickFilter}
        setQuickFilter={setQuickFilter}
        totalResults={filteredOrders.length}
      />

      {/* Orders List Component */}
      <OrderList
        orders={filteredOrders}
        loading={loading}
        handleStatusChange={handleStatusChange}
      />
    </div>
  );
}
