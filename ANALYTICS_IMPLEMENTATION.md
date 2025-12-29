# نظام الإحصائيات - Analytics System (OPTIMIZED)

## 🚀 النظام المحسّن

### مميزات النظام الجديد
- ✅ **عدادات يومية** بدلاً من حفظ كل زيارة كصف منفصل
- ✅ **أداء عالي** - يستخدم `INSERT ... ON CONFLICT DO UPDATE` (upsert)
- ✅ **توفير المساحة** - صف واحد لكل صفحة يومياً بدلاً من آلاف الصفوف
- ✅ **Premium فقط** - التتبع حصري للمشتركين في Premium
- ✅ **تفصيل الأجهزة** - عدادات منفصلة لـ mobile, tablet, desktop

## ✅ ما تم إنجازه

### 1. قاعدة البيانات
- ✅ جدول `analytics_daily_views` - عدادات الزيارات اليومية
- ✅ جدول `analytics_daily_clicks` - عدادات النقرات اليومية لكل رابط
- ✅ دوال PostgreSQL محسّنة للتتبع والإحصائيات
- ✅ RLS Policies للأمان
- ✅ Unique constraints لمنع التكرار

**الملف**: [supabase/analytics_schema.sql](supabase/analytics_schema.sql)

### 2. API Functions
- ✅ `trackPageView(pageId)` - يزيد عداد الزيارات لليوم الحالي
- ✅ `trackLinkClick(pageId, linkId, platform)` - يزيد عداد النقرات لليوم الحالي
- ✅ `getPageViewsStats(pageId, days)` - إحصائيات الزيارات مع تفصيل الأجهزة
- ✅ `getLinkClicksStats(pageId)` - إحصائيات نقرات الروابط
- ✅ `getDailyViews(pageId, days)` - الزيارات اليومية للرسم البياني

**الملف**: [src/services/api.js](src/services/api.js) - السطور 881-1017

### 3. تتبع الزيارات
- ✅ تم إضافة تتبع زيارات الصفحة تلقائياً في HomePage
- ✅ يكتشف نوع الجهاز (mobile, tablet, desktop)
- ✅ يعمل بصمت (silent fail) لا يؤثر على تجربة المستخدم

**الملف**: [src/pages/HomePage.jsx](src/pages/HomePage.jsx) - السطر ~230

---

## 📋 الخطوات المتبقية

### الخطوة 1: تتبع نقرات الروابط في Layouts

يجب تمرير دالة `onLinkClick` من HomePage إلى كل Layout:

#### في HomePage.jsx:
```javascript
//إضافة دالة للتعامل مع نقرات الروابط
const handleLinkClick = async (link) => {
  try {
    const currentPageId = routePageId || getPageId()
    await trackLinkClick(currentPageId, link.id, link.platform)
  } catch (error) {
    console.debug('Link click tracking skipped:', error)
  }
}

// تمرير الدالة للـ Layouts
<ClassicLayout
  ...
  onLinkClick={handleLinkClick}
/>
```

#### في كل Layout (ClassicLayout, ModernLayout, MinimalLayout):
```javascript
// إضافة prop
function ClassicLayout({ profile, socialLinks, theme, onLinkClick }) {

  // عند النقر على الرابط
  <a
    href={link.url}
    onClick={() => onLinkClick && onLinkClick(link)}
    ...
  >
```

---

### الخطوة 2: إضافة قسم الإحصائيات في AdminPage

#### 2.1: Import الدوال
```javascript
import {
  getPageViewsStats,
  getLinkClicksStats,
  getDailyViews
} from '../services/api'
```

#### 2.2: إضافة State للإحصائيات
```javascript
const [analyticsStats, setAnalyticsStats] = useState(null)
const [linkStats, setLinkStats] = useState([])
const [dailyViews, setDailyViews] = useState([])
const [analyticsLoading, setAnalyticsLoading] = useState(false)
```

