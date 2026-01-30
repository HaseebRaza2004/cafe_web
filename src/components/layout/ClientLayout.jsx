"use client";

import { Suspense, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/custom_components/Header";
import Footer from "@/components/custom_components/Footer";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider, useToast } from "@/context/ToastContext";
import { ModalProvider, useModal } from "@/context/ModalContext";
import DeepLinkHandler from "./DeepLinkHandler"; // We will create this next
import ProductModal from "@/components/custom_components/ProductModal/ProductModal";
import DealModal from "@/components/custom_components/DealModal/DealModal";

// --- Global Modal Renderer ---
const GlobalModalRenderer = () => {
  const { isOpen, closeModal, modalType, modalData, editState } = useModal();

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
  const { success: showToast } = useToast() || {};
  const hasShownNote = useRef(false);

  // WEBSITE OPEN ALERT LOGIC 
  useEffect(() => {
    if (!isAdminPage && !hasShownNote.current && showToast) {
      async function fetchNote() {
        try {
          const res = await fetch("/api/settings");
          const json = await res.json();
          if (json.success && json.data.generalNote && json.data.generalNote.trim() !== "") {
            showToast(json.data.generalNote);
            hasShownNote.current = true;
          }
        } catch (err) {
          console.error("Failed to fetch notification", err);
        }
      }
      fetchNote();
    }
  }, [isAdminPage, showToast]);

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

      {/* Render Active Modal */}
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
};