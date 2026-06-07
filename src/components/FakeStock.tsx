import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

type Props = { productId: string; min: number; max: number };

export function FakeStock({ productId, min, max }: Props) {
  const [stock, setStock] = useState<number | null>(null);

  useEffect(() => {
    const key = `fake_stock_${productId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      setStock(parseInt(stored, 10));
    } else {
      const lo = Math.max(1, min);
      const hi = Math.max(lo + 1, max);
      const v = Math.floor(Math.random() * (hi - lo + 1)) + lo;
      localStorage.setItem(key, String(v));
      setStock(v);
    }
  }, [productId, min, max]);

  if (stock === null) return null;
  const urgent = stock <= 3;

  return (
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
  );
}
