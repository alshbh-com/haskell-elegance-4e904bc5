import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, InfoCard } from "@/components/SimplePage";
import { Download, Smartphone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "حمّل التطبيق — Haskell Store" }] }),
  component: () => {
    const notify = () => toast.success("هنبعتلك أول ما التطبيق ينزل 📲");
    return (
      <SimplePage icon={Download} title="حمّل تطبيق Haskell" subtitle="تجربة تسوق أسرع وأسهل">
        <div className="rounded-3xl bg-gradient-to-br from-emerald to-emerald/70 p-6 text-white shadow-lg text-center">
          <Smartphone className="size-12 mx-auto" />
          <p className="font-display text-2xl font-bold mt-3">قريباً جداً</p>
          <p className="text-sm opacity-90 mt-1">على Android و iOS</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={notify} className="rounded-2xl bg-black text-white p-4 text-sm font-bold">
            <p className="text-[10px] opacity-70">Coming soon to</p>
            <p>🤖 Google Play</p>
          </button>
          <button onClick={notify} className="rounded-2xl bg-black text-white p-4 text-sm font-bold">
            <p className="text-[10px] opacity-70">Coming soon to</p>
            <p>🍎 App Store</p>
          </button>
        </div>
        <InfoCard>
          <p className="font-bold">مزايا التطبيق</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>⚡ سرعة أعلى وتصفح أسهل</li>
            <li>🔔 إشعارات فورية للعروض</li>
            <li>💳 دفع بضغطة واحدة</li>
            <li>🎁 عروض حصرية لمستخدمي التطبيق</li>
          </ul>
        </InfoCard>
      </SimplePage>
    );
  },
});
