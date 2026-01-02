// Minimal Layout - Clean and Professional design
import React from 'react'
import { platformLabels } from '../../utils/socialPlatforms'

export default function MinimalLayout({
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
  getYouTubeEmbedUrl,
  onLinkClick
}) {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Profile Section - Clean & Centered */}
      <div className={`text-center mb-10 pb-8 ${
        isDarkMode ? '' : ''
      }`}>
        {/* Profile Picture with elegant styling */}
        {profile.picture && !imageLoadError ? (
          <div className="relative inline-block mb-6">
            <div className={`absolute inset-0 rounded-full blur-md opacity-30 ${
              isDarkMode ? `bg-gradient-to-r ${currentTheme.textGradient}` : 'bg-gradient-to-br from-purple-400 to-pink-400'
            }`}></div>
            <img
              src={profile.picture}
              alt={profile.name}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 shadow-xl ${
                isDarkMode ? currentTheme.border.replace('/30', '') : 'border-white'
              }`}
              onError={() => setImageLoadError(true)}
              onLoad={() => setImageLoadError(false)}
            />
          </div>
        ) : (
          <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold border-4 shadow-xl ${
            isDarkMode ? 'border-purple-400' : 'border-white'
          }`}>
            {profile.name ? profile.name.charAt(0) : '👋'}
          </div>
        )}

        {/* Name with gradient */}
        <h1 className={`text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r ${
          isDarkMode
            ? `text-transparent bg-clip-text ${currentTheme.textGradient}`
            : 'text-transparent bg-clip-text from-purple-600 to-pink-600'
        }`}>
          {profile.name}
        </h1>

        {/* Bio */}
        {profile.bio && (
          <p className={`text-base sm:text-lg max-w-xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {profile.bio}
          </p>
        )}
      </div>

      {/* Social Media - Elegant Grid */}
      {activeSocialMedia.length > 0 && (
        <div className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {activeSocialMedia.map(([platform, url, label, id]) => {
              // Use custom label if provided, otherwise use default Arabic label
              const displayLabel = label || platformLabels[platform] || platform

              return (
                <a
                  key={id || platform}
                  href={url}
                  target={!url.startsWith('mailto:') && !url.startsWith('tel:') ? '_blank' : undefined}
                  rel={!url.startsWith('mailto:') && !url.startsWith('tel:') ? 'noopener noreferrer' : undefined}
                  onClick={(e) => {
                    onLinkClick && onLinkClick({ id, platform, url })
                    // Fix for TikTok and other in-app browsers
                    if (!url.startsWith('mailto:') && !url.startsWith('tel:')) {
                      e.preventDefault()
                      window.open(url, '_blank', 'noopener,noreferrer')
                    }
                  }}
                  className={`group flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    isDarkMode
                      ? `${currentTheme.border} bg-white/5 hover:bg-white/10 hover:${currentTheme.border.replace('/30', '')}`
                      : 'border-gray-200 bg-white hover:border-purple-400 hover:shadow-purple-100'
                  }`}
                >
                  <div className={`transition-transform duration-300 group-hover:scale-110 ${
                    isDarkMode ? currentTheme.text : 'text-gray-700'
                  }`}>
                    {renderSocialIcon(platform)}
                  </div>
                  <span className={`text-sm font-semibold ${
                    isDarkMode ? currentTheme.text : 'text-gray-700'
                  }`}>
                    {displayLabel}
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      )}

      {/* Discount Codes - Professional Cards */}
      {codes.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDarkMode ? `bg-gradient-to-br ${currentTheme.cardBg}` : 'bg-gradient-to-br from-purple-100 to-pink-100'
            }`}>
              <span className="text-2xl">🎁</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${
              isDarkMode
                ? `text-transparent bg-clip-text ${currentTheme.textGradient}`
                : 'text-transparent bg-clip-text from-purple-600 to-pink-600'
            }`}>
              أكواد الخصم
            </h2>
          </div>

          {codes.length > 3 && (
            <div className="mb-5">
              <input
                type="text"
                placeholder="ابحث عن كود..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 text-sm transition-all duration-300 focus:outline-none focus:ring-4 ${
                  isDarkMode
                    ? `bg-white/5 ${currentTheme.border} ${currentTheme.text} placeholder-gray-400 focus:${currentTheme.border.replace('/30', '')} focus:ring-${currentTheme.glow}`
                    : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-purple-400 focus:ring-purple-100'
                }`}
              />
            </div>
          )}

          <div className="space-y-4">
            {filteredCodes.map((code, index) => (
              <div
                key={code.id || index}
                className={`group p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  isDarkMode
                    ? `${currentTheme.border} bg-white/5 hover:bg-white/10 hover:${currentTheme.border.replace('/30', '')}`
                    : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-purple-100'
                }`}
              >
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-xl">✨</span>
                  <h3 className={`text-lg font-bold flex-1 ${
                    isDarkMode ? currentTheme.text : 'text-gray-800'
                  }`}>
                    {code.title}
                  </h3>
                </div>

                {code.description && (
                  <p className={`text-sm mb-4 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {code.description}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className={`flex-1 px-4 py-3 rounded-lg border-2 font-mono text-sm font-bold break-all text-center sm:text-right ${
                    isDarkMode
                      ? `${currentTheme.border} ${currentTheme.text} bg-white/5`
                      : 'border-purple-200 text-purple-700 bg-purple-50'
                  }`}>
                    {code.discountCode}
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(code.discountCode)
                      alert('تم نسخ الكود بنجاح! ✅')
                    }}
                    className={`px-5 py-3 rounded-lg font-bold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                    }`}
                  >
                    نسخ الكود
                  </button>
                </div>
              </div>
            ))}

            {filteredCodes.length === 0 && (
              <div className={`text-center py-12 rounded-xl border-2 ${
                isDarkMode
                  ? `${currentTheme.border} bg-white/5`
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <span className="text-4xl mb-2 block">🔍</span>
                <p className={`text-base ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  لا توجد نتائج للبحث
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* YouTube Video - Clean */}
      {profile.youtube_url && getYouTubeEmbedUrl(profile.youtube_url) && (
        <div className="mb-10">
          <div className={`relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 ${
            isDarkMode ? currentTheme.border : 'border-gray-200'
          }`}>
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

      {/* Mawthooq Badge */}
      {profile.mawthooq_url && (
        <div className="mb-10 flex justify-center">
          <a
            href={profile.mawthooq_url.startsWith('http://') || profile.mawthooq_url.startsWith('https://') ? profile.mawthooq_url : `https://${profile.mawthooq_url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-col items-center gap-2 group"
          >
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${
              isDarkMode
                ? 'bg-gradient-to-br from-green-600 to-emerald-600'
                : 'bg-gradient-to-br from-green-500 to-emerald-500'
            }`}>
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 3.18l7 3.12v5.2c0 4.52-2.98 8.69-7 9.93-4.02-1.24-7-5.41-7-9.93V7.3l7-3.12zM10 17l-3.5-3.5 1.41-1.41L10 14.17l6.09-6.09L17.5 9.5 10 17z"/>
              </svg>
            </div>
            <span className={`text-sm font-medium transition-colors ${
              isDarkMode ? 'text-green-300 group-hover:text-green-200' : 'text-green-700 group-hover:text-green-600'
            }`}>
              ترخيص موثوق
            </span>
          </a>
        </div>
      )}
    </div>
  )
}
