# API Keys Setup Guide

This guide provides step-by-step instructions for obtaining all API keys required for the Manifest the Unseen iOS application.

## Table of Contents

1. [Overview](#overview)
2. [Anthropic Claude API](#anthropic-claude-api)
3. [OpenAI API](#openai-api)
4. [RevenueCat](#revenuecat)
5. [TelemetryDeck (Optional)](#telemetrydeck-optional)
6. [Sentry (Optional)](#sentry-optional)
7. [Apple Developer Configuration](#apple-developer-configuration)
8. [Environment Setup](#environment-setup)
9. [Security Best Practices](#security-best-practices)
10. [Cost Management](#cost-management)

---

## Overview

The Manifest the Unseen app requires API keys from several services:

| Service | Purpose | Priority | Cost |
|---------|---------|----------|------|
| Anthropic Claude | Primary AI monk companion chat | **Required** | Pay-per-use |
| OpenAI | Embeddings (RAG) + GPT-4 fallback | **Required** | Pay-per-use |
| RevenueCat | Subscription management | **Required** | Free tier available |
| Supabase | Backend (already configured in TASK-002) | **Required** | Free tier available |
| TelemetryDeck | Privacy-focused analytics | Optional | Free tier available |
| Sentry | Error tracking | Optional | Free tier available |
| Apple Developer | Sign-In with Apple | **Required** | $99/year |

**Estimated Monthly Costs** (after setup):
- **Month 1**: ~$40 (mostly AI API usage)
- **Month 6**: ~$175
- **Month 12**: ~$450-500

See [Cost Management](#cost-management) section for details.

---

## Anthropic Claude API

**Purpose**: Primary AI monk companion for wisdom chat feature (RAG-powered)

### 1. Create Account

1. Go to: https://console.anthropic.com/
2. Click **Sign Up** (or **Sign In** if you have account)
3. Verify email address
4. Complete account setup

### 2. Set Up Billing

1. Navigate to **Settings** → **Billing**
2. Add payment method (credit card)
3. **IMPORTANT**: Set up usage limits to prevent unexpected costs:
   - Recommended starting limit: **$50/month**
   - Alert threshold: **$40/month**

### 3. Create API Key

1. Go to **API Keys** section
2. Click **Create Key**
3. Name: `Manifest-the-Unseen-Dev` (or `Production` for prod)
4. Click **Create**
5. **IMPORTANT**: Copy the key immediately (starts with `sk-ant-`)
   - You cannot view it again after closing the dialog
   - Store in secure password manager (1Password, LastPass, etc.)

### 4. Note Key Format

```
sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5. API Configuration

**Model to Use**: `claude-sonnet-4-5-20250929` (Claude Sonnet 4.5)

**Pricing** (as of 2025):
- Input: $3 per million tokens
- Output: $15 per million tokens

**Estimated Usage**:
- Average chat message: ~1,500 tokens (500 input, 1,000 output)
- Cost per message: ~$0.016
- 1,000 messages/month: ~$16

### 6. Environment Variable

Add to `mobile/.env`:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

**Documentation**: https://docs.anthropic.com/claude/reference/getting-started-with-the-api

---

## OpenAI API

**Purpose**:
1. Text embeddings for RAG (primary use)
2. Whisper transcription (optional cloud fallback)
3. GPT-4 fallback for advanced reasoning

### 1. Create Account

1. Go to: https://platform.openai.com/
2. Click **Sign Up** (or **Sign In**)
3. Verify email and phone number
4. Complete account setup

### 2. Set Up Billing

1. Navigate to **Settings** → **Billing**
2. Add payment method
3. Add initial credit: **$10 minimum**
4. Set usage limits:
   - **Hard limit**: $100/month (prevents overspending)
   - **Soft limit**: $75/month (email alert)

### 3. Create API Key

1. Go to **API Keys** section: https://platform.openai.com/api-keys
2. Click **Create new secret key**
3. Name: `Manifest-the-Unseen-Dev`
4. Permissions: **All** (or restrict to specific models)
5. Click **Create secret key**
6. **IMPORTANT**: Copy the key immediately (starts with `sk-`)
   - Cannot be viewed again
   - Store in secure password manager

### 4. Note Key Format

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5. API Configuration

**Models to Use**:
- **Embeddings**: `text-embedding-3-small` (1536 dimensions)
- **Transcription**: `whisper-1` (optional, use on-device primarily)
- **Chat**: `gpt-4-turbo` (fallback only)

**Pricing** (as of 2025):
- Embeddings: $0.02 per million tokens (~3,000 pages)
- Whisper: $0.006 per minute (but we use on-device)
- GPT-4 Turbo: $10 input, $30 output per million tokens

**Estimated Usage**:
- Embeddings: ~$2-5/month (knowledge base search)
- Whisper: $0/month (using on-device transcription)
- GPT-4: ~$5/month (rare fallback usage)

### 6. Environment Variable

Add to `mobile/.env`:

```bash
OPENAI_API_KEY=sk-your-key-here
```

**Documentation**: https://platform.openai.com/docs/introduction

---

## RevenueCat

**Purpose**: Cross-platform subscription management (Apple App Store + future Google Play)

### 1. Create Account

1. Go to: https://www.revenuecat.com/
2. Click **Get Started Free**
3. Sign up with email or GitHub
4. Verify email
5. Complete onboarding survey (optional)

### 2. Create Project

1. Click **Create New Project**
2. Project name: `Manifest the Unseen`
3. Select platform: **iOS**
4. Click **Create**

### 3. Configure iOS App

1. In project dashboard, click **Add App**
2. Platform: **iOS**
3. App name: `Manifest the Unseen iOS`
4. Bundle ID: `com.yourcompany.manifesttheunseen` (must match Xcode)
5. Click **Save**

### 4. Create Products

You need to create 3 subscription products matching the tiers:

#### Novice Path
- **Product ID**: `novice_path_monthly` / `novice_path_yearly`
- **Price**: $7.99/month, $59.99/year
- **Trial**: 7 days free

#### Awakening Path
- **Product ID**: `awakening_path_monthly` / `awakening_path_yearly`
- **Price**: $12.99/month, $99.99/year
- **Trial**: 7 days free

#### Enlightenment Path
- **Product ID**: `enlightenment_path_monthly` / `enlightenment_path_yearly`
- **Price**: $19.99/month, $149.99/year
- **Trial**: 7 days free

**Note**: You'll create these in **App Store Connect** first, then import to RevenueCat.

### 5. Create Entitlements

Entitlements define what features users get with each subscription:

1. Go to **Entitlements** tab
2. Create entitlements:
   - `novice_access` → Phases 1-5, 3 meditations
   - `awakening_access` → Phases 1-8, 6 meditations
   - `enlightenment_access` → All phases, all meditations
   - `pro_voice_journaling` → 50/200/unlimited entries per month

### 6. Get API Keys

RevenueCat provides two types of keys:

#### Public SDK Key (iOS)
1. Go to project → **API Keys**
2. Find **Apple App Store** section
3. Copy **Public app-specific key**
4. Format: `appl_xxxxxxxxxxxxxxxxxxxxxxxx`

#### REST API Key (Backend)
1. Go to **API Keys** → **Public API Keys**
2. Click **Generate New Key**
3. Name: `Backend API Key`
4. Copy the key (starts with `sk_`)

### 7. Environment Variables

Add to `mobile/.env`:

```bash
# RevenueCat iOS Public Key (safe to embed in app)
REVENUECAT_API_KEY_IOS=appl_xxxxxxxxxxxxxxxxxxxx

# RevenueCat REST API Key (backend only, never in mobile app)
REVENUECAT_REST_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxx

# App ID (optional)
REVENUECAT_APP_ID=app_xxxxxxxxxxxxxxx
```

### 8. App Store Connect Setup

Before RevenueCat works, you must configure subscriptions in App Store Connect:

1. Go to: https://appstoreconnect.apple.com/
2. Navigate to **My Apps** → **[Your App]**
3. Go to **In-App Purchases** section
4. Create **Auto-Renewable Subscription Group**:
   - Group name: `Manifest the Unseen Tiers`
   - Reference name: `subscription_tiers`

5. Create 6 subscriptions (3 tiers × 2 durations):
   - Novice Path Monthly/Yearly
   - Awakening Path Monthly/Yearly
   - Enlightenment Path Monthly/Yearly

6. For each subscription:
   - Set product ID (must match RevenueCat)
   - Set pricing
   - Configure 7-day free trial
   - Add localized descriptions
   - Submit for review

7. Copy product IDs back to RevenueCat dashboard

### 9. Testing Setup

RevenueCat provides a sandbox environment for testing:

1. Create test user in RevenueCat dashboard
2. Use sandbox Apple ID for testing purchases
3. Enable **StoreKit Configuration** in Xcode for local testing

**Testing Checklist**:
- [ ] Free trial starts correctly
- [ ] Subscription renews after trial
- [ ] Entitlements unlock features
- [ ] Cancellation works
- [ ] Restore purchases works

**Documentation**: https://www.revenuecat.com/docs/getting-started

---

## TelemetryDeck (Optional)

**Purpose**: Privacy-focused analytics (recommended for App Store compliance)

### 1. Create Account

1. Go to: https://dashboard.telemetrydeck.com/
2. Sign up with email
3. Verify email

### 2. Create App

1. Click **Create New App**
2. App name: `Manifest the Unseen`
3. Platform: **iOS**
4. Click **Create**

### 3. Get App ID

1. Copy the **App ID** (UUID format)
2. Format: `XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`

### 4. Environment Variable

Add to `mobile/.env`:

```bash
TELEMETRYDECK_APP_ID=your-app-id-here
```

### 5. Pricing

- **Free tier**: 100,000 events/month
- **Paid tier**: $10/month for 1M events

**Documentation**: https://telemetrydeck.com/docs/

---

## Sentry (Optional)

**Purpose**: Error tracking and performance monitoring

### 1. Create Account

1. Go to: https://sentry.io/
2. Click **Sign Up**
3. Choose plan: **Free** (up to 5,000 events/month)

### 2. Create Project

1. Select platform: **React Native**
2. Project name: `manifest-the-unseen-mobile`
3. Click **Create Project**

### 3. Get DSN

1. After project creation, you'll see the DSN
2. Format: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`
3. Copy this for environment variables

### 4. Create Auth Token (for source maps)

1. Go to **Settings** → **Auth Tokens**
2. Click **Create New Token**
3. Scopes: `project:releases`, `project:write`
4. Copy token

### 5. Environment Variables

Add to `mobile/.env`:

```bash
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_AUTH_TOKEN=your-auth-token-here
```

### 6. Pricing

- **Free**: 5,000 events/month
- **Team**: $26/month for 50,000 events

**Documentation**: https://docs.sentry.io/platforms/react-native/

---

## Apple Developer Configuration

**Purpose**: Sign-In with Apple (primary authentication method)

### 1. Enroll in Apple Developer Program

1. Go to: https://developer.apple.com/programs/enroll/
2. Cost: **$99/year** (required for App Store)
3. Complete enrollment (can take 24-48 hours for approval)

### 2. Create App ID

1. Go to: https://developer.apple.com/account/resources/identifiers/list
2. Click **+** to create new identifier
3. Select **App IDs**
4. Type: **App**
5. Description: `Manifest the Unseen`
6. Bundle ID: `com.yourcompany.manifesttheunseen` (Explicit)
7. Capabilities:
   - **Sign In with Apple** ✓
   - **Push Notifications** ✓
   - **In-App Purchase** ✓
   - **Background Modes** ✓
8. Click **Continue** and **Register**

### 3. Create Services ID (for Sign-In with Apple)

1. Go to Identifiers → Click **+**
2. Select **Services IDs**
3. Description: `Manifest the Unseen Auth`
4. Identifier: `com.yourcompany.manifesttheunseen.services`
5. Click **Continue** and **Register**
6. Select the new Services ID
7. Enable **Sign In with Apple**
8. Click **Configure**
9. Primary App ID: Select your app ID
10. Website URLs:
    - Domains: `your-project-id.supabase.co`
    - Return URLs: `https://your-project-id.supabase.co/auth/v1/callback`
11. Click **Save** and **Continue**

### 4. Create Key for Sign-In with Apple

1. Go to: https://developer.apple.com/account/resources/authkeys/list
2. Click **+** to create new key
3. Key Name: `Manifest the Unseen Sign-In Key`
4. Enable: **Sign In with Apple**
5. Click **Configure** next to Sign In with Apple
6. Primary App ID: Select your app ID
7. Click **Save** and **Continue**
8. Click **Register**
9. **Download the key file** (.p8 file)
   - **IMPORTANT**: You can only download this ONCE
   - Store securely in password manager
10. Note the **Key ID** (10 characters)

### 5. Get Team ID

1. Go to: https://developer.apple.com/account/#/membership/
2. Copy your **Team ID** (10 characters)

### 6. Environment Variables

Add to `mobile/.env`:

```bash
APPLE_TEAM_ID=XXXXXXXXXX
APPLE_SERVICES_ID=com.yourcompany.manifesttheunseen.services
APPLE_KEY_ID=XXXXXXXXXX
```

**Note**: The `.p8` key file should be stored in Supabase Edge Function environment (not in mobile app).

### 7. Configure Supabase

You need to add Apple Sign-In to Supabase (extends TASK-002):

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Apple**
3. Fill in:
   - **Services ID**: `com.yourcompany.manifesttheunseen.services`
   - **Team ID**: Your Team ID
   - **Key ID**: Your Key ID
   - **Private Key**: Paste contents of `.p8` file

**Documentation**: https://supabase.com/docs/guides/auth/social-login/auth-apple

---

## Environment Setup

### 1. Update .env File

Copy the template and fill in all keys:

```bash
cd mobile
cp ../.env.example .env
```

Edit `mobile/.env`:

```bash
# =============================================================================
# Manifest the Unseen - Environment Variables
# =============================================================================

# -----------------------------------------------------------------------------
# Supabase Configuration (from TASK-002)
# -----------------------------------------------------------------------------
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# -----------------------------------------------------------------------------
# AI API Keys
# -----------------------------------------------------------------------------

# Anthropic Claude API (Primary AI monk companion)
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# OpenAI API (Embeddings + GPT-4 fallback)
OPENAI_API_KEY=sk-your-key-here

# -----------------------------------------------------------------------------
# RevenueCat Configuration (Subscriptions)
# -----------------------------------------------------------------------------

REVENUECAT_API_KEY_IOS=appl_your-ios-key-here
REVENUECAT_REST_API_KEY=sk_your-rest-api-key-here
REVENUECAT_APP_ID=app_your-app-id

# -----------------------------------------------------------------------------
# Analytics & Monitoring (Optional)
# -----------------------------------------------------------------------------

# TelemetryDeck (Privacy-focused analytics)
TELEMETRYDECK_APP_ID=your-telemetrydeck-app-id

# Sentry (Error tracking)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_AUTH_TOKEN=your-sentry-auth-token

# -----------------------------------------------------------------------------
# Apple Developer
# -----------------------------------------------------------------------------

APPLE_TEAM_ID=your-apple-team-id
APPLE_SERVICES_ID=com.yourcompany.manifesttheunseen.services
APPLE_KEY_ID=your-apple-key-id

# -----------------------------------------------------------------------------
# Environment Configuration
# -----------------------------------------------------------------------------

NODE_ENV=development
LOG_LEVEL=debug
DEBUG=true

# Feature flags
ENABLE_AI_CHAT=true
ENABLE_VOICE_JOURNALING=true
ENABLE_MEDITATIONS=true
ENABLE_VISION_BOARDS=true
ENABLE_ANALYTICS=false
```

### 2. Verify .env is Gitignored

Check `mobile/.gitignore`:

```bash
# Environment variables
.env
.env.local
.env.*.local
```

### 3. Test Environment Loading

Create test file `mobile/src/test/envTest.ts`:

```typescript
import Config from 'react-native-config';

export function testEnvVariables() {
  const checks = {
    'Supabase URL': !!Config.SUPABASE_URL,
    'Supabase Anon Key': !!Config.SUPABASE_ANON_KEY,
    'Anthropic API Key': !!Config.ANTHROPIC_API_KEY,
    'OpenAI API Key': !!Config.OPENAI_API_KEY,
    'RevenueCat iOS Key': !!Config.REVENUECAT_API_KEY_IOS,
    'Apple Team ID': !!Config.APPLE_TEAM_ID,
  };

  console.log('Environment Variables Check:');
  Object.entries(checks).forEach(([key, value]) => {
    console.log(`${key}: ${value ? '✓' : '✗'}`);
  });

  const allPresent = Object.values(checks).every(v => v);
  if (allPresent) {
    console.log('\n✓ All required environment variables are present!');
  } else {
    console.warn('\n✗ Some environment variables are missing!');
  }

  return allPresent;
}
```

---

## Security Best Practices

### 1. Key Storage

**DO**:
- Store production keys in password manager (1Password, LastPass)
- Use different keys for dev/staging/production
- Rotate keys every 90 days
- Keep `.env` in `.gitignore`

**DON'T**:
- Commit keys to Git (even private repos)
- Share keys via email/Slack
- Store in plaintext files
- Use production keys in development

### 2. Key Separation

Create separate environments:

```
mobile/.env.development
mobile/.env.staging
mobile/.env.production
```

Switch between them:

```bash
# Development
cp .env.development .env

# Production
cp .env.production .env
```

### 3. Service Role Key Protection

**CRITICAL**: `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security (RLS)

- **NEVER** use in mobile app
- **ONLY** use in backend scripts/Edge Functions
- Keep out of `mobile/.env` (use `supabase/.env` instead)

### 4. API Key Rotation Schedule

| Key | Rotation Frequency | Method |
|-----|-------------------|---------|
| Anthropic Claude | 90 days | Generate new in console |
| OpenAI | 90 days | Generate new in dashboard |
| RevenueCat | Yearly | Regenerate in settings |
| Supabase Anon | Never* | Only if compromised |
| Supabase Service Role | Yearly | Generate new key |

*Anon key is designed to be public (RLS protects data)

### 5. Monitoring & Alerts

Set up alerts for:
- **Usage spikes** (Claude/OpenAI)
- **Cost thresholds** ($50, $100, $150/month)
- **Failed API calls** (Sentry)
- **Unauthorized access attempts** (Supabase)

---

## Cost Management

### Monthly Cost Breakdown

#### Month 1 (1,000 users)
```
Supabase:           $0    (Free tier: 50K DB rows, 1GB storage)
OpenAI:            $10    (Embeddings: $5, occasional GPT-4: $5)
Anthropic Claude:  $30    (1,000 users × 2 chats × $0.016)
RevenueCat:         $0    (Free tier: <$10K MRR)
Sentry:             $0    (Free tier: 5K events/month)
TelemetryDeck:      $0    (Free tier: 100K events/month)
─────────────────────────
Total:            ~$40/month
```

#### Month 6 (8,000 users)
```
Supabase:          $25    (Pro: 500K DB rows, 8GB storage)
OpenAI:            $30    (Increased embedding searches)
Anthropic Claude: $100    (8,000 users × 3 chats avg × $0.016)
RevenueCat:         $0    (Still free: $18K MRR < $50K threshold)
Vercel (web):      $20    (Companion web app)
Sentry:             $0    (Free tier sufficient)
TelemetryDeck:      $0    (Free tier sufficient)
─────────────────────────
Total:           ~$175/month
```

#### Month 12 (25,000 users)
```
Supabase:          $75    (Pro with add-ons)
OpenAI:            $75    (Higher usage)
Anthropic Claude: $300    (25,000 users × 4 chats × $0.016)
RevenueCat:         $0    (Still free: $73K MRR < $100K)
Vercel:            $20    (Pro plan)
Sentry:            $26    (Team plan for better monitoring)
TelemetryDeck:      $0    (Free tier sufficient)
─────────────────────────
Total:           ~$496/month
```

**Revenue vs. Cost (Month 12)**:
- Revenue: $73,500 MRR
- Costs: $496/month
- **Profit Margin**: 99.3%

### Cost Optimization Tips

1. **Use pgvector for embeddings**: No external vector DB cost
2. **On-device Whisper**: No transcription API costs
3. **Cache AI responses**: Reduce duplicate API calls
4. **Implement rate limiting**: Prevent abuse
5. **Monitor usage dashboards**: Catch spikes early
6. **Use free tiers**: TelemetryDeck, RevenueCat, Sentry start free

### Setting Usage Limits

#### Anthropic Console
1. Settings → Billing → Usage Limits
2. Set monthly limit: $100 (adjust as needed)
3. Enable alert at 80%

#### OpenAI Dashboard
1. Settings → Billing → Usage Limits
2. Hard limit: $100/month
3. Soft limit: $75/month (email alert)

#### Supabase Dashboard
1. Settings → Billing → Usage
2. Monitor: Database size, Storage, Bandwidth
3. Enable email alerts

---

## Verification Checklist

After completing this guide, verify:

- [ ] **Anthropic**: API key obtained and tested
- [ ] **OpenAI**: API key obtained and tested
- [ ] **RevenueCat**: Account created, project configured
- [ ] **Supabase**: Keys from TASK-002 still valid
- [ ] **Apple Developer**: Account enrolled, App ID created
- [ ] **Sign-In with Apple**: Services ID and key configured
- [ ] **Environment**: All keys in `mobile/.env`
- [ ] **Security**: `.env` in `.gitignore`
- [ ] **Testing**: Environment variables load in app
- [ ] **Backup**: All keys stored in password manager

---

## Next Steps

1. Complete dependency installation: `docs/dependencies-setup-guide.md`
2. Test API connections with simple calls
3. Begin Week 2 feature development
4. Set up monitoring dashboards (Anthropic, OpenAI, Supabase)

---

## Support Resources

### API Documentation
- **Anthropic Claude**: https://docs.anthropic.com/
- **OpenAI**: https://platform.openai.com/docs
- **RevenueCat**: https://www.revenuecat.com/docs
- **Supabase**: https://supabase.com/docs
- **Apple Sign-In**: https://developer.apple.com/sign-in-with-apple/

### Support Contacts
- **Anthropic**: support@anthropic.com
- **OpenAI**: help.openai.com
- **RevenueCat**: support@revenuecat.com
- **Supabase**: Discord community
- **Apple Developer**: developer.apple.com/support

---

**Last Updated**: 2025-11-17
**Task**: TASK-2025-11-005
**Status**: Complete
