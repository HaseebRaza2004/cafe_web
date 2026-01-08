import { Suspense } from "react";
import HeroSection from "@/components/custom_components/HeroSection";
import HotDeals from "@/components/custom_components/HotDeals";
import MenuSection from "@/components/custom_components/MenuSection";
import ReviewsSection from "@/components/custom_components/reviews/ReviewsSection";
import SharedLinkHandler from "@/components/custom_components/SharedLinkHandler";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 relative">
      {/* Hero Section */}
      <HeroSection />

      {/* Hot Deals Section */}
      <HotDeals />

      {/* Menu Section */}
      <MenuSection />

      {/* Yahan Reviews Section add karein */}
      <ReviewsSection />

      {/* Shared Link Handler for Product Modals */}
      <Suspense fallback={null}>
        <SharedLinkHandler />
      </Suspense>
    </div>
  );
}
