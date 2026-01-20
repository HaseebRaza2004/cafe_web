import dbConnect from "@/lib/db";
import HeroSection from "@/components/custom_components/HeroSection";
import HotDeals from "@/components/custom_components/HotDeals";
import MenuSection from "@/components/custom_components/MenuSection";
import ReviewsSection from "@/components/custom_components/reviews/ReviewsSection";
import Product from "@/models/Product";
import "@/models/OptionGroup";
import Category from "@/models/Category";
import Deal from "@/models/Deal";

// SEO Metadata
export const metadata = {
  title: "Luxury Cafe | Premium Food & Deals",
  description: "Experience the finest taste in town.",
};

// Fetching Menu Data from Database
async function getHomePageData() {
  await dbConnect();

  try {
    const [categories, allProducts, hotDeals] = await Promise.all([
      Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),

      Product.find({ isAvailable: true })
        .populate("productOptions.optionGroupId")
        .sort({ sortOrder: 1, createdAt: -1 })
        .lean(),

      Deal.find({ isAvailable: true })
        .populate("itemGroups.category")
        .populate("itemGroups.specificProducts")
        .limit(4)
        .sort({ sortOrder: 1, createdAt: -1 })
        .lean(),
    ]);

    // Menu Sorting Logic
    let sortedMenu = [];
    categories.forEach((cat) => {
      const productsInCat = allProducts.filter((p) => p.category === cat.name);
      if (productsInCat.length > 0) {
        sortedMenu.push({ category: cat.name, items: productsInCat });
      }
    });

    // Uncategorized Items logic
    const definedCatNames = categories.map((c) => c.name);
    const uncategorized = allProducts.filter(
      (p) => !definedCatNames.includes(p.category),
    );
    if (uncategorized.length > 0) {
      const others = uncategorized.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {});
      Object.entries(others).forEach(([cat, items]) =>
        sortedMenu.push({ category: cat, items }),
      );
    }

    return {
      hotDeals: JSON.parse(JSON.stringify(hotDeals)),
      menuData: JSON.parse(JSON.stringify(sortedMenu)),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { hotDeals: [], menuData: [] };
  }
}

export default async function Home() {
  const { hotDeals, menuData } = await getHomePageData();
  const allProducts = menuData.flatMap((group) => group.items);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 relative">
      {/* Hero Section */}
      <HeroSection />

      {/* Hot Deals Section */}
      <HotDeals deals={hotDeals} allProducts={allProducts} />

      {/* Menu Section */}
      <MenuSection initialMenuData={menuData} />

      {/* Yahan Reviews Section add karein */}
      <ReviewsSection />
    </div>
  );
}
