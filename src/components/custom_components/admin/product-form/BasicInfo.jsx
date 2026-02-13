"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function BasicInfo({ formData, setFormData, categories }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md space-y-6">
            <h3 className="text-(--color-gold) font-bold uppercase text-xs tracking-wider mb-4">
                Basic Details
            </h3>

            <div className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                    <Label className="text-gray-400">
                        Product Title
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        name="title"
                        placeholder="e.g. Zinger Burger"
                        value={formData.title}
                        onChange={handleChange}
                        className="bg-black/50 border-white/10 h-12 text-base focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold)"
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label className="text-gray-400">Description</Label>
                    <Textarea
                        name="desc"
                        placeholder="Describe the taste..."
                        rows={3}
                        value={formData.desc}
                        onChange={handleChange}
                        className="bg-black/50 border-white/10 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Price */}
                    <div className="space-y-2">
                        <Label className="text-gray-400">
                            Base Price
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="number"
                            name="price"
                            placeholder="0"
                            value={formData.price}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))
                            }
                            className="bg-black/50 border-white/10 h-12 text-base focus-visible:ring-(--color-gold) focus-visible:ring-offset-0"
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label className="text-gray-400">Category <span className="text-red-500">*</span></Label>
                        <Select
                            value={formData.category}
                            onValueChange={(val) =>
                                setFormData((prev) => ({ ...prev, category: val }))
                            }
                        >
                            <SelectTrigger
                                className="w-full h-12! bg-black/50 border-white/10 text-white text-base focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold)">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="bg-black border border-white/10 text-white z-9999">
                                {categories.map((cat) => (
                                    <SelectItem
                                        key={cat._id}
                                        value={cat.name}
                                        className="focus:bg-(--color-gold) focus:text-black cursor-pointer"
                                    >
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                    <Label className="text-gray-400">Sort Priority (1 = Top)</Label>
                    <Input
                        type="number"
                        name="sortOrder"
                        value={formData.sortOrder}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                sortOrder: Number(e.target.value),
                            }))
                        }
                        className="bg-black/50 border-white/10 h-12 text-base focus-visible:ring-(--color-gold) focus-visible:ring-offset-0"
                    />
                </div>
            </div>
        </div >
    );
}