import { supabase } from "@/integrations/supabase/client";

function sessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem("hk_session");
  if (!id) {
    id = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem("hk_session", id);
  }
  return id;
}

export async function logEvent(
  event_type: "page_view" | "add_to_cart" | "initiate_checkout" | "cross_sell" | "purchase" | string,
  opts?: { product_id?: string | null; metadata?: Record<string, unknown> },
) {
  if (typeof window === "undefined") return;
  try {
    await supabase.from("analytics_events").insert({
      event_type,
      product_id: opts?.product_id ?? null,
      user_session: sessionId(),
      metadata: (opts?.metadata ?? {}) as never,
    } as never);
  } catch {
    /* silent */
  }
}