#### 2.3: تحميل البيانات
```javascript
const loadAnalytics = async () => {
  try {
    setAnalyticsLoading(true)

    const [stats, links, daily] = await Promise.all([
      getPageViewsStats(currentPageId, 30),
      getLinkClicksStats(currentPageId),
      getDailyViews(currentPageId, 7)
    ])

    setAnalyticsStats(stats.data)
    setLinkStats(links.data)
    setDailyViews(daily.data)
  } catch (error) {
    console.error('Error loading analytics:', error)
  } finally {
    setAnalyticsLoading(false)
  }
}

// استدعاء في useEffect
useEffect(() => {
  if (activeTab === 'analytics') {
    loadAnalytics()
  }
}, [activeTab])
```

#### 2.4: إضافة تبويب الإحصائيات
```javascript
// في قائمة التبويبات
<button
  onClick={() => setActiveTab('analytics')}
  className={`...${activeTab === 'analytics' ? 'active' : ''}`}
>
  📊 الإحصائيات
</button>
```

#### 2.5: واجهة الإحصائيات
```javascript
{activeTab === 'analytics' && (
  <div className="space-y-6">
    {/* فحص الباقة - Premium فقط */}
    {subscription && subscription.plan_tier === 'standard' && (
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-xl p-6">
        <h3 className="font-bold text-gray-800 mb-2">⭐ ميزة حصرية للباقة المميزة</h3>
        <p className="text-sm text-gray-700">
          الإحصائيات المتقدمة متاحة فقط لمشتركي الباقة المميزة (Premium)
        </p>
      </div>
    )}

    {/* إحصائيات أساسية */}
    {(!subscription || subscription.plan_tier === 'premium') && (
      <>
        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* إجمالي الزيارات */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">إجمالي الزيارات</h3>
              <span className="text-2xl">👁️</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {analyticsStats?.total_views || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">آخر 30 يوم</p>
          </div>

          {/* زيارات اليوم */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">زيارات اليوم</h3>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {analyticsStats?.today_views || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              الأمس: {analyticsStats?.yesterday_views || 0}
            </p>
          </div>

          {/* متوسط الزيارات */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">المتوسط اليومي</h3>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {analyticsStats?.avg_daily_views || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">زيارة/يوم</p>
          </div>

          {/* إجمالي النقرات */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">نقرات الروابط</h3>
              <span className="text-2xl">🔗</span>
            </div>
            <p className="text-3xl font-bold text-orange-600">
              {linkStats.reduce((sum, link) => sum + Number(link.click_count), 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">جميع الروابط</p>
          </div>
        </div>

        {/* إحصائيات نقرات الروابط */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📊 نقرات الروابط</h2>

          {linkStats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>لا توجد نقرات على الروابط بعد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {linkStats.map((stat) => {
                const link = socialLinks.find(l => l.id === stat.link_id)
                const totalClicks = linkStats.reduce((sum, s) => sum + Number(s.click_count), 0)
                const percentage = totalClicks > 0
                  ? Math.round((Number(stat.click_count) / totalClicks) * 100)
                  : 0

                return (
                  <div key={stat.link_id} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">
                          {link ? getDisplayLabel(link) : stat.link_platform}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {platformLabels[stat.link_platform]}
                        </span>
                      </div>
                      <span className="font-bold text-purple-600">
                        {stat.click_count} نقرة
                      </span>
                    </div>

                    {/* شريط التقدم */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{percentage}% من إجمالي النقرات</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* رسم بياني بسيط للزيارات اليومية */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📈 الزيارات اليومية (آخر 7 أيام)</h2>

          {dailyViews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>لا توجد بيانات كافية</p>
            </div>
          ) : (
            <div className="space-y-2">
              {dailyViews.map((day) => {
                const maxViews = Math.max(...dailyViews.map(d => Number(d.view_count)))
                const percentage = maxViews > 0
                  ? (Number(day.view_count) / maxViews) * 100
                  : 0

                return (
                  <div key={day.view_date} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-24">
                      {new Date(day.view_date).toLocaleDateString('ar-SA', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-8 rounded-full flex items-center justify-end px-3 transition-all"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      >
                        <span className="text-white font-bold text-sm">
                          {day.view_count}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </>
    )}
  </div>
)}
```

