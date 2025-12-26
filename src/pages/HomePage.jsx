import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProfile, getCodes, checkSubscription } from '../services/api'
import { getPageId } from '../config/supabase'
import AnonymousMessageButton from '../components/AnonymousMessageButton'
import PageNotFoundPage from './PageNotFoundPage'

// Social Media Icon Components
const TikTokIcon = () => (
  <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
  </svg>
)

const SnapchatIcon = () => (
  <span className="text-2xl">👻</span>
)


const LinkedInIcon = () => (
  <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
)

const GitHubIcon = () => (
  <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
  </svg>
)

const YouTubeIcon = () => (
  <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
  </svg>
)

const XIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const WhatsAppIcon = () => (
  <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

const EmailIcon = () => (
  <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
)

const PhoneIcon = () => (
  <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
)

const socialIcons = {
  twitter: <XIcon />,
  instagram: <InstagramIcon />,
  linkedin: <LinkedInIcon />,
  github: <GitHubIcon />,
  tiktok: <TikTokIcon />,
  snapchat: <SnapchatIcon />,
  youtube: <YouTubeIcon />,
  whatsapp: <WhatsAppIcon />,
  email: <EmailIcon />,
  phone: <PhoneIcon />
}

function HomePage() {
  const { pageId: routePageId } = useParams()
  const [profile, setProfile] = useState(null)
  const [codes, setCodes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCodes, setFilteredCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageLoadError, setImageLoadError] = useState(false)
  const [subscriptionValid, setSubscriptionValid] = useState(null) // null = checking, true = valid, false = invalid
  // Dark mode state - default to true (dark mode)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved !== null ? saved === 'true' : true // Default to dark mode
  })

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      setImageLoadError(false)
      
      try {
        // Use route param if available, otherwise detect from URL
        const currentPageId = routePageId || getPageId()
        console.log('Loading data for page ID:', currentPageId)
        console.log('Current URL:', window.location.pathname)
        console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'NOT CONFIGURED')
        
        // Set default profile immediately to prevent white screen
        const defaultProfile = {
          name: 'سلم ال عباس',
          bio: 'مرحباً! 👋',
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
          setSubscriptionValid(true) // Allow access if Supabase not configured (dev mode)
          setLoading(false)
          return
        }

        try {
          // Check subscription first
          const subscriptionResult = await checkSubscription(currentPageId)

          if (subscriptionResult.isValid === false) {
            // Subscription is invalid or expired
            setSubscriptionValid(false)
            setLoading(false)
            return
          }

          // Subscription is valid, load profile and codes
          setSubscriptionValid(true)

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

  // Show page not found if subscription is invalid
  if (subscriptionValid === false) {
    return <PageNotFoundPage />
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

  // Process URLs with special handling for email, phone, and whatsapp
  const processUrl = (platform, value) => {
    const trimmedValue = value.trim()

    // Email: Convert to mailto: format
    if (platform === 'email') {
      if (trimmedValue.startsWith('mailto:')) {
        return trimmedValue
      }
      return `mailto:${trimmedValue}`
    }

    // Phone: Convert to tel: format
    if (platform === 'phone') {
      if (trimmedValue.startsWith('tel:')) {
        return trimmedValue
      }
      // Remove any non-digit characters except +
      const cleanedPhone = trimmedValue.replace(/[^\d+]/g, '')
      return `tel:${cleanedPhone}`
    }

    // WhatsApp: Convert to wa.me format
    if (platform === 'whatsapp') {
      // If already a URL, use normalizeUrl
      if (trimmedValue.startsWith('http://') || trimmedValue.startsWith('https://') || trimmedValue.startsWith('whatsapp://')) {
        return normalizeUrl(trimmedValue)
      }
      // Otherwise, treat as phone number and convert to wa.me
      const cleanedPhone = trimmedValue.replace(/[^\d+]/g, '')
      return `https://wa.me/${cleanedPhone}`
    }

    // For all other platforms, use normalizeUrl
    return normalizeUrl(trimmedValue)
  }

  const activeSocialMedia = Object.entries(profile.socialMedia || {})
    .filter(([_, url]) => url && url.trim() !== '')
    .map(([platform, url]) => [platform, processUrl(platform, url)])

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
              {profile.picture && !imageLoadError ? (
                <div className="relative group w-36 h-36 sm:w-44 sm:h-44 md:w-56 md:h-56">
                  <div className={`absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300 ${
                    isDarkMode ? 'bg-gradient-to-br from-purple-400 to-pink-400' : 'bg-gradient-to-br from-pink-300 to-blue-300'
                  }`}></div>
                  <img
                    src={profile.picture}
                    alt={profile.name}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    loading="eager"
                    className={`relative w-full h-full rounded-full object-cover border-4 shadow-2xl ring-4 transition-all duration-300 transform group-hover:rotate-3 ${
                      isDarkMode
                        ? 'border-purple-400 ring-purple-900/50'
                        : 'border-pink-400 ring-pink-100'
                    }`}
                    onError={() => {
                      console.log('Image failed to load:', profile.picture)
                      setImageLoadError(true)
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', profile.picture)
                      setImageLoadError(false)
                    }}
                  />
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
              {profile.bio && (
                <p className={`text-lg sm:text-xl font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-purple-200' : 'text-purple-600'
                }`}>
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Social Media Links - Professional Circular Icons */}
            {activeSocialMedia.length > 0 && (
              <div className="flex flex-wrap gap-4 justify-center w-full max-w-2xl">
                {activeSocialMedia.map(([platform, url]) => {
                  // processUrl already handles special cases (mailto:, tel:, wa.me)
                  // No need for additional URL normalization here
                  const absoluteUrl = url

                  // Don't open email and phone links in new tab
                  const shouldOpenInNewTab = !url.startsWith('mailto:') && !url.startsWith('tel:')

                  console.log(`Social link [${platform}]: ${absoluteUrl}`)

                  return (
                    <a
                      key={platform}
                      href={absoluteUrl}
                      {...(shouldOpenInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 ${
                        isDarkMode
                          ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 hover:border-white/30'
                          : 'bg-gray-900/90 hover:bg-gray-900 text-white border border-gray-900'
                      }`}
                      aria-label={platform}
                    >
                      {socialIcons[platform]}
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

      {/* Anonymous Message Floating Button */}
      <AnonymousMessageButton />

      {/* Elegant Footer Signature */}
      <footer className="mt-16 sm:mt-24 pb-8 sm:pb-12">
        <div className="text-center">
          <div className={`inline-block px-8 py-6 rounded-2xl transition-all duration-500 ${
            isDarkMode
              ? 'bg-gradient-to-br from-purple-900/30 via-indigo-900/20 to-pink-900/30 border border-purple-500/20 shadow-2xl shadow-purple-900/50'
              : 'bg-gradient-to-br from-white/80 via-purple-50/50 to-pink-50/50 border border-purple-200/40 shadow-2xl shadow-purple-200/50'
          } backdrop-blur-sm`}>
            <div className="flex flex-col items-center gap-3">
              {/* Decorative Line */}
              <div className={`w-16 h-0.5 rounded-full transition-colors duration-500 ${
                isDarkMode ? 'bg-gradient-to-r from-transparent via-purple-400 to-transparent' : 'bg-gradient-to-r from-transparent via-purple-500 to-transparent'
              }`}></div>

              {/* Main Signature Text */}
              <p className={`text-lg sm:text-xl font-light tracking-wide transition-colors duration-500 ${
                isDarkMode ? 'text-purple-200/90' : 'text-gray-600'
              }`} style={{ fontFamily: '"Playfair Display", serif' }}>
                Built by
              </p>

              {/* Creator Name */}
              <h3 className={`text-3xl sm:text-4xl font-bold tracking-tight transition-all duration-500 bg-gradient-to-r ${
                isDarkMode
                  ? 'from-purple-300 via-pink-300 to-blue-300 text-transparent bg-clip-text'
                  : 'from-purple-600 via-pink-600 to-blue-600 text-transparent bg-clip-text'
              }`} style={{ fontFamily: '"Playfair Display", serif' }}>
                Ziyad
              </h3>

              {/* Decorative Line */}
              <div className={`w-16 h-0.5 rounded-full transition-colors duration-500 ${
                isDarkMode ? 'bg-gradient-to-r from-transparent via-purple-400 to-transparent' : 'bg-gradient-to-r from-transparent via-purple-500 to-transparent'
              }`}></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
