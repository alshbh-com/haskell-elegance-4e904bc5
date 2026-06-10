import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ArrowRight, Save, Plus, Trash2, Loader2, Power } from "lucide-react";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { updateGlobalRelated, updateProductExtras } from "@/lib/admin-settings.functions";
import {
  trackPixelEvent,
  pixelDebugEnabled,
  setPixelDebug,
  subscribePixelDebug,
  getPixelDebugLog,
  clearPixelDebugLog,
} from "@/lib/pixel-tracking";

type PixelRow = { id: string; platform: string; pixel_id: string; name: string | null; is_enabled: boolean };
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
  const [pixels, setPixels] = useState<PixelRow[]>([]);
  const [newPlatform, setNewPlatform] = useState<"facebook" | "tiktok" | "snapchat">("facebook");
  const [newPixelId, setNewPixelId] = useState("");
  const [newName, setNewName] = useState("");
  const [savingPixel, setSavingPixel] = useState(false);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savingGlobal, setSavingGlobal] = useState(false);

  const updateGlobalFn = useServerFn(updateGlobalRelated);
  const updateExtrasFn = useServerFn(updateProductExtras);
  const getPwd = () => sessionStorage.getItem("haskell_admin_pwd") ?? "";

  // Verify admin password against the DB via RPC (no service-role key needed)
  const verifyPwd = async (): Promise<boolean> => {
    const pwd = getPwd();
    if (!pwd) return false;
    const { data, error } = await supabase.rpc("verify_admin_password", { _password: pwd });
    if (error) { console.error("verify_admin_password", error); return false; }
    return data === true;
  };

  const reloadPixels = async () => {
    const { data, error } = await supabase
      .from("tracking_pixels")
      .select("id,platform,pixel_id,name,is_enabled")
      .order("created_at", { ascending: true });
    if (error) console.error("reloadPixels", error);
    setPixels((data ?? []) as PixelRow[]);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("haskell_admin") !== "1") {
      navigate({ to: "/admin" });
      return;
    }
    (async () => {
      const [s, p, px] = await Promise.all([
        supabase.from("app_settings").select("show_related_global").limit(1).maybeSingle(),
        supabase.from("products").select("id,name,slug,show_related,quantity_pricing").order("created_at", { ascending: false }),
        supabase.from("tracking_pixels").select("id,platform,pixel_id,name,is_enabled").order("created_at", { ascending: true }),
      ]);
      const sd = s.data as { show_related_global?: boolean } | null;
      setGlobalRelated(sd?.show_related_global !== false);
      setPixels((px.data ?? []) as PixelRow[]);
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

  const addPixel = async () => {
    const cleaned = newPixelId.trim();
    if (!cleaned) { toast.error("اكتب الـ Pixel ID"); return; }
    setSavingPixel(true);
    try {
      if (!(await verifyPwd())) throw new Error("كلمة سر الأدمن غير صحيحة، سجّل دخول تاني");
      // prevent duplicates of same (platform, pixel_id)
      const dup = pixels.find((p) => p.platform === newPlatform && p.pixel_id === cleaned);
      if (dup) throw new Error("البيكسل ده مضاف قبل كده على نفس المنصة");
      const { error } = await supabase.from("tracking_pixels").insert({
        platform: newPlatform,
        pixel_id: cleaned,
        name: newName.trim() || null,
        is_enabled: true,
      } as never);
      if (error) throw new Error(error.message);
      setNewPixelId(""); setNewName("");
      await reloadPixels();
      toast.success("تم إضافة البيكسل ✨ — هيتركّب تلقائي على المتجر");
    } catch (e) {
      toast.error((e as Error).message || "فشل الحفظ");
    }
    setSavingPixel(false);
  };

  const togglePixel = async (p: PixelRow) => {
    const next = !p.is_enabled;
    setPixels((arr) => arr.map((x) => x.id === p.id ? { ...x, is_enabled: next } : x));
    try {
      if (!(await verifyPwd())) throw new Error("كلمة سر الأدمن غير صحيحة");
      const { error } = await supabase.from("tracking_pixels")
        .update({ is_enabled: next } as never).eq("id", p.id);
      if (error) throw new Error(error.message);
      toast.success(next ? "تم تفعيل البيكسل" : "تم إيقاف البيكسل");
    } catch (e) {
      setPixels((arr) => arr.map((x) => x.id === p.id ? { ...x, is_enabled: !next } : x));
      toast.error((e as Error).message || "فشل التحديث");
    }
  };

  const removePixel = async (p: PixelRow) => {
    if (!confirm(`حذف البيكسل ${p.pixel_id}؟`)) return;
    try {
      if (!(await verifyPwd())) throw new Error("كلمة سر الأدمن غير صحيحة");
      const { error } = await supabase.from("tracking_pixels").delete().eq("id", p.id);
      if (error) throw new Error(error.message);
      await reloadPixels();
      toast.success("تم الحذف");
    } catch (e) {
      toast.error((e as Error).message || "فشل الحذف");
    }
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

        {/* Tracking Pixels (Facebook, TikTok…) */}
        <div className="mt-4 rounded-2xl bg-card p-5 shadow-soft">
          <p className="font-bold">بيكسلات التتبع</p>
          <p className="mt-1 text-xs text-muted-foreground">
            تقدر تضيف أكتر من بيكسل (Facebook / TikTok). كل بيكسل مفعّل هيتركّب تلقائي على كل الصفحات.
          </p>

          <div className="mt-3 space-y-2">
            {pixels.length === 0 && (
              <p className="text-[11px] text-muted-foreground">لا توجد بيكسلات حالياً.</p>
            )}
            {pixels.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-input bg-background px-3 py-2">
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase">{p.platform}</span>
                <span className="font-mono text-xs">{p.pixel_id}</span>
                {p.name && <span className="text-[11px] text-muted-foreground">— {p.name}</span>}
                <button
                  onClick={() => togglePixel(p)}
                  className={`ms-auto flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold ${p.is_enabled ? "bg-emerald/15 text-emerald" : "bg-muted text-muted-foreground"}`}
                >
                  <Power className="size-3" /> {p.is_enabled ? "مفعّل" : "موقوف"}
                </button>
                <button
                  onClick={() => removePixel(p)}
                  className="grid size-7 place-items-center rounded-lg bg-destructive/10 text-destructive"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-2 rounded-xl border border-dashed border-input p-3 sm:grid-cols-[120px_1fr_1fr_auto]">
            <select
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value as "facebook" | "tiktok" | "snapchat")}
              className="rounded-xl border border-input bg-background px-2 py-2 text-sm"
            >
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok</option>
              <option value="snapchat">Snapchat</option>
            </select>
            <input
              value={newPixelId}
              onChange={(e) => setNewPixelId(e.target.value)}
              placeholder="Pixel ID"
              className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
            />
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="اسم (اختياري)"
              className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
            />
            <button
              onClick={addPixel}
              disabled={savingPixel}
              className="flex items-center justify-center gap-1.5 rounded-full bg-gold px-4 py-2 text-xs font-bold text-gold-foreground disabled:opacity-50"
            >
              {savingPixel ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
              إضافة
            </button>
          </div>
        </div>

        {/* Test Mode for Pixels */}
        <PixelTestMode pixels={pixels} />





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

function PixelTestMode({ pixels }: { pixels: PixelRow[] }) {
  const [debug, setDebug] = useState(false);
  const [, force] = useState(0);
  const [fbReady, setFbReady] = useState(false);
  const [ttReady, setTtReady] = useState(false);
  const [snapReady, setSnapReady] = useState(false);

  useEffect(() => {
    setDebug(pixelDebugEnabled());
    const unsub = subscribePixelDebug(() => force((n) => n + 1));
    const t = setInterval(() => {
      const w = window as unknown as { fbq?: unknown; ttq?: { track?: unknown }; snaptr?: unknown };
      setFbReady(typeof window !== "undefined" && typeof w.fbq === "function");
      setTtReady(typeof window !== "undefined" && !!w.ttq?.track);
      setSnapReady(typeof window !== "undefined" && typeof w.snaptr === "function");
    }, 800);
    return () => { unsub(); clearInterval(t); };
  }, []);

  const fbPixels = pixels.filter((p) => p.platform === "facebook" && p.is_enabled);
  const ttPixels = pixels.filter((p) => p.platform === "tiktok" && p.is_enabled);
  const snapPixels = pixels.filter((p) => p.platform === "snapchat" && p.is_enabled);
  const log = getPixelDebugLog();

  const toggle = (v: boolean) => { setDebug(v); setPixelDebug(v); };

  const readyMap: Record<string, boolean> = { facebook: fbReady, tiktok: ttReady, snapchat: snapReady };

  const StatusRow = ({ label, ready, list }: { label: string; ready: boolean; list: PixelRow[] }) => (
    <div className="space-y-2 rounded-xl border border-input bg-background px-3 py-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold text-sm">{label}</span>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${list.length === 0 ? "bg-muted text-muted-foreground" : ready ? "bg-emerald/15 text-emerald" : "bg-amber-500/15 text-amber-600"}`}>
          {list.length === 0 ? "لا يوجد بيكسل مفعّل" : ready ? "✓ السكريبت متركّب" : "⏳ السكريبت لم يُحمَّل بعد"}
        </span>
      </div>
      {list.map((p) => (
        <PixelTesterCard key={p.id} pixel={p} scriptLoaded={ready} />
      ))}
    </div>
  );

  return (
    <div className="mt-4 rounded-2xl bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-bold">وضع اختبار البيكسلات</p>
          <p className="mt-1 text-xs text-muted-foreground">
            اضغط «اختبر الآن» على أي بيكسل علشان أتأكدلك إنه شغّال فعلاً وإن مفيش حاجة بتحجبه.
          </p>
        </div>
        <button
          onClick={() => toggle(!debug)}
          className={`relative h-7 w-14 shrink-0 rounded-full transition ${debug ? "bg-emerald" : "bg-muted"}`}
          title="تفعيل لوج الـ console"
        >
          <span className={`absolute top-1 size-5 rounded-full bg-background shadow transition-all ${debug ? "left-1" : "left-8"}`} />
        </button>
      </div>

      <div className="mt-4 space-y-2">
        <StatusRow label="Facebook" ready={fbReady} list={fbPixels} />
        <StatusRow label="TikTok" ready={ttReady} list={ttPixels} />
        <StatusRow label="Snapchat" ready={snapReady} list={snapPixels} />
        <button
          onClick={async () => {
            for (const p of [...fbPixels, ...ttPixels, ...snapPixels]) {
              window.dispatchEvent(new CustomEvent(`test-pixel-${p.id}`));
              await new Promise((r) => setTimeout(r, 100));
            }
          }}
          className="w-full rounded-xl bg-foreground py-2 text-xs font-bold text-background"
        >اختبر كل البيكسلات دفعة واحدة</button>
      </div>
      <div className="hidden">{readyMap.facebook ? "" : ""}</div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => trackPixelEvent("PageView")}
          className="rounded-full bg-foreground px-3 py-1.5 text-xs font-bold text-background"
        >إطلاق PageView تجريبي</button>
        <button
          onClick={() => trackPixelEvent("ViewContent", { content_name: "Test Product", value: 99, currency: "EGP" })}
          className="rounded-full bg-gold px-3 py-1.5 text-xs font-bold text-gold-foreground"
        >إطلاق ViewContent تجريبي</button>
        <button
          onClick={clearPixelDebugLog}
          className="ms-auto rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground"
        >مسح السجل</button>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-bold">آخر الأحداث ({log.length})</p>
        <div className="max-h-72 space-y-1 overflow-auto rounded-xl border border-input bg-background p-2">
          {log.length === 0 && (
            <p className="p-3 text-center text-[11px] text-muted-foreground">
              لسه مفيش أحداث. افتح أي صفحة منتج أو اضغط زرار الاختبار فوق.
            </p>
          )}
          {log.map((e) => (
            <div key={e.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px]">
              <span className="font-mono text-muted-foreground">{new Date(e.ts).toLocaleTimeString("ar-EG")}</span>
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase ${e.platform === "facebook" ? "bg-blue-500/15 text-blue-600" : e.platform === "tiktok" ? "bg-pink-500/15 text-pink-600" : "bg-muted text-muted-foreground"}`}>{e.platform}</span>
              <span className="font-bold">{e.event}</span>
              {e.data && <span className="truncate font-mono text-muted-foreground">{JSON.stringify(e.data)}</span>}
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          نصيحة: ثبّت إضافة <b>Meta Pixel Helper</b> أو <b>TikTok Pixel Helper</b> في كروم — هتشوف البيكسل أخضر يعني شغّال صح وجاهز للإعلانات.
        </p>
      </div>
    </div>
  );
}

type Check = { name: string; ok: boolean; msg: string };

function validateFormat(platform: string, id: string): Check {
  if (platform === "facebook") {
    const ok = /^\d{15,16}$/.test(id);
    return { name: "صيغة الـ ID", ok, msg: ok ? "رقم سليم (15-16 خانة)" : "غلط: لازم يكون رقم 15 أو 16 خانة" };
  }
  if (platform === "tiktok") {
    const ok = /^[A-Z0-9]{18,24}$/.test(id);
    return { name: "صيغة الـ ID", ok, msg: ok ? "شكله صح" : "غلط: TikTok Pixel ID لازم 18-24 حرف/رقم كابتل (زي C2A3B...)" };
  }
  if (platform === "snapchat") {
    const ok = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    return { name: "صيغة الـ ID", ok, msg: ok ? "UUID سليم" : "غلط: Snapchat Pixel ID لازم يكون UUID" };
  }
  return { name: "صيغة الـ ID", ok: false, msg: "منصة غير مدعومة" };
}

function imageProbe(url: string, timeout = 4000): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const t = setTimeout(() => { img.src = ""; resolve(false); }, timeout);
    img.onload = () => { clearTimeout(t); resolve(true); };
    img.onerror = () => { clearTimeout(t); resolve(false); };
    img.src = url;
  });
}

