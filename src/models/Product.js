import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    desc: { type: String },
    category: { type: String, required: true, index: true },
    image: { type: String, required: true },

    // Base Price
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },

    isAvailable: { type: Boolean, default: true, index: true },

    // 🔥 LOGIC 1: Size/Variations (e.g. Small/Large or Single/Double)
    variations: [
      {
        title: { type: String, required: true }, // e.g. "Small"
        price: { type: Number, required: true }, // e.g. 800
        isAvailable: { type: Boolean, default: true },
      },
    ],

    // 🔥 LOGIC 2: Linked Addons & Filters
    productOptions: [
      {
        optionGroupId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "OptionGroup",
        },
        // Agar ye array populated hai, to sirf yehi options dikhenge
        allowedVariations: [String],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
