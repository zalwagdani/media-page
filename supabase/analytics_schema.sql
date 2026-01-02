-- Analytics System for Media Page (OPTIMIZED)
-- Uses daily counters instead of individual records for better performance

-- ==================== DAILY PAGE VIEWS TABLE ====================

CREATE TABLE IF NOT EXISTS analytics_daily_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id TEXT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  view_date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Counters
  total_views INTEGER NOT NULL DEFAULT 0,
  mobile_views INTEGER NOT NULL DEFAULT 0,
  tablet_views INTEGER NOT NULL DEFAULT 0,
  desktop_views INTEGER NOT NULL DEFAULT 0,

  -- Last update timestamp
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Unique constraint: one row per page per day
  UNIQUE(page_id, view_date)
);

-- ==================== DAILY LINK CLICKS TABLE ====================

CREATE TABLE IF NOT EXISTS analytics_daily_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id TEXT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  link_id UUID REFERENCES social_links(id) ON DELETE CASCADE,
  link_platform TEXT NOT NULL, -- Store platform name in case link is deleted
  click_date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Counter
  total_clicks INTEGER NOT NULL DEFAULT 0,

  -- Last update timestamp
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Unique constraint: one row per link per day
  UNIQUE(page_id, link_id, click_date)
);

-- ==================== INDEXES ====================

-- Daily Views Indexes
CREATE INDEX IF NOT EXISTS idx_daily_views_page_id ON analytics_daily_views(page_id);
CREATE INDEX IF NOT EXISTS idx_daily_views_date ON analytics_daily_views(view_date);
CREATE INDEX IF NOT EXISTS idx_daily_views_page_date ON analytics_daily_views(page_id, view_date);

-- Daily Clicks Indexes
CREATE INDEX IF NOT EXISTS idx_daily_clicks_page_id ON analytics_daily_clicks(page_id);
CREATE INDEX IF NOT EXISTS idx_daily_clicks_link_id ON analytics_daily_clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_daily_clicks_date ON analytics_daily_clicks(click_date);
CREATE INDEX IF NOT EXISTS idx_daily_clicks_page_date ON analytics_daily_clicks(page_id, click_date);

-- ==================== RLS POLICIES ====================

-- Daily Views Policies
ALTER TABLE analytics_daily_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert/update daily views"
  ON analytics_daily_views
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can view own daily views"
  ON analytics_daily_views
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.page_id = analytics_daily_views.page_id
      AND admins.user_id = auth.uid()
    )
  );

-- Daily Clicks Policies
ALTER TABLE analytics_daily_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert/update daily clicks"
  ON analytics_daily_clicks
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can view own daily clicks"
  ON analytics_daily_clicks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.page_id = analytics_daily_clicks.page_id
      AND admins.user_id = auth.uid()
    )
  );

-- ==================== TRACKING FUNCTIONS ====================

