-- Verify workbook_progress constraint exists
SELECT
    conname as constraint_name,
    contype as constraint_type
FROM pg_constraint con
INNER JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'workbook_progress'
AND con.contype = 'u'
ORDER BY conname;

-- Verify ai_conversations Guru constraint exists
SELECT
    conname as constraint_name,
    contype as constraint_type
FROM pg_constraint con
INNER JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'ai_conversations'
AND con.contype = 'u'
ORDER BY conname;

-- Check if workbook_progress RLS is enabled
SELECT
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN ('workbook_progress', 'ai_conversations');

-- List all policies on workbook_progress
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename IN ('workbook_progress', 'ai_conversations')
ORDER BY tablename, policyname;
