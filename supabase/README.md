# Supabase Backend - Manifest the Unseen

This directory contains all Supabase backend configuration, database migrations, Edge Functions, and seed data for the Manifest the Unseen application.

---

## Directory Structure

```
supabase/
├── migrations/              # Database schema migrations (applied in order)
│   ├── 20250101000000_initial_schema.sql    # Initial tables, RLS, triggers
│   └── 20250102000000_auth_triggers.sql     # Auth triggers and helpers
├── functions/               # Supabase Edge Functions (Deno)
│   └── ai-chat/
│       └── index.ts         # AI monk chat with RAG
├── config.toml             # Local development configuration
├── seed.sql                # Initial data (meditations, test data)
└── README.md               # This file
```

---

## Quick Start

### 1. Prerequisites

- **Node.js** 18+ installed
- **Supabase CLI** installed: `npm install -g supabase`
- **Supabase Account**: Create at [supabase.com](https://supabase.com)
- **Docker** (optional, for local development)

### 2. Link to Remote Project

```bash
# Login to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref YOUR_PROJECT_ID
```

Find your Project ID in Supabase Dashboard → Settings → General.

### 3. Apply Migrations

Push all migrations to your remote Supabase project:

```bash
npx supabase db push
```

This creates all tables, RLS policies, triggers, and functions.

### 4. Seed Database (Optional)

Seed initial meditation data:

```bash
psql -h db.YOUR_PROJECT_ID.supabase.co -U postgres -d postgres -f supabase/seed.sql
# Enter database password when prompted
```

Or use Supabase Dashboard → SQL Editor → paste contents of `seed.sql` → Run.

### 5. Deploy Edge Functions

```bash
# Set environment secrets
npx supabase secrets set OPENAI_API_KEY=sk-your-openai-key
npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# Deploy AI chat function
npx supabase functions deploy ai-chat
```

---

## Local Development

### Start Local Supabase

```bash
npx supabase start
```

This starts Docker containers for:
- PostgreSQL (port 54322)
- Studio (port 54323) - Local Supabase Dashboard
- Auth server
- Realtime server
- Storage server
- Edge Functions

**Access Local Studio**: [http://localhost:54323](http://localhost:54323)

### Apply Migrations Locally

```bash
npx supabase db reset
```

This resets local database and applies all migrations + seed data.

### Test Edge Functions Locally

```bash
# Serve function locally
npx supabase functions serve ai-chat

# In another terminal, test with curl
curl -i --location --request POST 'http://localhost:54321/functions/v1/ai-chat' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"message":"What is manifestation?"}'
```

### Stop Local Supabase

```bash
npx supabase stop
```

---

## Database Schema

### Tables

| Table | Description | RLS Enabled |
|-------|-------------|-------------|
| `users` | User profiles (extends auth.users) | ✅ |
| `workbook_progress` | User progress through 10 phases | ✅ |
| `journal_entries` | Voice journal entries (transcribed text) | ✅ |
| `meditations` | Meditation library (public read) | Partial |
| `meditation_sessions` | User meditation practice tracking | ✅ |
| `ai_conversations` | AI monk chat history | ✅ |
| `vision_boards` | User vision boards | ✅ |
| `knowledge_embeddings` | AI knowledge base (pgvector) | ❌ (public) |

### Custom Types

```sql
subscription_tier      -- ENUM: 'novice', 'awakening', 'enlightenment'
subscription_status    -- ENUM: 'none', 'trialing', 'active', 'canceled', 'expired'
narrator_gender        -- ENUM: 'male', 'female'
```

### Key Functions

| Function | Purpose |
|----------|---------|
| `update_updated_at_column()` | Trigger to auto-update `updated_at` timestamps |
| `match_knowledge()` | Vector similarity search for RAG |
| `handle_new_user()` | Auto-create user profile on signup (7-day trial) |
| `is_trial_active()` | Check if user trial is active |
| `get_user_tier()` | Get effective subscription tier (trial = novice) |

### Indexes

- **Vector Index**: `idx_embeddings_vector` (ivfflat, cosine similarity)
- **Full-Text Search**: `idx_journal_search` (GIN on tsvector)
- **Foreign Keys**: All user-related tables indexed on `user_id`

---

## Migrations

### Creating a New Migration

```bash
npx supabase migration new migration_name
```

This creates a new file: `supabase/migrations/TIMESTAMP_migration_name.sql`

**Best Practices:**
1. Use descriptive names (e.g., `add_daily_reflections_table`)
2. Always test locally before pushing to production
3. Include rollback SQL in comments if complex
4. Use transactions for multi-step migrations
5. Never modify existing migrations (create new ones instead)

### Example Migration

```sql
-- Add column to users table
ALTER TABLE users ADD COLUMN timezone TEXT DEFAULT 'UTC';

-- Create index
CREATE INDEX idx_users_timezone ON users(timezone);

-- Update existing rows (if needed)
UPDATE users SET timezone = 'America/New_York' WHERE timezone IS NULL;
```

### Rolling Back (Local Only)

```bash
npx supabase db reset  # Resets to initial state and reapplies all migrations
```

**Note**: Production rollbacks must be done manually via new migration.

---

## Edge Functions

### AI Chat Function (`ai-chat`)

**Purpose**: Handles AI monk companion chat with RAG (Retrieval Augmented Generation).

**Flow:**
1. Receive user message
2. Generate embedding via OpenAI API
3. Search `knowledge_embeddings` for relevant context
4. Send context + message to Claude API
5. Return AI response
6. Save conversation to `ai_conversations`

**Environment Variables:**
- `OPENAI_API_KEY` - For embeddings
- `ANTHROPIC_API_KEY` - For Claude chat

**Usage from React Native:**
```typescript
const { data, error } = await supabase.functions.invoke('ai-chat', {
  body: {
    message: 'What is manifestation?',
    conversationId: 'uuid-of-existing-conversation', // optional
  },
});

console.log('AI Reply:', data.reply);
```

### Creating a New Edge Function

```bash
npx supabase functions new function-name
```

Edit `supabase/functions/function-name/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  // Your function logic here
  return new Response(JSON.stringify({ message: 'Hello!' }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

Deploy:
```bash
npx supabase functions deploy function-name
```

---

## Row Level Security (RLS)

All user-facing tables have RLS enabled to ensure data isolation.

### User Data Isolation

**Pattern**: Users can only access their own data.

```sql
CREATE POLICY "Users can view own data" ON table_name
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON table_name
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON table_name
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data" ON table_name
  FOR DELETE USING (auth.uid() = user_id);
```

### Public Read Tables

**Pattern**: Anyone can read, only admins can write.

```sql
CREATE POLICY "Anyone can read" ON meditations
  FOR SELECT USING (true);
```

### Testing RLS

```javascript
// Should return only current user's journals
const { data } = await supabase.from('journal_entries').select('*');

// Should fail (or return empty) - trying to access another user's data
const { data } = await supabase
  .from('journal_entries')
  .select('*')
  .eq('user_id', 'someone-elses-uuid');
```

---

## Storage Buckets

### `vision-boards` (Private)

- **Purpose**: User vision board images
- **Access**: Private (users can only access their own images)
- **File Path**: `{user_id}/{image_id}.jpg`
- **Max File Size**: 5 MB
- **Allowed Types**: `image/jpeg`, `image/png`, `image/webp`

**Upload from React Native:**
```typescript
const { data, error } = await supabase.storage
  .from('vision-boards')
  .upload(`${user.id}/image-${Date.now()}.jpg`, imageFile, {
    contentType: 'image/jpeg',
  });
```

### `meditations` (Public)

- **Purpose**: Meditation audio files
- **Access**: Public read
- **File Path**: `{meditation_id}/{narrator_gender}-narrator.mp3`
- **Max File Size**: 50 MB
- **Allowed Types**: `audio/mpeg`, `audio/mp4`, `audio/wav`

**Get Public URL:**
```typescript
const { data } = supabase.storage
  .from('meditations')
  .getPublicUrl('00000000-0000-0000-0000-000000000001/male-narrator.mp3');

console.log('Audio URL:', data.publicUrl);
```

---

## Testing

### Test Connection

Run the test script to verify Supabase setup:

```bash
node scripts/test-supabase-connection.js
```

This tests:
- ✅ Database connection
- ✅ Authentication (signup/login)
- ✅ RLS policies
- ✅ User profile creation
- ✅ Journal entry CRUD
- ✅ Data isolation

### Manual Testing in Supabase Dashboard

1. **SQL Editor**: Run custom queries
2. **Table Editor**: View and edit data
3. **Auth**: View users, trigger password resets
4. **Storage**: Upload/download files
5. **Database → Roles**: View RLS policies

---

## Common Commands

### Database

```bash
# Push migrations to remote
npx supabase db push

# Pull remote schema to local
npx supabase db pull

# Reset local database
npx supabase db reset

# Diff local vs. remote schema
npx supabase db diff

# Generate TypeScript types from schema
npx supabase gen types typescript --local > types/database.types.ts
```

### Edge Functions

```bash
# Serve locally
npx supabase functions serve function-name

# Deploy to production
npx supabase functions deploy function-name

# View logs
npx supabase functions logs function-name

# Delete function
npx supabase functions delete function-name
```

### Authentication

```bash
# List users
npx supabase db query "SELECT * FROM auth.users LIMIT 10;"

# Delete test user
npx supabase db query "DELETE FROM auth.users WHERE email = 'test@example.com';"
```

---

## Troubleshooting

### Issue: "relation does not exist"

**Cause**: Migrations not applied.

**Solution**:
```bash
npx supabase db reset   # Local
npx supabase db push    # Remote
```

### Issue: RLS blocks queries

**Cause**: User not authenticated or policy misconfigured.

**Solution**:
1. Check user is authenticated: `supabase.auth.getUser()`
2. Verify policy matches `auth.uid()` correctly
3. Test with `service_role` key (bypasses RLS) to verify query works

### Issue: Edge function timeout

**Cause**: Cold start or long-running operation.

**Solution**:
1. Optimize function code
2. Use streaming for AI responses
3. Monitor logs: `npx supabase functions logs ai-chat`

### Issue: pgvector search returns no results

**Cause**: No embeddings in database or threshold too high.

**Solution**:
1. Verify embeddings exist: `SELECT COUNT(*) FROM knowledge_embeddings;`
2. Lower `match_threshold` (e.g., 0.5 instead of 0.7)
3. Regenerate embeddings with correct model (text-embedding-3-small)

---

## Production Checklist

Before going to production:

- [ ] **Database**:
  - [ ] All migrations applied
  - [ ] RLS enabled on all user tables
  - [ ] Indexes created for performance
  - [ ] Backups configured (automatic in Supabase)

- [ ] **Authentication**:
  - [ ] Apple Sign-In configured and tested
  - [ ] Email/Password configured
  - [ ] Email templates customized
  - [ ] Custom SMTP configured (not Supabase default)

- [ ] **Storage**:
  - [ ] Buckets created with correct policies
  - [ ] File size limits configured
  - [ ] CDN enabled for public buckets

- [ ] **Edge Functions**:
  - [ ] All functions deployed
  - [ ] Environment secrets set
  - [ ] Error handling implemented
  - [ ] Logging configured

- [ ] **Security**:
  - [ ] API keys rotated (different from dev)
  - [ ] RLS policies audited
  - [ ] Service role key secured (never in client)

---

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/guides/cli)
- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [Deno Documentation](https://deno.land/manual) (for Edge Functions)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Last Updated**: November 17, 2025
**Maintained By**: Backend Specialist Team
