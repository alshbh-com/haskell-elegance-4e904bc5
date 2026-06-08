import { createFileRoute, Link } from "@tanstack/react-router";
import { Scale, X, Check, Minus } from "lucide-react";
import { Header } from "@/components/Header";
import { useCompare } from "@/lib/compare-store";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/compare")({
  head: () => ({ meta: [{ title: "مقارنة المنتجات — Haskell Store" }] }),
  component: ComparePage,
});

function ComparePage() {
  const items = useCompare((s) => s.items);
  const remove = useCompare((s) => s.remove);

  const ids = items.map((i) => i.id);
  const { data: products } = useQuery({
    queryKey: ["compare-products", ids],
    enabled: ids.length > 0,
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*").in("id", ids);
      return data ?? [];
    },
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <Scale className="mx-auto size-12 text-muted-foreground" />
          <h1 className="mt-4 font-display text-2xl font-bold">مفيش منتجات للمقارنة</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            اضغط على أيقونة المقارنة بجانب أي منتج عشان تضيفه.
          </p>
          <Link to="/" className="mt-6 inline-block rounded-full bg-emerald px-6 py-3 text-sm font-bold text-emerald-foreground">
            تصفح المنتجات
          </Link>
        </div>
      </div>
    );
  }

  const list = (products ?? []).sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="font-display text-3xl font-bold">مقارنة المنتجات</h1>
        <p className="mt-1 text-sm text-muted-foreground">قارن المواصفات والأسعار جنب بعض</p>

        <div className="mt-6 overflow-x-auto">
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${list.length}, minmax(240px, 1fr))` }}>
            {list.map((p) => {
              const images = Array.isArray(p.images) ? (p.images as string[]) : [];
              const sizes = Array.isArray(p.sizes) ? (p.sizes as string[]) : [];
              const colors = Array.isArray(p.colors) ? (p.colors as string[]) : [];
              return (
                <div key={p.id} className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
                  <button
                    onClick={() => remove(p.id)}
                    className="absolute top-2 end-2 z-10 grid size-8 place-items-center rounded-full bg-background/90 text-muted-foreground shadow-soft hover:text-destructive"
                    aria-label="إزالة"
                  >
                    <X className="size-4" />
                  </button>
                  <div className="aspect-square bg-muted">
                    {images[0] && <img src={images[0]} alt={p.name} className="size-full object-cover" />}
                  </div>
                  <div className="space-y-3 p-4 text-sm">
                    <Link to="/product/$slug" params={{ slug: p.slug }} className="line-clamp-2 font-bold hover:text-gold">
                      {p.name}
                    </Link>
                    <Row label="السعر">
                      <span className="font-display text-lg font-bold text-emerald dark:text-foreground">
                        {p.price.toLocaleString("ar-EG")} ج.م
                      </span>
                    </Row>
                    <Row label="السعر قبل الخصم">
                      {p.compare_price ? (
                        <span className="text-xs text-muted-foreground line-through">
                          {p.compare_price.toLocaleString("ar-EG")}
                        </span>
                      ) : (
                        <Minus className="size-3 text-muted-foreground" />
                      )}
                    </Row>
                    <Row label="المقاسات">
                      {sizes.length > 0 ? sizes.join(" / ") : <Minus className="size-3 text-muted-foreground" />}
                    </Row>
                    <Row label="الألوان">
                      {colors.length > 0 ? colors.join(" / ") : <Minus className="size-3 text-muted-foreground" />}
                    </Row>
                    <Row label="متوفر">
                      {p.in_stock ? (
                        <span className="inline-flex items-center gap-1 text-emerald">
                          <Check className="size-3.5" /> نعم
                        </span>
                      ) : (
                        <span className="text-destructive">لا</span>
                      )}
                    </Row>
                    <Row label="مميز">
                      {p.is_featured ? <Check className="size-3.5 text-gold" /> : <Minus className="size-3 text-muted-foreground" />}
                    </Row>
                    <Link
                      to="/product/$slug"
                      params={{ slug: p.slug }}
                      className="mt-2 block rounded-full bg-emerald py-2.5 text-center text-xs font-bold text-emerald-foreground"
                    >
                      عرض المنتج
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-border/50 pt-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{children}</span>
    </div>
  );
}
