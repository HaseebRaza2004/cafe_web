"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useModal } from "@/context/ModalContext";

const DeepLinkHandler = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { openModal } = useModal();

    useEffect(() => {
        const productId = searchParams.get("product");
        const dealId = searchParams.get("deal");

        if (productId) {
            openModal("product", productId);
            router.replace("/", { scroll: false });
        } else if (dealId) {
            openModal("deal", dealId);
            router.replace("/", { scroll: false });
        }
    }, [searchParams, openModal, router]);

    return null;
};

export default DeepLinkHandler;