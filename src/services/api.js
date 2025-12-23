// API service layer for database operations
// Handles all interactions with Supabase database

import { supabase, getPageId } from '../config/supabase'

// ==================== PAGE OPERATIONS ====================

/**
 * Get or create a page by ID
 */
export const getOrCreatePage = async (pageId) => {
  // Try to get existing page
  const { data: existingPage, error: fetchError } = await supabase
    .from('pages')
    .select('*')
    .eq('id', pageId)
    .single()

  if (existingPage && !fetchError) {
    return { data: existingPage, error: null }
  }

  // Create new page if it doesn't exist
  const { data: newPage, error: createError } = await supabase
    .from('pages')
    .insert({
      id: pageId,
      name: pageId,
      created_at: new Date().toISOString()
    })
    .select()
    .single()

  return { data: newPage, error: createError }
}

/**
 * Update page settings
 */
export const updatePage = async (pageId, updates) => {
  const { data, error } = await supabase
    .from('pages')
    .update(updates)
    .eq('id', pageId)
    .select()
    .single()

  return { data, error }
}

// ==================== PROFILE OPERATIONS ====================

/**
 * Get profile for a page
 */
export const getProfile = async (pageId = null) => {
  const currentPageId = pageId || getPageId()
  
  console.log('Fetching profile for page:', currentPageId)
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('page_id', currentPageId)
    .single()

  if (error && error.code === 'PGRST116') {
    // Profile doesn't exist, return default (already in app format)
    console.log('No profile found in database, returning defaults')
    return {
      data: {
        page_id: currentPageId,
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
        },
        _isDefault: true // Flag to indicate this is default data
      },
      error: null,
      isDefault: true
    }
  }

  if (error) {
    console.error('Error fetching profile:', error)
    return { data: null, error, isDefault: false }
  }

  // Transform database format to app format
  if (data) {
    data.socialMedia = data.social_media || {}
    delete data.social_media
    data._isDefault = false // Flag to indicate this is from database
  }

  console.log('Profile loaded from database:', data)
  return { data, error: null, isDefault: false }
}

/**
 * Save profile for a page
 */
export const saveProfile = async (profile, pageId = null) => {
  const currentPageId = pageId || getPageId()
  
  console.log('Saving profile for page:', currentPageId)
  
  // Transform app format to database format
  const profileData = {
    page_id: currentPageId,
    name: profile.name,
    picture: profile.picture,
    social_media: profile.socialMedia || profile.social_media || {}
  }

  // Check if profile exists (handle error gracefully)
  const { data: existing, error: checkError } = await supabase
    .from('profiles')
    .select('id')
    .eq('page_id', currentPageId)
    .maybeSingle() // Use maybeSingle() instead of single() to avoid error if not found

  console.log('Profile exists check:', { existing, checkError })

  let result
  if (existing && !checkError) {
    // Update existing
    console.log('Updating existing profile')
    result = await supabase
      .from('profiles')
      .update(profileData)
      .eq('page_id', currentPageId)
      .select()
      .single()
  } else {
    // Insert new
    console.log('Inserting new profile')
    result = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single()
  }

  console.log('Save result:', result)

  // Check for RLS policy errors and provide helpful message
  if (result.error) {
    if (result.error.message.includes('row-level security policy')) {
      result.error.userMessage = 'خطأ في الصلاحيات: تأكد من أنك مسجل دخول كمسؤول لهذه الصفحة. إذا كنت مسؤولاً، قد تحتاج إلى تحديث سياسات الأمان في قاعدة البيانات.'
    } else if (result.error.message.includes('permission denied')) {
      result.error.userMessage = 'ليس لديك صلاحية لحفظ الملف الشخصي. تأكد من أنك مسؤول لهذه الصفحة.'
    }
  }

  // Transform back to app format
  if (result.data) {
    result.data.socialMedia = result.data.social_media || {}
    delete result.data.social_media
  }

  return result
}

// ==================== DISCOUNT CODE OPERATIONS ====================

/**
 * Get all discount codes for a page
 */
export const getCodes = async (pageId = null) => {
  const currentPageId = pageId || getPageId()
  
  const { data, error } = await supabase
    .from('discount_codes')
    .select('*')
    .eq('page_id', currentPageId)
    .order('created_at', { ascending: false })

  if (!data) return { data: [], error }

  // Transform database format to app format
  const transformed = data.map(code => ({
    id: code.id.toString(),
    title: code.title,
    description: code.description,
    discountCode: code.discount_code,
    tags: code.tags || [],
    createdAt: code.created_at
  }))

  return { data: transformed, error }
}

/**
 * Add a new discount code
 */
export const addCode = async (code, pageId = null) => {
  const currentPageId = pageId || getPageId()
  
  const codeData = {
    page_id: currentPageId,
    title: code.title || '',
    description: code.description || '',
    discount_code: code.discountCode || '',
    tags: Array.isArray(code.tags) ? code.tags : (code.tags ? code.tags.split(',').map(t => t.trim()) : [])
  }

  const { data, error } = await supabase
    .from('discount_codes')
    .insert(codeData)
    .select()
    .single()

  if (!data) return { data: null, error }

  // Transform to app format
  const transformed = {
    id: data.id.toString(),
    title: data.title,
    description: data.description,
    discountCode: data.discount_code,
    tags: data.tags || [],
    createdAt: data.created_at
  }

  return { data: transformed, error }
}

