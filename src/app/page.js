import dbConnect from "@/lib/db";
import HeroSection from "@/components/custom_components/HeroSection";
import HotDeals from "@/components/custom_components/HotDeals";
import MenuSection from "@/components/custom_components/MenuSection";
import ReviewsSection from "@/components/custom_components/reviews/ReviewsSection";
import Product from "@/models/Product";

// Fetching Menu Data from Database
async function getHomePageData() {
  await dbConnect();
  const [hotDeals, menuItems] = await Promise.all([
    Product.find({ category: { $regex: "Deal", $options: "i" } })
      .limit(4)
      .populate("productOptions.optionGroupId")
      .sort({ createdAt: -1 })
      .lean(),
    Product.find({ category: { $not: { $regex: "Deal", $options: "i" } } })
      .populate("productOptions.optionGroupId")
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  return {
    hotDeals: JSON.parse(JSON.stringify(hotDeals)),
    menuItems: JSON.parse(JSON.stringify(menuItems)),
  };
}

export default async function Home() {
  const { hotDeals, menuItems } = await getHomePageData();
  console.log("deals",hotDeals);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 relative">
      {/* Hero Section */}
      <HeroSection />

      {/* Hot Deals Section */}
      <HotDeals deals={hotDeals} />

      {/* Menu Section */}
      <MenuSection initialMenuData={menuItems} />

      {/* Yahan Reviews Section add karein */}
      <ReviewsSection />
    </div>
  );
}
