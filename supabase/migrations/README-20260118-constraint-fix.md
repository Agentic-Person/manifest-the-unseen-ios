# Quick Start: Applying the Database Constraint Fix

## The Problem
Auto-save and Guru conversations failing with error: `"there is no unique or exclusion constraint matching the ON CONFLICT specification"`

## The Fix
Migration `20260118000000_fix_workbook_progress_constraint.sql` adds properly named unique constraints to:
- `workbook_progress` table (for worksheet auto-save)
- `ai_conversations` table (for Guru conversation UPSERT)

## How to Apply

### Option 1: Push to Supabase (Recommended)

```bash
# From project root
cd C:\projects\mobileApps\manifest-the-unseen-ios

# Push to your Supabase project
npx supabase db push
```

### Option 2: Run in SQL Editor

1. Open Supabase Dashboard → SQL Editor
2. Open `supabase/migrations/20260118000000_fix_workbook_progress_constraint.sql`
3. Copy entire file contents
4. Paste into SQL Editor
5. Click "Run"

### Option 3: Reset Local Database (Development Only)

```bash
# WARNING: This deletes all data in your local database!
npx supabase db reset
```

## Verify It Worked

Run these in SQL Editor:

```sql
-- Should return: workbook_progress_user_phase_worksheet_unique
SELECT conname
FROM pg_constraint con
INNER JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'workbook_progress'
AND con.contype = 'u';

-- Should return: ai_conversations_guru_unique
SELECT conname
FROM pg_constraint con
INNER JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'ai_conversations'
AND con.contype = 'u';
```

## Test It

**Workbook:**
1. Open mobile app
2. Go to any workbook worksheet
3. Fill in some data
4. Wait for auto-save (or trigger it manually)
5. Check logs - should see success, no errors

**Guru:**
1. Complete a workbook phase
2. Open Guru analysis
3. Start/continue conversation
4. Check logs - should see success, no errors

## What It Does

- ✅ Drops old unnamed constraint on workbook_progress
- ✅ Creates new named constraint: `workbook_progress_user_phase_worksheet_unique`
- ✅ Adds Guru constraint: `ai_conversations_guru_unique`
- ✅ Cleans up any duplicate Guru conversations
- ✅ Verifies all indexes exist
- ✅ Verifies all RLS policies exist

## Rollback (If Needed)

```sql
-- Rollback workbook constraint
ALTER TABLE workbook_progress DROP CONSTRAINT workbook_progress_user_phase_worksheet_unique;
ALTER TABLE workbook_progress ADD UNIQUE (user_id, phase_number, worksheet_id);

-- Rollback Guru constraint
ALTER TABLE ai_conversations DROP CONSTRAINT ai_conversations_guru_unique;
```

## More Details

See `/docs/operations/database-fixes/20260118-workbook-constraint-fix.md` for full documentation.
