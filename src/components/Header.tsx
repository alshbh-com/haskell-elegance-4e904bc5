import { Link } from "@tanstack/react-router";
import { Bell, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useSiteSettings } from "@/lib/site-settings";

export function Header() {
  const [dark, setDark] = useState(false);
  const s = useSiteSettings();

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

  const name = s?.platform_name || s?.store_name || "Haskell Store";

  return (
    <header
      className="sticky top-0 z-30 glass"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          {s?.logo_url ? (
            <img src={s.logo_url} alt={name} className="size-9 rounded-2xl object-cover shadow-luxury" />
          ) : (
            <span className="grid size-9 place-items-center rounded-2xl bg-gradient-to-br from-emerald to-emerald/70 text-gold shadow-luxury">
              <span className="font-display text-lg font-bold">{name.charAt(0)}</span>
            </span>
          )}
          <span className="font-display text-xl font-bold leading-none tracking-tight">
            {name}
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
