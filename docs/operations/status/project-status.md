# MTU Project Status

**Last Updated**: 2026-01-14 (Build 47 - Comprehensive Spinner Fixes)
**Project**: Manifest the Unseen iOS App
**Platform**: Mobile-First (iOS primary, Android future)
**Timeline**: Week 8 of 28 (App Store Submission - 3rd Attempt)
**Status**: 🟡 **BUILD 47 IN TESTFLIGHT** - Testing comprehensive spinner fixes before App Store submission

---

## 🍎 APPLE APP STORE REJECTION FIX - January 13, 2026

### Summary
Third App Store rejection addressed. Apple cited two issues:
1. **Guideline 4.0 (Design)**: Sign in with Apple button missing Apple logo
2. **Guideline 2.1 (Performance)**: "Provider is not enabled" error on iPad after Sign in with Apple

### Root Causes Identified
1. Custom `Button` component used instead of official `AppleAuthenticationButton`
2. Missing `usesAppleSignIn: true` in app.json
3. **Supabase Apple provider was NOT configured** (primary cause of iPad error)
4. iPad sign out button touch handling issues

### Code Changes Completed ✅

| File | Change |
|------|--------|
| `mobile/app.json` | Added `usesAppleSignIn: true`, incremented build to 45 |
| `mobile/src/screens/auth/LoginScreen.tsx` | Replaced custom Button with official `AppleAuthenticationButton` |
| `mobile/src/screens/auth/SignupScreen.tsx` | Replaced custom Button with official `AppleAuthenticationButton` |
| `mobile/src/screens/ProfileScreen.tsx` | Improved sign out button touch handling (hitSlop, minHeight, keyboardShouldPersistTaps) |

### Commit
```
e515a46 fix: Apple App Store rejection - Sign in with Apple button and iPad fixes
```

### Apple Developer Portal Configuration Completed ✅

**Services ID Configuration:**
- Services ID: `app.manifesttheunseen`
- Sign in with Apple: ENABLED
- Domain: `zbyszxtwzoylyygtexdr.supabase.co`
- Return URL: `https://zbyszxtwzoylyygtexdr.supabase.co/auth/v1/callback`
- Primary App ID: `ZGGFWCAT7B.com.manifesttheunseen.app`

**New Sign in with Apple Key Created:**
- Key Name: `MTU Supabase Auth Key`
- Key ID: `SHNNVJ7L5Z`
- .p8 private key file: DOWNLOADED (saved locally)

**Important Credentials for Supabase:**
| Field | Value |
|-------|-------|
| Services ID | `app.manifesttheunseen` |
| Authorized Client IDs | `com.manifesttheunseen.app` |
| Team ID | `ZGGFWCAT7B` |
| Key ID | `SHNNVJ7L5Z` |
| Private Key | (contents of downloaded .p8 file) |

### Supabase Apple Provider Configuration Completed ✅

**Configured via Supabase Dashboard > Authentication > Providers > Apple:**
- Apple provider: ENABLED
- Authorized Client IDs: `com.manifesttheunseen.app`
- Secret Key: (not required for native iOS authentication)
- Status: "Successfully updated settings" confirmed

**Note**: For native iOS Sign in with Apple (using `expo-apple-authentication`), the Secret Key/Private Key is NOT required in Supabase. The native flow handles authentication directly with Apple on-device, then sends the identity token to Supabase. The Secret Key is only needed for web-based OAuth flows.

### Remaining Steps

1. ✅ ~~Configure Supabase Apple Provider~~ - DONE
2. ✅ ~~Build 45~~ - Built and tested, found spinner issues
3. ✅ ~~Fix spinner issues (Build 46)~~ - Fixed Phase 1 loading + subscription spinners
4. ✅ ~~Fix more spinner issues (Build 47)~~ - Fixed workbook save + auth init + account deletion
5. **Test Build 47 on iPad** (IN PROGRESS) - Verify all fixes work
6. **Submit to App Store Connect** - After successful testing

---

## 🔄 COMPREHENSIVE SPINNER FIXES - January 14, 2026 (Build 47)

### Summary
During Build 46 testing on iPad, discovered additional spinner issues in workbook save functionality and identified app-wide loading state vulnerabilities through comprehensive audit.

### Full App Spinner Audit Completed
Audited 84+ files with loading states, 45 files using ActivityIndicator, 7 React Query mutation hooks, and 4 Zustand stores.

### Issue 1: Workbook Save Spinner Stuck (Phase IV and all phases)

**Symptoms:** "Saving..." indicator spins forever when editing workbook exercises and scrolling.

**Root Causes Identified:**
1. React Query mutation `isPending` state could get stuck due to callback architecture
2. `SaveIndicator` only checked `isSaving`, no fallback for stuck states
3. No safety timeout to recover from stuck saves

**Fixes Applied:**

