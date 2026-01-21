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

    // Steps / Groups Logic
    itemGroups: [
      {
        heading: { type: String, required: true }, // e.g. "Select Your Drink"
        minSelection: { type: Number, default: 1 },
        maxSelection: { type: Number, default: 1 },

        // Humne yahan se 'category' hata diya hai.
        // Ab hum sirf specific products ki list save karenge jo admin tick karega.
        specificProducts: [
          {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            extraPrice: { type: Number, default: 0 }, // Har item ka apna extra charge
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.models.Deal || mongoose.model("Deal", DealSchema);
