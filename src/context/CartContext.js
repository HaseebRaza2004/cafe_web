"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useToast } from "@/context/ToastContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryArea, setDeliveryArea] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const { success, info } = useToast() || {};

  //  Hydration
  useEffect(() => {
    if (typeof window === "undefined") return;

    const timer = setTimeout(() => {
      try {
        const savedCart = localStorage.getItem("cafe_cart");
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          if (parsed) {
            if (Array.isArray(parsed.items)) setCartItems(parsed.items);
            if (parsed.deliveryFee !== undefined)
              setDeliveryFee(parsed.deliveryFee);
            if (parsed.deliveryArea !== undefined)
              setDeliveryArea(parsed.deliveryArea);
          }
        }
      } catch (error) {
        console.error("Cart parse error:", error);
      } finally {
        setIsLoaded(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      const stateToSave = {
        items: cartItems,
        deliveryFee: deliveryFee,
        deliveryArea: deliveryArea,
      };
      localStorage.setItem("cafe_cart", JSON.stringify(stateToSave));
    }
  }, [cartItems, deliveryFee, deliveryArea, isLoaded]);

  //  LOGIC
  const generateSignature = useCallback((productId, options, note) => {
    const safeNote =
      typeof note === "string" ? note.trim() : String(note || "");
    const sortedOptions = Array.isArray(options)
      ? [...options].sort((a, b) => a.name.localeCompare(b.name))
      : [];
    return `${productId}-${JSON.stringify(sortedOptions)}-${safeNote}`;
  }, []);

  // ADD NEW ITEM
  const addToCart = useCallback(
    (
      product,
      quantity = 1,
      options = [],
      manualPrice = null,
      note = "",
      type = "product",
    ) => {
      if (success) success("Item added to cart");

      setCartItems((prevItems) => {
        const pId = product._id || product.id;
        const signature = generateSignature(pId, options, note);

        const unitPrice =
          manualPrice !== null
            ? Number(manualPrice) / Number(quantity)
            : Number(product.price) +
              options.reduce((acc, opt) => acc + (opt.price || 0), 0);

        const existingIndex = prevItems.findIndex(
          (item) => item.signature === signature,
        );

        if (existingIndex > -1) {
          const newItems = [...prevItems];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + Number(quantity),
          };
          return newItems;
        }

        return [
          ...prevItems,
          {
            signature,
            productId: pId,
            title: product.title,
            image: product.image,
            price: unitPrice,
            quantity: Number(quantity),
            selectedOptions: options,
            customerNote: typeof note === "string" ? note : "",
            type: type,
          },
        ];
      });
    },
    [generateSignature, success],
  );

  // UPDATE ITEM
  const updateItemInCart = useCallback(
    (oldSignature, product, quantity, options, manualPrice, note, type) => {
      setCartItems((prevItems) => {
        const pId = product._id || product.id;
        const newSignature = generateSignature(pId, options, note);

        const oldIndex = prevItems.findIndex(
          (item) => item.signature === oldSignature,
        );
        if (oldIndex === -1) return prevItems;

        const unitPrice =
          manualPrice !== null
            ? Number(manualPrice) / Number(quantity)
            : Number(product.price) +
              options.reduce((acc, opt) => acc + (opt.price || 0), 0);

        const duplicateIndex = prevItems.findIndex(
          (item, idx) => item.signature === newSignature && idx !== oldIndex,
        );

        if (duplicateIndex > -1) {
          const newItems = prevItems.filter((_, idx) => idx !== oldIndex);
          const targetIndex =
            duplicateIndex > oldIndex ? duplicateIndex - 1 : duplicateIndex;
          newItems[targetIndex] = {
            ...newItems[targetIndex],
            quantity: newItems[targetIndex].quantity + Number(quantity),
          };
          return newItems;
        }

        const newItems = [...prevItems];
        newItems[oldIndex] = {
          signature: newSignature,
          productId: pId,
          title: product.title,
          image: product.image,
          price: unitPrice,
          quantity: Number(quantity),
          selectedOptions: options,
          customerNote: typeof note === "string" ? note : "",
          type: type,
        };
        return newItems;
      });
      if (success) success("Item updated successfully");
    },
    [generateSignature, success],
  );

  const removeFromCart = useCallback(
    (signature) => {
      setCartItems((prev) =>
        prev.filter((item) => item.signature !== signature),
      );
      if (info) info("Item removed");
    },
    [info],
  );

  const updateQuantity = useCallback((signature, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.signature === signature) {
          const newQty = item.quantity + delta;
          if (newQty < 1) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      }),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setDeliveryFee(0);
    setDeliveryArea("");
    if (typeof window !== "undefined") localStorage.removeItem("cafe_cart");
  }, []);

  //  Set Delivery Function
  const setDeliveryInfo = useCallback((price, areaName) => {
    setDeliveryFee(price);
    setDeliveryArea(areaName);
  }, []);

  //  CALCULATIONS
  const cartTotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems],
  );
  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems],
  );

  const TAX_RATE = 0.15;
  const taxAmount = cartTotal * TAX_RATE;
  const grandTotal = cartTotal + taxAmount + deliveryFee;

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      updateItemInCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isLoaded,
      deliveryFee,
      deliveryArea,
      setDeliveryInfo,
      tax: taxAmount,
      grandTotal,
    }),
    [
      cartItems,
      addToCart,
      updateItemInCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isLoaded,
      deliveryFee,
      deliveryArea,
      setDeliveryInfo,
      taxAmount,
      grandTotal,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
