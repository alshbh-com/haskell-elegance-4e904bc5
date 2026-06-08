import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, InfoCard } from "@/components/SimplePage";
import { Gift } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const amounts = [100, 250, 500, 1000, 2000];

export const Route = createFileRoute("/gift-cards")({
  head: () => ({ meta: [{ title: "بطاقات الهدايا — Haskell Store" }] }),
  component: () => {
    const [amount, setAmount] = useState(500);
    const [to, setTo] = useState("");
    const [msg, setMsg] = useState("");
    const submit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!to) return toast.error("اكتب اسم المُهدى إليه");
      toast.success(`تم إرسال بطاقة بقيمة ${amount} جنيه إلى ${to} 🎁`);
      setTo(""); setMsg("");
    };
    return (
      <SimplePage icon={Gift} title="بطاقات الهدايا" subtitle="اهدِ من تحب تجربة تسوق مميزة">
        <div className="rounded-3xl bg-gradient-to-br from-pink-500 to-purple-600 p-6 text-white shadow-lg">
          <Gift className="size-8" />
          <p className="font-display text-3xl font-bold mt-3">{amount} جنيه</p>
          <p className="text-sm opacity-90 mt-1">Haskell Store Gift Card</p>
        </div>
        <form onSubmit={submit} className="rounded-2xl bg-card p-5 shadow-soft space-y-4">
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-2">اختر القيمة</p>
            <div className="flex flex-wrap gap-2">
              {amounts.map(a => (
                <button type="button" key={a} onClick={() => setAmount(a)} className={`px-4 py-2 rounded-full text-sm font-bold border ${amount===a?"bg-emerald text-white border-emerald":"border-input"}`}>{a} ج</button>
              ))}
            </div>
          </div>
          <input value={to} onChange={e=>setTo(e.target.value)} placeholder="اسم المُهدى إليه" className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
          <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="رسالة (اختياري)" rows={3} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
          <button className="w-full rounded-full bg-emerald text-white font-bold py-3 text-sm">إرسال البطاقة</button>
        </form>
      </SimplePage>
    );
  },
});
