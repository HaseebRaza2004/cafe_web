import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: String, required: true },
    discountPrice: { type: String },
    category: { type: String, required: true },
    image: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    productOptions: [
      {
        optionGroupId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "OptionGroup",
        },
        allowedVariations: [{ type: String }],
      },
    ],
    variations: [
      {
        title: { type: String },
        price: { type: Number },
        isAvailable: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
