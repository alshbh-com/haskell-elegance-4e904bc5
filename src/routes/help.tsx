import { createFileRoute, Link } from "@tanstack/react-router";
import { SimplePage } from "@/components/SimplePage";
import { LifeBuoy, Package, CreditCard, RotateCcw, MessageCircle, ShieldCheck, Truck } from "lucide-react";

const topics = [
  { icon: Package, title: "الطلبات والتتبع", to: "/track" },
  { icon: Truck, title: "الشحن والتوصيل", to: "/faq" },
  { icon: CreditCard, title: "الدفع والفواتير", to: "/faq" },
  { icon: RotateCcw, title: "الاسترجاع والاستبدال", to: "/returns" },
  { icon: ShieldCheck, title: "الضمان والجودة", to: "/faq" },
  { icon: MessageCircle, title: "تواصل مع الدعم", to: "/faq" },
] as const;

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "مركز المساعدة — Haskell Store" }] }),
  component: () => (
    <SimplePage icon={LifeBuoy} title="مركز المساعدة" subtitle="دليلك الكامل لاستخدام المتجر">
      <div className="grid grid-cols-2 gap-3">
        {topics.map((t, i) => (
          <Link to={t.to} key={i} className="rounded-2xl bg-card p-4 shadow-soft hover:shadow-md transition-shadow text-center">
            <div className="grid size-12 mx-auto place-items-center rounded-full bg-emerald/10 text-emerald">
              <t.icon className="size-6" />
            </div>
            <p className="mt-2 font-bold text-sm">{t.title}</p>
          </Link>
        ))}
      </div>
      <a href="https://wa.me/201278006248" target="_blank" rel="noopener noreferrer" className="block rounded-2xl bg-emerald p-5 text-white text-center font-bold shadow-soft">
        💬 تواصل معانا على الواتساب
      </a>
    </SimplePage>
  ),
});
