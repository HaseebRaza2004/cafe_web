"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function DealBasicInfo({ formData, setFormData }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md space-y-6">
            <h3 className="text-(--color-gold) font-bold uppercase text-xs tracking-wider mb-4">
                Deal Info
            </h3>

            <div className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                    <Label className="text-gray-400">Deal Title <span className="text-red-500">*</span></Label>
                    <Input
                        name="title"
                        placeholder="e.g. Family Feast"
                        value={formData.title}
                        onChange={handleChange}
                        className="bg-black/50 border-white/10 h-12! text-base focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold)"
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label className="text-gray-400">Description</Label>
                    <Textarea
                        name="desc"
                        placeholder="Describe what's inside..."
                        rows={3}
                        value={formData.desc}
                        onChange={handleChange}
                        className="bg-black/50 border-white/10 focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold) resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Price */}
                    <div className="space-y-2">
                        <Label className="text-gray-400">Price <span className="text-red-500">*</span></Label>
                        <Input
                            type="number"
                            name="price"
                            placeholder="0"
                            value={formData.price}
                            onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                            className="bg-black/50 border-white/10 h-12! text-base focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold)"
                        />
                    </div>

                    {/* Sort Order */}
                    <div className="space-y-2">
                        <Label className="text-gray-400">Sort Order</Label>
                        <Input
                            type="number"
                            name="sortOrder"
                            placeholder="0"
                            value={formData.sortOrder}
                            onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))}
                            className="bg-black/50 border-white/10 h-12! text-base focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold)"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}