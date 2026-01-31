"use client";
import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const ModalSkeleton = () => {
  return (
    <Dialog open={true}>
      <DialogContent aria-describedby={undefined} className="w-[95vw] sm:max-w-[95vw] md:max-w-3xl lg:max-w-5xl h-[90vh] p-0 gap-0 flex flex-col bg-black/60 backdrop-blur-xl border border-(--color-gold) overflow-hidden rounded-2xl shadow-2xl z-9999">
        <DialogTitle className="sr-only">Loading</DialogTitle>
        <DialogDescription className="sr-only">Loading content...</DialogDescription>

        <div className="flex flex-col md:flex-row h-full">
          {/* Left Image */}
          <Skeleton className="w-full md:w-[45%] h-40 md:h-full rounded-none" />

          {/* Right Content */}
          <div className="flex flex-col w-full md:w-[55%] h-full relative">
            <div className="flex-1 p-8 space-y-8 overflow-hidden">
              {/* Header */}
              <div className="space-y-3">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-24 rounded-full mt-2" />
              </div>

              <div className="h-px bg-white/10 w-full" />

              {/* Options Groups */}
              <div className="space-y-4">
                <Skeleton className="h-4 w-1/3" />
                <div className="flex gap-3 flex-wrap">
                  <Skeleton className="h-12 w-28 rounded-xl" />
                  <Skeleton className="h-12 w-28 rounded-xl" />
                  <Skeleton className="h-12 w-28 rounded-xl" />
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-black/40">
              <div className="flex gap-4 h-12">
                <Skeleton className="w-32 rounded-lg" />
                <Skeleton className="flex-1 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalSkeleton;