import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Eye,
  ShoppingBag,
  ShoppingCart,
  PlayCircle,
  Sparkles,
  PackageX,
  TrendingUp,
  Percent,
  Wallet,
  DollarSign,
  PackageCheck,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "الإحصائيات — Haskell Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AnalyticsPage,
});

type Range = "today" | "7d" | "30d" | "90d";

type OrderRow = {
  id: string;
  total_amount: number | null;
  status: string | null;
  created_at: string;
};
type EventRow = {
  event_type: string;
  user_session: string | null;
  created_at: string;
};
type ProductLow = { id: string; name: string; stock: number | null };

const RANGE_DAYS: Record<Range, number> = { today: 1, "7d": 7, "30d": 30, "90d": 90 };
const LOST_STATUSES = new Set(["cancelled", "canceled", "returned", "failed", "lost", "ملغي", "مرتجع"]);

function fmtMoney(n: number) {
  return `${Math.round(n).toLocaleString("ar-EG")} ج.م`;
}
function fmtNum(n: number) {
  return n.toLocaleString("ar-EG");
}
function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

function AnalyticsPage() {
  const navigate = useNavigate();
  const [range, setRange] = useState<Range>("7d");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [lowStock, setLowStock] = useState<ProductLow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("haskell_admin") !== "1") {
      navigate({ to: "/admin" });
      return;
    }
    const days = RANGE_DAYS[range];
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    setLoading(true);
    (async () => {
      const [o, e, p] = await Promise.all([
        supabase
          .from("orders")
          .select("id,total_amount,status,created_at")
          .gte("created_at", since)
          .order("created_at", { ascending: true })
          .limit(5000),
        supabase
          .from("analytics_events")
          .select("event_type,user_session,created_at")
          .gte("created_at", since)
          .limit(20000),
        supabase
          .from("products")
          .select("id,name,stock")
          .order("stock", { ascending: true, nullsFirst: false })
          .limit(50),
      ]);
      setOrders(((o.data ?? []) as OrderRow[]).map((r) => ({ ...r, total_amount: Number(r.total_amount ?? 0) })));
      setEvents((e.data ?? []) as EventRow[]);
      setLowStock(((p.data ?? []) as ProductLow[]).filter((x) => (x.stock ?? 0) <= 5));
      setLoading(false);
    })();
  }, [range, navigate]);

  const kpi = useMemo(() => {
    const visits = new Set(
      events.filter((x) => x.event_type === "page_view").map((x) => x.user_session ?? Math.random()),
    ).size;
    const pageViews = events.filter((x) => x.event_type === "page_view").length;
    const addToCart = events.filter((x) => x.event_type === "add_to_cart").length;
    const initiateCheckout = events.filter((x) => x.event_type === "initiate_checkout").length;
    const crossSell = events.filter((x) => x.event_type === "cross_sell").length;
    const totalOrders = orders.length;
    const lostOrders = orders.filter((o) => LOST_STATUSES.has((o.status ?? "").toLowerCase())).length;
    const newOrders = orders.filter((o) => (o.status ?? "").toLowerCase() === "new" || (o.status ?? "") === "جديد" || !o.status).length;
    const sales = orders
      .filter((o) => !LOST_STATUSES.has((o.status ?? "").toLowerCase()))
      .reduce((s, o) => s + (o.total_amount ?? 0), 0);
    const avgOrder = totalOrders ? sales / Math.max(1, totalOrders - lostOrders) : 0;
    const conversion = visits ? totalOrders / visits : 0;
    const lostRate = totalOrders ? lostOrders / totalOrders : 0;
    const netProfit = sales * 0.35; // تقديري بدون تكاليف
    return {
      visits,
      pageViews,
      addToCart,
      initiateCheckout,
      crossSell,
      totalOrders,
      lostOrders,
      newOrders,
      sales,
      avgOrder,
      conversion,
      lostRate,
      netProfit,
    };
  }, [orders, events]);

  // Time-series buckets
  const series = useMemo(() => {
    const days = RANGE_DAYS[range];
    const buckets: Record<string, { d: string; orders: number; sales: number; avg: number; visits: number; ic: number }> = {};
    const now = Date.now();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const k = d.toISOString().slice(0, 10);
      buckets[k] = { d: k.slice(5), orders: 0, sales: 0, avg: 0, visits: 0, ic: 0 };
    }
    for (const o of orders) {
      const k = o.created_at.slice(0, 10);
      if (buckets[k]) {
        buckets[k].orders += 1;
        if (!LOST_STATUSES.has((o.status ?? "").toLowerCase())) buckets[k].sales += o.total_amount ?? 0;
      }
    }
    const sessionsByDay: Record<string, Set<string>> = {};
    for (const e of events) {
      const k = e.created_at.slice(0, 10);
      if (!buckets[k]) continue;
      if (e.event_type === "page_view") {
        (sessionsByDay[k] ??= new Set()).add(e.user_session ?? Math.random().toString());
      } else if (e.event_type === "initiate_checkout") {
        buckets[k].ic += 1;
      }
    }
    for (const k of Object.keys(buckets)) {
      buckets[k].visits = sessionsByDay[k]?.size ?? 0;
      buckets[k].avg = buckets[k].orders ? Math.round(buckets[k].sales / buckets[k].orders) : 0;
    }
    return Object.values(buckets);
  }, [orders, events, range]);

  return (
    <div className="min-h-screen bg-background pb-16">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowRight className="size-3 rotate-180" /> رجوع للوحة التحكم
        </Link>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-bold">الإحصائيات</h1>
          <div className="flex items-center gap-1 rounded-full bg-card p-1 shadow-soft">
            <Calendar className="ms-2 size-3.5 text-muted-foreground" />
            {(["today", "7d", "30d", "90d"] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${range === r ? "bg-emerald text-emerald-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {r === "today" ? "اليوم" : r === "7d" ? "٧ أيام" : r === "30d" ? "٣٠ يوم" : "٩٠ يوم"}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="mt-8 text-center text-sm text-muted-foreground">جاري التحميل…</p>}

        {/* KPI Grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Kpi color="violet" icon={<Eye className="size-4" />} label="زيارات" value={fmtNum(kpi.visits)} />
          <Kpi color="indigo" icon={<ShoppingBag className="size-4" />} label="الطلبات" value={`${fmtNum(kpi.totalOrders)} طلب`} />
          <Kpi color="sky" icon={<DollarSign className="size-4" />} label="متوسط سعر الطلب" value={fmtMoney(kpi.avgOrder)} />
          <Kpi color="emerald" icon={<ShoppingCart className="size-4" />} label="مرات إضافة للسلة" value={fmtNum(kpi.addToCart)} />
          <Kpi color="amber" icon={<PlayCircle className="size-4" />} label="مرات بدء الشراء" value={fmtNum(kpi.initiateCheckout)} />
          <Kpi color="blue" icon={<Sparkles className="size-4" />} label="إضافة كروس سيل" value={fmtNum(kpi.crossSell)} />
          <Kpi color="cyan" icon={<PackageCheck className="size-4" />} label="طلبات جديدة" value={`${fmtNum(kpi.newOrders)} طلب`} />
          <Kpi color="red" icon={<PackageX className="size-4" />} label="الطلبات المفقودة" value={`${fmtNum(kpi.lostOrders)} طلب`} />
          <Kpi color="teal" icon={<TrendingUp className="size-4" />} label="معدل التحويل" value={pct(kpi.conversion)} />
          <Kpi color="rose" icon={<Percent className="size-4" />} label="المعدل بالمفقودة" value={pct(kpi.lostRate)} />
          <Kpi color="blue" icon={<Wallet className="size-4" />} label="إجمالي المبيعات" value={fmtMoney(kpi.sales)} />
          <Kpi color="emerald" icon={<DollarSign className="size-4" />} label="صافي الربح (تقديري)" value={fmtMoney(kpi.netProfit)} />
        </div>

        {/* Charts */}
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          <ChartCard title="إجمالي الطلبات">
            {series.some((s) => s.orders) ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="d" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </ChartCard>

          <ChartCard title="متوسط سعر الطلب">
            {series.some((s) => s.avg) ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={series}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="d" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area dataKey="avg" stroke="#10b981" fill="url(#g1)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </ChartCard>

          <ChartCard title="إجمالي المبيعات">
            {series.some((s) => s.sales) ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={series}>
                  <defs>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="d" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area dataKey="sales" stroke="#6366f1" fill="url(#g2)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </ChartCard>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          <ChartCard title="إجمالي بدء الشراء">
            {series.some((s) => s.ic) ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="d" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="ic" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </ChartCard>

          <ChartCard title="إجمالي الزيارات">
            {series.some((s) => s.visits) ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={series}>
                  <defs>
                    <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="d" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area dataKey="visits" stroke="#06b6d4" fill="url(#g3)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </ChartCard>

          <ChartCard title="أوشك على النفاذ">
            {lowStock.length === 0 ? (
              <EmptyChart text="كل المنتجات متوفرة 🎉" />
            ) : (
              <div className="max-h-[200px] overflow-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-card text-muted-foreground">
                    <tr><th className="py-2 text-start">المنتج</th><th className="py-2 text-end">المتاح</th></tr>
                  </thead>
                  <tbody>
                    {lowStock.map((p) => (
                      <tr key={p.id} className="border-t border-border/40">
                        <td className="py-1.5 text-start">{p.name}</td>
                        <td className={`py-1.5 text-end font-bold ${(p.stock ?? 0) <= 2 ? "text-destructive" : "text-amber-600"}`}>{p.stock ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

const COLOR_MAP: Record<string, string> = {
  violet: "bg-violet-500/15 text-violet-600",
  indigo: "bg-indigo-500/15 text-indigo-600",
  sky: "bg-sky-500/15 text-sky-600",
  emerald: "bg-emerald/15 text-emerald",
  amber: "bg-amber-500/15 text-amber-600",
  blue: "bg-blue-500/15 text-blue-600",
  cyan: "bg-cyan-500/15 text-cyan-600",
  red: "bg-red-500/15 text-red-600",
  teal: "bg-teal-500/15 text-teal-600",
  rose: "bg-rose-500/15 text-rose-600",
};

function Kpi({ color, icon, label, value }: { color: string; icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="relative rounded-2xl border border-border/40 bg-card p-3 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <span className={`grid size-7 place-items-center rounded-full ${COLOR_MAP[color] ?? "bg-muted text-muted-foreground"}`}>{icon}</span>
      </div>
      <p className="mt-2 font-display text-lg font-bold">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-soft">
      <p className="mb-3 text-sm font-bold">{title}</p>
      {children}
    </div>
  );
}

function EmptyChart({ text }: { text?: string }) {
  return (
    <div className="grid h-[180px] place-items-center text-center">
      <div>
        <div className="mx-auto mb-2 grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
          <PackageX className="size-5" />
        </div>
        <p className="text-xs text-muted-foreground">{text ?? "لا توجد بيانات لعرضها"}</p>
      </div>
    </div>
  );
}
