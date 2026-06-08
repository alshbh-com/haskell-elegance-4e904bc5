# خطة تنفيذ المميزات المختارة (14 ميزة)

اخترت: **1, 3, 4, 5, 6, 7, 10, 28, 30, 36, 37, 40, 46, 50**

دي مميزات كبيرة جداً، فهنقسمهم على **دفعتين** عشان التنفيذ يبقى نظيف وقابل للمراجعة.

---

## 🚀 الدفعة الأولى — تجربة التسوق (Front-end فقط، بدون قاعدة بيانات جديدة)

| # | الميزة | التنفيذ |
|---|--------|---------|
| 1 | **بحث ذكي AI** | استخدام Lovable AI (gemini-2.5-flash) لفهم نية البحث وإرجاع منتجات مطابقة |
| 3 | **بحث صوتي** | Web Speech API — زر مايك في صفحة /search |
| 4 | **فلاتر متقدمة** | Sheet جانبي: سعر (range)، تصنيف، لون، مقاس، تقييم، الأكثر مبيعاً |
| 5 | **Quick View** | Dialog سريع من كارت المنتج بدون فتح صفحة كاملة |
| 6 | **مقارنة منتجات** | اختيار حتى 4 منتجات + صفحة /compare |
| 7 | **شوفته مؤخراً** | localStorage + Section في الرئيسية |
| 10 | **عداد المخزون** | موجود (FakeStock) — هنحسّن العرض ونضيف progress bar |
| 28 | **You Might Also Like** | في صفحة المنتج: منتجات من نفس التصنيف |
| 50 | **PWA** | manifest.json + service worker + install prompt |

---

## 🚀 الدفعة الثانية — Checkout & Account (بعد ما توافق على الأولى)

| # | الميزة | التنفيذ |
|---|--------|---------|
| 30 | **توصيات AI شخصية** | Lovable AI بناءً على recently viewed + cart |
| 36 | **طرق دفع متعددة** | كاش عند الاستلام، فودافون كاش، إنستاباي، فيزا (placeholder) |
| 37 | **حاسبة الشحن** | حسب المحافظة في checkout |
| 40 | **بوابة المرتجعات** | نموذج طلب إرجاع + جدول returns |
| 46 | **متعدد اللغات/العملات** | عربي/إنجليزي + ج.م/$/€ |

---

## 📋 الملفات اللي هتتغير في الدفعة الأولى
- `src/components/QuickView.tsx` (جديد)
- `src/components/CompareBar.tsx` + `src/routes/compare.tsx` (جديد)
- `src/components/RecentlyViewed.tsx` (جديد)
- `src/components/AdvancedFilters.tsx` (جديد)
- `src/lib/recently-viewed.ts` + `src/lib/compare-store.ts` (جديد)
- `src/lib/ai-search.functions.ts` (جديد — Lovable AI)
- `src/routes/search.tsx` (تعديل: AI + صوت + فلاتر)
- `src/routes/product.$slug.tsx` (تعديل: You Might Also Like + تتبع المشاهدة)
- `src/components/ProductCard.tsx` (تعديل: زر Quick View + Compare)
- `src/routes/index.tsx` (تعديل: قسم شوفته مؤخراً)
- `src/components/FakeStock.tsx` (تحسين)
- `public/manifest.json` + `public/sw.js` (PWA)

## ❓ موافق نبدأ بالدفعة الأولى؟
أو لو عايز ترتيب مختلف قولّي.
