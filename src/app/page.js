import dbConnect from "@/lib/db";
import HeroSection from "@/components/custom_components/HeroSection";
import HotDeals from "@/components/custom_components/HotDeals";
import MenuSection from "@/components/custom_components/MenuSection";
import ReviewsSection from "@/components/custom_components/reviews/ReviewsSection";
import Product from "@/models/Product";
import "@/models/OptionGroup";
import Category from "@/models/Category";

// SEO Metadata
export const metadata = {
  title: "Luxury Cafe | Premium Food & Deals",
  description: "Experience the finest taste in town.",
};

// Fetching Menu Data from Database
async function getHomePageData() {
  await dbConnect();
  const [categories, allProducts] = await Promise.all([
    Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),

    // Sirf woh products lao jo Deals NAHI hain
    Product.find({ category: { $not: { $regex: "Deal", $options: "i" } } })
      .populate("productOptions.optionGroupId")
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean(),
  ]);

  let sortedMenu = [];

  categories.forEach((cat) => {
    const productsInCat = allProducts.filter(
      (p) => p.category.toLowerCase() === cat.name.toLowerCase()
    );
    if (productsInCat.length > 0) {
      sortedMenu.push({
        category: cat.name,
        items: productsInCat,
      });
    }
  });

  const definedCatNames = categories.map((c) => c.name.toLowerCase());
  const uncategorized = allProducts.filter(
    (p) => !definedCatNames.includes(p.category.toLowerCase())
  );

  if (uncategorized.length > 0) {
    const remainingGroups = uncategorized.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    Object.entries(remainingGroups).forEach(([cat, items]) => {
      sortedMenu.push({ category: cat, items });
    });
  }

  return {
    hotDeals: [],
    menuData: JSON.parse(JSON.stringify(sortedMenu)),
  };
}

export default async function Home() {
  const { hotDeals, menuData } = await getHomePageData();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 relative">
      {/* Hero Section */}
      <HeroSection />

      {/* Hot Deals Section */}
      <HotDeals deals={hotDeals} />

      {/* Menu Section */}
      <MenuSection initialMenuData={menuData} />

      {/* Yahan Reviews Section add karein */}
      <ReviewsSection />
    </div>
  );
}