function fetchProbe(url: string, timeout = 4000): Promise<boolean> {
  return new Promise((resolve) => {
    const ctrl = new AbortController();
    const t = setTimeout(() => { ctrl.abort(); resolve(false); }, timeout);
    fetch(url, { mode: "no-cors", signal: ctrl.signal })
      .then(() => { clearTimeout(t); resolve(true); })
      .catch(() => { clearTimeout(t); resolve(false); });
  });
}

async function runPixelTest(p: PixelRow, scriptLoaded: boolean): Promise<{ ok: boolean; checks: Check[]; diagnosis: string }> {
  const checks: Check[] = [];
  const fmt = validateFormat(p.platform, p.pixel_id);
  checks.push(fmt);

  checks.push({ name: "السكريبت محمّل في الصفحة", ok: scriptLoaded, msg: scriptLoaded ? "موجود في window" : "غير موجود — السكريبت لم يُحقن" });

  let networkOk = false;
  if (p.platform === "facebook") {
    networkOk = await imageProbe(`https://www.facebook.com/tr/?id=${encodeURIComponent(p.pixel_id)}&ev=PageView&noscript=1&_=${Date.now()}`);
  } else if (p.platform === "tiktok") {
    networkOk = await fetchProbe(`https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${encodeURIComponent(p.pixel_id)}&lib=ttq`);
  } else if (p.platform === "snapchat") {
    networkOk = await fetchProbe(`https://sc-static.net/scevent.min.js`);
  }
  checks.push({ name: "الاتصال بخوادم المنصة", ok: networkOk, msg: networkOk ? "وصلنا للسيرفر بنجاح" : "محجوب — في الغالب AdBlock أو إضافة خصوصية" });

  let eventFired = false;
  if (scriptLoaded) {
    try {
      const w = window as unknown as { fbq?: (...a: unknown[]) => void; ttq?: { track?: (...a: unknown[]) => void }; snaptr?: (...a: unknown[]) => void };
      if (p.platform === "facebook" && typeof w.fbq === "function") { w.fbq("trackSingle", p.pixel_id, "PageView"); eventFired = true; }
      if (p.platform === "tiktok" && w.ttq?.track) { w.ttq.track("ViewContent", { test: true }); eventFired = true; }
      if (p.platform === "snapchat" && typeof w.snaptr === "function") { w.snaptr("track", "PAGE_VIEW"); eventFired = true; }
    } catch { /* noop */ }
  }
  checks.push({ name: "إطلاق حدث تجريبي", ok: eventFired, msg: eventFired ? "تم الإطلاق — اتفقد من Events Manager" : "ما اتنفذش (السكريبت مش موجود)" });

  const ok = checks.every((c) => c.ok);
  let diagnosis = "✅ البيكسل شغّال تمام وجاهز للإعلانات.";
  if (!ok) {
    if (!fmt.ok) diagnosis = "❌ المشكلة: " + fmt.msg + ". صحّح الـ ID من إعدادات البيكسل فوق.";
    else if (!scriptLoaded && !networkOk) diagnosis = "❌ المشكلة: متصفحك بيحجب البيكسل (AdBlock/Brave/إضافة خصوصية). البيكسل نفسه مظبوط، بس الاختبار من جهازك مش هينجح. جرّب من متصفح تاني أو موبايل بدون أدبلوك، أو افتح Meta Events Manager → Test Events.";
    else if (!scriptLoaded) diagnosis = "⚠️ السكريبت لم يُحمّل في هذه الصفحة. حدّث الصفحة (F5) وأعد الاختبار.";
    else if (!networkOk) diagnosis = "⚠️ الاتصال بخوادم المنصة محجوب من متصفحك — لكن البيكسل قد يعمل لباقي الزوار.";
    else if (!eventFired) diagnosis = "⚠️ تعذّر إطلاق الحدث برمجيًا — راجع الـ console.";
  }
  return { ok, checks, diagnosis };
}

