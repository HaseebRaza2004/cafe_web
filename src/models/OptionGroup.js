import mongoose from "mongoose";

const OptionGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true, // Search optimization
    },
    type: {
      type: String,
      enum: ["single", "multiple"], // Single select (Flavor) ya Multiple (Toppings)
      default: "single",
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    options: [
      {
        name: { type: String, required: true },
        price: { type: Number, default: 0 }, // Extra price
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.OptionGroup ||
  mongoose.model("OptionGroup", OptionGroupSchema);
