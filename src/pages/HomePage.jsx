import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProfile, getCodes, checkSubscription } from '../services/api'
import { getPageId } from '../config/supabase'
import AnonymousMessageButton from '../components/AnonymousMessageButton'
import PageNotFoundPage from './PageNotFoundPage'
import { getTheme } from '../config/themes'
import { getLayout } from '../config/layouts'
import ClassicLayout from '../components/layouts/ClassicLayout'
import ModernLayout from '../components/layouts/ModernLayout'
import MinimalLayout from '../components/layouts/MinimalLayout'

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

const WebsiteIcon = () => (
  <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
)

const TelegramIcon = () => (
  <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.67-.52.36-.99.53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.48 1.02-.73 3.99-1.73 6.65-2.87 7.98-3.42 3.8-1.58 4.59-1.85 5.1-1.86.11 0 .37.03.53.17.14.11.17.26.19.38-.01.06-.01.24-.03.38z"/>
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
  phone: <PhoneIcon />,
  website: <WebsiteIcon />,
  telegram: <TelegramIcon />
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
        console.log('=== HomePage Debug Info ===')
        console.log('Route pageId (from React Router):', routePageId)
        console.log('Detected pageId (from getPageId):', getPageId())
        console.log('Final pageId being used:', currentPageId)
        console.log('Current URL:', window.location.pathname)
        console.log('Current hostname:', window.location.hostname)
        console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'NOT CONFIGURED')
        console.log('=========================')
        
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

  // Convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url || !url.trim()) return null

    try {
      // Handle different YouTube URL formats
      // https://www.youtube.com/watch?v=VIDEO_ID
      // https://youtu.be/VIDEO_ID
      // https://www.youtube.com/embed/VIDEO_ID

      const urlObj = new URL(url.includes('http') ? url : `https://${url}`)
      let videoId = null

      if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v')
      } else if (urlObj.hostname === 'youtu.be') {
        videoId = urlObj.pathname.slice(1)
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }
    } catch (e) {
      console.error('Error parsing YouTube URL:', e)
    }

    return null
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

    // Telegram: Convert to t.me format
    if (platform === 'telegram') {
      // If already a URL, use normalizeUrl
      if (trimmedValue.startsWith('http://') || trimmedValue.startsWith('https://') || trimmedValue.startsWith('t.me/')) {
        return normalizeUrl(trimmedValue)
      }
      // Otherwise, treat as username and convert to t.me
      const cleanedUsername = trimmedValue.replace(/^@/, '') // Remove @ if present
      return `https://t.me/${cleanedUsername}`
    }

    // For all other platforms, use normalizeUrl
    return normalizeUrl(trimmedValue)
  }

  const activeSocialMedia = Object.entries(profile.socialMedia || {})
    .filter(([_, url]) => url && url.trim() !== '')
    .map(([platform, url]) => [platform, processUrl(platform, url)])

  // Get theme configuration
  const currentTheme = getTheme(profile.theme || 'gradient-purple')
  const currentLayout = getLayout(profile.layout || 'classic')

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? `bg-gradient-to-br ${currentTheme.gradient}` : 'bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50'}`}>
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 max-w-5xl">
        {/* Premium Glassmorphism Action Buttons - Fixed Pill Container */}
        <div className="fixed top-4 right-4 z-50" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className={`flex items-center gap-2 px-2 py-2 rounded-full backdrop-blur-xl transition-all duration-300 shadow-2xl ${
            isDarkMode
              ? `bg-white/10 border border-white/20 ${currentTheme.glow}`
              : 'bg-white/40 border border-white/60 shadow-black/10'
          }`}>
            {/* Share Button */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: profile.name,
                    text: profile.bio || `تحقق من صفحة ${profile.name}`,
                    url: window.location.href
                  }).catch(err => console.log('Error sharing:', err))
                } else {
                  navigator.clipboard.writeText(window.location.href)
                  alert('تم نسخ الرابط!')
                }
              }}
              className={`relative w-11 h-11 rounded-full transition-all duration-200 transform active:scale-90 flex items-center justify-center group ${
                isDarkMode
                  ? 'hover:bg-white/20 text-white'
                  : 'hover:bg-black/10 text-gray-800'
              }`}
              aria-label="Share page"
            >
              <svg
                className="w-5 h-5 transition-transform duration-200 group-active:scale-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              {/* Ripple effect on tap */}
              <span className="absolute inset-0 rounded-full bg-current opacity-0 group-active:opacity-10 transition-opacity duration-200"></span>
            </button>

            {/* Separator */}
            <div className={`w-px h-6 ${isDarkMode ? 'bg-white/20' : 'bg-black/10'}`}></div>

            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className={`relative w-11 h-11 rounded-full transition-all duration-200 transform active:scale-90 flex items-center justify-center group ${
                isDarkMode
                  ? 'hover:bg-white/20 text-yellow-300'
                  : 'hover:bg-black/10 text-gray-800'
              }`}
              aria-label="Toggle dark mode"
            >
              {/* Moon Icon (Dark Mode) */}
              <svg
                className={`w-5 h-5 absolute transition-all duration-300 ${
                  isDarkMode
                    ? 'opacity-100 rotate-0 scale-100'
                    : 'opacity-0 rotate-90 scale-0'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
              {/* Sun Icon (Light Mode) */}
              <svg
                className={`w-5 h-5 absolute transition-all duration-300 ${
                  isDarkMode
                    ? 'opacity-0 -rotate-90 scale-0'
                    : 'opacity-100 rotate-0 scale-100'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
              {/* Ripple effect on tap */}
              <span className="absolute inset-0 rounded-full bg-current opacity-0 group-active:opacity-10 transition-opacity duration-200"></span>
            </button>
          </div>
        </div>

        {/* Dynamic Layout Based on User Selection */}
        {currentLayout.name === 'عصري' ? (
          <ModernLayout
            profile={profile}
            currentTheme={currentTheme}
            isDarkMode={isDarkMode}
            imageLoadError={imageLoadError}
            setImageLoadError={setImageLoadError}
            activeSocialMedia={activeSocialMedia}
            renderSocialIcon={(platform) => socialIcons[platform]}
            codes={codes}
            filteredCodes={filteredCodes}
            searchTerm={searchQuery}
            setSearchTerm={setSearchQuery}
            getYouTubeEmbedUrl={getYouTubeEmbedUrl}
          />
        ) : currentLayout.name === 'بسيط' ? (
          <MinimalLayout
            profile={profile}
            currentTheme={currentTheme}
            isDarkMode={isDarkMode}
            imageLoadError={imageLoadError}
            setImageLoadError={setImageLoadError}
            activeSocialMedia={activeSocialMedia}
            renderSocialIcon={(platform) => socialIcons[platform]}
            codes={codes}
            filteredCodes={filteredCodes}
            searchTerm={searchQuery}
            setSearchTerm={setSearchQuery}
            getYouTubeEmbedUrl={getYouTubeEmbedUrl}
          />
        ) : (
          <ClassicLayout
            profile={profile}
            currentTheme={currentTheme}
            isDarkMode={isDarkMode}
            imageLoadError={imageLoadError}
            setImageLoadError={setImageLoadError}
            activeSocialMedia={activeSocialMedia}
            renderSocialIcon={(platform) => socialIcons[platform]}
            codes={codes}
            filteredCodes={filteredCodes}
            searchTerm={searchQuery}
            setSearchTerm={setSearchQuery}
            getYouTubeEmbedUrl={getYouTubeEmbedUrl}
          />
        )}

        {/* Anonymous Message Floating Button */}
        <AnonymousMessageButton theme={currentTheme} isDarkMode={isDarkMode} />

        {/* Elegant Footer Signature */}
        <footer className="mt-12 sm:mt-16 pb-8 sm:pb-12">
          <div className="text-center">
            <div className={`inline-block px-6 py-4 rounded-2xl transition-all duration-500 ${
              isDarkMode
                ? 'bg-gradient-to-br from-purple-900/30 via-indigo-900/20 to-pink-900/30 border border-purple-500/20 shadow-xl shadow-purple-900/30'
                : 'bg-gradient-to-br from-white/80 via-purple-50/50 to-pink-50/50 border border-purple-200/40 shadow-xl shadow-purple-200/30'
            } backdrop-blur-sm`}>
              <div className="flex flex-col items-center gap-2">
                {/* Decorative Line */}
                <div className={`w-12 h-0.5 rounded-full transition-colors duration-500 ${
                  isDarkMode ? 'bg-gradient-to-r from-transparent via-purple-400 to-transparent' : 'bg-gradient-to-r from-transparent via-purple-500 to-transparent'
                }`}></div>

                {/* Main Signature Text */}
                <p className={`text-sm sm:text-base font-light tracking-wide transition-colors duration-500 ${
                  isDarkMode ? 'text-purple-200/90' : 'text-gray-600'
                }`} style={{ fontFamily: '"Playfair Display", serif' }}>
                  Built by
                </p>

                {/* Creator Name */}
                <h3 className={`text-xl sm:text-2xl font-bold tracking-tight transition-all duration-500 bg-gradient-to-r ${
                  isDarkMode
                    ? 'from-purple-300 via-pink-300 to-blue-300 text-transparent bg-clip-text'
                    : 'from-purple-600 via-pink-600 to-blue-600 text-transparent bg-clip-text'
                }`} style={{ fontFamily: '"Playfair Display", serif' }}>
                  Ziyad
                </h3>

                {/* Decorative Line */}
                <div className={`w-12 h-0.5 rounded-full transition-colors duration-500 ${
                  isDarkMode ? 'bg-gradient-to-r from-transparent via-purple-400 to-transparent' : 'bg-gradient-to-r from-transparent via-purple-500 to-transparent'
                }`}></div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default HomePage
