import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import LandingPage from './pages/LandingPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  // Always use root path since we're using custom domain on GitHub Pages
  const basename = '/'

  return (
    <Router basename={basename}>
      <Routes>
        {/* Root path - Landing page */}
        <Route path="/" element={<LandingPage />} />

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
