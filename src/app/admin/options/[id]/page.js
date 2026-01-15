import dbConnect from "@/lib/db";
import OptionGroup from "@/models/OptionGroup";
import OptionForm from "@/components/custom_components/admin/OptionForm";

export async function generateMetadata({ params }) {
  return { title: `Edit Options | Admin Panel` };
}

// Data Fetcher
async function getGroup(id) {
  await dbConnect();
  const group = await OptionGroup.findById(id).lean();
  if (!group) return null;
  group._id = group._id.toString();
  group.options = group.options.map((opt) => ({
    ...opt,
    _id: opt._id ? opt._id.toString() : null,
  }));
  return group;
}

export default async function EditOptionPage({ params }) {
  const { id } = await params; 
  const group = await getGroup(id);

  if (!group) {
    return <div className="text-white text-center py-20">Group Not Found</div>;
  }

  return <OptionForm initialData={group} isEdit={true} />;
}
