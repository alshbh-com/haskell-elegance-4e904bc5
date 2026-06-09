import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";

const pageQuery = (slug: string) =>
  queryOptions({
    queryKey: ["policy_page", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("policy_pages")
        .select("title,content,is_published")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      return data as { title: string; content: string } | null;
    },
  });

export const Route = createFileRoute("/page/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Haskell Store` },
    ],
  }),
  loader: ({ params, context }) => context.queryClient.ensureQueryData(pageQuery(params.slug)),
  component: PolicyPage,
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-sm text-destructive">خطأ: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-8 text-center">الصفحة مش موجودة</div>,
});

function PolicyPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(pageQuery(slug));

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold">الصفحة مش موجودة</h1>
          <Link to="/" className="mt-4 inline-block text-emerald underline">ارجع للرئيسية</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <article className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-display text-3xl font-bold">{data.title}</h1>
        <div
          className="prose prose-sm mt-6 max-w-none text-foreground prose-headings:font-display prose-headings:text-foreground prose-a:text-emerald"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </article>
    </div>
  );
}
