import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link, useParams } from 'react-router-dom'
import { isAdminAuthenticated, authenticateAdmin } from '../services/api'
import { getPageId } from '../config/supabase'

function LoginPage() {
  const { pageId: routePageId } = useParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Get current page ID
  const currentPageId = routePageId || getPageId()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAdminAuthenticated()) {
      const adminPageId = sessionStorage.getItem('admin_page_id')
      if (adminPageId === currentPageId) {
        // Redirect to admin page for current page
        const adminPath = routePageId ? `/${routePageId}/admin` : '/admin'
        navigate(adminPath, { replace: true })
      }
    }
  }, [navigate, currentPageId, routePageId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('Attempting login for page:', currentPageId)
      const result = await authenticateAdmin(email, password, currentPageId)

      if (result.success) {
        // Redirect to admin page for the current page
        const adminPath = routePageId ? `/${routePageId}/admin` : '/admin'
        const from = location.state?.from?.pathname || adminPath
        navigate(from, { replace: true })
      } else {
        setError(result.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة')
        setPassword('')
        setLoading(false)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.')
      setPassword('')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-2">تسجيل الدخول</h1>
          <p className="text-purple-200 text-sm">أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى لوحة التحكم</p>
          {currentPageId && currentPageId !== 'default' && (
            <p className="text-purple-300/80 text-xs mt-2">الصفحة: {currentPageId}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              placeholder="example@email.com"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-3">
              <p className="text-red-200 text-sm text-center flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري التحقق...
              </span>
            ) : (
              'تسجيل الدخول'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-purple-300 hover:text-purple-200 text-sm flex items-center gap-2 mx-auto w-fit transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
