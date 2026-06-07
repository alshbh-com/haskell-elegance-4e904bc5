import { Link } from "@tanstack/react-router";
import { ShoppingBag, Search, Menu, Moon, Sun } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useEffect, useState } from "react";

export function Header() {
  const count = useCart((s) => s.count());
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <button className="p-2 -m-2" aria-label="القائمة">
          <Menu className="size-5" />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold tracking-tight">
            Haskell <span className="gold-text">Store</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} className="p-2 -m-2" aria-label="الثيم">
            {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
          <Link to="/search" className="p-2 -m-2" aria-label="بحث">
            <Search className="size-5" />
          </Link>
          <Link to="/cart" className="relative p-2 -m-2" aria-label="السلة">
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -start-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-gold-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
