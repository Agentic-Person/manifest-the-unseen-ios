# MTU Project Status

**Last Updated**: 2026-01-07 (TestFlight Subscription Fixes)
**Project**: Manifest the Unseen iOS App
**Platform**: Mobile-First (iOS primary, Android future)
**Timeline**: Week 8 of 28 (App Store Submission Complete)
**Status**: 🟢 **PRE-BUILD FIXES** - TestFlight subscription system fixes complete

---

## 🔧 TESTFLIGHT SUBSCRIPTION FIXES - January 7, 2026

### Issues Fixed

| Issue | Root Cause | Fix Applied | Status |
|-------|------------|-------------|--------|
| **Buttons Not Clickable** | TestFlight mode skipped RevenueCat SDK, returning null offerings | Added mock offerings for TestFlight mode in `getOfferings()` | ✅ Fixed |
| **No UI Update After Purchase** | `loadSubscription()` overrides state in TestFlight mode | Added simulated purchase flow + direct state update | ✅ Fixed |
| **Trial/Tier Confusion** | Profile showed tier name without trial context | Enhanced `useSubscriptionSummary()` with trial days remaining | ✅ Fixed |
| **Can't Test Purchase Flow** | Auto-subscribed to Enlightenment in TestFlight | Added Test Mode toggle in debug panel | ✅ Fixed |

### Changes Made

**File: `mobile/src/services/subscriptionService.ts`**
- `getOfferings()`: Now returns mock offerings in TestFlight mode (like web mode)
- `purchasePackage()`: Simulates successful purchase in TestFlight/DEV mode, returns purchased tier info

