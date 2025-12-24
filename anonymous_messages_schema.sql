-- ============================================================
-- SQL Schema for Anonymous Messages Feature
-- ============================================================
-- IMPORTANT: Run these queries IN ORDER in Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste & Run
-- ============================================================

-- STEP 1: Drop existing table if it has issues (CAREFUL - removes all data!)
-- Uncomment the next line ONLY if you need to start fresh
-- DROP TABLE IF EXISTS anonymous_messages CASCADE;

-- STEP 2: Create anonymous_messages table
CREATE TABLE IF NOT EXISTS anonymous_messages (
  id BIGSERIAL PRIMARY KEY,
  page_id TEXT NOT NULL DEFAULT 'default',  -- Default value added
  message TEXT NOT NULL CHECK (char_length(message) <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- STEP 3: Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_anonymous_messages_page_id ON anonymous_messages(page_id);
CREATE INDEX IF NOT EXISTS idx_anonymous_messages_created_at ON anonymous_messages(created_at DESC);

-- STEP 4: Add anonymous_messages_enabled column to pages table (if pages table exists)
-- If you don't have a pages table, you can skip this step
-- ALTER TABLE pages ADD COLUMN IF NOT EXISTS anonymous_messages_enabled BOOLEAN DEFAULT true;

-- STEP 5: DISABLE Row Level Security (simplest solution for anonymous messages)
-- This allows anyone to insert messages without authentication
ALTER TABLE anonymous_messages DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- VERIFICATION QUERIES (Optional - run these to check)
-- ============================================================

-- Check if table was created successfully
-- SELECT * FROM anonymous_messages LIMIT 10;

-- Check table structure
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'anonymous_messages';

-- Check RLS status (should be disabled)
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE tablename = 'anonymous_messages';

-- ============================================================
-- CLEANUP FUNCTION (Optional - keeps last 1000 messages per page)
-- ============================================================

CREATE OR REPLACE FUNCTION cleanup_old_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM anonymous_messages
  WHERE id IN (
    SELECT id FROM (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY page_id ORDER BY created_at DESC) as row_num
      FROM anonymous_messages
    ) sub
    WHERE row_num > 1000
  );
END;
$$ LANGUAGE plpgsql;

-- To manually run cleanup:
-- SELECT cleanup_old_messages();

-- ============================================================
-- NOTES:
-- ============================================================
-- 1. RLS is DISABLED for this table to allow anonymous submissions
-- 2. Security is handled at the application level
-- 3. The page_id has a default value of 'default' if not provided
-- 4. Messages are limited to 100 characters by database constraint
-- 5. Old messages can be cleaned up using the cleanup function
