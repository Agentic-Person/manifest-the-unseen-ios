# Next Steps: App Store Connect Privacy Questionnaire

**Status**: ✅ **COMPLETE** - Ready for App Store Submission
**Privacy Policy**: ✅ Deployed to https://www.manifesttheunseen.app/privacy
**Privacy Questionnaire**: ✅ Complete in App Store Connect
**Last Updated**: January 16, 2026

---

## Step 1: Verify Privacy Policy Deployment (2-5 min wait)

**Check deployment status**:

1. Go to https://vercel.com/dashboard
2. Look for "manifest-the-unseen-ios" or your web project
3. Check latest deployment status:
   - ✅ "Ready" = Deployed successfully
   - ⏳ "Building" = Still deploying (wait)
   - ❌ "Error" = Check build logs

**Verify the update**:

1. Open **incognito/private window** (to avoid cache)
2. Go to: https://www.manifesttheunseen.app/privacy
3. Scroll to "5. Third-Party Services"
4. **Verify**: Should show 4 services (NO TelemetryDeck):
   - ✅ Supabase
   - ✅ Anthropic (Claude)
   - ✅ RevenueCat
   - ✅ Apple App Store
5. **Verify**: Should see disclaimer: "Note: Analytics tracking services (such as TelemetryDeck) may be added in future versions..."

---

## Step 2: Fill Out Privacy Questionnaire in App Store Connect

### Access the Questionnaire

1. Go to: https://appstoreconnect.apple.com
2. Log in with your Apple ID + 2FA
3. Click: **My Apps**
4. Select: **Manifest the Unseen**
5. Click: **App Privacy** (left sidebar)
6. Click: **Edit** (or "Get Started" if not started)

---

### Question 1: Does your app collect data?

**Answer**: ✅ **YES**

Click **Next**

---

### Section 1: Contact Info

**Do you collect Contact Info?**
**Answer**: ✅ **YES**

**Which types?**

#### Name
- **Collected**: ✅ YES
- **Purpose**: ✅ App Functionality
- **Linked to user**: ✅ YES
- **Used for tracking**: ❌ NO

#### Email Address
- **Collected**: ✅ YES
- **Purpose**: ✅ **App Functionality ONLY** (⚠️ DO NOT select Analytics)
- **Linked to user**: ✅ YES
- **Used for tracking**: ❌ NO

#### Phone Number
- **Collected**: ❌ NO

#### Physical Address
- **Collected**: ❌ NO

#### Other Contact Info
- **Collected**: ❌ NO

Click **Next**

---

### Section 2: Health & Fitness

**Do you collect Health & Fitness data?**
**Answer**: ❌ **NO**

**Rationale**: Meditation session tracking is "Usage Data", NOT health data. Only if you use HealthKit or collect vitals (heart rate, etc.) would this be YES.

Click **Next** (skips this section)

---

### Section 3: Financial Info

**Do you collect Financial Info?**
**Answer**: ❌ **NO**

**Rationale**: Apple IAP handles all payment info. RevenueCat proxies subscription status, which goes under "Purchases" not "Financial Info".

Click **Next** (skips this section)

---

### Section 4: Location

**Do you collect Location data?**
**Answer**: ❌ **NO**

Click **Next** (skips this section)

---

### Section 5: Sensitive Info

**Do you collect Sensitive Info?**
**Answer**: ❌ **NO**

Click **Next** (skips this section)

---

### Section 6: Contacts

**Do you collect user's Contacts?**
**Answer**: ❌ **NO**

Click **Next** (skips this section)

---

### Section 7: User Content

**Do you collect User Content?**
**Answer**: ✅ **YES**

**Which types?**

#### Photos or Videos
- **Collected**: ✅ YES
- **Purpose**: ✅ App Functionality
- **Linked to user**: ✅ YES
- **Used for tracking**: ❌ NO

**Notes**: Vision board images only

#### Audio Data
- **Collected**: ❌ **NO**

**CRITICAL**: Add explanation in "Additional Information" section (see below)

#### Gameplay Content
- **Collected**: ❌ NO

#### Customer Support
- **Collected**: ❌ NO

