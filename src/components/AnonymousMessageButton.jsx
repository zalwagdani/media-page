import { useState, useEffect } from 'react'
import { addAnonymousMessage, isAnonymousMessagesEnabled } from '../services/api'
import { getPageId } from '../config/supabase'

function AnonymousMessageButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('suggestion') // 'suggestion', 'question', 'opinion'
  const [sending, setSending] = useState(false)
  const [isEnabled, setIsEnabled] = useState(true)

  useEffect(() => {
    // Check if feature is enabled
    const checkEnabled = async () => {
      const result = await isAnonymousMessagesEnabled(getPageId())
      setIsEnabled(result.enabled)
    }
    checkEnabled()
  }, [])

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!message.trim()) {
      alert('الرجاء كتابة رسالة')
      return
    }

    try {
      setSending(true)
      const result = await addAnonymousMessage(message, getPageId(), category)

      if (result.error) {
        alert('حدث خطأ أثناء إرسال الرسالة')
        console.error('Error sending message:', result.error)
      } else {
        alert('تم إرسال رسالتك بنجاح! 💌')
        setMessage('')
        setCategory('suggestion')
        setIsOpen(false)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('حدث خطأ أثناء إرسال الرسالة')
    } finally {
      setSending(false)
    }
  }

  // Don't show if disabled
  if (!isEnabled) return null

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 group"
        aria-label="إرسال رسالة مجهولة"
      >
        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">رسالة مجهولة 💌</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
                aria-label="إغلاق"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4">
              اكتب رسالتك المجهولة هنا. يمكنك كتابة ما يصل إلى 100 حرف. رسالتك ستكون مجهولة تماماً.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Category Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع الرسالة</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCategory('suggestion')}
                    className={`py-2.5 px-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      category === 'suggestion'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    💡 اقتراح
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('question')}
                    className={`py-2.5 px-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      category === 'question'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    ❓ سؤال
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('opinion')}
                    className={`py-2.5 px-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      category === 'opinion'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    💭 رأي
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 100))}
                  placeholder="اكتب رسالتك هنا..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 resize-none text-right"
                  rows="4"
                  maxLength={100}
                  disabled={sending}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">
                    {message.length}/100 حرف
                  </span>
                  {message.length >= 95 && (
                    <span className="text-xs text-orange-500 font-medium">
                      وصلت للحد الأقصى تقريباً!
                    </span>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={sending || !message.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {sending ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الإرسال...
                    </span>
                  ) : (
                    'إرسال الرسالة'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={sending}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  إلغاء
                </button>
              </div>
            </form>

            {/* Privacy Note */}
            <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-xs text-purple-800">
                🔒 رسالتك مجهولة بالكامل. لن يتمكن أحد من معرفة هويتك.
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  )
}

export default AnonymousMessageButton
