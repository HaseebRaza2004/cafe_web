import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import ProductsClient from "@/components/custom_components/admin/ProductsClient";

export const metadata = {
  title: "Menu Management | Admin Panel",
};

async function getProducts() {
  await dbConnect();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();

  return JSON.parse(JSON.stringify(products));
}

export default async function ProductsPage() {
  const products = await getProducts();

  return <ProductsClient initialProducts={products} />;
}
