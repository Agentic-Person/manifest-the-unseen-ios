# App Store Connect Privacy Questionnaire - Step-by-Step Guide
**App**: Manifest the Unseen
**Date**: January 14, 2026
**Build**: 49 (preparing for submission)

---

## CRITICAL: This Must Be 100% Accurate

The App Privacy questionnaire is the **#1 cause of App Store rejections**. Follow this guide exactly while logged into App Store Connect.

---

## Access the Questionnaire

1. Log into: https://appstoreconnect.apple.com
2. Click: **My Apps**
3. Select: **Manifest the Unseen**
4. Click: **App Privacy** (left sidebar)
5. Click: **Edit** (or "Get Started" if not started)

---

## Question 1: Does your app collect data?

**Answer**: ✅ **YES**

Click **Next**

---

## Section 1: Contact Info

### Do you collect Contact Info?
**Answer**: ✅ **YES**

Click **Next**

### Which Contact Info do you collect?

#### 1. Name
- **Collected**: ✅ YES
- **Purpose**:
  - ✅ App Functionality
- **Linked to user**: ✅ YES
- **Used for tracking**: ❌ NO

**Notes**:
- Collected during email/password signup
- Optional with Apple Sign-In
- Used for personalization ("Welcome, [Name]")

---

#### 2. Email Address
- **Collected**: ✅ YES
- **Purpose**:
  - ✅ App Functionality
  - ✅ Analytics (optional, check if you send analytics with email)
- **Linked to user**: ✅ YES
- **Used for tracking**: ❌ NO

**Notes**:
- Required for email/password signup
- Optional with Apple Sign-In (user can hide email)
- Used for account recovery, password reset

---

#### 3. Phone Number
- **Collected**: ❌ NO

#### 4. Physical Address
- **Collected**: ❌ NO

#### 5. Other User Contact Info
- **Collected**: ❌ NO

Click **Next**

---

## Section 2: Health & Fitness

### Do you collect Health & Fitness data?
**Answer**: ⚠️ **CAREFUL** - Read this carefully

**Apple's Definition**: Health, fitness, and medical data, including from the Clinical Health Records API, HealthKit API, MovementDisorder APIs, or health-related human subject research or health clinical trials.

**Our App**:
- We track **meditation sessions** (duration, completion)
- We do NOT use HealthKit
- We do NOT collect heart rate, blood pressure, sleep data, etc.

**Correct Answer**: ❌ **NO** (meditation tracking is "usage data", not health data)

Click **Next** (skips this section)

---

## Section 3: Financial Info

### Do you collect Financial Info?
**Answer**: ❌ **NO**

**Why NO**:
- We use RevenueCat + Apple IAP
- Apple handles all payment info
- We never see credit card numbers, bank accounts, etc.
- We only store subscription status (covered under "Purchases")

Click **Next** (skips this section)

---

## Section 4: Location

### Do you collect Location data?
**Answer**: ❌ **NO**

Click **Next** (skips this section)

---

## Section 5: Sensitive Info

### Do you collect Sensitive Info?
**Answer**: ❌ **NO**

**Apple's Definition**: Racial/ethnic data, sexual orientation, pregnancy info, disability, religious/philosophical beliefs, union membership, political affiliation, genetic info, biometric data.

**Our App**: None of the above

Click **Next** (skips this section)

---

## Section 6: Contacts

### Do you collect user's Contacts?
**Answer**: ❌ **NO**

Click **Next** (skips this section)

---

## Section 7: User Content

### Do you collect User Content?
**Answer**: ✅ **YES**

Click **Next**

### Which User Content do you collect?

#### 1. Photos or Videos
- **Collected**: ✅ YES
- **Purpose**:
  - ✅ App Functionality
- **Linked to user**: ✅ YES
- **Used for tracking**: ❌ NO

**Notes**:
- Vision board images only
- User selects from photo library
- Stored in Supabase Storage
- No face recognition or AI analysis

---

#### 2. Audio Data
- **Collected**: ❌ **NO**

**CRITICAL NOTE**: Add this in "Additional Information" section:
```
Voice Journaling Privacy:
- Users can record voice journals using the microphone
- Audio is transcribed ON-DEVICE using OpenAI Whisper model
- Audio files NEVER leave the user's device
- Only transcribed TEXT is saved to our database
- Audio files are immediately deleted after transcription
- No audio data is uploaded or stored in the cloud
```

