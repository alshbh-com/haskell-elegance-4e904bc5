import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  query: z.string().min(1).max(300),
  products: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().nullable().optional(),
      }),
    )
    .max(200),
});

/**
 * AI semantic ranking: takes a natural-language query + product list
 * and returns the IDs of the most relevant products in order.
 */
export const aiRankProducts = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const compact = data.products.map((p) => ({
      id: p.id,
      name: p.name,
      desc: (p.description ?? "").slice(0, 120),
    }));

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "أنت محرك بحث ذكي لمتجر إلكتروني عربي. ترتب المنتجات حسب صلتها بالاستعلام. ترجع JSON فقط: {\"ids\": [\"...\"]}. لا تشرح، لا تضف نص.",
          },
          {
            role: "user",
            content: `الاستعلام: "${data.query}"\n\nالمنتجات:\n${JSON.stringify(compact)}\n\nأرجع المنتجات الأكثر صلة فقط (حتى 20) في {"ids":[...]}.`,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (res.status === 429) throw new Error("RATE_LIMIT");
    if (res.status === 402) throw new Error("CREDITS");
    if (!res.ok) throw new Error(`AI gateway error: ${res.status}`);

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content ?? "{}";
    try {
      const parsed = JSON.parse(content);
      const ids = Array.isArray(parsed.ids) ? parsed.ids.filter((x: unknown) => typeof x === "string") : [];
      return { ids: ids as string[] };
    } catch {
      return { ids: [] as string[] };
    }
  });
