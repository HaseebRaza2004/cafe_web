"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [editState, setEditState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to fetch fresh data
  const fetchData = async (type, id) => {
    setIsLoading(true);
    try {
      const endpoint =
        type === "product" ? `/api/products/${id}` : `/api/deals/${id}`;
      const res = await fetch(endpoint);
      const result = await res.json();
      if (result.success) return result.data;
    } catch (error) {
      console.error("Failed to fetch modal data", error);
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  // Open for New Item
  const openModal = useCallback(async (type, idOrData) => {
    if (typeof idOrData === "object") {
      setModalType(type);
      setModalData(idOrData);
      setEditState(null);
      setIsOpen(true);
      return;
    }
    const data = await fetchData(type, idOrData);
    if (data) {
      setModalType(type);
      setModalData(data);
      setEditState(null);
      setIsOpen(true);
    }
  }, []);

  // Open for Editing (From Cart)
  const openEditModal = useCallback(async (type, cartItem) => {
    const data = await fetchData(type, cartItem.productId);
    if (data) {
      setModalType(type);
      setModalData(data);
      setEditState({
        quantity: cartItem.quantity,
        selections: cartItem.selectedOptions,
        note: cartItem.customerNote,
        signature: cartItem.signature,
      });
      setIsOpen(true);
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalType(null);
    setModalData(null);
    setEditState(null);
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
        openEditModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);