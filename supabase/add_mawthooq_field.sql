-- Add Mawthooq URL field to profiles table
-- This field stores the link to the Mawthooq license/certificate
-- Example: https://mawthooq.gmedia.gov.sa/license/xxxxxxxx

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS mawthooq_url TEXT;

-- Add index for better performance (optional)
CREATE INDEX IF NOT EXISTS idx_profiles_mawthooq_url ON profiles(mawthooq_url);

COMMENT ON COLUMN profiles.mawthooq_url IS 'URL to Mawthooq license/certificate (optional, displayed prominently on profile page)';
