import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProfile, saveProfile, getCodes, addCode, deleteCode, updateCode } from '../services/api'
import { logoutAdmin, isAdminAuthenticated } from '../services/api'
import { getPageId } from '../config/supabase'

function AdminPage() {
  const { pageId: routePageId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile') // 'profile' or 'codes'
  
  // Get current page ID
  const currentPageId = routePageId || getPageId()
  const [profile, setProfile] = useState({
    name: '',
    picture: '',
    socialMedia: {
      twitter: '',
      instagram: '',
      linkedin: '',
      github: '',
      tiktok: '',
      snapchat: '',
      youtube: ''
    }
  })
  const [codes, setCodes] = useState([])
  const [editingCode, setEditingCode] = useState(null)
  const [codeForm, setCodeForm] = useState({
    title: '',
    description: '',
    discountCode: '',
    tags: ''
  })

  const [isDefaultData, setIsDefaultData] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    if (!isAdminAuthenticated()) {
      navigate('/login', { replace: true })
      return
    }

    // Load data
    const loadData = async () => {
      try {
        setLoading(true)
        console.log('Loading data for page ID:', currentPageId)
        
        const [profileResult, codesResult] = await Promise.all([
          getProfile(currentPageId),
          getCodes(currentPageId)
        ])
        
        console.log('Profile result:', profileResult)
        console.log('Codes result:', codesResult)
        
        if (profileResult.data) {
          // Ensure socialMedia object exists with all platforms
          const profileData = {
            ...profileResult.data,
            socialMedia: {
              twitter: '',
              instagram: '',
              linkedin: '',
              github: '',
              tiktok: '',
              snapchat: '',
              youtube: '',
              ...(profileResult.data.socialMedia || {})
            }
          }
          setProfile(profileData)
          setIsDefaultData(profileResult.isDefault || profileResult.data._isDefault || false)
          
          if (profileResult.isDefault || profileResult.data._isDefault) {
            console.warn('⚠️ Showing default data - no profile found in database for page:', currentPageId)
            console.warn('💡 Save the profile to create it in the database')
          } else {
            console.log('✅ Profile loaded from database')
          }
        }
        
        if (codesResult.data) {
          setCodes(codesResult.data)
        }
      } catch (error) {
        console.error('Error loading data:', error)
        alert('حدث خطأ أثناء تحميل البيانات')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [navigate, currentPageId])

  const handleProfileChange = (field, value) => {
    if (field.startsWith('social.')) {
      const platform = field.split('.')[1]
      setProfile({
        ...profile,
        socialMedia: {
          ...profile.socialMedia,
          [platform]: value
        }
      })
    } else {
      setProfile({
        ...profile,
        [field]: value
      })
    }
  }

  const saveProfileData = async () => {
    try {
      console.log('Saving profile for page:', currentPageId)
      console.log('Profile data:', profile)
      const result = await saveProfile(profile, currentPageId)
      
      if (result.error) {
        const errorMessage = result.error.userMessage || result.error.message || 'حدث خطأ غير معروف'
        alert('حدث خطأ أثناء حفظ الملف الشخصي: ' + errorMessage)
        console.error('Profile save error:', result.error)
      } else {
        console.log('✅ Profile saved successfully:', result.data)
        alert('تم حفظ الملف الشخصي بنجاح!')
        
        // Reload data to get the saved profile from database
        const profileResult = await getProfile(currentPageId)
        if (profileResult.data) {
          setProfile(profileResult.data)
          setIsDefaultData(profileResult.isDefault || false)
          console.log('✅ Profile reloaded from database')
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('حدث خطأ أثناء حفظ الملف الشخصي: ' + (error.message || 'خطأ غير معروف'))
    }
  }

  const handleCodeSubmit = async (e) => {
    e.preventDefault()
    const tagsArray = codeForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    
    try {
      if (editingCode) {
        const result = await updateCode(editingCode.id, {
          title: codeForm.title,
          description: codeForm.description,
          discountCode: codeForm.discountCode,
          tags: tagsArray
        }, currentPageId)
        
        if (result.error) {
          alert('حدث خطأ أثناء تحديث كود الخصم: ' + result.error.message)
          return
        }
        
        setEditingCode(null)
      } else {
        const result = await addCode({
          title: codeForm.title,
          description: codeForm.description,
          discountCode: codeForm.discountCode,
          tags: tagsArray
        }, currentPageId)
        
        if (result.error) {
          alert('حدث خطأ أثناء إضافة كود الخصم: ' + result.error.message)
          return
        }
      }
      
        // Reload codes
        const codesResult = await getCodes(currentPageId)
        if (codesResult.data) {
          setCodes(codesResult.data)
        }
        
        setCodeForm({ title: '', description: '', discountCode: '', tags: '' })
        alert(editingCode ? 'تم تحديث كود الخصم بنجاح!' : 'تم إضافة كود الخصم بنجاح!')
    } catch (error) {
      console.error('Error saving code:', error)
      alert('حدث خطأ أثناء حفظ كود الخصم')
    }
  }

  const handleEditCode = (code) => {
    setEditingCode(code)
    setCodeForm({
      title: code.title || '',
      description: code.description || '',
      discountCode: code.discountCode || code.code || '',
      tags: code.tags.join(', ')
    })
  }

  const handleDeleteCode = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف كود الخصم هذا؟')) {
      try {
        const result = await deleteCode(id, currentPageId)
        
        if (result.error) {
          alert('حدث خطأ أثناء حذف كود الخصم: ' + result.error.message)
          return
        }
        
        // Reload codes
        const codesResult = await getCodes(currentPageId)
        if (codesResult.data) {
          setCodes(codesResult.data)
        }
        
        if (editingCode && editingCode.id === id) {
          setEditingCode(null)
          setCodeForm({ title: '', description: '', discountCode: '', tags: '' })
        }
        
        alert('تم حذف كود الخصم بنجاح!')
      } catch (error) {
        console.error('Error deleting code:', error)
        alert('حدث خطأ أثناء حذف كود الخصم')
      }
    }
  }

  const cancelEdit = () => {
    setEditingCode(null)
    setCodeForm({ title: '', description: '', discountCode: '', tags: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">لوحة التحكم</h1>
          <div className="flex gap-2">
            <Link 
              to="/" 
              className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base whitespace-nowrap"
            >
              عرض الصفحة الرئيسية
            </Link>
            <button
              onClick={() => {
                if (window.confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                  logoutAdmin()
                  window.location.href = '/login'
                }
              }}
              className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base whitespace-nowrap"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'profile'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            إعدادات الملف الشخصي
          </button>
          <button
            onClick={() => setActiveTab('codes')}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'codes'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            إدارة أكواد الخصم
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">تعديل الملف الشخصي</h2>
            
            {isDefaultData && (
              <div className="mb-4 sm:mb-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-2">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="text-yellow-800 font-medium text-sm sm:text-base mb-1">
                      البيانات الافتراضية
                    </p>
                    <p className="text-yellow-700 text-xs sm:text-sm">
                      لا يوجد ملف شخصي محفوظ في قاعدة البيانات لهذه الصفحة. البيانات المعروضة هي بيانات افتراضية. احفظ الملف الشخصي لحفظه في قاعدة البيانات.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {loading && (
              <div className="mb-4 text-center text-gray-600">جاري التحميل...</div>
            )}
            
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                  placeholder="اسمك"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط صورة الملف الشخصي
                </label>
                <input
                  type="url"
                  value={profile.picture}
                  onChange={(e) => handleProfileChange('picture', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                  placeholder="https://example.com/your-picture.jpg"
                />
                {profile.picture && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">معاينة:</p>
                    <img 
                      src={profile.picture} 
                      alt="معاينة الملف الشخصي"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">روابط وسائل التواصل الاجتماعي</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {(() => {
                    // Ensure socialMedia exists and has all platforms
                    const socialMedia = profile.socialMedia || {}
                    const platforms = ['twitter', 'instagram', 'linkedin', 'github', 'tiktok', 'snapchat', 'youtube']
                    const platformNames = {
                      twitter: 'تويتر',
                      instagram: 'إنستغرام',
                      linkedin: 'لينكد إن',
                      github: 'جيت هاب',
                      tiktok: 'تيك توك',
                      snapchat: 'سناب شات',
                      youtube: 'يوتيوب'
                    }
                    
                    return platforms.map((platform) => (
                      <div key={platform}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {platformNames[platform] || platform}
                        </label>
                        <input
                          type="url"
                          value={socialMedia[platform] || ''}
                          onChange={(e) => handleProfileChange(`social.${platform}`, e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                          placeholder={`https://${platform}.com/yourusername`}
                        />
                      </div>
                    ))
                  })()}
                </div>
              </div>

              <button
                onClick={saveProfileData}
                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
              >
                حفظ الملف الشخصي
              </button>
            </div>
          </div>
        )}

        {/* Codes Tab */}
        {activeTab === 'codes' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Add/Edit Code Form */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                {editingCode ? 'تعديل كود الخصم' : 'إضافة كود خصم جديد'}
              </h2>
              
              <form onSubmit={handleCodeSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المتجر/العنوان *
                  </label>
                  <input
                    type="text"
                    value={codeForm.title}
                    onChange={(e) => setCodeForm({ ...codeForm, title: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                    placeholder="مثال: أمازون، نايكي، تارجت"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف
                  </label>
                  <textarea
                    value={codeForm.description}
                    onChange={(e) => setCodeForm({ ...codeForm, description: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                    placeholder="مثال: خصم 20% على جميع المنتجات، شحن مجاني، إلخ"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    كود الخصم *
                  </label>
                  <input
                    type="text"
                    value={codeForm.discountCode}
                    onChange={(e) => setCodeForm({ ...codeForm, discountCode: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-base sm:text-lg text-center tracking-wider"
                    placeholder="SAVE20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العلامات (مفصولة بفواصل)
                  </label>
                  <input
                    type="text"
                    value={codeForm.tags}
                    onChange={(e) => setCodeForm({ ...codeForm, tags: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                    placeholder="أزياء، إلكترونيات، طعام"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                  >
                    {editingCode ? 'تحديث كود الخصم' : 'إضافة كود الخصم'}
                  </button>
                  {editingCode && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium text-sm sm:text-base"
                    >
                      إلغاء
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Codes List */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">أكواد الخصم الخاصة بك ({codes.length})</h2>
              
              {codes.length === 0 ? (
                <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">لم يتم إضافة أكواد خصم بعد. أضف أول كود خصم أعلاه!</p>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {codes.map((code) => (
                    <div key={code.id} className="border-2 border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 break-words">{code.title || 'كود خصم بدون عنوان'}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditCode(code)}
                            className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs sm:text-sm font-medium"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDeleteCode(code.id)}
                            className="px-2 sm:px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs sm:text-sm font-medium"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                      {code.description && (
                        <p className="text-gray-600 mb-2 text-sm sm:text-base">{code.description}</p>
                      )}
                      {code.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                          {code.tags.map((tag, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {(code.discountCode || code.code) && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-2 sm:p-3 mb-2">
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">كود الخصم:</p>
                          <p className="text-lg sm:text-xl font-bold text-green-700 font-mono tracking-wider break-all">
                            {code.discountCode || code.code}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        تم الإضافة: {new Date(code.createdAt).toLocaleString('ar-SA')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage
