"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/custom_components/Header";
import Footer from "@/components/custom_components/Footer";
import MinimalHeader from "@/components/custom_components/MinimalHeader";
import MinimalFooter from "@/components/custom_components/MinimalFooter";
import GlobalModalRenderer from "./GlobalModalRenderer";
import OrderTrackerPill from "./OrderTrackerPill";

export default function LayoutContent({ children }) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith("/admin");
    const isMinimalPage = pathname.startsWith("/checkout") || pathname.startsWith("/order-success");

    return (
        <>
            {!isAdminPage && (
                <div className="relative z-50 print:hidden">
                    {isMinimalPage ? <MinimalHeader /> : <Header />}
                </div>
            )}

            <main className="relative z-10 w-full min-h-screen print:min-h-0 print:h-auto print:block print:bg-white print:text-black">
                {children}
            </main>

            {!isAdminPage && (
                <div className="relative z-50 print:hidden">
                    {isMinimalPage ? <MinimalFooter /> : <Footer />}
                </div>
            )}

            {/* Global Injections */}
            <GlobalModalRenderer />
            {!isAdminPage && <OrderTrackerPill />}
        </>
    );
};