import { Link } from "@tanstack/react-router";
import { Bell, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
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
    <header
      className="sticky top-0 z-30 glass"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-2xl bg-gradient-to-br from-emerald to-emerald/70 text-gold shadow-luxury">
            <span className="font-display text-lg font-bold">H</span>
          </span>
          <span className="font-display text-xl font-bold leading-none tracking-tight">
            Haskell <span className="gold-text">Store</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} className="grid size-9 place-items-center rounded-2xl text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="الثيم">
            {dark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </button>
          <button className="relative grid size-9 place-items-center rounded-2xl text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="الإشعارات">
            <Bell className="size-[18px]" />
            <span className="absolute top-2 end-2 size-1.5 rounded-full bg-destructive" />
          </button>
        </div>
      </div>
    </header>
  );
}
