import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { useCart } from "@/lib/cart-store";
import { supabase } from "@/integrations/supabase/client";

const GOVS = [
  "القاهرة", "الجيزة", "الإسكندرية", "القليوبية", "المنوفية", "الغربية", "الدقهلية",
  "الشرقية", "البحيرة", "كفر الشيخ", "دمياط", "بورسعيد", "الإسماعيلية", "السويس",
  "شمال سيناء", "جنوب سيناء", "الفيوم", "بني سويف", "المنيا", "أسيوط", "سوهاج",
  "قنا", "الأقصر", "أسوان", "البحر الأحمر", "الوادي الجديد", "مطروح",
];

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "إتمام الطلب — Haskell Store" }] }),
  component: Checkout,
});

function Checkout() {
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.total());
  const clear = useCart((s) => s.clear);
  const shipping = 60;
  const total = subtotal + shipping;

  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    address: "",
    governorate: "القاهرة",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <p className="text-muted-foreground">السلة فاضية</p>
          <Link to="/" className="mt-4 inline-block text-emerald underline">ارجع للتسوق</Link>
        </div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_name || !form.phone || !form.address) {
      toast.error("املأ كل البيانات المطلوبة");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("orders").insert({
      customer_name: form.customer_name,
      phone: form.phone,
      address: form.address,
      governorate: form.governorate,
      notes: form.notes,
      items: items as unknown as never,
      subtotal,
      shipping,
      total,
      status: "pending",
    } as never);
    setLoading(false);
    if (error) {
      toast.error("حصل خطأ، حاول تاني");
      return;
    }
    toast.success("تم تأكيد طلبك ✨ هنكلمك قريب");
    clear();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header />
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 md:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="space-y-4">
          <h1 className="font-display text-3xl font-bold">بيانات التوصيل</h1>
          <Field label="الاسم بالكامل" value={form.customer_name} onChange={(v) => setForm({ ...form, customer_name: v })} />
          <Field label="رقم التليفون" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} type="tel" />
          <Field label="العنوان بالتفصيل" value={form.address} onChange={(v) => setForm({ ...form, address: v })} textarea />
          <div>
            <label className="mb-1.5 block text-xs font-bold">المحافظة</label>
            <select
              value={form.governorate}
              onChange={(e) => setForm({ ...form, governorate: e.target.value })}
              className="w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm"
            >
              {GOVS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <Field label="ملاحظات (اختياري)" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} textarea />

          <div className="rounded-2xl bg-emerald/10 p-4 text-sm dark:bg-emerald/20">
            💵 الدفع <span className="font-bold">عند الاستلام</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-l from-emerald to-emerald/85 py-4 text-sm font-bold text-emerald-foreground shadow-luxury disabled:opacity-50"
          >
            {loading ? "جاري التأكيد..." : `أكد الطلب — ${total.toLocaleString("ar-EG")} ج.م`}
          </button>
        </form>

        <aside className="space-y-3 self-start rounded-3xl bg-card p-5 shadow-soft">
          <h2 className="font-display text-xl font-bold">ملخص الطلب</h2>
          <ul className="space-y-2 text-sm">
            {items.map((i) => (
              <li key={`${i.product_id}-${i.size}-${i.color}`} className="flex justify-between gap-2">
                <span className="line-clamp-1">{i.name} × {i.quantity}</span>
                <span className="shrink-0 font-semibold">{(i.price * i.quantity).toLocaleString("ar-EG")} ج.م</span>
              </li>
            ))}
          </ul>
          <div className="space-y-1 border-t border-border pt-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">المجموع</span><span>{subtotal.toLocaleString("ar-EG")} ج.م</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">الشحن</span><span>{shipping} ج.م</span></div>
            <div className="mt-2 flex justify-between border-t border-border pt-2">
              <span className="font-bold">الإجمالي</span>
              <span className="font-display text-xl font-bold text-emerald dark:text-foreground">
                {total.toLocaleString("ar-EG")} ج.م
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", textarea = false,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm"
        />
      )}
    </div>
  );
}
