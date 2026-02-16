import dbConnect from "@/lib/db";
import OptionGroup from "@/models/OptionGroup";
import OptionsClient from "@/components/custom_components/admin/OptionsClient";

export const metadata = {
  title: "AddsOn Management | Admin Panel",
};

export const dynamic = "force-dynamic";

async function getOptionGroups() {
  await dbConnect();
  const groups = await OptionGroup.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(groups));
}

export default async function OptionsPage() {
  const optionGroups = await getOptionGroups();
  return <OptionsClient initialGroups={optionGroups} />;
};