#### Other User Content
- **Collected**: ✅ YES
- **Purpose**: ✅ App Functionality
- **Linked to user**: ✅ YES
- **Used for tracking**: ❌ NO

**Includes**: Journal entries (text), workbook responses, AI chat messages, vision board captions

Click **Next**

---

### Section 8: Browsing History

**Do you collect Browsing History?**
**Answer**: ❌ **NO**

Click **Next** (skips this section)

---

### Section 9: Search History

**Do you collect Search History?**
**Answer**: ❌ **NO**

Click **Next** (skips this section)

---

### Section 10: Identifiers

**Do you collect Identifiers?**
**Answer**: ✅ **YES**

**Which types?**

#### User ID
- **Collected**: ✅ YES
- **Purpose**: ✅ App Functionality
- **Linked to user**: ✅ YES
- **Used for tracking**: ❌ NO

**Notes**: Supabase UUID

#### Device ID ⚠️ CRITICAL UPDATE
- **Collected**: ✅ **YES**
- **Purpose**: ✅ App Functionality
- **Linked to user**: ✅ YES
- **Used for tracking**: ❌ NO

**Notes**: RevenueCat SDK uses device ID for subscription fraud prevention

#### Advertising Identifier (IDFA)
- **Collected**: ❌ NO

#### Other Identifiers
- **Collected**: ❌ NO

Click **Next**

---

### Section 11: Purchases

**Do you collect Purchase data?**
**Answer**: ✅ **YES**

**Which types?**

#### Purchase History
- **Collected**: ✅ YES
- **Purpose**: ✅ App Functionality, ✅ Analytics
- **Linked to user**: ✅ YES
- **Used for tracking**: ❌ NO

**Includes**: Subscription tier, trial start date, subscription status

Click **Next**

---

### Section 12: Usage Data

**Do you collect Usage Data?**
**Answer**: ✅ **YES**

**Which types?**

#### Product Interaction
- **Collected**: ✅ YES
- **Purpose**: ✅ App Functionality, ✅ Analytics
- **Linked to user**: ✅ YES
- **Used for tracking**: ❌ NO

**Includes**: Meditation sessions, workbook phase progress, journal count, AI chat usage

#### Advertising Data
- **Collected**: ❌ NO

#### Other Usage Data
- **Collected**: ❌ NO

Click **Next**

---

### Section 13: Diagnostics

**Do you collect Diagnostic data?**
**Answer**: ❌ **NO**

**Rationale**: Sentry is documented but NOT currently implemented in Build 51.

**IMPORTANT**: When you add Sentry in future builds, you MUST update this questionnaire to YES.

Click **Next** (skips this section)

---

### Section 14: Other Data Types

**Do you collect any other data types?**
**Answer**: ❌ **NO**

Click **Next**

---

### Additional Information Field

**Copy this text into the "Additional Information" field**:

```
VOICE JOURNAL PRIVACY:

Our app includes a voice journaling feature. However:

1. Audio recordings are transcribed ON-DEVICE using OpenAI Whisper model
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

All third-party data transmission is encrypted via TLS.
```

---

### Third-Party SDK Disclosure

**List these SDKs with their privacy policies**:

1. **Supabase**
   - Privacy Policy: https://supabase.com/privacy

2. **RevenueCat**
   - Privacy Policy: https://www.revenuecat.com/privacy

3. **Anthropic Claude**
   - Privacy Policy: https://www.anthropic.com/legal/privacy

4. **OpenAI**
   - Privacy Policy: https://openai.com/privacy
   - Note: Whisper runs ON-DEVICE (no audio sent to OpenAI)

---

### Review Your Answers

**Before clicking "Publish", verify**:

