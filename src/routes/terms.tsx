import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, InfoCard } from "@/components/SimplePage";
import { ScrollText } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "الشروط والأحكام — Haskell Store" }] }),
  component: () => (
    <SimplePage icon={ScrollText} title="الشروط والأحكام" subtitle="اقرأ قبل إتمام الطلب">
      <InfoCard>
        <p className="font-bold">1. التسجيل والحساب</p>
        <p className="text-muted-foreground">باستخدامك للمتجر فإنك توافق على تقديم بيانات صحيحة ومحدثة.</p>
        <p className="font-bold pt-2">2. الأسعار والدفع</p>
        <p className="text-muted-foreground">كل الأسعار بالجنيه المصري وشاملة الضرائب. الدفع متاح بكل الطرق المعتمدة.</p>
        <p className="font-bold pt-2">3. الشحن والتوصيل</p>
        <p className="text-muted-foreground">نوصل لكل المحافظات خلال 2-5 أيام عمل. أي تأخير خارج إرادتنا (طقس، أعياد) معذور.</p>
        <p className="font-bold pt-2">4. الاسترجاع</p>
        <p className="text-muted-foreground">يحق للعميل استرجاع المنتج خلال 14 يوم بشرط أن يكون بحالته الأصلية وغلافه الأصلي.</p>
        <p className="font-bold pt-2">5. حقوق الملكية</p>
        <p className="text-muted-foreground">كل المحتوى (صور، نصوص، شعارات) ملكية حصرية للمتجر.</p>
        <p className="font-bold pt-2">6. تعديل الشروط</p>
        <p className="text-muted-foreground">يحق للمتجر تعديل الشروط في أي وقت، وسيتم إخطار العملاء عبر التطبيق.</p>
      </InfoCard>
    </SimplePage>
  ),
});
