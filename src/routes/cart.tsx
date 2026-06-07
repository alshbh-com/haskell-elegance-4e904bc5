import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { useCart } from "@/lib/cart-store";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "السلة — Haskell Store" }] }),
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const updateQty = useCart((s) => s.updateQty);
  const remove = useCart((s) => s.remove);
  const total = useCart((s) => s.total());

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="font-display text-3xl font-bold">سلة المشتريات</h1>

        {items.length === 0 ? (
          <div className="mt-12 grid place-items-center gap-3 text-center">
            <ShoppingBag className="size-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">السلة فاضية لسه</p>
            <Link to="/" className="mt-2 rounded-full bg-emerald px-6 py-3 text-sm font-bold text-emerald-foreground">
              ابدأ التسوق
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-6 space-y-3">
              {items.map((i) => (
                <li
                  key={`${i.product_id}-${i.size}-${i.color}`}
                  className="flex gap-3 rounded-2xl bg-card p-3 shadow-soft"
                >
                  {i.image && (
                    <img src={i.image} alt="" className="size-20 rounded-xl object-cover" />
                  )}
                  <div className="flex-1">
                    <p className="line-clamp-2 text-sm font-bold">{i.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {i.size && <>المقاس: {i.size} • </>}
                      {i.color}
                    </p>
                    <p className="mt-1 font-display text-lg font-bold text-emerald dark:text-foreground">
                      {(i.price * i.quantity).toLocaleString("ar-EG")} ج.م
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => remove(i.product_id, i.size, i.color)}
                      className="p-1 text-destructive"
                      aria-label="حذف"
                    >
                      <Trash2 className="size-4" />
                    </button>
                    <div className="flex items-center gap-2 rounded-full border border-border">
                      <button
                        onClick={() => updateQty(i.product_id, i.quantity - 1, i.size, i.color)}
                        className="p-1.5"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="min-w-6 text-center text-sm font-bold">{i.quantity}</span>
                      <button
                        onClick={() => updateQty(i.product_id, i.quantity + 1, i.size, i.color)}
                        className="p-1.5"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-3xl bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">الإجمالي</span>
                <span className="font-display text-2xl font-bold text-emerald dark:text-foreground">
                  {total.toLocaleString("ar-EG")} ج.م
                </span>
              </div>
              <Link
                to="/checkout"
                className="mt-4 block rounded-full bg-gradient-to-l from-emerald to-emerald/85 py-3.5 text-center text-sm font-bold text-emerald-foreground shadow-luxury"
              >
                إتمام الشراء
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
