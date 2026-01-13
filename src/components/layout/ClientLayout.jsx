"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/custom_components/Header";
import Footer from "@/components/custom_components/Footer";
import { CartProvider } from "@/context/CartContext";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // Check karein ke user Admin panel mein hai ya nahi
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <CartProvider>
      {/* Agar Admin page hai to Header mat dikhao */}
      {!isAdminPage && (
        <div className="relative z-50">
          <Header />
        </div>
      )}

      <main className="relative z-10 w-full min-h-screen">
        {children}
      </main>

      {/* Agar Admin page hai to Footer mat dikhao */}
      {!isAdminPage && (
        <div className="relative z-50">
          <Footer />
        </div>
      )}
    </CartProvider>
  );
}