"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { ArrowLeft } from "lucide-react";
import CheckoutForm from "@/components/custom_components/checkout/CheckoutForm";
import OrderSummary from "@/components/custom_components/checkout/OrderSummary";
import ConfirmModal from "@/components/custom_components/ConfirmModal";

const CheckoutPage = () => {
  const router = useRouter();
  const { error: showError, success: showSuccess } = useToast() || {};
  const {
    cartItems,
    deliveryFee,
    deliveryArea,
    cartTotal,
    tax,
    grandTotal,
    isLoaded,
    clearCart,
  } = useCart();

  const [changeRequest, setChangeRequest] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    altMobile: "",
    address: "",
    landmark: "",
    email: "",
    instructions: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation before showing confirmation modal
  const handleValidation = () => {
    if (cartItems.length === 0) {
      if (showError) showError("Your cart is empty!");
      return;
    }

    if (!formData.fullName || formData.fullName.trim().length < 3) {
      if (showError) showError("Please enter a valid Full Name.");
      return;
    }

    const phoneRegex = /^03\d{9}$/;
    if (!formData.mobile || !phoneRegex.test(formData.mobile)) {
      if (showError)
        showError(
          "Please enter a valid 11-digit mobile number (e.g., 03001234567).",
        );
      return;
    }

    if (!formData.address || formData.address.trim().length < 8) {
      if (showError) showError("Please enter a complete delivery address.");
      return;
    }

    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        if (showError)
          showError("Please enter a valid email address, or leave it blank.");
        return;
      }
    }

    setIsConfirmOpen(true);
  };

  // Confrim Order Handler
  const handleFinalOrder = async () => {
    if (!navigator.onLine) {
      if (showError)
        showError("No internet connection. Please check your network.");
      return;
    };

    setIsConfirmOpen(false);
    setIsSubmitting(true);

    const payload = {
      customerName: formData.fullName,
      phone: formData.mobile,
      altPhone: formData.altMobile,
      email: formData.email,
      address: formData.address,
      landmark: formData.landmark,
      deliveryArea: deliveryArea,
      instruction: formData.instructions,
      changeRequest: changeRequest,
      cartItems: cartItems,
      subtotal: cartTotal,
      tax: tax,
      deliveryFee: deliveryFee,
      totalAmount: grandTotal,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (showSuccess) showSuccess("Order Secured! Processing...");

        clearCart();

        if (typeof window !== "undefined") {
          localStorage.setItem("active_order", data.orderId);
        }

        router.push(`/order-success/${data.orderId}`);
      } else {
        throw new Error(data.error || "Failed to place order.");
      }
    } catch (err) {
      if (showError)
        showError(err.message || "Network Error. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen text-white pt-24 pb-12 mt-10">
      <div className="container mx-auto px-4 md:px-6">
        <header className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-(--color-gold) transition-colors mb-4 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Menu
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold text-(--color-gold) font-display uppercase tracking-wider">
            Secure Your Order
          </h1>
          <p className="text-gray-400 mt-2 text-base md:text-lg font-light">
            Please provide your details to finalize your{" "}
            <span className="text-white font-semibold">
              Premium Dining Experience.
            </span>
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-8">
            <CheckoutForm
              formData={formData}
              handleInputChange={handleInputChange}
              deliveryArea={deliveryArea}
              changeRequest={changeRequest}
              setChangeRequest={setChangeRequest}
            />
          </div>
          <div className="lg:col-span-4">
            <OrderSummary
              handlePlaceOrder={handleValidation}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => !isSubmitting && setIsConfirmOpen(false)}
        onConfirm={handleFinalOrder}
        title="Confirm Order Details"
        description="Please ensure your address and items are correct. Estimated delivery: 45-60 mins."
        confirmText="Secure My Order"
        variant="default"
      />
    </div>
  );
};

export default CheckoutPage;
