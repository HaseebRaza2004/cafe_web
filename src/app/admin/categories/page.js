
//       {/* Add New Section */}
//       <div className="bg-black/40 border border-white/10 p-4 rounded-xl mb-8 flex gap-4 backdrop-blur-md">
//         <input
//           type="text"
//           placeholder="New Category Name (e.g. Pasta)"
//           className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-(--color-gold) outline-none"
//           value={newCatName}
//           onChange={(e) => setNewCatName(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleAdd()}
//         />
//         <button
//           onClick={handleAdd}
//           className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
//         >
//           <Plus className="w-5 h-5" /> Add
//         </button>
//       </div>

//       {/* Categories List */}
//       <div className="space-y-3">
//         {categories.map((cat, index) => (
//           <div
//             key={cat._id}
//             className="group bg-black/40 border border-white/10 p-4 rounded-xl flex items-center justify-between hover:border-gold/30 transition-all"
//           >
//             <div className="flex items-center gap-4 flex-1">
//               <span className="text-gray-500 font-mono text-sm w-6">
//                 #{index + 1}
//               </span>

//               {editingId === cat._id ? (
//                 <div className="flex items-center gap-2">
//                   <input
//                     autoFocus
//                     className="bg-black/80 border border-(--color-gold) text-white px-2 py-1 rounded text-sm outline-none"
//                     value={editName}
//                     onChange={(e) => setEditName(e.target.value)}
//                   />
//                   <button
//                     onClick={() => saveRename(cat._id)}
//                     className="text-green-400 hover:text-green-300"
//                   >
//                     <Check className="w-4 h-4" />
//                   </button>
//                 </div>
//               ) : (
//                 <h3 className="text-white font-bold text-lg">{cat.name}</h3>
//               )}
//             </div>

//             <div className="flex items-center gap-2">
//               {/* Edit Button */}
//               {editingId !== cat._id && (
//                 <button
//                   onClick={() => startEditing(cat)}
//                   className="p-2 text-gray-400 hover:text-white transition-colors"
//                 >
//                   <Edit2 className="w-4 h-4" />
//                 </button>
//               )}

//               {/* Sort Buttons */}
//               <div className="flex flex-col gap-1 mr-2">
//                 <button
//                   onClick={() => move(index, -1)}
//                   disabled={index === 0}
//                   className="p-1 text-gray-500 hover:text-(--color-gold) disabled:opacity-30 transition-colors"
//                 >
//                   <ArrowUp className="w-4 h-4" />
//                 </button>
//                 <button
//                   onClick={() => move(index, 1)}
//                   disabled={index === categories.length - 1}
//                   className="p-1 text-gray-500 hover:text-(--color-gold) disabled:opacity-30 transition-colors"
//                 >
//                   <ArrowDown className="w-4 h-4" />
//                 </button>
//               </div>

//               {/* Delete */}
//               <button
//                 onClick={() => handleDelete(cat._id)}
//                 className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
//               >
//                 <Trash2 className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import CategoriesHeader from "@/components/custom_components/admin/categoriesComponents/CategoriesHeader";
import AddCategory from "@/components/custom_components/admin/categoriesComponents/AddCategory";
import CategoryItem from "@/components/custom_components/admin/categoriesComponents/CategoryItem";

export default function CategoriesPage() {
  const { success, error: showError } = useToast() || {};
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // Fetch Categories
  useEffect(() => {
    let isMounted = true;
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const json = await res.json();
        if (isMounted && json.success) setCategories(json.data);
      } catch (err) {
        if (isMounted && showError) showError("Failed to load categories");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, [showError]);

  // Add Category
  const handleAdd = async () => {
    if (!newCatName.trim()) return;
    setIsAdding(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName }),
      });
      const json = await res.json();
      if (json.success) {
        setCategories([...categories, json.data]);
        setNewCatName("");
        if (success) success("Category Added Successfully");
      }
    } catch (err) {
      if (showError) showError("Failed to add category");
    } finally {
      setIsAdding(false);
    }
  };

  // Delete Category
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories(categories.filter((c) => c._id !== id));
        if (success) success("Category Deleted");
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      if (showError) showError("Failed to delete");
    }
  };

  // Rename Category
  const saveRename = async (id, newName) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (res.ok) {
        setCategories(
          categories.map((c) => (c._id === id ? { ...c, name: newName } : c)),
        );
        if (success) success("Renamed Successfully");
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      if (showError) showError("Failed to rename");
    }
  };

  // Move / Reorder Logic (Frontend)
  const moveCategory = (index, direction) => {
    const newCats = [...categories];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newCats.length) return;

    // Swap items
    [newCats[index], newCats[targetIndex]] = [
      newCats[targetIndex],
      newCats[index],
    ];

    // Update sortOrder mapping
    const reordered = newCats.map((cat, idx) => ({
      ...cat,
      sortOrder: idx + 1,
    }));
    setCategories(reordered);
  };

  // Save Order to DB
  const saveOrder = async () => {
    setIsSavingOrder(true);
    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories }),
      });
      if (res.ok) {
        if (success) success("Order Saved Successfully");
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      if (showError) showError("Failed to save order");
    } finally {
      setIsSavingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-(--color-gold) animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500 pb-20 p-4 sm:p-6">
      <CategoriesHeader onSaveOrder={saveOrder} isSavingOrder={isSavingOrder} />

      <AddCategory
        newCatName={newCatName}
        setNewCatName={setNewCatName}
        onAdd={handleAdd}
        isAdding={isAdding}
      />

      {/* Categories List */}
      <div className="space-y-3">
        {categories.map((cat, index) => (
          <CategoryItem
            key={cat._id}
            cat={cat}
            index={index}
            total={categories.length}
            onMove={moveCategory}
            onRename={saveRename}
            onDelete={handleDelete}
          />
        ))}
        {categories.length === 0 && (
          <div className="text-center text-gray-500 py-10 bg-white/5 rounded-xl border border-white/10">
            No categories found. Add one above.
          </div>
        )}
      </div>
    </div>
  );
}
