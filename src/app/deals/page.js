"use client";

import React from "react";
import DealCard from "@/components/custom components/Card";
import { dealsData } from "@/lib/data";

const DealsPage = () => {
  return (
    <div className="min-h-screen text-white">
      {/* 2. PAGE TITLE SECTION (Thora margin-top diya taake Header ke peeche na chupe) */}
      <div className="pt-44 pb-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-widest text-(--color-gold) mb-4 animate-fade-in-up">
          Exclusive Offers
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl">
          Enjoy our premium taste at unbeatable prices. Limited time offers.
        </p>
      </div>

      {/* 3. ALL DEALS GRID */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {dealsData.map((deal, index) => (
            <DealCard key={deal.id} deal={deal} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DealsPage;
