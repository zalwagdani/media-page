# نظام الباقات - Subscription Tiers System

## نظرة عامة

تم إضافة نظام الباقات إلى التطبيق مع باقتين رئيسيتين:
- **Standard (ستاندرد)**: الباقة الأساسية
- **Premium (بريميم)**: الباقة المميزة

---

## الفروقات بين الباقات

### 📦 الباقة الأساسية (Standard)
- ✅ حتى **5 روابط** وسائل تواصل
- ✅ **4 ثيمات أساسية** (البنفسجي، المحيط، الوردي، منتصف الليل)
- ✅ **3 تصاميم** (Classic, Modern, Minimal)
- ❌ **بدون رسائل مجهولة**
- ❌ **بدون إحصائيات متقدمة** (مستقبلاً)

### ⭐ الباقة المميزة (Premium)
- ✅ حتى **20 رابط** وسائل تواصل
- ✅ **جميع الثيمات** (10 ثيمات - تشمل الحصرية)
- ✅ **جميع التصاميم**
- ✅ **رسائل مجهولة من الزوار**
- ✅ **إحصائيات متقدمة** (مستقبلاً)
- ✅ **إزالة العلامة المائية** (مستقبلاً)

---

## التطبيق التقني

### 1. قاعدة البيانات

#### إضافة حقل `plan_tier`
```sql
-- ملف: supabase/subscription_plan_tiers.sql
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS plan_tier TEXT NOT NULL DEFAULT 'standard'
CHECK (plan_tier IN ('standard', 'premium'));
```

#### تحديث دالة PostgreSQL
```sql
-- ملف: supabase/update_subscription_function.sql
CREATE OR REPLACE FUNCTION get_subscription_details(p_page_id TEXT)
RETURNS TABLE (
  page_id TEXT,
  plan_type TEXT,
  plan_tier TEXT,  -- ← حقل جديد
  -- ... باقي الحقول
)
```

### 2. الثيمات (Themes)

تم تعديل ملف `src/config/themes.js` لإضافة حقل `premiumOnly`:

```javascript
export const themes = {
  // Standard themes
  'gradient-purple': {
    name: 'البنفسجي الكلاسيكي',
    // ...
    premiumOnly: false  // ← متاح للجميع
  },

  // Premium themes
  'gradient-royal': {
    name: 'الملكي الفاخر',
    // ...
    premiumOnly: true   // ← حصري لـ Premium
  },
  // ...
}

// دالة للحصول على الثيمات المتاحة حسب الباقة
export const getAvailableThemes = (planTier = 'standard') => {
  if (planTier === 'premium') return themes

  // فلترة الثيمات للمستخدمين العاديين
  return Object.entries(themes)
    .filter(([_, theme]) => !theme.premiumOnly)
    .reduce((acc, [key, theme]) => ({ ...acc, [key]: theme }), {})
}
```

### 3. حدود الروابط

في `AdminPage.jsx`:

```javascript
const handleAddLink = async (e) => {
  e.preventDefault()

  // الحد الأقصى حسب نوع الباقة
  const maxLinks = subscription?.plan_tier === 'premium' ? 20 : 5

  if (socialLinks.length >= maxLinks) {
    if (subscription?.plan_tier === 'standard') {
      alert(`⚠️ وصلت للحد الأقصى في باقة Standard (${maxLinks} روابط)

⭐ قم بالترقية للباقة المميزة للحصول على حتى 20 رابط!`)
    }
    return
  }
  // ... إضافة الرابط
}
```

### 4. الرسائل المجهولة

تم إضافة فحص للباقة قبل السماح بتفعيل الرسائل المجهولة:

```javascript
{subscription?.plan_tier === 'standard' && (
  <div className="bg-gradient-to-r from-purple-100 to-pink-100...">
    <h3>ميزة حصرية للباقة المميزة</h3>
    <p>الرسائل المجهولة متاحة فقط لمشتركي Premium</p>
  </div>
)}
```

### 5. واجهة المستخدم

