"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

// Ye Dummy Data waisa hi banaya hai jaisa Google API se ayega
const reviews = [
  {
    author_name: "Ahmed Raza",
    profile_photo_url: "https://randomuser.me/api/portraits/men/32.jpg", 
    rating: 5,
    text: "Amazing ambiance and the Zinger Burger was out of this world! Definitely visiting again.",
    relative_time_description: "2 days ago"
  },
  {
    author_name: "Sara Khan",
    profile_photo_url: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    text: "Loved the pizza. The crust was perfect and the toppings were generous. Highly recommended for families.",
    relative_time_description: "a week ago"
  },
  {
    author_name: "Bilal Sheikh",
    profile_photo_url: "https://randomuser.me/api/portraits/men/85.jpg",
    rating: 4,
    text: "Great coffee and dessert options. The staff is very polite. A bit crowded on weekends though.",
    relative_time_description: "2 weeks ago"
  },
];

const ReviewsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-black text-white relative overflow-hidden">
        
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-(--color-gold) font-display uppercase tracking-wider mb-4">
                Guest Love
            </h2>
            <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-4xl font-bold text-white">4.8</span>
                <div className="flex text-(--color-gold)">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 fill-current" />
                    ))}
                </div>
            </div>
            <p className="text-gray-400">Based on Google Reviews</p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {reviews.map((review, index) => (
                <div 
                    key={index} 
                    className="bg-[#0a0a0a] border border-white/10 p-6 rounded-xl hover:border-(--color-gold) transition-all duration-300 shadow-lg group"
                >
                    {/* Header: Image & Name */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-(--color-gold)">
                            <Image 
                                src={review.profile_photo_url} 
                                alt={review.author_name} 
                                fill 
                                className="object-cover"
                                unoptimized={true}
                            />
                        </div>
                        <div>
                            <h4 className="font-bold text-white group-hover:text-(--color-gold) transition-colors">
                                {review.author_name}
                            </h4>
                            <p className="text-xs text-gray-500">{review.relative_time_description}</p>
                        </div>
                    </div>

                    {/* Stars */}
                    <div className="flex text-(--color-gold) mb-3">
                        {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                        {review.text}
                    </p>

                    {/* Google Logo (Optional Authenticity marker) */}
                    <div className="mt-4 flex justify-end">
                        <span className="text-[10px] text-gray-600 uppercase tracking-widest">Posted on Google</span>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </section>
  );
};

export default ReviewsSection;