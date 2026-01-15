import Link from "next/link";
import { Plus, Edit, Trash2, Layers } from "lucide-react";
import dbConnect from "@/lib/db";
import OptionGroup from "@/models/OptionGroup";

export const metadata = { title: "Addons & Options | Admin Panel" };

async function getOptionGroups() {
  await dbConnect();
  return await OptionGroup.find({}).sort({ createdAt: -1 }).lean();
}

export default async function OptionsPage() {
  const groups = await getOptionGroups();

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Add-ons & Options
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage variations like &apos;Flavors&apos;, &apos;Drinks&apos;,
            &apos;Toppings&apos;
          </p>
        </div>
        <Link
          href="/admin/options/add"
          className="bg-(--color-gold) text-black px-6 py-3 rounded-xl font-bold hover:bg-[#d4af66] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(197,160,89,0.3)]"
        >
          <Plus className="w-5 h-5" /> Create Group
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div
            key={group._id}
            className="bg-black/40 border border-white/10 rounded-xl p-5 hover:border-gold/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-(--color-gold)">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{group.name}</h3>
                  <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                    {group.type} Select
                  </span>
                </div>
              </div>
            </div>

            {/* Options Preview Pills */}
            <div className="flex flex-wrap gap-2 mb-6 h-16 overflow-hidden content-start">
              {group.options.slice(0, 5).map((opt, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 border border-white/5"
                >
                  {opt.name}
                </span>
              ))}
              {group.options.length > 5 && (
                <span className="text-xs text-gray-500 py-1">
                  +{group.options.length - 5} more
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-white/10">
              <Link
                href={`/admin/options/${group._id}`}
                className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-sm font-medium text-gray-300 flex items-center justify-center gap-2 transition-colors"
              >
                <Edit className="w-4 h-4" /> Edit
              </Link>
              {/* Note: Delete logic will be inside Edit page or separate client component */}
              <button
                className="flex-1 bg-red-500/10 hover:bg-red-500/20 py-2 rounded-lg text-sm font-medium text-red-500 flex items-center justify-center gap-2 transition-colors opacity-50 cursor-not-allowed"
                title="Delete from Edit Page"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {groups.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-500">
            No option groups found. Create one to start.
          </div>
        )}
      </div>
    </div>
  );
}
