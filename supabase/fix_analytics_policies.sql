-- Fix Analytics Policies - Drop and Recreate
-- This fixes the "policy already exists" error

-- ==================== DROP OLD POLICIES ====================

-- Drop Daily Views Policies
DROP POLICY IF EXISTS "Anyone can insert/update daily views" ON analytics_daily_views;
DROP POLICY IF EXISTS "Admins can view own daily views" ON analytics_daily_views;

-- Drop Daily Clicks Policies
DROP POLICY IF EXISTS "Anyone can insert/update daily clicks" ON analytics_daily_clicks;
DROP POLICY IF EXISTS "Admins can view own daily clicks" ON analytics_daily_clicks;

-- ==================== RECREATE POLICIES ====================

-- Daily Views Policies
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
