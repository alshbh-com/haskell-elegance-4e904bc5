import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
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
  badge?: string;
};

const sections: { title: string; items: Item[] }[] = [
  {
    title: "حسابي",
    items: [
      { icon: <UserCog className="size-5" />, title: "الملف الشخصي", desc: "بياناتك ومعلوماتك" },
      { icon: <Package className="size-5" />, title: "طلباتي", desc: "كل الطلبات السابقة" },
      { icon: <Phone className="size-5" />, title: "تتبع طلبك", desc: "اعرف فين طلبك دلوقتي", to: "/track" },
      { icon: <MapPin className="size-5" />, title: "عناويني", desc: "أضف وعدّل عناوين الشحن" },
      { icon: <Heart className="size-5" />, title: "المفضلة", desc: "المنتجات اللي حفظتها" },
      { icon: <History className="size-5" />, title: "شاهدته مؤخراً", desc: "آخر المنتجات اللي تصفحتها" },
      { icon: <GitCompare className="size-5" />, title: "مقارنة المنتجات", desc: "قارن لحد 4 منتجات", to: "/compare" },
      { icon: <Wallet className="size-5" />, title: "محفظتي", desc: "رصيدك واسترداداتك" },
      { icon: <Coins className="size-5" />, title: "نقاط الولاء", desc: "اجمع نقاط مع كل طلب" },
      { icon: <Crown className="size-5" />, title: "عضوية VIP", desc: "مزايا حصرية للأعضاء" },
    ],
  },
  {
    title: "تسوّق وعروض",
    items: [
      { icon: <Search className="size-5" />, title: "البحث الذكي", desc: "بحث بالذكاء الاصطناعي", to: "/search" },
      { icon: <Mic className="size-5" />, title: "بحث صوتي", desc: "اتكلم وابحث بسهولة", to: "/search" },
      { icon: <Camera className="size-5" />, title: "بحث بالصورة", desc: "ارفع صورة وهنلاقيلك مثلها" },
      { icon: <Boxes className="size-5" />, title: "كل الأقسام", desc: "تصفح كل الفئات", to: "/categories" },
      { icon: <Zap className="size-5" />, title: "Flash Sales", desc: "عروض محدودة الوقت", badge: "HOT" },
      { icon: <Percent className="size-5" />, title: "عروض اليوم", desc: "خصومات يومية متجددة" },
      { icon: <Tag className="size-5" />, title: "الكوبونات", desc: "كل أكواد الخصم المتاحة" },
      { icon: <Layers className="size-5" />, title: "باقات وعروض", desc: "اشتري أكتر ووفّر أكتر" },
      { icon: <ShoppingBag className="size-5" />, title: "الأوتلت", desc: "تشكيلة بأسعار مخفضة" },
      { icon: <TrendingUp className="size-5" />, title: "الأكثر مبيعاً", desc: "اللي العالم بيشتريه" },
      { icon: <Sparkles className="size-5" />, title: "وصل حديثاً", desc: "أحدث المنتجات" },
      { icon: <Gift className="size-5" />, title: "بطاقات الهدايا", desc: "اهدِ من تحب" },
      { icon: <Users className="size-5" />, title: "ادعُ صديق", desc: "اربح خصومات لما يطلب" },
      { icon: <Award className="size-5" />, title: "اختيارات المحرر", desc: "منتجات منتقاة بعناية" },
    ],
  },
  {
    title: "الدفع والشحن",
    items: [
      { icon: <CreditCard className="size-5" />, title: "طرق الدفع", desc: "فيزا، ماستر، فودافون كاش، الدفع عند الاستلام" },
      { icon: <Truck className="size-5" />, title: "سياسة الشحن", desc: "60 جنيه — مجاني فوق 1000 جنيه" },
      { icon: <Clock className="size-5" />, title: "شحن سريع", desc: "توصيل في نفس اليوم لبعض المناطق" },
      { icon: <Building2 className="size-5" />, title: "استلام من الفرع", desc: "وفّر مصاريف الشحن" },
      { icon: <RotateCcw className="size-5" />, title: "سياسة الاسترجاع", desc: "استرجاع خلال 14 يوم" },
      { icon: <ShieldCheck className="size-5" />, title: "ضمان الجودة", desc: "كل منتجاتنا أصلية 100%" },
      { icon: <BadgeCheck className="size-5" />, title: "دفع آمن", desc: "حمايتك أولويتنا" },
    ],
  },
  {
    title: "الدعم والمساعدة",
    items: [
      { icon: <MessageCircle className="size-5" />, title: "واتساب", desc: "01278006248", href: "https://wa.me/201278006248" },
      { icon: <Headphones className="size-5" />, title: "تواصل معانا", desc: "خدمة عملاء 7 أيام في الأسبوع" },
      { icon: <HelpCircle className="size-5" />, title: "الأسئلة الشائعة", desc: "إجابات لأكتر الأسئلة" },
      { icon: <LifeBuoy className="size-5" />, title: "مركز المساعدة", desc: "دليلك الكامل" },
      { icon: <Mail className="size-5" />, title: "البريد الإلكتروني", desc: "support@haskellstore.com" },
      { icon: <Star className="size-5" />, title: "قيّم تجربتك", desc: "رأيك يهمنا" },
      { icon: <Megaphone className="size-5" />, title: "بلّغ عن مشكلة", desc: "ساعدنا نحسّن الخدمة" },
    ],
  },
  {
    title: "الإعدادات",
    items: [
      { icon: <Bell className="size-5" />, title: "الإشعارات", desc: "ابعت تنبيهات العروض" },
      { icon: <Languages className="size-5" />, title: "اللغة", desc: "العربية / English" },
      { icon: <Globe className="size-5" />, title: "العملة", desc: "جنيه مصري / دولار / ريال" },
      { icon: <Moon className="size-5" />, title: "الوضع الليلي", desc: "غيّر مظهر التطبيق" },
      { icon: <Sun className="size-5" />, title: "الوضع النهاري", desc: "خلفية فاتحة" },
      { icon: <Lock className="size-5" />, title: "الخصوصية والأمان", desc: "تحكّم في بياناتك" },
      { icon: <Smartphone className="size-5" />, title: "ثبّت التطبيق", desc: "تجربة أسرع وأسهل" },
      { icon: <Download className="size-5" />, title: "حمّل التطبيق", desc: "Android & iOS قريباً" },
    ],
  },
  {
    title: "المتجر",
    items: [
      { icon: <BookOpen className="size-5" />, title: "عن المتجر", desc: "قصتنا ورسالتنا" },
      { icon: <ScrollText className="size-5" />, title: "الشروط والأحكام", desc: "اقرأ قبل الطلب" },
      { icon: <Lock className="size-5" />, title: "سياسة الخصوصية", desc: "حماية بياناتك" },
      { icon: <Share2 className="size-5" />, title: "شارك المتجر", desc: "خلّي أصحابك يعرفونا" },
      { icon: <Instagram className="size-5" />, title: "إنستجرام", href: "https://instagram.com" },
      { icon: <Facebook className="size-5" />, title: "فيسبوك", href: "https://facebook.com" },
      { icon: <Youtube className="size-5" />, title: "يوتيوب", href: "https://youtube.com" },
      { icon: <Send className="size-5" />, title: "تيليجرام", href: "https://telegram.org" },
      { icon: <FileText className="size-5" />, title: "لوحة الأدمن", to: "/admin" },
    ],
  },
];

function MorePage() {
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
    <div className="flex items-center gap-3 p-4 hover:bg-muted/40 transition-colors">
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

  if (item.to) return <Link to={item.to}>{content}</Link>;
  if (item.href) return <a href={item.href} target="_blank" rel="noopener noreferrer">{content}</a>;
  return <button type="button" className="w-full text-right">{content}</button>;
}
