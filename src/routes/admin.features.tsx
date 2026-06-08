import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight, Plus, Trash2, Save, Eye, EyeOff } from "lucide-react";

type Feature = {
  id: string;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
};

export const Route = createFileRoute("/admin/features")({
  head: () => ({
    meta: [
      { title: "إدارة الميزات — Haskell Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: FeaturesAdmin,
});

function FeaturesAdmin() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("haskell_admin") !== "1") {
      navigate({ to: "/admin" });
      return;
    }
    load();
  }, [navigate]);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("features")
      .select("*")
      .order("sort_order");
    if (error) toast.error("خطأ في التحميل");
    setItems((data as Feature[]) ?? []);
    setLoading(false);
  };

  const update = (id: string, patch: Partial<Feature>) =>
    setItems((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const save = async (f: Feature) => {
    setSavingId(f.id);
    const { error } = await supabase
      .from("features")
      .update({
        icon: f.icon,
        title: f.title,
        description: f.description,
        sort_order: f.sort_order,
        is_active: f.is_active,
      })
      .eq("id", f.id);
    setSavingId(null);
    if (error) toast.error("فشل الحفظ — راجع صلاحيات الأدمن");
    else toast.success("تم الحفظ ✨");
  };

  const remove = async (id: string) => {
    if (!confirm("متأكد إنك عايز تحذف الميزة دي؟")) return;
    const { error } = await supabase.from("features").delete().eq("id", id);
    if (error) toast.error("فشل الحذف");
    else {
      toast.success("تم الحذف");
      setItems((arr) => arr.filter((x) => x.id !== id));
    }
  };

  const add = async () => {
    const nextOrder = (items.at(-1)?.sort_order ?? 0) + 1;
    const { data, error } = await supabase
      .from("features")
      .insert({
        icon: "Sparkles",
        title: "ميزة جديدة",
        description: "وصف الميزة",
        sort_order: nextOrder,
      })
      .select()
      .single();
    if (error || !data) {
      toast.error("فشل الإضافة");
      return;
    }
    setItems((arr) => [...arr, data as Feature]);
    toast.success("اتضافت ميزة جديدة");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-5xl px-4 py-6">
        <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowRight className="size-3 rotate-180" /> رجوع
        </Link>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">إدارة الميزات</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              عدّل الكروت اللي بتظهر في الصفحة الرئيسية. الأيقونات من{" "}
              <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="underline">
                lucide.dev
              </a>{" "}
              (مثال: Sparkles, Truck, Heart).
            </p>
          </div>
          <button
            onClick={add}
            className="inline-flex items-center gap-2 rounded-full bg-emerald px-4 py-2.5 text-xs font-bold text-emerald-foreground shadow-luxury"
          >
            <Plus className="size-4" /> ميزة جديدة
          </button>
        </div>

        {loading ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">جاري التحميل...</p>
        ) : (
          <div className="mt-5 space-y-3">
            {items.map((f) => (
              <div key={f.id} className="rounded-2xl bg-card p-4 shadow-soft">
                <div className="grid gap-2.5 md:grid-cols-[80px_120px_1fr_1.5fr_auto]">
                  <input
                    type="number"
                    value={f.sort_order}
                    onChange={(e) => update(f.id, { sort_order: Number(e.target.value) })}
                    className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
                    placeholder="ترتيب"
                  />
                  <input
                    value={f.icon}
                    onChange={(e) => update(f.id, { icon: e.target.value })}
                    className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
                    placeholder="الأيقونة"
                  />
                  <input
                    value={f.title}
                    onChange={(e) => update(f.id, { title: e.target.value })}
                    className="rounded-xl border border-input bg-background px-3 py-2 text-sm font-bold"
                    placeholder="العنوان"
                  />
                  <input
                    value={f.description}
                    onChange={(e) => update(f.id, { description: e.target.value })}
                    className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
                    placeholder="الوصف"
                  />
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => update(f.id, { is_active: !f.is_active })}
                      title={f.is_active ? "مفعّلة" : "مخفية"}
                      className={`grid size-9 place-items-center rounded-xl ${
                        f.is_active ? "bg-emerald/15 text-emerald" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {f.is_active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                    </button>
                    <button
                      onClick={() => save(f)}
                      disabled={savingId === f.id}
                      className="grid size-9 place-items-center rounded-xl bg-gold text-gold-foreground disabled:opacity-50"
                      title="حفظ"
                    >
                      <Save className="size-4" />
                    </button>
                    <button
                      onClick={() => remove(f.id)}
                      className="grid size-9 place-items-center rounded-xl bg-destructive/10 text-destructive"
                      title="حذف"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 rounded-2xl bg-gold/10 p-4 text-xs">
          💡 ملاحظة: تعديل/حذف/إضافة الميزات يحتاج صلاحية أدمن في قاعدة البيانات (سياسة RLS). لو فيه خطأ في الحفظ ابعتلي علشان أربط Server Function آمنة.
        </div>
      </div>
    </div>
  );
}
