import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ShoppingBag, Zap, ShieldCheck, Truck, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { FakeViewers } from "@/components/FakeViewers";
import { FakeStock } from "@/components/FakeStock";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/lib/cart-store";
import { trackViewed } from "@/lib/recently-viewed";

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

  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<string | undefined>(sizes[0]);
  const [color, setColor] = useState<string | undefined>(colors[0]);

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  useEffect(() => {
    trackViewed(product.slug);
  }, [product.slug]);

  // You Might Also Like — same category, exclude current
  const { data: related } = useQuery({
    queryKey: ["related", product.category_id, product.id],
    enabled: !!product.category_id,
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

  const handleAdd = (buyNow = false) => {
    add({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: images[0],
      quantity: 1,
      size,
      color,
    });
    toast.success("تمت الإضافة للسلة ✨");
    if (buyNow) navigate({ to: "/checkout" });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header />

      {/* breadcrumbs */}
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
              {product.price.toLocaleString("ar-EG")} <span className="text-lg">ج.م</span>
            </span>
            {product.compare_price && (
              <span className="text-lg text-muted-foreground line-through">
                {product.compare_price.toLocaleString("ar-EG")}
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
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      size === s
                        ? "border-emerald bg-emerald text-emerald-foreground"
                        : "border-border bg-card hover:border-emerald"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-bold">اللون</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      color === c
                        ? "border-gold bg-gold/15 text-foreground"
                        : "border-border bg-card hover:border-gold"
                    }`}
                  >
                    {c}
                  </button>
                ))}
        </div>
      </div>

      {/* You Might Also Like */}
      {related && related.length > 0 && (
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

          )}

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-card p-3 shadow-soft">
            <Trust icon={<Truck className="size-4" />} label="شحن سريع" />
            <Trust icon={<ShieldCheck className="size-4" />} label="ضمان جودة" />
            <Trust icon={<RotateCcw className="size-4" />} label="استرجاع 14 يوم" />
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-2">
          <button
            onClick={() => handleAdd(false)}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-emerald bg-background py-3 text-sm font-bold text-emerald transition hover:bg-emerald/5"
          >
            <ShoppingBag className="size-4" /> أضف للسلة
          </button>
          <button
            onClick={() => handleAdd(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-l from-emerald to-emerald/85 py-3 text-sm font-bold text-emerald-foreground shadow-luxury transition hover:scale-[1.02]"
          >
            <Zap className="size-4" fill="currentColor" /> اشترِ الآن
          </button>
        </div>
      </div>
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
