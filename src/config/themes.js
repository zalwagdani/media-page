// Theme configurations for the media page
export const themes = {
  'gradient-purple': {
    name: 'البنفسجي الكلاسيكي',
    gradient: 'from-purple-900 via-purple-800 to-indigo-900',
    accent: 'bg-purple-600 hover:bg-purple-700',
    text: 'text-purple-100',
    icon: '💜'
  },
  'gradient-royal': {
    name: 'الملكي الفاخر',
    gradient: 'from-indigo-950 via-violet-900 to-purple-950',
    accent: 'bg-violet-600 hover:bg-violet-700',
    text: 'text-violet-100',
    icon: '👑'
  },
  'gradient-sunset': {
    name: 'غروب الشمس',
    gradient: 'from-orange-900 via-red-800 to-pink-900',
    accent: 'bg-orange-600 hover:bg-orange-700',
    text: 'text-orange-100',
    icon: '🌅'
  },
  'gradient-ocean': {
    name: 'المحيط العميق',
    gradient: 'from-teal-900 via-cyan-800 to-blue-900',
    accent: 'bg-teal-600 hover:bg-teal-700',
    text: 'text-teal-100',
    icon: '🌊'
  },
  'gradient-emerald': {
    name: 'الزمرد الثمين',
    gradient: 'from-emerald-950 via-green-900 to-teal-950',
    accent: 'bg-emerald-600 hover:bg-emerald-700',
    text: 'text-emerald-100',
    icon: '💎'
  },
  'gradient-rose': {
    name: 'الوردي الأنيق',
    gradient: 'from-pink-900 via-rose-800 to-purple-900',
    accent: 'bg-pink-600 hover:bg-pink-700',
    text: 'text-pink-100',
    icon: '🌹'
  },
  'gradient-midnight': {
    name: 'منتصف الليل',
    gradient: 'from-gray-900 via-slate-800 to-indigo-900',
    accent: 'bg-slate-600 hover:bg-slate-700',
    text: 'text-slate-100',
    icon: '🌙'
  },
  'gradient-sapphire': {
    name: 'الياقوت الأزرق',
    gradient: 'from-blue-950 via-indigo-900 to-slate-950',
    accent: 'bg-blue-600 hover:bg-blue-700',
    text: 'text-blue-100',
    icon: '💠'
  },
  'gradient-crimson': {
    name: 'القرمزي الجريء',
    gradient: 'from-red-950 via-rose-900 to-pink-950',
    accent: 'bg-red-600 hover:bg-red-700',
    text: 'text-red-100',
    icon: '🔥'
  },
  'gradient-aurora': {
    name: 'الشفق القطبي',
    gradient: 'from-violet-950 via-fuchsia-900 to-pink-950',
    accent: 'bg-fuchsia-600 hover:bg-fuchsia-700',
    text: 'text-fuchsia-100',
    icon: '🌌'
  }
}

export const getTheme = (themeKey) => {
  return themes[themeKey] || themes['gradient-purple']
}
