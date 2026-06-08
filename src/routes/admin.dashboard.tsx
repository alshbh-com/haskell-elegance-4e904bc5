import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Package, Tags, ShoppingCart, Settings as SettingsIcon, LogOut, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Haskell Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, orders: 0, categories: 0 });

  useEffect(() => {
    if (sessionStorage.getItem("haskell_admin") !== "1") {
      navigate({ to: "/admin" });
      return;
    }
    Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("categories").select("id", { count: "exact", head: true }),
    ]).then(([p, c]) => setStats((s) => ({ ...s, products: p.count ?? 0, categories: c.count ?? 0 })));
  }, [navigate]);

  const logout = () => {
    sessionStorage.removeItem("haskell_admin");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">لوحة التحكم</h1>
          <button onClick={logout} className="flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2 text-xs font-bold text-destructive">
            <LogOut className="size-4" /> خروج
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          <Stat label="المنتجات" value={stats.products} />
          <Stat label="التصنيفات" value={stats.categories} />
          <Stat label="الطلبات" value="—" />
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <Link to="/admin/features" className="block">
            <Tile icon={<Sparkles className="size-5" />} title="إدارة الميزات الـ 30" desc="عدّل العنوان، الوصف، والأيقونة" />
          </Link>
          <Tile icon={<Package className="size-5" />} title="المنتجات" desc="إضافة، تعديل، حذف" disabled />
          <Tile icon={<Tags className="size-5" />} title="التصنيفات والأقسام" desc="إدارة التصنيفات" disabled />
          <Tile icon={<ShoppingCart className="size-5" />} title="الطلبات" desc="مراجعة وتحديث الحالة" disabled />
          <Tile icon={<SettingsIcon className="size-5" />} title="إعدادات المتجر" desc="اسم، لوجو، Meta Pixel" disabled />
        </div>

        <div className="mt-6 rounded-2xl bg-gold/10 p-4 text-xs text-foreground">
          ✨ تم تأمين الوصول. باقي شاشات الإدارة (CRUD للمنتجات، إعدادات Meta Pixel، إدارة الطلبات) هتتفعل في التحديث الجاي.
        </div>

        <Link to="/" className="mt-4 inline-block text-xs text-muted-foreground underline">رجوع للمتجر</Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-soft">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold text-emerald dark:text-foreground">{value}</p>
    </div>
  );
}

function Tile({ icon, title, desc, disabled }: { icon: React.ReactNode; title: string; desc: string; disabled?: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl bg-card p-4 shadow-soft ${disabled ? "opacity-70" : ""}`}>
      <div className="grid size-10 place-items-center rounded-xl bg-emerald text-emerald-foreground">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-bold">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      {disabled && <span className="text-[10px] text-muted-foreground">قريباً</span>}
    </div>
  );
}
