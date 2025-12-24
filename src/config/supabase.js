// Supabase client configuration
// Replace these with your Supabase project credentials
// Get them from: https://app.supabase.com/project/_/settings/api

import { createClient } from '@supabase/supabase-js'

// TODO: Replace with your Supabase project URL and anon key
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

// Check if Supabase is configured
if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
  console.warn('⚠️ Supabase is not configured! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Helper to get current page ID from URL or localStorage
export const getPageId = () => {
  // Option 1: From URL path (e.g., /page/my-page-id or /media-page/page/my-page-id)
  const pathParts = window.location.pathname.split('/').filter(Boolean)

  // Find 'page' in the path and get the next part
  const pageIndex = pathParts.indexOf('page')
  if (pageIndex !== -1 && pageIndex < pathParts.length - 1) {
    const pageId = pathParts[pageIndex + 1]
    console.log('✅ Page ID found in URL:', pageId)
    return pageId
  }

  // Option 2: From subdomain (e.g., my-page-id.yourapp.com)
  const hostname = window.location.hostname
  if (hostname.includes('.')) {
    const subdomain = hostname.split('.')[0]
    if (subdomain !== 'www' && subdomain !== 'localhost') {
      console.log('✅ Page ID found in subdomain:', subdomain)
      return subdomain
    }
  }

  // Option 3: Default page ID (for single page setup)
  const defaultId = localStorage.getItem('pageId') || 'default'
  console.log('⚠️ Using default page ID:', defaultId)
  return defaultId
}

// Helper to set page ID
export const setPageId = (pageId) => {
  localStorage.setItem('pageId', pageId)
}
