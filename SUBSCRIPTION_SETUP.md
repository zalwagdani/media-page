# نظام الاشتراكات - دليل الإعداد

## 📋 نظرة عامة

تم تطبيق نظام اشتراكات كامل يتحكم في الوصول إلى الصفحات بناءً على صلاحية الاشتراك.

## 🗄️ إعداد قاعدة البيانات

### الخطوة 1: تشغيل SQL Schema

قم بتشغيل الملف `subscription_schema.sql` في Supabase SQL Editor:

```sql
-- افتح Supabase Dashboard
-- اذهب إلى SQL Editor
-- انقر على "New Query"
-- الصق محتوى ملف subscription_schema.sql
-- اضغط Run
```

هذا سينشئ:
- ✅ جدول `subscriptions`
- ✅ دوال PostgreSQL للتحقق من الاشتراك
- ✅ Indexes للأداء العالي
- ✅ Triggers للتحديث التلقائي

### الخطوة 2: إضافة بيانات تجريبية

```sql
-- اشتراك شهري (30 يوم)
INSERT INTO subscriptions (page_id, plan_type, start_date, end_date, is_active, payment_status)
VALUES (
  'default',
  'monthly',
  NOW(),
  NOW() + INTERVAL '30 days',
  true,
  'paid'
);

-- اشتراك سنوي (365 يوم)
INSERT INTO subscriptions (page_id, plan_type, start_date, end_date, is_active, payment_status)
VALUES (
  'your-page-id',
  'yearly',
  NOW(),
  NOW() + INTERVAL '365 days',
  true,
  'paid'
);

-- اشتراك تجريبي (7 أيام)
INSERT INTO subscriptions (page_id, plan_type, start_date, end_date, is_active, is_trial, payment_status)
VALUES (
  'trial-page',
  'monthly',
  NOW(),
  NOW() + INTERVAL '7 days',
  true,
  true,
  'pending'
);
```

## 🔧 كيفية العمل

### 1. فحص الاشتراك تلقائياً

عند زيارة أي صفحة، يتم:
- ✅ فحص صلاحية الاشتراك من قاعدة البيانات
- ✅ إذا كان الاشتراك صالح → عرض الصفحة
- ✅ إذا كان الاشتراك منتهي → عرض صفحة الانتهاء

### 2. صفحة انتهاء الاشتراك

تعرض:
- ⚠️ رسالة انتهاء الاشتراك
- 📊 تفاصيل الاشتراك (النوع، التواريخ، عدد الأيام)
- 📧 أزرار للتواصل مع الدعم
- 💬 رابط واتساب

### 3. حقول جدول الاشتراكات

```
id              - معرف فريد
page_id         - معرف الصفحة (UNIQUE)
plan_type       - نوع الخطة: 'monthly' أو 'yearly'
start_date      - تاريخ بداية الاشتراك
end_date        - تاريخ انتهاء الاشتراك
is_active       - هل الاشتراك نشط؟
is_trial        - هل هو اشتراك تجريبي؟
payment_status  - حالة الدفع: 'pending', 'paid', 'failed', 'refunded'
auto_renew      - التجديد التلقائي
notes           - ملاحظات
created_at      - تاريخ الإنشاء
updated_at      - تاريخ آخر تحديث
```

## 📡 API Functions

### التحقق من صلاحية الاشتراك

```javascript
import { checkSubscription } from './services/api'

const result = await checkSubscription('page-id')
if (result.isValid) {
  // الاشتراك صالح
} else {
  // الاشتراك منتهي
}
```

### الحصول على تفاصيل الاشتراك

```javascript
import { getSubscriptionDetails } from './services/api'

const result = await getSubscriptionDetails('page-id')
console.log(result.data)
// {
//   plan_type: 'monthly',
//   start_date: '...',
//   end_date: '...',
//   days_remaining: 15,
//   is_expired: false
// }
```

### إنشاء/تحديث اشتراك

```javascript
import { createSubscription } from './services/api'

// اشتراك شهري (30 يوم)
await createSubscription('page-id', 'monthly', 30, false)

// اشتراك سنوي (365 يوم)
await createSubscription('page-id', 'yearly', 365, false)

// اشتراك تجريبي (7 أيام)
await createSubscription('page-id', 'monthly', 7, true)
```

