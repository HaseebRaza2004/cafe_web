"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DealForm from "@/components/custom_components/admin/DealForm";
import { Loader2 } from "lucide-react";

// Main Content Wrapper (To handle useSearchParams safely)
function DealPageContent() {
  const searchParams = useSearchParams();
  const dealId = searchParams.get("id"); // URL se ID nikalo

  const [dealData, setDealData] = useState(null);
  const [loading, setLoading] = useState(!!dealId); // Agar ID hai tu loading true rkho

  useEffect(() => {
    if (!dealId) return;

    // Agar ID hai to data fetch kro (Edit Mode)
    async function fetchDeal() {
      try {
        const res = await fetch(`/api/deals/${dealId}`);
        const json = await res.json();
        if (json.success) {
          setDealData(json.data);
        } else {
          alert("Deal not found!");
        }
      } catch (err) {
        console.error("Error fetching deal:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDeal();
  }, [dealId]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-(--color-gold) animate-spin" />
      </div>
    );
  }

  // Form ko data pass kro
  return (
    <div className="container mx-auto py-10">
      <DealForm initialData={dealData} isEdit={!!dealId} />
    </div>
  );
}

// Default Export with Suspense (Required for useSearchParams in Next.js)
export default function AddDealPage() {
  return (
    <Suspense
      fallback={<div className="text-white text-center py-20">Loading...</div>}
    >
      <DealPageContent />
    </Suspense>
  );
}
