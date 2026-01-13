import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

// SEO Metadata
export const metadata = {
  title: "Menu Management | Admin Panel",
};

// Data Fetching (Server Side - Super Fast)
async function getProducts() {
  await dbConnect();
  // .lean() use kiya hai JSON conversion fast karne ke liye
  return await Product.find({}).sort({ createdAt: -1 }).lean();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Menu Items
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your cafe&apos;s food & deals
          </p>
        </div>

        <Link
          href="/admin/products/add"
          className="bg-(--color-gold) text-black px-6 py-3 rounded-xl font-bold hover:bg-[#d4af66] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(197,160,89,0.3)]"
        >
          <Plus className="w-5 h-5" />
          Add New Item
        </Link>
      </div>

      {/* Search & Filter Bar (Visual Only for now) */}
      <div className="bg-black/40 border border-white/10 p-4 rounded-xl mb-6 flex gap-4 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search burgers, pizzas..."
            className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:border-(--color-gold) focus:outline-none"
          />
        </div>
      </div>

      {/* Products Grid (Responsive) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="group bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-gold/50 transition-all duration-300"
          >
            {/* Image Area */}
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs font-bold text-(--color-gold) backdrop-blur-sm border border-(--color-gold)/20">
                {product.category}
              </div>
            </div>

            {/* Content Area */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-white truncate pr-2">
                  {product.title}
                </h3>
                <span className="text-(--color-gold) font-bold">
                  Rs {product.price}
                </span>
              </div>

              <p className="text-gray-400 text-sm line-clamp-2 mb-4 h-10">
                {product.desc}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-white/10">
                <button className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-sm font-medium text-gray-300 flex items-center justify-center gap-2 transition-colors">
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button className="flex-1 bg-red-500/10 hover:bg-red-500/20 py-2 rounded-lg text-sm font-medium text-red-500 flex items-center justify-center gap-2 transition-colors">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-500">
            No products found. Click &quot;Add New Item&quot; to start.
          </div>
        )}
      </div>
    </div>
  );
}
