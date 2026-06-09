import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ArrowRight, Save, Plus, Trash2, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { updateGlobalRelated, updateProductExtras, updatePixelId } from "@/lib/admin-settings.functions";

type Tier = { qty: number; discount: number };
type ProductRow = {
  id: string;
  name: string;
  slug: string;
  show_related: boolean | null;
  quantity_pricing: Tier[] | null;
};

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [
    { title: "إعدادات المتجر — Haskell Admin" },
    { name: "robots", content: "noindex,nofollow" },
  ] }),
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const navigate = useNavigate();
  const [globalRelated, setGlobalRelated] = useState(true);
  const [pixelId, setPixelId] = useState("");
  const [savingPixel, setSavingPixel] = useState(false);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savingGlobal, setSavingGlobal] = useState(false);

  const updateGlobalFn = useServerFn(updateGlobalRelated);
  const updateExtrasFn = useServerFn(updateProductExtras);
  const updatePixelFn = useServerFn(updatePixelId);
  const getPwd = () => sessionStorage.getItem("haskell_admin_pwd") ?? "";

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("haskell_admin") !== "1") {
      navigate({ to: "/admin" });
      return;
    }
    (async () => {
      const [s, p] = await Promise.all([
        supabase.from("app_settings").select("show_related_global,facebook_pixel_id").limit(1).maybeSingle(),
        supabase.from("products").select("id,name,slug,show_related,quantity_pricing").order("created_at", { ascending: false }),
      ]);
      const sd = s.data as { show_related_global?: boolean; facebook_pixel_id?: string | null } | null;
      setGlobalRelated(sd?.show_related_global !== false);
      setPixelId(sd?.facebook_pixel_id ?? "");
      setProducts(((p.data ?? []) as ProductRow[]).map((r) => ({
        ...r,
        quantity_pricing: Array.isArray(r.quantity_pricing) ? r.quantity_pricing : [],
      })));
      setLoading(false);
    })();
  }, [navigate]);

  const saveGlobal = async (next: boolean) => {
    setSavingGlobal(true);
    setGlobalRelated(next);
    try {
      await updateGlobalFn({ data: { password: getPwd(), show_related_global: next } });
      toast.success("تم الحفظ ✨");
    } catch {
      toast.error("فشل الحفظ");
      setGlobalRelated(!next);
    }
    setSavingGlobal(false);
  };

  const savePixel = async () => {
    const cleaned = pixelId.replace(/\D/g, "");
    setSavingPixel(true);
    try {
      await updatePixelFn({ data: { password: getPwd(), facebook_pixel_id: cleaned } });
      setPixelId(cleaned);
      toast.success(cleaned ? "تم حفظ Pixel ID ✨" : "تم مسح Pixel ID");
    } catch {
      toast.error("فشل الحفظ — تأكد إن الـ ID أرقام فقط");
    }
    setSavingPixel(false);
  };

  const patchProduct = (id: string, patch: Partial<ProductRow>) =>
    setProducts((arr) => arr.map((x) => x.id === id ? { ...x, ...patch } : x));

  const addTier = (id: string) =>
    setProducts((arr) => arr.map((x) => x.id === id
      ? { ...x, quantity_pricing: [...(x.quantity_pricing ?? []), { qty: 2, discount: 10 }] }
      : x));

  const removeTier = (id: string, i: number) =>
    setProducts((arr) => arr.map((x) => x.id === id
      ? { ...x, quantity_pricing: (x.quantity_pricing ?? []).filter((_, idx) => idx !== i) }
      : x));

  const updateTier = (id: string, i: number, patch: Partial<Tier>) =>
    setProducts((arr) => arr.map((x) => x.id === id
      ? { ...x, quantity_pricing: (x.quantity_pricing ?? []).map((t, idx) => idx === i ? { ...t, ...patch } : t) }
      : x));

  const saveProduct = async (p: ProductRow) => {
    setSavingId(p.id);
    try {
      const tiers = (p.quantity_pricing ?? []).filter((t) => t.qty >= 2 && t.discount > 0);
      await updateExtrasFn({ data: {
        password: getPwd(),
        product_id: p.id,
        show_related: p.show_related,
        quantity_pricing: tiers,
      } });
      toast.success("تم الحفظ ✨");
    } catch {
      toast.error("فشل الحفظ");
    }
    setSavingId(null);
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <Header />
      <div className="mx-auto max-w-5xl px-4 py-6">
        <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowRight className="size-3 rotate-180" /> رجوع
        </Link>

        <h1 className="mt-3 font-display text-3xl font-bold">إعدادات المتجر</h1>

        {/* Global */}
        <div className="mt-6 rounded-2xl bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-bold">إظهار المنتجات المشابهة (عام)</p>
              <p className="mt-1 text-xs text-muted-foreground">
                التحكم العام في قسم "يمكن يعجبك كمان" في كل صفحات المنتجات.
              </p>
            </div>
            <button
              onClick={() => saveGlobal(!globalRelated)}
              disabled={savingGlobal}
              className={`relative h-7 w-14 shrink-0 rounded-full transition ${globalRelated ? "bg-emerald" : "bg-muted"}`}
            >
              <span className={`absolute top-1 size-5 rounded-full bg-background shadow transition-all ${globalRelated ? "left-1" : "left-8"}`} />
            </button>
          </div>
        </div>

        {/* Per-product */}
        <div className="mt-6">
          <h2 className="font-display text-xl font-bold">إعدادات لكل منتج</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            عروض الكمية (Quantity break) + استثناء "المنتجات المشابهة" لكل منتج.
          </p>

          {loading ? (
            <p className="mt-8 text-center text-sm text-muted-foreground">جاري التحميل...</p>
          ) : (
            <div className="mt-4 space-y-3">
              {products.map((p) => (
                <div key={p.id} className="rounded-2xl bg-card p-4 shadow-soft">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="line-clamp-1 font-bold">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">/{p.slug}</p>
                    </div>
                    <button
                      onClick={() => saveProduct(p)}
                      disabled={savingId === p.id}
                      className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-xs font-bold text-gold-foreground disabled:opacity-50"
                    >
                      {savingId === p.id ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                      حفظ
                    </button>
                  </div>

                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    {/* show_related override */}
                    <div>
                      <p className="mb-1.5 text-xs font-bold">المنتجات المشابهة</p>
                      <select
                        value={p.show_related === null ? "default" : p.show_related ? "on" : "off"}
                        onChange={(e) => {
                          const v = e.target.value;
                          patchProduct(p.id, { show_related: v === "default" ? null : v === "on" });
                        }}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="default">حسب الإعداد العام</option>
                        <option value="on">إظهار دائماً</option>
                        <option value="off">إخفاء دائماً</option>
                      </select>
                    </div>

                    {/* tiers */}
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <p className="text-xs font-bold">عروض الكمية</p>
                        <button onClick={() => addTier(p.id)} className="flex items-center gap-1 text-[11px] font-bold text-emerald">
                          <Plus className="size-3" /> إضافة
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        {(p.quantity_pricing ?? []).length === 0 && (
                          <p className="text-[11px] text-muted-foreground">لا توجد عروض كمية</p>
                        )}
                        {(p.quantity_pricing ?? []).map((t, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className="text-[11px] text-muted-foreground">عند شراء</span>
                            <input
                              type="number" min={2} value={t.qty}
                              onChange={(e) => updateTier(p.id, i, { qty: Number(e.target.value) })}
                              className="w-14 rounded-lg border border-input bg-background px-2 py-1 text-sm"
                            />
                            <span className="text-[11px] text-muted-foreground">قطعة، خصم</span>
                            <input
                              type="number" min={1} max={95} value={t.discount}
                              onChange={(e) => updateTier(p.id, i, { discount: Number(e.target.value) })}
                              className="w-14 rounded-lg border border-input bg-background px-2 py-1 text-sm"
                            />
                            <span className="text-[11px] text-muted-foreground">%</span>
                            <button
                              onClick={() => removeTier(p.id, i)}
                              className="ms-auto grid size-7 place-items-center rounded-lg bg-destructive/10 text-destructive"
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
