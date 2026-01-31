"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // "product" | "deal"
  const [modalData, setModalData] = useState(null);
  const [editState, setEditState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- Helper to fetch fresh data ---
  const fetchData = async (type, id) => {
    try {
      const endpoint =
        type === "product" ? `/api/products/${id}` : `/api/deals/${id}`;
      const res = await fetch(endpoint);
      const result = await res.json();
      if (result.success) return result.data;
    } catch (error) {
      console.error("Failed to fetch modal data", error);
    }
    return null;
  };

  // Open Modal by fetching data via ID (for Deep Links)
  const openDeepLink = useCallback(async (type, id) => {
    setModalType(type);
    setModalData(null);
    setIsLoading(true);
    setIsOpen(true);

    const data = await fetchData(type, id);

    if (data) {
      setModalData(data);
    } else {
      setIsOpen(false);
    }
    setIsLoading(false);
  }, []);

  // Open Modal with either data or fetch by ID
  const openModal = useCallback(
    (type, idOrData) => {
      if (typeof idOrData === "object") {
        setModalType(type);
        setModalData(idOrData);
        setEditState(null);
        setIsLoading(false);
        setIsOpen(true);
        return;
      }

      openDeepLink(type, idOrData);
    },
    [openDeepLink],
  );

  // Open Edit Modal with pre-filled state
  const openEditModal = useCallback(async (type, cartItem) => {
    setModalType(type);
    setIsLoading(true);
    setIsOpen(true);

    const data = await fetchData(type, cartItem.productId);

    if (data) {
      setModalData(data);
      setEditState({
        quantity: cartItem.quantity,
        selections: cartItem.selectedOptions,
        note: cartItem.customerNote,
        signature: cartItem.signature,
      });
    } else {
      setIsOpen(false);
    }
    setIsLoading(false);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalType(null);
    setModalData(null);
    setEditState(null);
    setIsLoading(false);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        modalType,
        modalData,
        editState,
        isLoading,
        openModal,
        openDeepLink,
        openEditModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);