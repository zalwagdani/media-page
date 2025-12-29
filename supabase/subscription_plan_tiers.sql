-- Add plan_tier column to subscriptions table
-- Defines whether user has Standard or Premium subscription

-- Add plan_tier column (standard or premium)
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS plan_tier TEXT NOT NULL DEFAULT 'standard'
CHECK (plan_tier IN ('standard', 'premium'));

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_tier ON subscriptions(plan_tier);

-- Update existing subscriptions to premium if they have anonymous_messages enabled
-- (backwards compatibility - existing users with messages enabled get premium)
UPDATE subscriptions
SET plan_tier = 'premium'
WHERE page_id IN (
  SELECT page_id FROM pages WHERE anonymous_messages_enabled = true
);

COMMENT ON COLUMN subscriptions.plan_tier IS 'Subscription tier: standard (basic features) or premium (all features including anonymous messages)';

-- Plan Features Reference:
--
-- STANDARD:
-- - Up to 5 social links
-- - Basic themes only
-- - No anonymous messages
-- - Basic analytics (future)
-- - Watermark included
--
-- PREMIUM:
-- - Unlimited social links
-- - All themes (including premium)
-- - Anonymous messages enabled
-- - Advanced analytics (future)
-- - No watermark
