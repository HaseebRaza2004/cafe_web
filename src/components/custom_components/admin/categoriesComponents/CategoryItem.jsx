"use client";
import { useState } from "react";
import { Trash2, ArrowUp, ArrowDown, Edit2, Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ConfirmModal from "@/components/custom_components/ConfirmModal";

export default function CategoryItem({ cat, index, total, onMove, onRename, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(cat.name);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Edit Handlers
    const openEdit = () => {
        setEditName(cat.name);
        setIsEditing(true);
    };
    const closeEdit = () => setIsEditing(false);

    const confirmEdit = async () => {
        if (editName.trim() === cat.name || !editName.trim()) {
            closeEdit();
            return;
        }
        setIsUpdating(true);
        await onRename(cat._id, editName);
        setIsUpdating(false);
        closeEdit();
    };

    return (
        <>
            <div className="group bg-black/40 border border-white/10 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-gold/30 transition-all">

                {/* Left Side: Index & Name/Input */}
                <div className="flex items-center gap-3 flex-1 w-full min-w-0">
                    <span className="text-gray-500 font-mono text-sm w-6 shrink-0">
                        #{index + 1}
                    </span>

                    {isEditing ? (
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Input
                                autoFocus
                                className="bg-black/80 border-(--color-gold) text-white h-9 text-sm focus-visible:ring-1 focus-visible:ring-(--color-gold) w-full min-w-0"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                            {isUpdating ? (
                                <Loader2 className="w-5 h-5 text-(--color-gold) animate-spin shrink-0" />
                            ) : (
                                <>
                                    <button onClick={() => setIsEditModalOpen(true)} className="text-green-400 hover:text-green-300 p-1 cursor-pointer shrink-0">
                                        <Check className="w-5 h-5" />
                                    </button>
                                    <button onClick={closeEdit} className="text-red-400 hover:text-red-300 p-1 cursor-pointer shrink-0">
                                        <X className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <h3 className="text-white font-bold text-lg truncate min-w-0">{cat.name}</h3>
                    )}
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center justify-end w-full sm:w-auto gap-1 sm:gap-2">
                    {!isEditing && (
                        <Button variant="ghost" size="icon" onClick={openEdit} className="text-gray-400 hover:text-white shrink-0">
                            <Edit2 className="w-4 h-4" />
                        </Button>
                    )}

                    <div className="flex flex-row sm:flex-col gap-1 mx-2">
                        <Button variant="ghost" size="icon" onClick={() => onMove(index, -1)} disabled={index === 0} className="h-6 w-6 text-gray-500 hover:text-(--color-gold) disabled:opacity-30 shrink-0">
                            <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onMove(index, 1)} disabled={index === total - 1} className="h-6 w-6 text-gray-500 hover:text-(--color-gold) disabled:opacity-30 shrink-0">
                            <ArrowDown className="w-4 h-4" />
                        </Button>
                    </div>

                    <Button variant="ghost" size="icon" onClick={() => setIsDeleteModalOpen(true)} className="text-red-500/50 hover:text-red-500 hover:bg-red-500/10 shrink-0">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Edit Modal */}
            <ConfirmModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onConfirm={confirmEdit}
                title="Update Category Name?"
                description={`Change category name to "${editName}"? This updates the menu directly.`}
                confirmText="Yes, Update"
                variant="default"
            />

            {/* Delete Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => onDelete(cat._id)}
                title="Delete Category?"
                description={`Are you sure you want to delete "${cat.name}"? This action cannot be undone.`}
                confirmText="Yes, Delete"
                variant="destructive"
            />
        </>
    );
}