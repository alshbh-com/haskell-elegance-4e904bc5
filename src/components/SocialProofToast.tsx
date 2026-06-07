import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { randomProof } from "@/lib/social-proof-data";

export function SocialProofToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const [names, setNames] = useState<string[]>([]);

  useEffect(() => {
    supabase
      .from("products")
      .select("name")
      .limit(20)
      .then(({ data }) => setNames((data ?? []).map((p) => p.name)));
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 20000 + Math.random() * 20000;
      timer = setTimeout(() => {
        setMsg(randomProof(names));
        setTimeout(() => setMsg(null), 5500);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [names]);

  return (
    <div className="pointer-events-none fixed bottom-4 start-4 z-50 max-w-[90vw]">
      <AnimatePresence>
        {msg && (
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-soft"
          >
            <CheckCircle2 className="size-5 shrink-0 text-emerald" />
            <p className="text-xs font-medium">{msg}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
