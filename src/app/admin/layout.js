"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Login page par Sidebar nahi dikhana
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen relative z-20">
      {/* Mobile Header (Glass Effect) */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-black/40 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 z-40">
        <span className="text-xl font-bold text-(--color-gold) tracking-widest font-display">
          ADMIN
        </span>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-white hover:bg-white/10 rounded-lg"
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar (Persistent & Glassy) */}
      <aside
        className={`
        fixed md:sticky top-0 left-0 h-screen w-64 
        bg-black/50 backdrop-blur-xl border-r border-white/10 
        z-50 transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        <div className="h-20 flex items-center justify-center border-b border-white/10">
          <span className="text-2xl font-bold text-(--color-gold) tracking-widest font-display">
            CAFE ADMIN
          </span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          <NavLink
            href="/admin/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
            active={pathname === "/admin/dashboard"}
          />
          <NavLink
            href="/admin/products"
            icon={UtensilsCrossed}
            label="Menu"
            active={pathname === "/admin/products"}
          />
          <NavLink
            href="/admin/options"
            icon={UtensilsCrossed}
            label="Add-ons & Options"
            active={pathname === "/admin/options"}
          />
          <NavLink
            href="/admin/orders"
            icon={ShoppingBag}
            label="Live Orders"
            active={pathname === "/admin/orders"}
          />
          <NavLink
            href="/admin/settings"
            icon={Settings}
            label="Settings"
            active={pathname === "/admin/settings"}
          />
          <NavLink
            href="/admin/categories"
            icon={Settings}
            label="categories"
            active={pathname === "/admin/categories"}
          />
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-sm font-medium">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content (Transparent to show Global Marble BG) */}
      <main className="flex-1 w-full pt-16 md:pt-0 p-4 md:p-8">
        {/* Content ke peeche halka sa glass card taake text parha jaye */}
        <div className="min-h-[85vh] rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 p-6 shadow-2xl">
          {children}
        </div>
      </main>
    </div>
  );
}

// Helper Component for Sidebar Links (Gold Active State)
function NavLink({ href, icon: Icon, label, active }) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
        ${
          active
            ? "bg-(--color-gold) text-black shadow-[0_0_15px_rgba(197,160,89,0.4)] font-bold"
            : "text-gray-300 hover:bg-white/10 hover:text-white"
        }
      `}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
}
