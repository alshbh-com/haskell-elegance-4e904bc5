// Lightweight pixel tracking + debug log shared between client code and the
// admin "Test mode" panel.

type LogEntry = {
  id: string;
  ts: number;
  platform: "facebook" | "tiktok" | "all";
  event: string;
  data?: Record<string, unknown>;
};

declare global {
  interface Window {
    __pixelDebug?: {
      enabled: boolean;
      log: LogEntry[];
      listeners: Set<() => void>;
    };
  }
}

function ensureStore() {
  if (typeof window === "undefined") return null;
  if (!window.__pixelDebug) {
    window.__pixelDebug = { enabled: false, log: [], listeners: new Set() };
  }
  return window.__pixelDebug;
}

export function pixelDebugEnabled() {
  const s = ensureStore();
  return !!s?.enabled;
}

export function setPixelDebug(on: boolean) {
  const s = ensureStore();
  if (!s) return;
  s.enabled = on;
  try { localStorage.setItem("haskell_pixel_debug", on ? "1" : "0"); } catch { /* ignore */ }
}

export function loadPixelDebugFromStorage() {
  const s = ensureStore();
  if (!s) return;
  try { s.enabled = localStorage.getItem("haskell_pixel_debug") === "1"; } catch { /* ignore */ }
}

export function subscribePixelDebug(fn: () => void) {
  const s = ensureStore();
  if (!s) return () => {};
  s.listeners.add(fn);
  return () => s.listeners.delete(fn);
}

export function getPixelDebugLog(): LogEntry[] {
  return ensureStore()?.log ?? [];
}

export function clearPixelDebugLog() {
  const s = ensureStore();
  if (!s) return;
  s.log = [];
  s.listeners.forEach((l) => l());
}

function push(entry: Omit<LogEntry, "id" | "ts">) {
  const s = ensureStore();
  if (!s) return;
  const full: LogEntry = { ...entry, id: Math.random().toString(36).slice(2), ts: Date.now() };
  s.log = [full, ...s.log].slice(0, 100);
  s.listeners.forEach((l) => l());
  if (s.enabled) {
    // eslint-disable-next-line no-console
    console.log(`[Pixel] ${entry.platform.toUpperCase()} → ${entry.event}`, entry.data ?? {});
  }
}

export function trackPixelEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window;
  let fired = false;
  if (typeof w.fbq === "function") {
    try { w.fbq("track", event, data); fired = true; push({ platform: "facebook", event, data }); } catch { /* noop */ }
  }
  if (w.ttq && typeof w.ttq.track === "function") {
    try { w.ttq.track(event, data); fired = true; push({ platform: "tiktok", event, data }); } catch { /* noop */ }
  }
  if (!fired) push({ platform: "all", event: `(no pixel) ${event}`, data });
}
