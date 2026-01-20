import mongoose from "mongoose";

const DealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    image: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    itemGroups: [
      {
        heading: { type: String, required: true },
        minSelection: { type: Number, default: 1 },
        maxSelection: { type: Number, default: 1 },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
        specificProducts: [
          { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        ],
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.models.Deal || mongoose.model("Deal", DealSchema);
