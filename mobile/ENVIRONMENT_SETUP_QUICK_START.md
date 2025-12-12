# Environment Variables - Quick Start Guide

This is a quick reference for setting up environment variables for Manifest the Unseen. For detailed documentation, see [EAS_SECRETS_SETUP.md](./EAS_SECRETS_SETUP.md).

## Table of Contents

1. [Local Development (5 minutes)](#local-development)
2. [EAS Secrets for Production (10 minutes)](#eas-secrets-for-production)
3. [Quick Commands Reference](#quick-commands-reference)

---

## Local Development

### Step 1: Copy the Template

```bash
cd mobile
cp .env.example .env
```

### Step 2: Get Your Credentials

| Service | Where to Find | What You Need |
|---------|---------------|---------------|
| **Supabase** | [Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API | URL + Anon Key |
| **RevenueCat** | [Dashboard](https://app.revenuecat.com/) → Project Settings → API Keys | iOS SDK Key |

### Step 3: Fill in `.env`

Open `mobile/.env` and replace these values:

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://zbyszxtwzoylyygtexdr.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# RevenueCat
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_your_actual_key_here

# Development mode (set to true for UI testing without real auth)
EXPO_PUBLIC_DEV_SKIP_AUTH=true
```

### Step 4: Start Development

```bash
npm start
```

That's it! You're ready for local development.

---

## EAS Secrets for Production

### Prerequisites

```bash
# Install EAS CLI (once)
npm install -g eas-cli

# Login to Expo (once)
eas login
```

### Option A: Use the Setup Script (Recommended)

**Windows:**
```bash
cd mobile\scripts
setup-eas-secrets.bat
```

**Mac/Linux:**
```bash
cd mobile/scripts
chmod +x setup-eas-secrets.sh
./setup-eas-secrets.sh
```

### Option B: Manual Commands

Run these commands with your actual values:

```bash
# Supabase URL
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://zbyszxtwzoylyygtexdr.supabase.co"

# Supabase Anon Key
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpieXN6eHR3em95bHl5Z3RleGRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MDE1MDcsImV4cCI6MjA3NzI3NzUwN30.z4NDPLi_njS8Y_7T_9JQn9pdLyoJWlFuc2lnZJDXTu4"

# RevenueCat iOS Key
eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "appl_syRiYucCEYWABHxxiKjporBRJVM"
```

### Verify Secrets

```bash
eas secret:list
```

You should see:
```
┌─────────────────────────────────────┬──────────┬───────────┐
│ Name                                │ Scope    │ Updated   │
├─────────────────────────────────────┼──────────┼───────────┤
│ EXPO_PUBLIC_SUPABASE_URL            │ project  │ Just now  │
│ EXPO_PUBLIC_SUPABASE_ANON_KEY       │ project  │ Just now  │
│ EXPO_PUBLIC_REVENUECAT_IOS_KEY      │ project  │ Just now  │
└─────────────────────────────────────┴──────────┴───────────┘
```

---

## Quick Commands Reference

### EAS Secrets Management

```bash
# List all secrets
eas secret:list

# Create a new secret
eas secret:create --scope project --name SECRET_NAME --value "secret_value"

# Delete a secret (before updating)
eas secret:delete --name SECRET_NAME

# Update a secret (delete then create)
eas secret:delete --name EXPO_PUBLIC_SUPABASE_URL
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "new_value"
```

### Building with Different Profiles

```bash
# Development build (uses local .env + dev settings)
eas build --profile development --platform ios

# Preview build (uses EAS secrets + staging mode)
eas build --profile preview --platform ios

# Production build (uses EAS secrets + production mode)
eas build --profile production --platform ios

# Clear cache and rebuild
eas build --profile production --platform ios --clear-cache
```

### Local Development

```bash
# Start Metro bundler
npm start

# Start with cache reset
npm start -- --reset-cache

# Run on iOS simulator
npm run ios

# Run on iOS device
npm run ios --device
```

---

## What Goes Where?

### Client-Side (Mobile App) - Use `EXPO_PUBLIC_` prefix

These are safe to embed in the mobile app:

- ✅ `EXPO_PUBLIC_SUPABASE_URL`
- ✅ `EXPO_PUBLIC_SUPABASE_ANON_KEY` (protected by RLS)
- ✅ `EXPO_PUBLIC_REVENUECAT_IOS_KEY` (SDK key, not secret)
- ✅ `EXPO_PUBLIC_DEV_SKIP_AUTH` (development flag)

### Server-Side (Supabase Edge Functions) - NO prefix

These should NEVER be in mobile app code:

- ❌ `OPENAI_API_KEY` (set in Supabase Dashboard)
- ❌ `ANTHROPIC_API_KEY` (set in Supabase Dashboard)
- ❌ `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS, never expose!)

---

## Troubleshooting

### "Environment variable not defined"

**Solution:**
1. Check local `.env` file has the variable
2. Restart Metro bundler: `npm start -- --reset-cache`
3. For builds, verify with `eas secret:list`

### "Invalid API key"

**Solution:**
1. Check you copied the full key (no truncation)
2. Verify you're using the correct key type:
   - Supabase: `anon` key (NOT `service_role`)
   - RevenueCat: iOS SDK key (starts with `appl_`)

### "Secrets not available in build"

**Solution:**
1. Ensure secrets scope is `project`: `eas secret:list`
2. Rebuild with cache clear: `eas build --clear-cache`
3. Check `eas.json` doesn't hardcode values that override secrets

---

## Security Checklist

- [ ] `.env` file is in `.gitignore` (already configured)
- [ ] Never commit `.env` to git
- [ ] Use different API keys for dev/staging/production
- [ ] Rotate keys every 90 days
- [ ] Store production keys in password manager
- [ ] Backend API keys (OpenAI, Anthropic) only in Supabase Edge Functions
- [ ] Never expose `SUPABASE_SERVICE_ROLE_KEY` to mobile app

---

## Files in This Setup

| File | Purpose |
|------|---------|
| `.env.example` | Template with all required variables + documentation |
| `.env` | Your actual values (git-ignored) |
| `eas.json` | Build profiles, references EAS Secrets |
| `EAS_SECRETS_SETUP.md` | Detailed setup guide |
| `scripts/setup-eas-secrets.sh` | Setup script for Mac/Linux |
| `scripts/setup-eas-secrets.bat` | Setup script for Windows |
| `ENVIRONMENT_SETUP_QUICK_START.md` | This file (quick reference) |

---

## Next Steps

1. ✅ Set up local `.env` file for development
2. ✅ Test locally: `npm start`
3. ✅ Set up EAS Secrets for production builds
4. ✅ Set up Supabase Edge Functions secrets (see [EAS_SECRETS_SETUP.md](./EAS_SECRETS_SETUP.md))
5. ✅ Create a preview build: `eas build --profile preview --platform ios`
6. ✅ Test on device via TestFlight
7. ✅ Create production build when ready: `eas build --profile production --platform ios`

---

**Need More Help?**

- Full documentation: [EAS_SECRETS_SETUP.md](./EAS_SECRETS_SETUP.md)
- EAS Secrets docs: https://docs.expo.dev/build-reference/variables/
- Supabase docs: https://supabase.com/docs
- RevenueCat docs: https://www.revenuecat.com/docs

---

**Last Updated**: 2025-12-12
