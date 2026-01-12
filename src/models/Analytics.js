import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true, index: true }, // "YYYY-MM-DD"
  views: { type: Number, default: 0 },
  orders: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
});

export default mongoose.models.Analytics ||
  mongoose.model("Analytics", AnalyticsSchema);
