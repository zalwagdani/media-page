# تعليمات رفع الكود إلى GitHub / Push Instructions

## ✅ ما تم إنجازه / What's Done:

1. ✅ تم إضافة جميع الملفات إلى Git
2. ✅ تم إنشاء commit أولي
3. ✅ تم إضافة المستودع البعيد: `https://github.com/zalwagdani/Media.git`
4. ✅ تم تحديث إعدادات النشر لاسم المستودع "Media"

## 🔐 خطوات المصادقة والرفع / Authentication & Push Steps:

### الطريقة 1: استخدام Personal Access Token (موصى به)

1. **إنشاء Personal Access Token:**
   - اذهب إلى: https://github.com/settings/tokens
   - اضغط "Generate new token" → "Generate new token (classic)"
   - اختر اسم للتوكن (مثل: "Media Page")
   - اختر الصلاحيات: ✅ `repo` (كل الصلاحيات)
   - اضغط "Generate token"
   - **انسخ التوكن** (سيظهر مرة واحدة فقط!)

2. **رفع الكود:**
   ```bash
   cd "/Users/zalwagdani/Media Page"
   git push -u origin main
   ```
   - عندما يطلب اسم المستخدم: أدخل `zalwagdani`
   - عندما يطلب كلمة المرور: **الصق التوكن** (ليس كلمة مرور GitHub!)

### الطريقة 2: استخدام SSH (إذا كان لديك SSH key)

1. **تغيير الرابط إلى SSH:**
   ```bash
   cd "/Users/zalwagdani/Media Page"
   git remote set-url origin git@github.com:zalwagdani/Media.git
   ```

2. **رفع الكود:**
   ```bash
   git push -u origin main
   ```

### الطريقة 3: استخدام GitHub CLI

إذا كان لديك `gh` مثبت:
```bash
cd "/Users/zalwagdani/Media Page"
gh auth login
git push -u origin main
```

---

## 📝 بعد الرفع / After Pushing:

1. **تفعيل GitHub Pages:**
   - اذهب إلى: https://github.com/zalwagdani/Media/settings/pages
   - تحت "Source": اختر "GitHub Actions"
   - احفظ

2. **الانتظار:**
   - انتظر دقيقة أو دقيقتين حتى يكتمل النشر
   - تحقق من تبويب "Actions" لرؤية التقدم

3. **الوصول إلى الموقع:**
   - سيكون متاحاً على: `https://zalwagdani.github.io/Media/`
   - الصفحة الرئيسية: `https://zalwagdani.github.io/Media/`
   - تسجيل الدخول: `https://zalwagdani.github.io/Media/login`

---

## ⚠️ تذكير مهم / Important Reminder:

**قبل النشر، غيّر كلمة المرور!**
- افتح: `src/utils/auth.js`
- غيّر `ADMIN_PASSWORD` من `'admin123'` إلى كلمة مرور قوية
- ثم:
  ```bash
  git add src/utils/auth.js
  git commit -m "Change admin password"
  git push
  ```

---

## 🆘 إذا واجهت مشاكل / Troubleshooting:

### خطأ: "Authentication failed"
- استخدم Personal Access Token بدلاً من كلمة المرور
- أو استخدم SSH

### خطأ: "Repository not found"
- تأكد من أن المستودع "Media" موجود على GitHub
- تأكد من أن لديك صلاحيات الكتابة

### خطأ: "Permission denied"
- تأكد من أن التوكن لديه صلاحية `repo`
- أو استخدم SSH key
