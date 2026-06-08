import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/SimplePage";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  { q: "كم مدة التوصيل؟", a: "بنوصل لكل المحافظات في خلال 2-5 أيام عمل. القاهرة والجيزة من 1-2 يوم." },
  { q: "إيه طرق الدفع المتاحة؟", a: "فيزا، ماستركارد، فودافون كاش، إنستاباي، والدفع عند الاستلام." },
  { q: "هل أقدر أرجع المنتج؟", a: "أيوة، تقدر ترجع المنتج خلال 14 يوم من الاستلام بشرط إنه بحالته الأصلية." },
  { q: "هل المنتجات أصلية؟", a: "100% أصلية، كل منتج بضمان رسمي من المتجر." },
  { q: "إزاي أتتبع طلبي؟", a: "من صفحة 'تتبع طلبك' باستخدام رقم الطلب اللي وصلك على الواتساب." },
  { q: "هل في شحن مجاني؟", a: "أيوة، الشحن مجاني للطلبات فوق 1000 جنيه." },
  { q: "هل أقدر أغير العنوان بعد الطلب؟", a: "أيوة، قبل ما يتشحن الطلب، تواصل معانا على الواتساب فوراً." },
  { q: "إيه سياسة الاستبدال؟", a: "تقدر تستبدل المقاس أو اللون خلال 14 يوم بدون رسوم إضافية." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "الأسئلة الشائعة — Haskell Store" }] }),
  component: () => {
    const [open, setOpen] = useState<number | null>(0);
    return (
      <SimplePage icon={HelpCircle} title="الأسئلة الشائعة" subtitle="إجابات لأكتر الأسئلة">
        {faqs.map((f, i) => (
          <button key={i} onClick={() => setOpen(open === i ? null : i)} className="block w-full text-right rounded-2xl bg-card p-4 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <span className="font-bold text-sm">{f.q}</span>
              <ChevronDown className={`size-4 shrink-0 transition-transform ${open===i?"rotate-180":""}`} />
            </div>
            {open === i && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.a}</p>}
          </button>
        ))}
      </SimplePage>
    );
  },
});
