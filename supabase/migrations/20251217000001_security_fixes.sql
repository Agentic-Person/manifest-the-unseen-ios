-- Security Fixes Migration
-- Addresses critical security issues from Supabase Database Linter audit
-- Date: 2025-12-16

-- ============================================================================
-- 1. ENABLE RLS ON MEDITATIONS TABLE
-- Issue: Policy "Anyone can view meditations" exists but RLS was not enabled
-- Risk: HIGH - Table is publicly accessible, policy is being ignored
-- ============================================================================
ALTER TABLE public.meditations ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. ENABLE RLS ON KNOWLEDGE_EMBEDDINGS TABLE
-- Issue: No RLS at all on this table (709 rows of AI knowledge base)
-- Risk: MEDIUM - Anyone can read/modify the knowledge base
-- ============================================================================
ALTER TABLE public.knowledge_embeddings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read embeddings (needed for RAG queries via anon key)
CREATE POLICY "Anyone can read embeddings"
  ON public.knowledge_embeddings
  FOR SELECT
  USING (true);

-- Only service role can insert new embeddings
CREATE POLICY "Service role can insert embeddings"
  ON public.knowledge_embeddings
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Only service role can update embeddings
CREATE POLICY "Service role can update embeddings"
  ON public.knowledge_embeddings
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- Only service role can delete embeddings
CREATE POLICY "Service role can delete embeddings"
  ON public.knowledge_embeddings
  FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================================================
-- 3. FIX FUNCTION SEARCH PATHS
-- Issue: Functions have mutable search_path (security vulnerability)
-- Risk: MEDIUM - Could allow search path injection attacks
-- ============================================================================

-- Fix update_updated_at_column function
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;

-- Fix match_knowledge function (used for RAG vector similarity search)
ALTER FUNCTION public.match_knowledge(vector(1536), double precision, integer) SET search_path = public;

-- Fix handle_new_user function (auth trigger for user creation)
ALTER FUNCTION public.handle_new_user() SET search_path = public;

-- ============================================================================
-- NOTES:
-- - Leaked password protection must be enabled manually in Supabase Dashboard
--   (Authentication > Settings > Enable "Leaked password protection")
-- - Vector extension in public schema is a low-priority issue, deferred
-- - RLS policy optimization (auth.uid() -> (select auth.uid())) deferred
-- - Unused indexes will be re-evaluated after production traffic
-- ============================================================================
