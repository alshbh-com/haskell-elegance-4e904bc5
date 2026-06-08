import { createFileRoute, Link } from "@tanstack/react-router";
import { SimplePage, InfoCard } from "@/components/SimplePage";
import { ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/outlet")({
  head: () => ({ meta: [{ title: "الأوتلت — Haskell Store" }] }),
  component: () => (
    <SimplePage icon={ShoppingBag} title="الأوتلت" subtitle="تشكيلة بأسعار مخفضة لحد 70%">
      <div className="rounded-3xl bg-gradient-to-br from-red-500 to-rose-600 p-6 text-white shadow-lg">
        <p className="text-xs opacity-90">عروض الأوتلت</p>
        <p className="font-display text-3xl font-bold mt-1">خصومات حتى 70%</p>
        <p className="text-sm opacity-90 mt-2">على تشكيلة محدودة من المنتجات</p>
      </div>
      <InfoCard>
        <p className="font-bold">شروط الأوتلت</p>
        <ul className="list-disc pr-5 space-y-1 text-muted-foreground">
          <li>الكميات محدودة جداً</li>
          <li>لا يمكن الاسترجاع أو الاستبدال</li>
          <li>الأسعار سارية لحد نفاد الكمية</li>
        </ul>
        <Link to="/" className="inline-block mt-2 rounded-full bg-emerald text-white font-bold px-5 py-2 text-sm">تصفح المنتجات</Link>
      </InfoCard>
    </SimplePage>
  ),
});
