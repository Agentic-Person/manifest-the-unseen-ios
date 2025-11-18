# Backend Quick Start Guide

**Manifest the Unseen - Supabase Backend**

This guide gets you from zero to a working Supabase backend in 30 minutes.

---

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Supabase Account**: [Sign up free](https://supabase.com)
- [ ] **Node.js 18+**: Check with `node --version`
- [ ] **npm or yarn**: Check with `npm --version`
- [ ] **Git**: Check with `git --version`
- [ ] **Text Editor**: VS Code recommended
- [ ] **Password Manager**: For storing API keys securely

---

## 30-Minute Setup

### Step 1: Create Supabase Project (5 minutes)

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `manifest-the-unseen-dev`
   - **Database Password**: Generate strong password → save in password manager
   - **Region**: US East (N. Virginia)
   - **Plan**: Free
4. Click **"Create new project"** (wait ~2 minutes)
5. Once ready, go to **Settings** → **API**
6. Copy to password manager:
   - Project URL
   - `anon` public key
   - `service_role` secret key (NEVER commit to Git!)

### Step 2: Configure Environment (2 minutes)

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your values:
   ```bash
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Verify `.env` is in `.gitignore` ✅

### Step 3: Install Supabase CLI (3 minutes)

```bash
# Install globally
npm install -g supabase

# Verify installation
supabase --version

# Login
supabase login
```

Browser will open to authenticate. After success, you'll see:
```
Logged in to Supabase as your-email@example.com
```

### Step 4: Link to Your Project (2 minutes)

```bash
# Link to remote project
npx supabase link --project-ref YOUR_PROJECT_ID
```

**Find Project ID:**
- In Supabase Dashboard: **Settings** → **General** → **Reference ID**
- Or from URL: `https://[PROJECT_ID].supabase.co`

Enter your database password when prompted.

### Step 5: Apply Database Schema (3 minutes)

```bash
# Push all migrations to remote
npx supabase db push
```

This creates:
- All tables (users, journal_entries, meditations, etc.)
- RLS policies for security
- Triggers for auto-updating timestamps
- Functions for RAG vector search

**Verify in Dashboard:**
- Go to **Database** → **Tables**
- Should see 8 tables

### Step 6: Configure Authentication (10 minutes)

#### Enable Email/Password (2 minutes)

1. Dashboard → **Authentication** → **Providers**
2. Enable **Email**
3. Settings:
   - ✅ Confirm email
   - ✅ Secure email change
   - ✅ Secure password change

#### Enable Apple Sign-In (8 minutes)

**Prerequisites:**
- Apple Developer Account
- See [auth-providers-config.md](./auth-providers-config.md) for detailed steps

**Quick version:**
1. Apple Developer Console → Create Services ID
2. Create Sign in with Apple Key → Download `.p8` file
3. Supabase Dashboard → **Authentication** → **Providers** → **Apple**
4. Fill in:
   - Services ID
   - Team ID
   - Key ID
   - Private Key (paste `.p8` contents)
5. Copy redirect URL → Add to Apple Services ID

### Step 7: Seed Initial Data (2 minutes)

```bash
# Option A: Via SQL Editor in Dashboard
# Copy contents of supabase/seed.sql
# Paste in Dashboard → SQL Editor → Run

# Option B: Via psql (if installed)
psql -h db.YOUR_PROJECT_ID.supabase.co -U postgres -d postgres -f supabase/seed.sql
# Enter database password
```

This seeds:
- 12 meditation records (6 sessions × 2 narrators)

### Step 8: Test Connection (3 minutes)

```bash
# Install dependencies for test script
npm install @supabase/supabase-js dotenv

# Run test
node scripts/test-supabase-connection.js
```

**Expected output:**
```
✅ Database connection successful
✅ Auth signup successful
✅ Auth login successful
✅ User profile query successful (RLS working)
✅ Journal entry created
✅ RLS correctly blocks unauthorized access
✅ Meditations query successful

🎉 All tests passed! Supabase is ready for development.
```

---

## Post-Setup Tasks

### Create Storage Buckets

1. Dashboard → **Storage** → **New Bucket**
2. Create:
   - **vision-boards** (private, 5MB limit)
   - **meditations** (public, 50MB limit)

### Deploy Edge Functions (Optional)

```bash
# Set API keys
npx supabase secrets set OPENAI_API_KEY=sk-your-key
npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-your-key

# Deploy AI chat function
npx supabase functions deploy ai-chat
```

---

## Daily Development Workflow

### Starting Work

```bash
# Option A: Use remote Supabase (default)
# Just start coding - no setup needed!

# Option B: Use local Supabase (offline development)
npx supabase start
# Access local dashboard: http://localhost:54323
```

### Making Schema Changes

```bash
# 1. Create migration
npx supabase migration new add_feature_name

# 2. Edit migration file
# supabase/migrations/TIMESTAMP_add_feature_name.sql

# 3. Test locally
npx supabase db reset

# 4. Push to remote
npx supabase db push
```

### Testing Changes

```bash
# Run connection test
node scripts/test-supabase-connection.js

# Or test specific queries in SQL Editor
# Dashboard → SQL Editor
```

### Ending Work

```bash
# If using local Supabase
npx supabase stop
```

---

## Common Tasks

### View Users

```bash
# Via dashboard
# Authentication → Users

# Via SQL
npx supabase db query "SELECT id, email, created_at FROM auth.users LIMIT 10;"
```

### View Logs

```bash
# Edge Function logs
npx supabase functions logs ai-chat

# Database logs
# Dashboard → Database → Logs
```

### Generate TypeScript Types

```bash
# Generate types from database schema
npx supabase gen types typescript --local > types/supabase.types.ts
```

### Backup Database

```bash
# Via dashboard: Database → Backups → Download
# Automatic daily backups on paid plans
```

---

## Troubleshooting

### "relation does not exist"

**Fix:**
```bash
npx supabase db push
```

### "Invalid JWT" / "Auth session missing"

**Fix:**
1. Check `.env` has correct `SUPABASE_URL` and `SUPABASE_ANON_KEY`
2. Ensure `AsyncStorage` is configured in React Native app
3. Call `supabase.auth.getSession()` on app launch

### "Row Level Security" blocks queries

**Fix:**
1. Verify user is authenticated
2. Check RLS policy: Dashboard → Authentication → Policies
3. Test with `service_role` key (bypasses RLS) to verify query works

### Edge Function timeout

**Fix:**
1. Optimize function code
2. Increase timeout in function config
3. Check logs: `npx supabase functions logs function-name`

---

## Next Steps

Now that Supabase is set up:

1. ✅ **Backend Ready**: Database, auth, storage configured
2. ⏭️ **Next**: Set up React Native project
3. ⏭️ **Then**: Implement authentication UI
4. ⏭️ **Then**: Build core features

**Proceed to:**
- [TASK-003: React Native Project Initialization](../agent-orchestration/tasks/active/TASK-2025-11-003.md)
- [Supabase Setup Guide](./supabase-setup-guide.md) for advanced configuration
- [Auth Providers Config](./auth-providers-config.md) for detailed auth setup

---

## Resources

**Official Documentation:**
- [Supabase Docs](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/guides/cli)
- [React Native Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/react-native)

**Community:**
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub Discussions](https://github.com/supabase/supabase/discussions)

**Internal:**
- [TDD Section 3: Database Schema](./manifest-the-unseen-tdd.md#3-data-architecture)
- [TDD Section 6: Authentication](./manifest-the-unseen-tdd.md)
- [Supabase Directory README](../supabase/README.md)

---

**Need Help?**
- Check [Troubleshooting](#troubleshooting) section above
- Review [supabase-setup-guide.md](./supabase-setup-guide.md) for detailed steps
- Join Supabase Discord for community support

---

**Last Updated**: November 17, 2025
**Estimated Setup Time**: 30 minutes
**Difficulty**: Beginner-friendly
