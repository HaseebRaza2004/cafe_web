"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";

const CheckoutForm = ({ formData, handleInputChange, deliveryArea, changeRequest, setChangeRequest }) => {
    return (
        <form className="space-y-8">
            {/* 1. PERSONAL INFORMATION */}
            <div className="bg-black/60 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-xl space-y-6 shadow-lg">
                <h2 className="text-xl md:text-2xl font-bold text-white border-b border-white/10 pb-4 font-display">
                    Personal Information
                </h2>

                {/* Grid for Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                        <Label className="text-sm text-(--color-gold) uppercase font-bold tracking-wide">
                            Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            name="fullName"
                            placeholder="Enter your full name"
                            className="mt-2 bg-[#1a1a1a] border-white/10 text-white focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold) transition-colors outline-none h-12 text-base placeholder:text-gray-600"
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <Label className="text-sm text-(--color-gold) uppercase font-bold tracking-wide">
                            Email Address (Optional)
                        </Label>
                        <Input
                            name="email"
                            placeholder="your@email.com"
                            className="mt-2 bg-[#1a1a1a] border-white/10 text-white focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold) transition-colors outline-none h-12 text-base placeholder:text-gray-600"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Mobile Numbers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label className="text-sm text-(--color-gold) uppercase font-bold tracking-wide">
                            Mobile Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            name="mobile"
                            placeholder="03xx-xxxxxxx"
                            className="mt-2 bg-[#1a1a1a] border-white/10 text-white focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold) transition-colors outline-none h-12 text-base placeholder:text-gray-600"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <Label className="text-sm text-(--color-gold) uppercase font-bold tracking-wide">
                            Alternate Mobile (Optional)
                        </Label>
                        <Input
                            name="altMobile"
                            placeholder="03xx-xxxxxxx"
                            className="mt-2 bg-[#1a1a1a] border-white/10 text-white focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold) transition-colors outline-none h-12 text-base placeholder:text-gray-600"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>

            {/* 2. DELIVERY DETAILS */}
            <div className="bg-[#0a0a0a] border border-white/10 p-6 md:p-8 rounded-xl space-y-6 shadow-lg">
                <h2 className="text-xl md:text-2xl font-bold text-white border-b border-white/10 pb-4 font-display">
                    Delivery Details
                </h2>

                {/* Address */}
                <div>
                    <Label className="text-sm text-(--color-gold) uppercase font-bold tracking-wide">
                        Delivery Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-2">
                        <Input
                            name="address"
                            placeholder="House No, Street, Block..."
                            className="bg-[#1a1a1a] border-white/10 text-white focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold) transition-colors outline-none h-14 pr-32 text-base placeholder:text-gray-600"
                            onChange={handleInputChange}
                        />
                        <div className="absolute top-1/2 right-3 -translate-y-1/2 bg-(--color-gold) text-black px-3 py-1 text-xs font-bold rounded uppercase flex items-center gap-1 shadow-md">
                            <MapPin className="w-3 h-3" />
                            {deliveryArea}
                        </div>
                    </div>
                </div>

                {/* Landmark */}
                <div>
                    <Label className="text-sm text-(--color-gold) uppercase font-bold tracking-wide">
                        Nearest Landmark
                    </Label>
                    <Input
                        name="landmark"
                        placeholder="e.g. Near Masjid/Park"
                        className="mt-2 bg-[#1a1a1a] border-white/10 text-white focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold) transition-colors outline-none h-12 text-base placeholder:text-gray-600"
                        onChange={handleInputChange}
                    />
                </div>

                {/* Instructions */}
                <div>
                    <Label className="text-sm text-(--color-gold) uppercase font-bold tracking-wide">
                        Delivery Instructions
                    </Label>
                    <Textarea
                        name="instructions"
                        placeholder="e.g. Ring the bell, leave at gate..."
                        className="mt-2 bg-[#1a1a1a] border-white/10 text-white focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold) transition-colors outline-none min-h-25 text-base placeholder:text-gray-600"
                        onChange={handleInputChange}
                    />
                </div>

                {/* Change Request */}
                <div>
                    <Label className="text-sm text-(--color-gold) uppercase font-bold tracking-wide">
                        Change Request (Optional)
                    </Label>
                    <div className="flex items-center mt-2">
                        <span className="bg-white/5 border border-white/10 border-r-0 rounded-l-md px-4 h-12 flex items-center text-gray-400 text-sm">
                            Rs.
                        </span>
                        <Input
                            placeholder="e.g. 5000 (Bring change for)"
                            className="bg-[#1a1a1a] border-white/10 text-white focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold) transition-colors outline-none rounded-l-none h-12 text-base placeholder:text-gray-600"
                            value={changeRequest}
                            onChange={(e) => setChangeRequest(e.target.value)}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Enter amount if you need change for a large note.
                    </p>
                </div>
            </div>
        </form>
    );
};

export default CheckoutForm;