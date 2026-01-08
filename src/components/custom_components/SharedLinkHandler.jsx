"use client"; 

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductModal from "@/components/custom_components/ProductModal";
import { dealsData } from "@/lib/data"; 

const SharedLinkHandler = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");
  const [sharedProduct, setSharedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (productId && dealsData) {
      const product = dealsData.find((p) => p.id == productId);
      if (product) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSharedProduct(product);
        setIsModalOpen(true);
      }
    }
  }, [productId]);

  return (
    <>
      {sharedProduct && (
        <ProductModal
          product={sharedProduct}
          isOpen={isModalOpen}
          setIsOpen={(val) => {
             setIsModalOpen(val);
             if (!val) {
                 // URL clean karne ka logic
                 const newUrl = window.location.pathname;
                 window.history.replaceState(null, '', newUrl);
             }
          }}
          trigger={null}
        />
      )}
    </>
  );
};

export default SharedLinkHandler;