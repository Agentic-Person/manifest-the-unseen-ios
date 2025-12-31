# Database Execution Guide - Week 2

**Status**: Ready to Execute
**Estimated Time**: 2-3 hours
**Prerequisites**: Node.js, Supabase CLI

---

## Overview

This guide walks through executing all database migrations, configuring pgvector, testing RLS policies, and loading seed data. This completes the backend infrastructure for Week 2.

---

## Part 1: Environment Setup (30 min)

### Option A: Local Supabase (Recommended for Week 2)

**Advantages**:
- Free, fast, easy to reset
- No cloud account needed yet
- Perfect for development

**Steps**:

```bash
# 1. Install Supabase CLI (if not already installed)
npm install -g supabase

# 2. Verify installation
npx supabase --version
# Should show: supabase version 1.x.x

# 3. Start local Supabase
cd C:\projects\mobileApps\manifest-the-unseen-ios
npx supabase start

# This will start:
# - Postgres database (port 54322)
# - PostgREST API (port 54321)
# - Supabase Studio (port 54323)
# - Auth server
# - Storage server
# - Realtime server
```

**Output** (save these values):
```
Started supabase local development setup.

         API URL: http://localhost:54321
     GraphQL URL: http://localhost:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Copy these to `.env.local`**:
```bash
# Create .env.local (don't commit this!)
cat > mobile/.env.local << 'EOF'
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=<your-anon-key-from-above>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key-from-above>
EOF
```

### Option B: Remote Supabase (For Production Later)

**Steps**:

1. Go to https://supabase.com
2. Sign in with GitHub
3. Click "New Project"
4. Fill in:
   - Name: manifest-the-unseen
   - Database Password: (generate strong password)
   - Region: Choose closest to your users
5. Wait ~2 minutes for provisioning
6. Copy API keys from Settings > API

**Save keys to `.env`**:
```bash
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

---

## Part 2: Execute Migrations (30 min)

### 2.1 Initial Schema Migration

This creates all 8 tables with RLS policies.

**Using Supabase CLI**:

```bash
# Apply all migrations
npx supabase db push

# Or apply specific migration
npx supabase db push supabase/migrations/20250101000000_initial_schema.sql
```

**Manual Execution** (if CLI fails):

```bash
# Option 1: Via psql
psql postgresql://postgres:postgres@localhost:54322/postgres \
  -f supabase/migrations/20250101000000_initial_schema.sql

# Option 2: Via Supabase Studio
# 1. Open http://localhost:54323
# 2. Go to "SQL Editor"
# 3. Copy contents of supabase/migrations/20250101000000_initial_schema.sql
# 4. Paste and click "Run"
```

**Expected Output**:
```
CREATE EXTENSION
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE POLICY
CREATE POLICY
...
(27 CREATE POLICY statements)
```

### 2.2 Auth Triggers Migration

This creates triggers for auto-creating user profiles.

```bash
# Apply second migration
npx supabase db push supabase/migrations/20250102000000_auth_triggers.sql

# Or manually via psql
psql postgresql://postgres:postgres@localhost:54322/postgres \
  -f supabase/migrations/20250102000000_auth_triggers.sql
```

**Expected Output**:
```
CREATE FUNCTION
CREATE TRIGGER
```

### 2.3 Verify Migrations

**Check Tables**:

```sql
-- Run in Supabase Studio SQL Editor or psql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected Results** (8 tables):
```
ai_conversations
journal_entries
knowledge_embeddings
meditation_sessions
meditations
users
vision_boards
workbook_progress
```

**Check RLS Policies**:

```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Expected Results**: 27 policies across 8 tables

---

## Part 3: Configure pgvector (30 min)

### 3.1 Enable pgvector Extension

```sql
-- Run in SQL Editor
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify
SELECT * FROM pg_extension WHERE extname = 'vector';
```

**Expected Output**:
```
 extname | extversion
---------+------------
 vector  | 0.5.1
```

### 3.2 Create Similarity Search Function

```sql
-- Run in SQL Editor
CREATE OR REPLACE FUNCTION match_knowledge_embeddings(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  content text,
  source text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_embeddings.id,
    knowledge_embeddings.content,
    knowledge_embeddings.source,
    knowledge_embeddings.metadata,
    1 - (knowledge_embeddings.embedding <=> query_embedding) as similarity
  FROM knowledge_embeddings
  WHERE 1 - (knowledge_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

**Expected Output**: `CREATE FUNCTION`

### 3.3 Create Vector Index

```sql
-- Create ivfflat index for fast similarity search
CREATE INDEX IF NOT EXISTS knowledge_embeddings_embedding_idx
ON knowledge_embeddings
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Verify index
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'knowledge_embeddings';
```

**Expected Output**: Index `knowledge_embeddings_embedding_idx` created

### 3.4 Test pgvector

```sql
-- Insert test embedding (random vector for now)
INSERT INTO knowledge_embeddings (content, source, embedding)
VALUES (
  'Test wisdom: The journey of a thousand miles begins with a single step.',
  'test_source',
  array_fill(0.1, ARRAY[1536])::vector
);

