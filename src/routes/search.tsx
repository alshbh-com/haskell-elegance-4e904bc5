import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon } from "lucide-react";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "البحث — Haskell Store" }] }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const { data } = useQuery({
    queryKey: ["search", q],
    queryFn: async () => {
      const query = supabase.from("products").select("*").limit(30);
      const { data } = q.trim()
        ? await query.ilike("name", `%${q}%`)
        : await query;
      return data ?? [];
    },
  });

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
            placeholder="دور على منتج..."
            className="w-full rounded-full border border-input bg-card py-4 ps-12 pe-4 text-sm"
          />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {(data ?? []).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {(data ?? []).length === 0 && q && (
          <p className="mt-10 text-center text-sm text-muted-foreground">ولا منتج مطابق</p>
        )}
      </div>
      <Link to="/" className="hidden">home</Link>
    </div>
  );
}
