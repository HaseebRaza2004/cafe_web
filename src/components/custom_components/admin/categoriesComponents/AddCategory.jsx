"use client";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddCategory({ newCatName, setNewCatName, onAdd, isAdding }) {
    return (
        <div className="bg-black/40 border border-white/10 p-4 rounded-xl mb-8 flex flex-col md:flex-row gap-4 backdrop-blur-md">
            <Input
                type="text"
                placeholder="Add New Category (e.g. Pasta)"
                className="flex-1 bg-black/50 border-white/10 h-12! text-white focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && newCatName.trim() && onAdd()}
            />
            <Button
                onClick={onAdd}
                disabled={!newCatName.trim() || isAdding}
                className="w-full md:w-auto h-12 px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
            >
                {isAdding ?
                    <Loader2 className="w-5 h-5 animate-spin" />
                    : <><Plus className="w-5 h-5 mr-1" /> Add</>
                }
            </Button>
        </div>
    );
}