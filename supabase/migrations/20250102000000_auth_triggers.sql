-- Manifest the Unseen - Authentication Triggers and Functions
-- Migration: 20250102000000_auth_triggers.sql
-- Description: Creates triggers to automatically create user profiles on signup

-- =============================================================================
-- FUNCTION: handle_new_user
-- Automatically creates a profile in the users table when a new user signs up
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, trial_end_date)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NOW() + INTERVAL '7 days'  -- Set 7-day trial period
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user IS 'Automatically creates user profile with 7-day trial on signup';

-- =============================================================================
-- TRIGGER: on_auth_user_created
-- Fires after a new user is created in auth.users
-- =============================================================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- FUNCTION: handle_user_delete
-- Cascades user deletion to all related tables (already handled by FK ON DELETE CASCADE)
-- This is a safety function for additional cleanup if needed
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_user_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Additional cleanup logic can go here
  -- (e.g., delete storage objects, cancel subscriptions, etc.)
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_user_delete IS 'Handles cleanup when a user is deleted';

CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_delete();

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- FUNCTION: is_trial_active
-- Checks if a user's trial period is still active
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_trial_active(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  trial_end TIMESTAMP WITH TIME ZONE;
  sub_status subscription_status;
BEGIN
  SELECT trial_end_date, subscription_status INTO trial_end, sub_status
  FROM public.users
  WHERE id = user_id;

  RETURN (trial_end IS NOT NULL AND trial_end > NOW() AND sub_status = 'none');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.is_trial_active IS 'Checks if user trial is still active';

-- -----------------------------------------------------------------------------
-- FUNCTION: get_user_tier
-- Returns the effective subscription tier (considering trial)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_user_tier(user_id UUID)
RETURNS subscription_tier AS $$
DECLARE
  user_tier subscription_tier;
  trial_active BOOLEAN;
BEGIN
  SELECT subscription_tier INTO user_tier
  FROM public.users
  WHERE id = user_id;

  -- If on trial, return 'novice' tier access
  trial_active := public.is_trial_active(user_id);

  IF trial_active THEN
    RETURN 'novice';
  ELSE
    RETURN user_tier;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_user_tier IS 'Returns effective subscription tier (trial = novice)';

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================

COMMENT ON SCHEMA public IS 'Auth triggers and helper functions added';
