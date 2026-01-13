"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadCloud, Loader2, ArrowLeft, CheckCircle } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Data States
  const [optionGroups, setOptionGroups] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    price: "",
    discountPrice: "",
    category: "Burger", // Default
    image: "",
    allowedOptions: [], // Selected Option Groups IDs
  });

  // 1. Fetch Option Groups on Load
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

  // 2. Image Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();

      if (result.success) {
        setFormData({ ...formData, image: result.url });
      }
    } catch (err) {
      alert("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  // 3. Form Submit Handler
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
        router.push("/admin/products"); // Redirect to List
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

  // Toggle Selection for Option Groups
  const toggleOptionGroup = (id) => {
    const current = formData.allowedOptions;
    if (current.includes(id)) {
      setFormData({
        ...formData,
        allowedOptions: current.filter((i) => i !== id),
      });
    } else {
      setFormData({ ...formData, allowedOptions: [...current, id] });
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back Button */}
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
        {/* Left Column: Image & Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Basic Details */}
          <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
            <h3 className="text-(--color-gold) font-bold mb-4 uppercase tracking-wider text-sm">
              Basic Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  Product Title
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Zinger Burger"
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Describe the taste and ingredients..."
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none resize-none"
                  value={formData.desc}
                  onChange={(e) =>
                    setFormData({ ...formData, desc: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Price (Rs)
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="500"
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Sale Price (Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="450"
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--color-gold) outline-none"
                    value={formData.discountPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountPrice: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  Category
                </label>
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

          {/* Card 2: Customization & Addons (Dynamic Logic) */}
          <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
            <h3 className="text-(--color-gold) font-bold mb-4 uppercase tracking-wider text-sm">
              Customization & Deals Logic
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Select which Option Groups (Addons/Flavors) are allowed with this
              item.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {optionGroups.length > 0 ? (
                optionGroups.map((group) => (
                  <div
                    key={group._id}
                    onClick={() => toggleOptionGroup(group._id)}
                    className={`
                    cursor-pointer p-3 rounded-lg border transition-all flex items-center justify-between
                    ${
                      formData.allowedOptions.includes(group._id)
                        ? "bg-(--color-gold)/10 border-(--color-gold)"
                        : "bg-black/30 border-white/5 hover:border-white/20"
                    }
                  `}
                  >
                    <span
                      className={`text-sm font-medium ${
                        formData.allowedOptions.includes(group._id)
                          ? "text-(--color-gold)"
                          : "text-gray-300"
                      }`}
                    >
                      {group.name}
                    </span>
                    {formData.allowedOptions.includes(group._id) && (
                      <CheckCircle className="w-4 h-4 text-(--color-gold)" />
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm col-span-2">
                  No Option Groups found. Please create them via API first.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Image Upload & Submit */}
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
            className="w-full bg-(--color-gold) text-black font-bold py-4 rounded-xl hover:bg-[#b89445] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-(--color-gold)/10 flex items-center justify-center gap-2"
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
