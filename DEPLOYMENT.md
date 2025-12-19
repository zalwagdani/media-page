# دليل النشر على GitHub Pages

## خطوات النشر المجاني على GitHub Pages

### 1. إنشاء مستودع GitHub

1. اذهب إلى [GitHub.com](https://github.com) وأنشئ حساب إذا لم يكن لديك واحد
2. اضغط على "New repository" (مستودع جديد)
3. اسم المستودع: `media-page` (أو أي اسم تريده)
4. اختر "Public" (عام)
5. لا تضع علامة على README أو .gitignore (سنضيفها لاحقاً)
6. اضغط "Create repository"

**مهم:** إذا اخترت اسماً مختلفاً عن `media-page`، ستحتاج لتعديل `vite.config.js`:
- افتح `vite.config.js`
- غيّر `/media-page/` إلى `/your-repo-name/`

### 2. رفع المشروع إلى GitHub

افتح Terminal في مجلد المشروع وقم بتنفيذ الأوامر التالية:

```bash
# تهيئة Git (إذا لم تكن مهيأ)
git init

# إضافة جميع الملفات
git add .

# عمل commit أولي
git commit -m "Initial commit"

# إضافة المستودع البعيد (استبدل YOUR_USERNAME باسمك على GitHub)
git remote add origin https://github.com/YOUR_USERNAME/media-page.git

# رفع الملفات
git branch -M main
git push -u origin main
```

### 3. تفعيل GitHub Pages

1. اذهب إلى مستودعك على GitHub
2. اضغط على "Settings" (الإعدادات)
3. في القائمة الجانبية، اضغط على "Pages"
4. تحت "Source"، اختر "GitHub Actions"
5. احفظ التغييرات

### 4. تعديل إعدادات النشر (إذا لزم الأمر)

إذا كان اسم المستودع مختلفاً عن `media-page`:

1. افتح `vite.config.js`
2. غيّر السطر: `base: process.env.NODE_ENV === 'production' ? '/media-page/' : '/',`
3. استبدل `'/media-page/'` باسم مستودعك: `'/your-repo-name/'`
4. احفظ الملف

### 5. تغيير كلمة المرور (مهم جداً!)

**قبل النشر، يجب تغيير كلمة المرور الافتراضية:**

1. افتح الملف: `src/utils/auth.js`
2. غيّر `ADMIN_PASSWORD` من `'admin123'` إلى كلمة مرور قوية خاصة بك
3. احفظ الملف
4. ارفع التغييرات:

```bash
git add src/utils/auth.js
git commit -m "Change admin password"
git push
```

### 6. الوصول إلى موقعك

بعد بضع دقائق، سيكون موقعك متاحاً على:
```
https://YOUR_USERNAME.github.io/media-page/
```

### 7. تحديثات مستقبلية

عندما تريد تحديث الموقع:

```bash
git add .
git commit -m "Update description"
git push
```

سيتم تحديث الموقع تلقائياً خلال دقيقة أو دقيقتين.

## ملاحظات أمنية

⚠️ **مهم جداً:**
- كلمة المرور موجودة في الكود المصدري
- لأن الموقع عام على GitHub، يمكن لأي شخص رؤية كلمة المرور في الكود
- هذا نظام حماية بسيط وليس آمناً تماماً
- للاستخدام الشخصي فقط

**لحماية أفضل:**
- استخدم كلمة مرور قوية ومعقدة
- لا تشارك رابط المستودع مع أحد
- أو استخدم خدمة استضافة مدفوعة مع حماية حقيقية

## استكشاف الأخطاء

### الموقع لا يعمل؟
- تأكد من أن GitHub Actions يعمل (تحقق من تبويب "Actions")
- انتظر بضع دقائق بعد الرفع
- تأكد من أن المسار صحيح

### لا يمكنني تسجيل الدخول؟
- تأكد من تغيير كلمة المرور في `src/utils/auth.js`
- تأكد من رفع التغييرات إلى GitHub
- امسح cache المتصفح وجرب مرة أخرى
