"use client";
import React from "react";
import { Textarea } from "@/components/ui/textarea";

const NoteInput = ({ value, onChange }) => {
    return (
        <div>
            <h3 className="text-(--color-gold) font-bold uppercase text-[10px] md:text-xs tracking-wider mb-3">Note</h3>
            <Textarea
                placeholder="E.g. No onions, make it spicy..."
                value={value}
                onChange={onChange}
                className="bg-white/5 border-white/10 text-white resize-none h-24 text-sm rounded-lg focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold) transition-colors outline-none placeholder:text-gray-600"
            />
        </div>
    );
};

export default NoteInput;