import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, InfoCard } from "@/components/SimplePage";
import { Camera, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/image-search")({
  head: () => ({ meta: [{ title: "بحث بالصورة — Haskell Store" }] }),
  component: () => {
    const [preview, setPreview] = useState<string | null>(null);
    const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;
      const url = URL.createObjectURL(f);
      setPreview(url);
      setTimeout(() => toast.success("لقينا 12 منتج مشابه ✨"), 800);
    };
    return (
      <SimplePage icon={Camera} title="بحث بالصورة" subtitle="ارفع صورة وهنلاقيلك مثلها">
        <label className="block rounded-2xl border-2 border-dashed border-border bg-card p-8 text-center cursor-pointer hover:bg-muted/40 transition-colors">
          <input type="file" accept="image/*" onChange={onPick} className="hidden" />
          <Upload className="size-10 mx-auto text-emerald" />
          <p className="mt-3 font-bold">اضغط لرفع صورة</p>
          <p className="text-xs text-muted-foreground mt-1">PNG, JPG حتى 5MB</p>
        </label>
        {preview && (
          <div className="rounded-2xl bg-card p-4 shadow-soft">
            <img src={preview} alt="معاينة" className="w-full max-h-64 object-contain rounded-xl" />
            <p className="text-xs text-center text-muted-foreground mt-2">جاري البحث...</p>
          </div>
        )}
        <InfoCard>💡 نصيحة: صور المنتج في إضاءة جيدة وعلى خلفية بسيطة لأفضل نتائج.</InfoCard>
      </SimplePage>
    );
  },
});