-- Drop existing functions first (in case they exist with different signatures)
DROP FUNCTION IF EXISTS track_page_view(TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS track_link_click(TEXT, UUID, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS get_page_views_stats(TEXT, INTEGER);
DROP FUNCTION IF EXISTS get_link_clicks_stats(TEXT);
DROP FUNCTION IF EXISTS get_link_clicks_stats(TEXT, INTEGER);
DROP FUNCTION IF EXISTS get_daily_views(TEXT, INTEGER);

-- Function to track a page view (PREMIUM ONLY)
-- Increments counter for today instead of creating new row
CREATE OR REPLACE FUNCTION track_page_view(
  p_page_id TEXT,
  p_visitor_device TEXT DEFAULT 'desktop'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_plan_tier TEXT;
BEGIN
  -- Check if page has Premium subscription
  SELECT s.plan_tier INTO v_plan_tier
  FROM subscriptions s
  WHERE s.page_id = p_page_id
    AND s.is_active = true
    AND s.end_date > NOW()
  LIMIT 1;

  -- Only track if Premium tier
  IF v_plan_tier = 'premium' THEN
    -- Insert or update today's record
    INSERT INTO analytics_daily_views (
      page_id,
      view_date,
      total_views,
      mobile_views,
      tablet_views,
      desktop_views,
      updated_at
    ) VALUES (
      p_page_id,
      CURRENT_DATE,
      1,
      CASE WHEN p_visitor_device = 'mobile' THEN 1 ELSE 0 END,
      CASE WHEN p_visitor_device = 'tablet' THEN 1 ELSE 0 END,
      CASE WHEN p_visitor_device = 'desktop' THEN 1 ELSE 0 END,
      NOW()
    )
    ON CONFLICT (page_id, view_date)
    DO UPDATE SET
      total_views = analytics_daily_views.total_views + 1,
      mobile_views = analytics_daily_views.mobile_views +
        CASE WHEN p_visitor_device = 'mobile' THEN 1 ELSE 0 END,
      tablet_views = analytics_daily_views.tablet_views +
        CASE WHEN p_visitor_device = 'tablet' THEN 1 ELSE 0 END,
      desktop_views = analytics_daily_views.desktop_views +
        CASE WHEN p_visitor_device = 'desktop' THEN 1 ELSE 0 END,
      updated_at = NOW();

    RETURN true;
  ELSE
    -- Not premium - skip tracking
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to track a link click (PREMIUM ONLY)
-- Increments counter for today instead of creating new row
CREATE OR REPLACE FUNCTION track_link_click(
  p_page_id TEXT,
  p_link_id UUID,
  p_link_platform TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_plan_tier TEXT;
BEGIN
  -- Check if page has Premium subscription
  SELECT s.plan_tier INTO v_plan_tier
  FROM subscriptions s
  WHERE s.page_id = p_page_id
    AND s.is_active = true
    AND s.end_date > NOW()
  LIMIT 1;

  -- Only track if Premium tier
  IF v_plan_tier = 'premium' THEN
    -- Insert or update today's record for this link
    INSERT INTO analytics_daily_clicks (
      page_id,
      link_id,
      link_platform,
      click_date,
      total_clicks,
      updated_at
    ) VALUES (
      p_page_id,
      p_link_id,
      p_link_platform,
      CURRENT_DATE,
      1,
      NOW()
    )
    ON CONFLICT (page_id, link_id, click_date)
    DO UPDATE SET
      total_clicks = analytics_daily_clicks.total_clicks + 1,
      updated_at = NOW();

    RETURN true;
  ELSE
    -- Not premium - skip tracking
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ==================== STATISTICS FUNCTIONS ====================

-- Get page view statistics
CREATE OR REPLACE FUNCTION get_page_views_stats(p_page_id TEXT, p_days INTEGER DEFAULT 30)
RETURNS TABLE (
  total_views BIGINT,
  today_views BIGINT,
  yesterday_views BIGINT,
  avg_daily_views NUMERIC,
  mobile_views BIGINT,
  tablet_views BIGINT,
  desktop_views BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(dv.total_views), 0)::BIGINT as total_views,
    COALESCE(SUM(dv.total_views) FILTER (WHERE dv.view_date = CURRENT_DATE), 0)::BIGINT as today_views,
    COALESCE(SUM(dv.total_views) FILTER (WHERE dv.view_date = CURRENT_DATE - INTERVAL '1 day'), 0)::BIGINT as yesterday_views,
    ROUND(COALESCE(AVG(dv.total_views), 0), 2) as avg_daily_views,
    COALESCE(SUM(dv.mobile_views), 0)::BIGINT as mobile_views,
    COALESCE(SUM(dv.tablet_views), 0)::BIGINT as tablet_views,
    COALESCE(SUM(dv.desktop_views), 0)::BIGINT as desktop_views
  FROM analytics_daily_views dv
  WHERE dv.page_id = p_page_id
    AND dv.view_date >= CURRENT_DATE - p_days;
END;
$$ LANGUAGE plpgsql;

-- Get link click statistics (with date range filter)
CREATE OR REPLACE FUNCTION get_link_clicks_stats(p_page_id TEXT, p_days INTEGER DEFAULT NULL)
RETURNS TABLE (
  link_id UUID,
  link_platform TEXT,
  total_clicks BIGINT,
  last_clicked_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.link_id,
    dc.link_platform,
    SUM(dc.total_clicks)::BIGINT as total_clicks,
    MAX(dc.updated_at) as last_clicked_at
  FROM analytics_daily_clicks dc
  WHERE dc.page_id = p_page_id
    AND (p_days IS NULL OR dc.click_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL)
  GROUP BY dc.link_id, dc.link_platform
  ORDER BY total_clicks DESC;
END;
$$ LANGUAGE plpgsql;

-- Get daily views for chart (last N days)
CREATE OR REPLACE FUNCTION get_daily_views(p_page_id TEXT, p_days INTEGER DEFAULT 7)
RETURNS TABLE (
  view_date DATE,
  view_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    dv.view_date,
    dv.total_views::BIGINT as view_count
  FROM analytics_daily_views dv
  WHERE dv.page_id = p_page_id
    AND dv.view_date >= CURRENT_DATE - p_days
  ORDER BY dv.view_date ASC;
END;
$$ LANGUAGE plpgsql;

-- ==================== COMMENTS ====================

COMMENT ON TABLE analytics_daily_views IS 'Daily aggregated page views with device breakdown';
COMMENT ON TABLE analytics_daily_clicks IS 'Daily aggregated link clicks per link';

COMMENT ON COLUMN analytics_daily_views.total_views IS 'Total page views for this day';
COMMENT ON COLUMN analytics_daily_views.mobile_views IS 'Views from mobile devices';
COMMENT ON COLUMN analytics_daily_views.tablet_views IS 'Views from tablet devices';
COMMENT ON COLUMN analytics_daily_views.desktop_views IS 'Views from desktop devices';

COMMENT ON COLUMN analytics_daily_clicks.total_clicks IS 'Total clicks for this link on this day';

-- ==================== DATA RETENTION ====================

-- Function to clean old analytics data (older than 1 year)
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void AS $$
BEGIN
  DELETE FROM analytics_daily_views
  WHERE view_date < CURRENT_DATE - INTERVAL '1 year';

  DELETE FROM analytics_daily_clicks
  WHERE click_date < CURRENT_DATE - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- You can schedule this to run periodically via cron:
-- SELECT cron.schedule(
--   'cleanup-old-analytics',
--   '0 0 1 * *', -- First day of each month at midnight
--   $$SELECT cleanup_old_analytics()$$
-- );
