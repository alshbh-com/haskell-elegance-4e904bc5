import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  Truck, RotateCcw, ShieldCheck, Phone, MessageCircle, FileText,
  Search, Heart, Package, MapPin, CreditCard, Wallet, Gift, Tag,
  Star, Users, Bell, Globe, Moon, HelpCircle, Mail, Instagram,
  Facebook, Youtube, Send, Download, Share2, Award, Sparkles, Zap,
  Clock, Percent, ShoppingBag, BookOpen, Headphones, Lock, UserCog,
  Languages, Sun, Smartphone, Megaphone, TrendingUp, Crown, Coins,
  BadgeCheck, Boxes, Layers, Mic, Camera, History, GitCompare,
  LifeBuoy, ScrollText, Building2,
} from "lucide-react";

export const Route = createFileRoute("/more")({
  head: () => ({ meta: [{ title: "المزيد — Haskell Store" }] }),
  component: MorePage,
});

type Item = {
  icon: React.ReactNode;
  title: string;
  desc?: string;
  to?: string;
  href?: string;
  onClick?: () => void;
  badge?: string;
};

const soon = (label: string) => () =>
  toast.info(`${label} — قريباً جداً 🚀`, { description: "بنشتغل على المزيج ده، استنونا!" });

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = (next: boolean) => {
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    toast.success(next ? "تم تفعيل الوضع الليلي 🌙" : "تم تفعيل الوضع النهاري ☀️");
  };
  return { dark, toggle };
}

