"use client";

import { useModal } from "@/context/ModalContext";
import ProductModal from "@/components/custom_components/ProductModal/ProductModal";
import DealModal from "@/components/custom_components/DealModal/DealModal";
import ModalSkeleton from "@/components/custom_components/skeletons/ModalSkeleton";

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