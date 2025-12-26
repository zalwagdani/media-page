import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  // Determine basename based on domain
  // For custom domains (wasl.bio), use root /
  // For deployment with subdirectory (localhost:5173/media-page), use BASE_URL
  const isCustomDomain = window.location.hostname !== 'localhost' &&
                         window.location.hostname !== '127.0.0.1' &&
                         !window.location.hostname.includes('vercel.app') &&
                         !window.location.hostname.includes('netlify.app')

  const basename = isCustomDomain ? '/' : (import.meta.env.BASE_URL || '/')

  return (
    <Router basename={basename}>
      <Routes>
        {/* Root path - can be home page or default user page */}
        <Route path="/" element={<HomePage />} />

        {/* Traditional /page/:pageId format */}
        <Route path="/page/:pageId" element={<HomePage />} />

        {/* Login routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/page/:pageId/login" element={<LoginPage />} />
        <Route path="/:pageId/login" element={<LoginPage />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/page/:pageId/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:pageId/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Direct username path (e.g., wasl.bio/username) - Must be last to not override other routes */}
        <Route path="/:pageId" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App