- [ ] All 6 data categories completed:
  - Contact Info (Name, Email)
  - User Content (Photos, Other)
  - Identifiers (User ID, **Device ID**)
  - Purchases (Purchase History)
  - Usage Data (Product Interaction)
  - Diagnostics: **NONE** (shouldn't appear in summary)

- [ ] Every item shows:
  - "Linked to user: Yes"
  - "Used for tracking: No"

- [ ] Additional Information includes voice recording explanation

- [ ] Third-party SDKs listed with privacy policy links

- [ ] No accidental "YES" to advertising/tracking

---

## Step 3: Add Privacy Policy URL to App Store Connect

1. Stay in App Store Connect
2. Navigate to: **App Information** (left sidebar)
3. Click: **General Information** (top tab)
4. Find: **Privacy Policy URL** field
5. Enter: `https://www.manifesttheunseen.app/privacy`
6. Click **Save**

---

## Step 4: Verify Questionnaire Complete

1. Go back to: **App Privacy** (left sidebar)
2. Check status: Should show **"Complete"** with green ✅ checkmark
3. Review summary:
   - Contact Info (Name, Email)
   - User Content (Photos, Other)
   - Identifiers (User ID, Device ID)
   - Purchases (Purchase History)
   - Usage Data (Product Interaction)
   - **Diagnostics should NOT appear** (because you answered NO)

4. Check Product Page Preview:
   - Click "Product Page" to see the "nutrition label"
   - Verify it looks correct
   - All items: "Linked to user • Not used for tracking"

---

## Step 5: Ready for Submission

Once complete, you're ready to:

1. Attach Build 51 to your App Store version
2. Add/verify screenshots
3. Submit for App Review

---

## Common Questions Apple May Ask

**If Apple asks about voice recording**:
> "Voice journal audio is transcribed entirely on the user's device using the OpenAI Whisper model. The audio never leaves the device. Only the resulting text transcription is saved to our database. This ensures maximum privacy for sensitive journal content."

**If Apple asks about health data**:
> "We track meditation session completion for user progress statistics, but we do not collect any health metrics (heart rate, sleep, etc.) and do not use HealthKit APIs."

**If Apple asks about Device ID**:
> "RevenueCat SDK uses device ID for subscription fraud prevention via Apple IAP. Payment data is handled entirely by Apple. RevenueCat's privacy policy: https://www.revenuecat.com/privacy"

---

## Verification Checklist

✅ **ALL COMPLETE** - Ready for App Store Submission:

- [x] Privacy policy deployed and verified (no TelemetryDeck)
- [x] Privacy questionnaire shows "Complete" status
- [x] Privacy Policy URL added to App Information
- [x] Device ID included in Identifiers section
- [x] Diagnostics set to NO (Sentry not implemented)
- [x] Email purpose is App Functionality only (no Analytics)
- [x] Additional Information includes voice recording explanation
- [x] All items: "Linked to user: Yes, Used for tracking: No"
- [x] Product page preview looks correct
- [x] Ready to attach Build 51 and submit

---

## Timeline

- **Privacy Policy Deployment**: ✅ Complete (deployed to production)
- **Fill Out Questionnaire**: ✅ Complete (App Store Connect updated)
- **Verification**: ✅ Complete (all checks passed)
- **Total Time**: Completed January 16, 2026

---

## Completion Summary

**Status**: ✅ **ALL STEPS COMPLETE** - Ready for App Store Submission

**What Was Completed**:
1. ✅ Privacy policy updated (TelemetryDeck removed, disclaimer added)
2. ✅ Privacy policy deployed to https://www.manifesttheunseen.app/privacy
3. ✅ Privacy questionnaire updated in App Store Connect
4. ✅ Device ID added to Identifiers section
5. ✅ Diagnostics removed (Sentry not implemented)
6. ✅ Email purpose clarified (App Functionality only)
7. ✅ All verification checks passed

**Technical Fixes Applied**:
- ESLint configuration conflicts resolved
- Vercel environment variables added (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- Vercel deployment successful

**Git Commits**:
- `7edd106` - fix: remove TelemetryDeck from privacy policy (not implemented)
- `05fe76f` - fix: ignore web directory in root ESLint config
- `7ccf77e` - fix: add root:true to web ESLint config to prevent parent inheritance
- `d50bb52` - fix: disable react/no-unescaped-entities ESLint rule for web

**Next Action**:
1. Attach Build 51 to App Store version in App Store Connect
2. Verify screenshots are current
3. Submit for App Review

**Reference**: Full guide at `docs/guides/deployment/app-store-submission-survival-guide.md`
