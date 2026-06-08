import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, InfoCard } from "@/components/SimplePage";
import { Crown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/vip")({
  head: () => ({ meta: [{ title: "عضوية VIP — Haskell Store" }] }),
  component: () => (
    <SimplePage icon={Crown} title="عضوية VIP" subtitle="مزايا حصرية للأعضاء">
      <div className="rounded-3xl bg-gradient-to-br from-black to-zinc-800 p-6 text-white shadow-xl">
        <Crown className="size-8 text-amber-400" />
        <p className="font-display text-3xl font-bold mt-3">Haskell VIP</p>
        <p className="text-sm opacity-80 mt-1">199 جنيه / سنة</p>
        <button onClick={() => toast.success("هنتواصل معاك خلال 24 ساعة لتفعيل العضوية 👑")} className="mt-4 w-full rounded-full bg-amber-400 text-black font-bold py-3 text-sm">اشترك دلوقتي</button>
      </div>
      <InfoCard>
        <p className="font-bold">مزايا العضوية</p>
        <ul className="space-y-2 text-muted-foreground">
          <li>✨ خصم 15% على كل المنتجات</li>
          <li>🚚 شحن مجاني لكل الطلبات</li>
          <li>⚡ وصول مبكر للعروض والمنتجات الجديدة</li>
          <li>🎁 هدية عيد ميلاد</li>
          <li>📞 خدمة عملاء مخصصة 24/7</li>
          <li>🔄 استرجاع مجاني خلال 30 يوم</li>
        </ul>
      </InfoCard>
    </SimplePage>
  ),
});
