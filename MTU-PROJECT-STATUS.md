# MTU Project Status

**Last Updated**: 2025-12-25
**Project**: Manifest the Unseen iOS App
**Platform**: Mobile-First (iOS primary, Android future)
**Timeline**: Week 8 of 28 (App Store Submission Complete)
**Status**: 🟡 **BUILD 29 - WAITING FOR APP STORE REVIEW** - Resubmitted Dec 25, 2025

---

## 🎉 MILESTONE: App Store Resubmission Complete!

| Item | Value |
|------|-------|
| **Version** | 1.0.0 |
| **Build (App Store)** | 29 (production profile) |
| **Build (TestFlight)** | 30 (testflight profile) |
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
| `production` | `eas build --profile production` | App Store (RevenueCat enabled, no bypasses) |

**What's Included in Build 30 (TestFlight Testing - Dec 25):**
- ✅ **TestFlight build profile** - TESTFLIGHT_FULL_ACCESS=true (bypasses subscription)
- ✅ DEV_SKIP_AUTH=false (authentication still required)
- ✅ All compliance features from Build 28/29
- ⚠️ **FOR TESTING ONLY** - Not for App Store submission

**What's Included in Build 29 (App Store Resubmission - Dec 25):**
- ✅ **Production build profile** - TESTFLIGHT_FULL_ACCESS=false, DEV_SKIP_AUTH=false
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
ec47eb9 feat(web): add FAQ about The Guru AI feature
953b6b1 feat(web): CTA buttons scroll to QR code promo banner
07d8491 feat(web): landing page updates - navbar, parallax, styled sections
19f9330 feat(promo): add EARLY50 promo code system for early adopters
e5da735 fix(guru): resolve navigation loop bug + add workbook update re-assessment
8820282 feat(splash): Add APS branded splash screen on black background
```

---

## Quick Status

### Current Phase
**Week 8 of 28**: APP STORE SUBMISSION COMPLETE 🍎
- **Started**: November 17, 2025
- **App Store Submitted**: December 13, 2025
- **Actual Status**: ✅ MVP COMPLETE - Awaiting Apple Review (24-48 hours typical)

### Last Activity
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

### ✅ Week 1: Infrastructure Foundation (Nov 17-18)
**Status**: 100% Complete

**Monorepo Structure**
- `mobile/` - React Native app
- `packages/shared/` - Shared TypeScript code (models, validation, utilities)
- `supabase/` - Database migrations, Edge Functions, config

**Design System**
- `mobile/src/theme/colors.ts` - Purple/gold brand palette (WCAG AA contrast)
- `mobile/src/theme/typography.ts` - Font scale (h1-h6, body, caption)
- `mobile/src/theme/spacing.ts` - 4px base grid system
- `mobile/src/theme/shadows.ts` - iOS/Android elevation system

**Component Library** (5 atomic components)
- `Button` - 4 variants (primary, secondary, ghost, outline), 3 sizes, haptic feedback
- `TextInput` - Labels, error states, character counter, icon support
- `Card` - 3 elevation levels, press handling
- `Loading` - Spinner and skeleton variants
- `Text` - 13 typography variants

**Database Schema**
- 8 tables: users, workbook_progress, journal_entries, meditations, meditation_sessions, ai_conversations, vision_boards, knowledge_embeddings
- 27 RLS policies for data security
- Migrations ready: `supabase/migrations/20250102000000_*.sql`

### ✅ Week 2: Authentication System (Nov 18)
**Status**: 100% Complete (UI + Service Layer)

**Authentication Service** (`mobile/src/services/auth.ts` - 371 lines)
- ✅ `signUpWithEmail()` - Email/password registration with email confirmation
- ✅ `signInWithEmail()` - Login with credentials
- ✅ `signInWithApple()` - Apple Sign-In (placeholder, Week 4 implementation)
- ✅ `signOut()` - Session termination
- ✅ `resetPassword()` - Password reset email
- ✅ `updatePassword()` - Change password for authenticated user
- ✅ `getCurrentUser()` - Fetch current user
- ✅ `getCurrentSession()` - Get session with tokens
- ✅ `fetchUserProfile()` - Load user profile from database
- ✅ `onAuthStateChange()` - Auth event listener

**Authentication Screens** (3 screens, 995 lines total)
- `WelcomeScreen.tsx` - Onboarding with "Get Started" and "Sign In" buttons
- `LoginScreen.tsx` (311 lines) - Email/password login, forgot password link, Apple Sign-In button
- `SignupScreen.tsx` (368 lines) - Full registration form (name, email, password, confirm, terms)
- `ForgotPasswordScreen.tsx` (255 lines) - Password reset flow with email input

**Navigation Integration** (`mobile/src/navigation/`)
- `RootNavigator.tsx` - Conditional rendering: AuthNavigator (logged out) vs TabNavigator (logged in)
- `AuthNavigator.tsx` - Stack navigator for Welcome → Login → Signup → Forgot Password
- `TabNavigator.tsx` - 5 tabs (Home, Workbook, Journal, Meditate, Profile)

**State Management** (`mobile/src/stores/authStore.ts`)
- Zustand store for auth state (user, session, profile, loading, error)
- Session persistence and restoration on app launch
- Automatic profile fetching after sign-in

### ✅ Week 3: Expo Configuration (Nov 19)
**Status**: 100% Complete

**Expo SDK 54 Setup**
- ✅ Installed 272 packages (React Native 0.73 via Expo)
- ✅ Created `mobile/app.json` - iOS/Android configuration
- ✅ Created `mobile/index.js` - Expo entry point
- ✅ Updated `mobile/package.json` - Expo scripts (start, android, ios, expo-go)
- ✅ Fixed `mobile/tsconfig.json` - Extended expo/tsconfig.base

**Cross-Platform Development Workflow**
- ✅ Windows PC → Android emulator (primary development)
- ✅ Windows PC → iPhone/iPad via Expo Go (iOS testing without macOS)
- ✅ Hot reload working (~2 second refresh on both platforms)
- ✅ QR code workflow for instant iOS preview

**Documentation** (1,850 lines total)
- ✅ `docs/android-emulator-setup.md` (650 lines) - Complete Android Studio guide
- ✅ `docs/ios-expo-go-setup.md` (550 lines) - iPhone/iPad Expo Go testing
- ✅ `docs/expo-setup-complete.md` (650 lines) - Full setup report

**Placeholder Assets**
- ✅ 1x1 pixel placeholders (icon.png, splash.png, adaptive-icon.png)
- ✅ Asset replacement guide (mobile/assets/README.md)

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

## Testing Strategy & iOS Deployment (2025-11-27)

### Development Environment (Windows 11 - No Mac Required)

**Current Stack**:
- **Expo SDK 54** with React 19.1.0 + React Native 0.81.5 (Legacy Architecture)
- **Styling**: Custom design system using `StyleSheet.create` (NOT Tailwind/NativeWind)
- **Auth Bypass**: `EXPO_PUBLIC_DEV_SKIP_AUTH=true` in `.env` for development

### Testing Hierarchy (Recommended Order)

#### 1. Browser Testing (Fastest Iteration)
```bash
cd mobile && npm start
# Press 'w' to open web browser
```
- Use Chrome DevTools → Device Mode (F12 → Toggle device toolbar)
- Select "iPhone 14 Pro" or similar for realistic sizing
- **Limitations**: No native haptics, no native navigation feel
- **Best for**: Layout, colors, component styling, dark mode verification

#### 2. Expo Go (Real Device Testing - No Build Required)
```bash
cd mobile && npm start
# Scan QR code with Expo Go app on iPhone/Android
```
- **Best for**: Haptics, gestures, navigation, real performance
- **Limitation**: Some native modules may not work in Expo Go

#### 3. EAS Build (Production-Ready iOS Testing)
```bash
# Install EAS CLI (one-time)
npm install -g eas-cli

