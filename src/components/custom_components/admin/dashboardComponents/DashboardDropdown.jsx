"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function DashboardDropdown({ options, value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between gap-2 bg-black/60 backdrop-blur-md border border-white/10 hover:border-gold/50 text-gray-300 hover:text-white text-xs px-3 py-1.5 rounded-lg transition-all outline-none cursor-pointer"
            >
                <span>{value}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => {
                                onChange(opt);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs transition-colors hover:bg-white/10 cursor-pointer outline-none ${value === opt
                                ? "text-(--color-gold) font-bold bg-gold/10"
                                : "text-gray-300"
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};