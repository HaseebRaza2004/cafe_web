"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useModal } from "@/context/ModalContext";
import ProductModal from "@/components/custom_components/ProductModal/ProductModal";
import DealModal from "@/components/custom_components/DealModal/DealModal";

const GlobalModalManager = () => {
    const { productModal, closeProduct, openProduct, dealModal, closeDeal, openDeal } = useModal();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // --- DEEP LINKING LOGIC ---
    useEffect(() => {
        const productId = searchParams.get("product");
        const dealId = searchParams.get("deal");

        // Helper to fetch data
        const fetchData = async (type, id) => {
            try {
                const res = await fetch(`/api/${type}s/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    // Open the respective modal
                    if (type === "product") openProduct(data);
                    if (type === "deal") openDeal(data);
                }
            } catch (error) {
                console.error("Deep link fetch error:", error);
            }
        };

        if (productId && !productModal.isOpen) {
            fetchData("product", productId);
        }
        if (dealId && !dealModal.isOpen) {
            fetchData("deal", dealId);
        }
    }, [searchParams, openProduct, openDeal]); // Dependencies allow re-run if params change

    // Clean URL when closing modal (Optional UX improvement)
    const handleCloseProduct = () => {
        closeProduct();
        if (searchParams.has("product")) router.replace(pathname, { scroll: false });
    };

    const handleCloseDeal = () => {
        closeDeal();
        if (searchParams.has("deal")) router.replace(pathname, { scroll: false });
    };

    return (
        <>
            {/* GLOBAL PRODUCT MODAL */}
            {productModal.data && (
                <ProductModal
                    isOpen={productModal.isOpen}
                    setIsOpen={handleCloseProduct}
                    product={productModal.data}
                    editingItem={productModal.editingItem} // Pass the cart item being edited
                />
            )}

            {/* GLOBAL DEAL MODAL */}
            {dealModal.data && (
                <DealModal
                    isOpen={dealModal.isOpen}
                    setIsOpen={handleCloseDeal}
                    deal={dealModal.data}
                    editingItem={dealModal.editingItem}
                />
            )}
        </>
    );
};

export default GlobalModalManager;