import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, InfoCard } from "@/components/SimplePage";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "سياسة الخصوصية — Haskell Store" }] }),
  component: () => (
    <SimplePage icon={Lock} title="سياسة الخصوصية" subtitle="إزاي بنحمي بياناتك">
      <InfoCard>
        <p className="font-bold">البيانات اللي بنجمعها</p>
        <p className="text-muted-foreground">الاسم، رقم الموبايل، العنوان، والبريد الإلكتروني — فقط لتنفيذ طلبك وتحسين تجربتك.</p>
        <p className="font-bold pt-2">إزاي بنستخدم بياناتك</p>
        <ul className="list-disc pr-5 space-y-1 text-muted-foreground">
          <li>توصيل طلباتك</li>
          <li>إرسال تحديثات وعروض (لو وافقت)</li>
          <li>تحسين تجربة التسوق</li>
        </ul>
        <p className="font-bold pt-2">حماية بياناتك</p>
        <p className="text-muted-foreground">كل المعاملات مشفّرة بتقنية SSL. ما بنشاركش بياناتك مع أي طرف تالت.</p>
        <p className="font-bold pt-2">حقوقك</p>
        <p className="text-muted-foreground">تقدر تطلب حذف حسابك أو الاطلاع على بياناتك في أي وقت عبر التواصل معانا.</p>
        <p className="font-bold pt-2">الكوكيز</p>
        <p className="text-muted-foreground">بنستخدم كوكيز لتحسين الموقع وتذكر تفضيلاتك. تقدر تعطلها من إعدادات المتصفح.</p>
      </InfoCard>
    </SimplePage>
  ),
});
