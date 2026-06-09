import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TierSchema = z.object({
  qty: z.number().int().min(2).max(999),
  discount: z.number().min(1).max(95),
});

const ProductExtrasInput = z.object({
  password: z.string().min(1).max(200),
  product_id: z.string().uuid(),
  show_related: z.boolean().nullable(),
  quantity_pricing: z.array(TierSchema).max(10),
});

const GlobalToggleInput = z.object({
  password: z.string().min(1).max(200),
  show_related_global: z.boolean(),
});

async function verifyPassword(password: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.rpc("verify_admin_password", { _password: password });
  if (error || data !== true) throw new Error("Unauthorized");
  return supabaseAdmin;
}

export const updateProductExtras = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ProductExtrasInput.parse(d))
  .handler(async ({ data }) => {
    const db = await verifyPassword(data.password);
    const { error } = await db
      .from("products")
      .update({
        show_related: data.show_related,
        quantity_pricing: data.quantity_pricing as unknown as never,
      } as never)
      .eq("id", data.product_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateGlobalRelated = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => GlobalToggleInput.parse(d))
  .handler(async ({ data }) => {
    const db = await verifyPassword(data.password);
    const { data: existing } = await db.from("app_settings").select("id").limit(1).maybeSingle();
    if (existing) {
      const { error } = await db.from("app_settings")
        .update({ show_related_global: data.show_related_global } as never)
        .eq("id", existing.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await db.from("app_settings")
        .insert({ show_related_global: data.show_related_global } as never);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });
