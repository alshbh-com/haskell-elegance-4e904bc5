import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = { min: number; max: number };

function pick(min: number, max: number) {
  const lo = Math.max(1, Math.min(min, max));
  const hi = Math.max(lo + 1, max);
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

export function FakeViewers({ min, max }: Props) {
  const [n, setN] = useState(() => pick(min, max));

  useEffect(() => {
    const id = setInterval(() => {
      setN((prev) => {
        const delta = Math.random() < 0.5 ? -1 : 1;
        const step = Math.random() < 0.3 ? 2 : 1;
        let next = prev + delta * step;
        if (next < min) next = min + 1;
        if (next > max) next = max - 1;
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [min, max]);

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-emerald/10 px-3 py-1.5 text-xs font-semibold text-emerald dark:bg-emerald/20 dark:text-foreground">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
      </span>
      <Eye className="size-3.5" />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={n}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="tabular-nums"
        >
          {n}
        </motion.span>
      </AnimatePresence>
      <span>شخص بيشوفوا المنتج دلوقتي</span>
    </div>
  );
}
