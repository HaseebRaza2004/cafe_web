"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import MobileHeader from "@/components/custom_components/admin/layoutComponents/MobileHeader";
import SidebarNav from "@/components/custom_components/admin/layoutComponents/SidebarNav";
import LogoutButton from "@/components/custom_components/admin/layoutComponents/LogoutButton";

export default function AdminClientWrapper({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen relative z-20 bg-[#0a0a0a]">

            {/* Mobile Header */}
            <MobileHeader
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            {/* Sidebar */}
            <aside
                className=
                {`fixed md:sticky top-0 left-0 h-screen w-64 bg-black/50 backdrop-blur-xl border-r border-white/10 z-50 transition-transform duration-300 ease-in-out flex flex-col
                 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0 rounded-r-xl md:rounded-none`}
            >
                <div className="h-20 flex items-center justify-center border-b border-white/10 shrink-0">
                    <span className="text-2xl font-bold text-(--color-gold) tracking-widest font-display">
                        CAFE ADMIN
                    </span>
                </div>

                <SidebarNav setIsSidebarOpen={setIsSidebarOpen} />
                <LogoutButton />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 w-full pt-20 md:pt-4 p-4 lg:p-6">
                <div className="min-h-[calc(100vh-2rem)] rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 p-4 sm:p-6 lg:p-8 shadow-2xl relative">
                    {children}
                </div>
            </main>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}