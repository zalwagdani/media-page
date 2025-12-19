# إعداد مستودع جديد: media-page / Setup New Repository: media-page

## خطوات إنشاء المستودع ورفع الكود / Steps to Create Repository and Push Code

### الخطوة 1: إنشاء المستودع على GitHub

1. اذهب إلى: https://github.com/new
2. **Repository name:** `media-page`
3. **Description:** (اختياري) "Personal media page with discount codes"
4. اختر **Public**
5. **لا تضع علامة** على:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
6. اضغط **"Create repository"**

---

### الخطوة 2: إعداد Git في المشروع

افتح Terminal في مجلد المشروع وقم بتنفيذ:

```bash
cd "/Users/zalwagdani/Media Page"

# إزالة remote القديم (إن وجد)
git remote remove origin

# إضافة remote جديد
git remote add origin https://github.com/zalwagdani/media-page.git

# التحقق من الإعدادات
git remote -v
```

يجب أن ترى:
```
origin  https://github.com/zalwagdani/media-page.git (fetch)
origin  https://github.com/zalwagdani/media-page.git (push)
```

---

### الخطوة 3: رفع الكود

```bash
# رفع الكود
git push -u origin main
```

**عندما يطلب:**
- **Username:** `zalwagdani`
- **Password:** استخدم **Personal Access Token** (ليس كلمة مرور GitHub!)

---

### الخطوة 4: إنشاء Personal Access Token (إذا لم يكن لديك)

1. اذهب إلى: https://github.com/settings/tokens
2. اضغط **"Generate new token"** → **"Generate new token (classic)"**
3. **Note:** `media-page`
4. **Expiration:** اختر مدة (90 days أو No expiration)
5. **Select scopes:** ✅ **repo** (كل الصلاحيات)
6. اضغط **"Generate token"**
7. **انسخ التوكن** (سيظهر مرة واحدة فقط!)

**استخدم التوكن كـ Password عند الرفع**

---

### الخطوة 5: تفعيل GitHub Pages

بعد رفع الكود:

1. اذهب إلى: https://github.com/zalwagdani/media-page/settings/pages
2. تحت **"Source":**
   - اختر **"GitHub Actions"**
   - احفظ
3. انتظر 2-3 دقائق

---

### الخطوة 6: الوصول إلى الموقع

بعد تفعيل GitHub Pages، سيكون الموقع متاحاً على:

```
https://zalwagdani.github.io/media-page/
```

**الصفحات:**
- الرئيسية: `https://zalwagdani.github.io/media-page/`
- تسجيل الدخول: `https://zalwagdani.github.io/media-page/login`
- لوحة التحكم: `https://zalwagdani.github.io/media-page/admin`

---

## ✅ تم تحديث الإعدادات

- ✅ تم تحديث `vite.config.js` لاستخدام `/media-page/`
- ✅ جاهز للرفع إلى المستودع الجديد

---

## 🆘 إذا واجهت مشاكل

### خطأ: "Repository not found"
→ تأكد من إنشاء المستودع أولاً على GitHub

### خطأ: "Authentication failed"
→ استخدم Personal Access Token بدلاً من كلمة المرور

### خطأ: "Permission denied"
→ تأكد من أن التوكن لديه صلاحية `repo`

---

## 📝 ملاحظة مهمة

**قبل النشر، غيّر كلمة المرور!**
- افتح: `src/utils/auth.js`
- غيّر `ADMIN_PASSWORD` من `'admin123'` إلى كلمة مرور قوية
- ثم:
  ```bash
  git add src/utils/auth.js
  git commit -m "Change admin password"
  git push
  ```
