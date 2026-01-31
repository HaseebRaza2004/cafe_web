import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const CartSkeleton = () => {
    return (
        <div className="space-y-4 p-6">
            {/* Fake Items */}
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 bg-white/5 rounded-xl p-3 border border-white/5">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-10" />
                        </div>
                        <Skeleton className="h-3 w-1/3" />
                        <div className="flex justify-between items-end mt-2">
                            <Skeleton className="h-8 w-20 rounded-lg" />
                        </div>
                    </div>
                </div>
            ))}

            {/* Bill Summary Skeleton */}
            <div className="mt-8 space-y-2">
                <Skeleton className="h-px w-full my-4" />
                <div className="flex justify-between"><Skeleton className="h-3 w-16" /><Skeleton className="h-3 w-10" /></div>
                <div className="flex justify-between"><Skeleton className="h-3 w-16" /><Skeleton className="h-3 w-10" /></div>
                <div className="flex justify-between"><Skeleton className="h-3 w-16" /><Skeleton className="h-3 w-10" /></div>
                <Skeleton className="h-12 w-full rounded-xl mt-4" />
            </div>
        </div>
    );
};

export default CartSkeleton;