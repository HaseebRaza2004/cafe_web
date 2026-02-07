"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ArrowLeft } from "lucide-react";
import CheckoutForm from "@/components/custom_components/checkout/CheckoutForm";
import OrderSummary from "@/components/custom_components/checkout/OrderSummary";
import ConfirmModal from "@/components/custom_components/ConfirmModal"; 

const CheckoutPage = () => {
  const router = useRouter();
  const { cartItems, deliveryFee, deliveryArea, grandTotal, isLoaded } =
    useCart();

  useEffect(() => {
    if (isLoaded) {
      if (cartItems.length === 0 || !deliveryArea) {
        router.replace("/");
      }
    }
  }, [isLoaded, cartItems, deliveryArea, router]);

  // State
  const [changeRequest, setChangeRequest] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
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

  const handleValidation = () => {
    if (cartItems.length === 0) return;
    if (!formData.fullName || !formData.mobile || !formData.address) {
      alert("Please fill in all required fields (Name, Mobile, Address).");
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleFinalOrder = () => {
    // WhatsApp Message Logic
    const message =
      `*New Order: ${formData.fullName}*\n\n` +
      `*Items:*\n${cartItems
        .map(
          (item) =>
            `- ${item.quantity}x ${item.title} (${item.selectedOptions?.map((opt) => opt.name).join(", ") || ""})`,
        )
        .join("\n")}\n\n` +
      `*Total Bill:* Rs ${grandTotal.toLocaleString()}\n` +
      `*Delivery Area:* ${deliveryArea.toUpperCase()}\n` +
      `*Address:* ${formData.address} ${formData.landmark ? `(${formData.landmark})` : ""}\n` +
      `*Payment:* Cash on Delivery (COD)\n` +
      `${changeRequest ? `*Change Required For:* Rs ${changeRequest}\n` : ""}` +
      `*Mobile:* ${formData.mobile}\n` +
      `${formData.altMobile ? `*Alt Mobile:* ${formData.altMobile}\n` : ""}` +
      `${formData.email ? `*Email:* ${formData.email}\n` : ""}` +
      `${formData.instructions ? `*Note:* ${formData.instructions}` : ""}`;

    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/923212190661?text=${encodedMsg}`, "_blank");
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
          {/* LEFT: FORM */}
          <div className="lg:col-span-8">
            <CheckoutForm
              formData={formData}
              handleInputChange={handleInputChange}
              deliveryArea={deliveryArea}
              changeRequest={changeRequest}
              setChangeRequest={setChangeRequest}
            />
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="lg:col-span-4">
            <OrderSummary handlePlaceOrder={handleValidation} />
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleFinalOrder}
        title="Confirm Order details?"
        description="Please ensure your address and items are correct. Orders cannot be cancelled once placed. Estimated delivery: 45-60 mins."
        confirmText="Place Order on WhatsApp"
        variant="default"
      />
    </div>
  );
};

export default CheckoutPage;
