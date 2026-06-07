import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";

const catQuery = (slug: string) => queryOptions({
  queryKey: ["cat", slug],
  queryFn: async () => {
    const { data: cat } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
    if (!cat) return { cat: null, products: [] };
    const { data: products } = await supabase.from("products").select("*").eq("category_id", cat.id);
    return { cat, products: products ?? [] };
  },
});

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => ({ meta: [{ title: `${params.slug} — Haskell Store` }] }),
  loader: ({ context, params }) => context.queryClient.ensureQueryData(catQuery(params.slug)),
  component: () => {
    const { slug } = Route.useParams();
    const { data } = useSuspenseQuery(catQuery(slug));
    if (!data.cat) return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="p-10 text-center">
          <p>التصنيف مش موجود</p>
          <Link to="/" className="text-emerald">ارجع</Link>
        </div>
      </div>
    );
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="font-display text-3xl font-bold">{data.cat.name}</h1>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {data.products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          {data.products.length === 0 && (
            <p className="mt-10 text-center text-sm text-muted-foreground">مفيش منتجات لسه في التصنيف ده</p>
          )}
        </div>
      </div>
    );
  },
  errorComponent: ({ error }) => <p className="p-8 text-center text-destructive">{error.message}</p>,
});
