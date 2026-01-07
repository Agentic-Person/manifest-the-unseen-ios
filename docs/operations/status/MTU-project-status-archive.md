# MTU Project Status Archive

**Purpose**: Historical entries archived from `project-status.md` to keep the main file manageable.

**Archive Date**: January 7, 2026

---

## Archived Change Log Entries (December 2025)

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

## Archived Detailed Build Sections (December 2025)

### 📱 SUBSCRIPTION SYSTEM - December 27-28, 2025

#### Build 34 (Dec 27) - Subscription Sync Fixes
- ✅ **ProfileScreen** now uses RevenueCat tier (was reading stale database tier)
- ✅ **subscriptionStore** syncs database after purchase/restore
- ✅ **Production profile** has `TESTFLIGHT_FULL_ACCESS=false` (no bypass)

#### RevenueCat Investigation (Dec 27-28)
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

#### PaywallScreen Loading Fix (Dec 28)
**Issue:** Clicking "Manage" button showed infinite loading spinner

**Root Cause:** PaywallScreen condition `isLoadingOfferings || !offerings` kept showing spinner when:
- `isLoadingOfferings = false` (loading complete)
- `offerings = null` (RevenueCat failed to fetch)

**Fix Applied:**
- Separated loading state from error state
- Show error UI with "Try Again" button when offerings fail
- Commit: `37f7369`

#### Build 35 (Dec 28) - PaywallScreen Fix
- ✅ Fixed infinite loading spinner when RevenueCat offerings fail
- ✅ Added error UI with "Try Again" button
- ⚠️ **Issue discovered:** All features locked for free users (wrong FEATURE_LIMITS)

#### Build 36 (Dec 28) - Feature Gating Fix + Guru Rate Limiting (BROKEN)
**Issue:** Free users had NO access to workbook/meditations when RevenueCat failed

**Root Cause:** `FEATURE_LIMITS.free` had `maxPhase: 0` and `maxMeditations: 0`

**Fixes Applied:**
- ✅ **FEATURE_LIMITS.free** updated: Full access during 7-day trial
- ✅ **FEATURE_LIMITS.novice** updated: Guru locked (must upgrade to Awakening)
- ✅ **Guru rate limiting** added: Free/trial users get 3 requests/day
- ✅ **Rate limit modal** added: Shows upgrade prompt when limit exceeded
- ✅ **Documentation** added: `docs/SUBSCRIPTION_FEATURE_GATING.md`

**Problem Discovered:** Build 36 used `production` profile which disabled TestFlight bypass. User's account had no real paid subscription - everything broke.

#### Build 37 (Dec 28) - Complete Trial System Overhaul
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

#### Build 38 (Dec 28) - Guru Access Fix + Offerings Timeout
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

#### Build 39 (Dec 29) - RevenueCat Integration Fix + 3-Tier Paywall
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

#### App Store Connect Subscription Metadata Fix (Dec 29)
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

#### Build 40 (Dec 29) - RevenueCat Debug Overlay
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

#### ✅ RESOLVED (Dec 30) - Paid Apps Agreement Now Active!

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

## Archived Previous Activity Entries (December 2025)

### Previous Activity (Dec 20 PM)
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

### Previous Activity (Dec 16)
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

### Previous Activity (Dec 15)
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

### Previous Activity (Dec 14 PM)
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

### Previous Activity (Dec 14 AM)
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

### Previous Activity (Dec 13)
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

---

*This archive was created on January 7, 2026 to reduce the size of project-status.md*
