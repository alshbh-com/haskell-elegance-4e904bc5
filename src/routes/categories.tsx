import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const q = queryOptions({
  queryKey: ["all-categories"],
  queryFn: async () => {
    const { data } = await supabase.from("categories").select("*").eq("is_active", true).order("sort_order");
    return data ?? [];
  },
});

export const Route = createFileRoute("/categories")({
  head: () => ({ meta: [{ title: "التصنيفات — Haskell Store" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(q),
  component: () => {
    const { data } = useSuspenseQuery(q);
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="font-display text-3xl font-bold">كل التصنيفات</h1>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {data.map((c) => (
              <Link
                key={c.id}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="group relative block aspect-square overflow-hidden rounded-3xl shadow-soft"
              >
                {c.image && (
                  <img src={c.image} alt={c.name} loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-110" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald/90 via-emerald/30 to-transparent" />
                <h3 className="absolute inset-x-0 bottom-3 px-4 font-display text-lg font-bold text-background">{c.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  },
  errorComponent: ({ error }) => <p className="p-8 text-center text-destructive">{error.message}</p>,
});
