-- Add layout field to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS layout TEXT DEFAULT 'classic';

-- Add check constraint to ensure only valid layouts
ALTER TABLE profiles
ADD CONSTRAINT valid_layout CHECK (layout IN ('classic', 'modern', 'minimal'));

-- Update existing rows to have default layout
UPDATE profiles
SET layout = 'classic'
WHERE layout IS NULL;
