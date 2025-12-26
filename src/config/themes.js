// Theme configurations for the media page
export const themes = {
  'gradient-purple': {
    name: 'البنفسجي الكلاسيكي',
    gradient: 'from-purple-900 via-purple-800 to-indigo-900',
    accent: 'bg-purple-600 hover:bg-purple-700',
    text: 'text-purple-100',
    textGradient: 'from-purple-300 to-pink-300',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/20',
    cardBg: 'from-purple-800/90 via-purple-800/80 to-purple-900/90',
    icon: '💜'
  },
  'gradient-royal': {
    name: 'الملكي الفاخر',
    gradient: 'from-indigo-950 via-violet-900 to-purple-950',
    accent: 'bg-violet-600 hover:bg-violet-700',
    text: 'text-violet-100',
    textGradient: 'from-violet-300 to-purple-300',
    border: 'border-violet-500/30',
    glow: 'shadow-violet-500/20',
    cardBg: 'from-violet-800/90 via-violet-800/80 to-violet-900/90',
    icon: '👑'
  },
  'gradient-sunset': {
    name: 'غروب الشمس',
    gradient: 'from-orange-900 via-red-800 to-pink-900',
    accent: 'bg-orange-600 hover:bg-orange-700',
    text: 'text-orange-100',
    textGradient: 'from-orange-300 to-pink-300',
    border: 'border-orange-500/30',
    glow: 'shadow-orange-500/20',
    cardBg: 'from-orange-800/90 via-red-800/80 to-pink-900/90',
    icon: '🌅'
  },
  'gradient-ocean': {
    name: 'المحيط العميق',
    gradient: 'from-teal-900 via-cyan-800 to-blue-900',
    accent: 'bg-teal-600 hover:bg-teal-700',
    text: 'text-teal-100',
    textGradient: 'from-teal-300 to-cyan-300',
    border: 'border-teal-500/30',
    glow: 'shadow-teal-500/20',
    cardBg: 'from-teal-800/90 via-cyan-800/80 to-blue-900/90',
    icon: '🌊'
  },
  'gradient-emerald': {
    name: 'الزمرد الثمين',
    gradient: 'from-emerald-950 via-green-900 to-teal-950',
    accent: 'bg-emerald-600 hover:bg-emerald-700',
    text: 'text-emerald-100',
    textGradient: 'from-emerald-300 to-teal-300',
    border: 'border-emerald-500/30',
    glow: 'shadow-emerald-500/20',
    cardBg: 'from-emerald-800/90 via-green-800/80 to-teal-900/90',
    icon: '💎'
  },
  'gradient-rose': {
    name: 'الوردي الأنيق',
    gradient: 'from-pink-900 via-rose-800 to-purple-900',
    accent: 'bg-pink-600 hover:bg-pink-700',
    text: 'text-pink-100',
    textGradient: 'from-pink-300 to-rose-300',
    border: 'border-pink-500/30',
    glow: 'shadow-pink-500/20',
    cardBg: 'from-pink-800/90 via-rose-800/80 to-purple-900/90',
    icon: '🌹'
  },
  'gradient-midnight': {
    name: 'منتصف الليل',
    gradient: 'from-gray-900 via-slate-800 to-indigo-900',
    accent: 'bg-slate-600 hover:bg-slate-700',
    text: 'text-slate-100',
    textGradient: 'from-slate-300 to-indigo-300',
    border: 'border-slate-500/30',
    glow: 'shadow-slate-500/20',
    cardBg: 'from-slate-800/90 via-slate-800/80 to-indigo-900/90',
    icon: '🌙'
  },
  'gradient-sapphire': {
    name: 'الياقوت الأزرق',
    gradient: 'from-blue-950 via-indigo-900 to-slate-950',
    accent: 'bg-blue-600 hover:bg-blue-700',
    text: 'text-blue-100',
    textGradient: 'from-blue-300 to-indigo-300',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20',
    cardBg: 'from-blue-800/90 via-indigo-800/80 to-slate-900/90',
    icon: '💠'
  },
  'gradient-crimson': {
    name: 'القرمزي الجريء',
    gradient: 'from-red-950 via-rose-900 to-pink-950',
    accent: 'bg-red-600 hover:bg-red-700',
    text: 'text-red-100',
    textGradient: 'from-red-300 to-rose-300',
    border: 'border-red-500/30',
    glow: 'shadow-red-500/20',
    cardBg: 'from-red-800/90 via-rose-800/80 to-pink-900/90',
    icon: '🔥'
  },
  'gradient-aurora': {
    name: 'الشفق القطبي',
    gradient: 'from-violet-950 via-fuchsia-900 to-pink-950',
    accent: 'bg-fuchsia-600 hover:bg-fuchsia-700',
    text: 'text-fuchsia-100',
    textGradient: 'from-fuchsia-300 to-pink-300',
    border: 'border-fuchsia-500/30',
    glow: 'shadow-fuchsia-500/20',
    cardBg: 'from-fuchsia-800/90 via-fuchsia-800/80 to-pink-900/90',
    icon: '🌌'
  }
}

export const getTheme = (themeKey) => {
  return themes[themeKey] || themes['gradient-purple']
}
