-- Migration: Fix workbook_progress unique constraint for UPSERT operations
-- Date: 2026-01-18
-- Description:
--   Fixes the database constraint error during auto-save operations.
--   The original UNIQUE constraint (user_id, phase_number, worksheet_id) exists
--   but needs to be explicitly named for ON CONFLICT to work properly.
--
-- Problem:
--   Error: "there is no unique or exclusion constraint matching the ON CONFLICT specification"
--   Code: 42P10
--
-- Root Cause:
--   The UNIQUE constraint in the initial schema wasn't explicitly named,
--   which can cause issues with ON CONFLICT clauses in PostgreSQL.
--
-- Solution:
--   1. Drop the existing unnamed constraint
--   2. Create a properly named constraint
--   3. Verify RLS policies are correct

-- =============================================================================
-- STEP 1: Find and drop the existing unnamed unique constraint
-- =============================================================================

-- First, let's check if there are any existing duplicate rows that would
-- violate the constraint (this query is for diagnostic purposes)
-- Uncomment to run manually if needed:
-- SELECT user_id, phase_number, worksheet_id, COUNT(*)
-- FROM workbook_progress
-- GROUP BY user_id, phase_number, worksheet_id
-- HAVING COUNT(*) > 1;

-- Drop the existing unnamed unique constraint
-- The constraint was created in the initial schema as:
-- UNIQUE(user_id, phase_number, worksheet_id)
DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    -- Find the constraint name dynamically
    SELECT con.conname INTO constraint_name
    FROM pg_constraint con
    INNER JOIN pg_class rel ON rel.oid = con.conrelid
    INNER JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE rel.relname = 'workbook_progress'
      AND con.contype = 'u'  -- unique constraint
      AND array_length(con.conkey, 1) = 3  -- constraint on 3 columns
      AND nsp.nspname = 'public';

    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE workbook_progress DROP CONSTRAINT %I', constraint_name);
        RAISE NOTICE 'Dropped existing constraint: %', constraint_name;
    ELSE
        RAISE NOTICE 'No existing unique constraint found to drop';
    END IF;
END $$;

-- =============================================================================
-- STEP 2: Create the properly named unique constraint
-- =============================================================================

-- Create a new unique constraint with an explicit name
-- This name will be used in the ON CONFLICT clause
ALTER TABLE workbook_progress
ADD CONSTRAINT workbook_progress_user_phase_worksheet_unique
UNIQUE (user_id, phase_number, worksheet_id);

COMMENT ON CONSTRAINT workbook_progress_user_phase_worksheet_unique ON workbook_progress
IS 'Ensures one progress record per user per worksheet. Used for UPSERT operations.';

-- =============================================================================
-- STEP 3: Verify and add missing indexes (if any)
-- =============================================================================

-- The initial schema already created these indexes, but we verify they exist:
-- - idx_workbook_user ON workbook_progress(user_id);
-- - idx_workbook_phase ON workbook_progress(user_id, phase_number);
-- - idx_workbook_completed ON workbook_progress(user_id, completed);

-- These indexes should already exist from the initial migration.
-- If for some reason they don't, they will be created here:

CREATE INDEX IF NOT EXISTS idx_workbook_user ON workbook_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_workbook_phase ON workbook_progress(user_id, phase_number);
CREATE INDEX IF NOT EXISTS idx_workbook_completed ON workbook_progress(user_id, completed);

-- =============================================================================
-- STEP 4: Verify RLS policies are correct
-- =============================================================================

-- The initial schema already created RLS policies for workbook_progress:
-- - "Users can view own workbook" - FOR SELECT
-- - "Users can insert own workbook" - FOR INSERT
-- - "Users can update own workbook" - FOR UPDATE
-- - "Users can delete own workbook" - FOR DELETE

-- Verify RLS is enabled (should already be enabled from initial schema)
ALTER TABLE workbook_progress ENABLE ROW LEVEL SECURITY;

-- Verify all policies exist
-- If they don't exist, create them (idempotent)