| File | Change |
|------|--------|
| `mobile/src/hooks/useAutoSave.ts` | Added local `isSavingLocal` state with 10-second safety timeout; always resets even if React Query gets confused |
| `mobile/src/components/workbook/SaveIndicator.tsx` | Added "recently saved" fallback if `lastSaved` within 5 seconds; shows warning with retry option after 10 seconds stuck |

### Issue 2: Auth Initialization Can Hang Forever

**Symptoms:** App stuck on loading screen if Supabase is slow or unavailable.

**Root Cause:** `authStore.initialize()` had NO timeout on `getSession()` or profile fetch.

**Fix Applied:**

| File | Change |
|------|--------|
| `mobile/src/stores/authStore.ts` | Added 10-second timeout to both `getSession()` and profile fetch; gracefully treats timeout as "not logged in" state |

### Issue 3: Account Deletion Can Hang Forever

**Symptoms:** Delete account spinner never stops if operation fails.

**Root Cause:** `authService.deleteAccount()` call had no timeout protection.

**Fix Applied:**

| File | Change |
|------|--------|
| `mobile/src/screens/profile/AccountSettingsScreen.tsx` | Added 15-second timeout with user-friendly error message; resets `isDeleting` state on timeout |

### Commits
```
7830997 fix: comprehensive spinner/loading state fixes across app
4d76197 build: increment iOS build number to 47
```

### Build 47 Details
- **Build ID**: `0975d97f-32ba-448d-9d37-1e793497e9a9`
- **TestFlight**: https://appstoreconnect.apple.com/apps/6756403109/testflight/ios
- **IPA**: https://expo.dev/artifacts/eas/2aKQFQonCdVcQajyGPeYYz.ipa

