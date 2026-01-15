import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import "@/models/OptionGroup";
import ProductForm from "@/components/custom_components/admin/ProductForm";

export async function generateMetadata({ params }) {
  return { title: `Edit Product | Admin Panel` };
}

async function getProduct(id) {
  await dbConnect();
  const product = await Product.findById(id).lean();

  if (!product) return null;

  return JSON.parse(JSON.stringify(product));
}

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        Product not found or deleted.
      </div>
    );
  }

  return <ProductForm initialData={product} isEdit={true} />;
}
