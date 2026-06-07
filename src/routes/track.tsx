import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/track")({
  head: () => ({ meta: [{ title: "تتبع الطلب — Haskell Store" }] }),
  component: TrackPage,
});

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: "قيد المراجعة", color: "bg-gold/15 text-gold-foreground" },
  confirmed: { label: "تم التأكيد", color: "bg-emerald/15 text-emerald" },
  shipped: { label: "تم الشحن", color: "bg-emerald text-emerald-foreground" },
  delivered: { label: "تم التوصيل ✓", color: "bg-success/20 text-success" },
  cancelled: { label: "ملغي", color: "bg-destructive/20 text-destructive" },
};

function TrackPage() {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!phone) return;
    setLoading(true);
    // Public can't read orders. Use RPC fallback: this needs admin. For now, no public order tracking by phone available.
    // Instead, we ask user to contact us — or we can add a security definer function later.
    setLoading(false);
    toast.info("اتصل بينا على الرقم المُسجل للاستعلام عن طلبك");
    setResult([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-md px-4 py-8">
        <h1 className="font-display text-3xl font-bold">تتبع الطلب</h1>
        <p className="mt-2 text-sm text-muted-foreground">ادخل رقم تليفونك اللي طلبت بيه</p>
        <div className="mt-5 flex gap-2">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01xxxxxxxxx"
            className="flex-1 rounded-full border border-input bg-card px-4 py-3 text-sm"
          />
          <button
            onClick={search}
            disabled={loading}
            className="rounded-full bg-emerald px-6 py-3 text-sm font-bold text-emerald-foreground"
          >
            دور
          </button>
        </div>
        {result && result.length === 0 && (
          <div className="mt-8 rounded-2xl bg-card p-5 text-center text-sm text-muted-foreground shadow-soft">
            للاستعلام عن طلبك، تواصل معانا على واتساب أو اتصل بنا 📞
          </div>
        )}
      </div>
    </div>
  );
}
