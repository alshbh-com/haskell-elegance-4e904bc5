import { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export type FilterState = {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  sort: "newest" | "price_asc" | "price_desc" | "discount";
};

export const defaultFilters: FilterState = { sort: "newest" };

export function AdvancedFilters({
  value,
  onChange,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<FilterState>(value);

  useEffect(() => setDraft(value), [value, open]);

  const { data: categories } = useQuery({
    queryKey: ["filter-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("id,name,slug").eq("is_active", true);
      return data ?? [];
    },
  });

  const activeCount =
    (value.categoryId ? 1 : 0) +
    (value.minPrice ? 1 : 0) +
    (value.maxPrice ? 1 : 0) +
    (value.inStock ? 1 : 0) +
    (value.featured ? 1 : 0) +
    (value.sort !== "newest" ? 1 : 0);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:border-gold"
      >
        <SlidersHorizontal className="size-4" />
        فلاتر
        {activeCount > 0 && (
          <span className="grid size-5 place-items-center rounded-full bg-gold text-[10px] font-bold text-gold-foreground">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative ms-auto h-full w-full max-w-md overflow-auto bg-background shadow-luxury"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 p-4 backdrop-blur">
              <h2 className="font-display text-xl font-bold">فلاتر متقدمة</h2>
              <button onClick={() => setOpen(false)} aria-label="إغلاق" className="grid size-9 place-items-center rounded-full hover:bg-muted">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-6 p-5">
              <Section title="الترتيب">
                <div className="grid grid-cols-2 gap-2">
                  {([
                    ["newest", "الأحدث"],
                    ["price_asc", "السعر: الأقل"],
                    ["price_desc", "السعر: الأعلى"],
                    ["discount", "أكبر خصم"],
                  ] as const).map(([k, l]) => (
                    <Chip key={k} active={draft.sort === k} onClick={() => setDraft({ ...draft, sort: k })}>
                      {l}
                    </Chip>
                  ))}
                </div>
              </Section>

              <Section title="التصنيف">
                <div className="flex flex-wrap gap-2">
                  <Chip active={!draft.categoryId} onClick={() => setDraft({ ...draft, categoryId: undefined })}>
                    الكل
                  </Chip>
                  {(categories ?? []).map((c) => (
                    <Chip
                      key={c.id}
                      active={draft.categoryId === c.id}
                      onClick={() => setDraft({ ...draft, categoryId: c.id })}
                    >
                      {c.name}
                    </Chip>
                  ))}
                </div>
              </Section>

              <Section title="نطاق السعر (ج.م)">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="من"
                    value={draft.minPrice ?? ""}
                    onChange={(e) => setDraft({ ...draft, minPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="rounded-xl border border-input bg-card px-3 py-2.5 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="إلى"
                    value={draft.maxPrice ?? ""}
                    onChange={(e) => setDraft({ ...draft, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="rounded-xl border border-input bg-card px-3 py-2.5 text-sm"
                  />
                </div>
              </Section>

              <Section title="خيارات">
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-card p-3 text-sm">
                  <span>متوفر في المخزون</span>
                  <input
                    type="checkbox"
                    checked={!!draft.inStock}
                    onChange={(e) => setDraft({ ...draft, inStock: e.target.checked })}
                    className="size-5 accent-emerald"
                  />
                </label>
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-card p-3 text-sm">
                  <span>المنتجات المميزة فقط</span>
                  <input
                    type="checkbox"
                    checked={!!draft.featured}
                    onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                    className="size-5 accent-emerald"
                  />
                </label>
              </Section>
            </div>

            <div className="sticky bottom-0 flex gap-2 border-t border-border bg-background/95 p-4 backdrop-blur">
              <button
                onClick={() => {
                  setDraft(defaultFilters);
                  onChange(defaultFilters);
                  setOpen(false);
                }}
                className="flex-1 rounded-full border border-border py-3 text-sm font-bold"
              >
                مسح الكل
              </button>
              <button
                onClick={() => {
                  onChange(draft);
                  setOpen(false);
                }}
                className="flex-[2] rounded-full bg-gradient-to-l from-emerald to-emerald/85 py-3 text-sm font-bold text-emerald-foreground shadow-luxury"
              >
                تطبيق الفلاتر
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold text-muted-foreground">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
        active ? "border-emerald bg-emerald text-emerald-foreground" : "border-border bg-card hover:border-gold"
      }`}
    >
      {children}
    </button>
  );
}
