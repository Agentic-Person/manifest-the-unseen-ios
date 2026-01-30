-- Manifest the Unseen - Platform Subscriptions Schema
-- Migration: 20260130000000_platform_subscriptions.sql
-- Description: Creates subscriptions table for multi-platform support (iOS via RevenueCat, Web via Stripe)

-- =============================================================================
-- SUBSCRIPTIONS TABLE
-- Stores subscription data by platform (iOS/RevenueCat or Web/Stripe)
-- =============================================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'web')),
  tier subscription_tier NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'trialing', 'canceled', 'past_due', 'expired')),

  -- Provider info
  provider TEXT NOT NULL CHECK (provider IN ('revenuecat', 'stripe')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  revenuecat_app_user_id TEXT,

  -- Period tracking
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  trial_end TIMESTAMPTZ,

  -- Billing metadata
  billing_interval TEXT CHECK (billing_interval IN ('month', 'year')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Each user can have only one subscription per platform
  UNIQUE(user_id, platform)
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_platform ON subscriptions(user_id, platform);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription ON subscriptions(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON subscriptions(user_id, status) WHERE status IN ('active', 'trialing');

-- =============================================================================
-- ADD STRIPE CUSTOMER ID TO USERS TABLE
-- =============================================================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Only service role can insert/update/delete subscriptions (via webhooks)
-- Users should not modify subscription data directly
CREATE POLICY "Service role can manage subscriptions" ON subscriptions
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =============================================================================
-- TRIGGER: Updated At
-- =============================================================================

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- FUNCTION: Get User's Active Subscription for Platform
-- =============================================================================

CREATE OR REPLACE FUNCTION get_platform_subscription(
  p_user_id UUID,
  p_platform TEXT
)
RETURNS TABLE (
  id UUID,
  tier subscription_tier,
  status TEXT,
  provider TEXT,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN,
  billing_interval TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.tier,
    s.status,
    s.provider,
    s.current_period_end,
    s.cancel_at_period_end,
    s.billing_interval
  FROM subscriptions s
  WHERE s.user_id = p_user_id
    AND s.platform = p_platform
    AND s.status IN ('active', 'trialing')
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$;

COMMENT ON FUNCTION get_platform_subscription IS 'Get user active subscription for a specific platform (ios or web)';

-- =============================================================================
-- FUNCTION: Get User's Best Active Subscription (any platform)
-- Returns the highest tier active subscription across all platforms
-- =============================================================================

CREATE OR REPLACE FUNCTION get_best_subscription(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  platform TEXT,
  tier subscription_tier,
  status TEXT,
  provider TEXT,
  current_period_end TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.platform,
    s.tier,
    s.status,
    s.provider,
    s.current_period_end
  FROM subscriptions s
  WHERE s.user_id = p_user_id
    AND s.status IN ('active', 'trialing')
  ORDER BY
    -- Prioritize by tier: enlightenment > awakening > novice
    CASE s.tier
      WHEN 'enlightenment' THEN 1
      WHEN 'awakening' THEN 2
      WHEN 'novice' THEN 3
    END,
    s.created_at DESC
  LIMIT 1;
END;
$$;

COMMENT ON FUNCTION get_best_subscription IS 'Get user best active subscription across all platforms (highest tier wins)';

-- =============================================================================
-- FUNCTION: Sync Subscription to Users Table
-- Keeps users.subscription_tier and users.subscription_status in sync
-- for backward compatibility with existing code
-- =============================================================================

CREATE OR REPLACE FUNCTION sync_subscription_to_users()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_best_tier subscription_tier;
  v_best_status subscription_status;
BEGIN
  -- Get the best active subscription for this user
  SELECT tier,
         CASE status
           WHEN 'active' THEN 'active'::subscription_status
           WHEN 'trialing' THEN 'trialing'::subscription_status
           WHEN 'canceled' THEN 'canceled'::subscription_status
           WHEN 'past_due' THEN 'billing_issue'::subscription_status
           WHEN 'expired' THEN 'expired'::subscription_status
           ELSE 'none'::subscription_status
         END
  INTO v_best_tier, v_best_status
  FROM subscriptions
  WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
    AND status IN ('active', 'trialing')
  ORDER BY
    CASE tier
      WHEN 'enlightenment' THEN 1
      WHEN 'awakening' THEN 2
      WHEN 'novice' THEN 3
    END
  LIMIT 1;

  -- If no active subscription found, check for any subscription
  IF v_best_tier IS NULL THEN
    SELECT tier,
           CASE status
             WHEN 'canceled' THEN 'canceled'::subscription_status
             WHEN 'past_due' THEN 'billing_issue'::subscription_status
             WHEN 'expired' THEN 'expired'::subscription_status
             ELSE 'none'::subscription_status
           END
    INTO v_best_tier, v_best_status
    FROM subscriptions
    WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
    ORDER BY updated_at DESC
    LIMIT 1;
  END IF;

  -- Update users table with subscription info
  UPDATE users
  SET
    subscription_tier = COALESCE(v_best_tier, 'novice'),
    subscription_status = COALESCE(v_best_status, 'none'),
    subscription_expires_at = (
      SELECT current_period_end
      FROM subscriptions
      WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
        AND status IN ('active', 'trialing')
      ORDER BY current_period_end DESC
      LIMIT 1
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.user_id, OLD.user_id);

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger to sync subscription changes to users table
CREATE TRIGGER sync_subscription_to_users_trigger
  AFTER INSERT OR UPDATE OR DELETE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION sync_subscription_to_users();

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE subscriptions IS 'Platform-specific subscription tracking (iOS via RevenueCat, Web via Stripe)';
COMMENT ON COLUMN subscriptions.platform IS 'Platform: ios (RevenueCat) or web (Stripe)';
COMMENT ON COLUMN subscriptions.provider IS 'Payment provider: revenuecat or stripe';
COMMENT ON COLUMN subscriptions.stripe_customer_id IS 'Stripe customer ID for web subscriptions';
COMMENT ON COLUMN subscriptions.stripe_subscription_id IS 'Stripe subscription ID for web subscriptions';
COMMENT ON COLUMN subscriptions.revenuecat_app_user_id IS 'RevenueCat app user ID for iOS subscriptions';
COMMENT ON COLUMN subscriptions.cancel_at_period_end IS 'Whether subscription will cancel at period end';
COMMENT ON COLUMN subscriptions.billing_interval IS 'Billing frequency: month or year';

-- =============================================================================
-- NOTE: iOS subscription migration from users table skipped
-- The users table schema may not have subscription columns yet.
-- Run a separate data migration if needed after verifying schema.
-- =============================================================================

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================

COMMENT ON SCHEMA public IS 'Platform subscriptions added for iOS (RevenueCat) and Web (Stripe) support';
