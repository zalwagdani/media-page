import { useEffect, useState } from 'react'
import { getSubscriptionDetails } from '../services/api'
import { getPageId } from '../config/supabase'

function SubscriptionExpiredPage() {
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSubscription = async () => {
      const result = await getSubscriptionDetails(getPageId())
      if (result.data) {
        setSubscription(result.data)
      }
      setLoading(false)
    }
    loadSubscription()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center border-4 border-red-200">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            انتهى الاشتراك
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            عذراً، لقد انتهت صلاحية اشتراكك في هذه الصفحة
          </p>

          {/* Subscription Details */}
          {subscription && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 mb-8 border-2 border-red-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4">تفاصيل الاشتراك</h2>
              <div className="space-y-3 text-right">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">نوع الاشتراك:</span>
                  <span className="font-bold text-gray-800">
                    {subscription.plan_type === 'monthly' ? '📅 شهري' : '📆 سنوي'}
                    {subscription.is_trial && ' (تجريبي)'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">تاريخ البداية:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(subscription.start_date).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">تاريخ الانتهاء:</span>
                  <span className="font-medium text-red-600">
                    {new Date(subscription.end_date).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                {subscription.days_remaining !== undefined && subscription.days_remaining < 0 && (
                  <div className="flex justify-between items-center pt-3 border-t-2 border-red-200">
                    <span className="text-gray-600">منذ:</span>
                    <span className="font-bold text-red-600">
                      {Math.abs(subscription.days_remaining)} يوم
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-6">
              <p className="text-sm text-yellow-800">
                💡 لتجديد اشتراكك والوصول إلى صفحتك، يرجى التواصل مع فريق الدعم
              </p>
            </div>

            <a
              href="mailto:support@example.com"
              className="block w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-xl transition-all font-bold text-lg hover:scale-105"
            >
              📧 تواصل مع الدعم
            </a>

            <a
              href="https://wa.me/966500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all font-bold text-lg hover:scale-105"
            >
              💬 واتساب
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            هل تحتاج المساعدة؟ نحن هنا لخدمتك
          </p>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionExpiredPage
