"use client";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useModal } from "@/context/ModalContext";

const DeepLinkHandler = () => {
    const searchParams = useSearchParams();
    const { openModal } = useModal();
    const processedRef = useRef(false);

    useEffect(() => {
        if (processedRef.current) return;
        const productId = searchParams.get("product");
        const dealId = searchParams.get("deal");

        if (productId) {
            processedRef.current = true;
            openModal("product", productId);
            window.history.replaceState(null, "", "/");
        } else if (dealId) {
            processedRef.current = true;
            openModal("deal", dealId);
            window.history.replaceState(null, "", "/");
        }
    }, [searchParams, openModal]);

    return null;
};

export default DeepLinkHandler;