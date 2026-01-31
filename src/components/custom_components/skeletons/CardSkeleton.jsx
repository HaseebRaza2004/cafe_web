import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const CardSkeleton = () => {
    return (
        <div className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden h-full flex flex-col">
            <div className="relative w-full aspect-square">
                <Skeleton className="h-full w-full rounded-none" />
            </div>
            <div className="p-3 md:p-5 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                </div>

                <div className="mt-4 space-y-3">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
            </div>
        </div>
    );
};

export default CardSkeleton;