-- Test UPSERT Constraints
-- This file is for TESTING ONLY - run manually after applying migration 20260118000000
-- DO NOT run this in production!

-- =============================================================================
-- TEST 1: Workbook Progress UPSERT
-- =============================================================================

-- Replace [user-id] with a real user ID from your users table
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Get first user from users table (for testing)
    SELECT id INTO test_user_id FROM users LIMIT 1;

    IF test_user_id IS NULL THEN
        RAISE EXCEPTION 'No users found in database. Create a user first.';
    END IF;

    RAISE NOTICE 'Testing with user_id: %', test_user_id;

    -- Test 1: First insert
    INSERT INTO workbook_progress (user_id, phase_number, worksheet_id, data)
    VALUES (test_user_id, 1, 'test-worksheet', '{"test": "data1", "timestamp": 1}')
    ON CONFLICT (user_id, phase_number, worksheet_id)
    DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();

    RAISE NOTICE 'Test 1 passed: First insert successful';

    -- Test 2: Update (should conflict and update)
    INSERT INTO workbook_progress (user_id, phase_number, worksheet_id, data)
    VALUES (test_user_id, 1, 'test-worksheet', '{"test": "data2", "timestamp": 2}')
    ON CONFLICT (user_id, phase_number, worksheet_id)
    DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();

    RAISE NOTICE 'Test 2 passed: Update successful';

    -- Verify only 1 row exists
    IF (SELECT COUNT(*) FROM workbook_progress
        WHERE user_id = test_user_id
        AND phase_number = 1
        AND worksheet_id = 'test-worksheet') != 1 THEN
        RAISE EXCEPTION 'Test failed: Expected 1 row, found multiple';
    END IF;

    RAISE NOTICE 'Test 3 passed: Only 1 row exists (no duplicates)';

    -- Cleanup
    DELETE FROM workbook_progress
    WHERE user_id = test_user_id
    AND phase_number = 1
    AND worksheet_id = 'test-worksheet';

    RAISE NOTICE 'Cleanup complete';
    RAISE NOTICE '✅ All workbook_progress UPSERT tests passed!';
END $$;

-- =============================================================================
-- TEST 2: Guru Conversations UPSERT
-- =============================================================================

DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Get first user from users table (for testing)
    SELECT id INTO test_user_id FROM users LIMIT 1;

    IF test_user_id IS NULL THEN
        RAISE EXCEPTION 'No users found in database. Create a user first.';
    END IF;

    RAISE NOTICE 'Testing Guru conversations with user_id: %', test_user_id;

    -- Test 1: First insert
    INSERT INTO ai_conversations (user_id, conversation_type, guru_phase, title, messages)
    VALUES (
        test_user_id,
        'guru',
        1,
        'Test Phase 1 Guru',
        '[{"role": "user", "content": "Test message 1"}]'::jsonb
    )
    ON CONFLICT (user_id, conversation_type, guru_phase)
    DO UPDATE SET
        messages = EXCLUDED.messages,
        updated_at = NOW();

    RAISE NOTICE 'Test 1 passed: First Guru conversation insert successful';

    -- Test 2: Update (should conflict and update)
    INSERT INTO ai_conversations (user_id, conversation_type, guru_phase, title, messages)
    VALUES (
        test_user_id,
        'guru',
        1,
        'Test Phase 1 Guru Updated',
        '[{"role": "user", "content": "Test message 2"}]'::jsonb
    )
    ON CONFLICT (user_id, conversation_type, guru_phase)
    DO UPDATE SET
        messages = EXCLUDED.messages,
        title = EXCLUDED.title,
        updated_at = NOW();

    RAISE NOTICE 'Test 2 passed: Guru conversation update successful';

    -- Verify only 1 row exists
    IF (SELECT COUNT(*) FROM ai_conversations
        WHERE user_id = test_user_id
        AND conversation_type = 'guru'
        AND guru_phase = 1) != 1 THEN
        RAISE EXCEPTION 'Test failed: Expected 1 Guru conversation, found multiple';
    END IF;

    RAISE NOTICE 'Test 3 passed: Only 1 Guru conversation exists (no duplicates)';

    -- Cleanup
    DELETE FROM ai_conversations
    WHERE user_id = test_user_id
    AND conversation_type = 'guru'
    AND guru_phase = 1;

    RAISE NOTICE 'Cleanup complete';
    RAISE NOTICE '✅ All ai_conversations UPSERT tests passed!';
END $$;

-- =============================================================================
-- TEST 3: Verify Constraints Exist
-- =============================================================================

DO $$
DECLARE
    wb_constraint_exists BOOLEAN;
    guru_constraint_exists BOOLEAN;
BEGIN
    -- Check workbook_progress constraint
    SELECT EXISTS (
        SELECT 1 FROM pg_constraint con
        INNER JOIN pg_class rel ON rel.oid = con.conrelid
        WHERE rel.relname = 'workbook_progress'
        AND con.conname = 'workbook_progress_user_phase_worksheet_unique'
    ) INTO wb_constraint_exists;

    -- Check ai_conversations constraint
    SELECT EXISTS (
        SELECT 1 FROM pg_constraint con
        INNER JOIN pg_class rel ON rel.oid = con.conrelid
        WHERE rel.relname = 'ai_conversations'
        AND con.conname = 'ai_conversations_guru_unique'
    ) INTO guru_constraint_exists;

    IF wb_constraint_exists THEN
        RAISE NOTICE '✅ workbook_progress_user_phase_worksheet_unique exists';
    ELSE
        RAISE EXCEPTION '❌ workbook_progress_user_phase_worksheet_unique NOT FOUND!';
    END IF;

    IF guru_constraint_exists THEN
        RAISE NOTICE '✅ ai_conversations_guru_unique exists';
    ELSE
        RAISE EXCEPTION '❌ ai_conversations_guru_unique NOT FOUND!';
    END IF;

    RAISE NOTICE '✅ All constraints exist!';
END $$;

-- =============================================================================
-- SUMMARY
-- =============================================================================

-- If you see these messages, the migration was successful:
-- ✅ All workbook_progress UPSERT tests passed!
-- ✅ All ai_conversations UPSERT tests passed!
-- ✅ All constraints exist!
