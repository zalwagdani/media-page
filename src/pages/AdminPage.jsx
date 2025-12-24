import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProfile, saveProfile, getCodes, addCode, deleteCode, updateCode, uploadProfilePicture, deleteProfilePicture, getAnonymousMessages, deleteAnonymousMessage, toggleAnonymousMessages, isAnonymousMessagesEnabled } from '../services/api'
import { logoutAdmin, isAdminAuthenticated } from '../services/api'
import { getPageId } from '../config/supabase'

function AdminPage() {
  const { pageId: routePageId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile') // 'profile', 'codes', or 'messages'
  
  // Get current page ID
  const currentPageId = routePageId || getPageId()
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
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
  const [uploadingPicture, setUploadingPicture] = useState(false)
  const [picturePreview, setPicturePreview] = useState(null)

  // Anonymous messages state
  const [messages, setMessages] = useState([])
  const [messagesEnabled, setMessagesEnabled] = useState(true)

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
        
        const [profileResult, codesResult, messagesResult, enabledResult] = await Promise.all([
          getProfile(currentPageId),
          getCodes(currentPageId),
          getAnonymousMessages(currentPageId),
          isAnonymousMessagesEnabled(currentPageId)
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

        if (messagesResult.data) {
          setMessages(messagesResult.data)
        }

        if (enabledResult) {
          setMessagesEnabled(enabledResult.enabled)
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

  const handlePictureUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('الرجاء اختيار صورة فقط')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً. الحجم الأقصى 5 ميجابايت')
      return
    }

    try {
      setUploadingPicture(true)

      // Show preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPicturePreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Upload to Supabase Storage
      const result = await uploadProfilePicture(file, currentPageId)

      if (!result.success) {
        alert('فشل تحميل الصورة: ' + result.error)
        setPicturePreview(null)
        return
      }

      // Update profile with new picture URL and path
      setProfile({
        ...profile,
        picture: result.url,
        picture_path: result.path
      })

      alert('تم تحميل الصورة بنجاح! لا تنسى حفظ الملف الشخصي.')
    } catch (error) {
      console.error('Error uploading picture:', error)
      alert('حدث خطأ أثناء تحميل الصورة')
      setPicturePreview(null)
    } finally {
      setUploadingPicture(false)
    }
  }

  const handleRemovePicture = async () => {
    try {
      // Delete from storage if picture_path exists
      if (profile.picture_path) {
        const result = await deleteProfilePicture(profile.picture_path)
        if (!result.success) {
          console.error('Failed to delete picture from storage:', result.error)
          // Continue anyway to clear from UI
        }
      }

      // Clear from state
      setProfile({
        ...profile,
        picture: '',
        picture_path: ''
      })
      setPicturePreview(null)

      alert('تم حذف الصورة. لا تنسى حفظ الملف الشخصي لتطبيق التغييرات.')
    } catch (error) {
      console.error('Error removing picture:', error)
      alert('حدث خطأ أثناء حذف الصورة')
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

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      try {
        const result = await deleteAnonymousMessage(messageId, currentPageId)

        if (result.error) {
          alert('حدث خطأ أثناء حذف الرسالة: ' + result.error.message)
          return
        }

        // Reload messages
        const messagesResult = await getAnonymousMessages(currentPageId)
        if (messagesResult.data) {
          setMessages(messagesResult.data)
        }

        alert('تم حذف الرسالة بنجاح!')
      } catch (error) {
        console.error('Error deleting message:', error)
        alert('حدث خطأ أثناء حذف الرسالة')
      }
    }
  }

  const handleToggleMessages = async (enabled) => {
    try {
      const result = await toggleAnonymousMessages(enabled, currentPageId)

      if (result.error) {
        alert('حدث خطأ أثناء تغيير الإعدادات: ' + result.error.message)
        return
      }

      setMessagesEnabled(enabled)
      alert(enabled ? 'تم تفعيل الرسائل المجهولة!' : 'تم تعطيل الرسائل المجهولة!')
    } catch (error) {
      console.error('Error toggling messages:', error)
      alert('حدث خطأ أثناء تغيير الإعدادات')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">لوحة التحكم</h1>
          <div className="flex gap-2">
            <button
              onClick={() => {
                // Navigate to home page by removing /admin from current URL
                const currentPath = window.location.pathname
                const homePath = currentPath.replace('/admin', '')
                window.location.href = homePath || '/'
              }}
              className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base whitespace-nowrap"
            >
              عرض الصفحة الرئيسية
            </button>
            <button
              onClick={() => {
                if (window.confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                  logoutAdmin()
                  // Navigate to home page by removing /admin from current URL
                  const currentPath = window.location.pathname
                  const homePath = currentPath.replace('/admin', '')
                  window.location.href = homePath || '/'
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
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'messages'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            الرسائل المجهولة
            {messages.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                {messages.length}
              </span>
            )}
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
                  النبذة التعريفية (Bio)
                </label>
                <input
                  type="text"
                  value={profile.bio || ''}
                  onChange={(e) => handleProfileChange('bio', e.target.value.slice(0, 50))}
                  className="w-full px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                  placeholder="مثال: مرحباً! 👋"
                  maxLength={50}
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
                    نص ترحيبي قصير يظهر تحت اسمك (اختياري)
                  </span>
                  <span className="text-xs text-gray-400">
                    {(profile.bio || '').length}/50 حرف
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صورة الملف الشخصي
                </label>

                {/* File Upload Button */}
                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  {!(profile.picture || picturePreview) ? (
                    <label className="flex-1 cursor-pointer">
                      <div className={`px-4 py-3 border-2 border-dashed rounded-lg text-center transition-all ${
                        uploadingPicture
                          ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                          : 'border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400'
                      }`}>
                        <div className="flex flex-col items-center gap-2">
                          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">
                            {uploadingPicture ? 'جاري التحميل...' : 'اختر صورة من جهازك'}
                          </span>
                          <span className="text-xs text-gray-500">
                            PNG, JPG, GIF (حد أقصى 5 ميجابايت)
                          </span>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePictureUpload}
                        disabled={uploadingPicture}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRemovePicture}
                      disabled={uploadingPicture}
                      className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      حذف الصورة واختيار صورة جديدة
                    </button>
                  )}
                </div>

                {/* Image Preview */}
                {(picturePreview || profile.picture) && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">معاينة:</p>
                    <div className="relative inline-block">
                      <img
                        src={picturePreview || profile.picture}
                        alt="معاينة الملف الشخصي"
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                      {uploadingPicture && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
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

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Settings Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">إعدادات الرسائل المجهولة</h2>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl" dir="ltr">
                <button
                  onClick={() => handleToggleMessages(!messagesEnabled)}
                  className={`relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full transition-colors ${
                    messagesEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  aria-label={messagesEnabled ? 'تعطيل الرسائل المجهولة' : 'تفعيل الرسائل المجهولة'}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      messagesEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
                <div className="flex-1 text-right">
                  <p className="font-medium text-gray-800 mb-1">تفعيل زر الرسائل المجهولة</p>
                  <p className="text-sm text-gray-600">
                    عند التفعيل، سيظهر زر عائم في الصفحة الرئيسية للزوار لإرسال رسائل مجهولة
                  </p>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  الرسائل المجهولة ({messages.length})
                </h2>
                {messages.length > 0 && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {messages.length} رسالة جديدة
                  </span>
                )}
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💌</div>
                  <p className="text-gray-500 text-lg mb-2">لا توجد رسائل بعد</p>
                  <p className="text-gray-400 text-sm">
                    {messagesEnabled
                      ? 'عندما يرسل الزوار رسائل مجهولة، ستظهر هنا'
                      : 'قم بتفعيل الرسائل المجهولة أولاً لتلقي الرسائل'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="group border-2 border-purple-100 rounded-xl p-4 hover:border-purple-300 hover:shadow-lg transition-all bg-gradient-to-r from-white to-purple-50/30"
                    >
                      <div className="flex flex-col sm:flex-row items-start gap-3">
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-2xl">👤</span>
                            <span className="text-sm font-medium text-purple-600">
                              رسالة مجهولة
                            </span>
                            <span className="text-xs text-gray-400">
                              •
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(msg.created_at).toLocaleString('ar-SA', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-gray-800 text-base sm:text-lg leading-relaxed break-words whitespace-pre-wrap">
                            {msg.message}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="sm:opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-xs sm:text-sm font-medium flex-shrink-0 w-full sm:w-auto"
                        >
                          حذف
                        </button>
                      </div>
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