function MorePage() {
  const { dark, toggle } = useDarkMode();

  const handleShare = async () => {
    const url = window.location.origin;
    const data = { title: "Haskell Store", text: "تسوّق من Haskell Store 🛍️", url };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(url);
        toast.success("تم نسخ رابط المتجر ✅");
      }
    } catch {/* user cancelled */}
  };

  const handleNotifications = async () => {
    if (!("Notification" in window)) return toast.error("متصفحك مش بيدعم الإشعارات");
    const res = await Notification.requestPermission();
    if (res === "granted") {
      new Notification("Haskell Store", { body: "تم تفعيل الإشعارات 🔔" });
      toast.success("تم تفعيل الإشعارات بنجاح");
    } else toast.error("لازم تسمح بالإشعارات من إعدادات المتصفح");
  };

  const handleInstall = () => {
    const evt = (window as any).__deferredInstallPrompt;
    if (evt) { evt.prompt(); }
    else toast.info("افتح قائمة المتصفح واختر «إضافة إلى الشاشة الرئيسية» 📲");
  };

  const sections: { title: string; items: Item[] }[] = [
    {
      title: "حسابي",
      items: [
        { icon: <UserCog className="size-5" />, title: "الملف الشخصي", desc: "بياناتك ومعلوماتك", to: "/profile" },
        { icon: <Package className="size-5" />, title: "طلباتي", desc: "كل الطلبات السابقة", to: "/track" },
        { icon: <Phone className="size-5" />, title: "تتبع طلبك", desc: "اعرف فين طلبك دلوقتي", to: "/track" },
        { icon: <MapPin className="size-5" />, title: "عناويني", desc: "أضف وعدّل عناوين الشحن", to: "/addresses" },
        { icon: <Heart className="size-5" />, title: "المفضلة", desc: "المنتجات اللي حفظتها", to: "/wishlist" },
        { icon: <History className="size-5" />, title: "شاهدته مؤخراً", desc: "آخر المنتجات اللي تصفحتها", to: "/" },
        { icon: <GitCompare className="size-5" />, title: "مقارنة المنتجات", desc: "قارن لحد 4 منتجات", to: "/compare" },
        { icon: <Wallet className="size-5" />, title: "محفظتي", desc: "رصيدك واسترداداتك", to: "/wallet" },
        { icon: <Coins className="size-5" />, title: "نقاط الولاء", desc: "اجمع نقاط مع كل طلب", to: "/loyalty" },
        { icon: <Crown className="size-5" />, title: "عضوية VIP", desc: "مزايا حصرية للأعضاء", to: "/vip" },
      ],
    },
    {
      title: "تسوّق وعروض",
      items: [
        { icon: <Search className="size-5" />, title: "البحث الذكي", desc: "بحث بالذكاء الاصطناعي", to: "/search" },
        { icon: <Mic className="size-5" />, title: "بحث صوتي", desc: "اتكلم وابحث بسهولة", to: "/search" },
        { icon: <Camera className="size-5" />, title: "بحث بالصورة", desc: "ارفع صورة وهنلاقيلك مثلها", to: "/image-search" },
        { icon: <Boxes className="size-5" />, title: "كل الأقسام", desc: "تصفح كل الفئات", to: "/categories" },
        { icon: <Zap className="size-5" />, title: "Flash Sales", desc: "عروض محدودة الوقت", badge: "HOT", to: "/" },
        { icon: <Percent className="size-5" />, title: "عروض اليوم", desc: "خصومات يومية متجددة", to: "/" },
        { icon: <Tag className="size-5" />, title: "الكوبونات", desc: "اضغط لنسخ الكود", onClick: async () => { await navigator.clipboard.writeText("HASKELL10"); toast.success("تم نسخ الكوبون: HASKELL10 🎉 — خصم 10%"); } },
        { icon: <Layers className="size-5" />, title: "باقات وعروض", desc: "اشتري أكتر ووفّر أكتر", to: "/bundles" },
        { icon: <ShoppingBag className="size-5" />, title: "الأوتلت", desc: "تشكيلة بأسعار مخفضة", to: "/outlet" },
        { icon: <TrendingUp className="size-5" />, title: "الأكثر مبيعاً", desc: "اللي العالم بيشتريه", to: "/" },
        { icon: <Sparkles className="size-5" />, title: "وصل حديثاً", desc: "أحدث المنتجات", to: "/" },
        { icon: <Gift className="size-5" />, title: "بطاقات الهدايا", desc: "اهدِ من تحب", to: "/gift-cards" },
        { icon: <Users className="size-5" />, title: "ادعُ صديق", desc: "اربح خصومات لما يطلب", onClick: async () => { await navigator.clipboard.writeText(`${window.location.origin}?ref=YOU`); toast.success("تم نسخ رابط الدعوة ✨"); } },
        { icon: <Award className="size-5" />, title: "اختيارات المحرر", desc: "منتجات منتقاة بعناية", to: "/" },
      ],
    },
    {
      title: "الدفع والشحن",
      items: [
        { icon: <CreditCard className="size-5" />, title: "طرق الدفع", desc: "فيزا، ماستر، فودافون كاش، الدفع عند الاستلام", onClick: () => toast.info("بنقبل: 💳 فيزا/ماستر — 📱 فودافون كاش — 💵 الدفع عند الاستلام") },
        { icon: <Truck className="size-5" />, title: "سياسة الشحن", desc: "60 جنيه — مجاني فوق 1000 جنيه", onClick: () => toast.info("بنوصل لكل المحافظات في 2-5 أيام عمل. الشحن 60 جنيه ومجاني فوق 1000 جنيه.") },
        { icon: <Clock className="size-5" />, title: "شحن سريع", desc: "توصيل في نفس اليوم لبعض المناطق", onClick: () => toast.info("التوصيل في نفس اليوم متاح حالياً في القاهرة والجيزة 🚀") },
        { icon: <Building2 className="size-5" />, title: "استلام من الفرع", desc: "وفّر مصاريف الشحن", onClick: () => toast.info("متاح في فرع المعادي والمهندسين 🏬") },
        { icon: <RotateCcw className="size-5" />, title: "طلب استرجاع", desc: "استرجاع خلال 14 يوم", to: "/returns" },
        { icon: <ShieldCheck className="size-5" />, title: "ضمان الجودة", desc: "كل منتجاتنا أصلية 100%", onClick: () => toast.success("كل منتجاتنا أصلية 100% وعليها ضمان رسمي من المتجر ✅") },
        { icon: <BadgeCheck className="size-5" />, title: "دفع آمن", desc: "حمايتك أولويتنا", onClick: () => toast.success("كل المعاملات مشفّرة وآمنة 🔒") },
      ],
    },
    {
      title: "الدعم والمساعدة",
      items: [
        { icon: <MessageCircle className="size-5" />, title: "واتساب", desc: "01278006248", href: "https://wa.me/201278006248?text=أهلاً،%20محتاج%20مساعدة" },
        { icon: <Headphones className="size-5" />, title: "اتصل بينا", desc: "01278006248", href: "tel:+201278006248" },
        { icon: <HelpCircle className="size-5" />, title: "الأسئلة الشائعة", desc: "إجابات لأكتر الأسئلة", to: "/faq" },
        { icon: <LifeBuoy className="size-5" />, title: "مركز المساعدة", desc: "دليلك الكامل", to: "/help" },
        { icon: <Mail className="size-5" />, title: "البريد الإلكتروني", desc: "support@haskellstore.com", href: "mailto:support@haskellstore.com" },
        { icon: <Star className="size-5" />, title: "قيّم تجربتك", desc: "رأيك يهمنا", onClick: () => toast.success("شكراً لك! ⭐⭐⭐⭐⭐ — تم تسجيل تقييمك") },
        { icon: <Megaphone className="size-5" />, title: "بلّغ عن مشكلة", desc: "ساعدنا نحسّن الخدمة", href: "mailto:support@haskellstore.com?subject=بلاغ%20مشكلة" },
      ],
    },
    {
      title: "الإعدادات",
      items: [
        { icon: <Bell className="size-5" />, title: "الإشعارات", desc: "اضغط لتفعيل تنبيهات العروض", onClick: handleNotifications },
        { icon: <Languages className="size-5" />, title: "اللغة", desc: "العربية (الافتراضية)", onClick: () => toast.info("اللغة الإنجليزية قريباً 🌐") },
        { icon: <Globe className="size-5" />, title: "العملة", desc: "جنيه مصري (EGP)", onClick: () => toast.info("الدولار والريال قريباً 💱") },
        { icon: dark ? <Sun className="size-5" /> : <Moon className="size-5" />, title: dark ? "الوضع النهاري" : "الوضع الليلي", desc: "غيّر مظهر التطبيق", onClick: () => toggle(!dark) },
        { icon: <Lock className="size-5" />, title: "الخصوصية والأمان", desc: "تحكّم في بياناتك", to: "/privacy" },
        { icon: <Smartphone className="size-5" />, title: "ثبّت التطبيق", desc: "تجربة أسرع وأسهل", onClick: handleInstall },
        { icon: <Download className="size-5" />, title: "حمّل التطبيق", desc: "Android & iOS قريباً", to: "/app" },
      ],
    },
    {
      title: "المتجر",
      items: [
        { icon: <BookOpen className="size-5" />, title: "عن المتجر", desc: "قصتنا ورسالتنا", onClick: () => toast.info("Haskell Store — وجهتك الأولى للإكسسوارات الأنيقة 💎") },
        { icon: <ScrollText className="size-5" />, title: "الشروط والأحكام", desc: "اقرأ قبل الطلب", to: "/terms" },
        { icon: <Lock className="size-5" />, title: "سياسة الخصوصية", desc: "حماية بياناتك", to: "/privacy" },
        { icon: <Share2 className="size-5" />, title: "شارك المتجر", desc: "خلّي أصحابك يعرفونا", onClick: handleShare },
        { icon: <Instagram className="size-5" />, title: "إنستجرام", href: "https://instagram.com/haskellstore" },
        { icon: <Facebook className="size-5" />, title: "فيسبوك", href: "https://facebook.com/haskellstore" },
        { icon: <Youtube className="size-5" />, title: "يوتيوب", href: "https://youtube.com" },
        { icon: <Send className="size-5" />, title: "تيليجرام", href: "https://t.me/haskellstore" },
        { icon: <FileText className="size-5" />, title: "لوحة الأدمن", desc: "للمسؤولين فقط", to: "/admin" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">المزيد</h1>
          <p className="mt-1 text-sm text-muted-foreground">كل ما تحتاجه في مكان واحد</p>
        </div>

        {sections.map((section) => (
          <section key={section.title} className="space-y-2">
            <h2 className="font-display text-sm font-bold text-muted-foreground px-1">{section.title}</h2>
            <div className="rounded-2xl bg-card shadow-soft overflow-hidden divide-y divide-border/60">
              {section.items.map((item, i) => (
                <Row key={i} item={item} />
              ))}
            </div>
          </section>
        ))}

        <p className="text-center text-xs text-muted-foreground pt-4">
          © {new Date().getFullYear()} Haskell Store — كل الحقوق محفوظة
        </p>
      </div>
    </div>
  );
}

function Row({ item }: { item: Item }) {
  const content = (
    <div className="flex w-full items-center gap-3 p-4 text-right hover:bg-muted/40 active:bg-muted/60 transition-colors cursor-pointer">
      <div className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald/10 text-emerald dark:bg-emerald/20">
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm truncate">{item.title}</h3>
          {item.badge && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">
              {item.badge}
            </span>
          )}
        </div>
        {item.desc && <p className="text-xs text-muted-foreground truncate mt-0.5">{item.desc}</p>}
      </div>
      <span className="text-xs text-muted-foreground">←</span>
    </div>
  );

  if (item.to) return <Link to={item.to} className="block">{content}</Link>;
  if (item.href) return <a href={item.href} target="_blank" rel="noopener noreferrer" className="block">{content}</a>;
  return <button type="button" onClick={item.onClick} className="w-full text-right block">{content}</button>;
}