# Login to Expo account
eas login

# Create development build for iOS
eas build --platform ios --profile development

# Create preview build (installable via TestFlight)
eas build --platform ios --profile preview

# Create production build (App Store submission)
eas build --platform ios --profile production
```

### iOS Deployment Path (No Mac Required!)

**EAS Build enables iOS deployment from Windows**:

1. **Apple Developer Account** ($99/year) - Required for TestFlight/App Store
2. **EAS Build** (cloud) - Compiles iOS app on Expo's Mac servers
3. **TestFlight** - Install builds on real iOS devices for beta testing
4. **App Store Connect** - Submit for review and publish

**EAS Build Profiles** (in `eas.json`):
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

### Why Staying on Expo SDK 54

**Decision**: Keep Expo SDK 54 (stable) rather than upgrading to SDK 55+
- SDK 54 uses Legacy Architecture (stable, well-tested)
- SDK 55+ requires New Architecture migration (breaking changes)
- Current codebase works well with SDK 54
- No features require SDK 55 at this time

**If upgrading later**:
- Use `npx expo install --check` to verify compatibility
- Test thoroughly in development build before production

### Development Workflow (Daily)

```bash
# 1. Start Expo (browser + device testing)
cd mobile && npm start

# 2. Test in browser first (fastest iteration)
# Press 'w' → Chrome DevTools device mode

# 3. Test on device via Expo Go
# Scan QR code with Expo Go app

# 4. TypeScript check before commit
npm run type-check

# 5. Commit changes
git add . && git commit -m "feat: description"
```

### Dark Mode Enforcement Rules

**All UI must follow these color conventions**:
- **Backgrounds**: Use `colors.background.*` (never `colors.white` or light grays)
- **Cards/Elevated**: Use `colors.background.elevated` (dark gray)
- **Borders**: Use `colors.border.default` (muted)
- **Pressed/Hover states**: Use `colors.primary[900]` or `colors.gray[800]` (not `colors.primary[50]`)
- **Track colors** (sliders): Use `colors.gray[700]` (not `colors.gray[200]`)

**Files that define the color system**:
- `mobile/src/theme/colors.ts` - All color tokens
- `mobile/src/theme/index.ts` - Theme exports

### Quick Dark Mode Audit Command

To find remaining light backgrounds:
```bash
# Search for potential light colors
cd mobile/src
grep -rn "colors.white" --include="*.tsx"
grep -rn "colors.gray\[50\]" --include="*.tsx"
grep -rn "colors.gray\[100\]" --include="*.tsx"
grep -rn "colors.gray\[200\]" --include="*.tsx"
grep -rn "colors.primary\[50\]" --include="*.tsx"
grep -rn "colors.primary\[100\]" --include="*.tsx"
grep -rn "#fff" --include="*.tsx"
grep -rn "#ffffff" --include="*.tsx"
```

### Manual Testing Checklist (To Be Completed)
- [ ] Install Android Studio and create AVD
- [ ] Launch app in Android emulator
- [ ] Install Expo Go on iPhone/iPad
- [ ] Launch app via QR code on iOS device
- [ ] Test hot reload on both platforms
- [ ] Complete signup flow with real email
- [ ] Verify user created in Supabase database
- [ ] Test login with created credentials
- [ ] Test forgot password flow
- [ ] Test navigation between all tabs (Home, Workbook, Journal, Meditate, Profile)

---

## Known Issues & Blockers

### Active Blockers (Stop Work)
None currently. All infrastructure in place, ready for feature development.

### Known Issues (Can Work Around)
1. **Android Emulator Not Installed**
   - **Description**: Cannot test Android app locally without emulator
   - **Workaround**: Use Expo Go on iPhone for iOS testing
   - **Fix Planned**: Follow `docs/android-emulator-setup.md` (~60 min one-time setup)

2. **Auth Flow Not Tested End-to-End**
   - **Description**: Auth screens built but not tested with real Supabase backend
   - **Workaround**: UI verified in code review, backend service exists
   - **Fix Planned**: Manual testing in next session (Week 4 start)

3. **Placeholder Assets**
   - **Description**: Using 1x1 pixel placeholders for app icon and splash screen
   - **Workaround**: Functional for development, Expo accepts minimal assets
   - **Fix Planned**: Replace with professional 1024x1024 assets before TestFlight (Week 25+)

### Technical Debt
- **Placeholder Email Templates** (supabase/templates/*.html) - Minimal HTML, need branded design (Week 25+)
- **No Test Suite Yet** - Unit/integration tests planned for Week 8+ (after core features built)
- **Apple Sign-In Placeholder** - Auth service has stub, needs native implementation (Week 4)
- **No Error Boundary** - React error boundaries needed for production (Week 23-24)

---

## Documentation Index

### Essential Reading (Start Here)
1. **[MTU-PROJECT-STATUS.md](./MTU-PROJECT-STATUS.md)** - This file (current state snapshot)
2. **[CLAUDE.md](./CLAUDE.md)** - Project instructions for Claude Code (always read first when starting work)
3. **[README.md](./README.md)** - Project overview and quick start

### Product & Technical Specs
- **[PRD](./docs/manifest-the-unseen-prd.md)** - Complete Product Requirements Document (202KB, 1,663 lines)
- **[TDD](./docs/manifest-the-unseen-tdd.md)** - Technical Design Document (architecture, API specs, database schema)
- **[Summary](./docs/manifest-the-unseen-summary.md)** - Quick reference for key decisions and tech stack

### Design Assets (NEW - Nov 22)
- **[App Design Spec](./docs/APP-DESIGN.md)** - Visual design system, screen mockups, logo, color palette (v1.2)
- **[Color Palette Tool](./docs/color-palette.html)** - Interactive HTML tool for color preview/editing
- **[Final Logo](https://www.canva.com/design/DAG5fDUuSKw/vrxVe9MlJt0uA7o-oI2BhQ/edit)** - Approved: Monk + Chakras + Mandala (Canva)

### Setup Guides (For New Sessions/Context)
- **[Android Emulator Setup](./docs/android-emulator-setup.md)** (650 lines) - Complete Android Studio installation
- **[iOS Expo Go Setup](./docs/ios-expo-go-setup.md)** (550 lines) - iPhone/iPad testing workflow
- **[Expo Setup Complete](./docs/expo-setup-complete.md)** (650 lines) - Full Expo configuration report
- **[Database Execution Guide](./docs/database-execution-guide.md)** (900+ lines) - Supabase migrations and RLS policies

### Session Logs (Chronological History)
- **[Session 2025-11-17](./agent-orchestration/logs/sessions/2025-11/session-2025-11-17.md)** - Day 1 (Infrastructure)
- **[Session 2025-11-18](./agent-orchestration/logs/sessions/2025-11/session-2025-11-18.md)** - Day 2 (Auth + Design)
- **[Session 2025-11-19](./agent-orchestration/logs/sessions/2025-11/session-2025-11-19.md)** - Day 3 (Expo)
- **[Session 2025-11-20](./agent-orchestration/logs/sessions/2025-11/session-2025-11-20.md)** - Day 4
- **[Session 2025-11-21](./agent-orchestration/logs/sessions/2025-11/session-2025-11-21.md)** - Day 5 (Infra Testing)
- **[Session 2025-11-22](./agent-orchestration/logs/sessions/2025-11/session-2025-11-22.md)** - Day 6 (Design Mockups + Logo) ← TODAY
- **[Week 1 Summary](./agent-orchestration/logs/sessions/2025-11/WEEK-1-SUMMARY.md)** - Infrastructure week recap
- **[Week 2 Summary](./agent-orchestration/logs/sessions/2025-11/WEEK-2-SUMMARY.md)** - Design + Auth week recap

### Agent Orchestration System
- **[Orchestration README](./agent-orchestration/README.md)** - How to use agents, templates, workstreams
- **[Master Plan](./agent-orchestration/orchestrator/master-plan.md)** - Complete 28-week roadmap
- **[Agent Prompts](./agent-orchestration/agents/implement/)** - Custom system prompts for specialists

### Architecture Decisions (ADRs)
- **[ADR-001: React Native + TypeScript](./agent-orchestration/decisions/ADR-001-react-native-typescript.md)** - Why React Native over native Swift
- **[ADR-002: Supabase Backend](./agent-orchestration/decisions/ADR-002-supabase-backend.md)** - Why Supabase over Firebase/Convex
- **[ADR-003: On-Device Whisper](./agent-orchestration/decisions/ADR-003-on-device-whisper.md)** - Privacy-first transcription choice

---

## Change Log

### 2025-12-16 - GURU AI ENHANCEMENT COMPLETE 🧘✨

**Duration**: ~3 hours (swarm implementation)
**Focus**: Transform Guru AI from static phase-based to dynamic workbook analysis

**Problem Solved**:
1. **Critical Bug**: `guruService.ts` was querying non-existent `guru_conversations` table
2. **Static Suggestions**: Guru gave same suggestions regardless of user's actual weak areas

**Solution Applied**:
Implemented dynamic life area analysis using swarm (2 parallel agents).

**Database Changes**:
- Added `life_areas TEXT[]` column to meditations table
- Created GIN index for efficient array queries
- Updated seed data with life area tags for all 6 meditation types

**Edge Function Enhancements** (`supabase/functions/guru-analysis/index.ts`):
- Added `WheelOfLifeData` interface for type-safe Wheel of Life parsing
- Added `LIFE_AREA_TO_BREATHING` mapping (8 life areas → breathing exercises)
- Added `extractLowLifeAreas()` function to detect scores < 5/10
- Updated `callClaude()` to inject low areas into system prompt
- Dynamic breathing suggestions based on user's weakest area

**Mobile Code Fixes** (`mobile/src/services/guruService.ts`):
- Changed all queries from `guru_conversations` → `ai_conversations`
- Added `conversation_type='guru'` and `guru_phase` filters
- Updated upsert conflict resolution

**New Files Created**:
- `mobile/src/constants/lifeAreaMappings.ts` - Life area constants and mappings
- `supabase/migrations/20251217000000_meditation_life_areas.sql` - Database migration

**Deployments**:
- ✅ Database migration deployed via Supabase Dashboard
- ✅ Seed data UPDATE statements executed
- ✅ Edge Function deployed via CLI (`npx supabase functions deploy guru-analysis`)

**How It Works Now**:
1. User completes Phase 1 (including Wheel of Life with 8 life area scores)
2. Guru analyzes worksheet data and identifies areas scoring < 5/10
3. System prompt includes: "User's low areas: Finance (3/10), Health (4/10)"
4. Breathing exercise dynamically selected based on primary weak area
5. Guru references specific low scores in personalized feedback

**Working Document**: `docs/guru/GURU-AI-ENHANCEMENT-PROGRESS.md`
**Feature Documentation**: `docs/guru/README.md`
**Test Data SQL**: `docs/guru/test-data.sql`

**Test Data Populated**:
- User: jimmy@agenticpersonnel.com (enlightenment tier)
- Phase 1: 11 worksheets completed
- Wheel of Life: Career (3), Finance (2), Health (4) - all below threshold

**Status**: ✅ 100% Complete - All deployed, test data ready
**Next Step**: Test Guru AI at http://localhost:8081

---

### 2025-12-16 - PROFILE/SETTINGS COMPLETE IMPLEMENTATION ⚙️

**Duration**: ~2 hours
**Focus**: Build complete Profile/Settings functionality with iOS integrations

**Problem Identified**:
ProfileScreen existed but was a "hollow shell" - all buttons except Sign Out had no onPress handlers. The settingsStore was fully implemented but not connected to any UI.

**Solution Applied**:
Complete implementation of Profile navigation stack with 8 new screens and iOS native integrations.

**Files Created** (17 new files):

**Navigation:**
- `mobile/src/navigation/ProfileNavigator.tsx` - Stack navigator for all profile screens

**Settings Components:**
- `mobile/src/components/settings/SettingsSection.tsx` - Grouped container with title
- `mobile/src/components/settings/SettingsRow.tsx` - Base row with label, description, chevron
- `mobile/src/components/settings/SettingsToggle.tsx` - Toggle switch row
- `mobile/src/components/settings/SettingsPicker.tsx` - Segmented control picker
- `mobile/src/components/settings/index.ts` - Component exports

**Profile Screens:**
- `mobile/src/screens/profile/AccountSettingsScreen.tsx` - Edit name, view email/membership date
- `mobile/src/screens/profile/NotificationsScreen.tsx` - Push notifications & reminders with time pickers
- `mobile/src/screens/profile/AppearanceScreen.tsx` - Theme (light/dark/system), font size, reduced motion
- `mobile/src/screens/profile/PrivacySecurityScreen.tsx` - Face ID/Touch ID lock, analytics/crash toggles
- `mobile/src/screens/profile/HelpCenterScreen.tsx` - Contact form → jimmy@agenticpersonnel.com
- `mobile/src/screens/profile/AboutScreen.tsx` - Version info, legal links
- `mobile/src/screens/profile/PrivacyPolicyScreen.tsx` - In-app privacy policy
- `mobile/src/screens/profile/TermsOfServiceScreen.tsx` - In-app terms of service

**Hooks:**
- `mobile/src/hooks/useNotifications.ts` - Push notification permissions & scheduling

**Files Modified** (3 files):
- `mobile/src/types/navigation.ts` - Extended ProfileStackParamList with new routes
- `mobile/src/navigation/MainTabNavigator.tsx` - Uses ProfileNavigator instead of ProfileScreen
- `mobile/src/screens/ProfileScreen.tsx` - All navigation handlers wired up

**Dependencies Installed:**
```bash
npx expo install expo-notifications expo-local-authentication expo-mail-composer @react-native-community/datetimepicker
```

**Features Implemented:**

| Screen | Features |
|--------|----------|
| AccountSettings | Edit profile name, view email, membership date, avatar display |
| Notifications | Push permissions, daily inspiration, meditation/journal reminders with iOS time pickers |
| Appearance | Theme (Light/Dark/System), font size (Small/Medium/Large), reduced motion toggle |
| PrivacySecurity | Face ID/Touch ID lock, analytics toggle, crash reporting toggle |
| HelpCenter | Subject selector, message input, sends email via expo-mail-composer |
| About | App version (expo-constants), description, Privacy Policy & Terms links |

**Settings Store Integration:**
All screens now properly connected to `useSettingsStore` with these methods:
- `setTheme()`, `setFontSize()`, `setReducedMotion()`
- `setPushNotifications()`, `setDailyInspirations()`, `setProgressMilestones()`
- `setMeditationReminder()`, `setJournalReminder()`
- `setAnalytics()`, `setCrashReporting()`

**iOS Native Features:**
- Push notification permissions and scheduling (expo-notifications)
- Biometric authentication check (expo-local-authentication)
- Email composition (expo-mail-composer)
- Time picker modals (@react-native-community/datetimepicker)

**TypeScript Status**: 0 errors after fixes applied

**Next Steps**:
1. Test Profile functionality on device
2. Create new TestFlight build (Build 20)
3. Resume Guru AI Enhancement work

---

### 2025-12-15 - GURU AI LOCAL TESTING (IN PROGRESS) 🔧

**Duration**: Session in progress (previous session crashed)
**Focus**: Test Guru AI locally to debug authentication issues

**Problem Identified**:
- Guru AI feature not working properly in production
- Local testing revealed authentication errors when calling Edge Function
- Session crashed due to 70+ accumulated node processes (Metro bundlers)

**Changes Made**:
1. **subscriptionStore.ts** - Changed local dev bypass from env vars to `__DEV__` global
   - `__DEV__` is automatically true in Expo Go/Metro, false in production builds
   - Enables local testing with full enlightenment tier access
   - No risk of leaking to production (build-time constant)

2. **Database Setup**:
   - User `jimmy@agenticpersonnel.com` set to enlightenment tier
   - Phase 1 worksheets (11/11) marked complete for Guru testing

3. **Build 19 Submitted**:
   - TestFlight link: https://appstoreconnect.apple.com/apps/6756403109/testflight/ios
   - Build URL: https://expo.dev/accounts/agentic-personnel/projects/manifest-the-unseen/builds/f0e0d3bc-95ff-418f-bae3-33f6d6481d7e

**Current Blocker**:
- ❌ Authentication errors when calling Guru Edge Function locally
- Need to debug: Is it JWT issue? Session issue? Supabase client config?

**Next Steps**:
1. Start fresh local dev environment (all node processes killed)
2. Start Expo with `npx expo start --clear`
3. Test authentication flow
4. Debug Guru API call with detailed logging

---

### 2025-12-14 - GURU ANALYSIS FEATURE FIXES 🧘

**Duration**: ~3 hours
**Focus**: Debug and fix Guru feature not working properly

**Problems Identified**:
1. **Function Name Mismatch** - `guruService.ts` was calling `guru-analyze` but Edge Function was named `guru-analysis`
2. **Request Format Mismatch** - Service was sending `userMessage` but Edge Function expected `message`
3. **Worksheet Count Wrong** - `WORKSHEETS_PER_PHASE[1]` was set to 4, but Phase 1 actually has 11 worksheets
4. **Edge Function Not Deployed** - `guru-analysis` function wasn't deployed to Supabase

**Fixes Applied**:

**1. guruService.ts** (`mobile/src/services/guruService.ts`):
```typescript
// Changed function name from 'guru-analyze' to 'guru-analysis'
// Added request transformation:
const edgeFunctionRequest = {
  message: request.userMessage,  // Transform userMessage → message
  phaseNumber: request.phaseNumber,
  conversationId: request.conversationId,
  isInitialAnalysis: !request.conversationId,
};
```

**2. workbook.ts** (`mobile/src/types/workbook.ts`):
```typescript
// Fixed Phase 1 worksheet count
WORKSHEETS_PER_PHASE[1] = 11;  // Was 4, now correctly 11
```

**3. guru-analysis Edge Function** (`supabase/functions/guru-analysis/index.ts`):
- Updated `WORKSHEETS_PER_PHASE[1]` from 4 → 11
- Deployed v2 to Supabase production

**4. Test Data Setup**:
- Marked all existing Phase 1 worksheets as `completed: true`
- Inserted missing worksheets (strengths-weaknesses, know-yourself, thought-awareness)
- `test@manifest.app` now has 11/11 Phase 1 worksheets completed

**Files Modified**:
| File | Change |
|------|--------|
| `mobile/src/services/guruService.ts` | Fixed function name + request format |
| `mobile/src/types/workbook.ts` | Fixed WORKSHEETS_PER_PHASE[1]: 4 → 11 |
| `supabase/functions/guru-analysis/index.ts` | Fixed worksheet counts + deployed v2 |
| `mobile/app.json` | Incremented buildNumber: 15 → 16 |

**Database Changes**:
- `workbook_progress` table: Updated/inserted Phase 1 worksheets for `test@manifest.app`

**Build Deployed**:
- **Build 16** submitted to TestFlight
- Build URL: https://expo.dev/accounts/agentic-personnel/projects/manifest-the-unseen/builds/3b540ea2-8a0a-4f0c-89ef-96f1063c323a

**Test Accounts Ready**:
| Email | Tier | Phase 1 Status | Notes |
|-------|------|----------------|-------|
| `test@manifest.app` | enlightenment | 11/11 complete | Original test account |
| `jimmy@agenticpersonnel.com` | enlightenment | 11/11 complete | Added 2025-12-15 for local testing |

---

### 2025-12-14 - AUTO-SAVE BUG FIX COMPLETE 🔧

**Duration**: ~2 hours
**Focus**: Fix critical workbook data loss issue

**Problem Identified**:
Users reported habit tracking progress not saving properly. Root cause was a race condition in the auto-save cycle: when save completes, the TanStack Query cache update triggers the load useEffect, which overwrites user changes made between save trigger and completion.

**Solution Applied**:
Added `hasLoadedInitialData` useRef pattern to all 35 workbook screens:
```typescript
const hasLoadedInitialData = useRef(false);

