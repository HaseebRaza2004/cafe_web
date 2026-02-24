import dbConnect from "@/lib/db";
import Deal from "@/models/Deal";
import DealForm from "@/components/custom_components/admin/DealForm";

export async function generateMetadata({ params }) {
  return { title: `Edit Deal | Admin Panel` };
}

async function getDeal(id) {
  await dbConnect();
  const deal = await Deal.findById(id)
    .populate("itemGroups.specificProducts.product")
    .lean();
  if (!deal) return null;
  return JSON.parse(JSON.stringify(deal));
}

export default async function EditDealPage({ params }) {
  const { id } = await params; 
  const deal = await getDeal(id);

  if (!deal) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        Deal not found or deleted.
      </div>
    );
  }

  return <DealForm initialData={deal} isEdit={true} />;
}
