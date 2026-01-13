# Authentication System

Complete authentication system for the Manifest the Unseen web workbook, built with Supabase Auth and Next.js 14.

## Overview

**Architecture:**
- Email/password authentication via Supabase
- Protected routes via Next.js middleware
- Subscription-gated access to workbook
- Real-time subscription status sync

**Flow:**
1. User signs up/logs in with email + password
2. Middleware checks authentication + subscription status
3. Only users with `subscription_status = 'active'` can access `/workbook/*`
4. Subscription synced from mobile app via RevenueCat webhook

---

## Files Structure

```
web/
├── app/
│   └── auth/
│       ├── login/page.tsx           # Login form
│       ├── signup/page.tsx          # Signup form
│       └── callback/route.ts        # OAuth callback handler
├── hooks/
│   ├── useAuth.ts                   # Auth state & methods
│   └── useSubscription.ts           # Subscription state
├── middleware.ts                    # Route protection
└── lib/
    └── supabase.ts                  # Supabase client
```

---

## Components

### Login Page (`/auth/login`)

Email + password login form with validation and error handling.

**Features:**
- Email format validation
- Password required field
- Loading states
- Error display
- Redirect to workbook on success
- Link to signup page

**Usage:**
```tsx
// Users access at: /auth/login
// After successful login, redirects to: /workbook
```

**Validation:**
- Email must be valid format
- Both fields required
- Displays Supabase auth errors

---

### Signup Page (`/auth/signup`)

Account creation with email, password, and password confirmation.

**Features:**
- Email format validation
- Password length check (min 6 chars)
- Password confirmation match
- Loading states
- Error display
- Link to login page

**Usage:**
```tsx
// Users access at: /auth/signup
// After successful signup, redirects to: /workbook
```

**Validation:**
- Email must be valid format
- Password min 6 characters
- Passwords must match
- All fields required

---

### Auth Callback (`/auth/callback`)

OAuth callback handler for Supabase redirects.

**When used:**
- Email confirmation links
- OAuth provider redirects (future)
- Password reset links (future)

**Flow:**
1. Supabase redirects to `/auth/callback?code=xxx`
2. Handler exchanges code for session
3. Redirects to `/workbook` (or custom `?next=` param)
4. On error, redirects to `/auth/login?error=xxx`

---

## Hooks

### useAuth()

Manages authentication state and provides auth methods.

**Returns:**
```ts
{
  user: User | null              // Current user
  session: Session | null        // Current session
  loading: boolean               // Initial auth check
  signIn: (email, password)      // Sign in method
  signUp: (email, password)      // Sign up method
  signOut: ()                    // Sign out method
}
```

**Usage:**
```tsx
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { user, loading, signIn, signOut } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <LoginForm onSubmit={signIn} />

  return (
    <>
      <p>Welcome, {user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </>
  )
}
```

**Features:**
- Auto-syncs with Supabase auth state
- Handles sign in/up/out
- Persists session in localStorage
- Automatically refreshes tokens

---

### useSubscription()

Checks user's subscription status from the `users` table.

**Returns:**
```ts
{
  isSubscribed: boolean          // status === 'active'
  tier: SubscriptionTier | null  // 'novice' | 'awakening' | 'enlightenment'
  status: SubscriptionStatus | null  // 'active' | 'canceled' | etc.
  expiresAt: Date | null         // Subscription expiry date
  loading: boolean               // Fetching subscription
  error: Error | null            // Fetch error
  refresh: () => Promise<void>   // Manual refresh
}
```

**Usage:**
```tsx
import { useSubscription } from '@/hooks/useSubscription'

function WorkbookPage() {
  const { isSubscribed, tier, loading } = useSubscription()

  if (loading) return <div>Loading...</div>
  if (!isSubscribed) return <div>Subscribe to access</div>

  return <div>Welcome! You have {tier} tier access</div>
}
```

**Features:**
- Fetches subscription from `users` table
- Real-time updates via Supabase subscriptions
- Caches result to minimize queries
- Auto-refreshes when auth changes

---

## Middleware (`middleware.ts`)

Protects `/workbook/*` routes with authentication + subscription checks.

**Protection Flow:**
```
Request to /workbook/*
    ↓
Check 1: Is user authenticated?
    ↓ NO → Redirect to /auth/login
    ↓ YES
Check 2: Is subscription_status = 'active'?
    ↓ NO → Redirect to / (landing page)
    ↓ YES
    ✓ Allow access
```

