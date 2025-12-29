"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [deliveryArea, setDeliveryArea] = useState("dha");

  // Delivery Charges (PDF Section 6.2 ke hisaab se)
  const deliveryCharges = {
    dha: 150,
    gulshan: 200,
    nazimabad: 250,
    north: 300,
  };

  // Add Item Logic
  const addToCart = (product, quantity, addons, totalPrice) => {
    setCartItems((prev) => {
      // Check agar same item already hai (same addons ke sath)
      const existingIndex = prev.findIndex(
        (item) =>
          item.id === product.id &&
          JSON.stringify(item.addons) === JSON.stringify(addons)
      );

      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
        newCart[existingIndex].totalPrice += totalPrice;
        return newCart;
      } else {
        return [...prev, { ...product, quantity, addons, totalPrice }];
      }
    });
  };

  // Update Item Quantity
  const updateItemQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(index);
      return;
    }

    setCartItems((prev) => {
      const newCart = [...prev];
      const item = newCart[index];
      item.quantity = newQuantity;
      item.totalPrice = item.unitPrice * newQuantity;
      return newCart;
    });
  };

  // Remove Item
  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculate Totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const tax = Math.round(subtotal * 0.15); // 15% Tax
  const deliveryFee = deliveryCharges[deliveryArea] || 0;
  const grandTotal = subtotal + tax + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        subtotal,
        tax,
        deliveryFee,
        grandTotal,
        deliveryArea,
        setDeliveryArea,
        deliveryCharges,
        updateItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
