-- ============================================================
-- Add Category Column to Anonymous Messages Table
-- ============================================================
-- Run this SQL in Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste & Run
-- ============================================================

-- Add category column to anonymous_messages table
ALTER TABLE anonymous_messages
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'suggestion' CHECK (category IN ('suggestion', 'question', 'opinion'));

-- Add comment to the column
COMMENT ON COLUMN anonymous_messages.category IS 'Message category: suggestion (اقتراح), question (سؤال), or opinion (رأي)';

-- Add index for better query performance when filtering by category
CREATE INDEX IF NOT EXISTS idx_anonymous_messages_category ON anonymous_messages(category);

-- ============================================================
-- Verification Query (Optional - run to check)
-- ============================================================

-- Check if column was added successfully
-- SELECT column_name, data_type, column_default, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'anonymous_messages' AND column_name = 'category';

-- Check index was created
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'anonymous_messages' AND indexname = 'idx_anonymous_messages_category';

-- View sample data with categories
-- SELECT id, category, message, created_at
-- FROM anonymous_messages
-- ORDER BY created_at DESC
-- LIMIT 10;

-- ============================================================
-- NOTES:
-- ============================================================
-- 1. The category column has a default value of 'suggestion'
-- 2. Only three values are allowed: 'suggestion', 'question', 'opinion'
-- 3. Existing messages will automatically get 'suggestion' as their category
-- 4. The index improves performance when filtering messages by category
