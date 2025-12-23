-- Database Schema for Multi-Tenant Media Pages
-- Run this in your Supabase SQL Editor

-- ==================== PAGES TABLE ====================
-- Stores metadata for each media page (tenant)
CREATE TABLE IF NOT EXISTS pages (
  id TEXT PRIMARY KEY, -- Unique identifier (slug/subdomain)
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== ADMINS TABLE ====================
-- Stores admin users linked to pages
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_id TEXT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, page_id) -- One user can be admin of multiple pages, but only once per page
);

-- Enable Row Level Security (RLS)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can read their own admin records
CREATE POLICY "Admins can read their own records"
  ON admins FOR SELECT
  USING (auth.uid() = user_id);

-- ==================== PROFILES TABLE ====================
-- Stores profile data for each page
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  picture TEXT,
  social_media JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_id) -- One profile per page
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read profiles (public pages)
CREATE POLICY "Profiles are publicly readable"
  ON profiles FOR SELECT
  USING (true);

-- Policy: Only admins can update profiles
CREATE POLICY "Admins can update profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.page_id = profiles.page_id
      AND admins.user_id = auth.uid()
    )
  );

-- Policy: Only admins can insert profiles
CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.page_id = profiles.page_id
      AND admins.user_id = auth.uid()
    )
  );

-- ==================== DISCOUNT CODES TABLE ====================
-- Stores discount codes for each page
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  discount_code TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read discount codes (public)
CREATE POLICY "Discount codes are publicly readable"
  ON discount_codes FOR SELECT
  USING (true);

-- Policy: Only admins can manage discount codes
CREATE POLICY "Admins can manage discount codes"
  ON discount_codes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.page_id = discount_codes.page_id
      AND admins.user_id = auth.uid()
    )
  );

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);
CREATE INDEX IF NOT EXISTS idx_admins_page_id ON admins(page_id);
CREATE INDEX IF NOT EXISTS idx_profiles_page_id ON profiles(page_id);
CREATE INDEX IF NOT EXISTS idx_discount_codes_page_id ON discount_codes(page_id);
CREATE INDEX IF NOT EXISTS idx_discount_codes_created_at ON discount_codes(created_at DESC);

-- ==================== FUNCTIONS ====================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discount_codes_updated_at
  BEFORE UPDATE ON discount_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
