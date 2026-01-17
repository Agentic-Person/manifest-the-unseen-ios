-- Cleanup duplicate meditations and add unique constraint
-- This migration:
-- 1. Removes duplicate meditations (keeps oldest by created_at)
-- 2. Deletes failed "Communion with the Divine" prayer
-- 3. Adds unique constraint to prevent future duplicates
-- 4. Includes verification queries

-- Step 1: Identify and delete duplicates (keep oldest by created_at)
WITH duplicates AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY title, type
      ORDER BY created_at ASC  -- Keep first (oldest)
    ) as row_num
  FROM meditations
  WHERE type IN ('guided', 'breathing', 'music')
)
DELETE FROM meditations
WHERE id IN (
  SELECT id FROM duplicates WHERE row_num > 1
);

-- Step 2: Delete failed Communion with the Divine prayer
-- (User is creating a new version)
DELETE FROM prayers
WHERE title = 'Communion with the Divine';

-- Step 3: Add unique constraint to prevent future duplicates
-- This ensures each (title, type) combination appears only once
ALTER TABLE meditations
ADD CONSTRAINT meditations_title_type_unique
UNIQUE (title, type);

-- Step 4: Verification queries (commented out - run manually to verify)
-- Should return 0 rows if cleanup successful:
-- SELECT title, type, COUNT(*) as count
-- FROM meditations
-- GROUP BY title, type
-- HAVING COUNT(*) > 1;

-- Verify constraint exists:
-- SELECT constraint_name
-- FROM information_schema.table_constraints
-- WHERE table_name = 'meditations'
--   AND constraint_name = 'meditations_title_type_unique';

-- Verify communion prayer deleted:
-- SELECT * FROM prayers WHERE title ILIKE '%communion%';
