"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  UploadCloud,
  Loader2,
  ArrowLeft,
  Plus,
  X,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Data States
  const [optionGroups, setOptionGroups] = useState([]); // Database se aye hue groups

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    price: "",
    discountPrice: "",
    category: "Burger",
    image: "",
    isAvailable: true,
    variations: [], // e.g. [{title: "Small", price: 500}]
    productOptions: [], // e.g. [{optionGroupId: "123", allowedVariations: ["Masala"]}]
  });

  // --- 1. FETCH OPTION GROUPS (Fast) ---
  useEffect(() => {
    async function fetchOptions() {
      try {
        const res = await fetch("/api/option-groups");
        const data = await res.json();
        if (data.success) setOptionGroups(data.data);
      } catch (err) {
        console.error("Failed to fetch options", err);
      }
    }
    fetchOptions();
  }, []);

  // --- 2. HANDLERS ---

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const result = await res.json();
      if (result.success) setFormData({ ...formData, image: result.url });
    } catch (err) {
      alert("Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  // Variations (Size/Qty) Handlers
  const addVariation = () => {
    setFormData({
      ...formData,
      variations: [
        ...formData.variations,
        { title: "", price: "", isAvailable: true },
      ],
    });
  };

  const updateVariation = (index, field, value) => {
    const updated = [...formData.variations];
    updated[index][field] = value;
    setFormData({ ...formData, variations: updated });
  };

  const removeVariation = (index) => {
    const updated = formData.variations.filter((_, i) => i !== index);
    setFormData({ ...formData, variations: updated });
  };

  // Smart Option Linking Handlers
  const toggleOptionGroup = (groupId) => {
    const exists = formData.productOptions.find(
      (po) => po.optionGroupId === groupId
    );

    if (exists) {
      // Agar pehle se hai to remove karo
      setFormData({
        ...formData,
        productOptions: formData.productOptions.filter(
          (po) => po.optionGroupId !== groupId
        ),
      });
    } else {
      // Add karo (Empty allowedVariations = Show ALL by default)
      setFormData({
        ...formData,
        productOptions: [
          ...formData.productOptions,
          { optionGroupId: groupId, allowedVariations: [] },
        ],
      });
    }
  };

  const toggleAllowedVariation = (groupId, variationName) => {
    const updatedOptions = formData.productOptions.map((po) => {
      if (po.optionGroupId === groupId) {
        const currentAllowed = po.allowedVariations || [];
        // Agar naam list mein hai to hatao, nahi hai to add karo
        const newAllowed = currentAllowed.includes(variationName)
          ? currentAllowed.filter((v) => v !== variationName)
          : [...currentAllowed, variationName];

        return { ...po, allowedVariations: newAllowed };
      }
      return po;
    });
    setFormData({ ...formData, productOptions: updatedOptions });
  };

  // Final Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        alert("Failed to create product");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={() => router.back()}
        className="text-gray-400 hover:text-white flex items-center gap-2 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Menu
      </button>

      <h1 className="text-3xl font-bold text-white mb-8">Add New Item</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* --- LEFT COLUMN (Details & Variations) --- */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Basic Info */}
          <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
            <h3 className="text-(--color-gold) font-bold mb-4 uppercase tracking-wider text-sm">
              Product Details
            </h3>
            <div className="space-y-4">
              <input
                required
                type="text"
                placeholder="Product Title (e.g. Zinger Burger)"
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <textarea
                required
                rows="3"
                placeholder="Description..."
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none resize-none"
                value={formData.desc}
                onChange={(e) =>
                  setFormData({ ...formData, desc: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  type="number"
                  placeholder="Base Price (Rs)"
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                />
                <select
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="Burger">Burger</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Deals">Deals</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Appetizers">Appetizers</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Variations (Sizes/Qty) */}
          <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-(--color-gold) font-bold uppercase tracking-wider text-sm">
                Variations (Sizes)
              </h3>
              <button
                type="button"
                onClick={addVariation}
                className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Size
              </button>
            </div>

            {formData.variations.length === 0 && (
              <p className="text-gray-500 text-sm italic">
                No variations added. Using Base Price.
              </p>
            )}

            <div className="space-y-3">
              {formData.variations.map((variant, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-center animate-in slide-in-from-left-2"
                >
                  <input
                    type="text"
                    placeholder="Size (e.g. Large)"
                    className="flex-1 bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-(--color-gold) outline-none"
                    value={variant.title}
                    onChange={(e) =>
                      updateVariation(index, "title", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    className="w-24 bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-(--color-gold) outline-none"
                    value={variant.price}
                    onChange={(e) =>
                      updateVariation(index, "price", Number(e.target.value))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeVariation(index)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Smart Option Linking (The Logic Fix) */}
          <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
            <h3 className="text-(--color-gold) font-bold mb-4 uppercase tracking-wider text-sm">
              Linked Options (Add-ons)
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Select Option Groups to attach. Click arrow to filter specific
              flavors.
            </p>

            <div className="space-y-2">
              {optionGroups.map((group) => {
                const isSelected = formData.productOptions.find(
                  (po) => po.optionGroupId === group._id
                );

                return (
                  <div
                    key={group._id}
                    className={`border rounded-xl transition-all ${
                      isSelected
                        ? "border-gold/50 bg-gold/5"
                        : "border-white/5 bg-black/30"
                    }`}
                  >
                    {/* Header: Select Group */}
                    <div
                      className="p-3 flex items-center justify-between cursor-pointer"
                      onClick={() => toggleOptionGroup(group._id)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center ${
                            isSelected
                              ? "bg-(--color-gold) border-(--color-gold)"
                              : "border-gray-500"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-black" />
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            isSelected ? "text-white" : "text-gray-400"
                          }`}
                        >
                          {group.name}
                        </span>
                      </div>
                      {isSelected && (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>

                    {/* Body: Filter Specific Flavors (Only show if Group is selected) */}
                    {isSelected && (
                      <div className="p-3 pt-0 ml-8 border-l border-white/10 pl-4 space-y-2">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">
                          Filter Options (Uncheck to Hide)
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {group.options.map((opt, idx) => {
                            const currentConfig = formData.productOptions.find(
                              (po) => po.optionGroupId === group._id
                            );
                            // Logic: Agar array empty hai = Show ALL. Agar array mein naam hai = Show ONLY that.
                            // Lekin UI simplify karne ke liye hum ulta logic use kar rahe hain: Tick = "Show"
                            // Backend bhejne ke liye hum "allowedVariations" construct karenge.

                            // Check logic: Agar allowedVariations empty hai -> Sab allowed hain -> Tick True
                            // Agar allowedVariations mein ye naam hai -> Tick True
                            const isAllowed =
                              currentConfig.allowedVariations.length === 0 ||
                              currentConfig.allowedVariations.includes(
                                opt.name
                              );

                            return (
                              <label
                                key={idx}
                                className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded"
                              >
                                <input
                                  type="checkbox"
                                  className="accent-(--color-gold)"
                                  checked={isAllowed}
                                  onChange={() => {
                                    // Logic: Pehli baar uncheck karne par humein baaki sab ko "add" karna parega array mein, sivaye iske.
                                    // Ye thora complex hai, isliye hum simple "Toggle" function call karenge

                                    // Simplified Logic for UI:
                                    // Agar allowedVariations empty hai, to iska matlab "ALL SELECTED".
                                    // Jab user 1 uncheck kare, to humein "ALL EXCEPT THIS 1" array mein daalna hoga.

                                    let newAllowed = [];
                                    if (
                                      currentConfig.allowedVariations.length ===
                                      0
                                    ) {
                                      // Pehle sab ko daalo sivaye current ke
                                      newAllowed = group.options
                                        .filter((o) => o.name !== opt.name)
                                        .map((o) => o.name);
                                    } else {
                                      // Normal toggle
                                      if (
                                        currentConfig.allowedVariations.includes(
                                          opt.name
                                        )
                                      ) {
                                        newAllowed =
                                          currentConfig.allowedVariations.filter(
                                            (n) => n !== opt.name
                                          );
                                      } else {
                                        newAllowed = [
                                          ...currentConfig.allowedVariations,
                                          opt.name,
                                        ];
                                      }
                                    }

                                    // State update
                                    const updated = formData.productOptions.map(
                                      (po) => {
                                        if (po.optionGroupId === group._id)
                                          return {
                                            ...po,
                                            allowedVariations: newAllowed,
                                          };
                                        return po;
                                      }
                                    );
                                    setFormData({
                                      ...formData,
                                      productOptions: updated,
                                    });
                                  }}
                                />
                                <span className="text-xs text-gray-300">
                                  {opt.name ||
                                    opt.linkedProduct?.title ||
                                    "Option"}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN (Image & Submit) --- */}
        <div className="space-y-6">
          <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
            <h3 className="text-(--color-gold) font-bold mb-4 uppercase tracking-wider text-sm">
              Product Image
            </h3>
            <div className="w-full aspect-square bg-black/50 border-2 border-dashed border-white/10 rounded-xl overflow-hidden relative flex flex-col items-center justify-center hover:border-gold/50 transition-colors group">
              {formData.image ? (
                <Image
                  src={formData.image}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-gray-600 group-hover:text-(--color-gold) transition-colors mb-2" />
                  <span className="text-xs text-gray-500">Click to upload</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-(--color-gold) animate-spin" />
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-(--color-gold) text-black font-bold py-4 rounded-xl hover:bg-[#b89445] transition-all transform hover:scale-[1.02] shadow-lg shadow-(--color-gold)/10 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "PUBLISH PRODUCT"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
