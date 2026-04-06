"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Pusher from "pusher-js";
import { useToast } from "@/context/ToastContext";
import OrderList from "@/components/custom_components/admin/ordersComponents/OrderList";
import OrderFilters from "@/components/custom_components/admin/ordersComponents/OrderFilters";
import AdminOrdersHeader from "@/components/custom_components/admin/ordersComponents/AdminOrdersHeader";
import { Button } from "@/components/ui/button"; // Shadcn button for pagination
import { ChevronLeft, ChevronRight } from "lucide-react";
import OrderPagination from "@/components/custom_components/admin/ordersComponents/OrderPagination";

export default function AdminOrdersPage() {
  const { success, error: showError, info } = useToast() || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [audio, setAudio] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [quickFilter, setQuickFilter] = useState("Today");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Refs for real-time callbacks
  const alertsRef = useRef(alertsEnabled);
  const audioRef = useRef(audio);
  const successRef = useRef(success);

  useEffect(() => {
    alertsRef.current = alertsEnabled;
  }, [alertsEnabled]);
  useEffect(() => {
    audioRef.current = audio;
  }, [audio]);
  useEffect(() => {
    successRef.current = success;
  }, [success]);

  // Reset to page 1 whenever ANY filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDate, quickFilter, statusFilter]);

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

  // Offline Sync
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

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe("admin-channel");

    channel.bind("new-order", (data) => {
      if (data && data.order) {
        setOrders((prevOrders) => [data.order, ...prevOrders]);

        if (successRef.current) {
          successRef.current(
            `New Order Received from ${data.order.customerName}!`,
          );
        }

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
  }, [fetchOrders]);

  // Handle Status Update
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

  // ADVANCED FILTERING LOGIC
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Status Filter (All, Pending, Cooking, Delivered, Cancelled)
    if (statusFilter !== "All") {
      result = result.filter((o) => o.status === statusFilter);
    }

    // Search Filter
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

    // Date Filter
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
  }, [orders, searchQuery, selectedDate, quickFilter, statusFilter]);

  // PAGINATION LOGIC
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // EXPORT TO CSV
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      if (showError) showError("No data to export!");
      return;
    }

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
      <AdminOrdersHeader
        alertsEnabled={alertsEnabled}
        toggleAlerts={toggleAlerts}
        handleExportCSV={handleExportCSV}
      />

      <OrderFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        quickFilter={quickFilter}
        setQuickFilter={setQuickFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        totalResults={totalItems}
      />

      {/* Passed Paginated Orders instead of all filtered orders */}
      <OrderList
        orders={paginatedOrders}
        loading={loading}
        handleStatusChange={handleStatusChange}
      />

      {/* Simple & Clean Pagination UI */}
      <OrderPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};