-- Promo Codes Migration
-- Migration: 20251219000000_promo_codes.sql
-- Description: Adds promo code system for early adopter discounts (EARLY50 - 50% off for 30 users)

-- =============================================================================
-- PROMO CODES TABLE
-- Stores promotional codes with discount info and redemption limits
-- =============================================================================

CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  discount_duration_months INTEGER NOT NULL CHECK (discount_duration_months > 0),
  max_redemptions INTEGER NOT NULL CHECK (max_redemptions > 0),
  current_redemptions INTEGER DEFAULT 0 CHECK (current_redemptions >= 0),
  eligible_tiers TEXT[] DEFAULT ARRAY['novice', 'awakening', 'enlightenment'],
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  apple_offer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for promo_codes
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_active ON promo_codes(is_active, expires_at);

COMMENT ON TABLE promo_codes IS 'Promotional codes for subscription discounts';
COMMENT ON COLUMN promo_codes.code IS 'Promo code string (e.g., EARLY50)';
COMMENT ON COLUMN promo_codes.discount_percentage IS 'Discount percentage (1-100)';
COMMENT ON COLUMN promo_codes.discount_duration_months IS 'How many months the discount applies';
COMMENT ON COLUMN promo_codes.max_redemptions IS 'Maximum number of times this code can be used';
COMMENT ON COLUMN promo_codes.current_redemptions IS 'Current number of redemptions';
COMMENT ON COLUMN promo_codes.eligible_tiers IS 'Subscription tiers this code works with';
COMMENT ON COLUMN promo_codes.apple_offer_id IS 'Reference to App Store Connect offer ID';

-- =============================================================================
-- PROMO CODE REDEMPTIONS TABLE
-- Tracks who redeemed which codes
-- =============================================================================

CREATE TABLE promo_code_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promo_code_id UUID NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_tier TEXT,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(promo_code_id, user_id)
);

-- Create indexes for promo_code_redemptions
CREATE INDEX idx_promo_redemptions_user ON promo_code_redemptions(user_id);
CREATE INDEX idx_promo_redemptions_code ON promo_code_redemptions(promo_code_id);

COMMENT ON TABLE promo_code_redemptions IS 'Tracks promo code redemptions per user';
COMMENT ON COLUMN promo_code_redemptions.subscription_tier IS 'Which tier the user subscribed to with this code';

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on promo_codes table
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can read active, non-expired promo codes (for validation)
CREATE POLICY "Anyone can view active promo codes" ON promo_codes
  FOR SELECT USING (
    is_active = TRUE
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (starts_at IS NULL OR starts_at <= NOW())
  );

-- Only service role can insert/update/delete promo codes (admin only)
CREATE POLICY "Service role can manage promo codes" ON promo_codes
  FOR ALL USING (auth.role() = 'service_role');

-- Enable RLS on promo_code_redemptions table
ALTER TABLE promo_code_redemptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own redemptions
CREATE POLICY "Users can view own redemptions" ON promo_code_redemptions
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can insert redemptions (via Edge Function)
CREATE POLICY "Service role can insert redemptions" ON promo_code_redemptions
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- =============================================================================
-- TRIGGER FOR updated_at
-- =============================================================================

CREATE OR REPLACE FUNCTION update_promo_codes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_promo_codes_updated_at
  BEFORE UPDATE ON promo_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_promo_codes_updated_at();

-- =============================================================================
-- SEED DATA: EARLY50 PROMO CODE
-- 50% off for 3 months, first 30 users
-- =============================================================================

INSERT INTO promo_codes (
  code,
  description,
  discount_percentage,
  discount_duration_months,
  max_redemptions,
  eligible_tiers,
  apple_offer_id
) VALUES (
  'EARLY50',
  'Early Bird Special - 50% off for first 3 months',
  50,
  3,
  30,
  ARRAY['novice', 'awakening', 'enlightenment'],
  'early_bird_50_off'
);

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================

COMMENT ON COLUMN promo_codes.id IS 'Promo Codes feature added - Early adopter discount system';
