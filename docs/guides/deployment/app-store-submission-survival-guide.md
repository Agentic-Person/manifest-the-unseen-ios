# App Store Submission Survival Guide
**For iOS App Developers: Avoid Common Pitfalls & Rejections**

**Created**: January 15, 2026
**Based on**: Real-world experience with Manifest the Unseen (Build 51)
**Purpose**: Reusable checklist for ANY iOS app submission
**Status**: Battle-tested ✅

---

## Table of Contents

1. [Overview: Why Apps Get Rejected](#overview-why-apps-get-rejected)
2. [Pre-Submission Checklist](#pre-submission-checklist)
3. [Privacy Questionnaire Deep Dive](#privacy-questionnaire-deep-dive)
4. [Common Gotchas & How to Avoid Them](#common-gotchas--how-to-avoid-them)
5. [Privacy Policy Requirements](#privacy-policy-requirements)
6. [SDK Privacy Manifests (2024+ Requirement)](#sdk-privacy-manifests-2024-requirement)
7. [Apple Guidelines Compliance](#apple-guidelines-compliance)
8. [Testing Before Submission](#testing-before-submission)
9. [Handling Rejections](#handling-rejections)
10. [Timeline & Expectations](#timeline--expectations)

---

## Overview: Why Apps Get Rejected

### Top 5 Rejection Reasons (in order)

1. **Privacy Questionnaire Incomplete/Incorrect** (30-40% of rejections)
   - Device ID missing when using RevenueCat, Firebase, etc.
   - Health data misclassified
   - Audio/video collection misdeclared
   - Privacy policy URL missing or broken

2. **Guideline 4.8 - Sign in with Apple** (15-20%)
   - Apple Sign-In button style violations
   - Missing Apple Sign-In when other OAuth present
   - Placement issues (must be equally prominent)

3. **Guideline 5.1.1 - Legal Requirements** (10-15%)
   - Missing Terms of Service links
   - Missing Privacy Policy links
   - Broken legal links (404 errors)
   - Health/wellness disclaimers missing

4. **Guideline 3.1.1/3.1.2 - In-App Purchases** (10%)
   - Subscription terms unclear
   - Missing "Cancel anytime" disclosure
   - Free trial not clearly stated
   - Alternative payment methods mentioned

5. **Guideline 2.1 - App Completeness** (5-10%)
   - App crashes on launch
   - Features don't work as described
   - Placeholder content visible
   - Loading screens that never finish

---

## Pre-Submission Checklist

### 1. Code Compliance ✅

Use this checklist BEFORE creating your production build:

#### Apple Sign-In (if using OAuth)
- [ ] Using official `AppleAuthentication.AppleAuthenticationButton` component
- [ ] Button type correct: `SIGN_IN` (login) or `SIGN_UP` (signup)
- [ ] Button style: `WHITE` or `WHITE_OUTLINE` or `BLACK` (HIG compliant)
- [ ] Height: 44-50px minimum (per Apple HIG)
- [ ] Corner radius: 4-12px (rounded, not square)
- [ ] Placement: Equal or more prominent than other OAuth options
- [ ] Cancellation handled gracefully (no crashes)

#### Legal Links (Terms & Privacy)
- [ ] Terms link present on signup screen
- [ ] Privacy link present on signup screen
- [ ] Both links present on paywall/subscription screen
- [ ] Links use `Linking.openURL()` (opens Safari, not in-app browser)
- [ ] URLs load correctly (test them!)
- [ ] Mobile-responsive design
- [ ] SSL certificates valid (https://)

#### Health/Wellness Disclaimers (if applicable)
- [ ] Disclaimer shown on first app launch
- [ ] User must accept "I Understand" before proceeding
- [ ] Clear "not medical advice" language
- [ ] Mental health crisis information (988, 911 where applicable)
- [ ] Professional consultation recommendation
- [ ] Cannot be dismissed without accepting

#### Permissions & Privacy Manifests
- [ ] `app.json` has all required usage descriptions (NSMicrophoneUsageDescription, etc.)
- [ ] Usage descriptions are clear and specific (not generic)
- [ ] Privacy manifest enabled: `privacyManifestAggregationEnabled: true` (iOS 17+)
- [ ] All accessed APIs declared (NSUserDefaults, etc.)

#### Subscriptions (if using IAP)
- [ ] All payments go through Apple IAP (no alternative payment methods)
- [ ] "7-day free trial" clearly displayed (if applicable)
- [ ] "Cancel anytime" text present
- [ ] Price shown after trial period
- [ ] Auto-renewal disclosure present
- [ ] "Restore Purchases" button available
- [ ] Link to iOS Settings for cancellation

---

### 2. Web Assets Compliance ✅

#### Privacy Policy URL
- [ ] URL exists and loads: `https://yourapp.com/privacy`
- [ ] SSL certificate valid
- [ ] Mobile responsive design
- [ ] Content is comprehensive (see Privacy Policy Requirements section)
- [ ] Last updated date present
- [ ] Includes data collection disclosure
- [ ] Includes third-party services list
- [ ] GDPR/CCPA compliant (if applicable)

#### Terms of Service URL
- [ ] URL exists and loads: `https://yourapp.com/terms`
- [ ] SSL certificate valid
- [ ] Mobile responsive design
- [ ] Includes subscription terms (if IAP)
- [ ] Includes disclaimer of warranties
- [ ] Includes user responsibilities

---

### 3. App Store Connect Configuration ✅

#### App Information
- [ ] Privacy Policy URL added
- [ ] Support URL or email added
- [ ] Age rating completed (13+ recommended for health/wellness)
- [ ] Copyright information correct

#### Privacy Questionnaire
- [ ] **STATUS MUST BE "COMPLETE"** (green checkmark)
- [ ] All data types declared (see detailed section below)
- [ ] Third-party SDKs disclosed with privacy policy links
- [ ] Device ID included (if using analytics, subscriptions, crash reporting)
- [ ] All items: "Linked to user: Yes, Used for tracking: No" (unless you actually track)
- [ ] Additional information added for audio/video features

#### Build Selection
- [ ] Build appears in App Store Connect (wait ~10 min after EAS submit)
- [ ] Build status: "Ready to Submit" (not "Processing")
- [ ] Export compliance answered: **NO** (if using standard encryption only)
- [ ] No warnings or issues shown

---

## Privacy Questionnaire Deep Dive

### The #1 Cause of Rejection

**Why it matters**: This questionnaire generates your App Store "nutrition label" - the privacy summary users see before downloading.

**Common mistake**: Answering based on what you *think* you collect, not what your SDKs *actually* collect.

---

### Step-by-Step: How to Fill It Out

#### Question 1: Does your app collect data?

**Answer**: ✅ YES (unless you have a completely offline app with zero data storage)

---

### Data Types Breakdown

#### 1. Contact Info

**When to select**:
- You collect email, name, phone, or physical address

**Common scenario**:
```
Email Address:
  ✅ Collected: YES
  Purpose: App Functionality (for account, notifications)
  Linked to user: YES
  Used for tracking: NO

Name:
  ✅ Collected: YES (if optional with Apple Sign-In, still YES)
  Purpose: App Functionality (for personalization)
  Linked to user: YES
  Used for tracking: NO
```

**Pitfall**: Do NOT select "Analytics" purpose unless you're actually sending email to an analytics platform like Mixpanel.

---

#### 2. Health & Fitness

**⚠️ CRITICAL DECISION POINT**

**Apple's Definition**: Health, fitness, and medical data, including from HealthKit API, MovementDisorder APIs, or health-related research.

**When to select YES**:
- You use HealthKit
- You collect heart rate, blood pressure, sleep data
- You track calories burned, steps, workouts

**When to select NO**:
- You track meditation sessions (this is "Usage Data", not health data)
- You track yoga/breathing exercises (this is "Usage Data")
- You provide health advice but don't collect metrics

**Example (Meditation App)**:
```
Meditation session tracking:
  → Categorize as "Usage Data - Product Interaction"
  → NOT "Health & Fitness"
  → Rationale: You're tracking app usage, not health metrics
```

---

#### 3. Financial Info

**When to select YES**:
- You collect credit card numbers
- You collect bank account info
- You handle payment processing yourself

**When to select NO**:
- You use Apple In-App Purchases (IAP)
- You use RevenueCat + Apple IAP
- Apple handles all payment info

**Note**: Subscription status goes under "Purchases", not "Financial Info"

---

#### 4. Location

**When to select YES**:
- You use `CoreLocation` API
- You track precise location
- You track coarse location (city-level)

**When to select NO**:
- You don't request location permissions at all

**Pitfall**: Some analytics SDKs collect IP-based location. Check your SDK privacy manifests.

---

#### 5. Sensitive Info

**Apple's categories**: Racial/ethnic data, sexual orientation, pregnancy, disability, religious beliefs, union membership, political affiliation, genetic info, biometric data.

**When to select YES**:
- You explicitly ask for these in user profiles
- You use Face ID/Touch ID for authentication (biometric data)

**When to select NO**:
- You don't collect any of the above

**Pitfall**: Face ID/Touch ID *usage* is NOT sensitive info. Only if you store biometric templates.

---

#### 6. Contacts

**When to select YES**:
- You import user's contact list
- You access phone contacts via API

**When to select NO**:
- You don't request contacts permission

---

#### 7. User Content

**⚠️ COMMON PITFALL AREA**

##### Photos or Videos

**When to select YES**:
- Users upload photos (profile pics, vision boards, etc.)
- Users record videos in-app

**Example**:
```
Photos:
  ✅ Collected: YES
  Purpose: App Functionality (vision boards)
  Linked to user: YES
  Used for tracking: NO
```

##### Audio Data

**⚠️ CRITICAL: On-Device Processing Exception**

**When to select YES**:
- Audio files are uploaded to your servers
- Audio is sent to cloud transcription services

**When to select NO**:
- Audio is transcribed ON-DEVICE (e.g., using Whisper.cpp)
- Audio files are immediately deleted after transcription
- Only text is saved, not audio

**How to explain (in Additional Information field)**:
```
VOICE RECORDING PRIVACY:

Our app includes voice recording. However:

1. Audio is transcribed ON-DEVICE using [Whisper/other model]
2. Audio files NEVER leave the user's device
3. Only transcribed TEXT is saved to our database
4. Audio files are immediately deleted after transcription
5. No audio data is uploaded to any server

This on-device approach ensures maximum privacy.
```

##### Other User Content

**When to select YES**:
- Journal entries (text)
- User-generated notes
- Chat messages
- Workbook responses
- Any text content created by users

**Example**:
```
Other User Content:
  ✅ Collected: YES
  Purpose: App Functionality (journal, workbook)
  Linked to user: YES
  Used for tracking: NO

  Includes: Journal entries, workbook responses,
  AI chat messages, vision board captions
```

---

#### 8. Browsing History

**When to select YES**:
- You track URLs visited in an in-app browser
- You log web searches performed in your app

**When to select NO**:
- Users can't browse the web in your app
- You have webviews but don't track what they view

---

#### 9. Search History

**When to select YES**:
- You save/log what users search for within your app

**When to select NO**:
- You have a search feature but don't save queries
- Search is ephemeral (not stored)

---

#### 10. Identifiers

**⚠️ MOST COMMONLY MISSED**

##### User ID

**When to select YES**:
- You create unique user IDs (Supabase UUID, Firebase UID, etc.)
- You link data to user accounts

**Example**:
```
User ID:
  ✅ Collected: YES
  Purpose: App Functionality (link user data)
  Linked to user: YES
  Used for tracking: NO
```

##### Device ID

**⚠️ CRITICAL - Often Missed**

**When to select YES**:
- You use RevenueCat (uses device ID for fraud prevention)
- You use Firebase Analytics
- You use Sentry crash reporting (may use device ID)
- You use TelemetryDeck (privacy-focused, but still uses device ID)
- You use Mixpanel, Amplitude, etc.

**When to select NO**:
- You don't use any third-party SDKs for analytics, subscriptions, or crash reporting

**How to know**: Check your SDK documentation for "privacy manifest" or "device ID usage"

**Example**:
```
Device ID:
  ✅ Collected: YES
  Purpose: App Functionality (subscription fraud prevention via RevenueCat)
  Linked to user: YES
  Used for tracking: NO
```

**Pitfall**: Don't say "NO" just because *you* don't directly access device ID. If your SDKs do, answer YES.

##### Advertising Identifier (IDFA)

**When to select YES**:
- You show ads (AdMob, Facebook Ads, etc.)
- You track users for advertising purposes

**When to select NO**:
- You don't show ads
- You don't use attribution SDKs for paid marketing

---

#### 11. Purchases

**When to select YES**:
- You have in-app purchases (even free trials)
- You track subscription tiers

**Example**:
```
Purchase History:
  ✅ Collected: YES
  Purpose: App Functionality (subscription management)
            Analytics (conversion tracking)
  Linked to user: YES
  Used for tracking: NO
```

---

#### 12. Usage Data

##### Product Interaction

**When to select YES**:
- You track which features users engage with
- You track screen views
- You track button clicks
- You track session duration

**Example**:
```
Product Interaction:
  ✅ Collected: YES
  Purpose: App Functionality (progress tracking)
            Analytics (improve app)
  Linked to user: YES
  Used for tracking: NO

  Includes: Meditation sessions, workbook completion,
  journal count, AI chat usage
```

---

#### 13. Diagnostics

**When to select YES**:
- You use Sentry, Crashlytics, or similar
- You collect crash reports
- You track app performance metrics

**When to select NO**:
- You don't have crash reporting implemented
- You only use Apple's automatic crash reporting

**Example (if using Sentry)**:
```
Crash Data:
  ✅ Collected: YES
  Purpose: App Functionality (bug fixes)
  Linked to user: NO (anonymized)
  Used for tracking: NO

Performance Data:
  ✅ Collected: YES
  Purpose: App Functionality (performance optimization)
  Linked to user: NO (anonymized)
  Used for tracking: NO
```

**Pitfall**: Answer "NO" if your SDK is installed but NOT configured/enabled. Only answer YES for what you *actually* collect.

---

#### 14. Other Data Types

**When to select YES**:
- You collect data not covered above

**When to select NO**:
- All your data fits in the above categories

---

### Third-Party SDK Disclosure

**Apple requires transparency**. List all SDKs that collect data:

**Template**:
```
THIRD-PARTY SERVICES:

We use the following third-party services:

1. [Service Name] ([Purpose])
   - Privacy Policy: [URL]
   - Data Collected: [Brief description]

Example:

1. Supabase (Backend database, authentication, storage)
   - Privacy Policy: https://supabase.com/privacy
   - Data Collected: All user content, authentication tokens

2. RevenueCat (Subscription management via Apple IAP)
   - Privacy Policy: https://www.revenuecat.com/privacy
   - Data Collected: Device ID, subscription status

3. Anthropic Claude (AI chat)
   - Privacy Policy: https://www.anthropic.com/legal/privacy
   - Data Collected: Chat messages (text only)

4. OpenAI (Embeddings for semantic search)
   - Privacy Policy: https://openai.com/privacy
   - Data Collected: Search queries (text only)
   - Note: Whisper runs ON-DEVICE (no audio sent to OpenAI)
```

---

### Additional Information Field

**Use this for clarifications**:

**Example (Voice Recording App)**:
```
VOICE RECORDING PRIVACY:

Our app includes voice recording. However:
- Audio is transcribed ON-DEVICE using [model name]
- Audio files NEVER leave the user's device
- Only transcribed TEXT is saved to our database
- Audio files are immediately deleted after transcription
- No voice data is uploaded to any server

This on-device approach ensures maximum privacy for
sensitive user content.
```

---

## Common Gotchas & How to Avoid Them

### Gotcha #1: "But I Don't Collect That!"

**Scenario**: You answer "NO" to Device ID, but you use RevenueCat for subscriptions.

**Reality**: RevenueCat DOES collect device ID for fraud prevention.

**Fix**: Check every SDK's privacy manifest or documentation. Answer based on what your *SDKs* collect, not just your own code.

**How to check**:
1. Open SDK documentation
2. Search for "privacy manifest" or "data collection"
3. Look for official privacy policy
4. Example: https://www.revenuecat.com/privacy

---

### Gotcha #2: TelemetryDeck/Sentry in Documentation But Not Implemented

**Scenario**: Your docs mention Sentry, but the SDK isn't actually installed or configured.

**Reality**: If you answer "YES" to diagnostics, Apple may ask for proof.

**Fix**:
1. Check `package.json` - is the SDK installed?
2. Check your code - is it initialized?
3. Check `.env` or config - is it enabled?
4. Only answer "YES" if actively collecting data

---

### Gotcha #3: Privacy Policy Doesn't Match Questionnaire

**Scenario**: You say "NO" to TelemetryDeck in questionnaire, but privacy policy says you use it.

**Reality**: Apple may notice the inconsistency and reject.

**Fix**: Ensure your privacy policy matches what you ACTUALLY collect. Keep them in sync.

---

### Gotcha #4: "Analytics" Purpose for Email

**Scenario**: You select "Analytics" as a purpose for email collection because you track conversion rates.

**Reality**: "Analytics" means you're sending email addresses to an analytics platform (Mixpanel, Amplitude).

**Fix**: Only select "Analytics" if you're literally passing email to an analytics service. Tracking conversions in your own database is "App Functionality".

---

### Gotcha #5: Health Data Confusion

**Scenario**: Your meditation app tracks session duration, and you categorize it as "Health & Fitness".

**Reality**: Unless you're using HealthKit or collecting vitals (heart rate, etc.), it's "Usage Data".

**Fix**:
- **Health & Fitness**: HealthKit, heart rate, sleep tracking, calories
- **Usage Data**: Session duration, app engagement, feature usage

---

## Privacy Policy Requirements

### What Must Be Included

1. **Introduction**
   - Who you are ("We," "Our," "Us")
   - Commitment to privacy
   - Agreement clause

2. **Information We Collect**
   - All data types from questionnaire
   - Be specific (not vague)

3. **How We Use Your Information**
   - Clear purpose for each data type
   - No surprises

4. **Data Security**
   - Encryption methods
   - On-device processing (if applicable)
   - Secure authentication
   - Row-Level Security (if using Supabase)

5. **Third-Party Services**
   - List all SDKs with privacy policy links
   - What data each service accesses

6. **Data Retention**
   - How long you keep data
   - What happens when account deleted

7. **Your Rights**
   - Access, correction, deletion, portability
   - How to exercise these rights

8. **Children's Privacy**
   - Statement about COPPA (if 13+ app)

9. **International Data Transfers**
   - Where data is processed
   - GDPR compliance (if applicable)

10. **California Privacy Rights (CCPA)**
    - Required if you serve California users

11. **Changes to This Policy**
    - How users will be notified

12. **Contact Us**
    - Email for privacy questions
    - Physical address (optional but recommended)

---

### Privacy Policy Template

See `docs/guides/deployment/privacy-policy-template.md` (create if needed)

---

## SDK Privacy Manifests (2024+ Requirement)

### What Are Privacy Manifests?

**Apple's new requirement** (enforced 2024-2025):
- Third-party SDKs must declare data usage in a `PrivacyInfo.xcprivacy` file
- Signed to prevent tampering
- Required for apps submitted to App Store

### Which SDKs Need Manifests?

**Required**:
- RevenueCat (7.0+)
- Firebase (10.0+)
- Sentry (@sentry/react-native 5.0+)
- Amplitude, Mixpanel, etc.

**How to check if your SDK has a manifest**:

1. Check SDK version in `package.json`
2. Look for "privacy manifest" in release notes
3. Check SDK documentation: https://[sdk].com/docs/privacy-manifest

**Example (RevenueCat)**:
```json
"react-native-purchases": "^7.0.0" // ✅ Has manifest
"react-native-purchases": "^6.9.0" // ❌ No manifest (upgrade needed)
```

### How to Verify Manifests Are Included

```bash
# After build, check build logs
eas build --profile production --platform ios

# Look for:
# "PrivacyInfo.xcprivacy found for [SDK name]"
```

---

## Apple Guidelines Compliance

### Guideline 4.8 - Sign in with Apple

**When required**:
- Your app offers email/password signup
- Your app offers social login (Google, Facebook)
- Your app requires an account

**Requirements**:
1. Use official `AppleAuthentication.AppleAuthenticationButton` component
2. Button type: `SIGN_IN` or `SIGN_UP` (not both on same screen)
3. Button style: `WHITE`, `WHITE_OUTLINE`, or `BLACK` (per HIG)
4. Height: 44-50px minimum
5. Corner radius: 4-12px (rounded)
6. Placement: Equal or more prominent than other options
7. Must work (not fake/disabled)

**Example (React Native + Expo)**:
```tsx
import * as AppleAuthentication from 'expo-apple-authentication';

<AppleAuthentication.AppleAuthenticationButton
  buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
  buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE}
  cornerRadius={12}
  style={{ width: '100%', height: 50 }}
  onPress={async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      // Handle credential
    } catch (e) {
      if (e.code === 'ERR_CANCELED') {
        // User cancelled, handle gracefully
      }
    }
  }}
/>
```

---

### Guideline 5.1.1 - Legal Requirements

**Requirements**:
1. Privacy Policy URL must be provided
2. Terms of Service should be provided
3. Links must be accessible from signup screen
4. Links must be accessible from subscription/paywall screen
5. Links must open (not 404)
6. Links should open in Safari (not in-app browser)

**Where to place links**:
- Signup screen: Below form, before submit
- Login screen: Optional but recommended
- Paywall screen: Below subscription tiers, before purchase

**Implementation**:
```tsx
import { Linking, Pressable, Text } from 'react-native';

<Pressable onPress={() => Linking.openURL('https://yourapp.com/privacy')}>
  <Text className="text-blue-500 underline">Privacy Policy</Text>
</Pressable>

<Pressable onPress={() => Linking.openURL('https://yourapp.com/terms')}>
  <Text className="text-blue-500 underline">Terms of Service</Text>
</Pressable>
```

**Health/Wellness Disclaimer** (if applicable):
- Show on first launch
- User must accept before using app
- Clear "not medical advice" language
- Crisis hotline info (988, 911)
- Professional consultation recommendation

---

### Guideline 3.1.1/3.1.2 - In-App Purchases

**Requirements**:
1. All payments through Apple IAP (no PayPal, Stripe, etc.)
2. Free trial clearly disclosed ("7-day free trial")
3. "Cancel anytime" text visible
4. Price shown after trial period
5. Auto-renewal disclosure present
6. "Restore Purchases" button available
7. Subscription management link (to iOS Settings)

**Example (Subscription Screen)**:
```tsx
<View>
  <Text className="text-2xl font-bold">Novice Path</Text>
  <Text className="text-lg">$7.99/month after 7-day free trial</Text>
  <Text className="text-sm text-gray-500">
    Cancel anytime in iOS Settings. Renews automatically.
  </Text>

  <Button onPress={purchaseSubscription}>Start Free Trial</Button>

  <Pressable onPress={restorePurchases}>
    <Text className="text-blue-500">Restore Purchases</Text>
  </Pressable>

  <Pressable onPress={() => Linking.openURL('https://yourapp.com/terms')}>
    <Text className="text-gray-500 text-xs">Terms</Text>
  </Pressable>

  <Pressable onPress={() => Linking.openURL('https://yourapp.com/privacy')}>
    <Text className="text-gray-500 text-xs">Privacy</Text>
  </Pressable>
</View>
```

---

## Testing Before Submission

### 1. Simulator Testing

**Minimum tests**:
- [ ] App launches successfully (no crashes)
- [ ] Disclaimer shows on first launch (if applicable)
- [ ] Signup flow works (email + Apple Sign-In)
- [ ] Login flow works
- [ ] Legal links open Safari and load
- [ ] Subscription screen displays correctly
- [ ] All navigation works
- [ ] No infinite loading screens

**Devices to test**:
- iPhone 15 Pro (latest)
- iPhone SE (smallest screen)
- iPad (if supporting tablets)

---

### 2. TestFlight Testing

**Critical tests on physical device**:
- [ ] First-launch experience
- [ ] Apple Sign-In (real, not sandbox)
- [ ] Subscription purchase (use sandbox tester)
- [ ] Restore purchases works
- [ ] Camera/mic permissions (if applicable)
- [ ] Background audio (if applicable)
- [ ] Face ID/Touch ID (if applicable)
- [ ] No crashes during 10-minute test

**Invite internal testers**:
- Your team
- Friends/family
- Collect feedback before public release

---

### 3. Legal Link Testing

**Must work on mobile**:
- [ ] Open https://yourapp.com/privacy on iPhone Safari
- [ ] Open https://yourapp.com/terms on iPhone Safari
- [ ] Both should be mobile-responsive
- [ ] Both should load quickly
- [ ] SSL certificates valid (green padlock)

---

### 4. Privacy Questionnaire Verification

**In App Store Connect**:
- [ ] Status shows "Complete" (green checkmark)
- [ ] Summary matches what you expect
- [ ] Product page preview looks correct
- [ ] "Nutrition label" displays all data types
- [ ] No accidental "Used for tracking: YES"

---

## Handling Rejections

### When Your App Is Rejected

**Don't panic**. Follow this process:

#### Step 1: Read the Rejection Message Carefully

- [ ] Screenshot the full message
- [ ] Identify the specific guideline violated (e.g., "Guideline 4.8")
- [ ] Note any screenshots or evidence Apple provides
- [ ] Check Resolution Center for additional details

#### Step 2: Understand the Issue

**Ask yourself**:
- Is it a code issue? (needs new build)
- Is it App Store Connect metadata? (can fix without new build)
- Is it a misunderstanding? (can respond to Apple)

**Common code issues** (need new build):
- App crashes
- Apple Sign-In button violations
- Missing legal links
- Features don't work

**Common metadata issues** (no new build needed):
- Privacy questionnaire incomplete
- Screenshots misleading
- Description unclear
- Privacy policy URL wrong

#### Step 3: Fix the Issue

**For code issues**:
```bash
# 1. Fix the code
# 2. Test thoroughly
npm run ios

# 3. Commit changes
git add .
git commit -m "fix: resolve [guideline X.X] - [description]"
git push

# 4. Increment build number
# Edit app.json: "buildNumber": "52" (was 51)

# 5. Commit build number
git commit -am "build: increment to 52"
git push

# 6. Create new build
cd mobile
eas build --profile production --platform ios --auto-submit

# 7. Wait for build (~5-7 min)
# 8. Submit to App Review again
```

**For metadata issues**:
1. Log into App Store Connect
2. Fix the issue (privacy questionnaire, screenshots, etc.)
3. Resubmit for review (same build)

#### Step 4: Respond to Apple (if needed)

**When to appeal**:
- Apple misunderstood your app
- You can provide evidence you're compliant
- The rejection seems incorrect

**How to appeal**:
1. Go to Resolution Center in App Store Connect
2. Click "Appeal" or "Add comments"
3. Provide clear explanation with screenshots
4. Reference Apple's guidelines
5. Be polite and professional

**Example response**:
```
Thank you for your feedback regarding Guideline 4.8 (Sign in with Apple).

We believe there may have been a misunderstanding. Our app DOES
implement Sign in with Apple using the official
AppleAuthenticationButton component.

Please see the attached screenshot showing the Apple Sign-In button
on our signup screen (line 248 of LoginScreen.tsx). The button:
- Uses buttonType: SIGN_IN
- Uses buttonStyle: WHITE_OUTLINE
- Has height: 50px (per HIG)
- Is placed equally prominently with email/password option

We are fully compliant with Guideline 4.8. Please let us know if
you need additional information or screenshots.

Thank you for your time!
```

#### Step 5: Document Everything

- [ ] Save rejection message to `docs/operations/app-store-rejections/`
- [ ] Update project status with what was changed
- [ ] Note build number that was rejected
- [ ] Note build number that fixed the issue
- [ ] Save for future reference

---

## Timeline & Expectations

### Normal Submission Timeline

```
Day 0:  Submit for review
        Status: "Waiting for Review"

Day 1-3: In review
        Status: "In Review"
        Apple is testing your app

Day 3-5: Decision

        ✅ APPROVED
        Status: "Pending Developer Release" or "Ready for Sale"
        → Release to public
        → App goes live within 24 hours

        ❌ REJECTED
        Status: "Rejected"
        → Fix issue
        → Resubmit within 48 hours (faster review)
```

### Factors Affecting Timeline

**Faster review** (1-2 days):
- Well-documented app
- Clear screenshots and description
- Privacy questionnaire complete
- No guideline violations

**Slower review** (4-7 days):
- Complex app with many features
- Unusual business model
- Health/medical claims
- First submission from new developer

**Expedited review** (24-48 hours):
- Available for critical bug fixes
- Must request via App Store Connect
- Explain why it's urgent
- Limited to 2 per year

---

## Key Takeaways

### For ANY iOS App:

1. **Privacy Questionnaire is #1 Priority**
   - Spend time getting it right
   - Check what your SDKs collect, not just your code
   - Device ID is almost always collected (RevenueCat, Firebase, analytics)

2. **Privacy Policy is Required**
   - Must be live before submission
   - Must match questionnaire
   - Must be mobile-responsive

3. **Legal Links Must Work**
   - Test on real iPhone
   - Must open in Safari
   - No 404 errors

4. **Apple Sign-In is Mandatory** (if using OAuth)
   - Use official component
   - Follow HIG exactly
   - Equal or more prominent placement

5. **Test on Real Devices**
   - Simulator isn't enough
   - TestFlight before App Review
   - Catch bugs early

6. **Document Your Journey**
   - Save rejection messages
   - Note what fixed issues
   - Build a knowledge base

---

## Resources

### Apple Documentation
- **App Store Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Privacy Guidance**: https://developer.apple.com/app-store/app-privacy-details/
- **Human Interface Guidelines**: https://developer.apple.com/design/human-interface-guidelines/

### Third-Party Privacy Policies
- **RevenueCat**: https://www.revenuecat.com/privacy
- **Supabase**: https://supabase.com/privacy
- **Firebase**: https://firebase.google.com/support/privacy
- **Sentry**: https://sentry.io/privacy/

### Tools
- **App Store Connect**: https://appstoreconnect.apple.com
- **Expo Application Services**: https://expo.dev/eas
- **Privacy Manifest Validator**: https://developer.apple.com/documentation/bundleresources/privacy_manifest_files

---

## Quick Reference Checklist

**Before clicking "Submit for Review"**:

- [ ] Code tested on simulator + real device
- [ ] TestFlight testing complete (no blocking bugs)
- [ ] Privacy questionnaire: "Complete" status
- [ ] Privacy Policy URL added and working
- [ ] Legal links tested on iPhone Safari
- [ ] Apple Sign-In implemented correctly (if using OAuth)
- [ ] Subscription terms clear (if using IAP)
- [ ] Health disclaimer implemented (if applicable)
- [ ] Build number incremented from last submission
- [ ] All changes committed and pushed to GitHub
- [ ] Screenshots accurate and up-to-date
- [ ] App description clear and accurate
- [ ] Demo account created for Apple reviewers (if sign-in required)
- [ ] Review notes prepared (explain compliance work)

---

**Document Version**: 1.0
**Last Updated**: January 15, 2026
**Based On**: Manifest the Unseen (Build 51 submission)
**Next Update**: After successful App Store approval

**Use this guide for EVERY iOS app submission. Good luck! 🚀**