---

## 🚀 خطوات التطبيق

### 1. تشغيل SQL في Supabase
```sql
-- نفذ هذا الملف في Supabase SQL Editor
-- supabase/analytics_schema.sql
```

### 2. إضافة تتبع النقرات في Layouts
- عدّل ClassicLayout.jsx
- عدّل ModernLayout.jsx
- عدّل MinimalLayout.jsx

### 3. إضافة قسم الإحصائيات في AdminPage
- أضف imports
- أضف state
- أضف loadAnalytics function
- أضف تبويب جديد
- أضف واجهة الإحصائيات

---

## 🎯 المميزات

### ✅ تتبع تلقائي
- تتبع كل زيارة للصفحة تلقائياً
- تتبع كل نقرة على رابط
- تخزين معلومات الجهاز والمتصفح

### ✅ إحصائيات شاملة
- إجمالي الزيارات
- زيارات اليوم والأمس
- متوسط الزيارات اليومية
- نقرات كل رابط مع النسب المئوية
- رسم بياني للزيارات اليومية

### ✅ قيود Premium
- الإحصائيات الأساسية متاحة للجميع
- الإحصائيات المتقدمة حصرية لـ Premium
- رسائل تحفيزية للترقية

### ✅ الأمان
- RLS Policies: فقط أصحاب الصفحات يرون إحصائياتهم
- بيانات مجهولة الهوية (لا يتم تخزين IP أو معلومات شخصية)
- التتبع لا يؤثر على أداء الصفحة (silent fail)

---

## 📊 البيانات المُتتبعة

### جدول analytics_daily_views
كل صف يمثل **يوم واحد** لصفحة واحدة:
- `page_id` - معرف الصفحة
- `view_date` - التاريخ (UNIQUE مع page_id)
- `total_views` - إجمالي الزيارات لهذا اليوم
- `mobile_views` - زيارات من الجوال
- `tablet_views` - زيارات من التابلت
- `desktop_views` - زيارات من الكمبيوتر
- `updated_at` - آخر تحديث

### جدول analytics_daily_clicks
كل صف يمثل **يوم واحد** لرابط واحد:
- `page_id` - معرف الصفحة
- `link_id` - معرف الرابط
- `link_platform` - نوع المنصة (instagram, twitter, إلخ)
- `click_date` - التاريخ (UNIQUE مع page_id + link_id)
- `total_clicks` - إجمالي النقرات لهذا اليوم
- `updated_at` - آخر تحديث

### كيف يعمل النظام؟
1. **أول زيارة في اليوم**: يتم إنشاء صف جديد بعداد = 1
2. **الزيارات التالية**: يتم زيادة العداد فقط (UPDATE)
3. **يوم جديد**: يتم إنشاء صف جديد تلقائياً
4. **النتيجة**: صف واحد لكل صفحة لكل يوم بدلاً من آلاف الصفوف

---

## 🔄 الصيانة

### تنظيف البيانات القديمة
```sql
-- حذف البيانات الأقدم من سنة
SELECT cleanup_old_analytics();

-- جدولة تلقائية (شهرياً)
SELECT cron.schedule(
  'cleanup-old-analytics',
  '0 0 1 * *',
  $$SELECT cleanup_old_analytics()$$
);
```

---

## ملاحظات مهمة

⚠️ **SQL**: يجب تشغيل `analytics_schema.sql` قبل استخدام النظام
⚠️ **Performance**: التتبع يعمل async ولا يؤثر على سرعة الصفحة
✅ **Privacy**: لا يتم تخزين أي معلومات شخصية أو IP
✅ **Scalable**: النظام مصمم للتوسع مع ملايين الزيارات
