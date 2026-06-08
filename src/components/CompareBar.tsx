import { Link, useRouterState } from "@tanstack/react-router";
import { Scale, X } from "lucide-react";
import { useCompare } from "@/lib/compare-store";

export function CompareBar() {
  const items = useCompare((s) => s.items);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (items.length === 0 || pathname === "/compare") return null;

  return (
    <div className="fixed inset-x-0 bottom-20 z-40 px-3" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-border bg-card/95 p-3 shadow-luxury backdrop-blur-xl">
        <div className="flex items-center gap-1.5 text-gold">
          <Scale className="size-4" />
          <span className="text-xs font-bold">المقارنة ({items.length}/4)</span>
        </div>
        <div className="flex flex-1 gap-1.5 overflow-x-auto">
          {items.map((it) => (
            <div key={it.id} className="relative shrink-0">
              <div className="size-10 overflow-hidden rounded-lg bg-muted">
                {it.image && <img src={it.image} alt="" className="size-full object-cover" />}
              </div>
              <button
                onClick={() => remove(it.id)}
                className="absolute -top-1 -end-1 grid size-4 place-items-center rounded-full bg-destructive text-destructive-foreground"
                aria-label="إزالة"
              >
                <X className="size-2.5" />
              </button>
            </div>
          ))}
        </div>
        <button onClick={clear} className="text-[10px] text-muted-foreground hover:text-destructive">
          مسح
        </button>
        <Link
          to="/compare"
          className="rounded-full bg-emerald px-4 py-2 text-xs font-bold text-emerald-foreground"
        >
          قارن
        </Link>
      </div>
    </div>
  );
}
