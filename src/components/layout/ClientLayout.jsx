"use client";

import { Suspense } from "react";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { ModalProvider } from "@/context/ModalContext";
import DeepLinkHandler from "./DeepLinkHandler";
import LayoutContent from "./LayoutContent";

export default function ClientLayout({ children }) {
  return (
    <ToastProvider>
      <CartProvider>
        <ModalProvider>
          <Suspense fallback={null}>
            <DeepLinkHandler />
          </Suspense>
          <LayoutContent>
            {children}
          </LayoutContent>
        </ModalProvider>
      </CartProvider>
    </ToastProvider>
  );
};