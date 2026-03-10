import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    altPhone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, required: true },
    landmark: { type: String, default: "" },
    deliveryArea: { type: String, required: true },
    instruction: { type: String, default: "" },
    changeRequest: { type: String, default: "" },

    cartItems: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
      required: true,
    },

    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Pending", "Cooking", "Delivered", "Cancelled"],
      default: "Pending",
      index: true,
    },
    paymentMethod: { type: String, default: "COD" },
  },
  { timestamps: true },
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
