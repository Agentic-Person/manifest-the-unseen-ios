# Apply Database Migration - INSTRUCTIONS

## 🚨 Action Required: Apply Constraint Fix Migration

The migration has been marked as "applied" in the history, but you need to **actually run the SQL** to create the constraints.

---

## Option 1: Supabase Dashboard SQL Editor (Recommended - 2 minutes)

### Step 1: Open SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project: **Manifest the Unseen**
3. Click **SQL Editor** in the left sidebar

### Step 2: Run the Migration
1. Click **New Query**
2. Open this file: `supabase/migrations/20260118000000_fix_workbook_progress_constraint.sql`
3. **Copy ALL the SQL** (entire file - 260 lines)
4. **Paste into SQL Editor**
5. Click **Run** (or press Ctrl+Enter)

### Step 3: Verify Success
You should see output like:
```
NOTICE:  Dropping existing constraint: workbook_progress_user_id_phase_number_worksheet_id_key
NOTICE:  Created new constraint: workbook_progress_user_phase_worksheet_unique
NOTICE:  Created Guru constraint: ai_conversations_guru_unique
NOTICE:  Verified index: idx_workbook_progress_user_phase exists
...
```

Look for this final message:
```
✅ Migration completed successfully!
```

---

## Option 2: Command Line with psql (Alternative)

### Prerequisites
- PostgreSQL client (psql) installed
- Supabase connection string

### Steps
```bash
# Get your connection string from Supabase Dashboard > Settings > Database
# It looks like: postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

# Run the migration
psql "your-connection-string-here" -f supabase/migrations/20260118000000_fix_workbook_progress_constraint.sql
```

---

## Verification After Running

Run this SQL query to verify both constraints exist:

```sql
-- Should return: workbook_progress_user_phase_worksheet_unique
SELECT conname
FROM pg_constraint con
INNER JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'workbook_progress'
AND con.contype = 'u'
AND conname LIKE '%worksheet%';

-- Should return: ai_conversations_guru_unique
SELECT conname
FROM pg_constraint con
INNER JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'ai_conversations'
AND con.contype = 'u'
AND conname LIKE '%guru%';
```

**Expected Results**:
- First query returns: `workbook_progress_user_phase_worksheet_unique`
- Second query returns: `ai_conversations_guru_unique`

---

## What This Migration Does

✅ **Fixes workbook auto-save** - No more UPSERT errors (code 42P10)
✅ **Fixes Guru conversations** - Adds unique constraint for phase analysis
✅ **Cleans up duplicates** - Removes any duplicate Guru conversations
✅ **Verifies RLS policies** - Ensures all security policies exist
✅ **Idempotent** - Safe to run multiple times

---

## After Migration is Applied

1. ✅ Test workbook auto-save in the app
2. ✅ Test Guru AI conversations
3. ✅ Verify no more 406 errors in console
4. ✅ Check that data persists after page refresh

---

## Need Help?

If you see any errors when running the migration:
1. Copy the full error message
2. Check the migration SQL file for comments
3. The migration includes diagnostic queries to help troubleshoot

**The migration is production-safe and includes rollback instructions in the comprehensive docs.**
