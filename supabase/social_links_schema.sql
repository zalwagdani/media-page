-- Social Links table for dynamic social media links
-- Allows users to add multiple links of the same platform with custom labels

CREATE TABLE IF NOT EXISTS social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id TEXT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- instagram, twitter, tiktok, etc.
  url TEXT NOT NULL CHECK (char_length(url) <= 500), -- Max 500 chars for security
  label TEXT CHECK (char_length(label) <= 30), -- Max 30 chars for UI consistency
  display_order INTEGER NOT NULL DEFAULT 0, -- For drag & drop ordering
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_social_links_page_id ON social_links(page_id, display_order);

-- RLS Policies
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all social links (public data)
CREATE POLICY "Social links are publicly readable"
  ON social_links
  FOR SELECT
  USING (true);

-- Policy: Only page admins can insert their own links
CREATE POLICY "Admins can insert own social links"
  ON social_links
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.page_id = social_links.page_id
      AND admins.user_id = auth.uid()
    )
  );

-- Policy: Only page admins can update their own links
CREATE POLICY "Admins can update own social links"
  ON social_links
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.page_id = social_links.page_id
      AND admins.user_id = auth.uid()
    )
  );

-- Policy: Only page admins can delete their own links
CREATE POLICY "Admins can delete own social links"
  ON social_links
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.page_id = social_links.page_id
      AND admins.user_id = auth.uid()
    )
  );

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_social_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER social_links_updated_at
  BEFORE UPDATE ON social_links
  FOR EACH ROW
  EXECUTE FUNCTION update_social_links_updated_at();

COMMENT ON TABLE social_links IS 'Dynamic social media links with custom labels and ordering';
COMMENT ON COLUMN social_links.platform IS 'Platform type: instagram, twitter, tiktok, snapchat, youtube, whatsapp, telegram, linkedin, github, website, email, phone';
COMMENT ON COLUMN social_links.label IS 'Custom label shown in minimal layout (optional, defaults to platform name in Arabic)';
COMMENT ON COLUMN social_links.display_order IS 'Order for displaying links (supports drag & drop)';
