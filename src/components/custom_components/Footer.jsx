"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, ArrowUp } from "lucide-react";
import Logo from "./Logo"; // Logo component import kar rahe hain (agar file name same hai)

const Footer = () => {

    // Function to scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="bg-black/60 backdrop-blur-md text-white border-t border-(--color-gold) pt-16 pb-8 relative">

            <div className="container mx-auto px-4 md:px-6">

                {/* --- TOP GRID SECTION --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* COLUMN 1: Brand Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            {/* Agar Logo component available hai tu wo use hoga, warna Text fallback */}
                            <div className="scale-90 origin-left">
                                <Logo />
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Experience the art of premium dining. We serve passion on a plate with the finest ingredients and luxury ambiance.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-(--color-gold) hover:border-(--color-gold) hover:text-black transition-all duration-300">
                                <Facebook className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-(--color-gold) hover:border-(--color-gold) hover:text-black transition-all duration-300">
                                <Instagram className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-(--color-gold) hover:border-(--color-gold) hover:text-black transition-all duration-300">
                                <Twitter className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* COLUMN 2: Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-(--color-gold) uppercase tracking-widest mb-6 font-display">
                            Quick Links
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/" className="text-gray-400 hover:text-(--color-gold) hover:pl-2 transition-all duration-300 text-sm">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/deals" className="text-gray-400 hover:text-(--color-gold) hover:pl-2 transition-all duration-300 text-sm">
                                    Hot Deals
                                </Link>
                            </li>
                            <li>
                                <Link href="/checkout" className="text-gray-400 hover:text-(--color-gold) hover:pl-2 transition-all duration-300 text-sm">
                                    Checkout
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-(--color-gold) hover:pl-2 transition-all duration-300 text-sm">
                                    Reservations (Coming Soon)
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* COLUMN 3: Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold text-(--color-gold) uppercase tracking-widest mb-6 font-display">
                            Contact Us
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400 text-sm">
                                <MapPin className="w-5 h-5 text-(--color-gold) shrink-0 mt-0.5" />
                                <span>Shop #4, Luxury Street, DHA Phase 6, Karachi.</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Phone className="w-5 h-5 text-(--color-gold) shrink-0" />
                                <span>0300-1234567</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Mail className="w-5 h-5 text-(--color-gold) shrink-0" />
                                <span>info@cafeonline.pk</span>
                            </li>
                        </ul>
                    </div>

                    {/* COLUMN 4: Opening Hours */}
                    <div>
                        <h3 className="text-lg font-bold text-(--color-gold) uppercase tracking-widest mb-6 font-display">
                            Opening Hours
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400 text-sm">
                                <Clock className="w-5 h-5 text-(--color-gold) shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-white font-bold">Mon - Thu</p>
                                    <p>12:00 PM - 12:00 AM</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400 text-sm">
                                <Clock className="w-5 h-5 text-(--color-gold) shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-white font-bold">Fri - Sun</p>
                                    <p>12:00 PM - 02:00 AM</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* --- BOTTOM BAR --- */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-xs md:text-sm text-center md:text-left">
                        © {new Date().getFullYear()} <span className="text-(--color-gold)">Cafe Online</span>. All Rights Reserved.
                    </p>

                    <p className="text-gray-600 text-xs flex items-center gap-1">
                        Designed & Developed by <span className="text-gray-400 font-bold">Haseeb Raza</span>
                    </p>
                </div>

            </div>

            {/* Scroll To Top Button (Optional Luxury Touch) */}
            <button
                onClick={scrollToTop}
                className="absolute right-6 top-0 -translate-y-1/2 w-12 h-12 bg-black border border-(--color-gold) text-(--color-gold) rounded-full flex items-center justify-center hover:bg-(--color-gold) hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(197,160,89,0.3)] z-10"
            >
                <ArrowUp className="w-5 h-5" />
            </button>

        </footer>
    );
};

export default Footer;