useEffect(() => {
  if (savedProgress?.data && !hasLoadedInitialData.current) {
    setLocalData(savedProgress.data);
    hasLoadedInitialData.current = true;
  }
}, [savedProgress]);
```

**Files Fixed** (35 screens across all 10 phases):

**Phase 1** (11 screens):
- HabitsAuditScreen, WheelOfLifeScreen, SWOTAnalysisScreen
- FeelWheelScreen, ValuesScreen, ABCModelScreen
- StrengthsWeaknessesScreen, ComfortZoneScreen, KnowYourselfScreen
- AbilitiesRatingScreen, ThoughtAwarenessScreen

**Phase 2** (3 screens):
- PurposeScreen, VisionBoardScreen, LifeMissionScreen

**Phase 3** (3 screens):
- SMARTGoalsScreen, ActionPlanScreen, TimelineScreen

**Phase 4** (3 screens):
- FearInventoryScreen, LimitingBeliefsScreen, FearFacingPlanScreen

**Phase 5** (3 screens):
- SelfLoveAffirmationsScreen, SelfCareRoutineScreen, InnerChildScreen

**Phase 6** (3 screens):
- ThreeSixNineScreen, ScriptingScreen, WOOPScreen

**Phase 7** (3 screens):
- GratitudeJournalScreen, GratitudeLettersScreen, GratitudeMeditationScreen

**Phase 8** (3 screens):
- EnvyInventoryScreen, InspirationReframeScreen, RoleModelsScreen

**Phase 9** (3 screens):
- TrustAssessmentScreen, SurrenderPracticeScreen, SignsScreen

**Phase 10** (3 screens):
- JourneyReviewScreen, FutureLetterScreen, GraduationScreen

**Also Fixed**:
- Typography errors in ManuscriptScreen.tsx and ObservableScienceScreen.tsx (`fontFamilies.heading` → `fontFamilies.primary`)
- Missing `useRef` imports in 7 files after parallel agent execution

**Build History**:
| Build | Date | Notes |
|-------|------|-------|
| 18 | Dec 14, 2025 | Purple splash screen fix (was 1x1 red pixel) |
| 17 | Dec 14, 2025 | Guru fixes committed & pushed before build |
| 16 | Dec 14, 2025 | Guru Analysis fixes (function name, request format, worksheet counts) |
| 15 | Dec 14, 2025 | Complete auto-save fix (all 35 screens) |
| 14 | Dec 14, 2025 | Initial fix (3 screens) + typography |
| 13 | Dec 13, 2025 | MVP Beta - App Store Submission |

**Testing Notes**:
- Build 18 includes purple splash screen (no more red flash on launch)
- Test Guru with `test@manifest.app` (11/11 Phase 1 complete)
- Delete app from device before installing to clear cached data

---

### 2025-12-13 - APP STORE SUBMISSION COMPLETE 🍎

**Duration**: ~2 hours
**Focus**: Submit MVP to Apple App Store

**App Store Submission**:
- Submitted Build 13 (version 1.0.0) to Apple for review
- Set pricing to Free ($0.00) for 175 countries
- Configured Content Rights Information
- Created and uploaded iPad 13" screenshot (2048 × 2732px)
- App status: **Waiting for Review** (24-48 hours typical)

**Git Milestone**:
- Created tag `v1.0.0-beta.13` - MVP Beta Build
- Pushed all changes to GitHub

**Package Cleanup**:
- Removed `expo-secure-store` (caused auth issues)
- Removed `babel-plugin-transform-remove-console` (not needed)

**Build History Update**:
| Build | Date | Notes |
|-------|------|-------|
| 13 | Dec 13, 2025 | MVP Beta - **App Store Submission** |
| 12 | Dec 12, 2025 | Fixed security revert issues |
| 11 | Dec 11, 2025 | Security fixes (broken - reverted) |

**Known Issue to Fix Post-Launch**:
- Habit tracking progress not saving in workbook

**Next Steps**:
1. Wait for Apple review (24-48 hours)
2. Address any review feedback
3. Fix habit tracking bug
4. Plan marketing/launch activities

---

*For Change Log entries before December 13, 2025, see `MTU-project-status-archive.md`*

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

**Last Updated by**: Claude Code (Status File Cleanup)
**Session Date**: December 25, 2025
**Document Version**: 2.0.0
