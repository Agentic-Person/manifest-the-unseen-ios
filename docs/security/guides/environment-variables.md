# Environment Variable Security Guide

## Overview

This guide documents the security setup for environment variables in the Manifest the Unseen project. It covers .env file management, API key handling, and security best practices.

## Current Status

### Git History Verification (2025-12-12)

✅ **VERIFIED CLEAN**: No .env files containing sensitive data have ever been committed to git history.

**Verification performed:**
```bash
# Checked complete git history
git log --all --full-history -- "*.env*"
# Result: Only .env.example files found

# Verified specific sensitive files
git log --all --full-history -- "mobile/.env" ".env.local" "tools/youtube-scraper/.env"
# Result: No commits found

# Checked current HEAD
git ls-tree -r HEAD --name-only | grep -E "\.env$"
# Result: No .env files in tree
```

### .gitignore Configuration

The project `.gitignore` properly excludes all .env files:

```gitignore
# Environment variables (lines 44-48)
.env
.env.local
.env.*.local
.env.development
.env.production
```

**Verification:**
```bash
git check-ignore -v .env .env.local mobile/.env tools/youtube-scraper/.env
# All files properly ignored by .gitignore
```

## File Structure

### Production .env Files (NOT in git)

These files exist locally but are properly excluded from version control:

1. **`mobile/.env`** - Mobile app configuration
   - Supabase URL and anon key (public-facing)
   - RevenueCat SDK keys (safe for mobile apps)
   - Feature flags
   - Development settings

2. **`.env.local`** - Root-level configuration (legacy)
   - Supabase credentials
   - AI API keys (OpenAI, Anthropic)
   - Should NOT be used in mobile app

3. **`tools/youtube-scraper/.env`** - Backend tool configuration
   - Supabase service role key (server-side only)
   - OpenAI API key
   - Server port

### Template Files (IN git)

Safe placeholder templates for developers:

1. **`mobile/.env.example`** - Mobile app template
2. **`tools/youtube-scraper/.env.example`** - Backend tool template
3. **`.env.example`** - Root-level template (comprehensive reference)

## Security Model

### Mobile App (.env files in mobile/)

**SAFE to include in app:**
- ✅ `EXPO_PUBLIC_SUPABASE_URL` - Public URL
- ✅ `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Protected by RLS policies
- ✅ `EXPO_PUBLIC_REVENUECAT_IOS_KEY` - iOS SDK key (public)
- ✅ `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` - Android SDK key (public)

**NEVER include in app:**
- ❌ `SUPABASE_SERVICE_ROLE_KEY` - Bypasses RLS, server-only
- ❌ `OPENAI_API_KEY` - Expensive, use in Edge Functions
- ❌ `ANTHROPIC_API_KEY` - Expensive, use in Edge Functions
- ❌ `REVENUECAT_REST_API_KEY` - Backend only

### Backend Tools (tools/youtube-scraper/.env)

**Server-side only:**
- `SUPABASE_SERVICE_KEY` - Full database access
- `OPENAI_API_KEY` - Direct API access
- Never expose these keys in mobile app

### Architecture Pattern

```
Mobile App (React Native)
  ↓ Uses EXPO_PUBLIC_SUPABASE_ANON_KEY
  ↓ Protected by Row Level Security (RLS)
Supabase Edge Functions
  ↓ Uses SUPABASE_SERVICE_ROLE_KEY (server-side)
  ↓ Calls AI APIs with OPENAI_API_KEY, ANTHROPIC_API_KEY
External APIs (OpenAI, Anthropic)
```

**Benefits:**
- Mobile app cannot abuse AI APIs (cost protection)
- Users cannot bypass RLS policies
- API keys never exposed in app bundle
- Centralized rate limiting and monitoring

## Setup Instructions

### For New Developers

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd manifest-the-unseen-ios
   ```

2. **Copy .env.example files**
   ```bash
   # Mobile app
   cp mobile/.env.example mobile/.env

   # Backend tools
   cp tools/youtube-scraper/.env.example tools/youtube-scraper/.env
   ```

3. **Get API keys** (see docs/api-keys-guide.md)
   - Supabase: https://app.supabase.com/project/_/settings/api
   - RevenueCat: https://app.revenuecat.com/
   - OpenAI: https://platform.openai.com/api-keys
   - Anthropic: https://console.anthropic.com/

