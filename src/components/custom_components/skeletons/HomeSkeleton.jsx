import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import CardSkeleton from "./CardSkeleton";

const HomeSkeleton = () => {
    return (
        <div className="w-full flex flex-col items-center gap-10">

            {/* Hero Section Skeleton */}
            <div className="w-full h-[60vh] md:h-[80vh] relative overflow-hidden">
                <Skeleton className="w-full h-full rounded-none" />
                <div className="absolute bottom-10 left-4 md:left-10 space-y-4 max-w-2xl px-4">
                    <Skeleton className="h-12 md:h-16 w-3/4 rounded-lg" />
                    <Skeleton className="h-4 md:h-6 w-full rounded-lg" />
                    <Skeleton className="h-12 w-40 rounded-full mt-4" />
                </div>
            </div>

            {/* Content Container */}
            <div className="w-full max-w-7xl mx-auto px-4 space-y-16 py-10">

                {/* Hot Deals Section */}
                <div className="space-y-6">
                    <div className="flex flex-col items-center gap-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-1 w-24" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-full">
                                <CardSkeleton />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Categories Tabs */}
                <div className="w-full flex gap-3 overflow-x-auto pb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-10 w-32 rounded-full shrink-0" />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default HomeSkeleton;