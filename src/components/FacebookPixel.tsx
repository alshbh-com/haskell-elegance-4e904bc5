import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
    _fbq?: unknown;
  }
}

function inject(pixelId: string) {
  if (typeof window === "undefined") return;
  if (window.fbq) {
    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function (...args: unknown[]) {
      n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true; t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode?.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  window.fbq!("init", pixelId);
  window.fbq!("track", "PageView");

  // Noscript fallback
  const img = document.createElement("img");
  img.height = 1; img.width = 1; img.style.display = "none";
  img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
  document.body.appendChild(img);
}

export function FacebookPixel() {
  const [pixelId, setPixelId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from("app_settings")
        .select("facebook_pixel_id")
        .limit(1)
        .maybeSingle();
      const id = (data as { facebook_pixel_id?: string | null } | null)?.facebook_pixel_id?.trim();
      if (mounted && id) {
        setPixelId(id);
        inject(id);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Track route changes as PageView
  useEffect(() => {
    if (!pixelId) return;
    const unsub = router.subscribe("onResolved", () => {
      window.fbq?.("track", "PageView");
    });
    return () => { unsub(); };
  }, [pixelId, router]);

  return null;
}
