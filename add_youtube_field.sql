-- Add YouTube URL field to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- Add website URL field to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Add Telegram username field to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS telegram_username TEXT;

-- Add indexes for better performance (optional)
CREATE INDEX IF NOT EXISTS idx_profiles_youtube_url ON profiles(youtube_url);
CREATE INDEX IF NOT EXISTS idx_profiles_website_url ON profiles(website_url);
CREATE INDEX IF NOT EXISTS idx_profiles_telegram_username ON profiles(telegram_username);