#### بطاقة الاشتراك المدمجة
```javascript
<div className="flex items-center gap-2">
  <span className="font-semibold">الباقة:</span>
  <span className={subscription.plan_tier === 'premium'
    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
    : 'bg-gray-200 text-gray-700'
  }>
    {subscription.plan_tier === 'premium' ? '⭐ بريميم' : 'ستاندرد'}
  </span>
</div>
```

#### عرض الثيمات المقفلة
```javascript
{/* للمستخدمين العاديين - عرض الثيمات المقفلة */}
{subscription?.plan_tier === 'standard' &&
  Object.entries(themes)
    .filter(([_, theme]) => theme.premiumOnly)
    .map(([key, theme]) => (
      <button
        onClick={() => alert('⭐ هذا الثيم حصري للباقة المميزة')}
        className="opacity-50 cursor-not-allowed relative"
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm">
          <span className="text-2xl">🔒</span>
        </div>
        {/* ... الثيم */}
      </button>
    ))
}
```

---

## الترقية من Standard إلى Premium

حالياً الترقية تتم **خارج النظام** (عبر التواصل مع الإدارة).

### لتفعيل Premium لمستخدم:
```sql
UPDATE subscriptions
SET plan_tier = 'premium'
WHERE page_id = 'USER_PAGE_ID';
```

---

## الملفات المعدلة

### قاعدة البيانات
- ✅ `supabase/subscription_plan_tiers.sql` - إضافة حقل plan_tier
- ✅ `supabase/update_subscription_function.sql` - تحديث دالة get_subscription_details

### Frontend
- ✅ `src/config/themes.js` - إضافة premiumOnly + دالة getAvailableThemes
- ✅ `src/pages/AdminPage.jsx` - جميع الفحوصات والقيود
- ✅ `src/services/api.js` - جلب plan_tier من قاعدة البيانات

---

## اختبار النظام

### 1. اختبار باقة Standard
```sql
-- جعل المستخدم standard
UPDATE subscriptions SET plan_tier = 'standard' WHERE page_id = 'test';
```

**المتوقع:**
- ✅ الحد الأقصى 5 روابط
- ✅ 4 ثيمات فقط (مع عرض المقفلة)
- ❌ الرسائل المجهولة معطلة

### 2. اختبار باقة Premium
```sql
-- جعل المستخدم premium
UPDATE subscriptions SET plan_tier = 'premium' WHERE page_id = 'test';
```

**المتوقع:**
- ✅ الحد الأقصى 20 رابط
- ✅ جميع الثيمات (10)
- ✅ الرسائل المجهولة مفعلة
- ✅ شارة "⭐ Premium" تظهر في الواجهة

---

## التوافق مع الإصدارات السابقة

- المستخدمون الحاليون يحصلون على `plan_tier = 'standard'` افتراضياً
- المستخدمون الذين لديهم رسائل مجهولة مفعلة حالياً يتم ترقيتهم تلقائياً لـ Premium:

```sql
UPDATE subscriptions
SET plan_tier = 'premium'
WHERE page_id IN (
  SELECT page_id FROM pages WHERE anonymous_messages_enabled = true
);
```

---

## الخطوات التالية (اختياري)

1. **صفحة للترقية داخل التطبيق** - زر "ترقية إلى Premium" مع معلومات الدفع
2. **إحصائيات متقدمة** - حصرية لـ Premium
3. **إزالة العلامة المائية** - حصرية لـ Premium
4. **فترة تجريبية** - 7 أيام Premium مجاناً
5. **نظام قسائم خصم** - Coupon codes

---

## ملاحظات هامة

⚠️ **أمان**: جميع الفحوصات تتم على الـ Frontend والـ Backend معاً
⚠️ **SQL Scripts**: يجب تشغيل ملفات SQL بالترتيب:
  1. `subscription_plan_tiers.sql`
  2. `update_subscription_function.sql`

✅ **الاختبار**: تم اختبار النظام على المتصفحات الحديثة وعلى الجوال
