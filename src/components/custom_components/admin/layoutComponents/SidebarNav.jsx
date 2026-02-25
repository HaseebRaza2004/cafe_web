"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    UtensilsCrossed,
    Settings,
    HandPlatter,
    LayoutGrid,
    Puzzle,
} from "lucide-react";

const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/orders", icon: ShoppingBag, label: "Live Orders" },
    { href: "/admin/products", icon: UtensilsCrossed, label: "Menu" },
    { href: "/admin/deals", icon: HandPlatter, label: "Deals" },
    { href: "/admin/options", icon: Puzzle, label: "Add-ons & Options" },
    { href: "/admin/categories", icon: LayoutGrid, label: "Categories" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function SidebarNav({ setIsSidebarOpen }) {
    const pathname = usePathname();

    return (
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`
              flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive
                                ? "bg-(--color-gold) text-black shadow-[0_0_15px_rgba(197,160,89,0.4)] font-bold"
                                : "text-gray-300 hover:bg-white/10 hover:text-white"
                            }
            `}
                    >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}