// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   LayoutDashboard,
//   ShoppingBag,
//   UtensilsCrossed,
//   Settings,
//   LogOut,
//   Menu,
//   X,
//   HandPlatter,
//   LayoutGrid,
//   Puzzle,
// } from "lucide-react";

// export default function AdminLayout({ children }) {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const pathname = usePathname();

//   if (pathname === "/admin/login") {
//     return <>{children}</>;
//   }

//   return (
//     <div className="flex min-h-screen relative z-20">
//       {/* Mobile Header */}
//       <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-black/40 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 z-40">
//         <span className="text-xl font-bold text-(--color-gold) tracking-widest font-display">
//           ADMIN
//         </span>
//         <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="p-2 text-white hover:bg-white/10 rounded-lg"
//         >
//           {isSidebarOpen ? <X /> : <Menu />}
//         </button>
//       </div>

//       {/* Sidebar */}
//       <aside
//         className={`
//         fixed md:sticky top-0 left-0 h-screen w-64
//         bg-black/50 backdrop-blur-xl border-r rounded-r-xl border-white/10
//         z-50 transition-transform duration-300 ease-in-out flex flex-col
//         ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
//         md:translate-x-0
//       `}
//       >
//         <div className="h-20 flex items-center justify-center border-b border-white/10">
//           <span className="text-2xl font-bold text-(--color-gold) tracking-widest font-display">
//             CAFE ADMIN
//           </span>
//         </div>

//         <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
//           <NavLink
//             href="/admin/dashboard"
//             icon={LayoutDashboard}
//             label="Dashboard"
//             active={pathname === "/admin/dashboard"}
//           />
//           <NavLink
//             href="/admin/orders"
//             icon={ShoppingBag}
//             label="Live Orders"
//             active={pathname === "/admin/orders"}
//           />
//           <NavLink
//             href="/admin/products"
//             icon={UtensilsCrossed}
//             label="Menu"
//             active={pathname === "/admin/products"}
//           />
//           <NavLink
//             href="/admin/deals"
//             icon={HandPlatter}
//             label="Deals"
//             active={pathname === "/admin/deals"}
//           />
//           <NavLink
//             href="/admin/options"
//             icon={Puzzle}
//             label="Add-ons & Options"
//             active={pathname === "/admin/options"}
//           />
//           <NavLink
//             href="/admin/categories"
//             icon={LayoutGrid}
//             label="categories"
//             active={pathname === "/admin/categories"}
//           />
//           <NavLink
//             href="/admin/settings"
//             icon={Settings}
//             label="Settings"
//             active={pathname === "/admin/settings"}
//           />
//         </nav>

//         <div className="p-4 border-t border-white/10">
//           <button className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-sm font-medium">
//             <LogOut className="w-5 h-5" />
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>

//       {/* Right Content */}
//       <main className="flex-1 w-full pt-20 md:pt-4 p-4">
//         <div className="min-h-[85vh] rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 p-6 shadow-2xl">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// };

// // Helper Component for Sidebar Links
// function NavLink({ href, icon: Icon, label, active }) {
//   return (
//     <Link
//       href={href}
//       className={`
//         flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
//         ${
//           active
//             ? "bg-(--color-gold) text-black shadow-[0_0_15px_rgba(197,160,89,0.4)] font-bold"
//             : "text-gray-300 hover:bg-white/10 hover:text-white"
//         }
//       `}
//     >
//       <Icon className="w-5 h-5" />
//       <span>{label}</span>
//     </Link>
//   );
// };

"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";

// Sub Components
import MobileHeader from "@/components/custom_components/admin/layoutComponents/MobileHeader";
import SidebarNav from "@/components/custom_components/admin/layoutComponents/SidebarNav";
import LogoutButton from "@/components/custom_components/admin/layoutComponents/LogoutButton";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Do not show Sidebar on the Login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen relative z-20 bg-[#0a0a0a]">
      {/* 1. Mobile Header (Hidden on Desktop) */}
      <MobileHeader
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* 2. Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen w-64 
          bg-black/50 backdrop-blur-xl border-r border-white/10 
          z-50 transition-transform duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 rounded-r-xl md:rounded-none
        `}
      >
        {/* Brand Logo / Title */}
        <div className="h-20 flex items-center justify-center border-b border-white/10 shrink-0">
          <span className="text-2xl font-bold text-(--color-gold) tracking-widest font-display">
            CAFE ADMIN
          </span>
        </div>

        {/* Navigation Links */}
        <SidebarNav setIsSidebarOpen={setIsSidebarOpen} />

        {/* Logout Section */}
        <LogoutButton />
      </aside>

      {/* 3. Main Right Content */}
      <main className="flex-1 w-full pt-20 md:pt-4 p-4 lg:p-6 overflow-x-hidden">
        {/* Added lg:p-6 for wider screens to give breathing room */}
        <div className="min-h-[calc(100vh-2rem)] rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 p-4 sm:p-6 lg:p-8 shadow-2xl relative">
          {children}
        </div>
      </main>

      {/* Mobile Overlay Background (Click to close sidebar) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
