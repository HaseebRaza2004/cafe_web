"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Header from "@/components/custom_components/Header";
import Footer from "@/components/custom_components/Footer";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider, useToast } from "@/context/ToastContext";

const LayoutContent = ({ children }) => {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const toast = useToast();
  const hasShownNote = useRef(false);

  // WEBSITE OPEN ALERT LOGIC
  useEffect(() => {
    if (!isAdminPage && !hasShownNote.current) {
      async function fetchNote() {
        try {
          const res = await fetch("/api/settings");
          const json = await res.json();
          if (json.success && json.data.generalNote && json.data.generalNote.trim() !== "") {
            toast.info(json.data.generalNote);
            hasShownNote.current = true;
          }
        } catch (err) {
          console.error("Failed to fetch notification", err);
        }
      }
      fetchNote();
    }
  }, [isAdminPage, toast]);

  return (
    <>
      {!isAdminPage && (
        <div className="relative z-50">
          <Header />
        </div>
      )}

      <main className="relative z-10 w-full min-h-screen">
        {children}
      </main>

      {!isAdminPage && (
        <div className="relative z-50">
          <Footer />
        </div>
      )}
    </>
  );
};

// --- Main Export Wrapper ---
export default function ClientLayout({ children }) {
  return (
    <ToastProvider>
      <CartProvider>
        <LayoutContent>
          {children}
        </LayoutContent>
      </CartProvider>
    </ToastProvider>
  );
}