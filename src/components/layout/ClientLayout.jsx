"use client";

import { Suspense, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/custom_components/Header";
import Footer from "@/components/custom_components/Footer";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider, useToast } from "@/context/ToastContext";
import { ModalProvider, useModal } from "@/context/ModalContext";
import DeepLinkHandler from "./DeepLinkHandler";
import ProductModal from "@/components/custom_components/ProductModal/ProductModal";
import DealModal from "@/components/custom_components/DealModal/DealModal";
import ModalSkeleton from "@/components/custom_components/skeletons/ModalSkeleton";

// Global Modal Renderer
const GlobalModalRenderer = () => {
  const { isOpen, closeModal, modalType, modalData, editState, isLoading } = useModal();

  if (isLoading) {
    return <ModalSkeleton />;
  }

  if (!isOpen || !modalData) return null;

  return (
    <>
      {modalType === "product" && (
        <ProductModal
          product={modalData}
          isOpen={isOpen}
          setIsOpen={closeModal}
          initialState={editState}
        />
      )}
      {modalType === "deal" && (
        <DealModal
          deal={modalData}
          isOpen={isOpen}
          setIsOpen={closeModal}
          initialState={editState}
        />
      )}
    </>
  );
};

const LayoutContent = ({ children }) => {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

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

      <GlobalModalRenderer />
    </>
  );
};

export default function ClientLayout({ children }) {
  return (
    <ToastProvider>
      <CartProvider>
        <ModalProvider>
          <Suspense fallback={null}>
            <DeepLinkHandler />
          </Suspense>
          <LayoutContent>{children}</LayoutContent>
        </ModalProvider>
      </CartProvider>
    </ToastProvider>
  );
}