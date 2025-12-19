import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated } from '../utils/auth'

function ProtectedRoute({ children }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated()) {
      // Redirect to login page, and save where they were trying to go
      navigate('/login', { 
        replace: true,
        state: { from: { pathname: '/admin' } }
      })
    }
  }, [navigate])

  // If not authenticated, don't render children (will redirect)
  if (!isAuthenticated()) {
    return null
  }

  return children
}

export default ProtectedRoute
