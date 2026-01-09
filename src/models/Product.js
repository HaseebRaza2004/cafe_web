import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: [60, "Title cannot be more than 60 characters"],
    },
    desc: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: [200, "Description cannot be more than 200 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      index: true, // Faster search
    },
    image: {
      type: String, // Cloudinary URL
      required: [true, "Image URL is required"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    // Addons array (Simple structure for now)
    addons: [
      {
        title: String,
        price: Number,
      },
    ],
  },
  {
    timestamps: true, // CreatedAt, UpdatedAt auto-manage honge
  }
);

// Next.js mein Model overwrite prevent karne ke liye check zaroori hai
export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
