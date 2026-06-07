import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الأدمن — Haskell Store" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminGate,
});

function AdminGate() {
  const navigate = useNavigate();
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("haskell_admin") === "1") {
      navigate({ to: "/admin/dashboard" });
    }
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.rpc("verify_admin_password", { _password: pwd });
    setLoading(false);
    if (error) { toast.error("خطأ في التحقق"); return; }
    if (data === true) {
      sessionStorage.setItem("haskell_admin", "1");
      toast.success("أهلاً يا أدمن ✨");
      navigate({ to: "/admin/dashboard" });
    } else {
      toast.error("كلمة السر غلط");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-sm px-4 py-12">
        <div className="rounded-3xl bg-card p-8 shadow-luxury">
          <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-emerald text-emerald-foreground">
            <Lock className="size-6" />
          </div>
          <h1 className="font-display text-2xl font-bold">لوحة الأدمن</h1>
          <p className="mt-1 text-xs text-muted-foreground">ادخل كلمة السر للدخول</p>
          <form onSubmit={submit} className="mt-5 space-y-3">
            <input
              type="password"
              autoFocus
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="كلمة السر"
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-emerald py-3 text-sm font-bold text-emerald-foreground disabled:opacity-50"
            >
              {loading ? "..." : "دخول"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