/**
 * Delete a discount code
 */
export const deleteCode = async (codeId, pageId = null) => {
  const currentPageId = pageId || getPageId()
  
  const { error } = await supabase
    .from('discount_codes')
    .delete()
    .eq('id', codeId)
    .eq('page_id', currentPageId)

  return { error }
}

/**
 * Update a discount code
 */
export const updateCode = async (codeId, updates, pageId = null) => {
  const currentPageId = pageId || getPageId()
  
  const updateData = {}
  if (updates.title !== undefined) updateData.title = updates.title
  if (updates.description !== undefined) updateData.description = updates.description
  if (updates.discountCode !== undefined) updateData.discount_code = updates.discountCode
  if (updates.tags !== undefined) {
    updateData.tags = Array.isArray(updates.tags) 
      ? updates.tags 
      : (updates.tags ? updates.tags.split(',').map(t => t.trim()) : [])
  }

  const { data, error } = await supabase
    .from('discount_codes')
    .update(updateData)
    .eq('id', codeId)
    .eq('page_id', currentPageId)
    .select()
    .single()

  if (!data) return { data: null, error }

  // Transform to app format
  const transformed = {
    id: data.id.toString(),
    title: data.title,
    description: data.description,
    discountCode: data.discount_code,
    tags: data.tags || [],
    createdAt: data.created_at
  }

  return { data: transformed, error }
}

// ==================== ADMIN OPERATIONS ====================

/**
 * Authenticate admin user
 */
export const authenticateAdmin = async (email, password, pageId = null) => {
  const currentPageId = pageId || getPageId()
  
  console.log('Authenticating admin for page:', currentPageId)
  console.log('Email:', email)
  
  // Sign in with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (authError) {
    console.error('Auth error:', authError)
    // Translate common errors to Arabic
    let errorMessage = authError.message
    if (authError.message.includes('Invalid login credentials')) {
      errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
    } else if (authError.message.includes('Email not confirmed')) {
      errorMessage = 'يرجى تأكيد بريدك الإلكتروني أولاً'
    }
    return { success: false, error: errorMessage }
  }

  console.log('Auth successful, user ID:', authData.user.id)
  console.log('Checking admin access for page:', currentPageId)

  // Check if user has admin access to this page
  const { data: adminData, error: adminError } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', authData.user.id)
    .eq('page_id', currentPageId)
    .single()

  console.log('Admin check result:', { adminData, adminError })

  if (adminError || !adminData) {
    await supabase.auth.signOut()
    
    // Check if user is admin of any page
    const { data: anyAdminData } = await supabase
      .from('admins')
      .select('page_id')
      .eq('user_id', authData.user.id)
    
    console.log('User is admin of pages:', anyAdminData)
    
    if (anyAdminData && anyAdminData.length > 0) {
      return { 
        success: false, 
        error: `ليس لديك صلاحية إدارية لصفحة "${currentPageId}". أنت مسؤول لصفحة: ${anyAdminData.map(a => a.page_id).join(', ')}` 
      }
    } else {
      return { 
        success: false, 
        error: `ليس لديك صلاحية إدارية لصفحة "${currentPageId}". يرجى التأكد من إنشاء حساب مسؤول لهذه الصفحة.` 
      }
    }
  }

  // Store admin session
  sessionStorage.setItem('admin_authenticated', 'true')
  sessionStorage.setItem('admin_user_id', authData.user.id)
  sessionStorage.setItem('admin_page_id', currentPageId)

  console.log('Authentication successful!')
  return { success: true, user: authData.user }
}

/**
 * Check if user is authenticated as admin
 */
export const isAdminAuthenticated = () => {
  return sessionStorage.getItem('admin_authenticated') === 'true'
}

/**
 * Logout admin
 */
export const logoutAdmin = async () => {
  sessionStorage.removeItem('admin_authenticated')
  sessionStorage.removeItem('admin_user_id')
  sessionStorage.removeItem('admin_page_id')
  await supabase.auth.signOut()
}

/**
 * Create a new admin user for a page
 */
export const createAdmin = async (email, password, pageId = null) => {
  const currentPageId = pageId || getPageId()
  
  // Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  })

  if (authError) {
    return { success: false, error: authError.message }
  }

  // Create admin record
  const { error: adminError } = await supabase
    .from('admins')
    .insert({
      user_id: authData.user.id,
      page_id: currentPageId,
      email: email
    })

  if (adminError) {
    return { success: false, error: adminError.message }
  }

  return { success: true, user: authData.user }
}

/**
 * Get all admins for a page
 */
export const getPageAdmins = async (pageId = null) => {
  const currentPageId = pageId || getPageId()
  
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('page_id', currentPageId)

  return { data, error }
}
