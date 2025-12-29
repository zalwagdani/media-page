-- Update get_subscription_details function to include plan_tier
-- IMPORTANT: Must drop the old function first since we're changing the return type

-- Drop the existing function
DROP FUNCTION IF EXISTS get_subscription_details(TEXT);

-- Create the updated function with plan_tier included
CREATE OR REPLACE FUNCTION get_subscription_details(p_page_id TEXT)
RETURNS TABLE (
  page_id TEXT,
  plan_type TEXT,
  plan_tier TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN,
  is_trial BOOLEAN,
  days_remaining INTEGER,
  is_expired BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.page_id,
    s.plan_type,
    s.plan_tier,
    s.start_date,
    s.end_date,
    s.is_active,
    s.is_trial,
    GREATEST(0, EXTRACT(DAY FROM (s.end_date - NOW()))::INTEGER) as days_remaining,
    (s.end_date <= NOW()) as is_expired
  FROM subscriptions s
  WHERE s.page_id = p_page_id;
END;
$$ LANGUAGE plpgsql;
