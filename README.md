# صفحة الوسائط - Media Page

صفحة شخصية لعرض صورتك الشخصية، حسابات وسائل التواصل الاجتماعي، ومجموعة قابلة للبحث من أكواد الخصم للتسوق عبر الإنترنت.

A personal media page where you can showcase your profile picture, social media accounts, and a searchable collection of discount codes for online shopping.

## المميزات / Features

- **قسم الملف الشخصي**: عرض اسمك وصورتك الشخصية وروابط وسائل التواصل الاجتماعي
- **البحث عن أكواد الخصم**: البحث في مجموعة أكواد الخصم حسب المتجر، الوصف، الكود، أو العلامات
- **لوحة التحكم المحمية**: إدارة ملفك الشخصي وإضافة/تعديل/حذف أكواد الخصم (محمية بكلمة مرور)

## البدء / Getting Started

### التثبيت / Installation

1. تثبيت المتطلبات:
```bash
npm install
```

2. تشغيل خادم التطوير:
```bash
npm run dev
```

3. افتح المتصفح وانتقل إلى `http://localhost:5173`

## الاستخدام / Usage

### الصفحة الرئيسية (`/`)
- عرض ملفك الشخصي مع الصورة وروابط وسائل التواصل
- البحث في أكواد الخصم
- تصفح جميع أكواد الخصم

### لوحة التحكم (`/admin`) - محمية بكلمة مرور
- **تبويب إعدادات الملف الشخصي**: 
  - تحديث اسمك
  - إضافة رابط صورة الملف الشخصي
  - إضافة روابط حسابات وسائل التواصل (تويتر، إنستغرام، لينكد إن، جيت هاب، تيك توك، سناب شات، يوتيوب)
  
- **تبويب إدارة أكواد الخصم**:
  - إضافة أكواد خصم جديدة مع العنوان، الوصف، الكود، والعلامات
  - تعديل الأكواد الموجودة
  - حذف الأكواد
  - عرض جميع الأكواد

## تخزين البيانات / Data Storage

يتم تخزين جميع البيانات في localStorage للمتصفح، لذا تبقى بين الجلسات ولكنها خاصة بكل متصفح.

All data is stored in the browser's localStorage, so it persists between sessions but is specific to each browser.

## الأمان / Security

⚠️ **مهم جداً / Very Important:**
- كلمة المرور الافتراضية هي `admin123`
- **يجب تغييرها قبل النشر!** افتح `src/utils/auth.js` وغير `ADMIN_PASSWORD`
- هذا نظام حماية بسيط للاستخدام الشخصي فقط

## النشر على GitHub Pages / Deploy to GitHub Pages

راجع ملف `DEPLOYMENT.md` للحصول على تعليمات مفصلة.

See `DEPLOYMENT.md` for detailed deployment instructions.

## بناء للإنتاج / Build for Production

```bash
npm run build
```

سيتم إنشاء الملفات في مجلد `dist`.

The built files will be in the `dist` directory.
