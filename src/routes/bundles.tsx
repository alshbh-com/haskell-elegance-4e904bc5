import { createFileRoute, Link } from "@tanstack/react-router";
import { SimplePage } from "@/components/SimplePage";
import { Layers } from "lucide-react";

const bundles = [
  { title: "باقة الأناقة الكاملة", items: "خاتم + سلسلة + حلق", price: 899, was: 1350, save: "33%" },
  { title: "هدية المناسبات", items: "ساعة + سوار", price: 650, was: 950, save: "31%" },
  { title: "باقة العروسة", items: "طقم متكامل 5 قطع", price: 1499, was: 2400, save: "37%" },
  { title: "باقة الرجالي", items: "ساعة + محفظة + قلم", price: 750, was: 1100, save: "31%" },
];

export const Route = createFileRoute("/bundles")({
  head: () => ({ meta: [{ title: "باقات وعروض — Haskell Store" }] }),
  component: () => (
    <SimplePage icon={Layers} title="باقات وعروض" subtitle="اشتري أكتر ووفّر أكتر">
      {bundles.map((b, i) => (
        <Link to="/" key={i} className="block rounded-2xl bg-card p-5 shadow-soft hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold">{b.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{b.items}</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-red-500 text-white">وفّر {b.save}</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-display font-bold text-emerald">{b.price} جنيه</span>
            <span className="text-sm text-muted-foreground line-through">{b.was}</span>
          </div>
        </Link>
      ))}
    </SimplePage>
  ),
});
