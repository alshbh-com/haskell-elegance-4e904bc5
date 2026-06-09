import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/lib/site-settings";
import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";

type PolicyPage = { slug: string; title: string };

export function Footer() {
  const s = useSiteSettings();
  const [pages, setPages] = useState<PolicyPage[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data } = await supabase
        .from("policy_pages")
        .select("slug,title")
        .eq("is_published", true)
        .order("title");
      if (mounted) setPages((data as PolicyPage[]) ?? []);
    };
    load();
    const ch = supabase
      .channel("policy_pages_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "policy_pages" }, () => load())
      .subscribe();
    return () => { mounted = false; supabase.removeChannel(ch); };
  }, []);

  const social = s?.social_links ?? {};
  const name = s?.platform_name || s?.store_name || "Haskell Store";

  return (
    <footer className="mt-10 border-t border-border bg-card/40 px-4 py-8 text-sm">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        <div>
          <div className="font-display text-lg font-bold">{name}</div>
          <p className="mt-2 text-muted-foreground">{s?.seo?.description ?? "متجر فاخر — شحن سريع ودفع عند الاستلام."}</p>
        </div>
        <div>
          <div className="mb-2 font-bold">الصفحات</div>
          <ul className="space-y-1.5">
            {pages.map((p) => (
              <li key={p.slug}>
                <Link to="/page/$slug" params={{ slug: p.slug }} className="text-muted-foreground hover:text-foreground">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-2 font-bold">تابعنا</div>
          <div className="flex gap-3">
            {social.facebook && <a href={social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook className="size-5" /></a>}
            {social.instagram && <a href={social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram className="size-5" /></a>}
            {social.tiktok && <a href={social.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok"><span className="text-base font-bold">TT</span></a>}
            {social.youtube && <a href={social.youtube} target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube className="size-5" /></a>}
            {social.whatsapp && <a href={social.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle className="size-5" /></a>}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-6 max-w-7xl border-t border-border pt-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {name}
      </div>
    </footer>
  );
}
