import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProfile, getCodes } from '../services/api'
import { getPageId } from '../config/supabase'

const socialIcons = {
  twitter: '🐦',
  instagram: '📷',
  linkedin: '💼',
  github: '💻',
  tiktok: '🎵',
  snapchat: '👻',
  youtube: '📺'
}

const socialMediaNames = {
  twitter: 'تويتر',
  instagram: 'إنستغرام',
  linkedin: 'لينكد إن',
  github: 'جيت هاب',
  tiktok: 'تيك توك',
  snapchat: 'سناب شات',
  youtube: 'يوتيوب'
}

function HomePage() {
  const { pageId: routePageId } = useParams()
  const [profile, setProfile] = useState(null)
  const [codes, setCodes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCodes, setFilteredCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Dark mode state - default to true (dark mode)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved !== null ? saved === 'true' : true // Default to dark mode
  })

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Use route param if available, otherwise detect from URL
        const currentPageId = routePageId || getPageId()
        console.log('Loading data for page ID:', currentPageId)
        console.log('Current URL:', window.location.pathname)
        console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'NOT CONFIGURED')
        
        // Set default profile immediately to prevent white screen
        const defaultProfile = {
          name: 'سلم ال عباس',
          picture: 'https://p16-sign-sg.tiktokcdn.com/tos-alisg-avt-0068/3dec0101691471a65ccd646a6f6c8f67~tplv-tiktokx-cropcenter:1080:1080.jpeg?dr=14579&refresh_token=344a058b&x-expires=1766318400&x-signature=uml1wuDHXwLdorbeELuiZTZXxA4%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=my2',
          socialMedia: {
            twitter: '',
            instagram: 'google.com',
            linkedin: '',
            github: '',
            tiktok: 'google.com',
            snapchat: 'google.com',
            youtube: ''
          }
        }
        
        // Check if Supabase is configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseKey || supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
          console.warn('⚠️ Supabase not configured, using default profile')
          setProfile(defaultProfile)
          setCodes([])
          setFilteredCodes([])
          setLoading(false)
          return
        }
        
        try {
          const [profileResult, codesResult] = await Promise.all([
            getProfile(currentPageId),
            getCodes(currentPageId)
          ])
          
          console.log('Profile result:', profileResult)
          console.log('Codes result:', codesResult)
          
          if (profileResult.error) {
            console.error('Profile error:', profileResult.error)
            // Use default profile if there's an error
            if (profileResult.data) {
              setProfile(profileResult.data)
            } else {
              setProfile(defaultProfile)
            }
          } else if (profileResult.data) {
            setProfile(profileResult.data)
          } else {
            setProfile(defaultProfile)
          }
          
          if (codesResult.error) {
            console.error('Codes error:', codesResult.error)
            setCodes([])
            setFilteredCodes([])
          } else if (codesResult.data) {
            setCodes(codesResult.data)
            setFilteredCodes(codesResult.data)
          } else {
            setCodes([])
            setFilteredCodes([])
          }
        } catch (apiError) {
          console.error('API error:', apiError)
          // Use default profile on API error
          setProfile(defaultProfile)
          setCodes([])
          setFilteredCodes([])
        }
      } catch (error) {
        console.error('Error loading data:', error)
        setError(error.message)
        // Set default profile on error so page doesn't stay white
        setProfile({
          name: 'سلم ال عباس',
          picture: 'https://p16-sign-sg.tiktokcdn.com/tos-alisg-avt-0068/3dec0101691471a65ccd646a6f6c8f67~tplv-tiktokx-cropcenter:1080:1080.jpeg?dr=14579&refresh_token=344a058b&x-expires=1766318400&x-signature=uml1wuDHXwLdorbeELuiZTZXxA4%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=my2',
          socialMedia: {
            twitter: '',
            instagram: 'google.com',
            linkedin: '',
            github: '',
            tiktok: 'google.com',
            snapchat: 'google.com',
            youtube: ''
          }
        })
        setCodes([])
        setFilteredCodes([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [routePageId]) // Reload when pageId changes

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCodes(codes)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = codes.filter(code => 
        code.title.toLowerCase().includes(query) ||
        code.description.toLowerCase().includes(query) ||
        (code.discountCode || code.code || '').toLowerCase().includes(query) ||
        code.tags.some(tag => tag.toLowerCase().includes(query))
      )
      setFilteredCodes(filtered)
    }
  }, [searchQuery, codes])

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Show loading state only if we don't have a profile yet
  if (loading && !profile) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDarkMode ? 'bg-gradient-to-br from-indigo-950 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50'}`}>
        <div className="text-center">
          <div className="text-6xl sm:text-7xl mb-6 animate-bounce">✨</div>
          <div className={`text-xl sm:text-2xl font-bold mb-3 transition-colors duration-300 bg-gradient-to-r ${
            isDarkMode 
              ? 'text-transparent bg-clip-text from-purple-300 to-pink-300' 
              : 'text-transparent bg-clip-text from-pink-500 to-purple-500'
          }`}>جاري التحميل...</div>
          <div className={`text-base sm:text-lg transition-colors duration-300 ${isDarkMode ? 'text-purple-200' : 'text-purple-600'}`}>يرجى الانتظار قليلاً 🎈</div>
        </div>
      </div>
    )
  }

  // Show error message if there's an error and no profile
  if (error && !profile) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDarkMode ? 'bg-gradient-to-br from-indigo-950 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50'}`}>
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl sm:text-7xl mb-6">⚠️</div>
          <div className={`text-xl sm:text-2xl font-bold mb-3 transition-colors duration-300 ${
            isDarkMode ? 'text-red-300' : 'text-red-600'
          }`}>حدث خطأ</div>
          <div className={`text-base sm:text-lg transition-colors duration-300 mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              isDarkMode
                ? 'bg-purple-600 hover:bg-purple-500 text-white'
                : 'bg-pink-500 hover:bg-pink-400 text-white'
            }`}
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    )
  }

  // If there's no profile after loading, use fallback (shouldn't happen due to useEffect)
  if (!profile) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDarkMode ? 'bg-gradient-to-br from-indigo-950 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50'}`}>
        <div className="text-center">
          <div className="text-6xl sm:text-7xl mb-6 animate-bounce">✨</div>
          <div className={`text-xl sm:text-2xl font-bold mb-3 transition-colors duration-300 bg-gradient-to-r ${
            isDarkMode 
              ? 'text-transparent bg-clip-text from-purple-300 to-pink-300' 
              : 'text-transparent bg-clip-text from-pink-500 to-purple-500'
          }`}>جاري التحميل...</div>
          <div className={`text-base sm:text-lg transition-colors duration-300 ${isDarkMode ? 'text-purple-200' : 'text-purple-600'}`}>يرجى الانتظار قليلاً 🎈</div>
        </div>
      </div>
    )
  }

  // Normalize URLs - add https:// if missing
  const normalizeUrl = (url) => {
    if (!url || !url.trim()) return ''
    const trimmed = url.trim()
    
    // Remove any leading slashes
    const cleaned = trimmed.replace(/^\/+/, '')
    
    // If it already starts with http:// or https://, return as is
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
      return cleaned
    }
    
    // If it starts with //, treat as protocol-relative and add https:
    if (cleaned.startsWith('//')) {
      return `https:${cleaned}`
    }
    
    // Otherwise, prepend https://
    return `https://${cleaned}`
  }

  const activeSocialMedia = Object.entries(profile.socialMedia || {})
    .filter(([_, url]) => url && url.trim() !== '')
    .map(([platform, url]) => [platform, normalizeUrl(url)])

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-gradient-to-br from-indigo-950 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50'}`}>
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 max-w-5xl">
        {/* Dark Mode Toggle Button - Friendly Style */}
        <div className="flex justify-end mb-6">
          <button
            onClick={toggleDarkMode}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl border-2 border-indigo-400/30' 
                : 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-white shadow-lg hover:shadow-xl border-2 border-yellow-300/30'
            }`}
            aria-label={isDarkMode ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
          >
            <span className="text-2xl animate-pulse">{isDarkMode ? '🌙' : '☀️'}</span>
            <span className="text-sm font-semibold">{isDarkMode ? 'الوضع الداكن' : 'الوضع الفاتح'}</span>
          </button>
        </div>

        {/* Profile Section - Super Friendly Design */}
        <div className={`rounded-3xl sm:rounded-[2.5rem] shadow-2xl p-8 sm:p-12 mb-8 sm:mb-10 border-2 transition-all duration-500 transform hover:scale-[1.01] ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-800/90 via-gray-800/80 to-gray-900/90 border-purple-500/30 backdrop-blur-sm' 
            : 'bg-white/90 border-pink-200/50 backdrop-blur-sm shadow-pink-100'
        }`}>
          <div className="flex flex-col items-center text-center">
            {/* Profile Picture - Large and Circular with Friendly Animation */}
            <div className="mb-8 sm:mb-10 transform hover:scale-105 transition-transform duration-300">
              {profile.picture ? (
                <div className="relative group">
                  <div className={`absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300 ${
                    isDarkMode ? 'bg-gradient-to-br from-purple-400 to-pink-400' : 'bg-gradient-to-br from-pink-300 to-blue-300'
                  }`}></div>
                  <img 
                    src={profile.picture} 
                    alt={profile.name}
                    className={`relative w-36 h-36 sm:w-44 sm:h-44 md:w-56 md:h-56 rounded-full object-cover border-4 shadow-2xl ring-4 transition-all duration-300 transform group-hover:rotate-3 ${
                      isDarkMode 
                        ? 'border-purple-400 ring-purple-900/50' 
                        : 'border-pink-400 ring-pink-100'
                    }`}
                    onError={(e) => {
                      // If image fails to load, show fallback
                      e.target.style.display = 'none'
                      e.target.nextElementSibling.style.display = 'flex'
                    }}
                  />
                  <div 
                    className={`w-36 h-36 sm:w-44 sm:h-44 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 flex items-center justify-center text-white text-5xl sm:text-6xl md:text-7xl font-bold border-4 shadow-2xl ring-4 hidden transition-all duration-300 ${
                      isDarkMode 
                        ? 'border-purple-400 ring-purple-900/50' 
                        : 'border-pink-400 ring-pink-100'
                    }`}
                  >
                    {profile.name.charAt(0)}
                  </div>
                </div>
              ) : (
                <div className={`relative group w-36 h-36 sm:w-44 sm:h-44 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 flex items-center justify-center text-white text-5xl sm:text-6xl md:text-7xl font-bold border-4 shadow-2xl ring-4 transition-all duration-300 transform hover:scale-110 ${
                  isDarkMode 
                    ? 'border-purple-400 ring-purple-900/50' 
                    : 'border-pink-400 ring-pink-100'
                }`}>
                  <div className={`absolute inset-0 rounded-full blur-xl opacity-50 ${
                    isDarkMode ? 'bg-gradient-to-br from-purple-400 to-pink-400' : 'bg-gradient-to-br from-pink-300 to-blue-300'
                  }`}></div>
                  <span className="relative z-10">{profile.name ? profile.name.charAt(0) : '👋'}</span>
                </div>
              )}
            </div>

            {/* Name with Friendly Welcome */}
            <div className="mb-6 sm:mb-8">
              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold mb-3 transition-colors duration-300 bg-gradient-to-r ${
                isDarkMode 
                  ? 'text-transparent bg-clip-text from-purple-300 via-pink-300 to-blue-300' 
                  : 'text-transparent bg-clip-text from-pink-500 via-purple-500 to-blue-500'
              }`}>
                {profile.name}
              </h1>
              <p className={`text-lg sm:text-xl font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-purple-200' : 'text-purple-600'
              }`}>
                مرحباً بك! 👋
              </p>
            </div>

            {/* Social Media Links - Super Friendly Style */}
            {activeSocialMedia.length > 0 && (
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center w-full max-w-3xl">
                {activeSocialMedia.map(([platform, url]) => {
                  // Double-check URL is absolute (safety check)
                  let absoluteUrl = url
                  if (!absoluteUrl.startsWith('http://') && !absoluteUrl.startsWith('https://')) {
                    // Remove leading slashes and prepend https://
                    absoluteUrl = `https://${absoluteUrl.replace(/^\/+/, '')}`
                  }
                  
                  console.log(`Social link [${platform}]: ${url} -> ${absoluteUrl}`)
                  
                  return (
                    <a
                      key={platform}
                      href={absoluteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center gap-2.5 sm:gap-3 px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl transition-all duration-300 text-sm sm:text-base font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 ${
                        isDarkMode
                          ? 'bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-500 hover:to-pink-500 text-white border-2 border-purple-400/30 hover:border-purple-300/50'
                          : 'bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 text-gray-700 hover:text-gray-900 border-2 border-pink-200/50 hover:border-pink-300'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl transform group-hover:scale-125 transition-transform duration-300">{socialIcons[platform]}</span>
                      <span>{socialMediaNames[platform] || platform}</span>
                      <span className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">✨</span>
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Search Section and Discount Codes Display - Only show if codes exist */}
        {codes.length > 0 && (
          <>
            {/* Search Section - Friendly Design */}
            <div className={`rounded-3xl sm:rounded-[2.5rem] shadow-xl p-6 sm:p-8 mb-8 sm:mb-10 border-2 transition-all duration-500 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-purple-500/30 backdrop-blur-sm' 
                : 'bg-white/90 border-pink-200/50 backdrop-blur-sm shadow-pink-100'
            }`}>
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <span className="text-3xl sm:text-4xl">🎁</span>
                <h2 className={`text-2xl sm:text-3xl font-extrabold transition-colors duration-300 bg-gradient-to-r ${
                  isDarkMode 
                    ? 'text-transparent bg-clip-text from-purple-300 to-pink-300' 
                    : 'text-transparent bg-clip-text from-pink-500 to-purple-500'
                }`}>
                  البحث عن أكواد الخصم
                </h2>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث حسب المتجر، الوصف، كود الخصم، أو العلامات... 🔎"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-5 sm:px-6 py-4 sm:py-5 pr-14 sm:pr-16 text-sm sm:text-base border-2 rounded-2xl focus:outline-none transition-all duration-300 shadow-md focus:shadow-lg ${
                    isDarkMode
                      ? 'bg-gray-700/50 border-purple-500/30 text-gray-100 placeholder-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-900/30'
                      : 'bg-white/80 border-pink-200 text-gray-800 placeholder-gray-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-200'
                  }`}
                />
                <span className={`absolute right-5 sm:right-6 top-1/2 transform -translate-y-1/2 text-2xl sm:text-3xl pointer-events-none animate-pulse ${
                  isDarkMode ? 'text-purple-300' : 'text-pink-400'
                }`}>
                  🔍
                </span>
              </div>
            </div>

            {/* Discount Codes Display - Super Friendly */}
            <div className="space-y-5 sm:space-y-6">
              {filteredCodes.length === 0 ? (
                <div className={`rounded-3xl sm:rounded-[2.5rem] shadow-xl p-10 sm:p-12 text-center border-2 transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-purple-500/30 backdrop-blur-sm' 
                    : 'bg-white/90 border-pink-200/50 backdrop-blur-sm shadow-pink-100'
                }`}>
                  <div className="text-5xl sm:text-6xl mb-4">🔍</div>
                  <p className={`text-lg sm:text-xl font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-purple-200' : 'text-purple-600'
                  }`}>
                    لم يتم العثور على أكواد خصم تطابق بحثك.
                  </p>
                  <p className={`text-sm sm:text-base mt-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    جرب كلمات بحث أخرى! ✨
                  </p>
                </div>
              ) : (
                filteredCodes.map((code) => (
              <div key={code.id} className={`group rounded-3xl sm:rounded-[2.5rem] shadow-lg p-6 sm:p-8 hover:shadow-2xl transition-all duration-500 border-2 transform hover:scale-[1.02] ${
                isDarkMode
                  ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-purple-500/30 hover:border-purple-400/50 backdrop-blur-sm'
                  : 'bg-white/90 border-pink-200/50 hover:border-pink-300 backdrop-blur-sm shadow-pink-100'
              }`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0 mb-5">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl sm:text-4xl transform group-hover:scale-125 transition-transform duration-300">🎉</span>
                    <h3 className={`text-xl sm:text-2xl md:text-3xl font-extrabold break-words transition-colors duration-300 bg-gradient-to-r ${
                      isDarkMode 
                        ? 'text-transparent bg-clip-text from-purple-300 to-pink-300' 
                        : 'text-transparent bg-clip-text from-pink-500 to-purple-500'
                    }`}>{code.title || 'كود خصم بدون عنوان'}</h3>
                  </div>
                  {code.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {code.tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-all duration-300 transform hover:scale-110 ${
                            isDarkMode
                              ? 'bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white border border-purple-400/30'
                              : 'bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 border border-pink-200'
                          }`}
                        >
                          {tag} ✨
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {code.description && (
                  <p className={`mb-5 sm:mb-6 text-base sm:text-lg leading-relaxed transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-600'
                  }`}>{code.description}</p>
                )}
                {(code.discountCode || code.code) && (
                  <div className={`border-2 rounded-2xl p-5 sm:p-6 mb-5 shadow-lg transition-all duration-300 transform hover:scale-[1.02] ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-green-800/80 to-emerald-800/80 border-green-500/50'
                      : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">🎁</span>
                          <p className={`text-sm sm:text-base font-semibold transition-colors duration-300 ${
                            isDarkMode ? 'text-green-200' : 'text-green-700'
                          }`}>كود الخصم:</p>
                        </div>
                        <p className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-wider break-all transition-colors duration-300 ${
                          isDarkMode ? 'text-green-200' : 'text-green-700'
                        }`}>
                          {code.discountCode || code.code}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(code.discountCode || code.code)
                          alert('تم نسخ الكود إلى الحافظة! 🎉')
                        }}
                        className="group/btn w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white rounded-2xl transition-all duration-300 font-bold text-sm sm:text-base whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <span>نسخ</span>
                        <span className="text-lg transform group-hover/btn:rotate-12 transition-transform duration-300">📋</span>
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm">📅</span>
                  <p className={`text-xs sm:text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    تم الإضافة: {new Date(code.createdAt).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
          </>
        )}
      </div>
    </div>
  )
}

export default HomePage
