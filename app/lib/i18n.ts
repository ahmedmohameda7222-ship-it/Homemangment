export type AppLanguage = "en" | "ar";

export const coreArabic: Record<string, string> = {
  "Home": "الرئيسية",
  "Money": "الفلوس",
  "Budget": "المصروف",
  "Tasks": "المهام",
  "Repairs": "التصليحات",
  "More": "المزيد",
  "Family": "العيلة",
  "Settings": "الإعدادات",
  "Bills": "الفواتير",
  "Shopping": "المشتريات",
  "Home Items": "حاجات البيت",
  "Reports": "التقارير",
  "Home Budget": "مصروف البيت",
  "Switch Profile": "غيّر البروفايل",
  "Switch profile": "غيّر البروفايل",
  "Back to profiles": "رجوع للبروفايلات",
  "Welcome back, ya Pappy.": "نورت يا پابي.",
  "Everything at home is ready for you.": "كل حاجة في البيت جاهزة ليك.",
  "Welcome back, ya Mamy.": "نورتي يا مامي.",
  "A peaceful home is a happy home.": "البيت الهادي بيت سعيد.",
  "Welcome back, Ahmed.": "نورت يا أحمد.",
  "Let's keep Beitna organized.": "خلّينا نخلي بيتنا مترتب.",
  "Welcome back, Sherien.": "نورتي يا شيرين.",
  "Here's your calm home overview.": "دي نظرة هادية على البيت.",
  "Today's Home Summary": "ملخص البيت النهارده",
  "This Month": "الشهر ده",
  "Bills Due": "فواتير مستحقة",
  "Open Repairs": "تصليحات مفتوحة",
  "My Tasks": "مهامي",
  "My Responsibilities": "مسؤولياتي",
  "Quick Actions": "إجراءات سريعة",
  "Recent Home Activity": "آخر نشاط في البيت",
  "Your home is fresh": "البيت لسه فاضي",
  "Add Expense": "ضيف مصروف",
  "Add Task": "ضيف مهمة",
  "Report Problem": "بلّغ عن مشكلة",
  "Tap to manage": "دوس للإدارة",
  "Healthy": "تمام",
  "Low balance": "الرصيد قليل",
  "Near minimum": "قريب من الحد الأدنى",
  "Standard": "الأساسي",
  "Min": "الحد الأدنى",
  "In": "داخل",
  "Used": "مستخدم",
  "Current Balance": "الرصيد الحالي",
  "Total Added": "إجمالي اللي اتضاف",
  "Used / Spent": "المستخدم / المصروف",
  "Budget Settings": "إعدادات المصروف",
  "Monthly Standard": "المصروف الشهري الأساسي",
  "Minimum Level": "الحد الأدنى",
  "Home Budget History": "سجل مصروف البيت",
  "Add expense": "ضيف مصروف",
  "Amount": "المبلغ",
  "Description": "الوصف",
  "Date": "التاريخ",
  "Notes (optional)": "ملاحظات (اختياري)",
  "All": "الكل",
  "Pending": "مستني",
  "Done": "تم",
  "Late": "متأخر",
  "Task Name": "اسم المهمة",
  "Assigned To": "متعيّنة لمين",
  "Due Date": "ميعاد التسليم",
  "Priority": "الأولوية",
  "Related To": "مرتبطة بـ",
  "Edit Task": "عدّل المهمة",
  "Cancel": "إلغاء",
  "Save": "احفظ",
  "None": "مفيش",
  "Low": "قليلة",
  "Medium": "متوسطة",
  "High": "عالية",
  "low": "قليلة",
  "medium": "متوسطة",
  "high": "عالية"
};

export function translateText(text: string | undefined | null, language: AppLanguage): string {
  if (!text) return "";
  if (language === "en") return text;
  return coreArabic[text] ?? text;
}

export function translateMixedText(text: string | undefined | null, language: AppLanguage): string {
  if (!text) return "";
  if (language === "en") return text;
  let output = coreArabic[text] ?? text;
  for (const [english, arabic] of Object.entries(coreArabic)) {
    output = output.replaceAll(english, arabic);
  }
  return output;
}

export function isArabic(language: AppLanguage) {
  return language === "ar";
}
