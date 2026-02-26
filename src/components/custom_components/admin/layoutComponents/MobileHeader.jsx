"use client";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MobileHeader({ isSidebarOpen, setIsSidebarOpen }) {
    return (
        <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-black/40 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 z-60">
            <h1 className="text-xl font-bold text-(--color-gold) tracking-widest font-display">
                ADMIN
            </h1>
            <Button
                variant="link"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-white cursor-pointer hover:transform-viewport-gpu hover:scale-110 transition-transform duration-200 ease-in-out"
            >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
        </div>
    );
}