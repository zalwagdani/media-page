// Social media platforms configuration

export const platformLabels = {
  twitter: 'X (تويتر سابقاً)',
  instagram: 'إنستغرام',
  linkedin: 'لينكد إن',
  github: 'جيت هاب',
  tiktok: 'تيك توك',
  snapchat: 'سناب شات',
  youtube: 'يوتيوب',
  whatsapp: 'واتساب',
  telegram: 'تلقرام',
  website: 'الموقع',
  email: 'البريد',
  phone: 'الهاتف'
}

export const platformPlaceholders = {
  twitter: 'https://x.com/username',
  instagram: 'https://instagram.com/username',
  linkedin: 'https://linkedin.com/in/username',
  github: 'https://github.com/username',
  tiktok: 'https://tiktok.com/@username',
  snapchat: 'https://snapchat.com/add/username',
  youtube: 'https://youtube.com/@username',
  whatsapp: '966501234567',
  telegram: 'username أو https://t.me/username',
  website: 'https://example.com',
  email: 'email@example.com',
  phone: '966501234567'
}

export const platformOptions = [
  { value: 'instagram', label: platformLabels.instagram },
  { value: 'twitter', label: platformLabels.twitter },
  { value: 'tiktok', label: platformLabels.tiktok },
  { value: 'snapchat', label: platformLabels.snapchat },
  { value: 'youtube', label: platformLabels.youtube },
  { value: 'whatsapp', label: platformLabels.whatsapp },
  { value: 'telegram', label: platformLabels.telegram },
  { value: 'linkedin', label: platformLabels.linkedin },
  { value: 'github', label: platformLabels.github },
  { value: 'website', label: platformLabels.website },
  { value: 'email', label: platformLabels.email },
  { value: 'phone', label: platformLabels.phone }
]

/**
 * Get display label for a social link
 * Returns custom label if provided, otherwise returns platform name in Arabic
 */
export const getDisplayLabel = (link) => {
  return link.label || platformLabels[link.platform] || link.platform
}
