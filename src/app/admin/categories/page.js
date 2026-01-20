"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Loader2,
  Edit2,
  Check,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function CategoriesPage() {
  const { success, error: showError } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState("");
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  // FIX: Moved fetchCategories inside useEffect to solve lint dependency error
  useEffect(() => {
    let isMounted = true;

    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const json = await res.json();
        if (isMounted && json.success) setCategories(json.data);
      } catch (err) {
        if (isMounted) showError("Failed to load categories");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, [showError]); // Now safe to use

  // Add Category
  const handleAdd = async () => {
    if (!newCatName.trim()) return;
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
        success("Category Added");
      }
    } catch (err) {
      showError("Failed to add");
    }
  };

  // Delete Category
  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      setCategories(categories.filter((c) => c._id !== id));
      success("Category Deleted");
    } catch (err) {
      showError("Failed to delete");
    }
  };

  // Rename Logic
  const startEditing = (cat) => {
    setEditingId(cat._id);
    setEditName(cat.name);
  };

  const saveRename = async (id) => {
    try {
      await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });
      setCategories(
        categories.map((c) => (c._id === id ? { ...c, name: editName } : c)),
      );
      setEditingId(null);
      success("Renamed Successfully");
    } catch (err) {
      showError("Failed to rename");
    }
  };

  // Reorder Logic (Frontend Only First)
  const move = (index, direction) => {
    const newCats = [...categories];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newCats.length) return;

    // Swap
    [newCats[index], newCats[targetIndex]] = [
      newCats[targetIndex],
      newCats[index],
    ];

    // Update sortOrder based on new index
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
      await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories }),
      });
      success("Order Saved Successfully");
    } catch (err) {
      showError("Failed to save order");
    } finally {
      setIsSavingOrder(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-(--color-gold) animate-spin" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Menu Categories
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage categories and their display order.
          </p>
        </div>
        <button
          onClick={saveOrder}
          disabled={isSavingOrder}
          className="bg-(--color-gold) text-black px-5 py-2 rounded-xl font-bold hover:bg-[#d4af66] flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(197,160,89,0.2)]"
        >
          {isSavingOrder ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Order
        </button>
      </div>

      {/* Add New Section */}
      <div className="bg-black/40 border border-white/10 p-4 rounded-xl mb-8 flex gap-4 backdrop-blur-md">
        <input
          type="text"
          placeholder="New Category Name (e.g. Pasta)"
          className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-(--color-gold) outline-none"
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button
          onClick={handleAdd}
          className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" /> Add
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-3">
        {categories.map((cat, index) => (
          <div
            key={cat._id}
            className="group bg-black/40 border border-white/10 p-4 rounded-xl flex items-center justify-between hover:border-gold/30 transition-all"
          >
            <div className="flex items-center gap-4 flex-1">
              <span className="text-gray-500 font-mono text-sm w-6">
                #{index + 1}
              </span>

              {editingId === cat._id ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    className="bg-black/80 border border-(--color-gold) text-white px-2 py-1 rounded text-sm outline-none"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <button
                    onClick={() => saveRename(cat._id)}
                    className="text-green-400 hover:text-green-300"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <h3 className="text-white font-bold text-lg">{cat.name}</h3>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Edit Button */}
              {editingId !== cat._id && (
                <button
                  onClick={() => startEditing(cat)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}

              {/* Sort Buttons */}
              <div className="flex flex-col gap-1 mr-2">
                <button
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="p-1 text-gray-500 hover:text-(--color-gold) disabled:opacity-30 transition-colors"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === categories.length - 1}
                  className="p-1 text-gray-500 hover:text-(--color-gold) disabled:opacity-30 transition-colors"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(cat._id)}
                className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
