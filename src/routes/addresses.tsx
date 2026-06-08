import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, InfoCard } from "@/components/SimplePage";
import { MapPin, Trash2, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type Address = { id: string; name: string; city: string; street: string; phone: string };

export const Route = createFileRoute("/addresses")({
  head: () => ({ meta: [{ title: "عناويني — Haskell Store" }] }),
  component: () => {
    const [items, setItems] = useState<Address[]>([]);
    const [draft, setDraft] = useState({ name: "", city: "", street: "", phone: "" });
    useEffect(() => {
      const s = localStorage.getItem("addresses");
      if (s) setItems(JSON.parse(s));
    }, []);
    const persist = (next: Address[]) => { setItems(next); localStorage.setItem("addresses", JSON.stringify(next)); };
    const add = (e: React.FormEvent) => {
      e.preventDefault();
      if (!draft.name || !draft.city) return toast.error("اكمل البيانات");
      persist([...items, { ...draft, id: crypto.randomUUID() }]);
      setDraft({ name: "", city: "", street: "", phone: "" });
      toast.success("تم إضافة العنوان");
    };
    const remove = (id: string) => persist(items.filter(i => i.id !== id));
    return (
      <SimplePage icon={MapPin} title="عناويني" subtitle="إدارة عناوين الشحن">
        {items.length === 0 && <InfoCard>مفيش عناوين متسجلة لسه. ضيف عنوان جديد من تحت 👇</InfoCard>}
        {items.map(a => (
          <div key={a.id} className="rounded-2xl bg-card p-4 shadow-soft flex items-start justify-between">
            <div className="text-sm">
              <p className="font-bold">{a.name}</p>
              <p className="text-muted-foreground">{a.city} — {a.street}</p>
              <p className="text-muted-foreground">{a.phone}</p>
            </div>
            <button onClick={() => remove(a.id)} className="text-red-500"><Trash2 className="size-4" /></button>
          </div>
        ))}
        <form onSubmit={add} className="rounded-2xl bg-card p-5 shadow-soft space-y-3">
          <h3 className="font-bold text-sm flex items-center gap-2"><Plus className="size-4" /> أضف عنوان جديد</h3>
          <input value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})} placeholder="الاسم" className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
          <input value={draft.city} onChange={e=>setDraft({...draft,city:e.target.value})} placeholder="المحافظة / المدينة" className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
          <input value={draft.street} onChange={e=>setDraft({...draft,street:e.target.value})} placeholder="الشارع والعمارة" className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
          <input value={draft.phone} onChange={e=>setDraft({...draft,phone:e.target.value})} placeholder="رقم الموبايل" className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
          <button className="w-full rounded-full bg-emerald text-white font-bold py-3 text-sm">حفظ العنوان</button>
        </form>
      </SimplePage>
    );
  },
});
