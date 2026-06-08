import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/lib/cart-store";

const items = [
  { to: "/", label: "الرئيسية", icon: Home },
  { to: "/categories", label: "التصنيفات", icon: LayoutGrid },
  { to: "/search", label: "بحث", icon: Search },
  { to: "/cart", label: "السلة", icon: ShoppingBag },
  { to: "/more", label: "المزيد", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const count = useCart((s) => s.count());

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-card/85 backdrop-blur-2xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="التنقل السفلي"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <li key={to}>
              <Link
                to={to}
                className="relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold"
              >
                <span
                  className={`relative grid size-9 place-items-center rounded-2xl transition ${
                    active ? "bg-emerald text-emerald-foreground shadow-luxury" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="size-[18px]" />
                  {to === "/cart" && count > 0 && (
                    <span className="absolute -top-1 -start-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[9px] font-bold text-gold-foreground">
                      {count}
                    </span>
                  )}
                </span>
                <span className={active ? "text-foreground" : "text-muted-foreground"}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
