# Environment Variables Setup Checklist

Use this checklist to verify your environment variables are properly configured.

---

## Pre-Setup Verification

- [ ] EAS CLI is installed: `npm install -g eas-cli`
- [ ] Logged into Expo: `eas login`
- [ ] You have your Supabase credentials ready
- [ ] You have your RevenueCat iOS key ready

---

## Local Development Setup

- [ ] Copy `.env.example` to `.env`: `cp .env.example .env`
- [ ] Fill in `EXPO_PUBLIC_SUPABASE_URL` in `.env`
- [ ] Fill in `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `.env`
- [ ] Fill in `EXPO_PUBLIC_REVENUECAT_IOS_KEY` in `.env`
- [ ] Set `EXPO_PUBLIC_DEV_SKIP_AUTH=true` for UI testing (if desired)
- [ ] Verify `.env` is git-ignored: `git status` (should NOT show `.env`)
- [ ] Test local dev: `npm start` (should start without errors)

---

## EAS Secrets Setup (Production)

### Option 1: Use Setup Script

**Windows:**
- [ ] Run `cd mobile\scripts && setup-eas-secrets.bat`
- [ ] Follow the prompts to enter your keys
- [ ] Verify secrets: `eas secret:list`

**Mac/Linux:**
- [ ] Run `chmod +x mobile/scripts/setup-eas-secrets.sh`
- [ ] Run `cd mobile/scripts && ./setup-eas-secrets.sh`
- [ ] Follow the prompts to enter your keys
- [ ] Verify secrets: `eas secret:list`

### Option 2: Manual Commands

- [ ] Create `EXPO_PUBLIC_SUPABASE_URL` secret
- [ ] Create `EXPO_PUBLIC_SUPABASE_ANON_KEY` secret
- [ ] Create `EXPO_PUBLIC_REVENUECAT_IOS_KEY` secret
- [ ] Verify all 3 secrets exist: `eas secret:list`

---

## Verification Steps

### Local Development
- [ ] `npm start` runs without errors
- [ ] App can connect to Supabase (check console logs)
- [ ] RevenueCat initializes correctly (check debug logs)

### EAS Secrets
- [ ] Run `eas secret:list` shows all 3 secrets
- [ ] All secrets have scope: `project`
- [ ] Secrets were updated recently (check "Updated" column)

### Build Configuration
- [ ] `mobile/eas.json` does NOT contain hardcoded API keys
- [ ] Each build profile (development, preview, production) has `EXPO_PUBLIC_DEV_SKIP_AUTH` set
- [ ] `mobile/.gitignore` or root `.gitignore` excludes `.env*` files

---

## Security Checks

- [ ] `.env` file is NOT committed to git
- [ ] `.env.example` does NOT contain real credentials
- [ ] API keys are stored in password manager (1Password, Bitwarden, etc.)
- [ ] You understand the difference between:
  - `EXPO_PUBLIC_*` (client-side, safe to embed)
  - Non-prefixed (server-side, NEVER in mobile app)

---

## Optional: Test Preview Build

- [ ] Create preview build: `eas build --profile preview --platform ios`
- [ ] Build completes successfully
- [ ] Install on device via TestFlight
- [ ] App connects to Supabase
- [ ] RevenueCat works correctly
- [ ] No API key errors in logs

---

## Future: Supabase Edge Functions (When Implementing AI)

These are NOT needed yet - only when you create Edge Functions for AI chat:

- [ ] Go to Supabase Dashboard → Edge Functions
- [ ] Add `OPENAI_API_KEY` secret
- [ ] Add `ANTHROPIC_API_KEY` secret
- [ ] Test Edge Function locally with `supabase functions serve`
- [ ] Verify Edge Functions can access secrets

---

## Troubleshooting Checklist

If something doesn't work:

- [ ] Restart Metro bundler: `npm start -- --reset-cache`
- [ ] Verify `.env` file exists and has correct values
- [ ] Check variable names match exactly (case-sensitive)
- [ ] For builds, verify secrets with `eas secret:list`
- [ ] Check EAS project ID matches: `eas.json` → `extra.eas.projectId`
- [ ] Review logs for specific error messages

---

## Documentation Reference

Quick access to guides:

| Document | Purpose |
|----------|---------|
| `ENVIRONMENT_SETUP_QUICK_START.md` | Fast 5-minute setup guide |
| `EAS_SECRETS_SETUP.md` | Comprehensive setup documentation |
| `ENVIRONMENT_VARIABLES_SETUP_SUMMARY.md` | What changed and why |
| `.env.example` | Template with all variables |
| `scripts/setup-eas-secrets.sh` | Mac/Linux setup script |
| `scripts/setup-eas-secrets.bat` | Windows setup script |

---

## Common Commands Reference

```bash
# List secrets
eas secret:list

# Create secret
eas secret:create --scope project --name SECRET_NAME --value "value"

# Delete secret
eas secret:delete --name SECRET_NAME

# Start local dev
npm start

# Build preview
eas build --profile preview --platform ios

# Build production
eas build --profile production --platform ios
```

---

## Setup Complete?

If all items are checked:

✅ **Local Development:** Ready to use
✅ **EAS Builds:** Configured for preview/production
✅ **Security:** API keys properly managed
✅ **Documentation:** Available for reference

You're all set! Start developing with `npm start`.

---

**Last Updated:** 2025-12-12
