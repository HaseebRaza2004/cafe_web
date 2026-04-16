"use client";

import dynamic from "next/dynamic";
import { useModal } from "@/context/ModalContext";
import ModalSkeleton from "@/components/custom_components/skeletons/ModalSkeleton";

// Dynamic Imports (Lazy Loading)
const ProductModal = dynamic(
    () => import("@/components/custom_components/ProductModal/ProductModal"),
    {
        ssr: false, // Modal server par render nahi hota, isliye false
        loading: () => <ModalSkeleton /> // Jab tak download ho, skeleton dikhao
    }
);
const DealModal = dynamic(
    () => import("@/components/custom_components/DealModal/DealModal"),
    {
        ssr: false,
        loading: () => <ModalSkeleton />
    }
);

export default function GlobalModalRenderer() {
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