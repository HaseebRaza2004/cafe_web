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
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500 pb-20">
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
};