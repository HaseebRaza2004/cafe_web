"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function OrderPagination({
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    itemsPerPage,
}) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between px-2 py-4 mt-6 border-t border-white/10">
            <p className="text-sm text-gray-400">
                Showing{" "}
                <span className="font-bold text-gold-dark">
                    {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold text-gold-dark">
                    {Math.min(currentPage * itemsPerPage, totalItems)}
                </span>{" "}
                orders out of <span className="font-bold text-gold-dark">{totalItems}</span> orders
            </p>
            <div className="flex gap-2">
                <Button
                    variant="link"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="text-gold disabled:opacity-50 cursor-pointer"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <Button
                    variant="link"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="text-gold disabled:opacity-50 cursor-pointer"
                >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    );
};