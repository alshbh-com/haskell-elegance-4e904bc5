import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SocialLinks = {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  whatsapp?: string;
  youtube?: string;
  x?: string;
};

export type SeoSettings = {
  title?: string;
  description?: string;
  keywords?: string;
  og_image?: string;
  canonical?: string;
};

export type SiteSettings = {
  id: string;
  platform_name: string;
  store_name: string;
  logo_url: string | null;
  header_text: string | null;
  primary_color: string | null;
  announcements: string[];
  social_links: SocialLinks;
  seo: SeoSettings;
  invoice_name: string;
};

function parseRow(row: Record<string, unknown> | null | undefined): SiteSettings | null {
  if (!row) return null;
  const ann = row.announcements;
  return {
    id: String(row.id ?? "main"),
    platform_name: String(row.platform_name ?? row.store_name ?? "Haskell Store"),
    store_name: String(row.store_name ?? row.platform_name ?? "Haskell Store"),
    logo_url: (row.logo_url as string | null) ?? null,
    header_text: (row.header_text as string | null) ?? null,
    primary_color: (row.primary_color as string | null) ?? null,
    announcements: Array.isArray(ann) ? (ann as string[]) : [],
    social_links: (row.social_links as SocialLinks) ?? {},
    seo: (row.seo as SeoSettings) ?? {},
    invoice_name: String(row.invoice_name ?? "Haskell Store"),
  };
}

export function useSiteSettings() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("app_settings").select("*").eq("id", "main").maybeSingle();
      return parseRow(data as never) ?? parseRow({});
    },
    staleTime: 60_000,
  });

  useEffect(() => {
    const ch = supabase
      .channel("app_settings_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "app_settings" }, () => {
        qc.invalidateQueries({ queryKey: ["site-settings"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  return q.data;
}

export function SiteSettingsApplier() {
  const s = useSiteSettings();
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (s?.primary_color && /^#?[0-9a-fA-F]{3,8}$/.test(s.primary_color.trim())) {
      document.documentElement.style.setProperty("--primary-custom", s.primary_color);
    }
    if (s?.platform_name || s?.store_name) {
      const name = s.platform_name || s.store_name;
      const seoTitle = s.seo?.title;
      document.title = seoTitle || name;
    }
    if (s?.seo?.description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", s.seo.description);
    }
  }, [s]);
  return null;
}
