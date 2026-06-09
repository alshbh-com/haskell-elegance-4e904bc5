import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PlatformEnum = z.enum(["facebook", "tiktok", "snapchat", "google"]);

const UpsertInput = z.object({
  password: z.string().min(1).max(200),
  id: z.string().uuid().optional(),
  platform: PlatformEnum,
  pixel_id: z.string().trim().min(3).max(100),
  name: z.string().trim().max(100).nullable().optional(),
  access_token: z.string().trim().max(500).nullable().optional(),
  is_enabled: z.boolean().default(true),
});

const DeleteInput = z.object({
  password: z.string().min(1).max(200),
  id: z.string().uuid(),
});

const ToggleInput = z.object({
  password: z.string().min(1).max(200),
  id: z.string().uuid(),
  is_enabled: z.boolean(),
});

async function verify(password: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.rpc("verify_admin_password", { _password: password });
  if (error || data !== true) throw new Error("Unauthorized");
  return supabaseAdmin;
}

export const upsertTrackingPixel = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => UpsertInput.parse(d))
  .handler(async ({ data }) => {
    const db = await verify(data.password);
    const payload = {
      platform: data.platform,
      pixel_id: data.pixel_id,
      name: data.name ?? null,
      access_token: data.access_token ?? null,
      is_enabled: data.is_enabled,
    };
    if (data.id) {
      const { error } = await db.from("tracking_pixels").update(payload as never).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await db.from("tracking_pixels").insert(payload as never);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteTrackingPixel = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => DeleteInput.parse(d))
  .handler(async ({ data }) => {
    const db = await verify(data.password);
    const { error } = await db.from("tracking_pixels").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const toggleTrackingPixel = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ToggleInput.parse(d))
  .handler(async ({ data }) => {
    const db = await verify(data.password);
    const { error } = await db.from("tracking_pixels")
      .update({ is_enabled: data.is_enabled } as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
