# EAS Secrets Setup Guide

This guide explains how to properly configure environment variables and secrets for Manifest the Unseen using Expo Application Services (EAS).

## Table of Contents

1. [Overview](#overview)
2. [Local Development Setup](#local-development-setup)
3. [EAS Secrets for Production](#eas-secrets-for-production)
4. [Supabase Edge Functions Secrets](#supabase-edge-functions-secrets)
5. [Security Best Practices](#security-best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Overview

### Environment Variable Strategy

The app uses a multi-layered approach to environment variables:

1. **Local Development**: `.env` file (git-ignored)
2. **EAS Builds**: EAS Secrets (cloud-managed)
3. **Backend Services**: Supabase Edge Functions environment variables

### Variable Types

- **`EXPO_PUBLIC_*`**: Exposed to mobile app code (safe, client-side)
- **Without prefix**: Backend-only (Supabase Edge Functions, never exposed to app)

---

## Local Development Setup

### Step 1: Create Your Local .env File

```bash
cd mobile
cp .env.example .env
```

### Step 2: Fill In Your Development Values

Open `mobile/.env` and replace placeholder values with your actual development credentials:

```bash
# Supabase (get from https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api)
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# RevenueCat (get from https://app.revenuecat.com/)
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_your_actual_ios_key_here

# Development settings
EXPO_PUBLIC_DEV_SKIP_AUTH=true  # Set to true for UI testing without auth
```

### Step 3: Verify .gitignore

Ensure your `.env` file is NOT committed to git:

```bash
# Check that .env is ignored
git status

# Should NOT see .env in the list
# If you see it, add to .gitignore:
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore
```

---

## EAS Secrets for Production

EAS Secrets are encrypted environment variables managed by Expo's cloud infrastructure. They're injected into your builds at build time.

### Prerequisites

1. Install EAS CLI (if not already installed):
   ```bash
   npm install -g eas-cli
   ```

2. Login to your Expo account:
   ```bash
   eas login
   ```

3. Verify you're in the correct project:
   ```bash
   cd mobile
   eas whoami
   ```

### Step 1: Create Required Secrets

Run these commands to create secrets for your project. Replace the placeholder values with your actual credentials.

#### Supabase Configuration

```bash
# Production Supabase URL
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://zbyszxtwzoylyygtexdr.supabase.co"

# Production Supabase Anon Key
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpieXN6eHR3em95bHl5Z3RleGRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MDE1MDcsImV4cCI6MjA3NzI3NzUwN30.z4NDPLi_njS8Y_7T_9JQn9pdLyoJWlFuc2lnZJDXTu4"
```

#### RevenueCat Configuration

```bash
# Production RevenueCat iOS Key
eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "appl_syRiYucCEYWABHxxiKjporBRJVM"

# (Future) RevenueCat Android Key
# eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value "goog_your_android_key"
```

### Step 2: Verify Secrets

List all secrets to confirm they're set:

```bash
eas secret:list
```

Expected output:
```
┌─────────────────────────────────────┬──────────┬───────────┐
│ Name                                │ Scope    │ Updated   │
├─────────────────────────────────────┼──────────┼───────────┤
│ EXPO_PUBLIC_SUPABASE_URL            │ project  │ Just now  │
│ EXPO_PUBLIC_SUPABASE_ANON_KEY       │ project  │ Just now  │
│ EXPO_PUBLIC_REVENUECAT_IOS_KEY      │ project  │ Just now  │
└─────────────────────────────────────┴──────────┴───────────┘
```

### Step 3: Update or Delete Secrets

To update a secret:
```bash
eas secret:delete --name EXPO_PUBLIC_SUPABASE_URL
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "new_value"
```

To delete a secret:
```bash
eas secret:delete --name SECRET_NAME
```

---

## Supabase Edge Functions Secrets

Backend API keys (OpenAI, Anthropic) should NEVER be exposed to the mobile app. They belong in Supabase Edge Functions.

### Step 1: Navigate to Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project: `manifest_the_unseen`
3. Navigate to **Project Settings** → **Edge Functions**

### Step 2: Add Backend Secrets

Add the following secrets in the Supabase dashboard:

| Secret Name          | Description                          | Example Value                           |
|---------------------|--------------------------------------|-----------------------------------------|
| `OPENAI_API_KEY`    | OpenAI API key for embeddings/GPT-4  | `sk-proj-YOUR_KEY_HERE`                 |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key for AI chat | `sk-ant-api03-YOUR_KEY_HERE`            |

### Step 3: Access Secrets in Edge Functions

In your Supabase Edge Functions (Deno), access secrets via:

```typescript
// supabase/functions/ai-chat/index.ts
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

if (!anthropicApiKey) {
  throw new Error('ANTHROPIC_API_KEY not configured in Supabase');
}
```

### Step 4: Test Locally with Edge Functions

Create a `.env.local` file in your `supabase/functions` directory (git-ignored):

```bash
# supabase/functions/.env.local
OPENAI_API_KEY=sk-proj-your_local_key
ANTHROPIC_API_KEY=sk-ant-api03-your_local_key
```

Run functions locally:
```bash
supabase functions serve --env-file ./supabase/functions/.env.local
```

---

## Security Best Practices

### 1. Never Commit Secrets to Git

Always keep these files git-ignored:
- `.env`
- `.env.local`
- `.env.*.local`
- `supabase/functions/.env.local`

### 2. Use Different Keys for Each Environment

| Environment  | Supabase Project   | RevenueCat Project | API Keys        |
|-------------|--------------------|--------------------|-----------------|
| Development | Local or Dev Cloud | Sandbox Mode       | Test/Dev Keys   |
| Preview     | Staging Cloud      | Sandbox Mode       | Staging Keys    |
| Production  | Production Cloud   | Production Mode    | Production Keys |

### 3. Rotate Keys Regularly

- Rotate API keys every 90 days minimum
- Immediately rotate if a key is compromised
- Use password manager (1Password, Bitwarden) to store keys securely

### 4. Limit Key Permissions

- OpenAI: Restrict API key to only required endpoints (embeddings, chat)
- Anthropic: Use project-specific API keys, not account-level
- Supabase: Never expose `service_role_key` to mobile app (use `anon_key` only)

### 5. Monitor Usage and Costs

- Set up billing alerts in OpenAI/Anthropic dashboards
- Monitor Supabase usage in dashboard
- Review RevenueCat analytics for subscription metrics

---

## Build Profiles and Secrets

Your `eas.json` defines three build profiles. Here's how secrets are used:

### Development Build
```json
"development": {
  "env": {
    "EXPO_PUBLIC_DEV_SKIP_AUTH": "true"  // Allow UI testing without auth
  }
}
```
- Uses local `.env` file for most values
- Skips authentication for rapid UI development

### Preview Build
```json
"preview": {
  "env": {
    "EXPO_PUBLIC_DEV_SKIP_AUTH": "false"  // Enforce real auth
  }
}
```
- Uses EAS Secrets for Supabase and RevenueCat
- Connects to staging/production backend
- Distributed via TestFlight for beta testing

### Production Build
```json
"production": {
  "env": {
    "EXPO_PUBLIC_DEV_SKIP_AUTH": "false"  // Enforce real auth
  }
}
```
- Uses EAS Secrets exclusively
- No local `.env` values
- Full production configuration

---

## Troubleshooting

### Problem: "EXPO_PUBLIC_SUPABASE_URL is undefined"

**Solution:**
1. Check if secret exists: `eas secret:list`
2. Rebuild app: `eas build --profile production --platform ios`
3. For local dev, ensure `.env` file exists with correct values

### Problem: "API key invalid" in Edge Function

**Solution:**
1. Verify secret in Supabase Dashboard → Edge Functions
2. Check spelling (case-sensitive): `OPENAI_API_KEY` not `OPENAI_KEY`
3. Test locally with `supabase functions serve --env-file`

### Problem: RevenueCat "Invalid API Key"

**Solution:**
1. Verify you're using the correct iOS SDK key (starts with `appl_`)
2. Check RevenueCat dashboard for key status (active/revoked)
3. Ensure `EXPO_PUBLIC_REVENUECAT_IOS_KEY` is set in EAS Secrets

### Problem: Local .env not being loaded

**Solution:**
1. Ensure file is named exactly `.env` (not `.env.txt`)
2. Restart Metro bundler: `npm start -- --reset-cache`
3. Check `app.config.ts` or `app.json` has proper env loading

### Problem: Secrets work locally but not in EAS build

**Solution:**
1. Verify secrets are set: `eas secret:list`
2. Check secret scope is `project`, not `account`
3. Rebuild with `eas build --clear-cache`

---

## Quick Reference Commands

```bash
# List all secrets
eas secret:list

# Create a new secret
eas secret:create --scope project --name SECRET_NAME --value "secret_value"

# Delete a secret
eas secret:delete --name SECRET_NAME

# Build with specific profile
eas build --profile production --platform ios

# Run local development server
npm start

# Test Supabase functions locally
supabase functions serve --env-file ./supabase/functions/.env.local
```

---

## Next Steps

After setting up secrets:

1. **Test Locally**: Verify app runs with `.env` file
2. **Create Preview Build**: `eas build --profile preview --platform ios`
3. **Test on Device**: Install via TestFlight and verify all features work
4. **Create Production Build**: `eas build --profile production --platform ios`
5. **Submit to App Store**: `eas submit --platform ios`

---

## Resources

- [EAS Secrets Documentation](https://docs.expo.dev/build-reference/variables/)
- [Supabase Edge Functions Environment Variables](https://supabase.com/docs/guides/functions/secrets)
- [RevenueCat API Keys Guide](https://www.revenuecat.com/docs/authentication)
- [Expo Environment Variables Guide](https://docs.expo.dev/guides/environment-variables/)

---

**Last Updated**: 2025-12-12
**Maintainer**: Manifest the Unseen Team
