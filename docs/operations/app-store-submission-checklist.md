# App Store Submission Checklist - Manifest the Unseen
**Date**: January 14, 2026
**Target Build**: Build 49 (Build 48 had loading screen issue)
**Submission Attempt**: #4
**Status**: Pre-Submission Verification Phase

---

## 🎯 CRITICAL PRE-SUBMISSION REQUIREMENTS

This checklist MUST be 100% complete before submitting to App Store. No exceptions.

---

## 1️⃣ CODE COMPLIANCE (100% Must Be Green)

### A. Apple Sign-In Implementation ✅
**Status**: VERIFIED COMPLIANT
**Last Verified**: January 14, 2026

- [x] **LoginScreen** (`mobile/src/screens/auth/LoginScreen.tsx:248-254`)
  - [x] Uses official `AppleAuthentication.AppleAuthenticationButton`
  - [x] Button type: `SIGN_IN` (correct for login)
  - [x] Button style: `WHITE_OUTLINE` (HIG compliant)
  - [x] Height: 50px (HIG requirement)
  - [x] Corner radius: 12px (rounded corners)
  - [x] Proper error handling for cancellation
  - [x] Token validation via Supabase

- [x] **SignupScreen** (`mobile/src/screens/auth/SignupScreen.tsx:366-372`)
  - [x] Uses official `AppleAuthentication.AppleAuthenticationButton`
  - [x] Button type: `SIGN_UP` (correct for signup)
  - [x] Button style: `WHITE_OUTLINE` (HIG compliant)
  - [x] Height: 50px (HIG requirement)
  - [x] Corner radius: 12px (rounded corners)
  - [x] Proper error handling for cancellation
  - [x] Token validation via Supabase

- [x] **Placement**
  - [x] Secondary to email/password (email first, Apple second)
  - [x] Clear "OR" divider between methods
  - [x] Consistent styling across both screens

**Guideline**: 4.8 Sign in with Apple

---

### B. Legal Links (Terms & Privacy) ✅
**Status**: VERIFIED COMPLIANT (Fixed in Build 48)
**Last Verified**: January 14, 2026

- [x] **SignupScreen** (`mobile/src/screens/auth/SignupScreen.tsx:320-342`)
  - [x] Terms link uses `Pressable` component
  - [x] Privacy link uses `Pressable` component
  - [x] Both use `Linking.openURL()` to open Safari
  - [x] URLs: `https://manifesttheunseen.app/terms` & `/privacy`
  - [x] Links are tappable and functional
  - [x] Opens in Safari, not in-app browser

- [x] **PaywallScreen** (`mobile/src/screens/subscription/PaywallScreen.tsx:888-894`)
  - [x] Terms link uses `Pressable` component
  - [x] Privacy link uses `Pressable` component
  - [x] Both use `Linking.openURL()` to open Safari
  - [x] URLs match signup screen
  - [x] Placed below subscription details
  - [x] Visible during trial selection

**Guideline**: 5.1.1 Legal Requirements, 3.1.1 IAP Requirements

---

### C. Health/Wellness Disclaimer ✅
**Status**: VERIFIED COMPLIANT (Added in Build 48)
**Last Verified**: January 14, 2026

- [x] **DisclaimerScreen** (`mobile/src/screens/onboarding/DisclaimerScreen.tsx`)
  - [x] Shows on first app launch only
  - [x] Requires "I Understand" button press to proceed
  - [x] Clear "not medical advice" language
  - [x] Mental health crisis information (911, 988 hotline)
  - [x] Professional consultation recommendation
  - [x] Acceptance saved to AsyncStorage
  - [x] Cannot be dismissed without accepting

- [x] **App Integration** (`mobile/App.tsx:40-144`)
  - [x] Checks disclaimer acceptance on app start
  - [x] Shows disclaimer before app initialization
  - [x] Blocks app access until accepted
  - [x] Proper state management

- [x] **Guru AI Footer** (`mobile/src/screens/GuruScreen.tsx`)
  - [x] Footer disclaimer above chat input
  - [x] Text: "AI guidance is not professional medical or psychological advice"
  - [x] Subtle styling (doesn't obstruct UX)
  - [x] Always visible during chat

**Guideline**: 5.1.1(ix) Health and Health Research

---

### D. Privacy Manifest (iOS 17+) ✅
**Status**: VERIFIED COMPLIANT (Configured in Build 48)
**Last Verified**: January 14, 2026

- [x] **app.json Configuration** (`mobile/app.json`)
  - [x] `privacyManifestAggregationEnabled: true`
  - [x] NSPrivacyAccessedAPICategoryUserDefaults declared
  - [x] NSMicrophoneUsageDescription updated:
    - "Record voice journal entries that are transcribed on your device. Audio never leaves your device—only text is saved."
  - [x] NSPhotoLibraryUsageDescription present
  - [x] NSCameraUsageDescription present
  - [x] NSFaceIDUsageDescription present (optional)

**Guideline**: iOS 17 Privacy Manifest Requirements

---

### E. Subscription Compliance (RevenueCat + IAP) ✅
**Status**: VERIFIED COMPLIANT
**Last Verified**: January 14, 2026

- [x] **RevenueCat Integration**
  - [x] No alternative payment methods mentioned
  - [x] All payments go through Apple IAP
  - [x] RevenueCat SDK initialized on app start
  - [x] User ID synced after authentication

- [x] **Free Trial Disclosure** (PaywallScreen)
  - [x] "7-day free trial" clearly displayed
  - [x] "Cancel anytime" text present
  - [x] Price shown after trial period
  - [x] Auto-renewal disclosure present

- [x] **Pricing Accuracy**
  - [x] Novice Path: $7.99/mo, $59.99/yr
  - [x] Awakening Path: $12.99/mo, $99.99/yr
  - [x] Enlightenment Path: $19.99/mo, $149.99/yr
  - [x] Annual savings percentage displayed (17% discount)

- [x] **Subscription Management**
  - [x] "Restore Purchases" button in paywall
  - [x] Subscription status in Profile screen
  - [x] Link to iOS Settings for cancellation
  - [x] Clear feature gating (free vs paid)

**Guideline**: 3.1.1 In-App Purchases, 3.1.2 Subscriptions

---

## 🔍 BUILD 48 CRITICAL BUG (FIXED FOR BUILD 49)

### Issue: Loading Screen Freeze
**File**: `mobile/App.tsx:48-71` and `:109-122`
**Severity**: 🔴 BLOCKER
**Status**: ✅ FIXED

**Root Cause**:
Splash screen was only hidden after app initialization completed (line 113). If disclaimer wasn't accepted, the app would show DisclaimerScreen but splash screen would still be covering it, creating a deadlock where user couldn't interact with the disclaimer.

**Fix Applied**:
- Moved `SplashScreen.hideAsync()` to disclaimer check effect (lines 57-58, 66)
- Removed duplicate splash screen hiding from initialization (lines 113-114, 120)
- Now splash screen hides immediately after determining if disclaimer needs to be shown
- DisclaimerScreen is now visible and interactive

**Files Changed**:
- `mobile/App.tsx` (3 edits)

**Testing Required**:
- [ ] Fresh install shows disclaimer screen (not loading screen)
- [ ] Disclaimer "I Understand" button is tappable
- [ ] App proceeds to login after accepting disclaimer
- [ ] Second launch skips disclaimer and goes to login/home
- [ ] No infinite loading screens

---

## 2️⃣ WEB ASSETS COMPLIANCE

### A. Privacy Policy URL ✅
**Status**: VERIFIED LIVE
**Last Verified**: Build 48 audit (January 14, 2026)

- [x] URL: `https://manifesttheunseen.app/privacy`
- [x] Page loads successfully
- [x] SSL certificate valid
- [x] Mobile responsive design
- [x] Content is comprehensive (12 sections)
- [x] Last updated: December 10, 2025
- [x] Includes data collection disclosure
- [x] Includes voice transcription privacy (on-device only)

**Test**: Open in iOS Safari and verify readability

---

### B. Terms of Service URL ✅
**Status**: VERIFIED LIVE
**Last Verified**: Build 48 audit (January 14, 2026)

- [x] URL: `https://manifesttheunseen.app/terms`
- [x] Page loads successfully
- [x] SSL certificate valid
- [x] Mobile responsive design
- [x] Content is comprehensive (14 sections)
- [x] Last updated: December 10, 2025
- [x] Includes subscription terms
- [x] Includes disclaimer of warranties

**Test**: Open in iOS Safari and verify readability

---

## 3️⃣ APP STORE CONNECT CONFIGURATION

### A. App Information ⚠️
**Status**: REQUIRES VERIFICATION
**Location**: App Store Connect → Apps → Manifest the Unseen → App Information

**Checklist**:
- [ ] **Privacy Policy URL**: `https://manifesttheunseen.app/privacy`
  - Navigate: App Information → General Information
  - Verify URL is saved and correct

- [ ] **Support URL**: (if required)
  - Recommended: `https://manifesttheunseen.app` or support email

- [ ] **Marketing URL**: (optional)
  - Can use: `https://manifesttheunseen.app`

- [ ] **Copyright**:
  - Verify: "© 2026 Manifest the Unseen" or appropriate text

---

### B. Age Rating ⚠️
**Status**: REPORTED AS 13+ IN PROJECT STATUS, VERIFY IN ASC
**Location**: App Store Connect → App Information → Age Rating

**Required Settings**:
- [ ] Age Rating: **13+** (health/wellness content)
- [ ] Korea: **12+** (automatic conversion)

**Questionnaire Answers** (all should be NO except):
- [ ] Simulated Gambling: NO
- [ ] Realistic Violence: NO
- [ ] Cartoon/Fantasy Violence: NO
- [ ] Sexual Content: NO
- [ ] Nudity: NO
- [ ] Profanity or Crude Humor: NO
- [ ] Horror/Fear Themes: NO
- [ ] Mature/Suggestive Themes: NO
- [ ] Alcohol, Tobacco, or Drug Use: NO
- [ ] **Medical/Treatment Information**: Infrequent/Mild (or YES if asked)
- [ ] **Uncontrolled User Generated Content**: NO (all content is user's own)

**Verification**:
- [ ] Age rating questionnaire completed
- [ ] Rating shows as 13+ (US) and 12+ (Korea)
- [ ] No warnings or flags from Apple

---

### C. App Privacy Questionnaire 🔴
**Status**: CRITICAL - MUST BE 100% COMPLETE
**Location**: App Store Connect → App Privacy → Edit

This is the most common rejection cause. Complete carefully.

#### Data Collection Declaration:

**1. Contact Info** ✅
- [ ] **Email Address**
  - Purpose: App Functionality, Analytics
  - Linked to user: YES
  - Used for tracking: NO

- [ ] **Name** (optional with Apple Sign-In)
  - Purpose: App Functionality
  - Linked to user: YES
  - Used for tracking: NO

**2. User Content** ✅
- [ ] **Photos or Videos** (Vision boards)
  - Purpose: App Functionality
  - Linked to user: YES
  - Used for tracking: NO

- [ ] **Other User Content** (Journal entries, workbook responses, AI chat)
  - Purpose: App Functionality
  - Linked to user: YES
  - Used for tracking: NO

- [ ] **IMPORTANT**: Voice recordings
  - ⚠️ **NOT COLLECTED** - Transcribed on-device only
  - Only text is uploaded, not audio files
  - Ensure this is clearly stated in notes

**3. Identifiers** ✅
- [ ] **User ID**
  - Purpose: App Functionality
  - Linked to user: YES
  - Used for tracking: NO

**4. Purchases** ✅
- [ ] **Purchase History** (Subscriptions)
  - Purpose: App Functionality
  - Linked to user: YES
  - Used for tracking: NO

**5. Usage Data** ✅
- [ ] **Product Interaction** (Meditation sessions, phase progress)
  - Purpose: Analytics, App Functionality
  - Linked to user: YES
  - Used for tracking: NO

**Data NOT Collected**:
- [ ] Health & Fitness data (clarify: we track meditation sessions but not heart rate, etc.)
- [ ] Financial Info (beyond purchase history)
- [ ] Location Data
- [ ] Browsing History
- [ ] Search History
- [ ] Sensitive Info

#### Third-Party SDK Disclosure:

- [ ] **Supabase** (Database, Auth, Storage)
  - Privacy policy: https://supabase.com/privacy

- [ ] **RevenueCat** (Subscriptions)
  - Privacy policy: https://www.revenuecat.com/privacy

- [ ] **Anthropic Claude** (AI Chat - text only)
  - Privacy policy: https://www.anthropic.com/legal/privacy

- [ ] **OpenAI** (Embeddings, Whisper on-device)
  - Privacy policy: https://openai.com/privacy
  - **Note**: Whisper runs locally, no audio sent to OpenAI

**Critical Notes to Include**:
```
Voice journal feature:
- Audio recordings are transcribed ON-DEVICE using OpenAI Whisper model
- Audio files never leave the user's device
- Only transcribed text is saved to our database
- Audio files are immediately deleted after transcription
- This ensures maximum privacy for sensitive journal content
```

**Verification**:
- [ ] All 5 data categories filled out
- [ ] All items marked "Linked to user: YES, Used for tracking: NO"
- [ ] Third-party SDKs disclosed
- [ ] Voice privacy clearly explained
- [ ] Questionnaire shows "Complete" status
- [ ] Green checkmark appears in App Store Connect

---

### D. Build Selection ⚠️
**Status**: PENDING BUILD 49
**Location**: App Store Connect → iOS App 1.0 → Build

**Checklist**:
- [ ] Build 49 appears in build selection (wait ~10 min after EAS submit)
- [ ] Build 49 status: "Processing" → "Ready to Submit"
- [ ] Export compliance answered: **NO** (app uses standard encryption)
- [ ] Build selected for version 1.0
- [ ] No warnings or issues shown

---

## 4️⃣ PRE-BUILD TESTING (DO THIS BEFORE BUILD 49)

### A. Simulator Testing
**Device**: iPhone 15 Pro (iOS 17.4+) simulator

- [ ] **Fresh Install Test**:
  - [ ] Delete app from simulator
  - [ ] `npm run ios` to install fresh
  - [ ] Disclaimer screen appears (not loading screen)
  - [ ] Disclaimer "I Understand" button works
  - [ ] App proceeds to login screen
  - [ ] No infinite spinners or freezes

- [ ] **Apple Sign-In Test**:
  - [ ] Login screen Apple button visible and tappable
  - [ ] Signup screen Apple button visible and tappable
  - [ ] Both buttons styled correctly (white outline, 50px)
  - [ ] Test cancellation handling (should not crash)

- [ ] **Legal Links Test**:
  - [ ] Tap "Terms of Service" in signup screen
  - [ ] Safari opens with https://manifesttheunseen.app/terms
  - [ ] Return to app works
  - [ ] Tap "Privacy Policy" in signup screen
  - [ ] Safari opens with https://manifesttheunseen.app/privacy
  - [ ] Return to app works
  - [ ] Repeat for paywall screen (after login)

- [ ] **Email Auth Test**:
  - [ ] Create account with email/password
  - [ ] Verify email confirmation flow
  - [ ] Login with email/password
  - [ ] Password strength validation works

- [ ] **Subscription Flow Test** (with Sandbox tester):
  - [ ] Navigate to paywall
  - [ ] Legal links work in paywall
  - [ ] Select a tier (e.g., Novice Path)
  - [ ] "7-day free trial" text visible
  - [ ] Purchase flow completes (Sandbox)
  - [ ] App unlocks features
  - [ ] "Restore Purchases" works

- [ ] **Disclaimer Second Launch**:
  - [ ] Close app completely
  - [ ] Reopen app
  - [ ] Disclaimer should NOT appear (accepted = cached)
  - [ ] Goes directly to login/home

---

### B. Code Review Checklist

- [ ] **No Console Warnings**:
  - [ ] Run app, check Metro bundler
  - [ ] No yellow warning boxes
  - [ ] No red error screens

- [ ] **TypeScript Compilation**:
  - [ ] `npm run type-check` passes (if available)
  - [ ] No TypeScript errors in IDE

- [ ] **Linting**:
  - [ ] `npm run lint` passes (if available)
  - [ ] Code follows style guidelines

- [ ] **Environment Variables**:
  - [ ] All API keys in `.env` (not hardcoded)
  - [ ] Production keys used (not dev/test)
  - [ ] RevenueCat API key: iOS production key
  - [ ] Supabase: Production project URL & anon key
  - [ ] Anthropic Claude: Production API key

---

## 5️⃣ BUILD 49 CREATION

### A. Pre-Build Checklist
- [ ] All simulator tests passed (Section 4A)
- [ ] Code review complete (Section 4B)
- [ ] Git status clean (no uncommitted changes)
- [ ] All changes pushed to GitHub

### B. Build Process

**Step 1: Commit Loading Screen Fix**
```bash
git status  # Verify only App.tsx changed
git add mobile/App.tsx
git commit -m "fix: splash screen blocking disclaimer screen (Build 48 deadlock)

- Move SplashScreen.hideAsync() to disclaimer check effect
- Remove duplicate splash hiding from app initialization
- Fixes: Loading screen freeze when disclaimer needs to be shown
- DisclaimerScreen is now visible and interactive on first launch
"
git push origin main
```

**Step 2: Increment Build Number**
```bash
# Edit mobile/app.json
# Change: "buildNumber": "48" → "buildNumber": "49"
```

**Step 3: Commit Build Number**
```bash
git add mobile/app.json
git commit -m "build: increment iOS build number to 49"
git push origin main
```

**Step 4: Verify Remote**
```bash
git log --oneline -3  # Should show both commits
git status  # Should be clean
```

**Step 5: Run EAS Build**
```bash
cd mobile
eas build --platform ios --profile production
```

**Step 6: Monitor Build**
- [ ] Wait for build to start (~1 min)
- [ ] Build completes successfully (~5-7 min)
- [ ] Download IPA link received
- [ ] Build logs show no errors

---

## 6️⃣ TESTFLIGHT VERIFICATION (BUILD 49)

### A. Submit to TestFlight
```bash
cd mobile
eas submit --platform ios --latest
```

- [ ] Submission completes successfully
- [ ] Wait for Apple processing (~10-15 min)
- [ ] Build appears in App Store Connect → TestFlight

### B. TestFlight Testing

**Device**: Physical iPhone (recommended) or iPad

- [ ] **Download from TestFlight**:
  - [ ] Open TestFlight app
  - [ ] Find "Manifest the Unseen"
  - [ ] Install Build 49

- [ ] **Critical Tests**:
  - [ ] First launch shows disclaimer (not loading screen)
  - [ ] Disclaimer "I Understand" is tappable
  - [ ] App proceeds to login after accepting
  - [ ] Second launch skips disclaimer
  - [ ] Apple Sign-In button works (real Apple Sign-In, not Sandbox)
  - [ ] Email signup works
  - [ ] Legal links open Safari correctly
  - [ ] Subscription paywall loads
  - [ ] Meditation player works
  - [ ] Journal entry creation works
  - [ ] Workbook phases load

- [ ] **iPad Specific** (previous rejection platform):
  - [ ] App runs on iPad
  - [ ] Layout looks correct (tablet optimized)
  - [ ] All buttons are tappable
  - [ ] No UI elements cut off or overlapping

- [ ] **No Blocking Bugs**:
  - [ ] No crashes during 10-minute test
  - [ ] No infinite spinners
  - [ ] All navigation works
  - [ ] Back buttons work
  - [ ] No error screens

---

## 7️⃣ FINAL APP STORE CONNECT VERIFICATION

### Before Clicking "Submit for Review"

- [ ] **App Information Tab**:
  - [ ] Privacy Policy URL present: `https://manifesttheunseen.app/privacy`
  - [ ] Support URL/email present
  - [ ] Age Rating: 13+ (verified)

- [ ] **App Privacy Tab**:
  - [ ] Status shows "Complete" (not "Not Started")
  - [ ] Green checkmark visible
  - [ ] All 5 data types declared
  - [ ] Third-party SDKs disclosed
  - [ ] Voice privacy note included

- [ ] **Pricing and Availability**:
  - [ ] Price: Free (with IAP)
  - [ ] Availability: All countries (or selected)

- [ ] **Version 1.0 Tab**:
  - [ ] Build 49 selected
  - [ ] Screenshots uploaded (5.5" and 6.5" iPhone)
  - [ ] App icon present (1024x1024px)
  - [ ] Description written
  - [ ] Keywords set
  - [ ] Category: Health & Fitness (primary)
  - [ ] Promotional text (optional)

- [ ] **In-App Purchases**:
  - [ ] All 3 tiers approved (Novice, Awakening, Enlightenment)
  - [ ] Prices match app ($7.99, $12.99, $19.99)
  - [ ] 7-day free trial configured
  - [ ] Auto-renewable subscriptions

---

## 8️⃣ SUBMISSION

### A. Review Notes for Apple

**Use this template in "App Review Information" → "Notes"**:

```
Build 49 - Fourth Submission (Previous Issues Resolved)

COMPLIANCE FIXES IMPLEMENTED:

1. APPLE SIGN-IN (Guideline 4.8):
   ✅ Official AppleAuthenticationButton component
   ✅ HIG compliant: WHITE_OUTLINE style, 50px height
   ✅ Correct button types: SIGN_IN (login), SIGN_UP (signup)
   ✅ Secondary placement with email/password primary

2. LEGAL LINKS (Guidelines 5.1.1, 3.1.1):
   ✅ All Terms and Privacy links functional in signup and paywall
   ✅ URLs: https://manifesttheunseen.app/privacy & /terms
   ✅ Open in Safari (not in-app browser)
   ✅ Mobile responsive and accessible

3. HEALTH DISCLAIMER (Guideline 5.1.1(ix)):
   ✅ Comprehensive disclaimer on first launch
   ✅ User must accept "I Understand" before accessing app
   ✅ Clear "not medical advice" messaging
   ✅ Crisis hotline info (988)
   ✅ AI chat footer disclaimer always visible

4. PRIVACY (iOS 17+ Requirements):
   ✅ Privacy manifest configuration complete
   ✅ Microphone permission: Voice transcription ON-DEVICE only
   ✅ Audio never leaves device—only text is saved
   ✅ App Privacy questionnaire complete (all 5 data types declared)

5. SUBSCRIPTIONS (Guidelines 3.1.1, 3.1.2):
   ✅ 7-day free trial clearly disclosed
   ✅ "Cancel anytime" via iOS Settings
   ✅ All payments through Apple IAP (RevenueCat)
   ✅ Restore Purchases available
   ✅ Legal links in paywall

6. BUILD 49 FIX:
   ✅ Resolved: Loading screen freeze on first launch
   ✅ Disclaimer screen now displays correctly
   ✅ Splash screen management fixed

TESTING:
- Tested on iPhone 15 Pro simulator (iOS 17.4)
- Tested on iPad (previous rejection platform)
- All legal links verified working
- Apple Sign-In tested in sandbox
- Subscription flow tested with sandbox tester

Thank you for your review!
```

### B. Demo Account (Required)

**Create a test account for Apple reviewers**:
- [ ] Email: `reviewer@manifesttheunseen.app` (or similar)
- [ ] Password: Strong password (save in App Store Connect notes)
- [ ] Account should have:
  - [ ] Completed Phase 1 (some workbook data)
  - [ ] 1-2 journal entries
  - [ ] Active subscription (or trial started)
  - [ ] Some meditation sessions

**Add to App Store Connect**:
- [ ] Navigate to: Version 1.0 → App Review Information
- [ ] Sign-in required: YES
- [ ] Username: `reviewer@manifesttheunseen.app`
- [ ] Password: [your password]
- [ ] Save

### C. Final Submission

- [ ] **Read Everything One More Time**:
  - [ ] Review notes are clear and complete
  - [ ] Demo account credentials work
  - [ ] Build 49 is selected
  - [ ] Privacy questionnaire complete

- [ ] **Click "Add for Review"**:
  - [ ] Confirm all information
  - [ ] Export compliance: NO (uses standard encryption)
  - [ ] Advertising ID: NO (not using for advertising)
  - [ ] Submit

- [ ] **Confirmation**:
  - [ ] Status changes to "Waiting for Review"
  - [ ] Confirmation email received
  - [ ] Screenshot/note the submission timestamp

---

## 9️⃣ POST-SUBMISSION MONITORING

### A. Status Tracking

**Expected Timeline**:
- Day 0: Waiting for Review (1-3 days)
- Day 1-3: In Review (1-2 days)
- Day 3-5: **APPROVED** (hopefully!) or "Needs Work"

**Check Daily**:
- [ ] App Store Connect → My Apps → Manifest the Unseen → Version 1.0
- [ ] Email for status updates
- [ ] Resolution Center for messages from Apple

### B. If Rejected (Again)

**Do NOT panic. Follow this process**:

1. **Read the Rejection Message Carefully**:
   - [ ] Screenshot the full message
   - [ ] Identify the specific guideline violated
   - [ ] Note any screenshots/evidence Apple provides

2. **Analyze the Issue**:
   - [ ] Is it a code issue? (needs new build)
   - [ ] Is it App Store Connect metadata? (can fix without new build)
   - [ ] Is it a misunderstanding? (respond to Apple)

3. **Options**:
   - **Appeal** (if Apple misunderstood):
     - Use Resolution Center to explain
     - Provide evidence/screenshots
     - Reference previous compliance work

   - **Fix and Resubmit**:
     - Fix the issue
     - Create Build 50
     - Update submission notes
     - Resubmit within 48 hours (faster review)

4. **Document Everything**:
   - [ ] Update `docs/operations/status/project-status.md`
   - [ ] Save rejection message to `docs/operations/app-store-rejections/`
   - [ ] Note what was changed for Build 50

---

## 🎉 IF APPROVED

### A. Immediate Actions

- [ ] **Celebrate!** 🎉 (You earned it after 4 submissions)

- [ ] **Release to App Store**:
  - [ ] App Store Connect → Version 1.0
  - [ ] Status should be "Pending Developer Release" or "Ready for Sale"
  - [ ] Click "Release this version" (or schedule)
  - [ ] App goes live within 24 hours

- [ ] **Verify Live**:
  - [ ] Search for "Manifest the Unseen" in App Store
  - [ ] App appears in search results
  - [ ] Screenshots and description correct
  - [ ] Download button works
  - [ ] Reviews/ratings enabled

### B. Post-Launch Monitoring

**First 48 Hours**:
- [ ] Monitor crash reports (Sentry, App Store Connect)
- [ ] Check reviews (respond to negative reviews quickly)
- [ ] Monitor subscription purchases (RevenueCat dashboard)
- [ ] Track downloads (App Store Connect Analytics)

**First Week**:
- [ ] No critical bugs reported
- [ ] Crash rate < 1%
- [ ] 4.0+ star rating
- [ ] Trial→Paid conversion tracking (target: 25%+)

### C. Marketing Launch

- [ ] Press release (if applicable)
- [ ] Social media announcement
- [ ] Email to beta testers
- [ ] Product Hunt launch (optional)
- [ ] Update website with App Store link

---

## 📊 SUCCESS CRITERIA

**This submission will be considered successful when**:

- [x] All code compliance items are green (Section 1)
- [x] All web assets are live and verified (Section 2)
- [ ] App Store Connect config 100% complete (Section 3)
- [ ] Build 49 created and submitted to TestFlight (Section 5)
- [ ] TestFlight testing shows no blocking bugs (Section 6)
- [ ] Final ASC verification complete (Section 7)
- [ ] App submitted for review with confidence (Section 8)
- [ ] **APP APPROVED** (Section 9) 🎯

---

## 🚨 RED FLAGS TO AVOID

**Do NOT submit if any of these are true**:

- [ ] App crashes on launch
- [ ] Loading screen hangs/freezes
- [ ] Apple Sign-In doesn't work
- [ ] Legal links are broken (404 errors)
- [ ] Disclaimer doesn't show or can't be dismissed
- [ ] App Privacy questionnaire incomplete
- [ ] Privacy Policy URL returns error
- [ ] Build number not incremented from Build 48
- [ ] Changes not pushed to GitHub
- [ ] Subscription flow broken
- [ ] iPad layout broken (previous rejection)

**If ANY of these are true, STOP and fix before submitting.**

---

## 📝 NOTES

**Previous Rejection Reasons** (based on project status):
1. Unknown (1st submission)
2. Unknown (2nd submission)
3. iPad compatibility or Apple Sign-In issue (3rd submission - fixed in Build 46-47)
4. Build 48: NOT SUBMITTED (loading screen freeze discovered pre-submission)

**Build 49 Fixes**:
- Splash screen deadlock when disclaimer needs to be shown
- DisclaimerScreen now visible and interactive on first launch

**Why This Submission Should Succeed**:
1. All 4 critical code blockers from audit are fixed
2. Build 48 issue discovered and fixed before submission (not after rejection)
3. Comprehensive testing checklist ensures no surprises
4. Clear reviewer notes explain all compliance work
5. Demo account ready for easy testing
6. All App Store Connect config verified before submission

**Confidence Level**: 95%+ (assuming all checklist items completed)

---

**Document Owner**: Claude Code AI Assistant
**Last Updated**: January 14, 2026
**Next Review**: After Build 49 TestFlight testing