-- Test similarity search
SELECT * FROM match_knowledge_embeddings(
  array_fill(0.1, ARRAY[1536])::vector,
  0.5,
  5
);
```

**Expected Output**: Returns the test embedding with similarity ~1.0

---

## Part 4: Test RLS Policies (45 min)

### 4.1 Create Test Users

**Via Supabase Studio**:
1. Go to Authentication > Users
2. Click "Add User"
3. Create 3 users:
   - novice@test.com (password: test123456)
   - awakening@test.com (password: test123456)
   - enlightenment@test.com (password: test123456)

**Via SQL** (alternative):
```sql
-- Note: This bypasses normal auth flow, for testing only
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
VALUES
  (gen_random_uuid(), 'novice@test.com', crypt('test123456', gen_salt('bf')), NOW()),
  (gen_random_uuid(), 'awakening@test.com', crypt('test123456', gen_salt('bf')), NOW()),
  (gen_random_uuid(), 'enlightenment@test.com', crypt('test123456', gen_salt('bf')), NOW());
```

**Save user IDs**:
```sql
SELECT id, email FROM auth.users WHERE email LIKE '%@test.com';
```

### 4.2 Update User Tiers

```sql
-- Update subscription tiers
UPDATE users SET subscription_tier = 'novice_path'
WHERE id = '<novice-user-id>';

UPDATE users SET subscription_tier = 'awakening_path'
WHERE id = '<awakening-user-id>';

UPDATE users SET subscription_tier = 'enlightenment_path'
WHERE id = '<enlightenment-user-id>';
```

### 4.3 Test User Isolation (journal_entries)

```sql
-- Insert journal entry for User A
SET request.jwt.claim.sub = '<user-a-id>';

INSERT INTO journal_entries (user_id, title, content)
VALUES ('<user-a-id>', 'User A Journal', 'This is User A''s entry');

-- Try to read as User A (should work)
SELECT * FROM journal_entries WHERE user_id = '<user-a-id>';

-- Try to read as User B (should return empty)
SET request.jwt.claim.sub = '<user-b-id>';
SELECT * FROM journal_entries WHERE user_id = '<user-a-id>';
-- Expected: 0 rows (RLS blocks)

-- Try to insert for User A while authenticated as User B (should fail)
INSERT INTO journal_entries (user_id, title, content)
VALUES ('<user-a-id>', 'Hacked', 'Malicious entry');
-- Expected: ERROR - RLS policy violation
```

### 4.4 Test Tier Gating (meditations)

```sql
-- All users can read meditations
SET request.jwt.claim.sub = '<any-user-id>';
SELECT id, title, tier FROM meditations;
-- Expected: Returns all meditations

-- But client-side should filter based on subscription_tier
-- (RLS allows read, app enforces tier limits)
```

### 4.5 Automated RLS Test Script

**Create** `scripts/test-rls-policies.sql`:

```sql
-- Save this file for future use
-- RLS Policy Automated Tests

-- Test 1: User isolation (journal_entries)
-- Expected: Users only see their own data

-- Test 2: Workbook progress isolation
-- Expected: Users only see/modify their own workbook

-- Test 3: Meditation public read
-- Expected: All authenticated users can read meditations

-- Test 4: Knowledge embeddings public read
-- Expected: All authenticated users can search embeddings

-- Test 5: Anonymous access blocked
-- Expected: Unauthenticated requests return empty results

-- Add more tests for all 27 policies...
```

---

## Part 5: Load Seed Data (30 min)

### 5.1 Load Meditation Sessions

```bash
# Run seed.sql
psql postgresql://postgres:postgres@localhost:54322/postgres \
  -f supabase/seed.sql

# Or via Studio SQL Editor
```

**Verify**:
```sql
SELECT COUNT(*) FROM meditations;
-- Expected: 12 (6 sessions × 2 narrators)

SELECT id, title, tier, narrator_gender FROM meditations;
```

### 5.2 Create Sample Workbook Data

```sql
-- Insert sample workbook progress for each test user
INSERT INTO workbook_progress (user_id, phase, data)
VALUES
  (
    '<novice-user-id>',
    1,
    '{"wheel_of_life": {"career": 7, "health": 6, "relationships": 8}, "completed": true}'::jsonb
  ),
  (
    '<awakening-user-id>',
    3,
    '{"goals": ["Manifest dream job", "Improve health"], "completed": false}'::jsonb
  ),
  (
    '<enlightenment-user-id>',
    5,
    '{"self_love_practices": ["Daily affirmations", "Meditation"], "completed": true}'::jsonb
  );
```

### 5.3 Create Sample Journal Entries

```sql
-- Insert journal entries for testing
INSERT INTO journal_entries (user_id, title, content, tags)
VALUES
  ('<novice-user-id>', 'Day 1 - New Beginning', 'Today I started my manifestation journey...', ARRAY['gratitude', 'goals']),
  ('<awakening-user-id>', 'Breakthrough Moment', 'I realized that my limiting beliefs were holding me back...', ARRAY['breakthrough', 'beliefs']),
  ('<enlightenment-user-id>', 'Gratitude Practice', 'I am grateful for my health, family, and opportunities...', ARRAY['gratitude', 'daily']);
