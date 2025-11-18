# Supabase Setup Guide - Manifest the Unseen

**Version:** 1.0
**Last Updated:** November 17, 2025
**For:** Backend Specialist & Full Stack Developers

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Create Supabase Project](#step-1-create-supabase-project)
4. [Step 2: Configure Authentication Providers](#step-2-configure-authentication-providers)
5. [Step 3: Install Supabase CLI](#step-3-install-supabase-cli)
6. [Step 4: Initialize Local Development](#step-4-initialize-local-development)
7. [Step 5: Run Database Migrations](#step-5-run-database-migrations)
8. [Step 6: Test Connection](#step-6-test-connection)
9. [Step 7: Configure Storage Buckets](#step-7-configure-storage-buckets)
10. [Step 8: Set Up Edge Functions](#step-8-set-up-edge-functions)
11. [Security Best Practices](#security-best-practices)
12. [Troubleshooting](#troubleshooting)

---

## Overview

This guide walks you through setting up Supabase as the backend for Manifest the Unseen. Supabase provides:

- **PostgreSQL Database** with pgvector extension for AI embeddings
- **Authentication** (Apple Sign-In, email/password)
- **Real-time Subscriptions** for data sync
- **Storage** for vision board images and meditation audio
- **Edge Functions** for AI chat with RAG
- **Row Level Security (RLS)** for data protection

**Architecture:**
- React Native mobile app → Supabase JS Client → Supabase Backend
- AI chat → Supabase Edge Functions → Claude API + pgvector RAG
- Voice transcription → On-device Whisper → Supabase (text only)

---

## Prerequisites

Before starting, ensure you have:

- [ ] **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
- [ ] **Node.js**: v18+ installed (`node --version`)
- [ ] **npm or yarn**: Latest version
- [ ] **Git**: For version control
- [ ] **Apple Developer Account**: For Apple Sign-In configuration
- [ ] **Password Manager**: 1Password, LastPass, or similar (for storing keys)

---

## Step 1: Create Supabase Project

### 1.1 Create New Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in project details:
   - **Organization**: Create or select existing
   - **Name**: `manifest-the-unseen` (or `manifest-the-unseen-dev` for development)
   - **Database Password**: Generate a strong password (save in password manager)
   - **Region**: `US East (N. Virginia)` for lowest latency (or closest to target users)
   - **Pricing Plan**: Start with **Free** tier (500MB DB, 1GB storage, 2GB bandwidth)

4. Click **"Create new project"** (takes 1-2 minutes to provision)

### 1.2 Retrieve API Keys

Once the project is ready:

1. Go to **Settings** → **API**
2. Copy the following values to your password manager:
   - **Project URL**: `https://[PROJECT_ID].supabase.co`
   - **anon public key**: Safe to use in React Native app
   - **service_role key**: **CRITICAL** - Never expose in client-side code!

3. Create a `.env` file in your project root (copy from `.env.example`):

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**: Add `.env` to `.gitignore` if not already present!

---

## Step 2: Configure Authentication Providers

### 2.1 Enable Email/Password Authentication

1. Go to **Authentication** → **Providers**
2. Find **Email** provider
3. Enable the toggle
4. **Configuration**:
   - **Confirm email**: ✅ Enabled (recommended for production)
   - **Secure email change**: ✅ Enabled
   - **Secure password change**: ✅ Enabled

### 2.2 Configure Apple Sign-In

Apple Sign-In is the **primary authentication method** for iOS.

#### Prerequisites from Apple Developer Console:

1. **Services ID** (also called "Identifier"):
   - Go to [Apple Developer Console](https://developer.apple.com/account/resources/identifiers)
   - Create a **Services ID** (e.g., `com.yourcompany.manifesttheunseen.services`)
   - Enable **Sign in with Apple**
   - Configure **Return URLs** (we'll add this after getting Supabase redirect URL)

2. **Key for Apple Sign-In**:
   - Go to **Certificates, Identifiers & Profiles** → **Keys**
   - Create a new key, enable **Sign in with Apple**
   - Download the `.p8` key file (you can only download once!)
   - Note the **Key ID**

#### Supabase Configuration:

1. In Supabase Dashboard: **Authentication** → **Providers**
2. Find **Apple** and click **"Enable"**
3. Fill in the form:
   - **Services ID**: `com.yourcompany.manifesttheunseen.services`
   - **Team ID**: Your Apple Team ID (found in Apple Developer Console)
   - **Key ID**: The Key ID from your `.p8` file
   - **Private Key**: Paste the entire contents of your `.p8` file
   - **Authorized Client IDs**: Add your iOS bundle ID (e.g., `com.yourcompany.manifesttheunseen`)

4. **Copy the Redirect URL** shown in Supabase (e.g., `https://[PROJECT_ID].supabase.co/auth/v1/callback`)

5. **Go back to Apple Developer Console**:
   - Edit your Services ID
   - Under **Sign in with Apple** → **Configure**
   - Add the Supabase redirect URL to **Return URLs**
   - Save

6. Test Apple Sign-In:
   - Use Supabase's built-in auth UI tester
   - Or wait until React Native app is configured

### 2.3 Email Templates (Optional but Recommended)

Customize email templates for better branding:

1. Go to **Authentication** → **Email Templates**
2. Customize:
   - **Confirm signup**: Welcome message with app branding
   - **Reset password**: Password reset instructions
   - **Magic Link**: For passwordless login (optional)

**Template Variables:**
- `{{ .ConfirmationURL }}` - Email confirmation link
- `{{ .Token }}` - 6-digit OTP code
- `{{ .SiteURL }}` - Your app's URL

### 2.4 URL Configuration

1. Go to **Authentication** → **URL Configuration**
2. **Site URL**: `https://yourapp.com` (or app deep link for mobile)
3. **Redirect URLs**: Add allowed redirect URLs:
   - `manifesttheunseen://auth/callback` (iOS deep link)
   - `http://localhost:3000` (for web development)
   - Production URLs when deployed

---

## Step 3: Install Supabase CLI

The Supabase CLI enables local development and database migrations.

### 3.1 Install via npm

```bash
npm install -g supabase
```

**Verify installation:**

```bash
supabase --version
# Should output: 1.x.x or higher
```

### 3.2 Login to Supabase

```bash
supabase login
```

This opens a browser to authenticate. After successful login, you'll see:

```
Logged in to Supabase as [your-email]
```

---

## Step 4: Initialize Local Development

### 4.1 Link to Remote Project

Navigate to your project directory and link to your Supabase project:

```bash
cd manifest-the-unseen-ios
npx supabase link --project-ref [YOUR_PROJECT_ID]
```

**Find Project ID:**
- In Supabase Dashboard: **Settings** → **General**
- Or extract from Project URL: `https://[PROJECT_ID].supabase.co`

You'll be prompted for your database password (the one you set during project creation).

### 4.2 Start Local Supabase (Optional)

For local development without internet dependency:

```bash
npx supabase start
```

This starts Docker containers for:
- PostgreSQL (port 54322)
- Studio (port 54323) - local Supabase Dashboard
- Auth server
- Realtime server
- Storage server

**Access Local Studio:** `http://localhost:54323`

**Stop local instance:**

```bash
npx supabase stop
```

---

## Step 5: Run Database Migrations

### 5.1 Push Initial Schema to Remote

```bash
npx supabase db push
```

This runs the migration file `supabase/migrations/20250101000000_initial_schema.sql` on your remote Supabase project.

**Expected output:**

```
Applying migration 20250101000000_initial_schema.sql...
✓ Migration applied successfully
```

### 5.2 Verify Tables Created

1. Go to Supabase Dashboard → **Database** → **Tables**
2. You should see all tables:
   - `users`
   - `workbook_progress`
   - `journal_entries`
   - `meditations`
   - `meditation_sessions`
   - `ai_conversations`
   - `vision_boards`
   - `knowledge_embeddings`

3. Check **Database** → **Extensions**:
   - `uuid-ossp` ✅
   - `vector` ✅

### 5.3 Verify RLS Policies

1. Go to **Authentication** → **Policies**
2. Verify each table has RLS enabled and correct policies:
   - `users`: ✅ 2 policies (SELECT, UPDATE)
   - `workbook_progress`: ✅ 4 policies (SELECT, INSERT, UPDATE, DELETE)
   - `journal_entries`: ✅ 4 policies
   - `meditation_sessions`: ✅ 4 policies
   - `ai_conversations`: ✅ 4 policies
   - `vision_boards`: ✅ 4 policies
   - `meditations`: ✅ 1 policy (public SELECT)

**If policies are missing**, check migration logs for errors.

---

## Step 6: Test Connection

### 6.1 Install Supabase JS Client

In your project (mobile or a test script):

```bash
npm install @supabase/supabase-js
```

### 6.2 Create Test Script

Create `scripts/test-supabase.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing Supabase connection...\n');

  // Test 1: Anonymous connection
  console.log('✓ Supabase client initialized');
  console.log(`  URL: ${supabaseUrl}\n`);

  // Test 2: Database query (should fail due to RLS)
  try {
    const { data, error } = await supabase.from('meditations').select('*').limit(1);
    if (error) throw error;
    console.log('✓ Database connection successful');
    console.log(`  Meditations table accessible (${data.length} rows)\n`);
  } catch (error) {
    console.error('✗ Database query failed:', error.message, '\n');
  }

  // Test 3: Auth signup
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'test-password-123',
    });
    if (error) throw error;
    console.log('✓ Auth signup successful');
    console.log(`  User ID: ${data.user?.id}\n`);
  } catch (error) {
    console.error('✗ Auth signup failed:', error.message, '\n');
  }

  // Test 4: Auth login
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'test-password-123',
    });
    if (error) throw error;
    console.log('✓ Auth login successful');
    console.log(`  User: ${data.user?.email}\n`);
  } catch (error) {
    console.error('✗ Auth login failed:', error.message, '\n');
  }

  console.log('Connection test complete!');
}

testConnection();
```

### 6.3 Run Test

```bash
node scripts/test-supabase.js
```

**Expected output:**

```
Testing Supabase connection...

✓ Supabase client initialized
  URL: https://your-project-id.supabase.co

✓ Database connection successful
  Meditations table accessible (0 rows)

✓ Auth signup successful
  User ID: 123e4567-e89b-12d3-a456-426614174000

✓ Auth login successful
  User: test@example.com

Connection test complete!
```

---

## Step 7: Configure Storage Buckets

Supabase Storage is used for vision board images and meditation audio files.

### 7.1 Create Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. Create two buckets:

**Bucket 1: `vision-boards`**
- **Public**: ❌ Private (users can only access their own images)
- **File size limit**: 5 MB (recommended)
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`

**Bucket 2: `meditations`**
- **Public**: ✅ Public (all users can read meditation audio)
- **File size limit**: 50 MB (for long meditation sessions)
- **Allowed MIME types**: `audio/mpeg`, `audio/mp4`, `audio/wav`

### 7.2 Set Storage Policies

**Vision Boards Bucket (`vision-boards`):**

```sql
-- Allow users to upload their own images
CREATE POLICY "Users can upload own vision board images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'vision-boards' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to read their own images
CREATE POLICY "Users can read own vision board images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'vision-boards' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own images
CREATE POLICY "Users can delete own vision board images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'vision-boards' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Meditations Bucket (`meditations`):**

```sql
-- Anyone can read meditation audio files
CREATE POLICY "Anyone can read meditation audio"
ON storage.objects FOR SELECT
USING (bucket_id = 'meditations');
```

**Apply policies:**
1. Go to **Storage** → **Policies**
2. Select bucket
3. Click **"New Policy"**
4. Paste SQL above

---

## Step 8: Set Up Edge Functions

Supabase Edge Functions are used for AI chat with RAG.

### 8.1 Create Edge Function Directory Structure

```bash
mkdir -p supabase/functions/ai-chat
```

### 8.2 Create AI Chat Function

Create `supabase/functions/ai-chat/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, conversationId } = await req.json();

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get user from JWT
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // TODO: Implement RAG + Claude API call
    // 1. Generate embedding for user message
    // 2. Query knowledge_embeddings for context
    // 3. Call Claude API with context
    // 4. Save conversation

    return new Response(
      JSON.stringify({ reply: 'AI chat coming soon!' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### 8.3 Deploy Edge Function

```bash
npx supabase functions deploy ai-chat --no-verify-jwt
```

### 8.4 Set Environment Variables for Functions

```bash
npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-your-key
npx supabase secrets set OPENAI_API_KEY=sk-your-key
```

---

## Security Best Practices

### Database Security

1. **Always enable RLS** on tables with user data
2. **Never use `service_role` key** in client-side code
3. **Use prepared statements** to prevent SQL injection
4. **Regularly audit RLS policies** in Supabase Dashboard

### API Key Management

1. **Store keys in `.env`** file (never commit to Git)
2. **Use different keys** for dev/staging/production
3. **Rotate keys** every 90 days
4. **Use password manager** (1Password, LastPass)
5. **Limit API key permissions** where possible

### Authentication

1. **Enforce email verification** in production
2. **Enable MFA** for admin accounts
3. **Use JWT expiration** (default: 1 hour, refresh: 30 days)
4. **Implement rate limiting** for auth endpoints

### Data Encryption

1. **Encrypt sensitive data** before storing (journal entries)
2. **Use HTTPS** for all API calls
3. **Enable SSL** for PostgreSQL connections
4. **Store encryption keys** in secure key management system

---

## Troubleshooting

### Issue: "relation does not exist" error

**Cause:** Migrations haven't run successfully.

**Solution:**
```bash
npx supabase db reset   # Resets local database
npx supabase db push    # Pushes migrations to remote
```

### Issue: RLS prevents data access

**Cause:** Policies not configured correctly or user not authenticated.

**Solution:**
1. Check user is authenticated: `supabase.auth.getUser()`
2. Verify RLS policy matches user's `auth.uid()`
3. Test with `service_role` key temporarily (admin access)

### Issue: Apple Sign-In not working

**Cause:** Redirect URLs misconfigured.

**Solution:**
1. Verify redirect URL in Apple Developer Console matches Supabase
2. Check Services ID is enabled for Sign in with Apple
3. Ensure `.p8` key is correct and Key ID matches
4. Test with Supabase's auth tester first

### Issue: Vector search (pgvector) failing

**Cause:** Extension not enabled.

**Solution:**
```sql
CREATE EXTENSION IF NOT EXISTS "vector";
```

Or in Supabase Dashboard: **Database** → **Extensions** → Enable `vector`.

### Issue: Edge Functions timing out

**Cause:** Cold starts or long-running operations.

**Solution:**
1. Optimize function code
2. Use streaming responses for AI chat
3. Implement timeout handling
4. Monitor function logs: `npx supabase functions logs ai-chat`

### Issue: Storage upload failing

**Cause:** Bucket policies or file size limits.

**Solution:**
1. Check bucket exists
2. Verify RLS policies on `storage.objects`
3. Check file size vs. bucket limit
4. Ensure correct MIME type

---

## Next Steps

After completing this setup:

1. ✅ Supabase project created and configured
2. ✅ Authentication providers enabled (Apple + Email)
3. ✅ Database schema migrated with RLS
4. ✅ Storage buckets created
5. ✅ Edge Functions deployed (skeleton)

**Proceed to:**
- **TASK-003**: React Native Project Initialization
- **TASK-005**: Core Dependencies Installation (including `@supabase/supabase-js`)
- **TASK-006**: Authentication Flow Implementation

**References:**
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/guides/cli)
- [pgvector Guide](https://github.com/pgvector/pgvector)
- [Apple Sign-In Setup](https://supabase.com/docs/guides/auth/social-login/auth-apple)

---

**Document Version:** 1.0
**Last Updated:** November 17, 2025
**Maintained By:** Backend Specialist Team
