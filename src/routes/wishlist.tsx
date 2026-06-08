import { createFileRoute, Link } from "@tanstack/react-router";
import { SimplePage, InfoCard } from "@/components/SimplePage";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "المفضلة — Haskell Store" }] }),
  component: () => {
    const [items, setItems] = useState<string[]>([]);
    useEffect(() => {
      try { setItems(JSON.parse(localStorage.getItem("wishlist") || "[]")); } catch {}
    }, []);
    return (
      <SimplePage icon={Heart} title="المفضلة" subtitle="المنتجات اللي حفظتها">
        {items.length === 0 ? (
          <InfoCard>
            <p>قائمة المفضلة فاضية. اضغط على ❤️ في أي منتج لإضافته هنا.</p>
            <Link to="/" className="inline-block mt-2 rounded-full bg-emerald text-white font-bold px-5 py-2 text-sm">تصفح المنتجات</Link>
          </InfoCard>
        ) : <InfoCard>عندك {items.length} منتج في المفضلة</InfoCard>}
      </SimplePage>
    );
  },
});
