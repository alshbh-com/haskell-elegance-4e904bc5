import { motion } from "framer-motion";
import {
  Truck, ShieldCheck, RotateCcw, Wallet, Headphones, Sparkles, Gift, Tag,
  Crown, Lock, Star, Zap, Heart, MapPin, Bell, Smartphone, BadgePercent,
  Package, Clock, ThumbsUp, Globe, MessageCircle, Award, Camera, Search,
  Layers, Palette, BarChart3, RefreshCw, Coins,
} from "lucide-react";

const features = [
  { icon: Truck, title: "شحن لكل المحافظات", desc: "خلال 24-72 ساعة" },
  { icon: Wallet, title: "دفع عند الاستلام", desc: "ادفع بعد ما تستلم" },
  { icon: ShieldCheck, title: "ضمان أصلي", desc: "منتجات أوريجينال 100%" },
  { icon: RotateCcw, title: "استرجاع 14 يوم", desc: "بدون أي أسئلة" },
  { icon: Headphones, title: "دعم 24/7", desc: "فريق خدمة عملاء جاهز" },
  { icon: Sparkles, title: "تشكيلة فاخرة", desc: "مختارة بعناية فائقة" },
  { icon: Gift, title: "تغليف هدايا مجاني", desc: "غلاف فاخر لكل هدية" },
  { icon: Tag, title: "أسعار حصرية", desc: "أحسن سعر في السوق" },
  { icon: Crown, title: "عضوية VIP", desc: "مزايا خاصة للأعضاء" },
  { icon: Lock, title: "دفع آمن", desc: "تشفير كامل للبيانات" },
  { icon: Star, title: "تقييمات حقيقية", desc: "آراء عملاء موثقة" },
  { icon: Zap, title: "توصيل سريع", desc: "Same-Day داخل القاهرة" },
  { icon: Heart, title: "قائمة المفضلة", desc: "احفظ منتجاتك المفضلة" },
  { icon: MapPin, title: "تتبع الطلب", desc: "اعرف طلبك فين لحظة بلحظة" },
  { icon: Bell, title: "إشعارات ذكية", desc: "متفوتش أي عرض" },
  { icon: Smartphone, title: "تطبيق Mobile-First", desc: "تجربة موبايل سلسة" },
  { icon: BadgePercent, title: "خصومات يومية", desc: "عروض جديدة كل يوم" },
  { icon: Package, title: "تغليف محكم", desc: "يوصل سليم 100%" },
  { icon: Clock, title: "حجز سريع", desc: "اطلب في أقل من دقيقة" },
  { icon: ThumbsUp, title: "ضمان الجودة", desc: "أو استرجاع كامل" },
  { icon: Globe, title: "شحن دولي", desc: "نوصل لكل العالم العربي" },
  { icon: MessageCircle, title: "واتساب مباشر", desc: "تواصل لحظي معانا" },
  { icon: Award, title: "علامة موثوقة", desc: "آلاف العملاء السعداء" },
  { icon: Camera, title: "صور احترافية", desc: "شوف المنتج بكل تفصيلة" },
  { icon: Search, title: "بحث ذكي", desc: "لاقي اللي بتدور عليه فوراً" },
  { icon: Layers, title: "تصنيفات مرتبة", desc: "تصفح سهل ومنظم" },
  { icon: Palette, title: "ألوان ومقاسات متنوعة", desc: "اختر اللي يناسبك" },
  { icon: BarChart3, title: "الأكثر شعبية", desc: "اعرف الترند دلوقتي" },
  { icon: RefreshCw, title: "تحديث يومي", desc: "منتجات جديدة باستمرار" },
  { icon: Coins, title: "نقاط مكافآت", desc: "اكسب نقاط مع كل طلب" },
];

export function Features30() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald">
          <Sparkles className="size-3.5" /> 30 ميزة
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
          ليه <span className="gold-text">Haskell</span> هو اختيارك؟
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">كل اللي محتاجه في تطبيق واحد</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-5">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 10) * 0.03 }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-gold"
            >
              <div className="flex items-start gap-2.5">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald/10 text-emerald transition group-hover:bg-gold/15 group-hover:text-gold dark:bg-emerald/20">
                  <Icon className="size-[18px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold leading-tight">{f.title}</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">{f.desc}</p>
                </div>
              </div>
              <span className="absolute -end-2 -top-2 text-[10px] font-bold text-gold/30">
                {String(i + 1).padStart(2, "0")}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
