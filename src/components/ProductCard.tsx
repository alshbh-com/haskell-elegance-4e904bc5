import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Scale } from "lucide-react";
import { QuickViewButton } from "@/components/QuickView";
import { useCompare } from "@/lib/compare-store";
import { toast } from "sonner";

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compare_price: number | null;
  description?: string | null;
  images: unknown;
  sizes?: unknown;
  colors?: unknown;
};

export function ProductCard({ product }: { product: Product }) {
  const images = Array.isArray(product.images) ? (product.images as string[]) : [];
  const img = images[0];
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;
  const toggle = useCompare((s) => s.toggle);
  const has = useCompare((s) => s.has(product.id));
  const count = useCompare((s) => s.items.length);

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="relative">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="group block overflow-hidden rounded-3xl bg-card shadow-soft transition-shadow hover:shadow-luxury"
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          {img ? (
            <img
              src={img}
              alt={product.name}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid size-full place-items-center text-muted-foreground">
              <span className="font-display text-3xl gold-text">H</span>
            </div>
          )}
          {discount > 0 && (
            <span className="absolute top-3 start-3 rounded-full bg-destructive px-2.5 py-1 text-[10px] font-bold text-destructive-foreground">
              خصم {discount}%
            </span>
          )}
          {/* Action overlay */}
          <div className="absolute top-3 end-3 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100 md:opacity-100">
            <QuickViewButton product={product} />
            <button
              type="button"
              aria-label="إضافة للمقارنة"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!has && count >= 4) {
                  toast.error("الحد الأقصى 4 منتجات للمقارنة");
                  return;
                }
                toggle({
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  compare_price: product.compare_price,
                  image: img,
                });
                toast.success(has ? "اتشال من المقارنة" : "اتضاف للمقارنة ⚖️");
              }}
              className={`grid size-9 place-items-center rounded-full shadow-soft backdrop-blur transition ${
                has
                  ? "bg-emerald text-emerald-foreground"
                  : "bg-card/95 text-foreground hover:bg-emerald hover:text-emerald-foreground"
              }`}
            >
              <Scale className="size-4" />
            </button>
          </div>
        </div>
        <div className="p-3.5">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{product.name}</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-lg font-bold text-emerald dark:text-foreground">
              {product.price.toLocaleString("ar-EG")} ج.م
            </span>
            {product.compare_price && (
              <span className="text-xs text-muted-foreground line-through">
                {product.compare_price.toLocaleString("ar-EG")}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
