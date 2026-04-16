"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Page Crashed:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-6 animate-pulse" />
      <h1 className="text-3xl md:text-5xl font-bold text-(--color-gold) font-display mb-4">
        Oops! Something went wrong.
      </h1>
      <p className="text-gray-400 mb-8 max-w-md">
        We encountered an unexpected issue while loading this page. Our
        technical team has been notified.
      </p>
      <Button
        onClick={() => reset()}
        className="bg-(--color-gold) text-black hover:bg-(--color-gold-dark) cursor-pointer"
      >
        Try Again
      </Button>
    </div>
  );
};