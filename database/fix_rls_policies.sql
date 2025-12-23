-- Fix RLS Policies for Profiles Table
-- Run this if you're getting "row-level security policy" errors

-- Drop existing policies (if they exist)
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;

-- Recreate UPDATE policy with better error handling
CREATE POLICY "Admins can update profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.page_id = profiles.page_id
      AND admins.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.page_id = profiles.page_id
      AND admins.user_id = auth.uid()
    )
  );

-- Recreate INSERT policy
CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.page_id = profiles.page_id
      AND admins.user_id = auth.uid()
    )
  );

-- Verify policies exist
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';
