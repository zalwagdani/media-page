-- ============================================================
-- Add Bio Column to Profiles Table
-- ============================================================
-- Run this SQL in Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste & Run
-- ============================================================

-- Add bio column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS bio TEXT CHECK (char_length(bio) <= 50);

-- Add a comment to the column
COMMENT ON COLUMN profiles.bio IS 'Short bio text (max 50 characters) displayed under the name';

-- ============================================================
-- Verification Query (Optional - run to check)
-- ============================================================

-- Check if column was added successfully
-- SELECT column_name, data_type, character_maximum_length
-- FROM information_schema.columns
-- WHERE table_name = 'profiles' AND column_name = 'bio';
