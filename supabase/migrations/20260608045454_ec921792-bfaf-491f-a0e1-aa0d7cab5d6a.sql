-- REVIEWS
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text NOT NULL DEFAULT '',
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX reviews_product_idx ON public.reviews(product_id, is_approved);
GRANT SELECT, INSERT ON public.reviews TO anon, authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads approved reviews" ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Anyone can submit a review" ON public.reviews FOR INSERT WITH CHECK (is_approved = false);
CREATE TRIGGER reviews_set_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- BLOG POSTS
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  cover_image text,
  content text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'style',
  is_published boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published posts" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE TRIGGER blog_posts_set_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- UGC PHOTOS
CREATE TABLE public.ugc_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text NOT NULL DEFAULT '',
  customer_name text NOT NULL DEFAULT '',
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  is_approved boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ugc_photos TO anon, authenticated;
GRANT ALL ON public.ugc_photos TO service_role;
ALTER TABLE public.ugc_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads approved ugc" ON public.ugc_photos FOR SELECT USING (is_approved = true);

-- SUPPORT TICKETS
CREATE TABLE public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.support_tickets TO anon, authenticated;
GRANT ALL ON public.support_tickets TO service_role;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a ticket" ON public.support_tickets FOR INSERT WITH CHECK (true);
CREATE TRIGGER support_tickets_set_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- NOTIFICATIONS (site-wide announcements)
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  link text,
  icon text NOT NULL DEFAULT 'Bell',
  type text NOT NULL DEFAULT 'info',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.notifications TO anon, authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads active notifications" ON public.notifications FOR SELECT USING (is_active = true);

-- POLICY PAGES (about, shipping, returns, privacy, terms)
CREATE TABLE public.policy_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  is_published boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.policy_pages TO anon, authenticated;
GRANT ALL ON public.policy_pages TO service_role;
ALTER TABLE public.policy_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published policies" ON public.policy_pages FOR SELECT USING (is_published = true);
CREATE TRIGGER policy_pages_set_updated_at BEFORE UPDATE ON public.policy_pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SEED initial content
INSERT INTO public.policy_pages (slug, title, content) VALUES
  ('about', 'عن Haskell Store', 'Haskell Store هو وجهتك الأولى للفخامة الحقيقية. بنختار كل منتج بعناية فائقة علشان نوصلك تجربة استثنائية.\n\nبدأنا في 2026 برؤية بسيطة: الفخامة تستحق إنها تكون متاحة بكل تفصيلة. من الساعات للعطور للحقائب — كل قطعة بتحكي قصة.\n\n✨ منتجات أصلية 100%\n🚚 شحن سريع لكل المحافظات\n💎 خدمة عملاء على أعلى مستوى'),
  ('shipping', 'سياسة الشحن', 'بنشحن لكل محافظات مصر خلال 24-72 ساعة.\n\n• القاهرة والجيزة: 24 ساعة\n• المحافظات: 48-72 ساعة\n• الشحن مجاني لكل طلب فوق 1500 ج.م\n• الدفع عند الاستلام متاح'),
  ('returns', 'سياسة الاسترجاع', 'حقك في الاسترجاع خلال 14 يوم من تاريخ الاستلام.\n\nالشروط:\n• المنتج بحالته الأصلية وبالتغليف\n• مرفق فاتورة الشراء\n• المنتجات الشخصية (عطور مفتوحة) غير قابلة للاسترجاع\n• الاسترجاع مجاني'),
  ('privacy', 'سياسة الخصوصية', 'خصوصيتك أولويتنا. بنجمع بياناتك بس علشان نوصلك خدمة أفضل.\n\nبنحفظ:\n• اسمك وعنوانك للشحن\n• رقم تليفونك للتواصل\n• إيميلك للإشعارات\n\nمش بنشارك بياناتك مع أي طرف تالت.'),
  ('terms', 'الشروط والأحكام', 'باستخدامك لـ Haskell Store أنت توافق على:\n\n• الأسعار قابلة للتغيير بدون إشعار\n• حق الاسترجاع خلال 14 يوم\n• حل النزاعات وفقاً للقانون المصري\n• حماية حقوق الملكية الفكرية للعلامة');

INSERT INTO public.blog_posts (slug, title, excerpt, content, category, cover_image) VALUES
  ('luxury-watches-guide-2026', 'دليلك لاختيار ساعة فاخرة في 2026', 'كل اللي محتاج تعرفه قبل ما تشتري ساعتك الجديدة — من نوع الحركة لخامة الحزام.', 'الساعة مش مجرد إكسسوار، دي بيان شخصية. في الدليل ده هنوريك إزاي تختار الساعة المثالية...', 'style', '/images/p-watch.jpg'),
  ('perfume-layering', 'فن دمج العطور: تركيبتك الخاصة', 'إزاي تخلط أكتر من عطر علشان تطلع برائحة فريدة ما حدش هيكون لابسها.', 'دمج العطور (Perfume Layering) فن قديم يرجع لمصر القديمة. النهارده هنعلمك الأساسيات...', 'style', '/images/p-perfume.jpg'),
  ('handbag-care', 'إزاي تحافظ على حقيبتك الفاخرة', '5 نصايح ذهبية علشان حقيبتك تفضل زي ما هي لسنين.', 'الحقيبة الفاخرة استثمار. علشان تحافظ عليها لازم تعرف الأساسيات...', 'care', '/images/p-bag.jpg');

INSERT INTO public.notifications (title, body, link, icon, type) VALUES
  ('عرض الافتتاح 🎉', 'خصم 20% على كل المنتجات لفترة محدودة', '/categories', 'BadgePercent', 'promo'),
  ('شحن مجاني', 'لكل طلب فوق 1500 ج.م لكل المحافظات', '/categories', 'Truck', 'info'),
  ('وصلت ساعات جديدة ⌚', 'تشكيلة 2026 الفاخرة متاحة دلوقتي', '/categories', 'Sparkles', 'new');