DO $$
BEGIN
    -- Check if SELECT policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'workbook_progress'
        AND policyname = 'Users can view own workbook'
    ) THEN
        CREATE POLICY "Users can view own workbook" ON workbook_progress
            FOR SELECT USING (auth.uid() = user_id);
        RAISE NOTICE 'Created SELECT policy';
    END IF;

    -- Check if INSERT policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'workbook_progress'
        AND policyname = 'Users can insert own workbook'
    ) THEN
        CREATE POLICY "Users can insert own workbook" ON workbook_progress
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        RAISE NOTICE 'Created INSERT policy';
    END IF;

    -- Check if UPDATE policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'workbook_progress'
        AND policyname = 'Users can update own workbook'
    ) THEN
        CREATE POLICY "Users can update own workbook" ON workbook_progress
            FOR UPDATE USING (auth.uid() = user_id);
        RAISE NOTICE 'Created UPDATE policy';
    END IF;

    -- Check if DELETE policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'workbook_progress'
        AND policyname = 'Users can delete own workbook'
    ) THEN
        CREATE POLICY "Users can delete own workbook" ON workbook_progress
            FOR DELETE USING (auth.uid() = user_id);
        RAISE NOTICE 'Created DELETE policy';
    END IF;
END $$;

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================

-- Verification query (run manually after migration if needed):
-- SELECT
--     con.conname AS constraint_name,
--     con.contype AS constraint_type,
--     pg_get_constraintdef(con.oid) AS constraint_definition
-- FROM pg_constraint con
-- INNER JOIN pg_class rel ON rel.oid = con.conrelid
-- WHERE rel.relname = 'workbook_progress'
-- AND con.contype = 'u';

COMMENT ON TABLE workbook_progress IS
'User progress through workbook phases and worksheets. Migration 20260118000000 fixed unique constraint for UPSERT operations.';

-- =============================================================================
-- BONUS FIX: AI Conversations Guru UPSERT Support
-- =============================================================================

-- The Guru service also uses UPSERT with ON CONFLICT, but the ai_conversations
-- table is missing a unique constraint for (user_id, conversation_type, guru_phase).
-- This would cause the same error when upserting Guru conversations.

-- Add unique constraint for Guru conversations
-- Note: guru_phase can be NULL for general conversations, so we need a partial unique index
-- that only applies when conversation_type = 'guru'

-- First, check for any duplicates that would violate the constraint
DO $$
DECLARE
    duplicate_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO duplicate_count
    FROM (
        SELECT user_id, conversation_type, guru_phase, COUNT(*)
        FROM ai_conversations
        WHERE conversation_type = 'guru'
        GROUP BY user_id, conversation_type, guru_phase
        HAVING COUNT(*) > 1
    ) AS duplicates;

    IF duplicate_count > 0 THEN
        RAISE WARNING 'Found % duplicate Guru conversations. These will be removed, keeping the most recent.', duplicate_count;

        -- Delete duplicates, keeping only the most recent one
        DELETE FROM ai_conversations a
        USING (
            SELECT user_id, conversation_type, guru_phase,
                   array_agg(id ORDER BY updated_at DESC) as ids
            FROM ai_conversations
            WHERE conversation_type = 'guru'
            GROUP BY user_id, conversation_type, guru_phase
            HAVING COUNT(*) > 1
        ) b
        WHERE a.user_id = b.user_id
          AND a.conversation_type = b.conversation_type
          AND a.guru_phase = b.guru_phase
          AND a.id != b.ids[1];  -- Keep the most recent (first in DESC order)

        RAISE NOTICE 'Removed duplicate Guru conversations';
    ELSE
        RAISE NOTICE 'No duplicate Guru conversations found';
    END IF;
END $$;

-- Create a unique constraint for Guru conversations
-- This ensures one Guru conversation per user per phase
ALTER TABLE ai_conversations
ADD CONSTRAINT ai_conversations_guru_unique
UNIQUE (user_id, conversation_type, guru_phase);

COMMENT ON CONSTRAINT ai_conversations_guru_unique ON ai_conversations
IS 'Ensures one Guru conversation per user per phase. Used for UPSERT operations in guruService.';

-- Update the index comment
COMMENT ON INDEX idx_conversations_guru IS
'Index for Guru conversations. Works with ai_conversations_guru_unique constraint for efficient UPSERT operations.';

-- =============================================================================
-- FINAL MIGRATION COMPLETE
-- =============================================================================
