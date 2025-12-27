import HeroSection from "@/components/custom components/HeroSection";
import HotDeals from "@/components/custom components/HotDeals";
import MenuSection from "@/components/custom components/MenuSection";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 relative cotainer">
      {/* Hero Section */}
      <HeroSection />

      {/* Hot Deals Section */}
      <HotDeals />

      {/* Menu Section */}
      <MenuSection />

      

    </div>
  );
}
