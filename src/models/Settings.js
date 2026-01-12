import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  shopIsOpen: { type: Boolean, default: true }, // Emergency Toggle

  // Timing (24H Format e.g. "16:00")
  openTime: { type: String, default: "16:00" },
  closeTime: { type: String, default: "03:00" },

  deliveryFee: { type: Number, default: 100 },
  freeDeliveryAbove: { type: Number, default: 3000 },

  notificationMessage: { type: String, default: "" }, // Top bar alert
});

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);