**File: `mobile/src/stores/subscriptionStore.ts`**
- Added `testModeEnabled` state and `toggleTestMode()` action
- `loadSubscription()`: Respects testModeEnabled flag - shows as free user when enabled
- `purchasePackage()`: Directly updates state with purchased tier (doesn't rely on loadSubscription)
- Added `useTestMode()` selector hook

**File: `mobile/src/screens/subscription/PaywallScreen.tsx`**
- Added Test Mode toggle to debug overlay (tap title 5x to show)
- Shows test mode status and toggle button
- Visual indicator: "TestFlight Access" vs "Free User" mode

**File: `mobile/src/hooks/useSubscription.ts`**
- `useSubscriptionSummary()`: Now combines subscriptionStore + trialStore data
- Shows contextual status labels:
  - "TestFlight Access" - when in test environment with bypass active
  - "Trial - X days left" - when in local or subscription trial
  - "Active - Monthly/Annual" - when subscribed
  - "No Active Subscription" - when free with expired trial
- Shows "Free Trial" as tier name during trial period

### How Test Mode Works

1. Open PaywallScreen (tap "Manage" in Profile or any upgrade prompt)
2. Tap "Choose Your Path" title 5 times to show debug panel
3. Click "Enable Test Mode" to appear as a free user
4. All subscription buttons become clickable
5. Tap any button to simulate a purchase
6. UI updates immediately to show the purchased tier
7. Click "Disable Test Mode" to return to auto-subscribed state

### Profile Display Examples

| Scenario | Tier Name | Status Label |
|----------|-----------|--------------|
| TestFlight bypass active | Enlightenment Path | TestFlight Access |
| Local trial (5 days left) | Free Trial | Trial - 5 days left |
| Subscription trial (3 days) | Novice Path | Trial - 3 days left |
| Active monthly sub | Awakening Path | Active - Monthly |
| Cancelled subscription | Novice Path | Cancelled - Expires 1/15/2026 |
| Expired, no subscription | Free | No Active Subscription |

---

## 🎉 NEW FEATURE - January 7, 2026: Synchronized Prayer Text Display

### Feature Overview
Implemented a karaoke-style prayer player that displays prayer text line-by-line synchronized with audio playback. Users can read and speak prayers aloud as the narrator guides them.

### What Was Built

**New Files Created:**
| File | Purpose |
|------|---------|
| `mobile/src/components/prayer/PrayerTextDisplay.tsx` | Synchronized text display with fade animations |
| `mobile/src/components/prayer/index.ts` | Barrel export |
| `mobile/src/hooks/usePrayerTiming.ts` | Line timing calculation based on word count |
| `mobile/src/hooks/usePrayer.ts` | TanStack Query hooks for prayer data |
| `mobile/src/services/prayerService.ts` | Supabase CRUD operations for prayers |
| `supabase/migrations/20260104000000_prayers_audio_support.sql` | Added `audio_url` column to prayers table |

**Files Modified:**
| File | Changes |
|------|---------|
| `mobile/src/types/guru.ts` | Added `audio_url: string \| null` to Prayer interface |
| `mobile/src/types/navigation.ts` | Added `'prayer'` to meditationType, `prayerContent` param |
| `mobile/src/screens/meditation/MeditationPlayerScreen.tsx` | Integrated PrayerTextDisplay, conditional rendering |
| `mobile/src/screens/MeditateScreen.tsx` | Added "Prayers" tab with prayer cards |

### How It Works
1. **Auto-calculated timing**: Line timing based on word count ratio to total audio duration
2. **Single-line focus display**: Shows one line at a time, large and centered
3. **Fade animations**: Smooth 200ms out / 300ms in transitions between lines
4. **Progress indicators**: Dots showing current position in prayer
5. **Completion state**: Shows "Amen" when prayer finishes

### Prayer Audio Files Uploaded
Uploaded to Supabase Storage (`meditation-audio/prayers/`):
- ✅ `the-presence-within.m4a` (~21MB, ~8 min)
- ✅ `the-infinite-within.m4a` (~33MB, ~13 min)
- ✅ `the-temple-of-the-heart.m4a` (~29MB, ~12 min)

### Prayer Records Created in Database
| Title | Description | Duration |
|-------|-------------|----------|
| The Presence Within | Connect with the Divine presence in your spiritual heart | ~8 min |
| The Infinite Within | Journey from the small self to the infinite self | ~13 min |
| The Temple of the Heart | Healing journey into the sacred temple of your heart | ~12 min |

### Commits
- `2d635e6` - feat: add synchronized prayer text display for spoken prayers
- `efc4dbf` - chore: update prayerService to use meditation-audio bucket

### Testing
- Access prayers from: **Meditate tab → Prayers tab** (sparkles icon)
- Prayer cards display with play button
- Tap to open player with synchronized text display
- Text appears line-by-line as audio plays

---

## 🔍 PREVIOUS INVESTIGATION - January 6, 2026

### Issues Found During Build 41 Testing

| Issue | Description | Root Cause | Status |
|-------|-------------|------------|--------|
| **Trial/Tier Confusion** | Profile shows "Novice" but user has Guru access | 7-day trial grants Enlightenment access - working as designed but confusing UX | ✅ **Fixed Jan 7** |
| **Buttons Not Clickable** | Can't click subscribe on higher tiers | TestFlight mode skipped RevenueCat SDK, returning null offerings | ✅ **Fixed Jan 7** |
| **No UI Update After Purchase** | Tier indicators don't change after subscribing | `loadSubscription()` overrides state in TestFlight mode | ✅ **Fixed Jan 7** |
| **Product Images Wrong** | App images differ from App Store | **FIXED Jan 6** - Missing Review Screenshots in ASC (needed device-sized 1284x2778 images, not 1024x1024) | ✅ Fixed |

### ✅ App Store Connect Review Screenshots Fixed (Jan 6, 2026)
**Problem**: All 6 subscriptions showed "Missing Metadata" in App Store Connect

**Root Cause**: The "Review Information → Screenshot" field requires device-sized screenshots (1284x2778), not the 1024x1024 promotional images. The `iOS-Subscriptions` folder had the wrong size images.

**Solution**: Uploaded proper device screenshots from `snips/iOS-Subscriptions/ar-tall/` folder:
| Subscription | Status |
|--------------|--------|
| Novice Path Monthly | ✅ Ready to Submit |
| Novice Path Yearly | ✅ Ready to Submit |
| Awakening Path Monthly | ✅ Ready to Submit |
| Awakening Path Yearly | ✅ Ready to Submit |
| Enlightenment Path Monthly | ✅ Ready to Submit |
| Enlightenment Path Yearly | ✅ Ready to Submit |

### Root Cause Analysis

**Trial System Behavior (Working as Designed):**
- Users in 7-day trial get **Enlightenment-level access** regardless of subscription
- Profile shows actual RevenueCat tier → "Novice"
- Features use `effectiveTier` from trial → "Enlightenment" (with Guru access)
- This is intentional but causes UX confusion

**Fix Plan:**
1. Update Profile to show "Trial (X days left)" when in trial period
2. Fix UI refresh after purchase to update indicators immediately
3. Audit and fix product images in PaywallScreen

---

## 🔒 SECURITY AUDIT - December 25-26, 2025

**Full audit completed** - See `SecurityAudit.md` for details.

| Severity | Total | Fixed | Remaining |
|----------|-------|-------|-----------|
| CRITICAL | 5 | 5 | 0 ✅ |
| HIGH | 6 | 6 | 0 ✅ |
| MEDIUM | 11 | 2 | 9 |
| LOW | 3 | 0 | 3 |

### Critical & High Fixes Applied (Dec 25-26)
| ID | Issue | Status |
|----|-------|--------|
| C1 | Exposed API keys | ✅ FIXED - All keys rotated (Dec 26) |
| C2 | Hardcoded dev credentials | ✅ FIXED - Removed from authStore.ts |
| C3 | DEV_SKIP_AUTH bypass | ✅ FIXED - Removed entirely |
| C4 | Service role in Edge Functions | ✅ FIXED - Now uses anon+JWT |
| C5 | Weak account deletion | ✅ FIXED - Rate limiting + generic errors |
| H1 | Missing RLS policies | ✅ FIXED - Added UPDATE/DELETE |
| H2 | Unverified conversation ownership | ✅ FIXED - Added user_id check |
| H3 | Sensitive console logs | ✅ FIXED - Wrapped in __DEV__ |
| H4 | Permissive CORS (*) | ✅ FIXED - Restricted origins |
| H5 | No rate limiting on AI | ✅ FIXED - 50-100 req/24h limits |
| H6 | Journal encryption | 📋 DOCUMENTED - Plan in SecurityAudit.md |

### ✅ API Key Rotation Complete (Dec 26)
**Hybrid approach implemented:**
- ✅ **Mobile app**: New Supabase publishable key (`sb_publishable_...`)
- ✅ **Edge Functions**: Legacy JWT keys (required until Supabase adds support)
- ✅ **Anthropic API key**: Rotated and updated
- ✅ **OpenAI API key**: Rotated and updated
- ✅ **RevenueCat**: Existing `appl_` key retained (still valid)
- ✅ **MCP access token**: Rotated for Claude Code

**Files Updated:**
- `mobile/.env` - Publishable key + new AI keys
- `mobile/eas.json` - Publishable key in testflight/production profiles
- `.env.local` - All keys documented
- `.mcp.json` - New Supabase access token

**Manual Steps Completed:**
- [x] Update Edge Function secrets in Supabase Dashboard (ANTHROPIC_API_KEY, OPENAI_API_KEY) ✅ Dec 26
- [ ] Clean git history with `git filter-repo` (optional - old keys now invalid)

### ⚠️ JWT Key Compatibility Issue Discovered & Resolved (Dec 26)

**Problem Found:** After rotating JWT signing keys, Edge Functions returned `401 Invalid JWT`.

**Root Cause:**
- Supabase offers two JWT signing algorithms: Legacy HS256 and new ECC (P-256) / ES256
- User rotated to ES256, but Edge Function gateway does NOT support ES256 token validation
- Access tokens signed with ES256 were rejected at the gateway level (before function code runs)

**Resolution:**
1. Reverted JWT signing key back to **Legacy HS256** in Supabase Dashboard
2. Edge Functions now validate HS256-signed tokens correctly
3. Guru AI and all Edge Functions working again

**Key Lesson Documented:**
- Edge Function gateway requires HS256 (Legacy) JWT signing
- ES256 (ECC P-256) tokens are rejected with "Invalid JWT" at gateway level
- Config documented in `supabase/config.toml` for future reference

**Files Updated:**
- `supabase/config.toml` - Added explicit `verify_jwt = true` for all functions with detailed comments
- Git commit: `70d00d1` - config: add Edge Function JWT verification settings with documentation

### Edge Functions Deployed (Dec 25)
```
✓ validate-promo (70.31kB) - Security refactored
✓ delete-account (69.29kB) - CORS + error handling
✓ guru-analysis (87.17kB) - CORS restricted
✓ ai-chat (71.17kB) - CORS restricted
```

---

## 📱 SUBSCRIPTION SYSTEM - December 27-28, 2025

### Build 34 (Dec 27) - Subscription Sync Fixes
- ✅ **ProfileScreen** now uses RevenueCat tier (was reading stale database tier)
- ✅ **subscriptionStore** syncs database after purchase/restore
- ✅ **Production profile** has `TESTFLIGHT_FULL_ACCESS=false` (no bypass)

### RevenueCat Investigation (Dec 27-28)
**Issue:** Features locked despite previous sandbox purchases

**Root Cause Found:**
- Old "default" offering (Dec 8) had products NOT attached to entitlements
- Customer purchased `monthly`/`yearly` → no entitlements granted
- "current" offering (Dec 12) has properly configured products
- "current" is now the default → new purchases should work

**Product Configuration:**
| Product | Entitlement | Status |
|---------|-------------|--------|
| `monthly` (old) | None | ❌ Unattached |
| `yearly` (old) | None | ❌ Unattached |
| `manifest_enlightenment_monthly` | enlightenment_path | ✅ Attached |
| `manifest_enlightenment_yearly` | enlightenment_path | ✅ Attached |
| `manifest_awakening_monthly` | awakening_path | ✅ Attached |
| `manifest_awakening_yearly` | awakening_path | ✅ Attached |
| `manifest_novice_monthly` | novice_path | ✅ Attached |
| `manifest_novice_yearly` | novice_path | ✅ Attached |

### PaywallScreen Loading Fix (Dec 28)
**Issue:** Clicking "Manage" button showed infinite loading spinner

**Root Cause:** PaywallScreen condition `isLoadingOfferings || !offerings` kept showing spinner when:
- `isLoadingOfferings = false` (loading complete)
- `offerings = null` (RevenueCat failed to fetch)

**Fix Applied:**
- Separated loading state from error state
- Show error UI with "Try Again" button when offerings fail
- Commit: `37f7369`

### Build 35 (Dec 28) - PaywallScreen Fix
- ✅ Fixed infinite loading spinner when RevenueCat offerings fail
- ✅ Added error UI with "Try Again" button
- ⚠️ **Issue discovered:** All features locked for free users (wrong FEATURE_LIMITS)

### Build 36 (Dec 28) - Feature Gating Fix + Guru Rate Limiting (BROKEN)
**Issue:** Free users had NO access to workbook/meditations when RevenueCat failed

**Root Cause:** `FEATURE_LIMITS.free` had `maxPhase: 0` and `maxMeditations: 0`

**Fixes Applied:**
- ✅ **FEATURE_LIMITS.free** updated: Full access during 7-day trial
- ✅ **FEATURE_LIMITS.novice** updated: Guru locked (must upgrade to Awakening)
- ✅ **Guru rate limiting** added: Free/trial users get 3 requests/day
- ✅ **Rate limit modal** added: Shows upgrade prompt when limit exceeded
- ✅ **Documentation** added: `docs/SUBSCRIPTION_FEATURE_GATING.md`

**Problem Discovered:** Build 36 used `production` profile which disabled TestFlight bypass. User's account had no real paid subscription - everything broke.

### Build 37 (Dec 28) - Complete Trial System Overhaul
**Issue:** Build 36 conflated "free tier" with "7-day trial" - wrong approach

**Root Cause Analysis:**
- TestFlight bypass was disabled in production builds
- User had no real RevenueCat subscription
- `FEATURE_LIMITS.free` giving full access meant trial expired users also got access (wrong)
- RevenueCat only tracks trials WITHIN subscriptions, not standalone 7-day trials

**Solution - Separate Trial Tracking:**
- ✅ **trialStore.ts** NEW: Tracks 7-day trial via AsyncStorage (independent of RevenueCat)
- ✅ **FEATURE_LIMITS.free** REVERTED: Back to locked (maxPhase: 0, maxMeditations: 0)
- ✅ **useEffectiveAccess hook** NEW: Combines trial status + subscription tier
- ✅ **subscriptionStore.ts** FIX: Added 10-second timeout to loadSubscription
- ✅ **App.tsx** UPDATED: Initializes trial on startup
- ✅ **GuruScreen, WorkbookScreen, MeditateScreen** UPDATED: Use useEffectiveAccess

**New Architecture:**
```
Trial users (first 7 days) → trialStore.isInTrialPeriod = true
                          → useEffectiveAccess returns Enlightenment-level access
                          → Guru rate-limited to 3/day

Trial expired, no sub     → trialStore.isInTrialPeriod = false
                          → tier = 'free' from RevenueCat
                          → useEffectiveAccess returns LOCKED (FEATURE_LIMITS.free)

Paid subscribers          → tier from RevenueCat (novice/awakening/enlightenment)
                          → useEffectiveAccess returns tier's limits
                          → Awakening+ = unlimited Guru
```

**Files Created:**
- `mobile/src/stores/trialStore.ts` - 7-day trial tracking

**Files Modified:**
- `mobile/src/types/subscription.ts` - Reverted FEATURE_LIMITS.free to locked
- `mobile/src/hooks/useSubscription.ts` - Added useEffectiveAccess hook
- `mobile/src/stores/subscriptionStore.ts` - Added timeout
- `mobile/src/stores/index.ts` - Export trialStore
- `mobile/App.tsx` - Initialize trial on startup
- `mobile/src/screens/GuruScreen.tsx` - Use useEffectiveAccess
- `mobile/src/screens/WorkbookScreen.tsx` - Use useEffectiveAccess
- `mobile/src/screens/MeditateScreen.tsx` - Use useEffectiveAccess

### Build 38 (Dec 28) - Guru Access Fix + Offerings Timeout
**Issues Found in Build 37:**
1. Guru still said "need Awakening path" for trial users
2. "Unable to load subscriptions" error on PaywallScreen

**Root Causes:**
1. `useGuru.ts` used `useGuruAccess()` which doesn't check trial status
2. `loadOfferings()` had no timeout - hung forever if RevenueCat slow

**Fixes Applied:**
- ✅ **useGuru.ts** FIX: Uses `useEffectiveAccess().hasGuruAnalysis` instead of `useGuruAccess()`
- ✅ **subscriptionStore.ts** FIX: Added 10-second timeout to `loadOfferings()`

**Files Modified:**
- `mobile/src/hooks/useGuru.ts` - Use useEffectiveAccess
- `mobile/src/stores/subscriptionStore.ts` - Timeout on loadOfferings

**Business Model (Final):**
| Tier | Workbook | Meditations | Guru |
|------|----------|-------------|------|
| Trial (7 days) | ✅ All phases | ✅ All | ✅ **3/day** |
| Free (trial expired) | ❌ Locked | ❌ Locked | ❌ Locked |
| Novice | ✅ All phases | ✅ Music only | ❌ Locked |
| Awakening+ | ✅ All phases | ✅ All | ✅ Unlimited |

### Build 39 (Dec 29) - RevenueCat Integration Fix + 3-Tier Paywall
**Critical Issues Found:**
1. Code searched for wrong package IDs (`monthly`, `yearly`, `lifetime`)
2. RevenueCat has different package IDs (`novice_monthly`, `awakening_annual`, etc.)
3. 4 App Store products were missing entitlement attachments
4. All TestFlight builds bypassed RevenueCat (never tested real purchases)

**Root Cause Analysis (via RevenueCat Dashboard Screenshots):**
- Code's `findPackage()` looked for `PRODUCT_IDS.MONTHLY` = `'monthly'`
- RevenueCat "current" offering has packages: `novice_monthly`, `awakening_monthly`, `enlightenment_monthly`, etc.
- Result: `getOfferings()` returned NULL for all packages → no offerings displayed

**Fixes Applied:**
- ✅ **subscription.ts** - Updated `SubscriptionOffering` type for 6 packages (3 tiers × monthly/annual)
- ✅ **subscription.ts** - Added `PACKAGE_IDS` constant matching RevenueCat identifiers
- ✅ **subscriptionService.ts** - Rewrote `getOfferings()` with `findPackageById()` function
- ✅ **PaywallScreen.tsx** - Redesigned with tier selector tabs (Novice/Awakening/Enlightenment)
- ✅ **eas.json** - Added `testflight-sandbox` profile (`TESTFLIGHT_FULL_ACCESS=false`)
- ✅ **RevenueCat Dashboard** - Attached entitlements to all 6 App Store products

**Files Modified:**
- `mobile/src/types/subscription.ts` - SubscriptionOffering type + PACKAGE_IDS
- `mobile/src/services/subscriptionService.ts` - getOfferings() rewrite
- `mobile/src/screens/subscription/PaywallScreen.tsx` - 3-tier UI
- `mobile/eas.json` - testflight-sandbox profile

**New Build Profiles:**
| Profile | TESTFLIGHT_FULL_ACCESS | RevenueCat | Use For |
|---------|------------------------|------------|---------|
| `testflight` | `true` | Bypassed | Beta testing (full access) |
| `testflight-sandbox` | `false` | **Connected** | Testing real purchases |
| `production` | `false` | Connected | App Store release |

**Package ID Mapping (Code → RevenueCat):**
| Code Package ID | RevenueCat Package | Product | Entitlement |
|-----------------|-------------------|---------|-------------|
| `novice_monthly` | `novice_monthly` | `manifest_novice_monthly` | `novice_path` |
| `novice_annual` | `novice_annual` | `manifest_novice_yearly` | `novice_path` |
| `awakening_monthly` | `awakening_monthly` | `manifest_awakening_monthly` | `awakening_path` |
| `awakening_annual` | `awakening_annual` | `manifest_awakening_yearly` | `awakening_path` |
| `enlightenment_monthly` | `enlightenment_monthly` | `manifest_enlightenment_monthly` | `enlightenment_path` |
| `enlightenment_annual` | `enlightenment_annual` | `manifest_enlightenment_yearly` | `enlightenment_path` |

**Commits:**
- `767e215` - feat: fix RevenueCat integration with 3-tier paywall
- `986f6d1` - build: increment iOS build number to 39

### App Store Connect Subscription Metadata Fix (Dec 29)
**Issue:** RevenueCat failing to fetch offerings - products showing "Missing Metadata" in App Store Connect

**Root Cause:**
- Subscription group localization was not configured
- Individual subscription availability was not set up (countries/regions)

**Fixes Applied via Playwright MCP (App Store Connect):**
1. ✅ **Subscription Group Localization** - Added "Premium Access" display name for English (U.S.)
2. ✅ **Availability Configuration** - Set all 175 countries/regions for each subscription

| Product ID | Display Name | Price | Duration | Availability |
|------------|--------------|-------|----------|--------------|
| manifest_novice_monthly | Novice Path Monthly | $7.99 | 1 month | 175 countries ✅ |
| manifest_novice_yearly | Novice Path Yearly | $79.99 | 1 year | 175 countries ✅ |
| manifest_awakening_monthly | Awakening Path Monthly | $19.99 | 1 month | 175 countries ✅ |
| manifest_awakening_yearly | Awakening Path Yearly | $199.99 | 1 year | 175 countries ✅ |
| manifest_enlightenment_monthly | Enlightenment Path Monthly | $49.99 | 1 month | 175 countries ✅ |
| manifest_enlightenment_yearly | Enlightenment Path Yearly | $499.99 | 1 year | 175 countries ✅ |

**Verified Configuration:**
- ✅ Pricing already set correctly for all 6 products
- ✅ Subscription durations correct (monthly = 1 month, yearly = 1 year)
- ✅ Individual localization (display name + description) already configured
- ✅ Subscription group localization now configured ("Premium Access")
- ✅ All subscriptions available in 175 countries/regions

**Note:** Subscriptions may still show "Missing Metadata" until Review Screenshot is added (required for App Store submission but not for RevenueCat). RevenueCat should now be able to fetch offerings.

### Build 40 (Dec 29) - RevenueCat Debug Overlay
**Issue:** Offerings not loading in TestFlight - error appears IMMEDIATELY (not after timeout)

**Debug Investigation via Playwright:**
- ✅ RevenueCat dashboard verified: "current" offering exists with 6 packages
- ✅ Package IDs match code exactly (`novice_monthly`, `novice_annual`, etc.)
- ✅ All products attached to entitlements
- ✅ API key in eas.json matches RevenueCat dashboard
- ✅ In-App Purchase Key and App Store Connect API both show "Valid credentials"

**Likely Root Cause:** SDK not configured at runtime (API key possibly empty or missing Sandbox Apple ID)

**Debug Features Added:**
- ✅ **RevenueCatDebugState** - Tracks SDK configuration status, API key presence, errors
- ✅ **Debug Overlay on PaywallScreen** - Shows all debug info on error screen (always visible)
- ✅ **Sandbox Account Instructions** - In-app guide for setting up Sandbox Apple ID

**Files Modified:**
- `mobile/src/services/subscriptionService.ts` - Added debug state tracker + `getRevenueCatDebugState()`
- `mobile/src/screens/subscription/PaywallScreen.tsx` - Added DebugOverlay component

**Debug Overlay Shows:**
- Platform, __DEV__ status, TestFlight bypass mode
- API Key present (true/false), API Key prefix
- SDK configuration attempted, SDK configured (true/false)
- Configuration error message (if any)
- Last offerings attempt timestamp
- Offerings response details (has current, package count, IDs)

**Next Steps:**
1. Build with: `cd mobile && eas build --platform ios --profile testflight-sandbox`
2. Set up Sandbox Apple ID: Settings → App Store → Sandbox Account
3. Test on device and check debug overlay output
4. Fix based on revealed error

**Commits:**
- `6e7a39e` - feat: add RevenueCat debug overlay for TestFlight debugging
- `dbebf6d` - docs: update project status with RevenueCat debugging progress

### ✅ RESOLVED (Dec 30) - Paid Apps Agreement Now Active!

**Issue:** RevenueCat could not fetch offerings/products from App Store Connect

**Root Cause:** Paid Apps Agreement was not signed in App Store Connect

**Resolution Timeline:**
1. ✅ **Legal Entity Information** - Updated in App Store Connect
2. ✅ **Banking Information** - Verified and Active (Blaze account ending 2079)
3. ✅ **Paid Apps Agreement** - Signed and Active (Dec 30, 2025 - Dec 2, 2026)
4. ✅ **Tax Forms** - U.S. Form W-9 Active

**Final Status (Verified Dec 30, 2025):**

| Section | Item | Status |
|---------|------|--------|
| **Agreements** | Paid Apps Agreement | ✅ **Active** (Dec 30, 2025 - Dec 2, 2026) |
| | Free Apps Agreement | ✅ Active |
| **Bank Accounts** | Blaze (2079) - USD | ✅ **Active** |
| **Tax Forms** | U.S. Form W-9 | ✅ Active |
| **Compliance** | Digital Services Act | ✅ Active |

**Next Step:** Test subscriptions in TestFlight - RevenueCat should now fetch offerings successfully!

**Code Status:** ✅ No code changes needed - RevenueCat integration was correct all along. This was purely an Apple administrative/legal issue.

---

## 🎉 MILESTONE: App Store Resubmission Complete!

| Item | Value |
|------|-------|
| **Version** | 1.0.0 |
| **Build (App Store)** | 29 (production profile) |
| **Build (TestFlight)** | 30 (testflight profile) |
| **Build (Latest)** | 41 (testflight-sandbox - Jan 4, Purchase spinner fix) |
| **Git Tag** | `v1.0.0-beta.13` |
| **App Store Status** | 🟡 Waiting for Review |
| **Submission Date** | December 25, 2025 12:35 PM |
| **Submission ID** | 2115db35-9f20-4543-84eb-40979f7a6eb4 |

### Previous Rejection (Build 13 - Dec 15, 2025)
- **Guideline 2.1 - Performance - App Completeness**
- **Bug:** "no further action occurred after tapping on any features in Profile tab"
- **Device:** iPad Air (5th generation), iPadOS 26.1

### Build Profiles (eas.json)
| Profile | Command | Purpose |
|---------|---------|---------|
| `testflight` | `eas build --profile testflight` | Testing with full access bypass enabled |
| `testflight-sandbox` | `eas build --profile testflight-sandbox` | **Auto-submits to TestFlight**, RevenueCat enabled |
| `production` | `eas build --profile production` | App Store (RevenueCat enabled, no bypasses) |

**What's Included in Build 32+ (Post-Security Fixes - Dec 25):**
- ✅ **DEV_SKIP_AUTH removed entirely** - No more auth bypass in any build
- ✅ **Edge Functions secured** - CORS restricted, service role minimized
- ✅ **RLS policies complete** - All tables have proper access control
- ⚠️ **All builds require real authentication** - No dev shortcuts

**What's Included in Build 30 (TestFlight Testing - Dec 25):**
- ✅ **TestFlight build profile** - TESTFLIGHT_FULL_ACCESS=true (bypasses subscription)
- ✅ All compliance features from Build 28/29
- ⚠️ **FOR TESTING ONLY** - Not for App Store submission

**What's Included in Build 29 (App Store Resubmission - Dec 25):**
- ✅ **Production build profile** - TESTFLIGHT_FULL_ACCESS=false
- ✅ **RevenueCat fully enabled** - Real subscription flow for App Store
- ✅ All compliance features from Build 28
- ⚠️ **FOR APP STORE ONLY** - Use Build 30 for TestFlight testing

**What's Included in Build 28 (App Store Compliance - Dec 25):**
- ✅ **Account Deletion** (Apple Guideline 5.1.1) - Two-step confirmation with password re-entry
- ✅ **Data Export** (GDPR/Privacy) - Export all user data as JSON from Privacy & Security
- ✅ **iOS Permission Descriptions** - NSMicrophoneUsageDescription, NSPhotoLibraryUsageDescription, NSCameraUsageDescription, NSFaceIDUsageDescription
- ✅ **Production Env Vars Fixed** - DEV_SKIP_AUTH and TESTFLIGHT_FULL_ACCESS set to false
- ✅ **TEST MODE Hidden** - Wrapped in `__DEV__` check (hidden in production builds)
- ✅ **delete-account Edge Function** - Deployed to Supabase for cascade user deletion
- ✅ **Playwright Compliance Tests** - Automated tests for App Store requirements
- ✅ **expo-sharing** package installed for data export

**What's Included in Build 27 (previous):**
- ✅ APS branded splash screen (black background)
- ✅ Guru AI fully functional with API keys configured
- ✅ All bug fixes from Dec 18-20 sessions
- ✅ **Guru navigation loop bug fixed** - Phase selection no longer loops back
- ✅ **Workbook update re-assessment** - Guru fetches fresh data after workbook changes
- ✅ **3 permanent test accounts** - Novice, Awakening, Enlightenment tiers for QA
- ✅ **Promo Code System** - EARLY50 code for 50% off first 3 months (30 user limit)
- ✅ **Profile Section Enhancements** (Dec 21):
  - Avatar upload to Supabase Storage (tap to change)
  - Global font size scaling (Small/Medium/Large via FontSizeContext)
  - Spoken prayer reminders with custom times (PrayerTimePicker component)
  - Legal text updated to "Agentic Personnel LLC" in About & Terms screens

**What's Included in Build 24 (current TestFlight):**
- ✅ All 10 Workbook Phases (35 screens)
- ✅ Voice Journal with Whisper transcription
- ✅ AI Guru Chat (Claude-powered)
- ✅ Meditation Player with guided sessions
- ✅ Breathing Exercises (Box, Deep, Calm)
- ✅ Dark Mode UI throughout
- ✅ RevenueCat subscription integration
- ✅ **Full Profile/Settings screens** (8 new screens with iOS integrations)
- ✅ **Security hardening** (RLS enabled, function search_path fixed)
- ✅ **TestFlight full access** (bypasses subscription gating for testing)
- ✅ **Auto-save race condition fix** (all 35 workbook screens)
- ✅ **Guru Analysis Edge Function fixes** (function name, request format, worksheet counts)

**Known Issues:**
- ✅ ~~Habit tracking progress not saving~~ - **FIXED in Build 15**
- ✅ ~~Guru not recognizing completed phases~~ - **FIXED in Build 16**
- ✅ ~~Guru AI Authentication Error~~ - **FIXED**: `guruService.ts` now uses `ai_conversations` table with proper filters
- ✅ ~~Guru AI Enhancement~~ - **COMPLETE**: Dynamic workbook analysis with life area detection deployed
- ✅ ~~TestFlight features locked~~ - **FIXED in Build 23**: Added `EXPO_PUBLIC_TESTFLIGHT_FULL_ACCESS` env var
- ✅ ~~Splash screen red cube~~ - **FIXED in Build 25**: APS branded splash on black background
- ⚠️ **Push notifications temporarily disabled** - Provisioning profile needs regeneration (Build 21+)

---

## ⚠️ Critical Dependencies & Breaking Change Risks

### Supabase Edge Function Secrets (REQUIRED)
The Guru AI feature **will not work** without these secrets set in Supabase:

| Secret | Purpose | How to Set |
|--------|---------|------------|
| `ANTHROPIC_API_KEY` | Claude API for Guru responses | `npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-... --project-ref zbyszxtwzoylyygtexdr` |
| `OPENAI_API_KEY` | Embeddings for RAG search | `npx supabase secrets set OPENAI_API_KEY=sk-proj-... --project-ref zbyszxtwzoylyygtexdr` |

**If these are missing/expired:** Guru AI returns 400 Bad Request errors.

### Database Schema Dependencies
| Table | Required For | Risk If Changed |
|-------|--------------|-----------------|
| `workbook_progress` | Guru analysis, phase completion | Breaking: Guru won't detect completed phases |
| `ai_conversations` | Guru chat history | Breaking: Conversations won't persist |
| `meditations` | Smart meditation suggestions | Medium: Falls back to phase-based suggestions |
| `knowledge_embeddings` | RAG search for Guru | Medium: Guru has less context |

### Worksheet ID Mappings (CRITICAL)
Phase 1 worksheets must use these exact IDs (defined in `types/workbook.ts`):

| Display Name | Database ID | Screen |
|--------------|-------------|--------|
| Habit Tracking | `habits-audit` | HabitTracking |
| Personal Values | `values-assessment` | PersonalValues |
| Wheel of Life | `wheel-of-life` | WheelOfLife |

**If mismatched:** Progress shows 0%, Guru can't analyze phase.

### Subscription Tier Checks
| Feature | Required Tier | Check Location |
|---------|---------------|----------------|
| Guru AI | Awakening+ | `useGuru.ts`, Edge Function |
| All Meditations | Awakening+ | `MeditateScreen.tsx` |
| Unlimited Journals | Enlightenment | `JournalScreen.tsx` |

**TestFlight Bypass:** `EXPO_PUBLIC_TESTFLIGHT_FULL_ACCESS=true` grants enlightenment access.

### Recent Commits Reference
```
986f6d1 build: increment iOS build number to 39
767e215 feat: fix RevenueCat integration with 3-tier paywall
a9c4f3c fix: Build 38 - fix Guru trial access and offerings timeout
e7b8441 fix: Build 37 - proper trial tracking system
3246f48 feat: fix feature gating for free users + add Guru rate limiting (3/day)
37f7369 fix: PaywallScreen infinite loading spinner when offerings fail
```

---

## Quick Status

### Current Phase
**Week 8 of 28**: APP STORE SUBMISSION COMPLETE 🍎
- **Started**: November 17, 2025
- **App Store Submitted**: December 13, 2025
- **Actual Status**: ✅ MVP COMPLETE - Awaiting Apple Review (24-48 hours typical)

### Last Activity
- **Date**: January 7, 2026 - TestFlight Subscription System Fixes
- **Duration**: ~2 hours
- **What Was Done**: Fixed all TestFlight subscription issues found during Build 41 testing
- **Status**: ✅ **COMPLETE** - All 4 issues fixed, ready for new build
- **Issues Fixed**:
  - Buttons not clickable on higher tiers → Mock offerings for TestFlight
  - UI not updating after purchase → Direct state update + simulated purchase
  - Trial/Tier confusion in Profile → Enhanced status labels with trial days
  - Can't test purchase flow → Test Mode toggle in debug panel
- **Files Modified**:
  - `subscriptionService.ts`, `subscriptionStore.ts`, `PaywallScreen.tsx`, `useSubscription.ts`

### Previous Activity
- **Date**: January 7, 2026 - Synchronized Prayer Text Display Feature
- **Duration**: ~3 hours
- **What Was Done**: Implemented karaoke-style prayer player with synchronized text display
- **Status**: ✅ **COMPLETE** - Feature fully implemented and tested
- **New Feature**:
  - Prayer text displays line-by-line synchronized with audio playback
  - Auto-calculated timing based on word count ratio
  - Fade animations between lines
  - "Prayers" tab added to Meditate screen
- **Audio Files Uploaded**:
  - The Presence Within (~8 min)
  - The Infinite Within (~13 min)
  - The Temple of the Heart (~12 min)
- **Commits**:
  - `2d635e6` - feat: add synchronized prayer text display for spoken prayers
  - `efc4dbf` - chore: update prayerService to use meditation-audio bucket

### Previous Activity
- **Date**: January 6, 2026 - Build 41 Testing: Issues Found
- **Duration**: ~2 hours (build + testing + investigation)
- **What Was Done**: Built and tested Build 41, discovered subscription system issues
- **Status**: 🟡 **INVESTIGATING** - Multiple issues found during testing

### Previous Activity
- **Date**: January 4, 2026 - Build 41: Purchase Spinner Fix
- **Duration**: ~1 hour
- **What Was Done**: Fixed purchase flow hanging after Apple authentication + configured auto-submit
- **Status**: ✅ **COMPLETE** - Build 41 submitted to TestFlight
- **Commits**: `0e980f5`, `c160958`, `39c48f1`

### Previous Activity
- **Date**: December 30, 2025 - Paid Apps Agreement RESOLVED! 🎉
- **Duration**: ~1 hour (total investigation + resolution)
- **What Was Done**: Identified root cause AND confirmed resolution of RevenueCat subscription issues
- **Status**: ✅ **RESOLVED** - Paid Apps Agreement now Active
- **Key Changes**: Paid Apps Agreement signed, Banking verified, Tax Forms active

### Previous Activity
- **Date**: December 29, 2025 - Build 40: RevenueCat Debug Overlay
- **Duration**: ~1 hour
- **What Was Done**: Added comprehensive debug overlay to diagnose RevenueCat offerings loading failure
- **Status**: ✅ **COMPLETE** - Debug overlay helped identify root cause
- **Key Changes**:
  - NEW: `RevenueCatDebugState` tracker in subscriptionService.ts
  - NEW: Debug overlay component on PaywallScreen (visible on error)
  - NEW: Sandbox account setup instructions displayed on error screen
  - FIX: Early return from getOfferings() if SDK not configured (with error message)
- **Commits**:
  - `6e7a39e` - feat: add RevenueCat debug overlay for TestFlight debugging
  - `dbebf6d` - docs: update project status with RevenueCat debugging progress

### Previous Activity
- **Date**: December 29, 2025 - App Store Connect Subscription Metadata Configuration
- **Duration**: ~1 hour
- **What Was Done**: Configured missing subscription metadata in App Store Connect via Playwright MCP
- **Status**: ✅ **COMPLETE** - All 6 subscriptions now have availability and group localization

### Previous Activity
- **Date**: December 29, 2025 - Build 39: RevenueCat Integration Fix + 3-Tier Paywall
- **Duration**: ~3 hours
- **What Was Done**: Fixed critical RevenueCat package ID mismatch + redesigned paywall for 3 tiers
- **Status**: ✅ **COMPLETE** - Build 39 submitted to TestFlight
- **Commits**:
  - `986f6d1` - build: increment iOS build number to 39
  - `767e215` - feat: fix RevenueCat integration with 3-tier paywall
- **Key Changes**:
  - FIX: `SubscriptionOffering` type now has 6 packages (novice/awakening/enlightenment × monthly/annual)
  - FIX: `getOfferings()` uses correct RevenueCat package IDs (`novice_monthly`, etc.)
  - NEW: `findPackageById()` helper matches RevenueCat package identifiers
  - NEW: PaywallScreen has tier selector tabs (Novice/Awakening/Enlightenment)
  - NEW: `testflight-sandbox` build profile (`TESTFLIGHT_FULL_ACCESS=false`)
  - FIX: RevenueCat entitlements attached to all 6 App Store products (manual)

### Previous Activity
- **Date**: December 28, 2025 - Build 38: Trial System Fix + Guru Access Fix
- **Duration**: ~4 hours (Builds 36-38)
- **What Was Done**: Complete trial system overhaul + fixed remaining access issues
- **Status**: ✅ **COMPLETE** - Build 38 submitted to TestFlight

### Previous Activity
- **Date**: December 27, 2025 - Build 34 + Subscription System Fixes
- **Duration**: ~3 hours
- **What Was Done**: Fixed subscription sync, investigated RevenueCat configuration, deployed Build 34
- **Status**: ✅ **COMPLETE**
- **Commits**:
  - `60158b5` - docs: document JWT ES256 compatibility issue and resolution

### Previous Activity
- **Date**: December 21, 2025 - Profile Section Enhancements
- **Duration**: ~2 hours
- **What Was Done**: Enhanced profile section with avatar upload, font scaling, spoken prayer reminders
- **Status**: ✅ **COMPLETE** - All changes committed and pushed to GitHub
- **Commits**:
  - `d634c1e` - Profile section enhancements (avatar, font scaling, spoken prayer, legal updates)
  - `d574a58` - docs: add project status summary file
- **New Files Created**:
  - `mobile/src/contexts/FontSizeContext.tsx` - Global font scaling provider
  - `mobile/src/components/common/ScaledText.tsx` - Auto-scaled text component
  - `mobile/src/hooks/useAvatarUpload.ts` - Avatar picker and Supabase upload
  - `mobile/src/components/settings/PrayerTimePicker.tsx` - Multi-time picker for prayer reminders
- **Files Modified**:
  - `mobile/App.tsx` - Added FontSizeProvider wrapper
  - `mobile/src/screens/profile/AccountSettingsScreen.tsx` - Avatar upload UI
  - `mobile/src/screens/profile/NotificationsScreen.tsx` - Spoken prayer toggle + times
  - `mobile/src/screens/profile/AboutScreen.tsx` - Legal text to "Agentic Personnel LLC"
  - `mobile/src/screens/profile/TermsOfServiceScreen.tsx` - Legal text updates
  - `mobile/src/types/store.ts` - Added spoken prayer types
  - `mobile/src/stores/settingsStore.ts` - Added spoken prayer state
  - Settings components (SettingsSection, SettingsRow, SettingsToggle, SettingsPicker) - Font scaling

### Previous Activity
- **Date**: December 20, 2025 - Landing Page Major Updates
- **Duration**: ~2 hours
- **What Was Done**: Comprehensive landing page redesign with new features and improved UX
- **Status**: ✅ **COMPLETE**
- **Commits**:
  - `ec47eb9` - feat(web): add FAQ about The Guru AI feature
  - `953b6b1` - feat(web): CTA buttons scroll to QR code promo banner
  - `07d8491` - feat(web): landing page updates - navbar, parallax, styled sections
- **New Features**:
  - **Sticky Navbar**: Appears on scroll (100px+) OR mouse hover at top of screen
    - Mandala logo (3-6-9 image) + "Manifest the Unseen" text
    - Nav links: Path, Tools, Join, FAQ
    - "Start Free Trial" CTA button
  - **Parallax Hero**: Fixed background image creates depth as content scrolls over it
  - **QR Code Placeholder**: In promo banner for App Store download (ready for real QR when app launches)
  - **CTA Button Scroll**: Pricing card buttons scroll to QR code with highlight effect
- **Content Updates**:
  - **Path Section (01/02/03)**: New titles and detailed descriptions
    - 01: "Start Digital Workbook" - 202-page workbook, 10 phases of transformation
    - 02: "Engage with the Guru" - AI wisdom trained on ancient teachings
    - 03: "Manifest Daily" - Guided meditations and prayers of action
  - **Tools Section**: Complete rewrite with detailed feature descriptions
    - Digital Workbook, Guided Meditations, The Guru, Voice Journaling
    - Styled cards with gradient backgrounds and gold borders/glow
  - **FAQ Added**: "How does The Guru work?" - Explains RAG knowledge base and personalized guidance
  - **Footer**: Copyright updated to "© 2025 Agentic Personnel LLC"
- **UI/UX Improvements**:
  - Brighter text colors for better readability on dark backgrounds
  - Feature cards with gradient backgrounds (`from-aged-gold/10 via-temple-stone/30`)
  - Gold border glow effects on hover
  - All sections have proper z-index for parallax compatibility
- **Files Created**:
  - `web/components/Navbar.tsx` - Sticky navbar with scroll/hover trigger
  - `web/public/images/logo-mandala.png` - Mandala logo from phase-6 asset
- **Files Modified**:
  - `web/app/layout.tsx` - Added Navbar globally
  - `web/components/Hero.tsx` - Parallax background, updated Path section
  - `web/components/Features.tsx` - Styled cards, new descriptions
  - `web/components/Pricing.tsx` - QR code placeholder, CTA scroll handler
  - `web/components/FAQ.tsx` - Added Guru FAQ, updated privacy FAQ
  - `web/components/Footer.tsx` - Updated copyright

### Previous Activity (Dec 19 PM)
- **Date**: December 19, 2025 - Promo Code System Implementation
- **Duration**: ~2 hours
- **What Was Done**: Built and deployed complete promo code system for early adopter discounts
- **Status**: ✅ **COMPLETE** - All code committed, database migrated, Edge Function deployed
- **Commit**: `19f9330` - `feat(promo): add EARLY50 promo code system for early adopters`
- **New Feature - Promo Code System**:
  - **Database**: `promo_codes` and `promo_code_redemptions` tables with RLS (migrated to production)
  - **Edge Function**: `validate-promo` deployed to Supabase for server-side validation
  - **Mobile App**: `PromoCodeInput` component on PaywallScreen, records redemption after purchase
  - **Landing Page**: 50% off banner with live slot counter, copy-to-clipboard promo code
  - **EARLY50 Promo**: 50% off for 3 months, limited to first 30 users
- **Files Created**:
  - `supabase/migrations/20251219000000_promo_codes.sql` - Database schema + seed data
  - `supabase/functions/validate-promo/index.ts` - Edge Function
  - `mobile/src/components/PromoCodeInput.tsx` - UI component
  - `mobile/src/services/promoService.ts` - Validation service
- **Files Modified**:
  - `mobile/src/screens/subscription/PaywallScreen.tsx` - Integrated promo input
  - `mobile/src/stores/subscriptionStore.ts` - Added promo state + actions
  - `mobile/src/services/index.ts` - Exported promoService
  - `web/components/Pricing.tsx` - Added promo banner with discounted prices
- **Next Step**: Configure Apple Offer Codes in App Store Connect after app approval

### Previous Activity (Dec 20 AM)
- **Date**: December 20, 2025 - Guru Navigation Bug Fix + Workbook Re-assessment Feature
- **Duration**: ~2 hours
- **What Was Done**: Fixed Guru navigation loop bug + added workbook update triggering Guru re-assessment + created permanent test accounts
- **Status**: ✅ **COMPLETE** - Guru fully tested with 3 tier-specific test accounts
- **Bug Fixes**:
  1. **Navigation Loop Bug** (`GuruScreen.tsx`) - When clicking "Review with Guru" after phase completion, user was looped back to Phase 1 instead of staying in conversation
     - Root cause: `preSelectedPhase` route param was never cleared after consumption
     - Fix: Added `navigation.setParams({ preSelectedPhase: undefined })` after selecting phase
  2. **Navigation Type Bug** (`ReviewWithGuruButton.tsx`) - Cross-navigator navigation to Guru tab
     - Root cause: Using wrong navigation type for sibling tab navigation
     - Fix: Changed to `NavigationProp<MainTabParamList>` for proper cross-navigator navigation
- **New Feature - Workbook Re-assessment**:
  - Added `invalidateGuruQueries()` to `queryClient.ts`
  - Call cache invalidation after workbook saves in `workbook.ts`
  - Guru now fetches fresh data when user updates workbook exercises
- **Test Accounts Created** (permanent QA fixtures):
  | Email | Password | Tier | Workbook Data |
  |-------|----------|------|---------------|
  | test.novice@manifest.test | TestNovice123! | novice | 0 worksheets |
  | test.awakening@manifest.test | TestAwakening123! | awakening | 5/11 Phase 1 |
  | test.enlightenment@manifest.test | TestEnlightenment123! | enlightenment | 11/11 Phase 1 |
- **Testing Results** (Playwright on localhost:8083):
  - ✅ Guru correctly shows "1 of 10 phases completed" for enlightenment user
  - ✅ Phase 1 "Analyze" button enabled, phases 2-10 disabled
  - ✅ AI correctly detected low areas: Finance (2), Career (3), Health (4)
  - ✅ AI recommended Box Breathing for finance anxiety
  - ✅ Personalized response based on actual workbook data
- **Files Modified**:
  - `mobile/src/screens/GuruScreen.tsx` - Navigation loop fix
  - `mobile/src/components/guru/ReviewWithGuruButton.tsx` - Navigation type fix
  - `mobile/src/services/queryClient.ts` - Added `invalidateGuruQueries()`
  - `mobile/src/services/workbook.ts` - Call cache invalidation after save
  - `docs/guru/TESTING-PROGRESS-REPORT.md` - Comprehensive testing documentation

### Previous Activity (Dec 19 AM)
- **Date**: December 19, 2025 - Splash Screen Branding + Guru AI Fixes
- **Duration**: ~3 hours
- **What Was Done**: Fixed Guru AI Edge Function (missing API keys) + Added branded splash screen
- **Status**: ✅ **COMPLETE** - Ready for Build 25
- **Guru AI Fixes**:
  - Added `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` to Supabase Edge Function secrets
  - Redeployed guru-analysis Edge Function (v7)
  - Guru AI now fully functional with personalized workbook analysis
- **Splash Screen Update**:
  - Replaced plain purple splash with APS branded logo
  - Changed backgroundColor from purple (#9333ea) to black (#000000)
  - Added iOS-specific splash configuration in app.json
  - Build number incremented to 25
- **Other Fixes**:
  - Worksheet ID mismatch in Phase1Dashboard (habits-audit, values-assessment)
  - Guru chat input positioning (80px bottom margin for tab bar clearance)
- **Files Modified**:
  - `mobile/app.json` - Splash config + build 25
  - `mobile/assets/splash.png` - APS branded logo
  - `mobile/src/screens/GuruScreen.tsx` - Chat input positioning
  - `mobile/src/components/chat/ChatInput.tsx` - Keyboard offset fix
  - `mobile/src/screens/workbook/Phase1/Phase1Dashboard.tsx` - Worksheet ID fix
  - Supabase secrets: ANTHROPIC_API_KEY, OPENAI_API_KEY added

### Previous Activity (Dec 18)
- **Date**: December 18, 2025 - Security Audit + TestFlight Feature Access Fix
- **Duration**: ~3 hours
- **What Was Done**: Supabase security audit + fixed feature locking in TestFlight builds
- **Status**: ✅ **COMPLETE** - Build 23 on TestFlight with full feature access
- **Security Fixes Applied** (Migration: `20251217000001_security_fixes.sql`):
  1. **`meditations` table** - RLS enabled (policy existed but RLS was off)
  2. **`knowledge_embeddings` table** - RLS enabled + service-role-only write policies
  3. **Functions search_path fixed** - `update_updated_at_column()`, `match_knowledge()`, `handle_new_user()`
  4. **Security issues reduced**: 8 → 2 (remaining: vector extension in public, leaked password protection)
- **TestFlight Access Fix**:
  - Problem: `__DEV__` = false in production builds → RevenueCat returned "free" tier → all features locked
  - Solution: Added `EXPO_PUBLIC_TESTFLIGHT_FULL_ACCESS=true` env var in eas.json
  - Updated: `subscriptionStore.ts`, `subscriptionService.ts` to check this env var
  - Result: TestFlight builds get enlightenment tier access for testing
- **Push Notifications Disabled** (Build 21+):
  - Reason: Apple provisioning profile missing Push Notification capability
  - Workaround: Removed `expo-notifications`, created mock `useNotifications` hook
  - To re-enable: Regenerate provisioning profile via `eas credentials`
- **Files Modified**:
  - `mobile/eas.json` - Added `EXPO_PUBLIC_TESTFLIGHT_FULL_ACCESS`
  - `mobile/src/stores/subscriptionStore.ts` - TestFlight bypass in `loadSubscription()`
  - `mobile/src/services/subscriptionService.ts` - TestFlight bypass in `configurePurchases()` and `getSubscriptionInfo()`
  - `mobile/src/hooks/useNotifications.ts` - Mock implementation (notifications disabled)
  - `supabase/migrations/20251217000001_security_fixes.sql` - Security hardening

### Previous Activity (Dec 18 PM)
- **Date**: December 18, 2025 - Bug Fixes (Phase 1 Progress + Guru UI + Edge Function)
- **Duration**: ~2 hours
- **What Was Done**: Fixed multiple bugs discovered during Guru AI testing
- **Status**: ✅ **COMPLETE** - Guru AI fully functional!
- **Bugs Fixed**:
  1. **0% Progress Display** - Habit Tracking and Personal Values showing 0% even with data
     - Root cause: Worksheet ID mismatch (`habit-tracking` vs `habits-audit`, `personal-values` vs `values-assessment`)
     - Fix: Updated `Phase1Dashboard.tsx` to use canonical IDs from `types/workbook.ts`
  2. **Guru Chat Input Hidden** - Chat input positioned below bottom nav bar
     - Root cause: `KeyboardAvoidingView` offset (90px) insufficient for tab bar (94px+)
     - Fix: Increased offset to 100px, added 80px bottom margin wrapper in `GuruScreen.tsx`
  3. **Edge Function 400 Error** - Guru analysis returning Bad Request
     - Root cause #1: Test user had no worksheet data → Created test data via SQL
     - Root cause #2: Missing API keys → Added `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` via Supabase CLI
     - Fix: Redeployed Edge Function (v7) with both API keys configured
- **Files Modified**:
  - `mobile/src/screens/workbook/Phase1/Phase1Dashboard.tsx` - Fixed worksheet IDs (lines 42, 63, 197, 200)
  - `mobile/src/components/chat/ChatInput.tsx` - Increased keyboard offset (line 48)
  - `mobile/src/screens/GuruScreen.tsx` - Added inputWrapper with 80px marginBottom (lines 242, 358-360)
  - Database: Created 11 Phase 1 worksheets for test user
  - Supabase Secrets: Added `ANTHROPIC_API_KEY` and `OPENAI_API_KEY`
  - Edge Function: Redeployed guru-analysis v7
- **Result**: Guru AI now responds with personalized analysis based on user's workbook data!

### Previous Activity
- **Date**: December 16, 2025 - Profile/Settings Complete Implementation
- **Duration**: ~2 hours
- **What Was Done**: Complete Profile/Settings functionality with iOS integrations
- **Status**: ✅ **COMPLETE** - All profile screens implemented and working
- **Files Created**: 17 new files (navigator, screens, components, hooks)
- **Dependencies Added**: expo-notifications, expo-local-authentication, expo-mail-composer, @react-native-community/datetimepicker
- **Features Implemented**:
  - ProfileNavigator with nested stack navigation
  - AccountSettingsScreen (edit name, view email/membership date)
  - NotificationsScreen (push permissions, daily inspiration, meditation/journal reminders with time pickers)
  - AppearanceScreen (theme: light/dark/system, font size, reduced motion)
  - PrivacySecurityScreen (Face ID/Touch ID lock, analytics/crash reporting toggles)
  - HelpCenterScreen (contact form → jimmy@agenticpersonnel.com via expo-mail-composer)
  - AboutScreen (app version, description, links to Privacy Policy & Terms of Service)
  - PrivacyPolicyScreen & TermsOfServiceScreen (in-app legal docs)
  - Reusable settings components (SettingsSection, SettingsRow, SettingsToggle, SettingsPicker)
  - useNotifications hook for iOS push notification scheduling
- **TypeScript**: 0 errors after all fixes applied

### Previous Activity (Dec 16 AM)
- **Date**: December 16, 2025 - Guru AI Enhancement (Swarm)
- **Duration**: ~4 hours
- **What Was Done**: Major enhancement to Guru AI system + test data setup
- **Status**: ✅ **COMPLETE** - All deployed, test data populated, ready for E2E testing
- **Bug Fixed**:
  - `guruService.ts` now uses `ai_conversations` table with `conversation_type='guru'` filter
- **Enhancements Deployed**:
  - ✅ Dynamic workbook analysis (identify weak life areas from Wheel of Life)
  - ✅ Smart breathing suggestions based on user's actual weak areas
  - ✅ Life area tagging for meditations (database migration + seed data)
  - ✅ Edge Function enhanced with `extractLowLifeAreas()` and dynamic suggestions
  - ✅ Documentation organized in `docs/guru/` folder
  - ✅ Test data populated (11 Phase 1 worksheets with low scores)
- **Test Data**:
  - User: jimmy@agenticpersonnel.com (enlightenment tier)
  - Phase 1: 11 worksheets completed
  - Wheel of Life low scores: Career (3), Finance (2), Health (4)
  - Expected: Guru suggests Energy Boost breathing for career/finance
- **Files Modified**:
  - `mobile/src/services/guruService.ts` - Fixed table references
  - `mobile/src/types/guru.ts` - Updated types
  - `mobile/src/constants/lifeAreaMappings.ts` - NEW: Life area constants
  - `supabase/functions/guru-analysis/index.ts` - Enhanced with dynamic analysis
  - `supabase/migrations/20251217000000_meditation_life_areas.sql` - NEW: Added life_areas column
  - `supabase/seed.sql` - Updated with life area tags
  - `docs/guru/README.md` - NEW: Feature documentation
  - `docs/guru/test-data.sql` - NEW: Test data SQL scripts
- **Working Document**: `docs/guru/GURU-AI-ENHANCEMENT-PROGRESS.md`

### Previous Activity
- **Date**: December 15, 2025 - Guru AI Local Testing & Debugging
- **Duration**: In progress (session crashed due to 70+ node processes)
- **What Was Done**: Attempting to test Guru AI locally, discovered authentication errors
- **Status**: ✅ **RESOLVED** - Root cause identified (wrong table name)
- **Issues Found**:
  - Authentication not working properly when testing locally
  - Multiple Metro bundler instances accumulated (70+ node processes)
  - Session crashed, requires fresh debugging approach
- **Changes Made (before crash)**:
  - ✅ `subscriptionStore.ts` - Changed to use `__DEV__` global for local dev bypass
  - ✅ Database - `jimmy@agenticpersonnel.com` set to enlightenment tier for testing
  - ✅ Build 19 submitted to TestFlight

### Previous Activity
- **Date**: December 14, 2025 - Guru Feature Debugging & Fixes
- **Duration**: ~3 hours
- **What Was Done**: Fixed Guru Analysis feature - Edge Function deployment, service integration, and test data setup
- **Completed**:
  - ✅ **Function Name Mismatch Fixed** - Service now calls `guru-analysis` (was `guru-analyze`)
  - ✅ **Request Format Fixed** - Service transforms `userMessage` → `message` for Edge Function
  - ✅ **Worksheet Count Fixed** - `WORKSHEETS_PER_PHASE[1]` corrected from 4 → 11
  - ✅ **Edge Function Deployed** - `guru-analysis` v2 deployed to Supabase
  - ✅ **Test Data Created** - `test@manifest.app` now has 11/11 Phase 1 worksheets completed
  - ✅ **Build 16 Deployed** - TestFlight build with all Guru fixes

### Previous Activity
- **Date**: December 14, 2025 - Auto-Save Bug Fix
- **Duration**: ~2 hours
- **What Was Done**: Fixed critical auto-save race condition across all 35 workbook screens
- **Completed**:
  - ✅ **Root Cause Identified** - Race condition in load/save cycle causing data loss
  - ✅ **Fix Pattern Applied** - Added `hasLoadedInitialData` useRef to prevent overwrites
  - ✅ **35 Screens Fixed** - All workbook screens across 10 phases updated
  - ✅ **TypeScript Errors Resolved** - Fixed missing useRef imports in 7 files
  - ✅ **Build 14 Deployed** - Initial fix for 3 screens + typography fixes
  - ✅ **Build 15 Deployed** - Complete fix across all remaining screens
  - ✅ **EAS Build Complete** - Build 15 available on TestFlight

### Previous Session
- **Date**: December 13, 2025 - App Store Submission
- **Duration**: ~2 hours
- **What Was Done**: Submitted Build 13 to Apple App Store for review
- **Completed**:
  - ✅ **Build 13 Deployed** - Final MVP beta build to TestFlight
  - ✅ **App Store Submission** - Submitted for Apple review
  - ✅ **Pricing Set** - Free ($0.00) for 175 countries
  - ✅ **Content Rights** - Configured as having rights to all content
  - ✅ **iPad Screenshot** - Created 2048×2732px screenshot for App Store
  - ✅ **Git Tag** - Created `v1.0.0-beta.13` milestone tag
  - ✅ **Package Cleanup** - Removed broken dependencies (expo-secure-store, babel-plugin-transform-remove-console)

### What's Working Right Now
- ✅ **App Logo** - Final design approved: Monk + Chakras + Mandala wheel ([Canva](https://www.canva.com/design/DAG5fDUuSKw/vrxVe9MlJt0uA7o-oI2BhQ/edit))
- ✅ **UI Mockups** - Wheel of Life, Dashboard, SWOT Analysis (all approved in Canva)
- ✅ **Design Spec** - `docs/APP-DESIGN.md` (v1.2) + `docs/color-palette.html` (interactive tool)
- ✅ **Auth Screens** - Test: `cd mobile && npm start`, navigate Welcome → Login → Signup
- ✅ **Design System** - Test: Open any screen, components use brand theme (purple/gold)
- ✅ **iOS Expo Go** - Test: `npm start` → scan QR on iPhone → app loads in Expo Go
- ✅ **Hot Reload** - Test: Edit WelcomeScreen.tsx, save, see changes in ~2 seconds
- ✅ **Supabase Local** - Test: `npx supabase status` → all services show "Running"
- ✅ **Navigation** - Root navigator with auth flow + 5-tab main navigator (Home, Workbook, Journal, Meditate, Profile)
- ✅ **Database Tables** - Verified: 8 tables exist with correct schema (fixed 2025-12-01)
- ✅ **RLS Policies** - Verified: 24+ policies active on user tables (updated 2025-12-01)
- ✅ **Auth API E2E** - Verified: Signup → Email Confirm → Login all working (test user: test@manifest.app)

### Current Blockers
- ✅ ~~**Paid Apps Agreement not signed**~~ - **RESOLVED Dec 30!** Agreement now Active
- ⚠️ **Push notifications temporarily disabled** - Provisioning profile needs regeneration
- ⚠️ **Awaiting App Store Review** - Build 29 submitted Dec 25, 2025

---

## Environment Setup

### Prerequisites Status
| Tool | Required Version | Status | Notes |
|------|-----------------|--------|-------|
| Node.js | v18+ | ✅ Installed | Check: `node --version` |
| npm | Latest | ✅ Installed | Check: `npm --version` |
| Git | Latest | ✅ Installed | Windows Git Bash |
| Supabase CLI | Latest | ✅ Installed | Check: `npx supabase --version` |
| Expo CLI | Latest | ✅ Installed | Included in mobile/node_modules |
| Android Studio | Latest | ❌ Not Installed | Follow docs/android-emulator-setup.md (~60 min) |
| Expo Go App (iOS) | Latest | Optional | Download from App Store for iPhone/iPad testing |

### Get Running in 5 Minutes

**Option 1: iOS Expo Go** (Fastest - Real Device Testing)
```bash
# Terminal: Start Expo
cd mobile
npm start

# On iPhone:
# 1. Open Camera app
# 2. Point at QR code displayed in terminal
# 3. Tap "Open in Expo Go"
# 4. App loads in ~5 seconds
```

**Option 2: Android Emulator** (Primary Development - Requires Setup)
```bash
# Terminal 1: Start emulator (after Android Studio setup)
emulator -avd Pixel_5_API_34

# Terminal 2: Start Supabase (if needed)
cd C:/projects/mobileApps/manifest-the-unseen-ios
npx supabase start

# Terminal 3: Start Expo
cd mobile
npm start
# Press 'a' to launch on Android
```

**Option 3: Web Preview** (Quickest Test - Limited Features)
```bash
cd mobile
npm start
# Press 'w' to open in browser
# Note: Missing mobile-specific features (auth, navigation, etc.)
```

### Environment Variables Check
```bash
# Verify Supabase is running
npx supabase status

# Check mobile environment (if .env exists)
cat mobile/.env

# Check TypeScript compilation
cd mobile && npm run type-check
```

---

## Tech Stack Status

### Mobile App
| Component | Status | Version/Notes |
|-----------|--------|---------------|
| React Native | ✅ Configured | 0.73 via Expo SDK 54 |
| Expo | ✅ Installed | SDK 54 (272 packages) |
| TypeScript | ✅ Working | Strict mode enabled, 0 errors |
| NativeWind | ✅ Configured | Tailwind CSS for React Native |
| React Navigation | ✅ Configured | Stack + Tab navigators, auth flow |
| Zustand | ✅ Configured | 3 stores (auth, settings, app) |
| TanStack Query | ✅ Configured | Server state management ready |
| React Hook Form | ✅ Configured | Form management with Zod validation |
| Zod | ✅ Configured | Schema validation for forms |

### Backend (Supabase)
| Component | Status | Notes |
|-----------|--------|-------|
| Production Supabase | ✅ Running | Project: zbyszxtwzoylyygtexdr |
| Database (PostgreSQL) | ✅ Migrated | 10+ tables, RLS policies active |
| Authentication | ✅ Working | Apple Sign-In + Email/Password |
| Storage | ✅ Working | Avatar uploads, journal images |
| Edge Functions | ✅ Deployed | guru-analysis, validate-promo, delete-account |
| pgvector Extension | ✅ Enabled | RAG knowledge base for Guru AI |
| Realtime | ✅ Configured | WebSocket subscriptions ready |

### AI Services
| Service | Status | Notes |
|---------|--------|-------|
| Claude (Anthropic) | ✅ Integrated | Guru AI chat via Edge Function |
| OpenAI Embeddings | ✅ Integrated | RAG knowledge base (pgvector) |
| OpenAI Whisper | ✅ Integrated | On-device transcription (whisper.rn) |

### Subscriptions
| Component | Status | Notes |
|-----------|--------|-------|
| RevenueCat | ✅ Integrated | 3 tiers configured |
| StoreKit 2 (iOS) | ✅ Integrated | Via RevenueCat SDK |
| Feature Gating | ✅ Working | Novice, Awakening, Enlightenment tiers |

---

## Features Complete

✅ **Weeks 1-3 Complete** (Nov 17-19): Infrastructure, authentication, and Expo configuration.
See `MTU-project-status-archive.md` for detailed implementation notes.

**Summary**:
- Monorepo structure (mobile, packages/shared, supabase)
- Design system (colors, typography, spacing, shadows)
- 5 atomic components (Button, TextInput, Card, Loading, Text)
- 8 database tables with 27 RLS policies
- Authentication service + 4 auth screens
- Expo SDK 54 with cross-platform workflow

---

## Key Commands

### Daily Development
```bash
# Start Expo dev server (choose Android 'a', iOS 'i', or web 'w')
cd mobile
npm start

# Or specific platform:
npm run android        # Android emulator (requires AVD running)
npm run ios            # iOS simulator (requires macOS)
npm run expo-go        # Alias for npm start

# Start Supabase (if needed for auth/database)
npx supabase start

# Open Supabase Studio (database UI)
# Browser: http://localhost:54323
```

### Testing
```bash
# Run all tests (when test suite exists)
cd mobile
npm test

# Type check
npm run type-check

# Lint
npm run lint

# Format code
npm run format
```

### Database Operations
```bash
# Start local Supabase
npx supabase start

# Check status (shows all service URLs and ports)
npx supabase status

# Stop Supabase
npx supabase stop

# Reset database (WARNING: Deletes all data)
npx supabase db reset

# Run migrations
npx supabase db push

# Generate TypeScript types from database schema
npx supabase gen types typescript --local > mobile/src/types/database.types.ts
```

### Git Operations
```bash
# Check status
git status

# Stage changes
git add .

# Commit with message
git commit -m "feat: description"

# Push to GitHub
git push origin main

# View recent commits
git log --oneline -10
```

### Build & Deploy (Future)
```bash
# Android build (EAS Build - cloud)
cd mobile
eas build --platform android

# iOS build (EAS Build - cloud, no macOS needed)
eas build --platform ios

# Deploy Supabase Edge Function
npx supabase functions deploy [function-name]

# Deploy to Supabase production
npx supabase db push --linked
```

---

## Dependencies Status

### npm Packages
**Last Full Install**: November 18-19, 2025

**mobile/** (272 packages)
- Expo SDK 54 + dependencies
- React Native 0.73
- Navigation, state management, forms, validation libraries
- Total size: ~500 MB in node_modules

**packages/shared/** (15 packages)
- TypeScript, Zod, utility libraries
- Minimal dependencies for code sharing

**Root workspace** (8 packages)
- Monorepo tooling (npm workspaces)

**Total**: 295 packages across 3 workspaces

### Supabase Services Status
Check with: `npx supabase status`

| Service | Port | Status | URL |
|---------|------|--------|-----|
| Studio | 54323 | ✅ Running | http://localhost:54323 |
| API | 54321 | ✅ Running | http://localhost:54321 |
| Database | 54322 | ✅ Running | postgresql://postgres:postgres@localhost:54322/postgres |
| Storage | 54321 | ✅ Running | http://localhost:54321/storage/v1 |
| Realtime | 54321 | ✅ Running | ws://localhost:54321/realtime/v1 |
| Auth | 54321 | ✅ Running | http://localhost:54321/auth/v1 |

### MCP Servers - Utilization Strategy

| MCP Server | Purpose | Status | Current Use | Future Use |
|------------|---------|--------|-------------|------------|
| **Supabase** | Database queries, migrations | 🎯 Priority | Verify tables, RLS, auth config | All database operations |
| **Playwright** | E2E testing, browser automation | 🎯 Priority | Automate auth flow tests | CI/CD testing pipeline |
| **Canva** | Design asset generation | ✅ **Active** | UI mockups, app logo, screen designs | Store screenshots, marketing assets |
| Desktop Commander | File operations, processes | ✅ Active | File system access | - |
| GitHub | Repository operations | ✅ Active | PR management | - |

#### MCP Testing Plan (Immediate)
```
Supabase MCP → Verify 8 tables, 27 RLS policies, auth providers
Playwright MCP → Screenshot auth screens, automate form validation tests
```

#### MCP Design Plan (Week 25+)
```
Canva MCP → Generate 1024x1024 app icon, splash screens, store screenshots
```

---

## Testing Status

### What Can Be Tested Right Now

**1. Expo Dev Server Start**
```bash
cd mobile && npm start
# Expected: QR code displays, Metro bundler compiles, no errors
# Test result: ✅ Works (tested Nov 19)
```

**2. TypeScript Compilation**
```bash
cd mobile && npm run type-check
# Expected: 0 errors, all types resolve correctly
# Test result: ✅ Works (0 errors)
```

**3. Auth Screens UI** (No backend yet)
```bash
# Start app in Expo Go or emulator
# Navigate: Welcome → Login → Signup → Forgot Password
# Expected: All forms render, validation works, navigation smooth
# Test result: 🚧 Not tested on device yet (Expo server confirmed working)
```

**4. Supabase Local Connection**
```bash
npx supabase start
npx supabase status
# Expected: All services "Running", Studio accessible at http://localhost:54323
# Test result: ✅ Works (all services running)
```

**5. Design System Components** (No Storybook yet)
```bash
# View components in auth screens
# Check: Purple/gold theme, button variants, input states, card elevations
# Expected: All components use design tokens consistently
# Test result: 🚧 Visual verification pending (device testing)
```

### Test Coverage
- **Unit Tests**: 0% (no test suite created yet)
- **Integration Tests**: 0% (no test suite created yet)
- **E2E Tests**: 0% (planned for Week 25-26)
- **Manual Test Checklist**: See `docs/expo-setup-complete.md` for verification steps

---

## Testing & Deployment

See `MTU-project-status-archive.md` for detailed testing strategy and iOS deployment documentation.

**Quick Reference**:
- Browser: `npm start` → press 'w' → Chrome DevTools device mode
- Device: `npm start` → scan QR with Expo Go
- Build: `eas build --platform ios --profile production`

---

## Documentation Index

### Essential Reading (Start Here)
1. **[project-status.md](./project-status.md)** - This file (current state snapshot)
2. **[CLAUDE.md](../../../CLAUDE.md)** - Project instructions for Claude Code (always read first when starting work)
3. **[README.md](../../../README.md)** - Project overview and quick start

### Product & Technical Specs
- **[PRD](../../planning/manifest-the-unseen-prd.md)** - Complete Product Requirements Document (202KB, 1,663 lines)
- **[TDD](../../planning/manifest-the-unseen-tdd.md)** - Technical Design Document (architecture, API specs, database schema)
- **[Summary](../../planning/manifest-the-unseen-summary.md)** - Quick reference for key decisions and tech stack

### Design Assets (NEW - Nov 22)
- **[App Design Spec](../../planning/app-design.md)** - Visual design system, screen mockups, logo, color palette (v1.2)
- **[Color Palette Tool](../../color-palette.html)** - Interactive HTML tool for color preview/editing
- **[Final Logo](https://www.canva.com/design/DAG5fDUuSKw/vrxVe9MlJt0uA7o-oI2BhQ/edit)** - Approved: Monk + Chakras + Mandala (Canva)

### Setup Guides (For New Sessions/Context)
- **[Android Emulator Setup](../../guides/setup/android-emulator-setup.md)** (650 lines) - Complete Android Studio installation
- **[iOS Expo Go Setup](../../guides/setup/ios-expo-go-setup.md)** (550 lines) - iPhone/iPad testing workflow
- **[Expo Setup Complete](../../guides/setup/expo-setup.md)** (650 lines) - Full Expo configuration report
- **[Database Execution Guide](../../guides/setup/database-execution-guide.md)** (900+ lines) - Supabase migrations and RLS policies

### Architecture Decisions (ADRs)
- **[ADR-001: React Native + TypeScript](../../architecture/decisions/adr-001-react-native-tech-stack.md)** - Why React Native over native Swift

---

## Change Log

*For full implementation details, see `MTU-project-status-archive.md`*

### 2026-01-07 (PM) - TestFlight Subscription System Fixes
**Duration**: ~2 hours | **Status**: ✅ Complete
- **FIXED**: Buttons not clickable on higher tiers (mock offerings for TestFlight)
- **FIXED**: UI not updating after purchase (direct state update + simulated purchase)
- **FIXED**: Trial/Tier confusion in Profile (enhanced status labels with trial days)
- **NEW**: Test Mode toggle in PaywallScreen debug panel (tap title 5x)
- **Files Modified**:
  - `mobile/src/services/subscriptionService.ts` - Mock offerings + simulated purchase
  - `mobile/src/stores/subscriptionStore.ts` - Test mode state + direct state updates
  - `mobile/src/screens/subscription/PaywallScreen.tsx` - Test mode toggle in debug panel
  - `mobile/src/hooks/useSubscription.ts` - Enhanced subscription summary with trial info

### 2026-01-07 (AM) - Synchronized Prayer Text Display Feature
**Duration**: ~3 hours | **Status**: ✅ Complete
- **NEW FEATURE**: Karaoke-style prayer player with synchronized text display
- **How It Works**: Text displays line-by-line as audio plays, auto-calculated timing based on word count
- **Components Built**:
  - `PrayerTextDisplay.tsx` - Synchronized text with fade animations
  - `usePrayerTiming.ts` - Line timing calculation hook
  - `usePrayer.ts` - TanStack Query hooks
  - `prayerService.ts` - Supabase CRUD operations
- **UI Changes**:
  - Added "Prayers" tab to Meditate screen (sparkles icon)
  - Prayer cards with play button
  - Integrated prayer text display into MeditationPlayerScreen
- **Audio Uploaded** to `meditation-audio/prayers/`:
  - `the-presence-within.m4a` (~8 min)
  - `the-infinite-within.m4a` (~13 min)
  - `the-temple-of-the-heart.m4a` (~12 min)
- **Database**: Created 3 new prayer records with full content + audio URLs
- **Commits**: `2d635e6`, `efc4dbf`

### 2026-01-06 - App Store Connect Review Screenshots Fixed
**Duration**: ~30 min | **Status**: ✅ Complete
- **FIXED**: All 6 subscriptions now show "Ready to Submit" in App Store Connect
- **ROOT CAUSE**: Review Screenshots required device-sized images (1284x2778), not 1024x1024
- **SOLUTION**: Uploaded proper screenshots from `snips/iOS-Subscriptions/ar-tall/` folder via Playwright
- **REMAINING ISSUES**:
  - Trial/Tier confusion (UX fix needed)
  - Subscribe buttons not clickable on higher tiers (investigating)
  - No UI update after purchase (fix needed)

### 2026-01-04 (PM) - Build 41 Testing: Issues Found
**Duration**: ~2 hours | **Status**: 🟡 Investigating
- **TESTED**: Build 41 on TestFlight with real subscription purchase
- **ISSUES FOUND**:
  1. Trial/Tier confusion - Profile shows "Novice" but user has Guru access
  2. Subscribe buttons not clickable on higher tiers
  3. No UI update after purchase
  4. Product images differ from App Store submissions
- **ROOT CAUSE (Trial)**: 7-day trial grants Enlightenment access regardless of subscription
- **UX FIX NEEDED**: Show "Trial (X days left)" in Profile
- **IMAGE FIX NEEDED**: Audit PaywallScreen image sources

### 2026-01-04 (AM) - Build 41: Purchase Spinner Fix + Auto-Submit Config
**Duration**: ~1 hour | **Status**: ✅ Complete
- **FIX**: Purchase spinner hanging after Apple authentication
- **ROOT CAUSE**: `await loadSubscription()` after purchase could hang/timeout
- **SOLUTION**: Don't await loadSubscription() - refresh in background
- **CONFIG**: `testflight-sandbox` profile now auto-submits to TestFlight
- Files modified: `subscriptionStore.ts`, `PaywallScreen.tsx`, `eas.json`
- Commits: `0e980f5`, `c160958`, `39c48f1`

### 2025-12-30 - Paid Apps Agreement RESOLVED! 🎉
**Duration**: ~1 hour | **Status**: ✅ **RESOLVED**
- **ROOT CAUSE**: Paid Apps Agreement in App Store Connect was not signed
- **RESOLUTION CONFIRMED**: All agreements, banking, and tax forms now Active
- Paid Apps Agreement: ✅ Active (Dec 30, 2025 - Dec 2, 2026)
- Free Apps Agreement: ✅ Active
- Banking (Blaze 2079): ✅ Active
- Tax Forms (W-9): ✅ Active
- RevenueCat should now be able to fetch subscription products
- Code was correct all along - purely Apple administrative/legal issue

### 2025-12-29 - Build 40: RevenueCat Debug Overlay
**Duration**: ~1 hour | **Status**: ✅ Complete (helped find root cause)
- Added RevenueCatDebugState tracker to subscriptionService.ts
- Added DebugOverlay component to PaywallScreen (shows SDK status, API key, errors)
- Added Sandbox account setup instructions on error screen
- Debug overlay always visible on error state for easier troubleshooting
- Verified RevenueCat dashboard config via Playwright (all correct)
- Next: Build 40 with testflight-sandbox profile and test with Sandbox Apple ID

### 2025-12-29 - App Store Connect Subscription Metadata Configuration
**Duration**: ~1 hour | **Status**: ✅ Complete
- Configured subscription group localization ("Premium Access" for English U.S.)
- Set up availability (175 countries/regions) for all 6 subscription products
- Verified pricing and individual localizations were already correctly configured
- All subscriptions now have: pricing, duration, localization, and availability set

### 2025-12-29 - Build 39: RevenueCat Integration Fix + 3-Tier Paywall
**Duration**: ~3 hours | **Status**: ✅ Complete
- Fixed critical package ID mismatch (code used `monthly`, RevenueCat has `novice_monthly`, etc.)
- Updated `SubscriptionOffering` type for 6 packages (3 tiers × monthly/annual)
- Added `PACKAGE_IDS` constant matching RevenueCat package identifiers
- Rewrote `getOfferings()` with `findPackageById()` function
- Redesigned PaywallScreen with tier selector tabs (Novice/Awakening/Enlightenment)
- Added `testflight-sandbox` build profile for testing real purchases
- Attached entitlements to all 6 App Store products in RevenueCat dashboard

### 2025-12-28 - Build 38: Guru Access Fix + Offerings Timeout
**Duration**: ~30 min | **Status**: ✅ Complete
- Fixed Guru access for trial users (was still checking old useGuruAccess hook)
- Added 10-second timeout to loadOfferings() to prevent hanging
- useGuru.ts now uses useEffectiveAccess().hasGuruAnalysis

### 2025-12-28 - Build 37: Complete Trial System Overhaul
**Duration**: ~2 hours | **Status**: ✅ Complete
- Created trialStore.ts for 7-day trial tracking (independent of RevenueCat)
- Created useEffectiveAccess hook to combine trial + subscription status
- Reverted FEATURE_LIMITS.free back to locked state
- Added timeout to loadSubscription() in subscriptionStore
- Updated GuruScreen, WorkbookScreen, MeditateScreen to use useEffectiveAccess
- Initialized trial on app startup in App.tsx

### 2025-12-28 - Build 36: Feature Gating Fix + Guru Rate Limiting (BROKEN)
**Duration**: ~2 hours | **Status**: ⚠️ Broken (see Build 37)
- Attempted fix for feature gating by updating FEATURE_LIMITS.free
- Added Guru rate limiting: 3 requests/day for free/trial users
- Created guruRateLimitStore.ts for daily usage tracking
- Problem: Conflated "free tier" with "trial" - broke when TestFlight bypass disabled

### 2025-12-28 - Build 35: PaywallScreen Loading Fix
**Duration**: ~1 hour | **Status**: ✅ Complete
- Fixed infinite loading spinner when RevenueCat offerings fail to load
- Separated loading state from error state in PaywallScreen
- Added error UI with "Try Again" button for retry capability
- Also fixed ProfileScreen to use `statusLabel` instead of `statusText`

### 2025-12-27 - Build 34 + Subscription System Investigation
**Duration**: ~3 hours | **Status**: ✅ Complete
- Built and deployed Build 34 to TestFlight (production profile)
- Investigated RevenueCat configuration via Playwright
- Found root cause: old products not attached to entitlements
- Fixed ProfileScreen to use RevenueCat tier instead of database
- Added database sync after purchase/restore in subscriptionStore

### 2025-12-16 - Guru AI Enhancement
**Duration**: ~3 hours | **Status**: ✅ Complete
- Fixed `guruService.ts` to use `ai_conversations` table (was querying non-existent table)
- Implemented dynamic life area analysis from Wheel of Life scores
- Added smart breathing suggestions based on user's weak areas

### 2025-12-16 - Profile/Settings Implementation
**Duration**: ~2 hours | **Status**: ✅ Complete
- Built 8 new profile screens with iOS native integrations
- Created 17 new files (navigator, settings components, screens)
- Added push notifications, biometrics, email composer

### 2025-12-15 - Guru AI Local Testing
**Duration**: ~2 hours | **Status**: ✅ Complete
- Changed dev bypass from env vars to `__DEV__` global
- Set up test user with enlightenment tier access
- Build 19 submitted to TestFlight

### 2025-12-14 - Guru Analysis Fixes
**Duration**: ~3 hours | **Status**: ✅ Complete
- Fixed function name mismatch (`guru-analyze` → `guru-analysis`)
- Fixed request format (`userMessage` → `message`)
- Fixed Phase 1 worksheet count (4 → 11)

### 2025-12-14 - Auto-Save Bug Fix
**Duration**: ~2 hours | **Status**: ✅ Complete
- Fixed race condition in auto-save cycle across all 35 workbook screens
- Added `hasLoadedInitialData` useRef pattern to prevent data overwrites
- Build 15-18 included incremental fixes

### 2025-12-13 - App Store Submission
**Duration**: ~2 hours | **Status**: ✅ Complete
- Submitted Build 13 (v1.0.0) to Apple App Store
- Set pricing to Free, created iPad screenshot
- Git tag: `v1.0.0-beta.13`

---

*For entries before December 13, 2025, see `MTU-project-status-archive.md`*

---

## Quick Health Check

Run this script to verify everything is working:

```bash
#!/bin/bash
# Quick health check for Manifest the Unseen project

echo "=== MTU Project Health Check ==="
echo ""

# 1. Node.js version
echo "1. Checking Node.js..."
node --version || echo "❌ Node.js not found"
echo ""

# 2. Supabase status
echo "2. Checking Supabase..."
npx supabase status 2>&1 | grep -q "Running" && echo "✅ Supabase running" || echo "❌ Supabase not running (start with: npx supabase start)"
echo ""

# 3. Mobile dependencies
echo "3. Checking mobile dependencies..."
cd mobile 2>/dev/null && npm list --depth=0 2>&1 | grep -E "expo|react-native" | head -5 || echo "❌ Mobile dependencies not installed"
cd ..
echo ""

# 4. TypeScript compilation
echo "4. Checking TypeScript..."
cd mobile && npm run type-check 2>&1 | grep -q "0 errors" && echo "✅ TypeScript: 0 errors" || echo "❌ TypeScript errors found"
cd ..
echo ""

# 5. Git status
echo "5. Checking Git status..."
git status --short | wc -l | xargs -I {} echo "Uncommitted changes: {}"
echo ""

echo "=== Health Check Complete ==="
```

**Expected Results**:
- ✅ Node.js v18+
- ✅ Supabase all services running
- ✅ Expo + React Native installed
- ✅ TypeScript: 0 errors
- ✅ Git clean or only tracking docs

**To run**: Copy script to `scripts/health-check.sh`, chmod +x, then `./scripts/health-check.sh`

---

## For Future Sessions

**When returning to this project after a break**:

1. **Read this file first** (MTU-PROJECT-STATUS.md) - You'll know exactly where we are
2. **Check "Current Blockers"** - See what's pending
3. **Check the Change Log** - See recent activity
4. **Run Quick Health Check** - Verify environment still functional

**Common "Return from Break" Commands**:
```bash
# Start Expo dev server
cd mobile && npm start

# Check git status
git status

# View recent commits
git log --oneline -10

# Verify TypeScript
cd mobile && npm run type-check
```

**Questions This Doc Answers**:
- ✅ Where are we in the 28-week timeline? (Week 8 - App Store submission complete)
- ✅ What's the current status? (Awaiting App Store Review)
- ✅ What's included in the latest build? (See Build 29/30 section)
- ✅ What are the current blockers? (See "Current Blockers" section)
- ✅ How do I get my environment running? (See "Get Running in 5 Minutes")
- ✅ What docs should I read? (See "Documentation Index")

**Historical Reference**:
For pre-December 13, 2025 development logs and change history, see `MTU-project-status-archive.md`

---

**Last Updated by**: Claude Code (TestFlight Subscription System Fixes)
**Session Date**: January 7, 2026
**Document Version**: 2.12.0
