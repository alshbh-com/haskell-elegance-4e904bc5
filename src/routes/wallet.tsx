import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, InfoCard } from "@/components/SimplePage";
import { Wallet } from "lucide-react";

export const Route = createFileRoute("/wallet")({
  head: () => ({ meta: [{ title: "محفظتي — Haskell Store" }] }),
  component: () => (
    <SimplePage icon={Wallet} title="محفظتي" subtitle="رصيدك واسترداداتك">
      <div className="rounded-3xl bg-gradient-to-br from-emerald to-emerald/70 p-6 text-white shadow-lg">
        <p className="text-xs opacity-80">الرصيد المتاح</p>
        <p className="font-display text-4xl font-bold mt-1">0.00 <span className="text-base">جنيه</span></p>
        <p className="text-xs opacity-80 mt-3">يتم إضافة المبالغ المستردة تلقائياً</p>
      </div>
      <InfoCard>
        <p className="font-bold">إزاي تستخدم المحفظة؟</p>
        <ul className="list-disc pr-5 space-y-1 text-muted-foreground">
          <li>يتم إضافة المبالغ المستردة من الطلبات الملغية</li>
          <li>تقدر تستخدم الرصيد في أي طلب جديد</li>
          <li>الرصيد ما بيخلصش وما بيتسحبش</li>
        </ul>
      </InfoCard>
    </SimplePage>
  ),
});
