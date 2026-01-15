import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    // Automatic Timing
    openingTime: { type: String, default: "10:00" },
    closingTime: { type: String, default: "23:00" },
    isForceClosed: { type: Boolean, default: false },
    generalNote: {
      type: String,
      default:
        "NOTE: Delivery charges will be applied. Orders are accepted from 4pm to 2am. Any missinformation will result in order cancellation.",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);
