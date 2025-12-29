import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProfile, saveProfile, getCodes, addCode, deleteCode, updateCode, uploadProfilePicture, deleteProfilePicture, getAnonymousMessages, deleteAnonymousMessage, toggleAnonymousMessages, isAnonymousMessagesEnabled, getSubscriptionDetails, getSocialLinks, addSocialLink, updateSocialLink, deleteSocialLink, updateSocialLinksOrder } from '../services/api'
import { logoutAdmin, isAdminAuthenticated, checkPageOwnership } from '../services/api'
import { getPageId } from '../config/supabase'
import { themes } from '../config/themes'
import { layouts } from '../config/layouts'
import { platformLabels, platformPlaceholders, platformOptions, getDisplayLabel } from '../utils/socialPlatforms'

function AdminPage() {
  const { pageId: routePageId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')

  const currentPageId = routePageId || getPageId()
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    picture: '',
    theme: 'gradient-purple',
    layout: 'classic',
    youtube_url: '',
    socialMedia: {
      twitter: '', instagram: '', linkedin: '', github: '', tiktok: '', snapchat: '',
      youtube: '', whatsapp: '', telegram: '', website: '', email: '', phone: ''
    }
  })

  const [codes, setCodes] = useState([])
  const [editingCode, setEditingCode] = useState(null)
  const [codeForm, setCodeForm] = useState({ title: '', description: '', discountCode: '', tags: '' })
  const [isDefaultData, setIsDefaultData] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploadingPicture, setUploadingPicture] = useState(false)
  const [picturePreview, setPicturePreview] = useState(null)
  const [messages, setMessages] = useState([])
  const [messagesEnabled, setMessagesEnabled] = useState(true)
  const [messageFilter, setMessageFilter] = useState('all')
  const [expandedMessage, setExpandedMessage] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [subscriptionLoading, setSubscriptionLoading] = useState(true)
  const [showExpiredPopup, setShowExpiredPopup] = useState(false)
  const [showSubscriptionCard, setShowSubscriptionCard] = useState(true)

  // Social Links State
  const [socialLinks, setSocialLinks] = useState([])
  const [editingLink, setEditingLink] = useState(null)
  const [linkForm, setLinkForm] = useState({ platform: 'instagram', url: '', label: '' })
  const [draggedLink, setDraggedLink] = useState(null)

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/login', { replace: true })
      return
    }

    const loadData = async () => {
      try {
        setLoading(true)

        // 🔒 SECURITY CHECK: Verify user owns this page
        const ownershipCheck = await checkPageOwnership(currentPageId)
        if (!ownershipCheck.authorized) {
          alert('⛔ غير مصرح لك بالوصول لهذه الصفحة!\n\nأنت تحاول الوصول لصفحة لا تملكها.')
          navigate('/login', { replace: true })
          return
        }

        const [profileResult, codesResult, messagesResult, enabledResult, subscriptionResult, socialLinksResult] = await Promise.all([
          getProfile(currentPageId),
          getCodes(currentPageId),
          getAnonymousMessages(currentPageId),
          isAnonymousMessagesEnabled(currentPageId),
          getSubscriptionDetails(currentPageId),
          getSocialLinks(currentPageId).catch(err => {
            console.warn('Social links table not found, using empty array:', err)
            return { data: [], error: null }
          })
        ])

        if (profileResult.data) {
          const profileData = {
            ...profileResult.data,
            socialMedia: {
              twitter: '', instagram: '', linkedin: '', github: '', tiktok: '', snapchat: '',
              youtube: '', whatsapp: '', telegram: '', website: '', email: '', phone: '',
              ...(profileResult.data.socialMedia || {})
            }
          }
          setProfile(profileData)
          setIsDefaultData(profileResult.isDefault || profileResult.data._isDefault || false)
        }

        if (codesResult.data) setCodes(codesResult.data)
        if (messagesResult.data) setMessages(messagesResult.data)
        if (enabledResult) setMessagesEnabled(enabledResult.enabled)
        if (subscriptionResult.data) {
          setSubscription(subscriptionResult.data)
          if (subscriptionResult.data.is_expired === true) setShowExpiredPopup(true)
        }
        if (socialLinksResult.data) setSocialLinks(socialLinksResult.data)
        setSubscriptionLoading(false)
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
      setProfile({ ...profile, socialMedia: { ...profile.socialMedia, [platform]: value } })
    } else {
      setProfile({ ...profile, [field]: value })
    }
  }

  const handlePictureUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('الرجاء اختيار صورة فقط')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً. الحجم الأقصى 5 ميجابايت')
      return
    }

    try {
      setUploadingPicture(true)
      const reader = new FileReader()
      reader.onloadend = () => setPicturePreview(reader.result)
      reader.readAsDataURL(file)

      const result = await uploadProfilePicture(file, currentPageId)
      if (!result.success) {
        alert('فشل تحميل الصورة: ' + result.error)
        setPicturePreview(null)
        return
      }

      setProfile({ ...profile, picture: result.url, picture_path: result.path })
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
      if (profile.picture_path) {
        await deleteProfilePicture(profile.picture_path)
      }
      setProfile({ ...profile, picture: '', picture_path: '' })
      setPicturePreview(null)
      alert('تم حذف الصورة. لا تنسى حفظ الملف الشخصي لتطبيق التغييرات.')
    } catch (error) {
      console.error('Error removing picture:', error)
      alert('حدث خطأ أثناء حذف الصورة')
    }
  }

  const saveProfileData = async () => {
    try {
      const result = await saveProfile(profile, currentPageId)
      if (result.error) {
        alert('حدث خطأ أثناء حفظ الملف الشخصي: ' + (result.error.userMessage || result.error.message))
      } else {
        alert('تم حفظ الملف الشخصي بنجاح!')
        const profileResult = await getProfile(currentPageId)
        if (profileResult.data) {
          setProfile(profileResult.data)
          setIsDefaultData(profileResult.isDefault || false)
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('حدث خطأ أثناء حفظ الملف الشخصي')
    }
  }

  const handleCodeSubmit = async (e) => {
    e.preventDefault()
    const tagsArray = codeForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')

    try {
      if (editingCode) {
        await updateCode(editingCode.id, {
          title: codeForm.title,
          description: codeForm.description,
          discountCode: codeForm.discountCode,
          tags: tagsArray
        }, currentPageId)
        setEditingCode(null)
      } else {
        await addCode({
          title: codeForm.title,
          description: codeForm.description,
          discountCode: codeForm.discountCode,
          tags: tagsArray
        }, currentPageId)
      }

      const codesResult = await getCodes(currentPageId)
      if (codesResult.data) setCodes(codesResult.data)
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
        await deleteCode(id, currentPageId)
        const codesResult = await getCodes(currentPageId)
        if (codesResult.data) setCodes(codesResult.data)
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
        await deleteAnonymousMessage(messageId, currentPageId)
        const messagesResult = await getAnonymousMessages(currentPageId)
        if (messagesResult.data) setMessages(messagesResult.data)
        alert('تم حذف الرسالة بنجاح!')
      } catch (error) {
        console.error('Error deleting message:', error)
        alert('حدث خطأ أثناء حذف الرسالة')
      }
    }
  }

  const handleToggleMessages = async (enabled) => {
    try {
      await toggleAnonymousMessages(enabled, currentPageId)
      setMessagesEnabled(enabled)
      alert(enabled ? 'تم تفعيل الرسائل المجهولة!' : 'تم تعطيل الرسائل المجهولة!')
    } catch (error) {
      console.error('Error toggling messages:', error)
      alert('حدث خطأ أثناء تغيير الإعدادات')
    }
  }

  // Social Links Handlers
  const handleAddLink = async (e) => {
    e.preventDefault()

    // Check max links limit (10)
    if (socialLinks.length >= 10) {
      alert('⚠️ الحد الأقصى للروابط هو 10')
      return
    }

    try {
      const { data, error } = await addSocialLink(
        currentPageId,
        linkForm.platform,
        linkForm.url,
        linkForm.label || null
      )

      if (error) throw error

      setSocialLinks([...socialLinks, data])
      setLinkForm({ platform: 'instagram', url: '', label: '' })
      alert('✅ تم إضافة الرابط بنجاح!')
    } catch (error) {
      console.error('Error adding link:', error)
      alert('❌ حدث خطأ أثناء إضافة الرابط')
    }
  }

  const handleEditLink = (link) => {
    setEditingLink(link)
    setLinkForm({
      platform: link.platform,
      url: link.url,
      label: link.label || ''
    })
  }

  const handleUpdateLink = async (e) => {
    e.preventDefault()

    try {
      const { data, error } = await updateSocialLink(editingLink.id, {
        platform: linkForm.platform,
        url: linkForm.url,
        label: linkForm.label || null
      })

      if (error) throw error

      setSocialLinks(socialLinks.map(link =>
        link.id === editingLink.id ? data : link
      ))
      setEditingLink(null)
      setLinkForm({ platform: 'instagram', url: '', label: '' })
      alert('✅ تم تحديث الرابط بنجاح!')
    } catch (error) {
      console.error('Error updating link:', error)
      alert('❌ حدث خطأ أثناء تحديث الرابط')
    }
  }

  const handleDeleteLink = async (linkId) => {
    if (!confirm('هل أنت متأكد من حذف هذا الرابط؟')) return

    try {
      const { error } = await deleteSocialLink(linkId)
      if (error) throw error

      setSocialLinks(socialLinks.filter(link => link.id !== linkId))
      alert('✅ تم حذف الرابط بنجاح!')
    } catch (error) {
      console.error('Error deleting link:', error)
      alert('❌ حدث خطأ أثناء حذف الرابط')
    }
  }

  const handleDragStart = (e, link) => {
    setDraggedLink(link)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, targetLink) => {
    e.preventDefault()

    if (!draggedLink || draggedLink.id === targetLink.id) return

    const draggedIndex = socialLinks.findIndex(l => l.id === draggedLink.id)
    const targetIndex = socialLinks.findIndex(l => l.id === targetLink.id)

    const newLinks = [...socialLinks]
    newLinks.splice(draggedIndex, 1)
    newLinks.splice(targetIndex, 0, draggedLink)

    setSocialLinks(newLinks)
    setDraggedLink(null)

    // Update order in database
    try {
      await updateSocialLinksOrder(newLinks)
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const getMediaPageUrl = () => {
    let currentPath = window.location.pathname.replace('/admin', '').replace(/^\/page\//, '/')
    return `${window.location.protocol}//${window.location.host}${currentPath || '/'}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  لوحة التحكم
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">إدارة صفحتك الشخصية</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.open(getMediaPageUrl(), '_blank')}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-xs sm:text-base"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="hidden sm:inline">عرض الصفحة</span>
                <span className="sm:hidden">عرض</span>
              </button>
              <button
                onClick={() => {
                  if (window.confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                    logoutAdmin()
                    window.location.href = getMediaPageUrl()
                  }
                }}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-xs sm:text-base"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">خروج</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Subscription Status */}
        {!subscriptionLoading && subscription && showSubscriptionCard && (
          <div className={`rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border-2 shadow-lg relative ${
            subscription.is_expired
              ? 'bg-gradient-to-r from-red-100 to-pink-100 border-red-400'
              : subscription.days_remaining <= 7
              ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-400'
              : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-400'
          }`}>
            <button
              onClick={() => setShowSubscriptionCard(false)}
              className="absolute top-3 left-3 sm:top-4 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/50 hover:bg-white flex items-center justify-center transition-all group"
              title="إخفاء"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center ${
                subscription.is_expired ? 'bg-red-500' : subscription.days_remaining <= 7 ? 'bg-yellow-500' : 'bg-green-500'
              }`}>
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 w-full">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3">حالة الاشتراك</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <span className="text-xs sm:text-sm text-gray-600">الخطة:</span>
                    <p className="font-bold text-sm sm:text-base text-gray-800">{subscription.plan_type === 'monthly' ? 'شهري' : 'سنوي'}</p>
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm text-gray-600">الانتهاء:</span>
                    <p className="font-medium text-sm sm:text-base text-gray-800">{new Date(subscription.end_date).toLocaleDateString('ar-SA')}</p>
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm text-gray-600">المتبقي:</span>
                    <p className={`font-bold text-sm sm:text-base ${subscription.is_expired ? 'text-red-600' : 'text-green-600'}`}>
                      {subscription.is_expired ? `انتهى منذ ${Math.abs(subscription.days_remaining)} يوم` : `${subscription.days_remaining} يوم`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page URL Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="text-center">
            <p className="text-sm font-medium text-blue-100 mb-3">🔗 رابط صفحتك</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(getMediaPageUrl())
                alert('تم نسخ الرابط! 🎉')
              }}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:shadow-lg transition-all font-bold flex items-center gap-2 mx-auto mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              نسخ الرابط
            </button>
            <p className="text-white/90 font-mono text-sm break-all px-4" dir="ltr">{getMediaPageUrl()}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 sm:mb-8 p-2">
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-6 py-3 sm:py-4 rounded-xl font-bold transition-all text-xs sm:text-base ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden sm:inline">الملف الشخصي</span>
              <span className="sm:hidden">الملف</span>
            </button>
            <button
              onClick={() => setActiveTab('codes')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-6 py-3 sm:py-4 rounded-xl font-bold transition-all text-xs sm:text-base ${
                activeTab === 'codes'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="hidden sm:inline">أكواد الخصم</span>
              <span className="sm:hidden">الأكواد</span>
              {codes.length > 0 && (
                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white text-purple-600 rounded-full text-xs font-bold">
                  {codes.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-6 py-3 sm:py-4 rounded-xl font-bold transition-all text-xs sm:text-base ${
                activeTab === 'messages'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>الرسائل</span>
              {messages.length > 0 && (
                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white text-purple-600 rounded-full text-xs font-bold">
                  {messages.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
              {/* Profile Picture */}
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  {(picturePreview || profile.picture) ? (
                    <img
                      src={picturePreview || profile.picture}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  {uploadingPicture && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <div className="flex justify-center gap-3">
                  {!(profile.picture || picturePreview) ? (
                    <label className="cursor-pointer px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all font-bold">
                      📷 اختر صورة
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
                      onClick={handleRemovePicture}
                      className="px-6 py-3 bg-red-500 text-white rounded-xl hover:shadow-lg transition-all font-bold"
                    >
                      🗑️ حذف الصورة
                    </button>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الاسم</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                    placeholder="مثال: أحمد محمد"
                  />
                  <p className="text-xs text-gray-500 mt-1">💡 اسمك الذي سيظهر في أعلى صفحتك</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">النبذة التعريفية (Bio)</label>
                  <input
                    type="text"
                    value={profile.bio || ''}
                    onChange={(e) => handleProfileChange('bio', e.target.value.slice(0, 50))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                    placeholder="مثال: مصمم جرافيك | مهتم بالتقنية 💻"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500 mt-1">💡 نص قصير يظهر تحت اسمك ({(profile.bio || '').length}/50 حرف)</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">رابط فيديو يوتيوب (اختياري)</label>
                <input
                  type="text"
                  value={profile.youtube_url || ''}
                  onChange={(e) => handleProfileChange('youtube_url', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  dir="ltr"
                />
                <p className="text-xs text-gray-500 mt-1">💡 الصق رابط فيديو يوتيوب ليظهر مباشرة في صفحتك</p>
              </div>

              {/* Theme & Layout */}
              <div>
                <label className="block text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">🎨 تصميم الصفحة</label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">💡 اختر تخطيط الصفحة - كيف تريد أن تظهر الأزرار والمحتوى</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {Object.entries(layouts).map(([key, layout]) => (
                    <button
                      key={key}
                      onClick={() => handleProfileChange('layout', key)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        profile.layout === key
                          ? 'border-purple-500 bg-purple-50 shadow-lg'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-3xl mb-2 text-center">{layout.icon}</div>
                      <h3 className="font-bold text-center">{layout.name}</h3>
                      <p className="text-xs text-gray-600 text-center">{layout.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">🌈 ثيم الألوان</label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">💡 اختر مجموعة الألوان التي تناسب ذوقك - سيتم تطبيقها على كامل الصفحة</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
                  {Object.entries(themes).map(([key, theme]) => (
                    <button
                      key={key}
                      onClick={() => handleProfileChange('theme', key)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        profile.theme === key
                          ? 'border-purple-500 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-full h-12 rounded-lg bg-gradient-to-br ${theme.gradient} mb-2 flex items-center justify-center text-2xl`}>
                        {theme.icon}
                      </div>
                      <p className="text-xs font-medium text-center">{theme.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Social Media - Dynamic Links */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-4">📱 وسائل التواصل</label>
                <p className="text-sm text-gray-600 mb-4">💡 أضف روابط حساباتك - يمكنك إضافة أكثر من رابط لنفس التطبيق مع إمكانية تخصيص العنوان</p>

                {/* Add/Edit Form */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
                  <form onSubmit={editingLink ? handleUpdateLink : handleAddLink} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Platform Selector */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">التطبيق *</label>
                        <div className="relative">
                          <select
                            value={linkForm.platform}
                            onChange={(e) => setLinkForm({ ...linkForm, platform: e.target.value })}
                            className="w-full h-[50px] px-4 pr-10 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none bg-white appearance-none cursor-pointer transition-all hover:border-purple-400"
                            required
                          >
                            {platformOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {/* Custom Arrow Icon */}
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* URL Input */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">الرابط *</label>
                        <input
                          type="text"
                          value={linkForm.url}
                          onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                          className="w-full h-[50px] px-4 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all hover:border-purple-400"
                          placeholder={platformPlaceholders[linkForm.platform]}
                          dir="ltr"
                          maxLength={500}
                          required
                        />
                      </div>

                      {/* Label Input (Optional) */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          العنوان المخصص (اختياري)
                        </label>
                        <input
                          type="text"
                          value={linkForm.label}
                          onChange={(e) => setLinkForm({ ...linkForm, label: e.target.value })}
                          className="w-full h-[50px] px-4 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all hover:border-purple-400"
                          placeholder={platformLabels[linkForm.platform]}
                          maxLength={30}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          يظهر في التصميم البسيط ({linkForm.label.length}/30 حرف)
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all font-bold"
                      >
                        {editingLink ? '✅ تحديث الرابط' : '➕ إضافة رابط'}
                      </button>
                      {editingLink && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLink(null)
                            setLinkForm({ platform: 'instagram', url: '', label: '' })
                          }}
                          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 hover:scale-[1.02] active:scale-[0.98] transition-all font-bold"
                        >
                          ❌ إلغاء
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Links List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-800">
                      الروابط المضافة ({socialLinks.length}/10)
                    </h3>
                    {socialLinks.length === 0 && (
                      <span className="text-sm text-gray-500">لم يتم إضافة روابط بعد</span>
                    )}
                  </div>

                  {socialLinks.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                      <div className="text-4xl mb-2">🔗</div>
                      <p className="text-gray-500">ابدأ بإضافة روابط التواصل الاجتماعي</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {socialLinks.map((link) => (
                        <div
                          key={link.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, link)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, link)}
                          className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all cursor-move group"
                        >
                          {/* Drag Handle */}
                          <div className="hidden sm:block text-gray-400 group-hover:text-purple-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                            </svg>
                          </div>

                          {/* Link Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-bold text-gray-800 break-words">
                                {getDisplayLabel(link)}
                              </span>
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full whitespace-nowrap">
                                {platformLabels[link.platform]}
                              </span>
                              {link.label && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap">
                                  مخصص
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 truncate" dir="ltr">
                              {link.url}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 sm:flex-row">
                            <button
                              onClick={() => handleEditLink(link)}
                              className="flex-1 sm:flex-none px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 active:scale-95 transition-all"
                              title="تعديل"
                            >
                              ✏️ تعديل
                            </button>
                            <button
                              onClick={() => handleDeleteLink(link.id)}
                              className="flex-1 sm:flex-none px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 active:scale-95 transition-all"
                              title="حذف"
                            >
                              🗑️ حذف
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Drag & Drop Hint */}
                  {socialLinks.length > 1 && (
                    <p className="text-xs text-gray-500 text-center mt-3">
                      <span className="hidden sm:inline">💡 اسحب الروابط لإعادة ترتيبها</span>
                      <span className="sm:hidden">💡 استخدم الكمبيوتر لإعادة ترتيب الروابط بالسحب</span>
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={saveProfileData}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition-all font-bold text-lg"
              >
                💾 حفظ الملف الشخصي
              </button>
            </div>
          </div>
        )}

        {activeTab === 'codes' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Add/Edit Code Form */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingCode ? '✏️ تعديل كود الخصم' : '➕ إضافة كود خصم جديد'}
              </h2>
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">المتجر/العنوان *</label>
                    <input
                      type="text"
                      value={codeForm.title}
                      onChange={(e) => setCodeForm({ ...codeForm, title: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="مثال: أمازون السعودية، نون، نايكي"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">💡 اسم المتجر أو الموقع المرتبط بالكود</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">كود الخصم *</label>
                    <input
                      type="text"
                      value={codeForm.discountCode}
                      onChange={(e) => setCodeForm({ ...codeForm, discountCode: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none font-mono text-lg text-center uppercase"
                      placeholder="SAVE20"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">💡 الكود الذي سينسخه الزوار</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الوصف</label>
                  <textarea
                    value={codeForm.description}
                    onChange={(e) => setCodeForm({ ...codeForm, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                    placeholder="مثال: خصم 20% على جميع المنتجات + شحن مجاني"
                    rows="3"
                  />
                  <p className="text-xs text-gray-500 mt-1">💡 تفاصيل العرض والخصم (اختياري)</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">العلامات (مفصولة بفواصل)</label>
                  <input
                    type="text"
                    value={codeForm.tags}
                    onChange={(e) => setCodeForm({ ...codeForm, tags: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                    placeholder="مثال: أزياء، إلكترونيات، طعام، سفر"
                  />
                  <p className="text-xs text-gray-500 mt-1">💡 تصنيفات لتنظيم الأكواد (اختياري)</p>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all font-bold"
                  >
                    {editingCode ? '✅ تحديث' : '➕ إضافة'}
                  </button>
                  {editingCode && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-all font-bold"
                    >
                      ❌ إلغاء
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Codes List */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">أكواد الخصم ({codes.length})</h2>
              {codes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏷️</div>
                  <p className="text-gray-500 text-lg">لم يتم إضافة أكواد خصم بعد</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {codes.map((code) => (
                    <div key={code.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-lg transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-800">{code.title}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditCode(code)}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium"
                          >
                            ✏️ تعديل
                          </button>
                          <button
                            onClick={() => handleDeleteCode(code.id)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium"
                          >
                            🗑️ حذف
                          </button>
                        </div>
                      </div>
                      {code.description && <p className="text-gray-600 mb-3">{code.description}</p>}
                      {code.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {code.tags.map((tag, idx) => (
                            <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 rounded-xl p-4">
                        <p className="text-sm text-gray-600 mb-1">كود الخصم:</p>
                        <p className="text-2xl font-bold text-green-700 font-mono">{code.discountCode || code.code}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Settings */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">⚙️ إعدادات الرسائل المجهولة</h2>
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                <div>
                  <p className="font-bold text-gray-800 mb-1">تفعيل الرسائل المجهولة</p>
                  <p className="text-sm text-gray-600">عند التفعيل، سيظهر زر عائم للزوار لإرسال رسائل</p>
                </div>
                <button
                  onClick={() => handleToggleMessages(!messagesEnabled)}
                  className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors ${
                    messagesEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  dir="ltr"
                >
                  <span className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform ${
                    messagesEnabled ? 'translate-x-11' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            {/* Messages List */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  الرسائل المجهولة ({messages.filter(m => messageFilter === 'all' || m.category === messageFilter).length})
                </h2>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                {[
                  { key: 'all', label: '📋 الكل', count: messages.length },
                  { key: 'suggestion', label: '💡 اقتراحات', count: messages.filter(m => m.category === 'suggestion').length },
                  { key: 'question', label: '❓ أسئلة', count: messages.filter(m => m.category === 'question').length },
                  { key: 'opinion', label: '💭 آراء', count: messages.filter(m => m.category === 'opinion').length }
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setMessageFilter(key)}
                    className={`px-4 py-2 rounded-xl border-2 font-medium transition-all ${
                      messageFilter === key
                        ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>

              {messages.filter(m => messageFilter === 'all' || m.category === messageFilter).length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">💌</div>
                  <p className="text-gray-500 text-lg mb-2">لا توجد رسائل بعد</p>
                  <p className="text-gray-400">ستظهر الرسائل المجهولة هنا عندما يرسلها الزوار</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.filter(m => messageFilter === 'all' || m.category === messageFilter).map((msg) => {
                    const categoryIcons = { suggestion: '💡', question: '❓', opinion: '💭' }
                    const categoryColors = {
                      suggestion: 'from-blue-50 to-indigo-50 border-blue-200',
                      question: 'from-green-50 to-emerald-50 border-green-200',
                      opinion: 'from-purple-50 to-pink-50 border-purple-200'
                    }
                    return (
                      <div
                        key={msg.id}
                        className={`border-2 rounded-xl p-6 bg-gradient-to-r ${categoryColors[msg.category]} hover:shadow-lg transition-all`}
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="text-3xl">{categoryIcons[msg.category]}</div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-2">
                              {new Date(msg.created_at).toLocaleString('ar-SA')}
                            </p>
                            <p className="text-gray-800 text-lg leading-relaxed">{msg.message}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-bold"
                        >
                          🗑️ حذف
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Subscription Popup */}
      {showExpiredPopup && subscription && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">⚠️ انتهى الاشتراك</h2>
              <p className="text-gray-600">
                اشتراكك انتهى منذ <span className="font-bold text-red-600">{Math.abs(subscription.days_remaining)} يوم</span>
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => window.open('mailto:support@example.com', '_blank')}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-xl transition-all font-bold"
              >
                📧 تواصل للتجديد
              </button>
              <button
                onClick={() => setShowExpiredPopup(false)}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-medium"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPage
