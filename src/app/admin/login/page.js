"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

// SEO Metadata (Client component mein manual title manage karte hain ya layout mein)
// Best practice: Layout mein metadata hota hai, par yahan hum UI focus kar rahe hain.

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login Failed");

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Outer Container: Full Screen, Centered Content
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white p-4 relative overflow-hidden">
      {/* Background Effects (Optimized CSS) */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-neutral-900 via-black to-black opacity-80" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-(--color-gold) opacity-5 blur-[80px] rounded-full pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#111] border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl relative z-10 backdrop-blur-xl">
        {/* Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4 border border-gold/20">
            <ShieldCheck className="w-6 h-6 text-(--color-gold)" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-(--color-gold) font-display tracking-wider">
            ADMIN PANEL
          </h1>
          <p className="text-gray-400 text-xs md:text-sm mt-2">
            Authorized Personnel Only
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-xs md:text-sm rounded-lg text-center animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] md:text-xs uppercase tracking-widest text-gray-500 mb-1.5 font-bold">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 md:p-3.5 text-sm text-white placeholder:text-gray-600 focus:border-(--color-gold) focus:ring-1 focus:ring-(--color-gold) outline-none transition-all"
              placeholder="admin@cafe.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[10px] md:text-xs uppercase tracking-widest text-gray-500 mb-1.5 font-bold">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 md:p-3.5 text-sm text-white placeholder:text-gray-600 focus:border-(--color-gold) focus:ring-1 focus:ring-(--color-gold) outline-none transition-all"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-(--color-gold) text-black font-bold py-3.5 rounded-lg hover:bg-[#b89445] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm md:text-base shadow-lg shadow-(--color-gold)/10"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "SECURE LOGIN"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[10px] text-gray-600">
            Protected by secure authentication system.
          </p>
        </div>
      </div>
    </div>
  );
}
