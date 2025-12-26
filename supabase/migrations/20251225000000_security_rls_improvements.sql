-- Security RLS Improvements Migration
-- Migration: 20251225000000_security_rls_improvements.sql
-- Description: Improves RLS policies to reduce service role key usage in Edge Functions
-- Related: SecurityAudit.md - C4 (Service role key in Edge Functions)

-- =============================================================================
-- PROMO CODE REDEMPTIONS - ALLOW USER INSERTS
-- =============================================================================
-- Currently only service role can insert redemptions.
-- This adds a policy allowing authenticated users to insert their OWN redemptions.
-- Edge Function can now use anon+JWT instead of service role for inserts.

-- Add policy for users to insert their own redemptions - drop first if exists
DROP POLICY IF EXISTS "Users can insert own redemptions" ON promo_code_redemptions;
CREATE POLICY "Users can insert own redemptions" ON promo_code_redemptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

COMMENT ON POLICY "Users can insert own redemptions" ON promo_code_redemptions IS
  'Added 2025-12-25: Allows Edge Functions to use user JWT instead of service role for inserting redemptions. See SecurityAudit.md C4.';

-- =============================================================================
-- KNOWLEDGE EMBEDDINGS - ADD MISSING UPDATE/DELETE POLICIES
-- =============================================================================
-- From SecurityAudit.md H1: Missing RLS policies on knowledge_embeddings

-- Add UPDATE policy (service role only) - drop first if exists
DROP POLICY IF EXISTS "Service role can update embeddings" ON public.knowledge_embeddings;
CREATE POLICY "Service role can update embeddings" ON public.knowledge_embeddings
  FOR UPDATE USING (auth.role() = 'service_role');

-- Add DELETE policy (service role only) - drop first if exists
DROP POLICY IF EXISTS "Service role can delete embeddings" ON public.knowledge_embeddings;
CREATE POLICY "Service role can delete embeddings" ON public.knowledge_embeddings
  FOR DELETE USING (auth.role() = 'service_role');

COMMENT ON POLICY "Service role can update embeddings" ON public.knowledge_embeddings IS
  'Added 2025-12-25: Explicit UPDATE policy for admin operations. See SecurityAudit.md H1.';

COMMENT ON POLICY "Service role can delete embeddings" ON public.knowledge_embeddings IS
  'Added 2025-12-25: Explicit DELETE policy for admin operations. See SecurityAudit.md H1.';

-- =============================================================================
-- MIGRATION NOTES
-- =============================================================================
-- After this migration:
-- 1. validate-promo can use anon+JWT for INSERT on promo_code_redemptions
-- 2. knowledge_embeddings has complete RLS coverage (SELECT, INSERT, UPDATE, DELETE)
--
-- Rollback if needed:
-- DROP POLICY "Users can insert own redemptions" ON promo_code_redemptions;
-- DROP POLICY "Service role can update embeddings" ON public.knowledge_embeddings;
-- DROP POLICY "Service role can delete embeddings" ON public.knowledge_embeddings;
