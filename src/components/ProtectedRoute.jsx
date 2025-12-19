import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated } from '../utils/auth'

function ProtectedRoute({ children }) {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        // Redirect to login page, and save where they were trying to go
        navigate('/login', { 
          replace: true,
          state: { from: { pathname: '/admin' } }
        })
      } else {
        setIsChecking(false)
      }
    }
    
    checkAuth()
  }, [navigate])

  // Show loading or nothing while checking
  if (isChecking || !isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">جاري التحميل...</div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
