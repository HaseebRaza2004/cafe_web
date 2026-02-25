"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function OptionBasicInfo({ formData, setFormData }) {
    return (
        <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md space-y-6">
            <h3 className="text-(--color-gold) font-bold uppercase text-xs tracking-wider mb-4">
                Group Details
            </h3>

            {/* Grid: 1 Col on SM/MD, 2 Cols on LG */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Group Name */}
                <div className="space-y-2">
                    <Label className="text-gray-400">Group Name <span className="text-red-500">*</span></Label>
                    <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Choose Flavor"
                        className="bg-black/50 border-white/10 h-12! text-base focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold)"
                    />
                </div>

                {/* Selection Type */}
                <div className="space-y-2">
                    <Label className="text-gray-400">Selection Type</Label>
                    <Select
                        value={formData.type}
                        onValueChange={(val) => setFormData({ ...formData, type: val })}
                    >
                        <SelectTrigger className="w-full h-12! bg-black/50 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold) cursor-pointer">
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/10 text-white z-9999">
                            <SelectItem value="single" className="focus:bg-(--color-gold) focus:text-black cursor-pointer">
                                Single Select (Radio)
                            </SelectItem>
                            <SelectItem value="multiple" className="focus:bg-(--color-gold) focus:text-black cursor-pointer">
                                Multi Select (Checkbox)
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}