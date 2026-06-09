import { useEffect, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { loadPixelDebugFromStorage } from "@/lib/pixel-tracking";
import { logEvent } from "@/lib/analytics";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
    _fbq?: unknown;
    ttq?: any;
    TiktokAnalyticsObject?: string;
    snaptr?: any;
  }
}

type Pixel = { id: string; platform: string; pixel_id: string; is_enabled: boolean };

function injectFacebook(pixelId: string) {
  if (typeof window === "undefined") return;
  if (!window.fbq) {
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
}

function injectTikTok(pixelId: string) {
  if (typeof window === "undefined") return;
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

function injectSnapchat(pixelId: string) {
  if (typeof window === "undefined") return;
  (function (e: any, t: Document, n: string) {
    if (e.snaptr) return;
    const r: any = (e.snaptr = function (...args: unknown[]) {
      r.handleRequest ? r.handleRequest.apply(r, args) : r.queue.push(args);
    });
    r.queue = [];
    const s = "script";
    const a = t.createElement(s) as HTMLScriptElement;
    a.async = true;
    a.src = "https://sc-static.net/scevent.min.js";
    const u = t.getElementsByTagName(s)[0];
    u.parentNode?.insertBefore(a, u);
  })(window, document, "script");
  window.snaptr("init", pixelId);
  window.snaptr("track", "PAGE_VIEW");
}

export function FacebookPixel() {
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const router = useRouter();
  const injected = useRef<Set<string>>(new Set());

  const loadPixels = async () => {
    const { data } = await supabase
      .from("tracking_pixels")
      .select("id,platform,pixel_id,is_enabled")
      .eq("is_enabled", true);
    const list = (data ?? []) as Pixel[];
    setPixels(list);
    for (const p of list) {
      const key = `${p.platform}:${p.pixel_id}`;
      if (injected.current.has(key)) continue;
      injected.current.add(key);
      if (p.platform === "facebook") injectFacebook(p.pixel_id);
      else if (p.platform === "tiktok") injectTikTok(p.pixel_id);
      else if (p.platform === "snapchat") injectSnapchat(p.pixel_id);
    }
  };

  useEffect(() => {
    loadPixelDebugFromStorage();
    loadPixels();
    const ch = supabase
      .channel("tracking_pixels_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "tracking_pixels" }, () => loadPixels())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pixels.length === 0) return;
    const unsub = router.subscribe("onResolved", (e) => {
      window.fbq?.("track", "PageView");
      window.ttq?.page?.();
      window.snaptr?.("track", "PAGE_VIEW");
      logEvent("page_view", { metadata: { path: (e as any)?.toLocation?.pathname } });
    });
    return () => { unsub(); };
  }, [pixels, router]);

  return null;
}
