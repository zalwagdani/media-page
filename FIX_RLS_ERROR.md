# Fix: "row-level security policy" Error

If you're seeing the error: **"new row violates row-level security policy for table 'profiles'"**, follow these steps:

## Quick Fix

### Step 1: Verify You're Logged In

1. Make sure you're logged in as an admin
2. Check browser console (F12) - you should see: "Authenticating admin for page: slm"
3. Verify sessionStorage has: `admin_authenticated = 'true'`

### Step 2: Verify Admin Record Exists

Run this SQL in Supabase SQL Editor:

```sql
-- Check if you're an admin for the page
SELECT a.*, p.name as page_name
FROM admins a
JOIN pages p ON a.page_id = p.id
WHERE a.user_id = auth.uid()
AND a.page_id = 'slm';  -- Replace 'slm' with your page ID
```

If this returns no rows, you need to create the admin record (see `CREATE_ADMIN.md`).

### Step 3: Fix RLS Policies

Run the SQL from `database/fix_rls_policies.sql` in Supabase SQL Editor:

1. Go to Supabase → SQL Editor
2. Open `database/fix_rls_policies.sql`
3. Copy and paste into SQL Editor
4. Click "Run"

This will recreate the RLS policies with proper checks.

### Step 4: Test Again

1. Refresh the admin page
2. Try saving the profile again
3. Check browser console for any errors

## Alternative: Temporarily Disable RLS (NOT RECOMMENDED FOR PRODUCTION)

If you need to test quickly, you can temporarily disable RLS:

```sql
-- ⚠️ ONLY FOR TESTING - NOT FOR PRODUCTION!
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

**Remember to re-enable it after testing:**

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

## Common Causes

1. **Not logged in**: User is not authenticated
2. **Wrong page ID**: Admin record exists for different page
3. **RLS policy issue**: Policy not correctly checking admin status
4. **User ID mismatch**: The `auth.uid()` doesn't match the admin's `user_id`

## Debug Steps

1. **Check current user**:
   ```sql
   SELECT auth.uid() as current_user_id;
   ```

2. **Check admin records**:
   ```sql
   SELECT * FROM admins WHERE page_id = 'slm';
   ```

3. **Check if policies exist**:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
   ```

4. **Test policy manually**:
   ```sql
   -- This should return true if you're an admin
   SELECT EXISTS (
     SELECT 1 FROM admins
     WHERE page_id = 'slm'
     AND user_id = auth.uid()
   );
   ```

## Still Not Working?

1. Check browser console for the exact error message
2. Verify Supabase Auth is working (check Authentication → Users)
3. Make sure you ran `database/schema.sql` completely
4. Try logging out and logging back in
5. Clear browser cache and try again
