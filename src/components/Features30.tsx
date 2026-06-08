import * as Icons from "lucide-react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const featuresQuery = queryOptions({
  queryKey: ["features"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("features")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

function Icon({ name }: { name: string }) {
  const Comp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  const Final = Comp ?? Sparkles;
  return <Final className="size-[18px]" />;
}

export function Features30() {
  const { data: features } = useSuspenseQuery(featuresQuery);
  if (!features.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald">
          <Sparkles className="size-3.5" /> {features.length} ميزة
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
          ليه <span className="gold-text">Haskell</span> هو اختيارك؟
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">كل اللي محتاجه في تطبيق واحد</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-5">
        {features.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: (i % 10) * 0.03 }}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-gold"
          >
            <div className="flex items-start gap-2.5">
              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald/10 text-emerald transition group-hover:bg-gold/15 group-hover:text-gold dark:bg-emerald/20">
                <Icon name={f.icon} />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold leading-tight">{f.title}</p>
                <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">{f.description}</p>
              </div>
            </div>
            <span className="absolute -end-2 -top-2 text-[10px] font-bold text-gold/30">
              {String(i + 1).padStart(2, "0")}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
