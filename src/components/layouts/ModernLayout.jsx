// Modern Layout - Split view with horizontal social icons
import React from 'react'

export default function ModernLayout({
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
      {/* Profile Card - Split Layout */}
      <div className={`rounded-3xl shadow-2xl p-6 sm:p-8 mb-8 border-2 ${
        isDarkMode
          ? `bg-gradient-to-br ${currentTheme.cardBg} ${currentTheme.border}`
          : 'bg-white/90 border-pink-200/50'
      }`}>
        <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-center">
          {/* Profile Picture - Medium Size */}
          <div className="flex justify-center md:justify-start">
            {profile.picture && !imageLoadError ? (
              <div className="relative group w-32 h-32 sm:w-40 sm:h-40">
                <div className={`absolute inset-0 rounded-2xl blur-lg opacity-40 ${
                  isDarkMode ? `bg-gradient-to-r ${currentTheme.textGradient}` : 'bg-gradient-to-br from-pink-300 to-blue-300'
                }`}></div>
                <img
                  src={profile.picture}
                  alt={profile.name}
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  className={`relative w-full h-full rounded-2xl object-cover border-4 shadow-xl ${
                    isDarkMode ? currentTheme.border.replace('/30', '') : 'border-pink-400'
                  }`}
                  onError={() => setImageLoadError(true)}
                  onLoad={() => setImageLoadError(false)}
                />
              </div>
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-5xl font-bold border-4 shadow-xl">
                {profile.name ? profile.name.charAt(0) : '👋'}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="text-center md:text-right">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r break-words ${
              isDarkMode
                ? `text-transparent bg-clip-text ${currentTheme.textGradient}`
                : 'text-transparent bg-clip-text from-pink-500 to-purple-500'
            }`}>
              {profile.name}
            </h1>
            {profile.bio && (
              <p className={`text-base sm:text-lg mb-4 ${isDarkMode ? currentTheme.text : 'text-purple-600'}`}>
                {profile.bio}
              </p>
            )}

            {/* Social Media - Horizontal */}
            {activeSocialMedia.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                {activeSocialMedia.map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target={!url.startsWith('mailto:') && !url.startsWith('tel:') ? '_blank' : undefined}
                    rel={!url.startsWith('mailto:') && !url.startsWith('tel:') ? 'noopener noreferrer' : undefined}
                    className={`p-3 rounded-xl border transition-all hover:scale-110 ${
                      isDarkMode
                        ? `${currentTheme.border} bg-white/5 hover:bg-white/10`
                        : 'border-gray-200 bg-white hover:border-purple-400 hover:shadow-lg'
                    }`}
                  >
                    <div className={isDarkMode ? currentTheme.text : 'text-gray-700'}>
                      {renderSocialIcon(platform)}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Discount Codes - Compact */}
      {codes.length > 0 && (
        <div className={`rounded-2xl shadow-xl p-6 sm:p-8 border-2 ${
          isDarkMode
            ? `bg-gradient-to-br ${currentTheme.cardBg} ${currentTheme.border}`
            : 'bg-white/90 border-purple-200/50'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${
            isDarkMode
              ? `text-transparent bg-clip-text ${currentTheme.textGradient}`
              : 'text-transparent bg-clip-text from-purple-500 to-pink-500'
          }`}>
            🎁 أكواد الخصم
          </h2>

          {codes.length > 3 && (
            <input
              type="text"
              placeholder="ابحث..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2 mb-4 rounded-xl border ${
                isDarkMode
                  ? `bg-white/5 ${currentTheme.border} ${currentTheme.text}`
                  : 'bg-white border-purple-200'
              }`}
            />
          )}

          <div className="grid gap-3">
            {filteredCodes.map((code, index) => (
              <div
                key={code.id || index}
                className={`p-4 rounded-xl border ${
                  isDarkMode
                    ? `${currentTheme.border} bg-white/5`
                    : 'border-purple-200 bg-purple-50'
                }`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-1 ${isDarkMode ? currentTheme.text : 'text-purple-700'}`}>
                      {code.title}
                    </h3>
                    {code.description && (
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {code.description}
                      </p>
                    )}
                    <code className={`inline-block mt-2 px-3 py-1 rounded text-sm font-mono ${
                      isDarkMode ? 'bg-white/10' : 'bg-white'
                    }`}>
                      {code.discountCode}
                    </code>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(code.discountCode)
                      alert('تم نسخ الكود! 🎉')
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all"
                  >
                    نسخ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* YouTube Video */}
      {profile.youtube_url && getYouTubeEmbedUrl(profile.youtube_url) && (
        <div className="mt-8 sm:mt-12 max-w-5xl mx-auto">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/10">
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
