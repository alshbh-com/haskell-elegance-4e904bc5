import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, InfoCard } from "@/components/SimplePage";
import { Coins } from "lucide-react";

export const Route = createFileRoute("/loyalty")({
  head: () => ({ meta: [{ title: "نقاط الولاء — Haskell Store" }] }),
  component: () => (
    <SimplePage icon={Coins} title="نقاط الولاء" subtitle="اكسب نقاط مع كل طلب">
      <div className="rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-white shadow-lg">
        <p className="text-xs opacity-90">نقاطك</p>
        <p className="font-display text-5xl font-bold mt-1">0</p>
        <p className="text-xs opacity-90 mt-2">المستوى: 🥉 برونزي</p>
      </div>
      <InfoCard>
        <p className="font-bold">إزاي تكسب نقاط؟</p>
        <ul className="space-y-2 text-muted-foreground">
          <li>🛍️ كل 10 جنيه شراء = نقطة</li>
          <li>⭐ تقييم منتج = 5 نقاط</li>
          <li>👥 دعوة صديق = 50 نقطة</li>
          <li>🎂 عيد ميلادك = 100 نقطة</li>
        </ul>
        <p className="font-bold pt-2">المستويات</p>
        <ul className="space-y-1 text-muted-foreground">
          <li>🥉 برونزي (0-500): خصم 5%</li>
          <li>🥈 فضي (500-2000): خصم 10% + شحن مجاني</li>
          <li>🥇 ذهبي (2000+): خصم 15% + عروض حصرية</li>
        </ul>
      </InfoCard>
    </SimplePage>
  ),
});
