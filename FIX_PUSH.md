# إصلاح مشكلة الرفع / Fix Push Issue

## المشكلة / Problem:
```
Please make sure you have the correct access rights
and the repository exists.
```

## الحل / Solution:

### تم تغيير الرابط من SSH إلى HTTPS

الآن يمكنك الرفع باستخدام Personal Access Token:

### الخطوات / Steps:

1. **إنشاء Personal Access Token:**
   - اذهب إلى: https://github.com/settings/tokens
   - اضغط "Generate new token" → "Generate new token (classic)"
   - اسم: "Media Page"
   - صلاحيات: ✅ `repo` (كل الصلاحيات)
   - اضغط "Generate token"
   - **انسخ التوكن** (سيظهر مرة واحدة فقط!)

2. **رفع الكود:**
   ```bash
   cd "/Users/zalwagdani/Media Page"
   git push -u origin main
   ```

3. **عندما يطلب:**
   - Username: `zalwagdani`
   - Password: **الصق التوكن** (ليس كلمة مرور GitHub!)

---

## أو استخدم GitHub CLI (إذا كان مثبت):

```bash
cd "/Users/zalwagdani/Media Page"
gh auth login
git push -u origin main
```

---

## أو استخدم SSH (إذا كان لديك SSH key):

```bash
cd "/Users/zalwagdani/Media Page"
git remote set-url origin git@github.com:zalwagdani/Media.git
git push -u origin main
```

---

## تحقق من أن المستودع موجود:

افتح: https://github.com/zalwagdani/Media

إذا لم يكن موجوداً، أنشئه أولاً:
1. اذهب إلى: https://github.com/new
2. اسم المستودع: `Media`
3. اختر Public
4. لا تضع علامة على README
5. اضغط "Create repository"
