// Utility functions for localStorage management

export const getProfile = () => {
  const profile = localStorage.getItem('profile')
  return profile ? JSON.parse(profile) : {
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
