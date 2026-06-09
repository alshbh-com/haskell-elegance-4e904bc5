import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const GOVS = [
  "القاهرة", "الجيزة", "الإسكندرية", "القليوبية", "المنوفية", "الغربية", "الدقهلية",
  "الشرقية", "البحيرة", "كفر الشيخ", "دمياط", "بورسعيد", "الإسماعيلية", "السويس",
  "شمال سيناء", "جنوب سيناء", "الفيوم", "بني سويف", "المنيا", "أسيوط", "سوهاج",
  "قنا", "الأقصر", "أسوان", "البحر الأحمر", "الوادي الجديد", "مطروح",
];

export type BuyNowItem = {
  product_id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  size?: string;
  color?: string;
};

export function BuyNowDrawer({
  open, onClose, item,
}: { open: boolean; onClose: () => void; item: BuyNowItem | null }) {
  const [form, setForm] = useState({
    customer_name: "", phone: "", address: "", governorate: "القاهرة", notes: "",
  });
  const [loading, setLoading] = useState(false);
  const shipping = 60;
  const subtotal = item ? item.price * item.quantity : 0;
  const total = subtotal + shipping;

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    if (!form.customer_name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error("املأ كل البيانات المطلوبة");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("orders").insert({
      customer_name: form.customer_name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      governorate: form.governorate,
      notes: form.notes.trim() || null,
      items: [item] as unknown as never,
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
    setForm({ customer_name: "", phone: "", address: "", governorate: "القاهرة", notes: "" });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && item && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-x-0 bottom-0 z-[61] max-h-[92vh] overflow-y-auto rounded-t-3xl bg-background p-5 shadow-luxury md:inset-x-auto md:left-1/2 md:bottom-auto md:top-1/2 md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold">إتمام الطلب</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">دفع عند الاستلام</p>
              </div>
              <button onClick={onClose} className="grid size-9 place-items-center rounded-full bg-muted">
                <X className="size-4" />
              </button>
            </div>

            <div className="mb-4 flex gap-3 rounded-2xl bg-card p-3 shadow-soft">
              {item.image && <img src={item.image} alt={item.name} className="size-16 rounded-xl object-cover" />}
              <div className="flex-1 min-w-0">
                <p className="line-clamp-1 text-sm font-bold">{item.name}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {[item.size, item.color, `الكمية ${item.quantity}`].filter(Boolean).join(" • ")}
                </p>
                <p className="mt-1 text-sm font-bold text-emerald dark:text-foreground">
                  {subtotal.toLocaleString("ar-EG")} ج.م
                </p>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-2.5">
              <F label="الاسم بالكامل" v={form.customer_name} on={(v) => setForm({ ...form, customer_name: v })} />
              <F label="رقم التليفون" v={form.phone} on={(v) => setForm({ ...form, phone: v })} type="tel" />
              <F label="العنوان بالتفصيل" v={form.address} on={(v) => setForm({ ...form, address: v })} area />
              <div>
                <label className="mb-1 block text-xs font-bold">المحافظة</label>
                <select
                  value={form.governorate}
                  onChange={(e) => setForm({ ...form, governorate: e.target.value })}
                  className="w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm"
                >
                  {GOVS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
              <F label="ملاحظات (اختياري)" v={form.notes} on={(v) => setForm({ ...form, notes: v })} area />

              <div className="space-y-1 rounded-2xl bg-card p-3 text-xs">
                <Row k="المجموع" v={`${subtotal.toLocaleString("ar-EG")} ج.م`} />
                <Row k="الشحن" v={`${shipping} ج.م`} />
                <div className="mt-1 flex justify-between border-t border-border pt-1.5">
                  <span className="font-bold">الإجمالي</span>
                  <span className="font-display text-base font-bold text-emerald dark:text-foreground">
                    {total.toLocaleString("ar-EG")} ج.م
                  </span>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-l from-emerald to-emerald/85 py-3.5 text-sm font-bold text-emerald-foreground shadow-luxury disabled:opacity-50"
              >
                {loading && <Loader2 className="size-4 animate-spin" />}
                {loading ? "جاري التأكيد..." : `أكد الطلب — ${total.toLocaleString("ar-EG")} ج.م`}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function F({ label, v, on, type = "text", area = false }: { label: string; v: string; on: (s: string) => void; type?: string; area?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold">{label}</label>
      {area ? (
        <textarea value={v} onChange={(e) => on(e.target.value)} rows={2}
          className="w-full rounded-2xl border border-input bg-card px-4 py-2.5 text-sm" />
      ) : (
        <input type={type} value={v} onChange={(e) => on(e.target.value)}
          className="w-full rounded-2xl border border-input bg-card px-4 py-2.5 text-sm" />
      )}
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span>{v}</span></div>;
}
