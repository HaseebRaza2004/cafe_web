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
  const [isLoaded, setIsLoaded] = useState(false);

  // Destructure Toast safely to avoid "not a function" errors
  const { success, info } = useToast() || {};

  // --- 1. HYDRATION FIX (The "setTimeout" Trick) ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Pushing this to the next event loop tick eliminates the "Synchronous setState" warning
    const timer = setTimeout(() => {
      try {
        const savedCart = localStorage.getItem("cafe_cart");
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCartItems(parsed);
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

  // --- 2. PERSISTENCE ---
  useEffect(() => {
    // Only write to storage AFTER we have loaded the initial data
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem("cafe_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  // --- 3. LOGIC ---
  const generateSignature = useCallback((productId, options, note) => {
    const safeNote =
      typeof note === "string" ? note.trim() : String(note || "");
    const sortedOptions = Array.isArray(options)
      ? [...options].sort((a, b) => a.name.localeCompare(b.name))
      : [];
    return `${productId}-${JSON.stringify(sortedOptions)}-${safeNote}`;
  }, []);

  const addToCart = useCallback(
    (product, quantity = 1, options = [], manualPrice = null, note = "") => {
      // Toast Side Effect (Outside State Update)
      if (success) success("Item added to cart");

      setCartItems((prevItems) => {
        const pId = product._id || product.id;
        const signature = generateSignature(pId, options, note);

        // Unit Price Calculation
        const unitPrice =
          manualPrice !== null
            ? Number(manualPrice) / Number(quantity)
            : Number(product.price) +
              options.reduce((acc, opt) => acc + (opt.price || 0), 0);

        const existingIndex = prevItems.findIndex(
          (item) => item.signature === signature,
        );

        if (existingIndex > -1) {
          // Merge Quantity
          const newItems = [...prevItems];
          newItems[existingIndex].quantity += Number(quantity);
          return newItems;
        }

        // Add New
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
          },
        ];
      });
    },
    [generateSignature, success],
  ); // Correct dependencies

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
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    if (typeof window !== "undefined") localStorage.removeItem("cafe_cart");
  }, []);

  // --- 4. MEMOIZED VALUES ---
  const cartTotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems],
  );
  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems],
  );

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isLoaded,
    }),
    [
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isLoaded,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
