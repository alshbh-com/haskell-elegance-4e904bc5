import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ShoppingBag, Zap, ShieldCheck, Truck, RotateCcw, Sparkles, Minus, Plus, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { FakeViewers } from "@/components/FakeViewers";
import { FakeStock } from "@/components/FakeStock";
import { ProductCard } from "@/components/ProductCard";
import { BuyNowDrawer } from "@/components/BuyNowDrawer";
import { useCart } from "@/lib/cart-store";
import { trackViewed } from "@/lib/recently-viewed";
import { trackPixelEvent } from "@/lib/pixel-tracking";

const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

type QtyTier = { qty: number; discount: number };

export const Route = createFileRoute("/product/$slug")({
  head: ({ loaderData }) => {
    const p = loaderData as { name?: string; description?: string; images?: unknown } | undefined;
    const img = Array.isArray(p?.images) ? (p!.images as string[])[0] : undefined;
    return {
      meta: [
        { title: `${p?.name ?? "منتج"} — Haskell Store` },
        { name: "description", content: p?.description?.slice(0, 160) ?? "" },
        { property: "og:title", content: p?.name ?? "Haskell Store" },
        { property: "og:description", content: p?.description?.slice(0, 160) ?? "" },
        { property: "og:type", content: "product" },
        ...(img ? [{ property: "og:image", content: img }] : []),
      ],
    };
  },
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(productQuery(params.slug));
    return data;
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center p-8 text-center">
      <div>
        <h1 className="font-display text-3xl font-bold">المنتج مش موجود</h1>
        <Link to="/" className="mt-4 inline-block text-sm text-emerald underline">ارجع للرئيسية</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-sm text-destructive">خطأ: {error.message}</div>
  ),
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(slug));
  const navigate = useNavigate();
  const add = useCart((s) => s.add);

  const images = Array.isArray(product.images) ? (product.images as string[]) : [];
  const sizes = Array.isArray(product.sizes) ? (product.sizes as string[]) : [];
  const colors = Array.isArray(product.colors) ? (product.colors as string[]) : [];

  // Quantity-break tiers from products.quantity_pricing JSON
  const tiers: QtyTier[] = useMemo(() => {
    const raw = (product as unknown as { quantity_pricing?: unknown }).quantity_pricing;
    if (!Array.isArray(raw)) return [];
    return (raw as Array<{ qty?: number; discount?: number }>)
      .filter((t) => Number(t.qty) >= 2 && Number(t.discount) > 0)
      .map((t) => ({ qty: Number(t.qty), discount: Number(t.discount) }))
      .sort((a, b) => a.qty - b.qty);
  }, [product]);

  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<string | undefined>(sizes[0]);
  const [color, setColor] = useState<string | undefined>(colors[0]);
  const [qty, setQty] = useState(1);
  const [buyOpen, setBuyOpen] = useState(false);

  const activeTier = useMemo(() => {
    const matching = tiers.filter((t) => qty >= t.qty);
    return matching.length ? matching[matching.length - 1] : null;
  }, [tiers, qty]);

  const unitPrice = activeTier
    ? Math.round(product.price * (1 - activeTier.discount / 100))
    : product.price;
  const lineTotal = unitPrice * qty;
  const savings = (product.price - unitPrice) * qty;

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  useEffect(() => {
    trackViewed(product.slug);
    trackPixelEvent("ViewContent", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: unitPrice,
      currency: "EGP",
    });
  }, [product.slug, product.id, product.name, unitPrice]);

  // Global + per-product show_related toggle
  const showRelatedProduct = (product as unknown as { show_related?: boolean | null }).show_related;
  const { data: settings } = useQuery({
    queryKey: ["settings-show-related"],
    queryFn: async () => {
      const { data } = await supabase.from("app_settings").select("show_related_global").limit(1).maybeSingle();
      return (data as { show_related_global?: boolean } | null) ?? null;
    },
  });
  const showRelated =
    showRelatedProduct === false ? false :
    showRelatedProduct === true ? true :
    settings?.show_related_global !== false;

  const { data: related } = useQuery({
    queryKey: ["related", product.category_id, product.id],
    enabled: !!product.category_id && showRelated,
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", product.category_id!)
        .neq("id", product.id)
        .limit(4);
      return data ?? [];
    },
  });

  const handleAdd = () => {
    add({
      product_id: product.id,
      name: product.name,
      price: unitPrice,
      image: images[0],
      quantity: qty,
      size,
      color,
    });
    toast.success("تمت الإضافة للسلة ✨");
  };

  const handleBuyNow = () => setBuyOpen(true);

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header />

      <nav className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 pt-3 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">الرئيسية</Link>
        <ChevronRight className="size-3 rtl:rotate-180" />
        <span className="line-clamp-1 text-foreground">{product.name}</span>
      </nav>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-5 md:grid-cols-2 md:gap-10">
        {/* GALLERY */}
        <div>
          <motion.div
            key={activeImg}
            initial={{ opacity: 0.6, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square overflow-hidden rounded-3xl bg-muted shadow-soft"
          >
            {images[activeImg] ? (
              <img src={images[activeImg]} alt={product.name} className="size-full object-cover" />
            ) : (
              <div className="grid size-full place-items-center font-display text-6xl gold-text">H</div>
            )}
            {discount > 0 && (
              <span className="absolute top-4 start-4 rounded-full bg-destructive px-3 py-1.5 text-xs font-bold text-destructive-foreground shadow-soft">
                خصم {discount}%
              </span>
            )}
          </motion.div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative size-20 shrink-0 overflow-hidden rounded-2xl ring-2 transition ${
                    activeImg === i ? "ring-gold" : "ring-transparent"
                  }`}
                >
                  <img src={img} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <FakeViewers min={product.fake_viewers_min} max={product.fake_viewers_max} />
            <FakeStock productId={product.id} min={product.fake_stock_min} max={product.fake_stock_max} />
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold text-emerald dark:text-foreground">
              {unitPrice.toLocaleString("ar-EG")} <span className="text-lg">ج.م</span>
            </span>
            {(activeTier || product.compare_price) && (
              <span className="text-lg text-muted-foreground line-through">
                {(activeTier ? product.price : product.compare_price!).toLocaleString("ar-EG")}
              </span>
            )}
          </div>

          {product.description && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              {product.description}
            </p>
          )}

          {sizes.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-xs font-bold">المقاس</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      size === s ? "border-emerald bg-emerald text-emerald-foreground" : "border-border bg-card hover:border-emerald"
                    }`}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-bold">اللون</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      color === c ? "border-gold bg-gold/15 text-foreground" : "border-border bg-card hover:border-gold"
                    }`}>{c}</button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-xs font-bold">الكمية</span>
            <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-9 place-items-center rounded-full hover:bg-muted">
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center font-bold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="grid size-9 place-items-center rounded-full hover:bg-muted">
                <Plus className="size-4" />
              </button>
            </div>
            {savings > 0 && (
              <span className="text-xs font-bold text-emerald">وفرت {savings.toLocaleString("ar-EG")} ج.م</span>
            )}
          </div>

          {/* Quantity-break tiers */}
          {tiers.length > 0 && (
            <div className="mt-5 rounded-2xl border border-gold/30 bg-gold/5 p-3">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-gold">
                <TrendingDown className="size-3.5" /> اشترِ أكتر ووفر أكتر
              </div>
              <div className="grid grid-cols-3 gap-2">
                {tiers.map((t) => {
                  const isActive = activeTier?.qty === t.qty;
                  return (
                    <button
                      key={t.qty}
                      onClick={() => setQty(t.qty)}
                      className={`rounded-xl border p-2 text-center transition ${
                        isActive ? "border-gold bg-gold/15" : "border-border bg-card hover:border-gold/50"
                      }`}
                    >
                      <p className="text-xs font-bold">اشترِ {t.qty}</p>
                      <p className="mt-0.5 text-[10px] text-emerald">خصم {t.discount}%</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-card p-3 shadow-soft">
            <Trust icon={<Truck className="size-4" />} label="شحن سريع" />
            <Trust icon={<ShieldCheck className="size-4" />} label="ضمان جودة" />
            <Trust icon={<RotateCcw className="size-4" />} label="استرجاع 14 يوم" />
          </div>
        </div>
      </div>

      {showRelated && related && related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-10 pt-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-gold" />
            <h2 className="font-display text-2xl font-bold md:text-3xl">يمكن يعجبك كمان</h2>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 z-50 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-xl"
        style={{ bottom: "calc(72px + env(safe-area-inset-bottom))" }}>
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          <div className="hidden flex-1 md:block">
            <p className="text-[10px] text-muted-foreground">الإجمالي</p>
            <p className="font-display text-lg font-bold text-emerald dark:text-foreground">
              {lineTotal.toLocaleString("ar-EG")} ج.م
            </p>
          </div>
          <button onClick={handleAdd}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-emerald bg-background py-3 text-sm font-bold text-emerald transition hover:bg-emerald/5">
            <ShoppingBag className="size-4" /> أضف للسلة
          </button>
          <button onClick={handleBuyNow}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-l from-emerald to-emerald/85 py-3 text-sm font-bold text-emerald-foreground shadow-luxury transition hover:scale-[1.02]">
            <Zap className="size-4" fill="currentColor" /> اشترِ الآن
          </button>
        </div>
      </div>

      <BuyNowDrawer
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
        item={{
          product_id: product.id,
          name: product.name,
          price: unitPrice,
          image: images[0],
          quantity: qty,
          size,
          color,
        }}
      />
    </div>
  );
}

function Trust({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <div className="text-emerald dark:text-gold">{icon}</div>
      <span className="text-[10px] font-semibold text-muted-foreground">{label}</span>
    </div>
  );
}
