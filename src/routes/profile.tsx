import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, InfoCard } from "@/components/SimplePage";
import { UserCog } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "الملف الشخصي — Haskell Store" }] }),
  component: () => {
    const [form, setForm] = useState({ name: "", phone: "", email: "" });
    useEffect(() => {
      const s = localStorage.getItem("profile");
      if (s) setForm(JSON.parse(s));
    }, []);
    const save = (e: React.FormEvent) => {
      e.preventDefault();
      localStorage.setItem("profile", JSON.stringify(form));
      toast.success("تم حفظ البيانات ✅");
    };
    return (
      <SimplePage icon={UserCog} title="الملف الشخصي" subtitle="بياناتك ومعلوماتك">
        <form onSubmit={save} className="rounded-2xl bg-card p-5 shadow-soft space-y-4">
          <Field label="الاسم" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="اكتب اسمك" />
          <Field label="رقم الموبايل" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="01xxxxxxxxx" type="tel" />
          <Field label="البريد الإلكتروني" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@example.com" type="email" />
          <button className="w-full rounded-full bg-emerald text-white font-bold py-3 text-sm">حفظ التغييرات</button>
        </form>
      </SimplePage>
    );
  },
});

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald" />
    </label>
  );
}