**Why NO**: We don't collect/store audio, only the transcribed text (which falls under "Other User Content")

---

#### 3. Gameplay Content
- **Collected**: ❌ NO

#### 4. Customer Support
- **Collected**: ❌ NO

#### 5. Other User Content
- **Collected**: ✅ YES
- **Purpose**:
  - ✅ App Functionality
- **Linked to user**: ✅ YES
- **Used for tracking**: ❌ NO

**Notes**:
- Journal entries (transcribed text from voice)
- Workbook responses (all 10 phases)
- AI chat conversations with Guru
- Vision board captions/notes
- User's goals, values, affirmations

Click **Next**

---

## Section 8: Browsing History

### Do you collect Browsing History?
**Answer**: ❌ **NO**

Click **Next** (skips this section)

---

## Section 9: Search History

### Do you collect Search History?
**Answer**: ❌ **NO**

Click **Next** (skips this section)

---

## Section 10: Identifiers

### Do you collect Identifiers?
**Answer**: ✅ **YES**

Click **Next**

### Which Identifiers do you collect?

#### 1. User ID
- **Collected**: ✅ YES
- **Purpose**:
  - ✅ App Functionality
- **Linked to user**: ✅ YES
- **Used for tracking**: ❌ NO

**Notes**:
- Supabase user UUID
- Used to link all user data (journal, workbook, subscription)
- Never shared with third parties for advertising

---

#### 2. Device ID
- **Collected**: ❌ NO

**Notes**:
- RevenueCat may use device ID internally for subscription management
- We don't access or store it ourselves
- If RevenueCat requires this, mark as YES and link to RevenueCat privacy policy

---

#### 3. Advertising Identifier (IDFA)
- **Collected**: ❌ NO

#### 4. Other Identifiers
- **Collected**: ❌ NO

Click **Next**

---

## Section 11: Purchases

### Do you collect Purchase data?
**Answer**: ✅ **YES**

Click **Next**

### Which Purchase data do you collect?

#### 1. Purchase History
- **Collected**: ✅ YES
- **Purpose**:
  - ✅ App Functionality
  - ✅ Analytics (to track trial conversions)
- **Linked to user**: ✅ YES
- **Used for tracking**: ❌ NO

**Notes**:
- Subscription tier (Novice, Awakening, Enlightenment)
- Trial start date
- Subscription status (active, expired, cancelled)
- Used for feature gating (free vs paid)
- Managed by RevenueCat

Click **Next**

---

## Section 12: Usage Data

### Do you collect Usage Data?
**Answer**: ✅ **YES**

Click **Next**

### Which Usage Data do you collect?

#### 1. Product Interaction
- **Collected**: ✅ YES
- **Purpose**:
  - ✅ App Functionality
  - ✅ Analytics
- **Linked to user**: ✅ YES
- **Used for tracking**: ❌ NO

**Notes**:
- Meditation sessions (which meditations, duration, completion)
- Workbook phase progress (which phases completed)
- Journal entry count
- AI chat usage
- Used to show user their own progress and stats

---

#### 2. Advertising Data
- **Collected**: ❌ NO

#### 3. Other Usage Data
- **Collected**: ❌ NO

Click **Next**

---

## Section 13: Diagnostics

### Do you collect Diagnostic data?
**Answer**: ✅ **YES** (if using Sentry or crash reporting)

**OR**

**Answer**: ❌ **NO** (if NOT using crash reporting yet)

**Check your code**: Do you have Sentry or any error tracking SDK installed?

If YES, select:

#### 1. Crash Data
- **Collected**: ✅ YES
- **Purpose**:
  - ✅ App Functionality (bug fixes)
- **Linked to user**: ❌ NO (anonymized)
- **Used for tracking**: ❌ NO

#### 2. Performance Data
- **Collected**: ✅ YES
- **Purpose**:
  - ✅ App Functionality (performance optimization)
- **Linked to user**: ❌ NO (anonymized)
- **Used for tracking**: ❌ NO

**Notes**: Crash reports sent to Sentry (if implemented)

Click **Next**

---

## Section 14: Other Data Types

### Do you collect any other data types?
**Answer**: ❌ **NO**

Click **Next**

