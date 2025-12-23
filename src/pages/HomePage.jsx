import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProfile, getCodes } from '../services/api'
import { getPageId } from '../config/supabase'

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
  <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.206 2c1.406 0 5.277.05 7.055 2.828.896 1.395.895 3.207.894 4.554v.021c0 .967-.007 2.07.05 2.27.028.098.066.177.112.244.165.235.442.398.762.473a.898.898 0 0 1 .644.446c.073.118.098.263.07.404-.036.178-.192.327-.434.415-.599.218-1.033.598-1.291.896-.168.195-.318.43-.455.651l-.026.044c-.123.199-.261.424-.408.601-.164.198-.345.375-.549.509-.331.217-.7.327-1.097.327-.15 0-.303-.014-.458-.045l-.366-.07c-.296-.058-.557-.086-.774-.086-.484 0-.918.145-1.326.443-.528.386-1.015.959-1.487 1.754l-.023.039c-.366.616-.784 1.315-1.31 1.817a3.632 3.632 0 0 1-1.155.747 3.84 3.84 0 0 1-1.405.267c-.477 0-.952-.09-1.405-.267a3.632 3.632 0 0 1-1.155-.747c-.526-.502-.944-1.201-1.31-1.817l-.023-.04c-.472-.794-.959-1.367-1.487-1.753-.408-.298-.842-.443-1.326-.443-.217 0-.478.028-.774.086l-.366.07c-.155.03-.307.045-.458.045-.397 0-.766-.11-1.097-.327a2.518 2.518 0 0 1-.549-.509 4.991 4.991 0 0 1-.408-.601l-.026-.044a6.81 6.81 0 0 0-.455-.651c-.258-.298-.692-.678-1.291-.896-.242-.088-.398-.237-.434-.415a.566.566 0 0 1 .07-.404.898.898 0 0 1 .644-.446c.32-.075.597-.238.762-.473.046-.067.084-.146.112-.244.057-.2.05-1.303.05-2.27v-.02c0-1.348 0-3.16.894-4.555C6.929 2.05 10.8 2 12.206 2z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
  </svg>
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

const socialIcons = {
  twitter: <TwitterIcon />,
  instagram: <InstagramIcon />,
  linkedin: <LinkedInIcon />,
  github: <GitHubIcon />,
  tiktok: <TikTokIcon />,
  snapchat: <SnapchatIcon />,
  youtube: <YouTubeIcon />
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
                      <span className="transform group-hover:scale-125 transition-transform duration-300">{socialIcons[platform]}</span>
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
