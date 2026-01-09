"use client";
import React from "react";
import { Copy, Check, MessageCircle, Facebook } from "lucide-react";

const ShareMenu = ({ onShare, onCopy, copied }) => {
    return (
        <div className="absolute top-full right-0 mt-2 z-50 bg-[#1a1a1a] border border-(--color-gold) rounded-xl p-3 shadow-2xl w-48 animate-in fade-in zoom-in-95 duration-200">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest text-center">Share Item</p>
            <div className="flex justify-between items-center gap-2">
                {/* WhatsApp */}
                <button
                    onClick={() => onShare("whatsapp")}
                    className="p-2 bg-[#25D366]/20 text-[#25D366] rounded-full hover:bg-[#25D366] hover:text-white transition-all"
                >
                    <MessageCircle className="w-5 h-5" />
                </button>
                {/* Facebook */}
                <button
                    onClick={() => onShare("facebook")}
                    className="p-2 bg-[#1877F2]/20 text-[#1877F2] rounded-full hover:bg-[#1877F2] hover:text-white transition-all"
                >
                    <Facebook className="w-5 h-5" />
                </button>
                {/* Copy Link */}
                <button
                    onClick={onCopy}
                    className="p-2 bg-white/10 text-white rounded-full hover:bg-white hover:text-black transition-all"
                >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
};

export default ShareMenu;