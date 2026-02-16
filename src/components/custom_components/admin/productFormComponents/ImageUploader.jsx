"use client";
import { useState } from "react";
import Image from "next/image";
import { UploadCloud, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";
import cloudinaryLoader from "@/lib/cloudinary-loader";

export default function ImageUploader({ image, setFormData }) {
    const [uploading, setUploading] = useState(false);
    const { error: showError } = useToast() || {};

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append("file", file);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: data });
            const result = await res.json();
            if (result.success) {
                setFormData((prev) => ({ ...prev, image: result.url }));
            } else {
                if (showError) showError("Upload failed");
            }
        } catch (err) {
            if (showError) showError("Error uploading image");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, image: "" }));
    };

    return (
        <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
            <h3 className="text-(--color-gold) font-bold uppercase text-xs tracking-wider mb-4">
                Product Image <span className="text-red-500">*</span>
            </h3>

            <div className="relative w-full aspect-square bg-black/50 border-2 border-dashed border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center group hover:border-gold/50 transition-colors">
                {image ? (
                    <>
                        <Image
                            src={image}
                            alt="Preview"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            loader={cloudinaryLoader}
                            className="object-cover transition-opacity duration-300 group-hover:opacity-80"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={removeImage}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </>
                ) : (
                    <>
                        <UploadCloud className="w-10 h-10 text-gray-600 mb-2 group-hover:text-(--color-gold) transition-colors" />
                        <span className="text-xs text-gray-500 group-hover:text-gray-300">Click to Upload</span>
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
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                        <Loader2 className="w-8 h-8 text-(--color-gold) animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
}