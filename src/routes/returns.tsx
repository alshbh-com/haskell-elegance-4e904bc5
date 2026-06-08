import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, InfoCard } from "@/components/SimplePage";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/returns")({
  head: () => ({ meta: [{ title: "الاسترجاع — Haskell Store" }] }),
  component: () => {
    const [orderId, setOrderId] = useState("");
    const [reason, setReason] = useState("");
    const submit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!orderId || !reason) return toast.error("اكمل البيانات");
      toast.success("تم استلام طلب الاسترجاع، هنتواصل معاك خلال 24 ساعة ✅");
      setOrderId(""); setReason("");
    };
    return (
      <SimplePage icon={RotateCcw} title="طلب استرجاع" subtitle="استرجاع المنتج خلال 14 يوم">
        <form onSubmit={submit} className="rounded-2xl bg-card p-5 shadow-soft space-y-4">
          <input value={orderId} onChange={e=>setOrderId(e.target.value)} placeholder="رقم الطلب" className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
          <select value={reason} onChange={e=>setReason(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
            <option value="">سبب الاسترجاع</option>
            <option>المنتج مختلف عن الصورة</option>
            <option>المقاس غير مناسب</option>
            <option>عيب في المنتج</option>
            <option>غيّرت رأيي</option>
            <option>أخرى</option>
          </select>
          <button className="w-full rounded-full bg-emerald text-white font-bold py-3 text-sm">إرسال الطلب</button>
        </form>
        <InfoCard>
          <p className="font-bold">شروط الاسترجاع</p>
          <ul className="list-disc pr-5 space-y-1 text-muted-foreground">
            <li>خلال 14 يوم من تاريخ الاستلام</li>
            <li>المنتج بحالته الأصلية وغلافه</li>
            <li>الفاتورة الأصلية مرفقة</li>
          </ul>
        </InfoCard>
      </SimplePage>
    );
  },
});
