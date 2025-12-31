# Prayers Table Migration Instructions

## Migration File
`supabase/migrations/20251217000002_create_prayers_table.sql`

## Deployment Options

### Option 1: Supabase Studio SQL Editor (RECOMMENDED)

1. Go to [Supabase Studio SQL Editor](https://supabase.com/dashboard/project/zbyszxtwzoylyygtexdr/sql/new)
2. Copy the entire contents of `supabase/migrations/20251217000002_create_prayers_table.sql`
3. Paste into the SQL editor
4. Click "Run" to execute the migration
5. Verify success by running: `SELECT * FROM prayers;`

### Option 2: Supabase CLI (requires login)

```bash
# Login to Supabase
npx supabase login

# Link to project
npx supabase link --project-ref zbyszxtwzoylyygtexdr

# Push migration
npx supabase db push
```

### Option 3: Direct Database Connection

If you have the correct database password:

```bash
# Using psql
psql "postgresql://postgres:[YOUR-DB-PASSWORD]@db.zbyszxtwzoylyygtexdr.supabase.co:5432/postgres" \
  -f supabase/migrations/20251217000002_create_prayers_table.sql

# Using Node.js script
node scripts/apply-migration-pg.mjs 20251217000002_create_prayers_table.sql
```

Note: Update the password in `scripts/apply-migration-pg.mjs` with the correct database password from:
https://supabase.com/dashboard/project/zbyszxtwzoylyygtexdr/settings/database

## What This Migration Does

1. **Creates `prayers` table** with the following structure:
   - `id` (UUID, primary key)
   - `title` (TEXT, required)
   - `description` (TEXT, optional)
   - `content` (TEXT, required - the prayer text)
   - `duration_seconds` (INTEGER, default 60)
   - `tier_required` (subscription_tier enum, default 'novice')
   - `life_areas` (TEXT[] array for tagging)
   - `tags` (TEXT[] array for categorization)
   - `order_index` (INTEGER for display ordering)
   - `created_at` (TIMESTAMP)

2. **Creates indexes** for efficient queries:
   - GIN index on `life_areas` for array overlap queries
   - Index on `tier_required` for subscription filtering
   - Index on `order_index` for display ordering

3. **Enables Row Level Security (RLS)**:
   - Read-only policy: "Anyone can view prayers"

4. **Seeds 6 prayers** with life_area tagging:
   - Prayer for Career Success → `['career', 'personalGrowth']`
   - Prayer for Financial Abundance → `['finance', 'career']`
   - Prayer for Healing → `['health', 'spirituality']`
   - Prayer for Loving Relationships → `['relationships', 'family']`
   - Prayer for Letting Go of Fear → `['personalGrowth', 'spirituality']`
   - Prayer for Inner Peace → `['spirituality', 'health', 'recreation']`

## Verification

After running the migration, verify with these queries:

```sql
-- Check table exists and has data
SELECT COUNT(*) FROM prayers;
-- Expected: 6 rows

-- Test life_area overlap query (Guru AI recommendation logic)
SELECT title, life_areas
FROM prayers
WHERE life_areas && ARRAY['finance', 'career'];
-- Expected: 2 prayers (Career Success, Financial Abundance)

-- Check all prayers
SELECT id, title, life_areas, tier_required
FROM prayers
ORDER BY order_index;
```

## Integration with Guru AI

The `life_areas` column enables smart prayer recommendations based on user's Wheel of Life scores:

```typescript
// Example: Find prayers for weak life areas
const { data: prayers } = await supabase
  .from('prayers')
  .select('*')
  .overlaps('life_areas', ['finance', 'career'])
  .lte('tier_required', userTier)
  .order('order_index');
```

## Troubleshooting

**Issue**: "relation prayers does not exist"
**Solution**: Migration hasn't been applied yet. Follow Option 1 above.

**Issue**: "permission denied for table prayers"
**Solution**: RLS policy issue. Ensure you're using service_role key or anon key with proper policies.

**Issue**: "type subscription_tier does not exist"
**Solution**: Run initial schema migration first: `20250101000000_initial_schema.sql`
