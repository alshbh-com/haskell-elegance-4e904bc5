const KEY = "haskell_recently_viewed";
const MAX = 12;

export function trackViewed(slug: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    const arr: string[] = raw ? JSON.parse(raw) : [];
    const next = [slug, ...arr.filter((s) => s !== slug)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("recently-viewed-updated"));
  } catch {
    /* ignore */
  }
}

export function getViewed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