**Features:**
- Runs on Edge runtime (fast)
- Reads session from cookies
- Queries `users` table for subscription
- Handles errors gracefully
- Preserves redirect URL

**Protected Routes:**
- `/workbook` - Workbook dashboard
- `/workbook/phase/*` - All phase pages
- `/workbook/progress` - Progress page

---

## Environment Variables

Required in `.env.local`:

```env
# Supabase (public, safe for browser)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Service role key (server-side only)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Important:**
- `NEXT_PUBLIC_*` variables are exposed to the browser
- Service role key is for server-side operations only (webhooks, admin)
- Never commit `.env.local` to git

---

## Database Schema

### users table

Authentication and subscription data:

```sql
users (
  id UUID PRIMARY KEY,              -- Matches auth.users.id
  email TEXT NOT NULL,
  subscription_tier TEXT,           -- 'novice' | 'awakening' | 'enlightenment'
  subscription_status TEXT,         -- 'active' | 'canceled' | 'expired' | 'billing_issue'
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

**subscription_status values:**
- `active` - User has valid subscription (allows access)
- `canceled` - Subscription canceled but still valid until expiry
- `expired` - Subscription expired
- `billing_issue` - Payment failed, needs attention
- `null` - No subscription (free tier or never subscribed)

**How it's updated:**
- RevenueCat webhook updates these fields when subscription changes
- See `web/app/api/webhooks/revenuecat/route.ts` (to be built)

---

## Security

### Row Level Security (RLS)

The `users` table has RLS policies to ensure data protection:

**Policy: Users can read their own data**
```sql
CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (auth.uid() = id);
```

**Policy: Only service role can update**
```sql
-- No public update policy
-- Only service role (webhook) can update subscription fields
```

### Authentication Security

- Passwords hashed by Supabase (bcrypt)
- Sessions stored securely with httpOnly cookies
- CSRF protection via Supabase
- Email confirmation can be enabled in Supabase dashboard
- Rate limiting on auth endpoints (Supabase built-in)

---

## Testing Auth Flow

### Manual Testing Steps

1. **Start dev server:**
   ```bash
   cd web
   npm run dev
   ```

2. **Test signup:**
   - Navigate to `http://localhost:3000/auth/signup`
   - Enter email + password
   - Should redirect to `/workbook`
   - Check browser cookies for session

3. **Test login:**
   - Sign out
   - Navigate to `/auth/login`
   - Enter credentials
   - Should redirect to `/workbook`

4. **Test middleware protection:**
   - Sign out
   - Try to access `/workbook` directly
   - Should redirect to `/auth/login?redirect=/workbook`

5. **Test subscription check:**
   - Sign in with account
   - Manually update `users.subscription_status` in Supabase to `null`
   - Try to access `/workbook`
   - Should redirect to `/` (landing page)

### Database Setup

Before testing, ensure the `users` table exists:

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  subscription_tier TEXT CHECK (subscription_tier IN ('novice', 'awakening', 'enlightenment')),
  subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'expired', 'billing_issue')),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (auth.uid() = id);

-- Create user record on signup (trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Common Issues & Solutions

### Issue: "Missing Supabase environment variables"

**Solution:** Ensure `.env.local` exists with correct variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

### Issue: Redirect loop after login

**Cause:** Middleware can't read session from cookies.

**Solution:** Check that Supabase is storing sessions correctly:
```ts
// In lib/supabase.ts
export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,  // Must be true
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
```

### Issue: User redirected to landing page despite active subscription

**Cause:** `users` table missing or subscription_status not set.

**Solution:**
1. Check if user exists in `users` table
2. Manually set `subscription_status = 'active'` for testing
3. Verify middleware is querying the correct table

### Issue: TypeScript errors with Supabase types

**Solution:** Generate types from your database:
```bash
npx supabase gen types typescript --project-id xxx > types/database.types.ts
```

---

## Next Steps

1. **RevenueCat Webhook** - Build webhook handler to sync subscriptions
2. **Password Reset** - Add forgot password flow
3. **Email Verification** - Enable in Supabase dashboard
4. **Session Management** - Add token refresh logic
5. **Error Pages** - Custom 401/403 pages

---

## Related Documentation

- **Supabase Auth Docs**: https://supabase.com/docs/guides/auth
- **Next.js Middleware**: https://nextjs.org/docs/app/building-your-application/routing/middleware
- **PRD**: `docs/planning/web-workbook-prd.md`
