"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { MapPin, Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DELIVERY_AREAS = [
    { id: "gulshan", label: "Gulshan-e-Iqbal", price: 100 },
    { id: "jauhar", label: "Gulistan-e-Jauhar", price: 150 },
    { id: "pechs", label: "PECHS", price: 150 },
    { id: "dha", label: "DHA Phase 1-8", price: 250 },
    { id: "clifton", label: "Clifton", price: 250 },
    { id: "nazimabad", label: "Nazimabad", price: 120 },
    { id: "north-nazimabad", label: "North Nazimabad", price: 150 },
    { id: "fb-area", label: "Federal B. Area", price: 120 },
    { id: "malir", label: "Malir Cantt", price: 300 },
    { id: "bahria", label: "Bahria Town", price: 500 },
];

const DeliverySelector = ({ onSelect, selectedPrice }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedLabel, setSelectedLabel] = useState("");
    const dropdownRef = useRef(null);

    const filteredAreas = useMemo(() => {
        return DELIVERY_AREAS.filter(area =>
            area.label.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (area) => {
        setSelectedLabel(area.label);
        onSelect(area.price, area.label);
        setIsOpen(false);
        setSearch("");
    };

    return (
        <div className="relative space-y-2" ref={dropdownRef}>
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Delivery Area
            </label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-12 px-3 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${isOpen ? "border-(--color-gold) bg-black" : "border-white/10 bg-white/5 hover:border-white/30"}`}
            >
                <span className={selectedLabel ? "text-white font-medium" : "text-gray-400"}>
                    {selectedLabel || "Search your area..."}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180 text-(--color-gold)" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1a] border border-gold/30 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-75"
                    >
                        <div className="p-2 border-b border-white/10 bg-[#0a0a0a] sticky top-0 z-10">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Type to search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-white/10 border border-transparent focus:border-(--color-gold) rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-gray-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="overflow-y-auto flex-1 p-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                            {filteredAreas.length > 0 ? (
                                filteredAreas.map((area) => (
                                    <button
                                        key={area.id}
                                        onClick={() => handleSelect(area)}
                                        className="w-full text-left flex justify-between items-center px-3 py-2.5 hover:bg-white/5 rounded-lg group transition-colors cursor-pointer"
                                    >
                                        <span className="text-gray-300 text-xs group-hover:text-white transition-colors">{area.label}</span>
                                        <span className="text-(--color-gold) text-[10px] font-mono bg-gold/10 px-1.5 py-0.5 rounded">
                                            Rs {area.price}
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500 text-xs">No areas found.</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DeliverySelector;