### Testing Checklist for Build 47
- [ ] Workbook save indicator works properly (shows "Saved" or recovers from stuck)
- [ ] App launches without hanging (even on slow network)
- [ ] Account deletion shows timeout error if slow (doesn't hang)
- [ ] All previous Build 46 fixes still work:
  - [ ] Phase 1 workbook loads or shows error with retry
  - [ ] Subscription switching completes properly
  - [ ] Sign in with Apple works on iPad
  - [ ] Sign out button responds on iPad

---

## 🔄 INFINITE SPINNER FIXES - January 13, 2026 (Build 46)

### Summary
During Build 45 testing, discovered infinite spinner issues in workbook Phase 1 and subscription plan switching. Both issues investigated and fixed in Build 46.

### Issue 1: Workbook Phase 1 Infinite Spinner

**Symptoms:** Phase 1 Self-Evaluation screen shows gold spinner indefinitely, never loads exercises.

**Root Causes Identified:**
1. `getPhaseProgress()` and `getAllWorkbookProgress()` had no timeout protection - queries could hang forever
2. `Phase1Dashboard` only checked `isLoading`, never showed error state if query failed
3. React Query retry logic caused 7+ seconds of apparent "hanging" on failures

**Fixes Applied:**

| File | Change |
|------|--------|
| `mobile/src/services/workbook.ts` | Added 5-second timeout to `getPhaseProgress()` and `getAllWorkbookProgress()` with fallback values |
| `mobile/src/screens/workbook/Phase1/Phase1Dashboard.tsx` | Added error state UI with "Retry" button |
| `mobile/src/hooks/usePhaseExercises.ts` | Updated hook to return `isError`, `error`, and `refetch` |

### Issue 2: Subscription Plan Switching Hangs

**Symptoms:** Switching subscription tiers (e.g., Enlightenment → Novice) causes infinite spinner, especially on "Start free trial" button.

**Root Causes Identified:**
1. `purchasePackage()` action didn't always reset `isPurchasing` state (multiple code paths)
2. If `loadSubscription()` timed out after purchase, spinner never cleared
3. No debouncing - rapid taps caused race conditions with conflicting state updates

**Fixes Applied:**

| File | Change |
|------|--------|
| `mobile/src/stores/subscriptionStore.ts` | Added `finally` block to always reset `isPurchasing`; wrapped `loadSubscription()` in try/catch |
| `mobile/src/screens/subscription/PaywallScreen.tsx` | Added `purchaseInProgressRef` for debouncing; prevents concurrent purchase attempts |

### Commits
```
69240b5 fix: resolve infinite spinner issues in workbook and subscription screens
4a6db6c build: increment iOS build number to 46
```

### Build 46 Details
- **Build ID**: `d767516f-bd56-4beb-b1ed-30839c1c9cb3`
- **TestFlight**: https://appstoreconnect.apple.com/apps/6756403109/testflight/ios
- **IPA**: https://expo.dev/artifacts/eas/sAJSX3hHk52upG523RwMR6.ipa

### Testing Checklist for Build 46
- [ ] Phase 1 workbook loads exercises (or shows error with retry button)
- [ ] Subscription switching completes (spinner always stops)
- [ ] Rapid taps on purchase button are debounced
- [ ] Sign in with Apple works on iPad
- [ ] Sign out button responds on iPad

---

### Previous Rejection Details (January 11, 2026)

**Review Environment:**
- Submission ID: 6f2c691d-e993-4ed2-ad15-639a416fe91b
- Review Device: iPad Air 11-inch (M3)
- iPadOS Version: 26.2
- Version: 1.0.0

**Screenshots from Apple Review:**
- Login screen showing custom gold-bordered "Sign in with Apple" button (no Apple logo)
- Error message: `Provider (issuer "https://appleid.apple.com") is not enabled`

---

## Previous Activity

### 🧘 MEDITATION SYSTEM AUDIT & GURU BUG FIX - January 11, 2026

### Summary
Audited the meditation/prayer/breathing system and fixed a critical bug in the Guru AI that was preventing dynamic content recommendations from working.

### Critical Bug Fixed ✅

**Issue**: Guru edge function was querying wrong column name for tier filtering
- **File**: `supabase/functions/guru-analysis/index.ts`
- **Lines 947, 997**: `.in('tier', allowedTiers)` → `.in('tier_required', allowedTiers)`
- **Impact**: Dynamic meditation/prayer recommendations by life area were failing silently
- **Status**: Fixed and deployed to production

### Content Planning Completed

**Created comprehensive content plan from Google Sheet tracking document:**
- Source: [Content Spreadsheet](https://docs.google.com/spreadsheets/d/1sYa4PrrLJFWscYMurlRlwZmGkLNk7GAg)
- 40 total scripts (30 active, 10 skipped)
- 15 prayers + 15 meditations ready for production
- Organized by 10 categories with life area mappings

| Category | Phase | Prayers | Meditations |
|----------|-------|---------|-------------|
| Healing & Restoration | Phase 5 | 2 | 2 |
| Abundance & Prosperity | Phase 6 | 2 | 2 |
| Self-Worth & Identity | Phase 1+5 | 2 | 2 |
| Forgiveness & Release | Phase 4 | 2 | 2 |
| Fear & Courage | Phase 4 | 2 | 1 |
| Gratitude & Joy | Phase 7 | 2 | 0 |
| Surrender & Trust | Phases 9-10 | 1 | 1 |
| Purpose & Vision | Phase 2 | 0 | 2 |
| Relationships & Love | Phase 5 | 0 | 2 |
| Spiritual Connection | Throughout | 2 | 2 |

### Files Created/Modified

| File | Action |
|------|--------|
| `supabase/functions/guru-analysis/index.ts` | Fixed tier_required bug (lines 947, 997) |
| `docs/features/meditation/content-plan.md` | NEW - Complete content tracking document |
| `supabase/migrations/YYYYMMDD_add_meditation_content.sql.template` | NEW - Migration template for 30 items |

### Commit
```
6327662 fix: correct tier column name in Guru meditation/prayer queries
```

### Next Steps for Meditation System
1. Record/render audio for all 30 scripts
2. Get actual durations from audio files
3. Upload audio to Supabase Storage
4. Fill in migration template with durations
5. Run migration to add content to database
6. Update Guru phase suggestions with new content titles

---

## 📱 BUILD 44 PRODUCTION BUILD - January 9, 2026

### Build Details
| Item | Value |
|------|-------|
| **Build Number** | 44 |
| **Version** | 1.0.0 |
| **Profile** | production (App Store submission) |
| **Built** | January 9, 2026 |
| **Build ID** | `c46f0d53-1ef5-469a-9788-34c0041d8cec` |
| **EAS Link** | https://expo.dev/accounts/agentic-personnel/projects/manifest-the-unseen/builds/c46f0d53-1ef5-469a-9788-34c0041d8cec |

### What's Included in Build 44

**This is a production build for App Store submission**, replacing the old Build 29. It includes:

- ✅ **Profile Tab iPad Fix** - Added `tabBarIcon` to Profile tab (person icon)
- ✅ **All IAP Configuration** - RevenueCat subscription integration
- ✅ **All Latest Code** - Everything from Build 43 and earlier
- ✅ **Production Environment** - TESTFLIGHT_FULL_ACCESS=false, proper subscription gating

### Why Build 44?

Previously submitted Build 29 to App Store, but that was an old build missing the Profile tab icon fix. Build 44 is a fresh production build with all fixes included.

### Commits
```
850fbde fix: remove invalid autoSubmit from eas.json build config
12ef778 fix: move autoSubmit to correct location in eas.json
d3dc1bc build: increment iOS build number to 44 (production submission)
```

### Next Steps
1. Wait for Build 44 to appear in App Store Connect (~15-20 min)
2. Create new app submission using Build 44
3. Include all 6 IAPs in the submission
4. Submit for Apple review

---

## 📱 BUILD 43 RELEASED TO TESTFLIGHT - January 8, 2026 (Late Evening)

### Build Details
| Item | Value |
|------|-------|
| **Build Number** | 43 |
| **Version** | 1.0.0 |
| **Profile** | testflight (full access bypass) |
| **Submitted** | January 8, 2026 ~11:20 PM |
| **Build ID** | `4936f7ea-4742-435e-a068-df2f6c2efe70` |
| **EAS Link** | https://expo.dev/accounts/agentic-personnel/projects/manifest-the-unseen/builds/4936f7ea-4742-435e-a068-df2f6c2efe70 |

### What's New in Build 43

**Profile Tab iPad Fix:**
- ✅ Added missing `tabBarIcon` to Profile tab (person/person-outline icon)
- Root cause: Profile tab was the only tab without an icon, causing touch detection issues on iPad
- File modified: `mobile/src/navigation/MainTabNavigator.tsx`

**PaywallScreen Dynamic Pricing:**
- ✅ Tier tabs now show dynamic prices from RevenueCat instead of hardcoded values

**Config Fix:**
- ✅ Added auto-submit for `testflight` profile in eas.json (was missing, causing manual submit needed)

### Commits
```
b70a05f config: add auto-submit for testflight profile
7efb33e build: increment iOS build number to 43 (Profile tab icon fix)
0063711 fix: add Profile tab icon for iPad compatibility + IAP submission
```

---

## 🍎 APP STORE RESUBMISSION - January 8, 2026 (Evening)

### Summary
Resolved Apple's rejection reason "2.1.0 Performance: App Completeness" by submitting In-App Purchases with the app version and fixing the Profile tab iPad bug.

### App Store Submission Status
| Item | Value |
|------|-------|
| **Status** | Waiting for Review |
| **Date Submitted** | January 8, 2026 at 10:58 PM |
| **Build** | iOS App 1.0 (Build 29) |
| **Submission ID** | 2115db35-9f20-4543-84eb-40979f7a6eb4 |

### Issue 1: In-App Purchases Not Submitted ✅ FIXED

**Problem**: Apple rejected the app because "the app includes references to paid subscriptions but the associated in-app purchase products have not been submitted for review."

**Root Cause**: The 6 subscription products were created in App Store Connect but not added to the app version for submission.

**Solution**:
1. Fixed **Enlightenment Path Yearly** screenshot dimension error (uploaded 1284x2778 image)
2. All 6 subscriptions now show "Ready to Submit"
3. Added all 6 subscriptions to iOS App Version 1.0 via "In-App Purchases and Subscriptions" section
4. Resubmitted app for review

**Subscriptions Submitted**:
| Product ID | Reference Name | Status |
|------------|----------------|--------|
| `manifest_novice_monthly` | Novice Path Monthly | ✅ Submitted |
| `manifest_novice_yearly` | Novice Path Yearly | ✅ Submitted |
| `manifest_awakening_monthly` | Awakening Path Monthly | ✅ Submitted |
| `manifest_awakening_yearly` | Awakening Path Yearly | ✅ Submitted |
| `manifest_enlightenment_monthly` | Enlightenment Path Monthly | ✅ Submitted |
| `manifest_enlightenment_yearly` | Enlightenment Path Yearly | ✅ Submitted |

### Issue 2: Profile Tab iPad Bug ✅ FIXED

**Problem**: Apple reported "No further action occurred after tapping on any features in Profile tab" on iPad Air 11-inch (M3) with iPadOS 26.2.

**Root Cause**: The Profile tab in `MainTabNavigator.tsx` was missing the `tabBarIcon` property, while all other tabs had it. On iPad, this caused touch detection issues with the tab bar.

**Solution**: Added `tabBarIcon` using Ionicons `person`/`person-outline` icons.

**File Modified**: `mobile/src/navigation/MainTabNavigator.tsx`
```tsx
// BEFORE (broken)
<Tab.Screen
  name="Profile"
  component={ProfileNavigator}
  options={{
    title: 'Profile',
    tabBarLabel: 'Profile',
    headerShown: false,
    // ❌ Missing tabBarIcon
  }}
/>

// AFTER (fixed)
<Tab.Screen
  name="Profile"
  component={ProfileNavigator}
  options={{
    title: 'Profile',
    tabBarLabel: 'Profile',
    headerShown: false,
    tabBarIcon: ({ focused }) => (
      <Ionicons
        name={focused ? 'person' : 'person-outline'}
        size={24}
        color={focused ? colors.primary[500] : colors.text.tertiary}
      />
    ),
  }}
/>
```

**Testing Note**: User reports Build 42 works fine on their older iPad - the bug may be specific to newer iPad Air 11" (M3) with iPadOS 26.2. Fix deployed to ensure compatibility across all iPad models.

### Next Steps
1. Wait for Apple review (typically 1-3 days)
2. If approved, IAPs will be live and app can be released
3. If rejected again, address any new issues

---

## 📱 BUILD 42 RELEASED TO TESTFLIGHT - January 8, 2026

### Build Details
| Item | Value |
|------|-------|
| **Build Number** | 42 |
| **Version** | 1.0.0 |
| **Profile** | testflight (full access bypass) |
| **Submitted** | January 8, 2026 10:22 AM |
| **Build ID** | `1b6386b4-1f5d-4287-b39c-c3f27ce7a2a1` |
| **EAS Link** | https://expo.dev/accounts/agentic-personnel/projects/manifest-the-unseen/builds/1b6386b4-1f5d-4287-b39c-c3f27ce7a2a1 |

### What's New in Build 42

**Prayer Sync & Web Platform Fixes (6 issues):**
- ✅ Web platform Supabase client hanging → Direct fetch() to PostgREST API
- ✅ Prayer player 406/409 errors → Skip meditation queries for prayers
- ✅ Text sync timing off by ~5 seconds → Added AUDIO_OFFSET_MS constant
- ✅ Wrong text displayed → Use content field instead of line_timings.text
- ✅ Flickering animation → Smooth 70%→100% opacity pulse
- ✅ Communion prayer wrong data → SQL migration to fix title/content

**TestFlight Subscription Fixes (4 issues):**
- ✅ Buttons not clickable on higher tiers → Mock offerings for TestFlight mode
- ✅ UI not updating after purchase → Direct state update + simulated purchase
- ✅ Trial/Tier confusion in Profile → Enhanced status labels with trial days
- ✅ Test Mode toggle in PaywallScreen debug panel (tap title 5x)

**New Feature - Synchronized Prayer Text Display:**
- ✅ Karaoke-style prayer player with synchronized text display
- ✅ Text displays line-by-line as audio plays
- ✅ Auto-calculated timing based on word count ratio
- ✅ "Prayers" tab added to Meditate screen

**TypeScript & Tooling:**
- ✅ TypeScript error fixes across multiple files
- ✅ Prayer line timing migration for Whisper timestamps
- ✅ Scripts for generating prayer timestamps

### Commits Since Build 41
```
ef54993 fix: remove deprecated autoSubmit from eas.json
97e41c1 build: increment iOS build number to 42
e3412bd fix: TypeScript errors and prayer timestamp tooling
4400ed5 docs: update project status with prayer sync fixes
2a41686 db: fix Communion with the Divine prayer title and content
72ec074 chore: add debug logging to meditation hooks and screen
712c608 fix: prayer text display flickering animation
0e84b91 fix: prayer text synchronization with audio
```

---

## 💰 SUBSCRIPTION PRICING UPDATES - January 8, 2026

### Summary
Updated subscription prices across App Store Connect and the landing page to align with new pricing strategy.

### App Store Connect Changes

| Tier | Old Monthly | New Monthly | Old Yearly | New Yearly |
|------|-------------|-------------|------------|------------|
| **Novice** | $7.99 | $4.99 | $59.99 | $49.99 |
| **Awakening** | $12.99 | $11.99 | $99.99 | $129.99 |
| **Enlightenment** | $49.99 | $49.99 (unchanged) | $499.99 | $499.99 (unchanged)* |

*Note: User requested $498.99/yr but this is not a valid Apple price point. Kept at $499.99.

### Landing Page Changes

**File: `web/components/Pricing.tsx`**
- Seeker (Novice): $7.99 → $4.99/mo, $79.99 → $49.99/yr
- Awakening: $19.99 → $11.99/mo, $199.99 → $129.99/yr
- Enlightenment: Already at $49.99/mo, $499.99/yr (no change needed)

### Commits
```
e1d7e83 fix: update landing page prices to match App Store Connect
```

### Notes
- RevenueCat automatically syncs with App Store Connect - no manual changes needed
- Prices recalculated for all 175 countries/regions in App Store Connect
- 50% promo code (EARLY50) still applies on top of new prices

---

## 🔧 PRAYER SYNC & WEB PLATFORM FIXES - January 8, 2026

### Issues Fixed

| Issue | Root Cause | Fix Applied | Status |
|-------|------------|-------------|--------|
| **Web Platform Hanging** | Supabase JS client deadlocking on web | Replaced client queries with direct fetch() to PostgREST API | ✅ Fixed |
| **Prayer Player 406/409 Errors** | Using prayer ID to query meditations table | Skip useMeditation() and session tracking for prayers | ✅ Fixed |
| **Text Sync Timing Off** | Audio has 5s intro not in Whisper timestamps | Added AUDIO_OFFSET_MS constant (5000ms) | ✅ Fixed |
| **Wrong Text Displayed** | line_timings.text used instead of content | Changed to use content field for display, line_timings for timing only | ✅ Fixed |
| **Flickering Animation** | Fade-out-then-fade-in sequence | Changed to subtle 70%→100% opacity pulse | ✅ Fixed |
| **Communion Prayer Wrong Data** | Database had wrong title and content | SQL migration to fix title and content | ✅ Fixed |

### Changes Made

**File: `mobile/src/services/meditationService.ts`**
- `getMeditations()`: Now uses direct fetch() instead of Supabase client
- `getMeditationById()`: Now uses direct fetch() with proper headers
- Bypasses Supabase client auth deadlock on web platform

**File: `mobile/src/services/prayerService.ts`**
- `getPrayersWithAudio()`: Now uses direct fetch() instead of Supabase client
- `getPrayerById()`: Now uses direct fetch() with proper headers
- Same fix as meditation service for web platform

**File: `mobile/src/screens/meditation/MeditationPlayerScreen.tsx`**
- Skip `useMeditation()` fetch when playing prayers (prayer IDs don't exist in meditations table)
- Skip session tracking for prayers (no meditation_sessions records for prayers)
- Use `prayerData.content` for text display (matches line_timings source)

**File: `mobile/src/hooks/usePrayerTiming.ts`**
- Added `AUDIO_OFFSET_MS = 5000` to compensate for audio intro/silence
- Changed to use `content` field for display text (source of truth)
- Use `line_timings` only for timing data (startMs/endMs)
- Offset applied to both Whisper-based and calculated timing modes
- Added fallback to calculated timing when line counts don't match

**File: `mobile/src/components/prayer/PrayerTextDisplay.tsx`**
- Fixed flickering animation when lines change
- Old: Fade to 0, then fade to 1 (caused flicker)
- New: Start at 70% opacity, fade to 100% (smooth pulse)

**Database Migration: `20260108_fix_communion_prayer_content.sql`**
- Updated "Communion with the Divine" prayer with correct content
- Fixed title from "The Presence Within" to "Communion with the Divine"

### Commits
```
511ec8a fix: bypass Supabase client hanging on web with direct fetch
06a931d fix: prayer playback - skip meditation queries and session tracking
0e84b91 fix: prayer text synchronization with audio
712c608 fix: prayer text display flickering animation
72ec074 chore: add debug logging to meditation hooks and screen
2a41686 db: fix Communion with the Divine prayer title and content
```

### Technical Details

**Why Supabase Client Hangs on Web:**
The Supabase JS client has internal auth/session management that can deadlock on web platform. Despite having a `noopLock` workaround, queries would start but never complete - no network requests were made. Direct `fetch()` to the PostgREST API bypasses this entirely.

**Prayer Text Sync Architecture:**
1. `content` field = source of truth for display text
2. `line_timings` = timing data only (startMs/endMs from Whisper)
3. If line counts don't match, fall back to calculated timing
4. AUDIO_OFFSET_MS compensates for audio intro not in original transcription

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

## 📱 SUBSCRIPTION SYSTEM - December 2025

> **📁 Archived**: Detailed build history for Builds 34-40, RevenueCat investigation, trial system overhaul, and Paid Apps Agreement resolution moved to [`MTU-project-status-archive.md`](./MTU-project-status-archive.md).

**Summary of December subscription work:**
- Builds 34-40: Trial system, feature gating, RevenueCat integration
- Root cause found: Paid Apps Agreement not signed (resolved Dec 30)
- All 6 subscription products configured with entitlements
- Debug overlay added for troubleshooting

**Current Business Model:**
| Tier | Workbook | Meditations | Guru |
|------|----------|-------------|------|
| Trial (7 days) | ✅ All phases | ✅ All | ✅ **3/day** |
| Free (trial expired) | ❌ Locked | ❌ Locked | ❌ Locked |
| Novice | ✅ All phases | ✅ Music only | ❌ Locked |
| Awakening+ | ✅ All phases | ✅ All | ✅ Unlimited |

---

## 🎉 MILESTONE: Build 44 Ready for App Store!

| Item | Value |
|------|-------|
| **Version** | 1.0.0 |
| **Build (App Store)** | 44 (production profile - Jan 9, all fixes included) |
| **Build (TestFlight)** | 43 (testflight profile - Jan 8, Profile tab icon fix) |
| **Build (Latest)** | 44 (production - Jan 9, 2026) |
| **Git Tag** | `v1.0.0-beta.13` |
| **App Store Status** | 🟡 Build 44 Ready - Needs Submission |
| **Build Date** | January 9, 2026 |
| **Build ID** | c46f0d53-1ef5-469a-9788-34c0041d8cec |

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

**What's Included in Build 42 (TestFlight - Jan 8, 2026):**
- ✅ **Prayer Sync Fixes** - Web platform hanging, text sync timing, flickering animation
- ✅ **Subscription Fixes** - Mock offerings, UI updates after purchase, test mode toggle
- ✅ **Synchronized Prayer Display** - Karaoke-style prayer player with line-by-line text
- ✅ **TypeScript Fixes** - Error fixes across multiple files
- ✅ **Pricing Updates** - New subscription pricing in App Store Connect
- ✅ All features from Build 41 and earlier

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
ef54993 fix: remove deprecated autoSubmit from eas.json
97e41c1 build: increment iOS build number to 42
e3412bd fix: TypeScript errors and prayer timestamp tooling
4400ed5 docs: update project status with prayer sync fixes
2a41686 db: fix Communion with the Divine prayer title and content
712c608 fix: prayer text display flickering animation
0e84b91 fix: prayer text synchronization with audio
```

---

## Quick Status

### Current Phase
**Week 8 of 28**: APP STORE SUBMISSION COMPLETE 🍎
- **Started**: November 17, 2025
- **App Store Submitted**: December 13, 2025
- **Actual Status**: ✅ MVP COMPLETE - Awaiting Apple Review (24-48 hours typical)

### Last Activity
- **Date**: January 9, 2026 - Build 44 Production Build for App Store
- **Duration**: ~15 minutes
- **What Was Done**:
  1. Recognized that submitting old Build 29 was incorrect (missing Profile tab fix)
  2. Incremented build number to 44
  3. Fixed eas.json autoSubmit configuration error
  4. Built fresh production build with all fixes included
- **Status**: ✅ **COMPLETE** - Build 44 ready for App Store submission
- **Build Details**:
  - Build Number: 44
  - Profile: production (App Store submission)
  - Build ID: `c46f0d53-1ef5-469a-9788-34c0041d8cec`
- **Commits**: `850fbde`, `12ef778`, `d3dc1bc`
- **Notes**: EAS build credits at 97% for the month

### Previous Activity
- **Date**: January 8, 2026 (Late Evening) - Build 43 Released to TestFlight
- **Duration**: ~30 minutes
- **What Was Done**:
  1. Built and submitted Build 43 to TestFlight with Profile tab icon fix
  2. Added auto-submit config for testflight profile (was missing)
- **Status**: ✅ **COMPLETE** - Build 43 submitted to TestFlight
- **Build Details**:
  - Build Number: 43
  - Profile: testflight (full access bypass)
  - Build ID: `4936f7ea-4742-435e-a068-df2f6c2efe70`
- **Commits**: `b70a05f`, `7efb33e`, `0063711`
- **Notes**: Profile tab icon fix verified working on TestFlight

### Previous Activity
- **Date**: January 8, 2026 (Evening) - App Store IAP Submission + Profile Tab Fix
- **Duration**: ~1 hour
- **What Was Done**:
  1. Fixed IAP submission issue via App Store Connect (Playwright)
  2. Fixed Profile tab iPad bug (missing tabBarIcon)
  3. Resubmitted app to App Store with all 6 subscriptions
- **Status**: ✅ **COMPLETE** - App resubmitted, waiting for Apple review
- **Submission Details**:
  - Submission Date: January 8, 2026 at 10:58 PM
  - Build: iOS App 1.0 (Build 29)
  - IAPs: All 6 subscriptions included
- **Files Modified**: `mobile/src/navigation/MainTabNavigator.tsx`
- **Notes**: User confirms Build 42 works fine on older iPad - Profile tab bug may be specific to iPad Air 11" (M3)

### Previous Activity
- **Date**: January 8, 2026 - Build 42 Released to TestFlight
- **Duration**: ~30 minutes
- **What Was Done**: Compiled and submitted Build 42 to TestFlight with all recent fixes
- **Status**: ✅ **COMPLETE** - Build 42 submitted and processing
- **Build Details**:
  - Build Number: 42
  - Profile: testflight (full access bypass)
  - Build ID: `1b6386b4-1f5d-4287-b39c-c3f27ce7a2a1`
- **Commits**: `ef54993`, `97e41c1`, `e3412bd`
- **Notes**: EAS build credits at 88% for the month

### Previous Activity
- **Date**: January 8, 2026 - Prayer Sync & Web Platform Fixes
- **Duration**: ~3 hours
- **What Was Done**: Fixed web platform hanging, prayer text synchronization, and database content
- **Status**: ✅ **COMPLETE** - All 6 issues fixed
- **Issues Fixed**:
  - Web platform Supabase client hanging → Direct fetch() to PostgREST API
  - Prayer player 406/409 errors → Skip meditation queries for prayers
  - Text sync timing off by ~5 seconds → Added AUDIO_OFFSET_MS constant
  - Wrong text displayed → Use content field instead of line_timings.text
  - Flickering animation → Smooth 70%→100% opacity pulse
  - Communion prayer wrong data → SQL migration to fix title/content
- **Files Modified**:
  - `meditationService.ts`, `prayerService.ts`, `MeditationPlayerScreen.tsx`
  - `usePrayerTiming.ts`, `PrayerTextDisplay.tsx`, `useMeditation.ts`, `MeditateScreen.tsx`
- **Commits**: `511ec8a`, `06a931d`, `0e84b91`, `712c608`, `72ec074`, `2a41686`

### Previous Activity
- **Date**: January 7, 2026 - TestFlight Subscription System Fixes
- **Duration**: ~2 hours
- **What Was Done**: Fixed all TestFlight subscription issues found during Build 41 testing
- **Status**: ✅ **COMPLETE** - All 4 issues fixed, ready for new build

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

### December 2025 Previous Activities (Archived)

> **📁 Archived**: December 2025 previous activity entries moved to [`MTU-project-status-archive.md`](./MTU-project-status-archive.md).

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

### 2026-01-09 - Build 44 Production Build for App Store
**Duration**: ~15 min | **Status**: ✅ Complete
- **BUILD**: Fresh production build (Build 44) for App Store submission
- **FIX**: Previously submitted old Build 29 which was missing Profile tab icon fix
- **INCLUDES**: All fixes from Build 43 - Profile tab icon, IAP configuration, all latest code
- **CONFIG FIX**: Removed invalid `autoSubmit` from eas.json build config
- **Build ID**: `c46f0d53-1ef5-469a-9788-34c0041d8cec`
- **Commits**: `850fbde`, `12ef778`, `d3dc1bc`
- **Notes**: EAS build credits at 97% for the month

### 2026-01-08 (Late Evening) - Build 43 Released to TestFlight
**Duration**: ~30 min | **Status**: ✅ Complete
- **BUILD**: Compiled and submitted Build 43 to TestFlight
- **Profile Tab Fix**: Added person icon to Profile tab for iPad compatibility
- **Config Fix**: Added auto-submit for testflight profile in eas.json
- **Build ID**: `4936f7ea-4742-435e-a068-df2f6c2efe70`
- **Commits**: `b70a05f`, `7efb33e`, `0063711`

### 2026-01-08 (Evening) - App Store IAP Submission + Profile Tab Fix
**Duration**: ~1 hour | **Status**: ✅ Complete
- **IAP SUBMISSION**: Fixed and resubmitted all 6 subscriptions with app version via App Store Connect
  - Fixed Enlightenment Path Yearly screenshot dimension error
  - Added all subscriptions to iOS App Version 1.0
  - App now "Waiting for Review"
- **PROFILE TAB FIX**: Added missing `tabBarIcon` to Profile tab in `MainTabNavigator.tsx`
  - Root cause: Profile tab was only tab without icon, causing iPad touch detection issues
  - Solution: Added Ionicons `person`/`person-outline` icon
- **Files Modified**: `mobile/src/navigation/MainTabNavigator.tsx`
- **Testing Note**: Build 42 works on older iPads - bug may be iPad Air 11" (M3) specific

### 2026-01-08 - Build 42 Released to TestFlight
**Duration**: ~30 min | **Status**: ✅ Complete
- **BUILD**: Compiled and submitted Build 42 to TestFlight
- **Profile**: testflight (full access bypass)
- **Includes**: All fixes from Jan 7-8 (prayer sync, subscription fixes, prayer display feature)
- **Build ID**: `1b6386b4-1f5d-4287-b39c-c3f27ce7a2a1`
- **Commits**: `ef54993`, `97e41c1`, `e3412bd`
- **Notes**: EAS build credits at 88% for the month

### 2026-01-08 - Prayer Sync & Web Platform Fixes
**Duration**: ~3 hours | **Status**: ✅ Complete
- **FIXED**: Web platform Supabase client hanging (direct fetch to PostgREST)
- **FIXED**: Prayer player 406/409 errors (skip meditation queries for prayers)
- **FIXED**: Text sync timing off by ~5 seconds (AUDIO_OFFSET_MS constant)
- **FIXED**: Wrong text displayed (use content field, not line_timings.text)
- **FIXED**: Flickering animation (smooth 70%→100% opacity pulse)
- **FIXED**: Communion prayer wrong data (SQL migration)
- **Files Modified**:
  - `mobile/src/services/meditationService.ts` - Direct fetch instead of Supabase client
  - `mobile/src/services/prayerService.ts` - Direct fetch instead of Supabase client
  - `mobile/src/screens/meditation/MeditationPlayerScreen.tsx` - Skip meditation fetch/sessions for prayers
  - `mobile/src/hooks/usePrayerTiming.ts` - Audio offset, use content for display
  - `mobile/src/components/prayer/PrayerTextDisplay.tsx` - Fixed flickering
- **Commits**: `511ec8a`, `06a931d`, `0e84b91`, `712c608`, `72ec074`, `2a41686`

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

---

### December 2025 Change Log (Archived)

> **📁 Archived**: December 2025 change log entries (Dec 13-30) moved to [`MTU-project-status-archive.md`](./MTU-project-status-archive.md).
>
> **Summary**: Builds 13-40, App Store submission, security audit, subscription system overhaul, Guru AI enhancements, auto-save bug fix, profile/settings implementation.

---

*For entries before January 2026, see `MTU-project-status-archive.md`*

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

**Last Updated by**: Claude Code (Build 44 Production Build for App Store)
**Session Date**: January 9, 2026
**Document Version**: 2.16.0
