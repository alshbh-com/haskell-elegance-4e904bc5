import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Truck, RotateCcw, ShieldCheck, Phone, MessageCircle, FileText } from "lucide-react";

export const Route = createFileRoute("/more")({
  head: () => ({ meta: [{ title: "المزيد — Haskell Store" }] }),
  component: MorePage,
});

function MorePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-6 space-y-3">
        <h1 className="font-display text-3xl font-bold">المزيد</h1>

        <Card icon={<Truck className="size-5" />} title="سياسة الشحن">
          بنوصل لكل المحافظات في خلال 2-5 أيام عمل. الشحن 60 جنيه، ومجاني للطلبات فوق 1000 جنيه.
        </Card>
        <Card icon={<RotateCcw className="size-5" />} title="سياسة الاسترجاع">
          تقدر ترجع المنتج خلال 14 يوم من تاريخ الاستلام لو مش راضي عنه، شرط إنه يكون بحالته الأصلية.
        </Card>
        <Card icon={<ShieldCheck className="size-5" />} title="ضمان الجودة">
          كل منتجاتنا أصلية 100% وعليها ضمان من المتجر.
        </Card>
        <Card icon={<MessageCircle className="size-5" />} title="تواصل معانا">
          واتساب: 01278006248 — متاحين 7 أيام في الأسبوع.
        </Card>
        <Link to="/track" className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-soft">
          <span className="flex items-center gap-3 text-sm font-bold"><Phone className="size-5 text-emerald" /> تتبع طلبك</span>
          <span className="text-xs text-muted-foreground">←</span>
        </Link>
        <Link to="/admin" className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-soft">
          <span className="flex items-center gap-3 text-sm font-bold"><FileText className="size-5 text-emerald" /> لوحة الأدمن</span>
          <span className="text-xs text-muted-foreground">←</span>
        </Link>
      </div>
    </div>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-full bg-emerald/10 text-emerald dark:bg-emerald/20">{icon}</div>
        <h2 className="font-display text-lg font-bold">{title}</h2>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
