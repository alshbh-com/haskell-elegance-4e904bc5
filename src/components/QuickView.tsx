import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-store";

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

export function QuickViewButton({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-label="معاينة سريعة"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className="grid size-9 place-items-center rounded-full bg-card/95 text-foreground shadow-soft backdrop-blur transition hover:bg-gold hover:text-gold-foreground"
      >
        <Eye className="size-4" />
      </button>
      {open && <QuickViewDialog product={product} onClose={() => setOpen(false)} />}
    </>
  );
}

function QuickViewDialog({ product, onClose }: { product: Product; onClose: () => void }) {
  const add = useCart((s) => s.add);
  const images = Array.isArray(product.images) ? (product.images as string[]) : [];
  const sizes = Array.isArray(product.sizes) ? (product.sizes as string[]) : [];
  const colors = Array.isArray(product.colors) ? (product.colors as string[]) : [];
  const [size, setSize] = useState<string | undefined>(sizes[0]);
  const [color, setColor] = useState<string | undefined>(colors[0]);

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl bg-background shadow-luxury"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 end-3 z-10 grid size-9 place-items-center rounded-full bg-card text-muted-foreground shadow-soft hover:text-foreground"
          aria-label="إغلاق"
        >
          <X className="size-4" />
        </button>
        <div className="grid gap-5 p-5 md:grid-cols-2 md:p-7">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
            {images[0] ? (
              <img src={images[0]} alt={product.name} className="size-full object-cover" />
            ) : (
              <div className="grid size-full place-items-center font-display text-5xl gold-text">H</div>
            )}
            {discount > 0 && (
              <span className="absolute top-3 start-3 rounded-full bg-destructive px-2.5 py-1 text-[10px] font-bold text-destructive-foreground">
                خصم {discount}%
              </span>
            )}
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold leading-tight">{product.name}</h2>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-emerald dark:text-foreground">
                {product.price.toLocaleString("ar-EG")} <span className="text-sm">ج.م</span>
              </span>
              {product.compare_price && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.compare_price.toLocaleString("ar-EG")}
                </span>
              )}
            </div>
            {product.description && (
              <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}
            {sizes.length > 0 && (
              <div className="mt-4">
                <p className="mb-1.5 text-xs font-bold">المقاس</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                        size === s
                          ? "border-emerald bg-emerald text-emerald-foreground"
                          : "border-border bg-card"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {colors.length > 0 && (
              <div className="mt-3">
                <p className="mb-1.5 text-xs font-bold">اللون</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                        color === c ? "border-gold bg-gold/15" : "border-border bg-card"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
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
                  onClose();
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-l from-emerald to-emerald/85 py-2.5 text-sm font-bold text-emerald-foreground shadow-luxury"
              >
                <ShoppingBag className="size-4" /> أضف للسلة
              </button>
              <Link
                to="/product/$slug"
                params={{ slug: product.slug }}
                onClick={onClose}
                className="flex items-center justify-center rounded-full border border-border bg-card px-4 py-2.5 text-sm font-bold"
              >
                التفاصيل
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
