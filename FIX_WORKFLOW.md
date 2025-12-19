# إصلاح Workflow الفاشل / Fix Failed Workflow

## المشكلة / Problem:
Workflow "Deploy to GitHub Pages" فشل ❌

## الحل / Solution:

تم تحديث workflow لاستخدام أحدث الإصدارات وإصلاح المشاكل المحتملة.

### التغييرات / Changes:
- ✅ تحديث إلى أحدث إصدارات Actions
- ✅ إضافة `workflow_dispatch` للتنفيذ اليدوي
- ✅ تحديث Node.js إلى الإصدار 20
- ✅ إضافة متغير البيئة `NODE_ENV`

---

## خطوات الإصلاح / Fix Steps:

### 1. ارفع التغييرات:

```bash
cd "/Users/zalwagdani/Media Page"
git add .github/workflows/deploy.yml
git commit -m "Fix GitHub Pages workflow"
git push
```

### 2. تحقق من GitHub Actions:

1. اذهب إلى: https://github.com/zalwagdani/media-page/actions
2. يجب أن ترى workflow جديد يعمل
3. انتظر حتى يكتمل (✅)

### 3. إذا فشل مرة أخرى:

**اضغط على workflow الفاشل واقرأ رسالة الخطأ.**

المشاكل الشائعة:

#### أ) "Environment 'github-pages' not found"
**الحل:**
1. اذهب إلى: https://github.com/zalwagdani/media-page/settings/environments
2. إذا لم يكن موجوداً، أنشئه:
   - اضغط "New environment"
   - اسم: `github-pages`
   - اضغط "Configure environment"

#### ب) "Permission denied"
**الحل:**
1. اذهب إلى: https://github.com/zalwagdani/media-page/settings/actions
2. تأكد من أن "Workflow permissions" = "Read and write permissions"

#### ج) "Build failed"
**الحل:**
- تحقق من package.json
- تأكد من أن جميع dependencies موجودة

---

## بديل: استخدام workflow أبسط

إذا استمرت المشاكل، يمكن استخدام workflow أبسط:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## بعد الإصلاح:

بعد نجاح workflow:

1. انتظر 2-3 دقائق
2. جرب الموقع: `https://zalwagdani.github.io/media-page/`

---

## 🆘 إذا احتجت مساعدة:

أرسل لي:
1. لقطة شاشة من workflow الفاشل
2. رسالة الخطأ الكاملة
3. أي تفاصيل أخرى

سأساعدك في حل المشكلة!
