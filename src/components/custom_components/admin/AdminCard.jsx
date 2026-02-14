"use client";

import React, { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import cloudinaryLoader from "@/lib/cloudinary-loader";

const AdminCard = ({ data, type = "product", onDelete }) => {

    // Edit Route Logic
    const editHref =
        type === "deal"
            ? `/admin/deals/${data._id}`
            : `/admin/products/${data._id}`;

    return (
        <Card className="group relative flex flex-col h-full bg-black/40 border-white/10 overflow-hidden hover:border-gold/50 transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(197,160,89,0.15)] rounded-xl">

            {/* IMAGE SECTION */}
            <div className="relative w-full aspect-16/10 overflow-hidden bg-white/5">
                <Image
                    src={data.image || "/placeholder.jpg"}
                    alt={data.title}
                    loader={cloudinaryLoader}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />

                {/* Badge: Not Available (Product) */}
                {type === "product" && !data.isAvailable && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-[2px]">
                        <Badge variant="destructive" className="uppercase tracking-widest px-3 py-1 border-red-500 bg-black/50 text-red-500 hover:bg-black/50">
                            Not Available
                        </Badge>
                    </div>
                )}

                {/* Badge: Price (Deal - Top Right) */}
                {type === "deal" && (
                    <div className="absolute top-2 right-2 z-10">
                        <Badge variant="outline" className="bg-black/90 backdrop-blur-md text-(--color-gold) border-white/10 shadow-lg px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide">
                            Rs {data.price}
                        </Badge>
                    </div>
                )}
            </div>

            {/* --- CONTENT SECTION --- */}
            <CardContent className="px-4 flex flex-col flex-1 gap-2">
                {/* Title & Price Row */}
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-base md:text-lg text-white leading-tight line-clamp-1" title={data.title}>
                        {data.title}
                    </h3>

                    {/* Product Price */}
                    {type === "product" && (
                        <span className="text-(--color-gold) font-bold text-sm bg-white/5 px-2 py-0.5 rounded border border-white/5 shrink-0">
                            Rs {data.price}
                        </span>
                    )}
                </div>

                {/* Description */}
                <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                    {data.desc}
                </p>

                {/* --- DEAL STEPS LOGIC  --- */}
                {type === "deal" && data.itemGroups && data.itemGroups.length > 0 && (
                    <div className="mt-2 space-y-2 bg-white/5 p-2 rounded-lg border border-white/5">
                        {data.itemGroups.slice(0, 1).map((group, idx) => (
                            <div key={idx} className="text-xs">
                                <p className="text-(--color-gold) font-bold uppercase text-[10px] tracking-wider mb-0.5">
                                    {group.heading}
                                </p>
                            </div>
                        ))}
                        {data.itemGroups.length > 2 && (
                            <p className="text-[10px] text-center text-gray-500 italic">
                                +{data.itemGroups.length - 1} more steps
                            </p>
                        )}
                    </div>
                )}
            </CardContent>

            {/* --- FOOTER ACTION BUTTONS --- */}
            <CardFooter className="pt-0 gap-3 mt-auto">

                {/* Edit Button */}
                <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-xs bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-gold/30 transition-all cursor-pointer"
                >
                    <Link href={editHref} className="flex items-center justify-center gap-1.5">
                        <Edit className="w-3 h-3" /> <span className="hidden sm:inline">Edit</span>
                    </Link>
                </Button>

                {/* Delete Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(data._id)}
                    className="h-8 w-8 px-0 sm:w-auto sm:px-3 sm:flex-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                >
                    <Trash2 className="w-3.5 h-3.5 sm:mr-1.5" />
                    <span className="hidden sm:inline text-xs font-bold">Delete</span>
                </Button>

            </CardFooter>
        </Card>
    );
};

export default memo(AdminCard);