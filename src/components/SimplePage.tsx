import { Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { ArrowRight, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function SimplePage({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-6 space-y-5">
        <Link to="/more" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowRight className="size-4" /> رجوع للمزيد
        </Link>
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-emerald/10 text-emerald dark:bg-emerald/20">
            <Icon className="size-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold leading-tight">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}

export function InfoCard({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl bg-card p-5 shadow-soft space-y-3 text-sm leading-relaxed">{children}</div>;
}