---

## Third-Party SDK Disclosure

Apple will ask about third-party SDKs. Be transparent:

### Third-Party SDKs Used:

1. **Supabase** (Database, Auth, Storage)
   - Purpose: Backend infrastructure
   - Privacy Policy: https://supabase.com/privacy
   - Data: All user content, authentication

2. **RevenueCat** (Subscriptions)
   - Purpose: In-app purchase management
   - Privacy Policy: https://www.revenuecat.com/privacy
   - Data: Purchase history, subscription status

3. **Anthropic Claude** (AI Chat)
   - Purpose: AI-powered wisdom guidance
   - Privacy Policy: https://www.anthropic.com/legal/privacy
   - Data: Chat messages only (text)

4. **OpenAI** (Embeddings)
   - Purpose: AI knowledge search (embeddings only)
   - Privacy Policy: https://openai.com/privacy
   - Data: Search queries (text only)
   - Note: Whisper runs ON-DEVICE (no data sent)

---

## Additional Information Section

**Use this text** in the "Additional Information" field:

```
VOICE JOURNAL PRIVACY:

Our app includes a voice journaling feature. However, we want to emphasize that:

1. Audio recordings are transcribed ON-DEVICE using the OpenAI Whisper model
2. Audio files NEVER leave the user's device
3. Only transcribed TEXT is saved to our database (Supabase)
4. Audio files are immediately deleted after transcription
5. No voice data is uploaded to any server

This on-device approach ensures maximum privacy for sensitive personal journal content. Users maintain complete control over their audio data.

THIRD-PARTY SERVICES:

We use the following third-party services:
- Supabase (backend database, authentication, storage)
- RevenueCat (subscription management via Apple IAP)
- Anthropic Claude API (AI chat - text only)
- OpenAI (embeddings for semantic search - text only)

All third-party data transmission is encrypted and follows each provider's privacy policy (links provided in questionnaire).
```

---

## Final Review

Before clicking **Publish**:

✅ **Checklist**:
- [ ] All 5 data categories completed (Contact, User Content, Identifiers, Purchases, Usage Data)
- [ ] Every item marked "Linked to user: YES"
- [ ] Every item marked "Used for tracking: NO"
- [ ] Voice privacy explanation added to Additional Information
- [ ] Third-party SDKs disclosed with privacy policy links
- [ ] No accidental "YES" to advertising/tracking
- [ ] Status shows "Complete" or "Ready to Publish"

---

## Common Mistakes to Avoid

❌ **Don't mark audio as collected** - We transcribe on-device
❌ **Don't mark health data** - Meditation tracking is "usage data"
❌ **Don't mark financial info** - Apple IAP handles this
❌ **Don't mark "Used for tracking: YES"** - We don't track for ads
❌ **Don't forget voice privacy note** - This is critical for reviewer understanding

---

## After Publishing

Once published:
1. ✅ Status changes to "Complete" in App Store Connect
2. ✅ Green checkmark appears next to "App Privacy"
3. ✅ Privacy "nutrition label" will appear on App Store listing
4. ✅ You can now submit the app for review

---

## If Apple Asks Questions

If Apple's review team asks for clarification:

**About voice recordings**:
> "Voice journal audio is transcribed entirely on the user's device using the OpenAI Whisper model. The audio never leaves the device. Only the resulting text transcription is saved to our database. This ensures maximum privacy for sensitive journal content."

**About health data**:
> "We track meditation session completion for user progress statistics, but we do not collect any health metrics (heart rate, sleep, etc.) and do not use HealthKit APIs."

**About AI chat**:
> "Our AI chat feature (Guru) sends only text messages to the Anthropic Claude API. No voice data, personal health information, or sensitive user content is included in AI requests."

---

## Verification

After completing the questionnaire, verify in App Store Connect:

1. Navigate to: **App Privacy**
2. Status should show: **Complete** ✅
3. You should see a summary of:
   - Contact Info (Name, Email)
   - User Content (Photos, Other)
   - Identifiers (User ID)
   - Purchases (Purchase History)
   - Usage Data (Product Interaction)
4. All items should show "Linked to user: Yes, Used for tracking: No"

---

**Document Owner**: Claude Code AI Assistant
**Last Updated**: January 14, 2026
**Status**: Ready for use with Build 49 submission