4. **Fill in mobile/.env**
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   EXPO_PUBLIC_REVENUECAT_IOS_KEY=your-ios-key
   ```

5. **Verify .env is ignored**
   ```bash
   git status
   # Should NOT show mobile/.env or other .env files
   ```

### For Production Deployment

**Mobile App (Expo/EAS Build):**
- Set environment variables in `eas.json` or EAS dashboard
- Use different keys for development/staging/production builds
- Never commit production keys to git

**Supabase Edge Functions:**
- Set secrets via Supabase CLI:
  ```bash
  supabase secrets set OPENAI_API_KEY=your-key
  supabase secrets set ANTHROPIC_API_KEY=your-key
  ```
- Access in functions via `Deno.env.get('OPENAI_API_KEY')`

## API Key Rotation

### When to Rotate

- **Immediately** if key is exposed in git, logs, or public
- **Every 90 days** as routine maintenance
- **After developer offboarding**
- **After security incidents**

### How to Rotate

1. **Generate new keys** in respective dashboards
2. **Update .env files** (local development)
3. **Update EAS secrets** (mobile production)
   ```bash
   eas secret:push --scope project
   ```
4. **Update Supabase secrets** (Edge Functions)
   ```bash
   supabase secrets set OPENAI_API_KEY=new-key --project-ref your-ref
   ```
5. **Deploy new builds/functions**
6. **Revoke old keys** after 24-48 hours (rollback window)
7. **Update password manager** (team access)

### Key Inventory

| Service | Key Type | Location | Rotation Frequency |
|---------|----------|----------|-------------------|
| Supabase | Anon Key | Mobile app | 90 days |
| Supabase | Service Role | Edge Functions | 90 days |
| RevenueCat | iOS SDK | Mobile app | 180 days |
| OpenAI | API Key | Edge Functions | 90 days |
| Anthropic | API Key | Edge Functions | 90 days |
| Sentry | DSN | Mobile app | 180 days |
| TelemetryDeck | App ID | Mobile app | Never (not secret) |

## Key Exposure Response

### If .env file is committed to git:

**IMMEDIATE ACTIONS (within 1 hour):**

1. **Revoke all exposed keys immediately**
   - Supabase: Project Settings → API → Reset keys
   - OpenAI: https://platform.openai.com/api-keys → Revoke
   - Anthropic: https://console.anthropic.com/ → Revoke

2. **Remove from git history** (use BFG Repo-Cleaner for safety)
   ```bash
   # Install BFG
   # Download from: https://rtyley.github.io/bfg-repo-cleaner/

   # Create backup
   git clone --mirror <repository-url> repository-backup.git

   # Clean history
   java -jar bfg.jar --delete-files ".env" repository-backup.git
   java -jar bfg.jar --delete-files ".env.local" repository-backup.git

   # Verify and force-push
   cd repository-backup.git
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push --force
   ```

3. **Notify team** of key rotation

4. **Update all environments** with new keys

**FOLLOW-UP (within 24 hours):**

5. **Audit access logs** for suspicious activity
   - Supabase: Dashboard → Logs
   - OpenAI: Usage dashboard
   - RevenueCat: Events log

6. **Document incident** in security log

7. **Review .gitignore** to prevent recurrence

### If key is exposed in logs/screenshots:

1. **Revoke key immediately**
2. **Remove from public locations** (delete screenshots, edit logs)
3. **Generate and deploy new key**
4. **Review logging practices** to prevent logging secrets

## Best Practices

### Development

1. ✅ **Use .env.example** as template
2. ✅ **Never commit .env** files
3. ✅ **Verify .gitignore** before committing
4. ✅ **Use different keys** for dev/staging/prod
5. ✅ **Store production keys** in password manager
6. ✅ **Use EXPO_PUBLIC_ prefix** only for public-safe values
7. ✅ **Keep service keys server-side** (Edge Functions)

### Code Review

When reviewing code, check for:

1. ❌ Hardcoded API keys or secrets
2. ❌ `console.log()` with sensitive data
3. ❌ .env files in git diff
4. ❌ Direct API calls to OpenAI/Anthropic from mobile app
5. ❌ Service role key used in React Native code

### Testing

1. ✅ **Use separate API keys** for testing
2. ✅ **Create test Supabase project** (local or cloud)
3. ✅ **Never use production keys** in CI/CD
4. ✅ **Mock external APIs** in unit tests

## Monitoring

### Cost Monitoring

Set up billing alerts for API usage:

- **Supabase**: Dashboard → Settings → Billing → Set alert at $50
- **OpenAI**: https://platform.openai.com/usage → Set alert at $100
- **Anthropic**: Console → Usage → Set alert at $100

### Security Monitoring

Enable audit logging:

- **Supabase**: Monitor auth logs and API logs
- **RevenueCat**: Track subscription events
- **Sentry**: Monitor error patterns for key exposure

## Emergency Contacts

| Service | Support URL | Response Time |
|---------|-------------|---------------|
| Supabase | https://supabase.com/dashboard/support | 24h |
| OpenAI | https://help.openai.com/ | 48h |
| Anthropic | support@anthropic.com | 48h |
| RevenueCat | https://www.revenuecat.com/support | 24h |

## Checklist

### Before Committing Code

- [ ] Run `git status` and verify no .env files shown
- [ ] Run `git diff --cached` and scan for hardcoded secrets
- [ ] Verify all API calls go through Edge Functions (not direct from app)
- [ ] Check console.log statements for sensitive data

### Before Deploying

- [ ] Verify production keys are set in EAS/Supabase secrets
- [ ] Test with production keys in staging environment
- [ ] Confirm .env.local is not bundled in app binary
- [ ] Review Supabase RLS policies are enabled

### After Key Rotation

- [ ] Update all environments (dev, staging, prod)
- [ ] Update password manager entries
- [ ] Update team documentation
- [ ] Test all API integrations
- [ ] Monitor for errors from old keys

## Resources

- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)

## Revision History

| Date | Change | Author |
|------|--------|--------|
| 2025-12-12 | Initial security audit and documentation | Claude Sonnet 4.5 |
| 2025-12-12 | Created .env.example templates | Claude Sonnet 4.5 |
| 2025-12-12 | Verified git history clean | Claude Sonnet 4.5 |

---

**Last Verified**: 2025-12-12
**Status**: ✅ SECURE - No .env files in git history
**Next Review**: 2026-03-12 (90 days)
