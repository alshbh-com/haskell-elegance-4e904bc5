import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

type Props = {
  product: {
    slug: string;
    name: string;
    price: number;
    compare_price: number | null;
    images: unknown;
  };
};

export function ProductCard({ product }: Props) {
  const images = Array.isArray(product.images) ? (product.images as string[]) : [];
  const img = images[0];
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
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
