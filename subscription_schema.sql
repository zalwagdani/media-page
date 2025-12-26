-- ============================================================
-- Subscription System Schema
-- ============================================================
-- Run this SQL in Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste & Run
-- ============================================================

-- STEP 1: Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id BIGSERIAL PRIMARY KEY,
  page_id TEXT NOT NULL UNIQUE, -- One subscription per page
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'yearly')), -- monthly or yearly
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_trial BOOLEAN DEFAULT false, -- For trial periods
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Additional useful fields
  auto_renew BOOLEAN DEFAULT true,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  notes TEXT
);

-- STEP 2: Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_page_id ON subscriptions(page_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_is_active ON subscriptions(is_active);

-- STEP 3: Create function to check if subscription is valid
CREATE OR REPLACE FUNCTION is_subscription_valid(p_page_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_subscription RECORD;
BEGIN
  -- Get subscription for this page
  SELECT * INTO v_subscription
  FROM subscriptions
  WHERE page_id = p_page_id
  AND is_active = true
  LIMIT 1;

  -- If no subscription found, return false
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Check if end_date is in the future
  IF v_subscription.end_date > NOW() THEN
    RETURN true;
  ELSE
    -- Subscription expired, mark as inactive
    UPDATE subscriptions
    SET is_active = false
    WHERE page_id = p_page_id;

    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- STEP 4: Create function to get subscription details
CREATE OR REPLACE FUNCTION get_subscription_details(p_page_id TEXT)
RETURNS TABLE (
  page_id TEXT,
  plan_type TEXT,
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

-- STEP 5: Create function to automatically deactivate expired subscriptions
CREATE OR REPLACE FUNCTION deactivate_expired_subscriptions()
RETURNS void AS $$
BEGIN
  UPDATE subscriptions
  SET is_active = false,
      updated_at = NOW()
  WHERE end_date <= NOW()
  AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- STEP 6: Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- STEP 7: Disable RLS for subscriptions table (or configure as needed)
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================

-- Insert a sample monthly subscription (30 days from now)
-- INSERT INTO subscriptions (page_id, plan_type, start_date, end_date, is_active, payment_status)
-- VALUES (
--   'default',
--   'monthly',
--   NOW(),
--   NOW() + INTERVAL '30 days',
--   true,
--   'paid'
-- );

-- Insert a sample yearly subscription (365 days from now)
-- INSERT INTO subscriptions (page_id, plan_type, start_date, end_date, is_active, payment_status)
-- VALUES (
--   'test-page',
--   'yearly',
--   NOW(),
--   NOW() + INTERVAL '365 days',
--   true,
--   'paid'
-- );

-- Insert a trial subscription (7 days)
-- INSERT INTO subscriptions (page_id, plan_type, start_date, end_date, is_active, is_trial, payment_status)
-- VALUES (
--   'trial-page',
--   'monthly',
--   NOW(),
--   NOW() + INTERVAL '7 days',
--   true,
--   true,
--   'pending'
-- );

-- ============================================================
-- VERIFICATION QUERIES (Optional - run these to check)
-- ============================================================

-- Check if table was created successfully
-- SELECT * FROM subscriptions;

-- Check subscription for a specific page
-- SELECT * FROM get_subscription_details('default');

-- Check if a subscription is valid
-- SELECT is_subscription_valid('default');

-- View all active subscriptions
-- SELECT
--   page_id,
--   plan_type,
--   start_date,
--   end_date,
--   EXTRACT(DAY FROM (end_date - NOW())) as days_remaining,
--   is_trial
-- FROM subscriptions
-- WHERE is_active = true
-- ORDER BY end_date ASC;

-- View expired subscriptions
-- SELECT
--   page_id,
--   plan_type,
--   end_date,
--   EXTRACT(DAY FROM (NOW() - end_date)) as days_expired
-- FROM subscriptions
-- WHERE end_date <= NOW()
-- ORDER BY end_date DESC;

-- Manually deactivate expired subscriptions
-- SELECT deactivate_expired_subscriptions();

-- ============================================================
-- NOTES:
-- ============================================================
-- 1. Each page_id can have only ONE active subscription (enforced by UNIQUE constraint)
-- 2. plan_type can be 'monthly' or 'yearly'
-- 3. is_active indicates if the subscription is currently active
-- 4. is_trial indicates if this is a trial period
-- 5. end_date is automatically checked against current time
-- 6. Use is_subscription_valid(page_id) to check if a page can be accessed
-- 7. Use get_subscription_details(page_id) to get full subscription info
-- 8. Run deactivate_expired_subscriptions() periodically (e.g., via cron job)
-- 9. payment_status tracks the payment state
-- 10. auto_renew indicates if subscription should auto-renew

-- ============================================================
-- RECOMMENDED CRON JOB (Optional)
-- ============================================================
-- Set up a cron job in Supabase to run every day:
-- SELECT cron.schedule(
--   'deactivate-expired-subscriptions',
--   '0 0 * * *', -- Run at midnight every day
--   $$SELECT deactivate_expired_subscriptions()$$
-- );
