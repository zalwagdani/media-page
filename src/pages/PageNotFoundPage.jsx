function PageNotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="mb-8">
          <h1 className="text-9xl sm:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 animate-pulse">
            404
          </h1>
        </div>

        {/* Icon */}
        <div className="mb-6">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-purple-400/30">
            <svg className="w-16 h-16 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
          الصفحة غير موجودة
        </h2>

        {/* Description */}
        <p className="text-lg sm:text-xl text-purple-200 mb-8 max-w-lg mx-auto">
          عذراً، الصفحة التي تبحث عنها غير متوفرة أو قد تكون قد تم حذفها
        </p>

        {/* Decorative Elements */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>

        {/* Suggestions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
          <p className="text-purple-200 text-sm mb-4">
            💡 قد يكون السبب:
          </p>
          <ul className="text-left text-purple-200 text-sm space-y-2 max-w-md mx-auto">
            <li className="flex items-start gap-2" dir="rtl">
              <span className="text-purple-400 mt-1">•</span>
              <span>الرابط غير صحيح أو قديم</span>
            </li>
            <li className="flex items-start gap-2" dir="rtl">
              <span className="text-purple-400 mt-1">•</span>
              <span>الصفحة لم تعد متاحة</span>
            </li>
            <li className="flex items-start gap-2" dir="rtl">
              <span className="text-purple-400 mt-1">•</span>
              <span>خطأ في كتابة العنوان</span>
            </li>
          </ul>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => window.history.back()}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all font-bold text-lg hover:scale-105 active:scale-95"
          >
            ← العودة للخلف
          </button>
        </div>

        {/* Footer Message */}
        <p className="text-purple-300 text-sm mt-8">
          إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع الدعم
        </p>
      </div>
    </div>
  )
}

export default PageNotFoundPage
