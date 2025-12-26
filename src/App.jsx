import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
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