```

### 5.4 Create Sample Meditation Sessions

```sql
-- Insert meditation session history
INSERT INTO meditation_sessions (user_id, meditation_id, completed, duration_seconds)
VALUES
  ('<novice-user-id>', (SELECT id FROM meditations LIMIT 1), true, 600),
  ('<awakening-user-id>', (SELECT id FROM meditations LIMIT 1), true, 900),
  ('<enlightenment-user-id>', (SELECT id FROM meditations LIMIT 1), true, 1200);
```

### 5.5 Verify Seed Data

```sql
-- Check meditation count
SELECT COUNT(*) FROM meditations;
-- Expected: 12

-- Check user count
SELECT COUNT(*) FROM users;
-- Expected: 3

-- Check workbook data
SELECT user_id, phase, data->>'completed' as completed
FROM workbook_progress;
-- Expected: 3 rows

-- Check journal entries
SELECT user_id, title FROM journal_entries;
-- Expected: 3 rows

-- Check meditation sessions
SELECT user_id, completed, duration_seconds FROM meditation_sessions;
-- Expected: 3 rows
```

---

## Part 6: Generate TypeScript Types (15 min)

### 6.1 Generate Database Types

```bash
# Generate TypeScript types from database schema
npx supabase gen types typescript --local > mobile/src/types/database.types.ts
```

### 6.2 Verify Types File

**Check** `mobile/src/types/database.types.ts`:

```typescript
// Should contain types like:
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          subscription_tier: string;
          // ...
        };
        Insert: {
          // ...
        };
        Update: {
          // ...
        };
      };
      // ... all other tables
    };
  };
}
```

---

## Part 7: Integration Testing (30 min)

### 7.1 Test Supabase Client Connection

**Create** `scripts/test-supabase-connection.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function testConnection() {
  console.log('Testing Supabase connection...');

  // Test 1: Query meditations
  const { data: meditations, error: meditationsError } = await supabase
    .from('meditations')
    .select('*')
    .limit(5);

  if (meditationsError) {
    console.error('❌ Meditations query failed:', meditationsError);
  } else {
    console.log('✅ Meditations query successful:', meditations?.length, 'rows');
  }

  // Test 2: Test RLS (should fail without auth)
  const { data: journals, error: journalsError } = await supabase
    .from('journal_entries')
    .select('*');

  if (journalsError) {
    console.log('✅ RLS working (anonymous access blocked)');
  } else {
    console.error('❌ RLS not working (anonymous can read journals)');
  }

  console.log('Connection test complete!');
}

testConnection();
```

**Run**:
```bash
npx ts-node scripts/test-supabase-connection.ts
```

---

## Checklist

### Part 1: Setup
- [ ] Supabase CLI installed
- [ ] Local Supabase started (or remote project created)
- [ ] API keys saved to `.env.local`

### Part 2: Migrations
- [ ] Initial schema migration executed
- [ ] Auth triggers migration executed
- [ ] 8 tables created and verified
- [ ] 27 RLS policies created and verified

### Part 3: pgvector
- [ ] pgvector extension enabled
- [ ] Similarity search function created
- [ ] Vector index created
- [ ] Test embedding inserted and searchable

### Part 4: RLS Testing
- [ ] 3 test users created (one per tier)
- [ ] User isolation tested (journal_entries)
- [ ] Workbook isolation tested
- [ ] Meditation public read tested
- [ ] Anonymous access blocked verified

### Part 5: Seed Data
- [ ] 12 meditation sessions loaded
- [ ] Sample workbook data inserted
- [ ] Sample journal entries inserted
- [ ] Sample meditation sessions inserted
- [ ] All seed data verified

### Part 6: TypeScript Types
- [ ] Database types generated
- [ ] Types file verified

### Part 7: Integration
- [ ] Supabase client connection tested
- [ ] Frontend can query database
- [ ] RLS working correctly

---

## Troubleshooting

### Issue: "supabase: command not found"

```bash
# Install globally
npm install -g supabase

# Or use npx
npx supabase --version
```

### Issue: "Port 54321 already in use"

```bash
# Stop existing Supabase
npx supabase stop

# Start fresh
npx supabase start
```

### Issue: "Migration failed"

```bash
# Reset database
npx supabase db reset

# Re-run migrations
npx supabase db push
```

### Issue: "RLS policies not working"

```sql
-- Verify RLS enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
-- All should show rowsecurity = true

-- Check policies exist
SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public';
-- Should be 27
```

---

## Next Steps

After completing this guide:

1. ✅ Backend infrastructure complete
2. ✅ Ready for frontend integration (Week 3)
3. ✅ All database features operational
4. ✅ RLS security verified

**Week 3**: Implement authentication UI (Apple Sign-In, email/password)
