export const ARABIC_NAMES = [
  "أحمد", "محمد", "علي", "حسن", "خالد", "كريم", "عمر", "يوسف", "مصطفى", "زياد",
  "سارة", "منى", "نور", "ريم", "هدى", "ياسمين", "دينا", "مريم", "آية", "فاطمة",
];

export const GOVERNORATES = [
  "القاهرة", "الجيزة", "الإسكندرية", "المنصورة", "طنطا", "أسيوط", "أسوان",
  "سوهاج", "بورسعيد", "السويس", "الفيوم", "المنيا", "البحيرة", "دمياط",
];

export const TIME_LABELS = [
  "من دقيقة", "من دقيقتين", "من 3 دقايق", "من 5 دقايق", "من 7 دقايق",
  "من 10 دقايق", "من ربع ساعة", "من نص ساعة",
];

export function randomProof(productNames: string[]) {
  const name = ARABIC_NAMES[Math.floor(Math.random() * ARABIC_NAMES.length)];
  const gov = GOVERNORATES[Math.floor(Math.random() * GOVERNORATES.length)];
  const time = TIME_LABELS[Math.floor(Math.random() * TIME_LABELS.length)];
  const product = productNames[Math.floor(Math.random() * productNames.length)] || "منتج";
  return `${name} من ${gov} اشترى ${product} ${time}`;
}