function PixelTesterCard({ pixel, scriptLoaded }: { pixel: PixelRow; scriptLoaded: boolean }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; checks: Check[]; diagnosis: string } | null>(null);

  const run = async () => {
    setRunning(true);
    setResult(null);
    const r = await runPixelTest(pixel, scriptLoaded);
    setResult(r);
    setRunning(false);
  };

  useEffect(() => {
    const handler = () => run();
    window.addEventListener(`test-pixel-${pixel.id}`, handler);
    return () => window.removeEventListener(`test-pixel-${pixel.id}`, handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pixel.id, scriptLoaded]);

  return (
    <div className="rounded-lg border border-input/60 bg-card p-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] text-muted-foreground">{pixel.pixel_id}</span>
        {pixel.name && <span className="text-[11px] text-muted-foreground">— {pixel.name}</span>}
        <button
          onClick={run}
          disabled={running}
          className="ms-auto rounded-full bg-foreground px-3 py-1 text-[11px] font-bold text-background disabled:opacity-50"
        >
          {running ? "بيختبر…" : "اختبر الآن"}
        </button>
      </div>
      {result && (
        <div className="mt-2 space-y-1">
          {result.checks.map((c, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px]">
              <span className={c.ok ? "text-emerald" : "text-red-500"}>{c.ok ? "✓" : "✗"}</span>
              <span className="font-bold">{c.name}:</span>
              <span className="text-muted-foreground">{c.msg}</span>
            </div>
          ))}
          <div className={`mt-2 rounded-md p-2 text-[12px] font-bold ${result.ok ? "bg-emerald/10 text-emerald" : "bg-amber-500/10 text-amber-700"}`}>
            {result.diagnosis}
          </div>
        </div>
      )}
    </div>
  );
}

