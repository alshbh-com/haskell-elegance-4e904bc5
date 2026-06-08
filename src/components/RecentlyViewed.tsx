import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getViewed } from "@/lib/recently-viewed";
import { ProductCard } from "@/components/ProductCard";

export function RecentlyViewed() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(getViewed());
    const onUpdate = () => setSlugs(getViewed());
    window.addEventListener("recently-viewed-updated", onUpdate);
    return () => window.removeEventListener("recently-viewed-updated", onUpdate);
  }, []);

  const { data } = useQuery({
    queryKey: ["recently-viewed", slugs],
    enabled: slugs.length > 0,
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*").in("slug", slugs);
      // Sort to preserve recency order
      return (data ?? []).sort((a, b) => slugs.indexOf(a.slug) - slugs.indexOf(b.slug));
    },
  });

  if (!data || data.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="size-5 text-gold" />
          <h2 className="font-display text-2xl font-bold md:text-3xl">شفتها مؤخراً</h2>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {data.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
