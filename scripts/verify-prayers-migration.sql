-- ============================================================================
-- Verification Queries for Prayers Table Migration
-- File: scripts/verify-prayers-migration.sql
-- Run these after applying the migration to verify everything works
-- ============================================================================

-- 1. Check table exists and has data
SELECT 'Test 1: Table row count' as test;
SELECT COUNT(*) as total_prayers FROM prayers;
-- Expected: 6

-- 2. Check table structure
SELECT 'Test 2: Table structure' as test;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'prayers'
ORDER BY ordinal_position;

-- 3. Check indexes exist
SELECT 'Test 3: Indexes' as test;
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'prayers';
-- Expected: 4 indexes (primary key + 3 custom indexes)

-- 4. Check RLS policies
SELECT 'Test 4: RLS Policies' as test;
SELECT policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'prayers';
-- Expected: 1 policy ("Anyone can view prayers")

-- 5. Verify all prayers were seeded
SELECT 'Test 5: Prayer titles' as test;
SELECT order_index, title, array_length(life_areas, 1) as num_areas, tier_required
FROM prayers
ORDER BY order_index;
-- Expected: 6 rows with order_index 1-6

-- 6. Test life_area overlap query (Guru AI recommendation logic)
SELECT 'Test 6: Finance + Career prayers' as test;
SELECT title, life_areas, tier_required, duration_seconds
FROM prayers
WHERE life_areas && ARRAY['finance', 'career']
ORDER BY order_index;
-- Expected: 2 prayers (Career Success, Financial Abundance)

-- 7. Test life_area overlap - spirituality
SELECT 'Test 7: Spirituality prayers' as test;
SELECT title, life_areas, duration_seconds
FROM prayers
WHERE life_areas && ARRAY['spirituality']
ORDER BY order_index;
-- Expected: 3 prayers (Healing, Letting Go of Fear, Inner Peace)

-- 8. Test tier filtering
SELECT 'Test 8: Novice tier prayers' as test;
SELECT title, tier_required
FROM prayers
WHERE tier_required = 'novice'
ORDER BY order_index;
-- Expected: 4 prayers (Career Success, Financial Abundance, Relationships, Inner Peace)

-- 9. Test combined query (what Guru AI will use)
SELECT 'Test 9: Combined query (novice tier, finance/career areas)' as test;
SELECT title, life_areas, tier_required, duration_seconds
FROM prayers
WHERE life_areas && ARRAY['finance', 'career']
  AND tier_required = 'novice'
ORDER BY order_index
LIMIT 3;
-- Expected: 2 prayers (Career Success, Financial Abundance)

-- 10. Check prayer content length
SELECT 'Test 10: Prayer content stats' as test;
SELECT
  title,
  LENGTH(content) as content_length,
  duration_seconds,
  ROUND(LENGTH(content) / duration_seconds::numeric, 2) as chars_per_second
FROM prayers
ORDER BY order_index;

-- 11. Verify all life areas used
SELECT 'Test 11: All life areas used' as test;
SELECT DISTINCT UNNEST(life_areas) as life_area
FROM prayers
ORDER BY life_area;
-- Expected: 8 areas (career, family, finance, health, personalGrowth, recreation, relationships, spirituality)

-- 12. Verify no duplicate order_index
SELECT 'Test 12: Check for duplicate order_index' as test;
SELECT order_index, COUNT(*) as count
FROM prayers
GROUP BY order_index
HAVING COUNT(*) > 1;
-- Expected: 0 rows (no duplicates)

-- ============================================================================
-- All tests passed? You're good to go! ✅
-- ============================================================================

SELECT 'All verification tests complete!' as status;
