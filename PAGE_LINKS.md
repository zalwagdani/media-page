# روابط الصفحات / Page Links

## روابط الوصول / Access Links

### أثناء التطوير (Development) - على جهازك المحلي:
```
الصفحة الرئيسية (Home Page):
http://localhost:5173/

صفحة تسجيل الدخول (Login Page):
http://localhost:5173/login

لوحة التحكم (Admin Panel):
http://localhost:5173/admin
```

### بعد النشر على GitHub Pages:
```
الصفحة الرئيسية (Home Page):
https://YOUR_USERNAME.github.io/media-page/

صفحة تسجيل الدخول (Login Page):
https://YOUR_USERNAME.github.io/media-page/login

لوحة التحكم (Admin Panel):
https://YOUR_USERNAME.github.io/media-page/admin
```

**ملاحظة:** استبدل `YOUR_USERNAME` باسم مستخدمك على GitHub و `media-page` باسم مستودعك.

---

## كيفية الوصول / How to Access

### للوصول إلى لوحة التحكم:

1. **اذهب مباشرة إلى صفحة تسجيل الدخول:**
   - في التطوير: `http://localhost:5173/login`
   - بعد النشر: `https://YOUR_USERNAME.github.io/media-page/login`

2. **أدخل كلمة المرور:**
   - كلمة المرور الافتراضية: `admin123`
   - ⚠️ **يجب تغييرها قبل النشر!** (في ملف `src/utils/auth.js`)

3. **بعد تسجيل الدخول، سيتم توجيهك تلقائياً إلى لوحة التحكم**

### الوصول المباشر:
- إذا حاولت الوصول مباشرة إلى `/admin` بدون تسجيل الدخول، سيتم توجيهك تلقائياً إلى صفحة تسجيل الدخول

---

## الأمان / Security

- **الصفحة الرئيسية:** عامة - يمكن لأي شخص الوصول إليها
- **صفحة تسجيل الدخول:** عامة - يمكن لأي شخص الوصول إليها
- **لوحة التحكم:** محمية - تتطلب كلمة مرور للوصول

⚠️ **تذكير:** كلمة المرور موجودة في الكود المصدري، لذا استخدم كلمة مرور قوية ومعقدة!
