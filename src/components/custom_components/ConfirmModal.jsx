"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, description, confirmText = "Confirm", cancelText = "Cancel", variant = "destructive" }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-black/95 border border-white/10 text-white backdrop-blur-xl sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold font-display tracking-wide">{title}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2 mt-4">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="hover:bg-white/10 hover:text-white text-gray-400 cursor-pointer"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`
                ${variant === "destructive" ? "bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white" : "bg-(--color-gold) text-black hover:bg-[#b89445]"}
                font-bold tracking-wide transition-all cursor-pointer
            `}
                    >
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmModal;