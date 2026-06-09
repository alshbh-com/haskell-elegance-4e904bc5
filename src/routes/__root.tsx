import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "sonner";
import { SocialProofToast } from "@/components/SocialProofToast";
import { BottomNav } from "@/components/BottomNav";
import { CompareBar } from "@/components/CompareBar";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">الصفحة مش موجودة</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          الصفحة دي اتنقلت أو مش موجودة خالص.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            ارجع للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          حصل خطأ في تحميل الصفحة
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">حاول تاني أو ارجع للرئيسية.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            حاول تاني
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5" },
      { name: "theme-color", content: "#0a4d3a" },
      { title: "Haskell Store — متجر الفخامة" },
      { name: "description", content: "Haskell Store — تشكيلة فاخرة من الساعات والعطور والإكسسوارات. شحن سريع ودفع عند الاستلام." },
      { name: "author", content: "Haskell Store" },
      { property: "og:title", content: "Haskell Store — متجر الفخامة" },
      { property: "og:description", content: "Haskell Store — تشكيلة فاخرة من الساعات والعطور والإكسسوارات. شحن سريع ودفع عند الاستلام." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Haskell Store" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Haskell Store — متجر الفخامة" },
      { name: "twitter:description", content: "Haskell Store — تشكيلة فاخرة من الساعات والعطور والإكسسوارات. شحن سريع ودفع عند الاستلام." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/53843b68-4196-4bec-ab9e-ea367493a925" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/53843b68-4196-4bec-ab9e-ea367493a925" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Tajawal:wght@300;400;500;700;900&display=swap",
      },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="pb-20">
        <Outlet />
      </div>
      <BottomNav />
      <CompareBar />
      <Toaster position="top-center" dir="rtl" richColors closeButton />
      <SocialProofToast />
    </QueryClientProvider>
  );
}
