# Troubleshooting Guide

## White Page Issue

If you're seeing a white page, check the following:

### 1. Check Browser Console

Open your browser's Developer Tools (F12) and check the Console tab for errors:

- **"Invalid API key"** → Supabase credentials not configured
- **"relation does not exist"** → Database schema not run
- **"Failed to fetch"** → Network/CORS issue
- **"permission denied"** → RLS policy issue

### 2. Verify Supabase Configuration

Check that your `.env` file exists and has correct values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: 
- Restart the dev server after changing `.env`
- Make sure there are no spaces around the `=` sign
- Don't use quotes around the values

### 3. Check Page ID Detection

The system detects page IDs in this order:

1. **URL Path**: `/page/slm` → page_id = "slm" ✅
2. **Subdomain**: `slm.yourapp.com` → page_id = "slm"
3. **Default**: Uses "default" if neither found

To access page "slm":
- Use URL: `http://localhost:5173/page/slm` (or your domain)
- Or set subdomain: `slm.localhost:5173` (for local dev)

### 4. Verify Database Setup

1. **Check tables exist**:
   - Go to Supabase → Table Editor
   - Verify: `pages`, `admins`, `profiles`, `discount_codes` exist

2. **Check page exists**:
   ```sql
   SELECT * FROM pages WHERE id = 'slm';
   ```
   If empty, create it:
   ```sql
   INSERT INTO pages (id, name) VALUES ('slm', 'SLM Page');
   ```

3. **Check profile exists** (optional - defaults will be used):
   ```sql
   SELECT * FROM profiles WHERE page_id = 'slm';
   ```

### 5. Check RLS Policies

Make sure Row Level Security policies allow reading:

1. Go to Supabase → Authentication → Policies
2. Verify `profiles` table has "Profiles are publicly readable" policy
3. Verify `discount_codes` table has "Discount codes are publicly readable" policy

### 6. Test API Connection

Open browser console and run:

```javascript
// Check if Supabase is configured
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...')

// Test connection
import { supabase } from './src/config/supabase'
supabase.from('pages').select('count').then(console.log)
```

### 7. Common Issues

#### Issue: Page shows "جاري التحميل..." forever

**Cause**: API call is failing silently

**Solution**:
1. Check browser console for errors
2. Verify Supabase credentials
3. Check network tab for failed requests
4. Verify database tables exist

#### Issue: "Invalid API key" error

**Cause**: Wrong or missing Supabase credentials

**Solution**:
1. Double-check `.env` file values
2. Restart dev server: `npm run dev`
3. Verify credentials in Supabase Settings → API

#### Issue: Page works but shows default data

**Cause**: No profile/codes created for this page yet

**Solution**:
1. Log in to admin: `/page/slm/login`
2. Create admin user for page "slm"
3. Add profile and codes through admin panel

#### Issue: Can't access `/page/slm`

**Cause**: Route not configured (should be fixed now)

**Solution**:
- Make sure you're using the latest code
- Routes should include `/page/:pageId`

### 8. Debug Steps

1. **Check page ID detection**:
   ```javascript
   // In browser console
   window.location.pathname
   // Should show: "/page/slm" or "/page/slm/"
   ```

2. **Check what page ID is detected**:
   ```javascript
   // Add to HomePage.jsx temporarily
   console.log('Detected page ID:', getPageId())
   ```

3. **Check API responses**:
   - Open Network tab in DevTools
   - Look for requests to Supabase
   - Check response status and body

### 9. Quick Fix: Use Default Page

If you just want to test, use the default page:

1. Access: `http://localhost:5173/` (no `/page/` prefix)
2. This uses page_id = "default"
3. Make sure you have data for "default" page

### 10. Still Not Working?

1. **Clear browser cache**: Ctrl+Shift+Delete (or Cmd+Shift+Delete)
2. **Check for JavaScript errors**: Look in Console tab
3. **Verify React Router**: Make sure routes are working
4. **Test with default page**: Try `/` instead of `/page/slm`

## Getting Help

If you're still stuck:

1. Check browser console for specific error messages
2. Check Network tab for failed API calls
3. Verify Supabase project is active (not paused)
4. Check Supabase logs: Dashboard → Logs → API Logs
