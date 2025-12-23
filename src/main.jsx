import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Add error handler for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
  const root = document.getElementById('root')
  if (root && !root.innerHTML.includes('Error')) {
    root.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(to bottom right, #1e1b4b, #581c87); color: white; text-align: center; padding: 20px; font-family: Arial, sans-serif;">
        <div>
          <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
          <h1 style="font-size: 24px; margin-bottom: 10px;">حدث خطأ في تحميل الصفحة</h1>
          <p style="font-size: 16px; margin-bottom: 20px; color: #c084fc;">${event.error?.message || 'خطأ غير معروف'}</p>
          <button onclick="window.location.reload()" style="padding: 12px 24px; background: #7c3aed; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
            إعادة المحاولة
          </button>
        </div>
      </div>
    `
  }
})

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
})

try {
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('Root element not found')
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} catch (error) {
  console.error('Failed to render app:', error)
  const root = document.getElementById('root')
  if (root) {
    root.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(to bottom right, #1e1b4b, #581c87); color: white; text-align: center; padding: 20px; font-family: Arial, sans-serif;">
        <div>
          <div style="font-size: 48px; margin-bottom: 20px;">❌</div>
          <h1 style="font-size: 24px; margin-bottom: 10px;">فشل تحميل التطبيق</h1>
          <p style="font-size: 16px; margin-bottom: 20px; color: #c084fc;">${error.message}</p>
          <button onclick="window.location.reload()" style="padding: 12px 24px; background: #7c3aed; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
            إعادة المحاولة
          </button>
        </div>
      </div>
    `
  }
}
