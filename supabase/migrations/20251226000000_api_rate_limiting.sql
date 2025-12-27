-- ============================================================================
-- Migration: API Rate Limiting
-- Security Fix: H5 - No rate limiting on AI endpoints
-- Date: 2025-12-26
--
-- Creates api_usage table to track API calls per user per endpoint
-- Enables rate limiting to prevent abuse of AI endpoints (ai-chat, guru-analysis)
-- ============================================================================

-- Create api_usage table for tracking API calls
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient rate limit queries
-- Composite index on (user_id, endpoint, created_at) for fast lookups
CREATE INDEX IF NOT EXISTS idx_api_usage_rate_limit
  ON api_usage(user_id, endpoint, created_at DESC);

-- Enable RLS
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see their own usage
CREATE POLICY "Users can view own API usage"
  ON api_usage
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow Edge Functions (via service role) to insert usage records
CREATE POLICY "Service role can insert API usage"
  ON api_usage
  FOR INSERT
  WITH CHECK (true);

-- Service role can delete old records (for cleanup)
CREATE POLICY "Service role can delete API usage"
  ON api_usage
  FOR DELETE
  USING (auth.role() = 'service_role');

-- Comment for documentation
COMMENT ON TABLE api_usage IS 'Tracks API usage per user for rate limiting (H5 Security Fix)';
COMMENT ON COLUMN api_usage.endpoint IS 'API endpoint name: ai-chat, guru-analysis, delete-account, etc.';

-- ============================================================================
-- Rate Limit Configuration (for reference - actual limits in Edge Functions)
-- ============================================================================
-- ai-chat: 100 requests per 24 hours per user
-- guru-analysis: 50 requests per 24 hours per user
-- delete-account: 3 requests per 1 hour per user
-- ============================================================================

-- Optional: Create a cleanup function to remove old records (older than 7 days)
-- This can be called by a scheduled job
CREATE OR REPLACE FUNCTION cleanup_old_api_usage()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM api_usage
  WHERE created_at < NOW() - INTERVAL '7 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

COMMENT ON FUNCTION cleanup_old_api_usage IS 'Removes API usage records older than 7 days';
