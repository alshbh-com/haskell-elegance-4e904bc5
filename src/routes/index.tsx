import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Marquee } from "@/components/Marquee";
import { ProductCard } from "@/components/ProductCard";
import heroImg from "@/assets/hero.jpg";

const homeQuery = queryOptions({
  queryKey: ["home"],
  queryFn: async () => {
    const [settings, categories, featured, bestsellers, offers] = await Promise.all([
      supabase.from("app_settings").select("*").limit(1).maybeSingle(),
      supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("products").select("*").eq("is_featured", true).limit(8),
      supabase.from("products").select("*").eq("is_bestseller", true).limit(8),
      supabase.from("products").select("*").not("compare_price", "is", null).limit(8),
    ]);
    return {
      settings: settings.data,
      categories: categories.data ?? [],
      featured: featured.data ?? [],
      bestsellers: bestsellers.data ?? [],
      offers: offers.data ?? [],
    };
  },
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Haskell Store — متجر الفخامة" },
      { name: "description", content: "Haskell Store — تشكيلة فاخرة من الساعات والعطور والإكسسوارات. شحن سريع ودفع عند الاستلام." },
      { property: "og:title", content: "Haskell Store" },
      { property: "og:description", content: "متجر الفخامة الأول — ساعات، عطور، حقائب، إكسسوارات" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(homeQuery),
  component: HomePage,
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-sm text-muted-foreground">حصل خطأ: {error.message}</div>
  ),
});

function HomePage() {
  const { data } = useSuspenseQuery(homeQuery);
  const announcements = Array.isArray(data.settings?.announcements)
    ? (data.settings!.announcements as string[])
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Marquee items={announcements} />
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-10">
          <div className="relative overflow-hidden rounded-[2rem] bg-emerald shadow-luxury">
            <img
              src={heroImg}
              alt="Haskell Luxury Collection"
              className="absolute inset-0 size-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald via-emerald/60 to-transparent" />
            <div className="relative px-6 py-16 md:px-12 md:py-24">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="max-w-xl"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-3 py-1 text-xs font-bold text-gold backdrop-blur">
                  <Sparkles className="size-3.5" /> مجموعة 2026 الفاخرة
                </span>
                <h1 className="mt-5 font-display text-5xl font-bold leading-tight text-background md:text-7xl">
                  فخامة <span className="gold-text">حقيقية</span>
                  <br />
                  بكل تفصيلة
                </h1>
                <p className="mt-4 max-w-md text-sm text-background/85 md:text-base">
                  اكتشف تشكيلة Haskell من الساعات والعطور والإكسسوارات — مختارة بعناية، توصيل سريع، دفع عند الاستلام.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to="/categories"
                    className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-gold-foreground shadow-gold transition-transform hover:scale-105"
                  >
                    تسوق دلوقتي <ArrowLeft className="size-4 rtl:rotate-180" />
                  </Link>
                  <Link
                    to="/more"
                    className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-background/10 px-6 py-3 text-sm font-bold text-background backdrop-blur transition-colors hover:bg-background/20"
                  >
                    اعرف أكتر
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <SectionHeader title="تسوق حسب التصنيف" subtitle="كل اللي بتدور عليه في مكان واحد" />
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {data.categories.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="group relative block aspect-square overflow-hidden rounded-3xl shadow-soft"
              >
                {c.image && (
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald/90 via-emerald/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-display text-lg font-bold text-background">{c.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      {data.featured.length > 0 && (
        <ProductSection title="المنتجات المميزة" subtitle="مختارة بعناية لك" products={data.featured} />
      )}

      {/* BESTSELLERS */}
      {data.bestsellers.length > 0 && (
        <ProductSection title="الأكثر مبيعاً" subtitle="الأكتر طلباً عند عملائنا" products={data.bestsellers} />
      )}

      {/* OFFERS */}
      {data.offers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8">
          <div className="rounded-3xl bg-gradient-to-br from-emerald to-emerald/80 p-6 shadow-luxury md:p-10">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-3 py-1 text-xs font-bold text-gold">
                  <Sparkles className="size-3.5" /> عروض حصرية
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold text-background md:text-4xl">
                  وفر <span className="gold-text">لحد 40%</span>
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {data.offers.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="mt-10 border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center">
          <p className="font-display text-2xl font-bold">Haskell <span className="gold-text">Store</span></p>
          <p className="mt-2 text-xs text-muted-foreground">© 2026 — كل الحقوق محفوظة</p>
          <div className="mt-4 flex justify-center gap-4 text-xs">
            <Link to="/track" className="text-muted-foreground hover:text-foreground">تتبع الطلب</Link>
            <Link to="/more" className="text-muted-foreground hover:text-foreground">السياسات</Link>
            <Link to="/admin" className="text-muted-foreground hover:text-foreground">الأدمن</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-2xl font-bold md:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-muted-foreground md:text-sm">{subtitle}</p>}
      </div>
    </div>
  );
}

function ProductSection({
  title,
  subtitle,
  products,
}: {
  title: string;
  subtitle?: string;
  products: Array<{ id: string; slug: string; name: string; price: number; compare_price: number | null; images: unknown }>;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <SectionHeader title={title} subtitle={subtitle} />
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
