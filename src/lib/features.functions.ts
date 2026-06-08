import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const FeatureInput = z.object({
  password: z.string().min(1).max(200),
  feature: z.object({
    id: z.string().uuid().optional(),
    icon: z.string().min(1).max(60),
    title: z.string().min(1).max(200),
    description: z.string().max(500).default(""),
    sort_order: z.number().int().min(0).max(9999),
    is_active: z.boolean().default(true),
  }),
});

const DeleteInput = z.object({
  password: z.string().min(1).max(200),
  id: z.string().uuid(),
});

async function verifyPassword(password: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.rpc("verify_admin_password", { _password: password });
  if (error || data !== true) throw new Error("Unauthorized");
  return supabaseAdmin;
}

export const saveFeature = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => FeatureInput.parse(d))
  .handler(async ({ data }) => {
    const db = await verifyPassword(data.password);
    if (data.feature.id) {
      const { id, ...patch } = data.feature;
      const { error } = await db.from("features").update(patch).eq("id", id);
      if (error) throw new Error(error.message);
      return { ok: true, id };
    }
    const { id: _ignored, ...insert } = data.feature;
    void _ignored;
    const { data: row, error } = await db.from("features").insert(insert).select().single();
    if (error || !row) throw new Error(error?.message ?? "Insert failed");
    return { ok: true, id: row.id };
  });

export const deleteFeature = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => DeleteInput.parse(d))
  .handler(async ({ data }) => {
    const db = await verifyPassword(data.password);
    const { error } = await db.from("features").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
