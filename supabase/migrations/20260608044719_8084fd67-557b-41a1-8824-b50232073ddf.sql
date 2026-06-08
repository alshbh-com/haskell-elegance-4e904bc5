CREATE TABLE public.features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'Sparkles',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.features TO anon, authenticated;
GRANT ALL ON public.features TO service_role;

ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active features"
  ON public.features FOR SELECT
  USING (is_active = true);

CREATE TRIGGER features_set_updated_at
  BEFORE UPDATE ON public.features
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.features (icon, title, description, sort_order) VALUES
  ('Truck','شحن لكل المحافظات','خلال 24-72 ساعة',1),
  ('Wallet','دفع عند الاستلام','ادفع بعد ما تستلم',2),
  ('ShieldCheck','ضمان أصلي','منتجات أوريجينال 100%',3),
  ('RotateCcw','استرجاع 14 يوم','بدون أي أسئلة',4),
  ('Headphones','دعم 24/7','فريق خدمة عملاء جاهز',5),
  ('Sparkles','تشكيلة فاخرة','مختارة بعناية فائقة',6),
  ('Gift','تغليف هدايا مجاني','غلاف فاخر لكل هدية',7),
  ('Tag','أسعار حصرية','أحسن سعر في السوق',8),
  ('Crown','عضوية VIP','مزايا خاصة للأعضاء',9),
  ('Lock','دفع آمن','تشفير كامل للبيانات',10),
  ('Star','تقييمات حقيقية','آراء عملاء موثقة',11),
  ('Zap','توصيل سريع','Same-Day داخل القاهرة',12),
  ('Heart','قائمة المفضلة','احفظ منتجاتك المفضلة',13),
  ('MapPin','تتبع الطلب','اعرف طلبك فين لحظة بلحظة',14),
  ('Bell','إشعارات ذكية','متفوتش أي عرض',15),
  ('Smartphone','تطبيق Mobile-First','تجربة موبايل سلسة',16),
  ('BadgePercent','خصومات يومية','عروض جديدة كل يوم',17),
  ('Package','تغليف محكم','يوصل سليم 100%',18),
  ('Clock','حجز سريع','اطلب في أقل من دقيقة',19),
  ('ThumbsUp','ضمان الجودة','أو استرجاع كامل',20),
  ('Globe','شحن دولي','نوصل لكل العالم العربي',21),
  ('MessageCircle','واتساب مباشر','تواصل لحظي معانا',22),
  ('Award','علامة موثوقة','آلاف العملاء السعداء',23),
  ('Camera','صور احترافية','شوف المنتج بكل تفصيلة',24),
  ('Search','بحث ذكي','لاقي اللي بتدور عليه فوراً',25),
  ('Layers','تصنيفات مرتبة','تصفح سهل ومنظم',26),
  ('Palette','ألوان ومقاسات متنوعة','اختر اللي يناسبك',27),
  ('BarChart3','الأكثر شعبية','اعرف الترند دلوقتي',28),
  ('RefreshCw','تحديث يومي','منتجات جديدة باستمرار',29),
  ('Coins','نقاط مكافآت','اكسب نقاط مع كل طلب',30);