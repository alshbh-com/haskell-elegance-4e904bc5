import { useEffect, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { loadPixelDebugFromStorage } from "@/lib/pixel-tracking";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
    _fbq?: unknown;
    ttq?: any;
    TiktokAnalyticsObject?: string;
  }
}

type Pixel = { id: string; platform: string; pixel_id: string; is_enabled: boolean };

function injectFacebook(pixelId: string) {
  if (typeof window === "undefined") return;
  if (!window.fbq) {
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
  }
  window.fbq!("init", pixelId);
  window.fbq!("track", "PageView");

  const img = document.createElement("img");
  img.height = 1; img.width = 1; img.style.display = "none";
  img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
  document.body.appendChild(img);
}

function injectTikTok(pixelId: string) {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (function (w: any, d: Document, t: string) {
    w.TiktokAnalyticsObject = t;
    const ttq: any = (w[t] = w[t] || []);
    ttq.methods = ["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
    ttq.setAndDefer = function (target: any, method: string) {
      target[method] = function (...args: unknown[]) { target.push([method, ...args]); };
    };
    for (const m of ttq.methods) ttq.setAndDefer(ttq, m);
    ttq.instance = function (id: string) {
      const inst = ttq._i[id] || [];
      for (const m of ttq.methods) ttq.setAndDefer(inst, m);
      return inst;
    };
    ttq.load = function (id: string) {
      const url = "https://analytics.tiktok.com/i18n/pixel/events.js";
      ttq._i = ttq._i || {};
      ttq._i[id] = [];
      ttq._i[id]._u = url;
      ttq._t = ttq._t || {};
      ttq._t[id] = +new Date();
      ttq._o = ttq._o || {};
      ttq._o[id] = {};
      const script = d.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = `${url}?sdkid=${id}&lib=${t}`;
      const first = d.getElementsByTagName("script")[0];
      first.parentNode?.insertBefore(script, first);
    };
    ttq.load(pixelId);
    ttq.page();
  })(window, document, "ttq");
}

export function FacebookPixel() {
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const router = useRouter();
  const injected = useRef<Set<string>>(new Set());

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from("tracking_pixels")
        .select("id,platform,pixel_id,is_enabled")
        .eq("is_enabled", true);
      if (!mounted) return;
      const list = (data ?? []) as Pixel[];
      setPixels(list);
      for (const p of list) {
        const key = `${p.platform}:${p.pixel_id}`;
        if (injected.current.has(key)) continue;
        injected.current.add(key);
        if (p.platform === "facebook") injectFacebook(p.pixel_id);
        else if (p.platform === "tiktok") injectTikTok(p.pixel_id);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (pixels.length === 0) return;
    const unsub = router.subscribe("onResolved", () => {
      window.fbq?.("track", "PageView");
      window.ttq?.page?.();
    });
    return () => { unsub(); };
  }, [pixels, router]);

  return null;
}
