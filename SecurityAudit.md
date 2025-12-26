# Security Audit - Manifest the Unseen iOS

**Audit Date:** December 25, 2025
**Last Updated:** December 25, 2025
**Status:** IN PROGRESS

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Findings Overview](#findings-overview)
3. [Critical Findings (Detailed)](#critical-findings-detailed)
4. [High Severity Findings](#high-severity-findings)
5. [Medium Severity Findings](#medium-severity-findings)
6. [Low Severity Findings](#low-severity-findings)
7. [Remediation Plan](#remediation-plan)
8. [Implementation Log](#implementation-log)
9. [Rollback Procedures](#rollback-procedures)
10. [Verification Checklist](#verification-checklist)

---

## Executive Summary

| Severity | Count | Fixed | Remaining |
|----------|-------|-------|-----------|
| CRITICAL | 5 | 4 | 1 (C1: key rotation - manual) |
| HIGH | 6 | 2 | 4 |
| MEDIUM | 11 | 0 | 11 |
| LOW | 3 | 0 | 3 |

**Overall Risk Level:** CRITICAL
**Recommendation:** Block production deployments until Critical and High issues resolved.

---

## Findings Overview

### Quick Reference Table

| ID | Severity | Issue | File(s) | Status |
|----|----------|-------|---------|--------|
| C1 | CRITICAL | Exposed API keys in version control | `.env.local`, `mobile/.env` | PENDING |
| C2 | CRITICAL | Hardcoded dev credentials | `authStore.ts:96-97` | **FIXED** |
| C3 | CRITICAL | Authentication bypass flag | `eas.json`, `authStore.ts:67` | **FIXED** |
| C4 | CRITICAL | Service role key in Edge Functions | `delete-account/`, `validate-promo/` | **FIXED** |
| C5 | CRITICAL | Weak account deletion verification | `delete-account/index.ts:99-114` | **PARTIAL** |
| H1 | HIGH | Missing RLS policies on knowledge_embeddings | `security_fixes.sql:19-41` | **FIXED** |
| H2 | HIGH | Unverified conversation ownership | `guru-analysis/index.ts:1405-1418` | PENDING |
| H3 | HIGH | Sensitive data in console logs | Multiple services | PENDING |
| H4 | HIGH | Overly permissive CORS (*) | All Edge Functions | **FIXED** |
| H5 | HIGH | No rate limiting on AI endpoints | `ai-chat/`, `guru-analysis/` | PENDING |
| H6 | HIGH | Missing journal entry encryption | `initial_schema.sql:90-99` | PENDING |
| M1 | MEDIUM | Insecure web storage (localStorage) | `supabase.ts:26-48` | PENDING |
| M2 | MEDIUM | AsyncStorage not encrypted | Multiple stores | PENDING |
| M3 | MEDIUM | Debug logging in production | `supabase.ts:20-23` | PENDING |
| M4 | MEDIUM | Metro config preserves class names | `metro.config.js:30-36` | PENDING |
| M5 | MEDIUM | Source maps in production | node_modules | PENDING |
| M6 | MEDIUM | Inconsistent dependency pinning | `package.json` | PENDING |
| M7 | MEDIUM | No jailbreak/root detection | App-wide | PENDING |
| M8 | MEDIUM | No certificate pinning | API clients | PENDING |
| M9 | MEDIUM | Incomplete .gitignore | `.gitignore` | PENDING |
| M10 | MEDIUM | No audit logging | Edge Functions | PENDING |
| M11 | MEDIUM | Input validation gaps | `validate-promo/index.ts:83` | PENDING |
| L1 | LOW | No promo code rate limiting | `validate-promo/index.ts` | PENDING |
| L2 | LOW | Sale info hardcoded | `eas.json:40-42` | PENDING |
| L3 | LOW | Missing App Transport Security | `app.json` | PENDING |

---

## Critical Findings (Detailed)

### C1: Exposed API Keys in Version Control

**Severity:** CRITICAL
**Status:** PENDING
**Files Affected:**
- `.env.local` (lines 14-46)
- `mobile/.env` (lines 7-8, 25, 35, 38)
- `eas.json` (lines 35-36, 52-54)
- `.mcp.json` (line 7)

**Exposed Secrets:**
| Secret | Location | Risk |
|--------|----------|------|
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local:16` | Bypasses ALL RLS - full DB access |
| `ANTHROPIC_API_KEY` | `.env.local:36`, `mobile/.env:38` | Unlimited Claude API at your cost |
| `OPENAI_API_KEY` | `.env.local:45`, `mobile/.env:35` | Unlimited OpenAI at your cost |
| `SUPABASE_ACCESS_TOKEN` | `.mcp.json:7` | Management API - can modify schema |
| `REVENUECAT_IOS_KEY` | `eas.json:52` | Subscription data access |

**Impact:**
- Complete database compromise
- Unlimited AI API usage billed to you
- User data theft (journals, personal info)
- Financial loss from API abuse

**Remediation Steps:**
1. [ ] Rotate Supabase keys in dashboard (supabase.com → Project → Settings → API)
2. [ ] Rotate Anthropic key (console.anthropic.com → API Keys)
3. [ ] Rotate OpenAI key (platform.openai.com → API Keys)
4. [ ] Rotate RevenueCat key (app.revenuecat.com → Project → API Keys)
5. [ ] Clean git history (see [Rollback Procedures](#cleaning-git-history))
6. [ ] Update secrets in Supabase Edge Function environment
7. [ ] Update EAS secrets via `eas secret:push`

**If Something Breaks After Fix:**
- App can't connect to Supabase → Check `EXPO_PUBLIC_SUPABASE_ANON_KEY` in EAS secrets
- Edge Functions fail → Check `SUPABASE_SERVICE_ROLE_KEY` in Supabase Function secrets
- AI chat not working → Check `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` in Function secrets
- Subscriptions broken → Check RevenueCat key in EAS secrets

---

### C2: Hardcoded Dev Credentials

**Severity:** CRITICAL
**Status:** PENDING
**File:** `mobile/src/stores/authStore.ts`
**Lines:** 96-97

**Current Code:**
```typescript
const devEmail = process.env.EXPO_PUBLIC_DEV_EMAIL || 'jimmy@agenticpersonnel.com';
const devPassword = process.env.EXPO_PUBLIC_DEV_PASSWORD || 'TestPassword123!';
```

**Problem:** Fallback credentials are embedded in the compiled app binary.

**Remediation Steps:**
1. [ ] Remove fallback values (use empty string or throw error)
2. [ ] Remove `EXPO_PUBLIC_DEV_EMAIL` and `EXPO_PUBLIC_DEV_PASSWORD` from `mobile/.env`
3. [ ] Update code to fail gracefully if dev env vars missing

**New Code:**
```typescript
const devEmail = process.env.EXPO_PUBLIC_DEV_EMAIL || '';
const devPassword = process.env.EXPO_PUBLIC_DEV_PASSWORD || '';

if (!devEmail || !devPassword) {
  console.warn('[Auth] Dev credentials not configured');
  return;
}
```

**If Something Breaks After Fix:**
- Dev login stops working → Set env vars in local `.env.local` only (not committed)
- Production unaffected since DEV_SKIP_AUTH should be false

---

### C3: Authentication Bypass Flag

**Severity:** CRITICAL
**Status:** PENDING
**Files:**
- `eas.json:14` (development profile)
- `mobile/src/stores/authStore.ts:67`

**Current State:**
```json
// eas.json development profile
"EXPO_PUBLIC_DEV_SKIP_AUTH": "true"
```

```typescript
// authStore.ts:67
if (process.env.EXPO_PUBLIC_DEV_SKIP_AUTH === 'true') {
  // Bypasses all authentication!
}
```

**Problem:** If accidentally deployed to production, anyone can use the app without authentication.

**Remediation Steps:**
1. [ ] Add build-time check that rejects production builds with DEV_SKIP_AUTH=true
2. [ ] Add runtime check using `__DEV__` constant
3. [ ] Remove DEV_SKIP_AUTH from eas.json entirely (use local env only)

**New Code (authStore.ts):**
```typescript
// Only allow auth skip in development builds AND with env var set
const canSkipAuth = __DEV__ && process.env.EXPO_PUBLIC_DEV_SKIP_AUTH === 'true';

if (canSkipAuth) {
  // Dev-only bypass
}
```

**If Something Breaks After Fix:**
- Dev builds require login → Set `EXPO_PUBLIC_DEV_SKIP_AUTH=true` in local `.env.local`
- TestFlight/Production unaffected (already set to false)

---

### C2 + C3 Combined: Full Dependency Chain

**IMPORTANT:** C2 and C3 must be fixed together. Changing one without the other will break the app.

#### Files Requiring Coordinated Changes

| File | Lines | What Changes | Why |
|------|-------|-------------|-----|
| `mobile/src/stores/authStore.ts` | 96-97 | Remove hardcoded fallback email/password | Security fix |
| `mobile/src/stores/authStore.ts` | 67-134 | Add `__DEV__` check, improve error handling | Prevent prod bypass |
| `mobile/src/navigation/RootNavigator.tsx` | 50-52 | Remove listener skip logic | Let normal auth run |
| `mobile/eas.json` | 14 | Change `DEV_SKIP_AUTH` to `false` or remove | Consistency |
| `mobile/.env` | 65-77 | Remove DEV_EMAIL, DEV_PASSWORD vars | Clean up |
| `mobile/.env.example` | 109-116 | Update documentation | Show correct pattern |

#### Current Auth Flow (DEV_SKIP_AUTH=true)

```
App Launch
    ↓
authStore.initialize()
    ↓
Check: EXPO_PUBLIC_DEV_SKIP_AUTH === 'true'  ← Flag checked here
    ↓
Get devEmail from env || 'jimmy@agenticpersonnel.com'  ← Fallback used
Get devPassword from env || 'TestPassword123!'  ← Fallback used
    ↓
supabase.auth.signInWithPassword(devEmail, devPassword)
    ↓
Set state: user, session, profile (hardcoded tier: 'enlightenment')
    ↓
RootNavigator sees isAuthenticated=true
    ↓
Renders MainTabNavigator (bypasses login screens)
    ↓
70+ screens see tier='enlightenment', all features unlocked
```

#### State Dependencies

These hooks all read from the auth state set by dev login:
- `useIsAuthenticated()` → `true`
- `useUser()` → Supabase user object
- `useProfile()` → Demo profile with `tier: 'enlightenment'`
- `useSubscriptionTier()` → `'enlightenment'`
- `useHasFeatureAccess()` → `true` for all tiers

#### What Breaks If Not Coordinated

| If You Only... | What Breaks |
|----------------|-------------|
| Remove fallbacks but keep DEV_SKIP_AUTH=true | Auth fails silently, no error shown, user confused |
| Set DEV_SKIP_AUTH=false but keep fallbacks | Fallbacks unused but still in binary (partial fix) |
| Fix authStore but not RootNavigator | Auth listener conflict, potential race conditions |
| Remove env vars but keep code | Falls back to hardcoded creds (defeats purpose) |

#### Chosen Solution: Remove Dev Bypass Entirely

**Decision Date:** 2025-12-25
**Rationale:** Safest option - all builds require real authentication. No risk of bypass reaching production.

**Implementation Order (must be done together):**

| Step | File | Action |
|------|------|--------|
| 1 | `mobile/src/stores/authStore.ts` | Delete lines 67-134 (entire DEV_SKIP_AUTH block) |
| 2 | `mobile/src/navigation/RootNavigator.tsx` | Delete lines 50-52 (listener skip check) |
| 3 | `mobile/eas.json` | Remove `EXPO_PUBLIC_DEV_SKIP_AUTH` from ALL profiles |
| 4 | `mobile/.env` | Remove `DEV_SKIP_AUTH`, `DEV_EMAIL`, `DEV_PASSWORD` |
| 5 | `mobile/.env.example` | Update documentation |

**After Fix - Developer Workflow:**
- All developers must log in with real Supabase credentials
- Create a test account in Supabase Auth for development
- Use that account for local testing
- No more auto-login, no more hardcoded tiers

**After Fix - What Changes:**
- `npm start` → App shows login screen (was: auto-logged in as Demo User)
- All subscription tiers must come from real RevenueCat data
- No more `tier: 'enlightenment'` hardcoded access

---

### C4: Service Role Key in Edge Functions

**Severity:** CRITICAL
**Status:** PENDING
**Files:**
- `supabase/functions/delete-account/index.ts:75, 119`
- `supabase/functions/validate-promo/index.ts:96-99`
- `supabase/functions/guru-analysis/index.ts:1288-1296`

**Current Pattern (Bad):**
```typescript
// Using service role for user operations - bypasses RLS!
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);
```

**Better Pattern:**
```typescript
// Use anon key with user's JWT - respects RLS
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  {
    global: {
      headers: { Authorization: req.headers.get('Authorization')! },
    },
  }
);
```

**Remediation Steps:**
1. [ ] Audit each function to determine if service role is truly needed
2. [ ] Replace with anon key + JWT where possible
3. [ ] For legitimate admin operations, add explicit permission checks
4. [ ] Document which operations require service role and why

**Functions Requiring Changes:**
| Function | Currently Uses | Should Use | Notes |
|----------|---------------|------------|-------|
| delete-account | Service Role | Anon + JWT | User deleting own account |
| validate-promo | Service Role | Anon + JWT | User validating codes |
| guru-analysis | Anon + JWT | Keep as-is | Already correct pattern |

**If Something Breaks After Fix:**
- Account deletion fails → Check RLS policy allows users to delete own data
- Promo validation fails → Ensure promo_codes table has SELECT policy for authenticated users

---

### C5: Weak Account Deletion Verification

**Severity:** CRITICAL
**Status:** PENDING
**File:** `supabase/functions/delete-account/index.ts:99-114`

**Current Issues:**
1. No rate limiting on password attempts
2. Error message reveals account existence ("Incorrect password")
3. No lockout after failed attempts

**Current Code:**
```typescript
if (signInError) {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Incorrect password. Please try again.',  // Reveals info!
    })
  );
}
```

**Remediation Steps:**
1. [ ] Add rate limiting (max 3 attempts per hour per user)
2. [ ] Use generic error message
3. [ ] Log failed attempts for monitoring
4. [ ] Consider email confirmation flow instead

**New Code:**
```typescript
// Generic error - doesn't reveal if password was wrong vs account doesn't exist
if (signInError) {
  console.log(`[Security] Delete attempt failed for user ${user.id}`);
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Unable to verify your identity. Please try again later.',
    }),
    { status: 400, headers: corsHeaders }
  );
}
```

**If Something Breaks After Fix:**
- Users confused by generic error → Add help text in UI explaining verification process
- Legitimate deletion attempts blocked → Check rate limit isn't too aggressive

---

## High Severity Findings

### H1: Missing RLS Policies on knowledge_embeddings

**File:** `supabase/migrations/20251217000001_security_fixes.sql:19-41`

**Issue:** Only SELECT and INSERT policies defined. UPDATE and DELETE missing.

**Fix:**
```sql
CREATE POLICY "Service role can update embeddings"
  ON public.knowledge_embeddings
  FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete embeddings"
  ON public.knowledge_embeddings
  FOR DELETE
  USING (auth.role() = 'service_role');
```

---

### H2: Unverified Conversation Ownership

**File:** `supabase/functions/guru-analysis/index.ts:1405-1418`

**Issue:** No explicit user_id check when loading conversation.

**Fix:** Add ownership verification:
```typescript
if (data?.user_id !== user.id) {
  throw new Error('Unauthorized: This conversation does not belong to you');
}
```

---

### H3: Sensitive Data in Console Logs

**Files:** Multiple services (50+ occurrences)

**Key Files to Clean:**
- `mobile/src/services/guruService.ts:114-115` - Logs user ID and token expiry
- `mobile/src/services/supabase.ts:20-23` - Logs Supabase config
- `mobile/src/services/aiChatService.ts` - Multiple sensitive logs

**Fix:** Create a sanitized logger:
```typescript
// utils/logger.ts
export const logger = {
  info: (message: string, data?: object) => {
    if (__DEV__) {
      console.log(message, sanitize(data));
    }
  },
  // ... other methods
};

function sanitize(data?: object) {
  if (!data) return '';
  const sanitized = { ...data };
  delete sanitized.token;
  delete sanitized.password;
  delete sanitized.userId;
  return sanitized;
}
```

---

### H4: Overly Permissive CORS

**Files:** All Edge Functions

**Current:**
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
};
```

**Fix:**
```typescript
const ALLOWED_ORIGINS = [
  'https://manifesttheunseen.com',
  'https://www.manifesttheunseen.com',
  // Add localhost for development
  ...(Deno.env.get('ENVIRONMENT') === 'development' ? ['http://localhost:8081'] : []),
];

const origin = req.headers.get('origin') || '';
const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

---

### H5: No Rate Limiting on AI Endpoints

**Files:** `ai-chat/index.ts`, `guru-analysis/index.ts`

**Fix:** Add rate limiting using Supabase:
```typescript
// Check rate limit (100 requests per day per user)
const { count } = await supabase
  .from('api_usage')
  .select('*', { count: 'exact' })
  .eq('user_id', user.id)
  .eq('endpoint', 'ai-chat')
  .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

if (count && count >= 100) {
  return new Response(
    JSON.stringify({ error: 'Daily limit exceeded. Please try again tomorrow.' }),
    { status: 429, headers: corsHeaders }
  );
}
```

**Migration needed:**
```sql
CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  endpoint TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_api_usage_user_endpoint ON api_usage(user_id, endpoint, created_at);
```

---

### H6: Missing Journal Entry Encryption

**File:** `supabase/migrations/20250101000000_initial_schema.sql:90-99`

**Issue:** `encrypted_content` column exists but isn't used.

**Implementation Plan:**
1. Use `expo-secure-store` to store encryption key per device
2. Encrypt content client-side before saving
3. Store in `encrypted_content` column
4. Keep `content` for backwards compatibility during migration

---

## Medium Severity Findings

### M1-M11 Summary

| ID | Issue | Quick Fix |
|----|-------|-----------|
| M1 | localStorage plaintext | Use `expo-secure-store` for tokens |
| M2 | AsyncStorage unencrypted | Encrypt sensitive fields before storage |
| M3 | Debug logging | Wrap in `if (__DEV__)` checks |
| M4 | Class names preserved | Set `keep_classnames: false` in production |
| M5 | Source maps | Configure metro to exclude from production |
| M6 | Dependency pinning | Pin all versions (remove ^) |
| M7 | No jailbreak detection | Add `jail-monkey` package |
| M8 | No cert pinning | Implement SSL pinning for API calls |
| M9 | Incomplete .gitignore | Add `mobile/.env*`, `supabase/.env*` |
| M10 | No audit logging | Create audit_logs table and triggers |
| M11 | Input validation | Add Zod schemas to Edge Functions |

---

## Low Severity Findings

| ID | Issue | Quick Fix |
|----|-------|-----------|
| L1 | No promo rate limiting | Add 5 attempts/minute limit |
| L2 | Hardcoded sale info | Move to remote config |
| L3 | Missing ATS config | Add NSAppTransportSecurity to app.json |

---

## Remediation Plan

### Phase 1: Critical (Do Immediately)
**Estimated Time:** 2-4 hours
**Blocks:** All deployments

| Task | Owner | Status |
|------|-------|--------|
| Rotate all exposed API keys | Manual | [ ] |
| Clean git history | Manual | [ ] |
| Remove hardcoded credentials | Code | [ ] |
| Add __DEV__ check to auth bypass | Code | [ ] |
| Fix service role usage in Edge Functions | Code | [ ] |
| Add generic error messages | Code | [ ] |

### Phase 2: High Priority (Before Next Release)
**Estimated Time:** 4-8 hours

| Task | Owner | Status |
|------|-------|--------|
| Add missing RLS policies | Migration | [ ] |
| Add conversation ownership check | Code | [ ] |
| Remove/sanitize console logs | Code | [ ] |
| Restrict CORS origins | Code | [ ] |
| Implement rate limiting | Code + Migration | [ ] |
| Document encryption plan | Docs | [ ] |

### Phase 3: Hardening (Ongoing)
**Estimated Time:** 8-16 hours

| Task | Owner | Status |
|------|-------|--------|
| Implement secure storage | Code | [ ] |
| Add jailbreak detection | Code | [ ] |
| Add certificate pinning | Code | [ ] |
| Pin all dependencies | Config | [ ] |
| Add audit logging | Migration + Code | [ ] |
| Input validation schemas | Code | [ ] |

---

## Implementation Log

Use this section to track changes as they're made.

### 2025-12-25 - Claude Code - C2+C3: Removed Dev Auth Bypass Entirely

**Decision:** User confirmed removal of dev bypass (safest option)

**Files Modified:**
1. `mobile/src/stores/authStore.ts`
   - Removed lines 65-134 (entire DEV_SKIP_AUTH block)
   - Removed hardcoded fallback credentials
   - App now requires real Supabase authentication for all builds

2. `mobile/src/navigation/RootNavigator.tsx`
   - Removed lines 49-52 (listener skip check)
   - Auth state listener now always runs

3. `mobile/eas.json`
   - Removed `EXPO_PUBLIC_DEV_SKIP_AUTH` from development profile
   - Removed `EXPO_PUBLIC_DEV_SKIP_AUTH` from preview profile
   - Removed `EXPO_PUBLIC_DEV_SKIP_AUTH` from testflight profile
   - Removed `EXPO_PUBLIC_DEV_SKIP_AUTH` from production profile

4. `mobile/.env`
   - Removed `EXPO_PUBLIC_DEV_SKIP_AUTH=true`
   - Removed `EXPO_PUBLIC_DEV_EMAIL=test.enlightenment@manifest.test`
   - Removed `EXPO_PUBLIC_DEV_PASSWORD=TestEnlightenment123!`
   - Added note about dev bypass removal

5. `mobile/.env.example`
   - Removed DEV_SKIP_AUTH and DEV_PASSWORD documentation
   - Added note: "Dev auth bypass has been removed for security reasons"

**Impact:**
- All builds now show login screen on launch
- No more auto-login with hardcoded credentials
- No more hardcoded `tier: 'enlightenment'` access
- Developers must use real Supabase accounts for testing

**Verification:**
- [ ] App launches to login screen in development
- [ ] Real authentication works end-to-end
- [ ] No DEV_SKIP_AUTH references remain in codebase

---

### 2025-12-25 - Claude Code - C4, H1, H4: Edge Function Security & RLS Fixes

**Issues Addressed:**
- C4: Service role key in Edge Functions
- H1: Missing RLS policies on knowledge_embeddings
- H4: Overly permissive CORS

**Files Created:**
1. `supabase/migrations/20251225000000_security_rls_improvements.sql`
   - Added RLS policy: "Users can insert own redemptions" on promo_code_redemptions
   - Added RLS policy: "Service role can update embeddings" on knowledge_embeddings
   - Added RLS policy: "Service role can delete embeddings" on knowledge_embeddings

**Files Modified:**
2. `supabase/functions/validate-promo/index.ts`
   - Changed promo code lookup to use anon client (RLS allows public SELECT)
   - Changed redemption check to use user JWT (RLS allows users to read own)
   - Changed redemption insert to use user JWT (new RLS policy allows)
   - Only counter update uses service role now
   - Added CORS origin restriction

3. `supabase/functions/delete-account/index.ts`
   - Added documentation explaining why service role is necessary
   - Added CORS origin restriction
   - Improved error message (C5 partial fix)

4. `supabase/functions/guru-analysis/index.ts`
   - Added CORS origin restriction (getCorsHeaders function)
   - Already correctly uses anon+JWT

5. `supabase/functions/ai-chat/index.ts`
   - Added CORS origin restriction (getCorsHeaders function)

**CORS Allowed Origins:**
- https://manifesttheunseen.com
- https://www.manifesttheunseen.com
- https://zbyszxtwzoylyygtexdr.supabase.co
- Mobile apps (null/empty origin allowed)

**Service Role Usage After Fix:**
| Function | Service Role Usage | Reason |
|----------|-------------------|--------|
| validate-promo | Counter update only | Requires admin to modify promo_codes table |
| delete-account | Storage + auth.admin.deleteUser | Admin APIs require service role |
| guru-analysis | None | All operations via user JWT |
| ai-chat | None | All operations via user JWT |

**Migration Required:**
Run `npx supabase db push` to apply the new RLS policies.

**Verification:**
- [ ] validate-promo works with user JWT for redemptions
- [ ] delete-account still works for account deletion
- [ ] CORS blocks requests from unknown origins
- [ ] knowledge_embeddings has complete RLS coverage

---

### [Date] - [Developer] - [Change Description]

```
Example:
2025-12-25 - Jimmy - Rotated all API keys in Supabase dashboard
  - Old anon key: eyJ...Xtu4 (revoked)
  - New anon key: eyJ...updated in EAS secrets
  - Verified app still connects
```

---

## Rollback Procedures

### Cleaning Git History

**WARNING:** This rewrites history. Coordinate with team before running.

```bash
# Install git-filter-repo if not installed
pip install git-filter-repo

# Remove .env files from all history
git filter-repo --invert-paths --path .env.local --path mobile/.env --force

# Force push (requires force push permissions)
git push origin main --force

# All team members must re-clone the repo after this
```

### If App Stops Working After Key Rotation

1. **Check EAS secrets:** `eas secret:list`
2. **Verify Edge Function secrets:** Supabase Dashboard → Edge Functions → Secrets
3. **Test locally:** Set env vars in `.env.local` and run `npm start`
4. **Common issues:**
   - Typo in new key → Re-copy from dashboard
   - Key not deployed → Run `eas secret:push` again
   - Cache → Clear app data and reinstall

### If Auth Breaks After Removing Dev Bypass

1. **Development:** Set `EXPO_PUBLIC_DEV_SKIP_AUTH=true` in local `.env.local`
2. **TestFlight:** Should use real auth (intentional)
3. **Production:** Should use real auth (intentional)
4. **Quick rollback:** Temporarily set `canSkipAuth = true` in authStore.ts (don't deploy!)

### If Edge Functions Fail After Service Role Changes

1. Check Supabase logs: Dashboard → Logs → Edge Functions
2. Verify RLS policies exist for the tables being accessed
3. Ensure user JWT is being passed correctly
4. Temporary rollback: Use service role key (add TODO to fix properly)

---

## Verification Checklist

Run this checklist after completing all remediations:

### Secrets
- [ ] Old Supabase anon key returns 401 when used
- [ ] Old Supabase service role key returns 401 when used
- [ ] Old Anthropic key returns 401
- [ ] Old OpenAI key returns 401
- [ ] New keys work in development
- [ ] New keys work in TestFlight build
- [ ] Git history search for old keys returns nothing: `git log -p -S "sk-ant-api03" --all`

### Authentication
- [ ] Production build requires real login
- [ ] TestFlight build requires real login
- [ ] Development build can skip auth (with local env var)
- [ ] No hardcoded credentials in compiled app (decompile and search)

### Edge Functions
- [ ] delete-account works with user's own JWT
- [ ] delete-account fails for other users' data
- [ ] validate-promo works with user's JWT
- [ ] Rate limiting blocks excessive requests
- [ ] Generic error messages (no information leakage)

### Data Security
- [ ] Journal entries stored encrypted (Phase 3)
- [ ] No sensitive data in console (check release build logs)
- [ ] Audit logs capturing sensitive operations (Phase 3)

### Build Security
- [ ] Source maps not included in release build
- [ ] Class/function names mangled in release
- [ ] No debug flags in production eas.json profile

---

## Contact & Escalation

If a critical security issue is discovered in production:

1. **Immediately:** Rotate affected keys
2. **Within 1 hour:** Deploy hotfix or take affected endpoint offline
3. **Within 24 hours:** Complete incident report
4. **Within 1 week:** Implement preventive measures

---

*This is a living document. Update it as issues are fixed and new ones discovered.*
