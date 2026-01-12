import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    desc: { type: String },

    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 }, // Logic (Sale)

    category: {
      type: String,
      required: true,
      index: true, // 🔥 SUPER FAST FILTERING
    },

    image: { type: String, required: true },

    isAvailable: { type: Boolean, default: true, index: true },

    // Link to OptionGroups (Deals/Addons logic)
    allowedOptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OptionGroup",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
