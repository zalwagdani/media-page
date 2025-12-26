-- Add theme column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'gradient-purple';

-- Add check constraint for valid themes
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS valid_theme;

ALTER TABLE profiles
ADD CONSTRAINT valid_theme CHECK (theme IN (
  'gradient-purple',
  'gradient-royal',
  'gradient-sunset',
  'gradient-ocean',
  'gradient-emerald',
  'gradient-rose',
  'gradient-midnight',
  'gradient-sapphire',
  'gradient-crimson',
  'gradient-aurora'
));

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_theme ON profiles(theme);
