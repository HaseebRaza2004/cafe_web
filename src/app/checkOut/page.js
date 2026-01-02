"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ArrowLeft } from "lucide-react";
import CheckoutForm from "@/components/custom components/checkout/CheckoutForm";
import OrderSummary from "@/components/custom components/checkout/OrderSummary";

const CheckoutPage = () => {
  const { cartItems, subtotal, tax, deliveryFee, grandTotal, deliveryArea } =
    useCart();

  // State
  const [changeRequest, setChangeRequest] = useState("");
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

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;

    if (!formData.fullName || !formData.mobile || !formData.address) {
      alert("Please fill in all required fields (Name, Mobile, Address).");
      return;
    }

    // WhatsApp Message Logic
    const message =
      `*New Order: ${formData.fullName}*\n\n` +
      `*Items:*\n${cartItems
        .map(
          (item) =>
            `- ${item.quantity}x ${item.title} (${item.addons.join(", ")})`
        )
        .join("\n")}\n\n` +
      `*Total Bill:* Rs ${grandTotal}\n` +
      `*Delivery Area:* ${deliveryArea.toUpperCase()}\n` +
      `*Address:* ${formData.address}\n` +
      `*Payment:* Cash on Delivery (COD)\n` +
      `${changeRequest ? `*Change Required For:* Rs ${changeRequest}\n` : ""}` +
      `*Mobile:* ${formData.mobile}\n` +
      `${formData.email ? `*Email:* ${formData.email}\n` : ""}` +
      `${formData.instructions ? `*Note:* ${formData.instructions}` : ""}`;

    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/923001234567?text=${encodedMsg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 mt-10">
      <div className="container mx-auto px-4 md:px-6">
        {/* Page Header */}
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
            Please provide your delivery details to finalize your{" "}
            <span className="text-white font-semibold">
              Premium Dining Experience.
            </span>
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* --- LEFT COLUMN: FORM COMPONENT --- */}
          <div className="lg:col-span-8">
            <CheckoutForm
              formData={formData}
              handleInputChange={handleInputChange}
              deliveryArea={deliveryArea}
              changeRequest={changeRequest}
              setChangeRequest={setChangeRequest}
            />
          </div>

          {/* --- RIGHT COLUMN: ORDER SUMMARY COMPONENT --- */}
          <div className="lg:col-span-4">
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              tax={tax}
              deliveryFee={deliveryFee}
              grandTotal={grandTotal}
              deliveryArea={deliveryArea}
              handlePlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
