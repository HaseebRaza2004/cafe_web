import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    instruction: { type: String },

    cartItems: [
      {
        productId: { type: String }, // Reference ke bajaye String rakha taake product delete hone par history na ure
        title: String,
        qty: Number,
        price: Number,
        selectedOptions: [String], // e.g. ["Chicken Tikka", "Coke"]
      },
    ],

    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Pending", "Cooking", "Delivered", "Cancelled"],
      default: "Pending",
      index: true, // Dashboard par "Pending" orders jaldi dikhane ke liye
    },

    orderDate: { type: Date, default: Date.now, index: true }, // Reporting ke liye fast
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
