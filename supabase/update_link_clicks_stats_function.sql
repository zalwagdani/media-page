-- Update get_link_clicks_stats to support date range filtering
-- This allows filtering link clicks by number of days (e.g., last 7 days, last 30 days)

-- Drop old version
DROP FUNCTION IF EXISTS get_link_clicks_stats(TEXT);
DROP FUNCTION IF EXISTS get_link_clicks_stats(TEXT, INTEGER);

-- Create new version with optional days parameter
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

COMMENT ON FUNCTION get_link_clicks_stats(TEXT, INTEGER) IS 'Get link click statistics with optional date range filter. If p_days is NULL, returns all-time stats. Otherwise returns stats for the last p_days days.';
