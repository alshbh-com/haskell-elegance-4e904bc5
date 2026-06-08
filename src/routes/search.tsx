import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { AdvancedFilters, defaultFilters, type FilterState } from "@/components/AdvancedFilters";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, Mic, Sparkles, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { aiRankProducts } from "@/lib/ai-search.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "البحث الذكي — Haskell Store" }] }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [useAI, setUseAI] = useState(false);
  const [aiIds, setAiIds] = useState<string[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<unknown>(null);
  const rank = useServerFn(aiRankProducts);

  const { data: rawData } = useQuery({
    queryKey: ["search", q, filters],
    queryFn: async () => {
      let query = supabase.from("products").select("*").limit(60);
      if (q.trim() && !useAI) query = query.ilike("name", `%${q}%`);
      if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
      if (filters.minPrice) query = query.gte("price", filters.minPrice);
      if (filters.maxPrice) query = query.lte("price", filters.maxPrice);
      if (filters.inStock) query = query.eq("in_stock", true);
      if (filters.featured) query = query.eq("is_featured", true);
      if (filters.sort === "price_asc") query = query.order("price", { ascending: true });
      else if (filters.sort === "price_desc") query = query.order("price", { ascending: false });
      else query = query.order("created_at", { ascending: false });
      const { data } = await query;
      return data ?? [];
    },
  });

  let results = rawData ?? [];
  if (filters.sort === "discount") {
    results = [...results].sort((a, b) => {
      const da = a.compare_price ? (a.compare_price - a.price) / a.compare_price : 0;
      const db = b.compare_price ? (b.compare_price - b.price) / b.compare_price : 0;
      return db - da;
    });
  }
  if (useAI && aiIds && aiIds.length > 0) {
    const order = new Map(aiIds.map((id, i) => [id, i]));
    results = results
      .filter((p) => order.has(p.id))
      .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
  }

  const runAI = async () => {
    if (!q.trim() || !rawData) return;
    setAiLoading(true);
    try {
      const res = await rank({
        data: {
          query: q.trim(),
          products: rawData.map((p) => ({ id: p.id, name: p.name, description: p.description })),
        },
      });
      setAiIds(res.ids);
      toast.success("تم البحث الذكي ✨");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg === "RATE_LIMIT") toast.error("هدّي شوية — حاول تاني بعد دقيقة");
      else if (msg === "CREDITS") toast.error("نفدت رصيدك من AI");
      else toast.error("مش قادر أعمل بحث ذكي دلوقتي");
      setUseAI(false);
    } finally {
      setAiLoading(false);
    }
  };

  const startVoice = () => {
    const SR =
      (window as unknown as { SpeechRecognition?: new () => unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;
    if (!SR) {
      toast.error("متصفحك مش بيدعم البحث الصوتي");
      return;
    }
    const rec = new SR() as {
      lang: string;
      interimResults: boolean;
      start: () => void;
      stop: () => void;
      onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
      onend: () => void;
      onerror: () => void;
    };
    rec.lang = "ar-EG";
    rec.interimResults = false;
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setQ(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
  };

  // Reset AI ids when query/filters change
  useEffect(() => {
    setAiIds(null);
  }, [q, filters]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="relative">
          <SearchIcon className="absolute top-1/2 start-4 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="دور على منتج... (مثال: ساعة فخمة باللون الأسود)"
            className="w-full rounded-full border border-input bg-card py-4 ps-12 pe-24 text-sm"
          />
          <button
            onClick={startVoice}
            aria-label="بحث صوتي"
            className={`absolute top-1/2 end-3 grid size-10 -translate-y-1/2 place-items-center rounded-full transition ${
              listening ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-emerald text-emerald-foreground"
            }`}
          >
            <Mic className="size-4" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <AdvancedFilters value={filters} onChange={setFilters} />
          <button
            onClick={async () => {
              const next = !useAI;
              setUseAI(next);
              if (next && q.trim()) await runAI();
            }}
            disabled={aiLoading}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
              useAI
                ? "border-gold bg-gradient-to-l from-gold to-gold/85 text-gold-foreground shadow-gold"
                : "border-border bg-card hover:border-gold"
            }`}
          >
            {aiLoading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            بحث ذكي AI
          </button>
          {useAI && q.trim() && !aiLoading && (
            <button
              onClick={runAI}
              className="text-xs text-muted-foreground underline hover:text-foreground"
            >
              تحديث
            </button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {results.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {results.length === 0 && q && (
          <p className="mt-10 text-center text-sm text-muted-foreground">ولا منتج مطابق</p>
        )}
      </div>
      <Link to="/" className="hidden">home</Link>
    </div>
  );
}
