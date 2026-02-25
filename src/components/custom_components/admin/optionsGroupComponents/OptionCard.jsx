"use client";

import Link from "next/link";
import { Edit, Trash2, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function OptionCard({ group, onDelete }) {
    const LIMIT = 5;
    const options = group.options || [];
    const visibleOptions = options.slice(0, LIMIT);
    const remainingCount = options.length - LIMIT;

    return (
        <div className="group flex flex-col h-full bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-gold/50 transition-all duration-300">

            {/* Header */}
            <div className="p-5 flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-(--color-gold) border border-gold/20">
                        <Layers className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg leading-tight line-clamp-1">
                            {group.name}
                        </h3>
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                            {group.selectionType || "Multiple"} Select
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-5 pb-4 flex-1">
                <div className="flex flex-wrap gap-2 content-start">
                    {visibleOptions.length > 0 ? (
                        <>
                            {visibleOptions.map((opt, i) => (
                                <Badge
                                    key={i}
                                    variant="secondary"
                                    className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white px-2 py-1 h-auto text-xs font-normal"
                                >
                                    {opt.name}
                                </Badge>
                            ))}

                            {remainingCount > 0 && (
                                <Badge className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white px-2 py-1 h-auto text-xs font-normal">
                                    +{remainingCount} more
                                </Badge>
                            )}
                        </>
                    ) : (
                        <span className="text-gray-600 text-sm italic">No options added.</span>
                    )}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-3 border-t border-white/10 flex gap-2 mt-auto bg-white/2">
                <Button
                    asChild
                    variant="ghost"
                    className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white h-9 px-2 cursor-pointer"
                >
                    <Link href={`/admin/options/${group._id}`}>
                        <Edit className="w-4 h-4 mr-2 shrink-0" />
                        <span className="truncate">Edit</span>
                    </Link>
                </Button>

                <Button
                    onClick={() => onDelete(group._id)}
                    variant="ghost"
                    className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 h-9 px-2 cursor-pointer"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}