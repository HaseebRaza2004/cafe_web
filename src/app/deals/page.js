import React from "react";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import "@/models/OptionGroup";
import Card from "@/components/custom_components/Card";

export const metadata = {
  title: "Exclusive Deals | Luxury Cafe",
  description: "Limited time premium offers.",
};

// Data Fetching
async function getDeals() {
  await dbConnect();
  const deals = await Product.find({
    category: { $regex: "Deal", $options: "i" },
  })
    .populate({
      path: "productOptions.optionGroupId",
      select: "name type options",
    })
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(deals));
}

export default async function DealsPage() {
  const deals = await getDeals();

  return (
    <div className="min-h-screen text-white">
      {/* PAGE TITLE SECTION */}
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
          <div className="text-center text-gray-500 py-20">
            No deals active at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {deals.map((deal, index) => (
              <Card key={deal._id} deal={deal} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
