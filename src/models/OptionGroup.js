import mongoose from "mongoose";

const OptionGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    type: { type: String, enum: ["single", "multiple"], default: "single" },

    options: [
      {
        linkedProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Menu Item Link
        name: { type: String }, // Display Name
        price: { type: Number, default: 0 }, // Deal Price
        isAvailable: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.OptionGroup ||
  mongoose.model("OptionGroup", OptionGroupSchema);
