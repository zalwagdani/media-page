import { useState, useEffect } from 'react'
import { getProfile, getCodes } from '../utils/storage'

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
  const [profile, setProfile] = useState(null)
  const [codes, setCodes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCodes, setFilteredCodes] = useState([])

  useEffect(() => {
    const profileData = getProfile()
    const codesData = getCodes()
    setProfile(profileData)
    setCodes(codesData)
    setFilteredCodes(codesData)
  }, [])

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

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>
  }

  const activeSocialMedia = Object.entries(profile.socialMedia).filter(([_, url]) => url.trim() !== '')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-12 max-w-4xl">
        {/* Profile Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col items-center text-center">
            {/* Profile Picture */}
            <div className="mb-4 sm:mb-6">
              {profile.picture ? (
                <img 
                  src={profile.picture} 
                  alt={profile.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 sm:border-4 border-blue-500 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold border-2 sm:border-4 border-blue-500 shadow-lg">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">{profile.name}</h1>

            {/* Social Media Links */}
            {activeSocialMedia.length > 0 && (
              <div className="flex flex-wrap gap-2 sm:gap-4 justify-center w-full">
                {activeSocialMedia.map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 hover:text-gray-900 text-sm sm:text-base"
                  >
                    <span className="text-lg sm:text-xl">{socialIcons[platform]}</span>
                    <span className="font-medium">{socialMediaNames[platform] || platform}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">البحث عن أكواد الخصم</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث حسب المتجر، الوصف، كود الخصم، أو العلامات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
            <span className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl">
              🔍
            </span>
          </div>
        </div>

        {/* Discount Codes Display */}
        <div className="space-y-3 sm:space-y-4">
          {filteredCodes.length === 0 ? (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 text-center">
              <p className="text-gray-500 text-base sm:text-lg">
                {searchQuery ? 'لم يتم العثور على أكواد خصم تطابق بحثك.' : 'لا توجد أكواد خصم متاحة بعد. أضف بعض الأكواد من لوحة التحكم!'}
              </p>
            </div>
          ) : (
            filteredCodes.map((code) => (
              <div key={code.id} className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-shadow">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 break-words">{code.title || 'كود خصم بدون عنوان'}</h3>
                  {code.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {code.tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {code.description && (
                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">{code.description}</p>
                )}
                {(code.discountCode || code.code) && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">كود الخصم:</p>
                        <p className="text-xl sm:text-2xl font-bold text-green-700 font-mono tracking-wider break-all">
                          {code.discountCode || code.code}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(code.discountCode || code.code)
                          alert('تم نسخ الكود إلى الحافظة!')
                        }}
                        className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm whitespace-nowrap"
                      >
                        نسخ
                      </button>
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-3 sm:mt-4">
                  تم الإضافة: {new Date(code.createdAt).toLocaleDateString('ar-SA')}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage
