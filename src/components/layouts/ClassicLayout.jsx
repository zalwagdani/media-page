// Classic Layout - Traditional centered design
import React from 'react'

export default function ClassicLayout({
  profile,
  currentTheme,
  isDarkMode,
  imageLoadError,
  setImageLoadError,
  activeSocialMedia,
  renderSocialIcon,
  codes,
  filteredCodes,
  searchTerm,
  setSearchTerm,
  getYouTubeEmbedUrl
}) {
  return (
    <>
      {/* Profile Card - Centered */}
      <div className={`rounded-3xl sm:rounded-[2.5rem] shadow-2xl p-8 sm:p-12 mb-8 sm:mb-10 border-2 transition-all duration-500 transform hover:scale-[1.01] ${
        isDarkMode
          ? `bg-gradient-to-br ${currentTheme.cardBg} ${currentTheme.border} backdrop-blur-sm`
          : 'bg-white/90 border-pink-200/50 backdrop-blur-sm shadow-pink-100'
      }`}>
        <div className="flex flex-col items-center text-center">
          {/* Profile Picture - Large */}
          <div className="mb-8 sm:mb-10 transform hover:scale-105 transition-transform duration-300">
            {profile.picture && !imageLoadError ? (
              <div className="relative group w-36 h-36 sm:w-44 sm:h-44 md:w-56 md:h-56">
                <div className={`absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300 ${
                  isDarkMode ? `bg-gradient-to-r ${currentTheme.textGradient}` : 'bg-gradient-to-br from-pink-300 to-blue-300'
                }`}></div>
                <img
                  src={profile.picture}
                  alt={profile.name}
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  className={`relative w-full h-full rounded-full object-cover border-4 shadow-2xl ring-4 transition-all duration-300 transform group-hover:rotate-3 ${
                    isDarkMode
                      ? `${currentTheme.border.replace('border-', 'border-').replace('/30', '')} ring-opacity-50`
                      : 'border-pink-400 ring-pink-100'
                  }`}
                  onError={() => setImageLoadError(true)}
                  onLoad={() => setImageLoadError(false)}
                />
              </div>
            ) : (
              <div className={`relative group w-36 h-36 sm:w-44 sm:h-44 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 flex items-center justify-center text-white text-5xl sm:text-6xl md:text-7xl font-bold border-4 shadow-2xl ring-4 transition-all duration-300 transform hover:scale-110 ${
                isDarkMode ? 'border-purple-400 ring-purple-900/50' : 'border-pink-400 ring-pink-100'
              }`}>
                <div className={`absolute inset-0 rounded-full blur-xl opacity-50 ${
                  isDarkMode ? 'bg-gradient-to-br from-purple-400 to-pink-400' : 'bg-gradient-to-br from-pink-300 to-blue-300'
                }`}></div>
                <span className="relative z-10">{profile.name ? profile.name.charAt(0) : '👋'}</span>
              </div>
            )}
          </div>

          {/* Name */}
          <div className="mb-6 sm:mb-8">
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold mb-3 pb-1 leading-normal transition-colors duration-300 bg-gradient-to-r break-words ${
              isDarkMode
                ? `text-transparent bg-clip-text ${currentTheme.textGradient}`
                : 'text-transparent bg-clip-text from-pink-500 via-purple-500 to-blue-500'
            }`}>
              {profile.name}
            </h1>
            {profile.bio && (
              <p className={`text-lg sm:text-xl font-medium transition-colors duration-300 ${
                isDarkMode ? currentTheme.text : 'text-purple-600'
              }`}>
                {profile.bio}
              </p>
            )}
          </div>

          {/* Social Media Icons - Professional Circular Icons */}
          {activeSocialMedia.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center w-full max-w-2xl">
              {activeSocialMedia.map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target={!url.startsWith('mailto:') && !url.startsWith('tel:') ? '_blank' : undefined}
                  rel={!url.startsWith('mailto:') && !url.startsWith('tel:') ? 'noopener noreferrer' : undefined}
                  className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 ${
                    isDarkMode
                      ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 hover:border-white/30'
                      : 'bg-gray-900/90 hover:bg-gray-900 text-white border border-gray-900'
                  }`}
                  aria-label={platform}
                >
                  {renderSocialIcon(platform)}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Discount Codes */}
      {codes.length > 0 && (
        <div className={`mt-8 sm:mt-12 rounded-2xl shadow-xl p-6 sm:p-8 border-2 transition-all duration-500 ${
          isDarkMode
            ? `bg-gradient-to-br ${currentTheme.cardBg} ${currentTheme.border} backdrop-blur-sm`
            : 'bg-white/90 border-purple-200/50 backdrop-blur-sm shadow-purple-100'
        }`}>
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🎁</span>
            <h2 className={`text-xl sm:text-2xl font-bold transition-colors duration-300 bg-gradient-to-r ${
              isDarkMode
                ? `text-transparent bg-clip-text ${currentTheme.textGradient}`
                : 'text-transparent bg-clip-text from-purple-500 to-pink-500'
            }`}>
              أكواد الخصم
            </h2>
          </div>

          {/* Search Bar */}
          {codes.length > 3 && (
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن كود أو متجر..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-4 py-3 pr-10 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 text-sm ${
                    isDarkMode
                      ? `bg-white/5 ${currentTheme.border} ${currentTheme.text} placeholder-gray-400 focus:${currentTheme.border.replace('/30', '')} focus:ring-${currentTheme.glow}`
                      : 'bg-white border-purple-200 text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-100'
                  }`}
                />
                <svg className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          )}

          {/* Codes Grid */}
          <div className="space-y-3">
            {filteredCodes.map((code, index) => (
              <div
                key={code.id || index}
                className={`group relative p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  isDarkMode
                    ? `${currentTheme.border} hover:${currentTheme.border.replace('/30', '')} bg-white/5 hover:bg-white/10`
                    : 'border-purple-200 hover:border-purple-400 bg-gradient-to-br from-white to-purple-50'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xl">🎉</span>
                  <h3 className={`text-base sm:text-lg font-bold break-words transition-colors duration-300 bg-gradient-to-r ${
                    isDarkMode
                      ? 'text-transparent bg-clip-text from-purple-300 to-pink-300'
                      : 'text-transparent bg-clip-text from-purple-600 to-pink-600'
                  }`}>
                    {code.title}
                  </h3>
                </div>

                {code.description && (
                  <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {code.description}
                  </p>
                )}

                <div className="mt-3 flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
                  <div className={`px-3 py-1.5 rounded-lg border-2 font-mono text-sm sm:text-base font-bold break-all ${
                    isDarkMode
                      ? `${currentTheme.border} ${currentTheme.text} bg-white/5`
                      : 'border-purple-300 text-purple-700 bg-purple-50'
                  }`}>
                    {code.discountCode}
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(code.discountCode)
                      alert('تم نسخ الكود إلى الحافظة! 🎉')
                    }}
                    className="group/btn w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white rounded-lg transition-all duration-300 font-medium text-xs sm:text-sm whitespace-nowrap shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <span>نسخ</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {filteredCodes.length === 0 && (
              <div className={`text-center py-12 rounded-2xl border-2 ${
                isDarkMode
                  ? `${currentTheme.border} ${currentTheme.text} bg-white/5`
                  : 'border-purple-200 text-gray-600 bg-purple-50'
              }`}>
                <p className="text-lg">لا توجد نتائج للبحث 🔍</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* YouTube Video */}
      {profile.youtube_url && getYouTubeEmbedUrl(profile.youtube_url) && (
        <div className="mt-8 sm:mt-12 max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src={getYouTubeEmbedUrl(profile.youtube_url)}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </>
  )
}
