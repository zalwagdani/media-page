// Simple authentication utility
// For production, you should change this password!

const ADMIN_PASSWORD = 'admin123' // Change this to your desired password!

export const isAuthenticated = () => {
  // Check if user is authenticated (sessionStorage persists until tab closes)
  return sessionStorage.getItem('admin_authenticated') === 'true'
}

export const login = (password) => {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem('admin_authenticated', 'true')
    return true
  }
  return false
}

export const logout = () => {
  sessionStorage.removeItem('admin_authenticated')
}

export const getPassword = () => {
  return ADMIN_PASSWORD
}
