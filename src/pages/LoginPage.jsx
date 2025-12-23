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
        const adminPath = routePageId ? `/page/${routePageId}/admin` : '/admin'
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
        const adminPath = routePageId ? `/page/${routePageId}/admin` : '/admin'
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">تسجيل الدخول</h1>
          <p className="text-gray-600 text-sm">أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى لوحة التحكم</p>
          {currentPageId && currentPageId !== 'default' && (
            <p className="text-gray-500 text-xs mt-2">الصفحة: {currentPageId}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-base"
              placeholder="أدخل بريدك الإلكتروني"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-base"
              placeholder="أدخل كلمة المرور"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
