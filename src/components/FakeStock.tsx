import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

type Props = { productId: string; min: number; max: number };

export function FakeStock({ productId, min, max }: Props) {
  const [stock, setStock] = useState<number | null>(null);
  const [initial, setInitial] = useState<number>(0);

  useEffect(() => {
    const key = `fake_stock_${productId}`;
    const initKey = `fake_stock_init_${productId}`;
    const stored = localStorage.getItem(key);
    const storedInit = localStorage.getItem(initKey);
    if (stored && storedInit) {
      setStock(parseInt(stored, 10));
      setInitial(parseInt(storedInit, 10));
    } else {
      const lo = Math.max(1, min);
      const hi = Math.max(lo + 1, max);
      const v = Math.floor(Math.random() * (hi - lo + 1)) + lo;
      const i = Math.max(v + 20, hi + 30);
      localStorage.setItem(key, String(v));
      localStorage.setItem(initKey, String(i));
      setStock(v);
      setInitial(i);
    }
  }, [productId, min, max]);

  if (stock === null) return null;
  const urgent = stock <= 3;
  const sold = Math.max(0, initial - stock);
  const pct = Math.min(100, Math.round((sold / Math.max(1, initial)) * 100));

  return (
    <div className="w-full max-w-xs space-y-1.5">
      <div
        className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold ${
          urgent
            ? "bg-destructive text-destructive-foreground animate-pulse-urgent"
            : "bg-gold/15 text-gold-foreground"
        }`}
      >
        <Zap className={`size-3.5 ${urgent ? "" : "text-gold"}`} fill="currentColor" />
        بقي <span className="tabular-nums text-sm">{stock}</span> قطع فقط!
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`absolute inset-y-0 start-0 rounded-full transition-all ${
            urgent ? "bg-destructive" : "bg-gradient-to-l from-emerald to-gold"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground">اتباع {sold} قطعة من {initial}</p>
    </div>
  );
}