## 🔄 إلغاء تفعيل الاشتراكات المنتهية تلقائياً

### يدوياً (عند الحاجة)

```sql
SELECT deactivate_expired_subscriptions();
```

### تلقائياً (Cron Job) - مُوصى به

```sql
-- في Supabase SQL Editor
SELECT cron.schedule(
  'deactivate-expired-subscriptions',
  '0 0 * * *', -- كل يوم في منتصف الليل
  $$SELECT deactivate_expired_subscriptions()$$
);
```

## 📊 استعلامات مفيدة

### عرض جميع الاشتراكات النشطة

```sql
SELECT
  page_id,
  plan_type,
  start_date,
  end_date,
  EXTRACT(DAY FROM (end_date - NOW())) as days_remaining,
  is_trial
FROM subscriptions
WHERE is_active = true
ORDER BY end_date ASC;
```

### عرض الاشتراكات المنتهية

```sql
SELECT
  page_id,
  plan_type,
  end_date,
  EXTRACT(DAY FROM (NOW() - end_date)) as days_expired
FROM subscriptions
WHERE end_date <= NOW()
ORDER BY end_date DESC;
```

### عرض الاشتراكات التي ستنتهي قريباً (خلال 7 أيام)

```sql
SELECT
  page_id,
  plan_type,
  end_date,
  EXTRACT(DAY FROM (end_date - NOW())) as days_remaining
FROM subscriptions
WHERE is_active = true
AND end_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
ORDER BY end_date ASC;
```

## ⚙️ التخصيص

### تغيير بيانات الاتصال في صفحة الانتهاء

في ملف `src/pages/SubscriptionExpiredPage.jsx`:

```javascript
// تحديث البريد الإلكتروني
<a href="mailto:your-email@example.com">

// تحديث رقم الواتساب
<a href="https://wa.me/966500000000">
```

### تعطيل فحص الاشتراك مؤقتاً

في حالة التطوير، يمكنك تعطيل فحص الاشتراك:

```javascript
// في HomePage.jsx
setSubscriptionValid(true) // دائماً صالح
```

## 🎯 حالات الاستخدام

### 1. إنشاء اشتراك جديد لعميل
```sql
INSERT INTO subscriptions (page_id, plan_type, start_date, end_date, is_active)
VALUES ('customer-123', 'monthly', NOW(), NOW() + INTERVAL '30 days', true);
```

### 2. تمديد اشتراك موجود
```sql
UPDATE subscriptions
SET end_date = end_date + INTERVAL '30 days',
    is_active = true
WHERE page_id = 'customer-123';
```

### 3. إلغاء اشتراك
```sql
UPDATE subscriptions
SET is_active = false
WHERE page_id = 'customer-123';
```

### 4. تفعيل اشتراك تجريبي
```sql
INSERT INTO subscriptions (page_id, plan_type, start_date, end_date, is_trial, payment_status)
VALUES ('trial-customer', 'monthly', NOW(), NOW() + INTERVAL '7 days', true, 'pending');
```

## ⚠️ ملاحظات مهمة

1. **كل صفحة لها اشتراك واحد فقط** (UNIQUE constraint على page_id)
2. **التحقق يتم عند كل زيارة** للصفحة
3. **الاشتراكات المنتهية تُلغى تلقائياً** بواسطة الدالة
4. **وضع التطوير**: إذا لم يكن Supabase مُعد، الصفحات تعمل بشكل طبيعي
5. **RLS معطل** على جدول subscriptions (يمكن تفعيله حسب الحاجة)

## 🔐 الأمان

لتفعيل Row Level Security:

```sql
-- تفعيل RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- سياسة للقراءة (للجميع)
CREATE POLICY "Anyone can view subscriptions"
ON subscriptions FOR SELECT
USING (true);

-- سياسة للكتابة (للمسؤولين فقط)
CREATE POLICY "Only admins can modify subscriptions"
ON subscriptions FOR ALL
USING (auth.role() = 'admin');
```

## 📞 الدعم

للأسئلة والمساعدة، تواصل مع فريق التطوير.
