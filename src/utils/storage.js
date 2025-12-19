// Utility functions for localStorage management

export const getProfile = () => {
  const profile = localStorage.getItem('profile')
  return profile ? JSON.parse(profile) : {
    name: 'اسمك',
    picture: '',
    socialMedia: {
      twitter: '',
      instagram: '',
      linkedin: '',
      github: '',
      tiktok: '',
      snapchat: '',
      youtube: ''
    }
  }
}

export const saveProfile = (profile) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}

export const getCodes = () => {
  const codes = localStorage.getItem('codes')
  return codes ? JSON.parse(codes) : []
}

export const saveCodes = (codes) => {
  localStorage.setItem('codes', JSON.stringify(codes))
}

export const addCode = (code) => {
  const codes = getCodes()
  const newCode = {
    id: Date.now().toString(),
    title: code.title || '',
    description: code.description || '',
    discountCode: code.discountCode || '',
    tags: code.tags || [],
    createdAt: new Date().toISOString()
  }
  codes.push(newCode)
  saveCodes(codes)
  return newCode
}

export const deleteCode = (id) => {
  const codes = getCodes()
  const filtered = codes.filter(code => code.id !== id)
  saveCodes(filtered)
  return filtered
}

export const updateCode = (id, updatedCode) => {
  const codes = getCodes()
  const index = codes.findIndex(code => code.id === id)
  if (index !== -1) {
    codes[index] = { ...codes[index], ...updatedCode }
    saveCodes(codes)
  }
  return codes
}
