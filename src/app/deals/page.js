import React from "react";
import dbConnect from "@/lib/db";
import Deal from "@/models/Deal";
import "@/models/OptionGroup";
import "@/models/Product"; // Model register krne ke liye zaroori hai
import Card from "@/components/custom_components/Card";

export const metadata = {
  title: "Exclusive Deals | Luxury Cafe",
  description: "Limited time premium offers.",
};

// Data Fetching
async function getDeals() {
  await dbConnect();

  try {
    // 🔥 OPTIMIZATION: Sirf Deals fetch kar rahe hain, Products ki zaroorat nahi.
    // Populate kar diya hai taake Deal ke andar hi product details aa jayen.
    const deals = await Deal.find({ isAvailable: true })
      .populate({
        path: "itemGroups.specificProducts.product",
        model: "Product",
        select: "title price image desc", // Sirf zaroori fields uthao (Optimization)
      })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(deals));
  } catch (error) {
    console.error("Error fetching deals:", error);
    return [];
  }
}

export default async function DealsPage() {
  const deals = await getDeals();

  return (
    <div className="min-h-screen text-white bg-black">
      {/* PAGE TITLE */}
      <div className="pt-44 pb-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-widest text-(--color-gold) mb-4 animate-fade-in-up">
          Exclusive Offers
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl">
          Enjoy our premium taste at unbeatable prices. Limited time offers.
        </p>
      </div>

      {/* DEALS GRID */}
      <div className="container mx-auto px-4 pb-20">
        {deals.length === 0 ? (
          <div className="text-center text-gray-500 py-20 border border-white/10 rounded-xl bg-white/5">
            <h3 className="text-xl font-bold text-gray-400">No Active Deals</h3>
            <p className="text-sm mt-2">Check back soon for new offers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {deals.map((deal, index) => (
              <Card
                key={deal._id}
                deal={deal}
                index={index}
                // allProducts prop ab pass karne ki zaroorat nahi
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
