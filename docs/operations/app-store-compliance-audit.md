# App Store Compliance Audit - Manifest the Unseen iOS
**Date**: January 14, 2026
**Build**: 45
**Status**: ❌ NOT READY - 4 Critical Blockers, 3 High-Priority Issues
**Auditor**: Claude Code (Comprehensive Parallel Audit)

---

## Executive Summary

Comprehensive audit completed with 6 parallel research agents covering:
- Apple Sign-In implementation & HIG compliance
- In-App Purchase & subscription compliance
- Privacy policy & data handling requirements
- Health/wellness app guidelines
- Codebase authentication implementation
- Subscription & feature gating implementation

**Overall Assessment**: App is well-built with production-grade implementations, but has **4 critical blockers** that will cause immediate rejection. All blockers are related to legal documentation accessibility and privacy disclosures—relatively quick fixes (4-6 hours total).

---

## 🔴 CRITICAL BLOCKERS (Must Fix Before Submission)

### BLOCKER #1: Non-Functional Terms Link in Signup Flow
**Priority**: 🔴 CRITICAL
**Rejection Risk**: 100%
**Fix Time**: 10 minutes
**Guideline**: 5.1.1 - Legal Requirements

**Location**: `mobile/src/screens/auth/SignupScreen.tsx:315-317`

**Current Code**:
```typescript
<Text variant="body" style={styles.termsText}>
  I agree to the{' '}
  <Text style={styles.termsLink}>Terms and Conditions</Text>
</Text>
```

**Problem**: The "Terms and Conditions" text is styled to look like a link but is not pressable/clickable. Users cannot access the legal terms during signup, violating App Store guidelines.

**Required Fix**:
```typescript
import { Linking } from 'react-native';

<Text variant="body" style={styles.termsText}>
  I agree to the{' '}
  <Pressable onPress={() => Linking.openURL('https://manifesttheunseen.app/terms')}>
    <Text style={styles.termsLink}>Terms and Conditions</Text>
  </Pressable>
  {' and '}
  <Pressable onPress={() => Linking.openURL('https://manifesttheunseen.app/privacy')}>
    <Text style={styles.termsLink}>Privacy Policy</Text>
  </Pressable>
</Text>
```

**Verification**:
- [ ] Text is pressable on iOS simulator
- [ ] Opens Safari with correct URL
- [ ] URL loads privacy policy page
- [ ] Privacy policy content is readable on mobile

---

### BLOCKER #2: Non-Functional Legal Links in Paywall
**Priority**: 🔴 CRITICAL
**Rejection Risk**: 100%
**Fix Time**: 15 minutes
**Guideline**: 3.1.1 - In-App Purchase Requirements

**Location**: `mobile/src/screens/subscription/PaywallScreen.tsx:873-875`

**Current Code**:
```typescript
<View style={styles.legalLinks}>
  <Text style={styles.legalLink}>Terms of Service</Text>
  <Text style={styles.legalSeparator}> • </Text>
  <Text style={styles.legalLink}>Privacy Policy</Text>
</View>
```

**Problem**: Legal links are static text. Apple requires functional links to legal documentation on subscription purchase screens.

**Required Fix**:
```typescript
import { Linking } from 'react-native';

<View style={styles.legalLinks}>
  <Pressable onPress={() => Linking.openURL('https://manifesttheunseen.app/terms')}>
    <Text style={styles.legalLink}>Terms of Service</Text>
  </Pressable>
  <Text style={styles.legalSeparator}> • </Text>
  <Pressable onPress={() => Linking.openURL('https://manifesttheunseen.app/privacy')}>
    <Text style={styles.legalLink}>Privacy Policy</Text>
  </Pressable>
</View>
```

**Verification**:
- [ ] Links are pressable in paywall screen
- [ ] Opens correct URLs
- [ ] Works during free trial selection
- [ ] Works when viewing current subscription

---

### BLOCKER #3: Privacy Policy URL Not Configured
**Priority**: 🔴 CRITICAL
**Rejection Risk**: 95%
**Fix Time**: 30 minutes
**Guideline**: App Store Review Guidelines - Privacy Requirements

**Issues**:
1. No privacy policy URL in `app.json` metadata
2. Privacy manifest not configured for iOS 17+ compliance
3. URL not added to App Store Connect

**Required Actions**:

**A. Deploy Web App** (if not already deployed):
```bash
cd web
npm run build
# Deploy to Vercel/Netlify
# Ensure https://manifesttheunseen.app/privacy is accessible
# Ensure https://manifesttheunseen.app/terms is accessible
```

**B. Update app.json**:
```json
"ios": {
  "supportsTablet": true,
  "bundleIdentifier": "com.manifesttheunseen.app",
  "buildNumber": "46",
  "usesAppleSignIn": true,
  "config": {
    "privacyManifestAggregationEnabled": true
  },
  "privacyManifests": {
    "NSPrivacyAccessedAPICategoryUserDefaults": {
      "NSPrivacyAccessedAPITypeReasons": ["CA92.1"]
    }
  },
  "infoPlist": {
    "UIBackgroundModes": ["audio"],
    "ITSAppUsesNonExemptEncryption": false,
    "NSMicrophoneUsageDescription": "Record voice journal entries that are transcribed on your device. Audio never leaves your device—only text is saved.",
    "NSPhotoLibraryUsageDescription": "Manifest the Unseen needs photo library access to add images to your vision board and profile picture.",
    "NSCameraUsageDescription": "Manifest the Unseen needs camera access to take photos for your vision board.",
    "NSFaceIDUsageDescription": "Manifest the Unseen uses Face ID to secure your personal journal entries and workbook data."
  }
}
```

**C. Add to App Store Connect**:
- Navigate to App Information → General Information
- Privacy Policy URL: `https://manifesttheunseen.app/privacy`
- Save changes

**Verification**:
- [ ] https://manifesttheunseen.app/privacy loads successfully
- [ ] https://manifesttheunseen.app/terms loads successfully
- [ ] URLs work on mobile browsers (iOS Safari)
- [ ] Content matches in-app privacy screens
- [ ] URL added to App Store Connect

---

### BLOCKER #4: App Privacy "Nutrition Labels" Not Filled
**Priority**: 🔴 CRITICAL
**Rejection Risk**: 90%
**Fix Time**: 20 minutes
**Guideline**: App Privacy Requirements (iOS 14.3+)

**Location**: App Store Connect → App Privacy

**Problem**: Privacy questionnaire must be completed before submission. Apple requires transparent disclosure of data collection.

**Data Collection Declaration**:

#### Data Collected and Linked to User:
1. **Contact Info**
   - Email Address
   - Name (optional with Apple Sign-In)
   - Purpose: Account creation, app functionality
   - Linked to identity: YES
   - Used for tracking: NO

2. **User Content**
   - Journal entries (text only, not audio)
   - Workbook responses
   - Vision board images
   - AI chat conversations
   - Purpose: App functionality
   - Linked to identity: YES
   - Used for tracking: NO

3. **Identifiers**
   - User ID
   - Purpose: Database linking, app functionality
   - Linked to identity: YES
   - Used for tracking: NO

4. **Purchases**
   - Purchase history (via RevenueCat)
   - Purpose: Subscription management
   - Linked to identity: YES
   - Used for tracking: NO

5. **Usage Data**
   - Product interaction (meditation sessions, phase progress)
   - Purpose: App functionality, analytics
   - Linked to identity: YES
   - Used for tracking: NO

#### Data NOT Collected:
- ❌ Precise location
- ❌ Coarse location
- ❌ Physical address
- ❌ Phone number
- ❌ Search history
- ❌ Browsing history
- ❌ Device ID (beyond standard iOS identifiers)
- ❌ Audio data (transcribed on-device, never uploaded)
- ❌ Financial info (Apple handles all payments)

#### Third-Party Data Access:
1. **Supabase** - Backend database, authentication
   - Data shared: Email, user content, identifiers
   - Purpose: Core functionality

2. **RevenueCat** - Subscription management
   - Data shared: Purchase history, user ID
   - Purpose: Subscription tracking

3. **Anthropic (Claude API)** - AI chat
   - Data shared: Chat messages (no PII)
   - Purpose: AI responses

4. **OpenAI** - Text embeddings for RAG
   - Data shared: Text chunks (no PII)
   - Purpose: AI context search

**Important**: Mark "Data Used to Track You" as NO (you don't track across apps/websites owned by other companies)

**Verification**:
- [ ] All questions answered in App Store Connect
- [ ] Data types accurately reflect actual collection
- [ ] Third-party SDK tracking marked correctly
- [ ] Privacy policy URL matches declarations

---

## ⚠️ HIGH-PRIORITY ISSUES

### ISSUE #5: Health/Wellness Disclaimer Missing
**Priority**: 🟡 HIGH
**Rejection Risk**: 60%
**Fix Time**: 1-2 hours
**Guideline**: 5.1.1(ix) - Health and Health Research

**Problem**: App provides manifestation practices, meditation, and AI guidance without clear medical/professional advice disclaimers.

**Required Disclaimers**:

**Disclaimer Text**:
> **Important Disclaimer**
>
> Manifest the Unseen provides general wellness and personal development content for educational and inspirational purposes only. This app is not intended to diagnose, treat, cure, or prevent any disease, medical condition, or mental health disorder.
>
> The information provided, including AI-generated guidance, meditation practices, and workbook exercises, should not be considered professional medical, psychological, therapeutic, or financial advice. Results may vary, and we make no guarantees about specific outcomes.
>
> If you are experiencing a mental health crisis, severe emotional distress, or thoughts of self-harm, please contact emergency services (911) or a mental health crisis hotline immediately.
>
> Always consult with qualified healthcare professionals before making significant changes to your health, wellness, or lifestyle practices.

**Implementation Locations**:

**A. First Launch Disclaimer Screen**
- Create: `mobile/src/screens/onboarding/DisclaimerScreen.tsx`
- Show: Once on first app launch
- Track: AsyncStorage key `@disclaimer_accepted`
- Require: "I Understand" button before proceeding

**B. Guru AI Chat Disclaimer**
- Location: `mobile/src/screens/guru/GuruChatScreen.tsx`
- Show: Small footer text on every screen
- Text: "AI guidance is not professional advice"
- Show once: Before first message sent

**C. Settings → About Section**
- Add: "Health Disclaimer" menu item
- Links to: Full disclaimer screen

**Verification**:
- [ ] Disclaimer shown on first launch
- [ ] Cannot skip/dismiss without acknowledging
- [ ] Visible in Settings → About
- [ ] Guru chat shows footer text
- [ ] No medical claims in app description

---

### ISSUE #6: Age Rating May Be Incorrect
**Priority**: 🟡 HIGH
**Rejection Risk**: 40%
**Fix Time**: 5 minutes
**Guideline**: Age Rating Requirements

**Problem**: App contains spiritual/religious content (Bible scriptures from `docs/content/wisdom-sources/scriptures-kjv.md`, Shi Heng Yi teachings, manifestation practices). Some cultures consider manifestation practices spiritual/occult.

**Current Setting**: Likely 4+ or 9+

**Recommended Setting**: **12+** or **17+**

**App Store Connect Configuration**:
- Navigate to: App Information → Age Rating
- Set:
  - Infrequent/Mild: Realistic Violence (NO)
  - Infrequent/Mild: Cartoon/Fantasy Violence (NO)
  - Infrequent/Mild: Sexual Content (NO)
  - Infrequent/Mild: Profanity (NO)
  - Infrequent/Mild: Alcohol, Tobacco, Drugs (NO)
  - **Infrequent/Mild: Simulated Gambling (NO)**
  - **Infrequent/Mild: Horror/Fear Themes (NO)**
  - **Infrequent/Mild: Mature/Suggestive Themes (NO)**
  - **Frequent/Intense: Medical/Treatment Information (NO)**
  - **Unrestricted Web Access (NO)**
  - **Made for Kids (NO)**

**Recommendation**: Set to **12+** to be safe, given:
- Spiritual/manifestation content
- Self-reflection exercises that may not be age-appropriate for young children
- Bible scripture references

**Verification**:
- [ ] Age rating set to 12+ in App Store Connect
- [ ] Rating accurately reflects app content
- [ ] No content that would require 17+ rating

---

### ISSUE #7: Microphone Permission - Enhance Privacy Language
**Priority**: 🟢 MEDIUM
**Rejection Risk**: 10%
**Fix Time**: 2 minutes
**Guideline**: Best Practice (Privacy-First)

**Current** (`mobile/app.json:27`):
```json
"NSMicrophoneUsageDescription": "Manifest the Unseen needs microphone access to record voice journal entries for transcription."
```

**Recommended Enhancement**:
```json
"NSMicrophoneUsageDescription": "Record voice journal entries that are transcribed on your device. Audio never leaves your device—only text is saved."
```

**Why**: Emphasizes your privacy-first approach (on-device Whisper transcription). This aligns perfectly with your architecture where audio files are never uploaded.

**Verification**:
- [ ] Permission prompt shows updated text
- [ ] Messaging is consistent with privacy policy
- [ ] Tested on iOS 15+ (minimum deployment target)

---

## ✅ COMPLIANT AREAS (No Action Needed)

### Apple Sign-In Implementation ✅
**Status**: FULLY COMPLIANT - Production Ready

**Findings**:
- ✅ Uses official `expo-apple-authentication` component (native Apple button)
- ✅ HIG compliant: WHITE_OUTLINE style, 50px height (exceeds 44px minimum)
- ✅ Correct button types: SIGN_IN (login), SIGN_UP (signup)
- ✅ Proper placement: Secondary to email/password, clear "OR" divider
- ✅ Comprehensive error handling (cancellation, network, auth failures)
- ✅ Token security: Supabase validates tokens, auto-refresh enabled
- ✅ Session persistence: AsyncStorage with OS-level encryption
- ✅ Proper scopes: FULL_NAME and EMAIL only

**Files**:
- `mobile/src/screens/auth/LoginScreen.tsx:248-254`
- `mobile/src/screens/auth/SignupScreen.tsx:340-346`
- `mobile/src/services/auth.ts:168-205`

**Security Audit Status**: All H/C severity issues resolved (Dec 25-27, 2025)

---

### In-App Purchase & Subscriptions ✅
**Status**: FULLY COMPLIANT - RevenueCat Best Practices

**Findings**:
- ✅ RevenueCat SDK integration (no alternative payment methods)
- ✅ 7-day free trial clearly disclosed with "Cancel anytime" text
- ✅ Pricing accurate: 3 tiers (Novice, Awakening, Enlightenment)
- ✅ Annual savings displayed (17% discount messaging)
- ✅ Feature gating implemented (tier-based access control)
- ✅ Restore purchases available
- ✅ Subscription management accessible via Profile screen
- ✅ Apple handles all payments (no external payment processing)
- ✅ Auto-renewal disclosure present: "Subscription automatically renews unless auto-renew is turned off at least 24 hours before the end of the current period"

**Files**:
- `mobile/src/screens/subscription/PaywallScreen.tsx`
- `mobile/src/services/subscriptionService.ts`
- `mobile/src/types/subscription.ts`

**Only Issue**: Legal link placeholders (covered in Blocker #2)

---

### Permissions (Info.plist) ✅
**Status**: PROPERLY DECLARED

**Configured Permissions**:
- ✅ NSMicrophoneUsageDescription - Voice journaling
- ✅ NSPhotoLibraryUsageDescription - Vision board images
- ✅ NSCameraUsageDescription - Take photos for vision board
- ✅ NSFaceIDUsageDescription - Secure journal entries (planned feature)
- ✅ UIBackgroundModes: audio - Meditation player
- ✅ ITSAppUsesNonExemptEncryption: false - Correct (using standard HTTPS)

**File**: `mobile/app.json:22-31`

**Recommendation**: Enhance microphone description (Issue #7)

---

### Privacy Policy & Terms of Service ✅
**Status**: CONTENT EXCELLENT - Links Missing (Blocker #1, #2)

**Existing Documents**:
- ✅ Privacy Policy: `web/app/privacy/page.tsx` (200 lines, comprehensive)
- ✅ Terms of Service: `web/app/terms/page.tsx` (238 lines, comprehensive)
- ✅ Last Updated: December 10, 2025
- ✅ GDPR compliant (user rights, data retention, international transfers)
- ✅ CCPA compliant (California privacy rights section)
- ✅ Clear data collection disclosure
- ✅ Third-party services listed (Supabase, RevenueCat, Anthropic, OpenAI)
- ✅ On-device transcription emphasized ("audio never leaves your device")
- ✅ Children's privacy addressed (under 13 not permitted)

**In-App Screens** (for offline access):
- `mobile/src/screens/profile/PrivacyPolicyScreen.tsx`
- `mobile/src/screens/profile/TermsOfServiceScreen.tsx`

**Action Needed**: Deploy web app and link documents (Blocker #3)

---

## 📋 COMPLETE ACTION PLAN

### Phase 1: Deploy Web App & Configure URLs (30-60 minutes)

**Prerequisites**:
- [ ] Verify web app builds successfully: `cd web && npm run build`
- [ ] Have deployment account ready (Vercel/Netlify)

**Steps**:
1. **Deploy Web App**:
   ```bash
   cd web
   npm run build
   # If using Vercel:
   vercel --prod
   # If using Netlify:
   netlify deploy --prod
   ```

2. **Verify URLs**:
   - [ ] Test: https://manifesttheunseen.app/privacy
   - [ ] Test: https://manifesttheunseen.app/terms
   - [ ] Test on mobile (iOS Safari)
   - [ ] Verify SSL certificate valid
   - [ ] Check responsive design on iPhone

3. **Configure DNS** (if needed):
   - [ ] Point manifesttheunseen.app to deployment
   - [ ] Wait for DNS propagation (5-30 minutes)

**Verification Checklist**:
- [ ] Privacy page loads in <2 seconds
- [ ] Terms page loads in <2 seconds
- [ ] Content is readable on mobile
- [ ] No JavaScript errors in console
- [ ] Back button works (returns to iOS app)

---

### Phase 2: Fix Legal Links in Mobile App (30 minutes)

**File 1**: `mobile/src/screens/auth/SignupScreen.tsx`

**Changes**:
```typescript
// Add import at top
import { Linking } from 'react-native';

// Replace lines 305-318 with:
<TouchableOpacity
  onPress={toggleTerms}
  disabled={isSubmitting}
  style={styles.termsContainer}
>
  <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
    {agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
  </View>
  <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
    <Text variant="body" style={styles.termsText}>
      I agree to the{' '}
    </Text>
    <Pressable onPress={(e) => {
      e.stopPropagation();
      Linking.openURL('https://manifesttheunseen.app/terms');
    }}>
      <Text style={[styles.termsText, styles.termsLink]}>Terms of Service</Text>
    </Pressable>
    <Text variant="body" style={styles.termsText}> and </Text>
    <Pressable onPress={(e) => {
      e.stopPropagation();
      Linking.openURL('https://manifesttheunseen.app/privacy');
    }}>
      <Text style={[styles.termsText, styles.termsLink]}>Privacy Policy</Text>
    </Pressable>
  </View>
</TouchableOpacity>
```

**File 2**: `mobile/src/screens/subscription/PaywallScreen.tsx`

**Changes**:
```typescript
// Add import at top (if not already present)
import { Linking } from 'react-native';

// Replace lines 873-875 with:
<View style={styles.legalLinks}>
  <Pressable onPress={() => Linking.openURL('https://manifesttheunseen.app/terms')}>
    <Text style={styles.legalLink}>Terms of Service</Text>
  </Pressable>
  <Text style={styles.legalSeparator}> • </Text>
  <Pressable onPress={() => Linking.openURL('https://manifesttheunseen.app/privacy')}>
    <Text style={styles.legalLink}>Privacy Policy</Text>
  </Pressable>
</View>
```

**Testing**:
```bash
cd mobile
npm run ios
# Test:
# 1. Navigate to Signup screen → tap terms link → opens Safari
# 2. Navigate to Paywall screen → tap privacy link → opens Safari
# 3. Verify links open correct URLs
```

**Verification Checklist**:
- [ ] Signup terms link opens Safari with https://manifesttheunseen.app/terms
- [ ] Signup privacy link opens Safari with https://manifesttheunseen.app/privacy
- [ ] Paywall terms link works
- [ ] Paywall privacy link works
- [ ] User can return to app after opening link
- [ ] Links work on physical device (not just simulator)

---

### Phase 3: Update app.json Configuration (10 minutes)

**File**: `mobile/app.json`

**Changes**:
1. **Increment build number**: 45 → 46
2. **Add privacy manifest configuration**
3. **Enhance microphone description**

```json
{
  "expo": {
    "name": "Manifest the Unseen",
    "slug": "manifest-the-unseen",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "scheme": "manifesttheunseen",
    "assetBundlePatterns": [
      "assets/icon.png",
      "assets/splash-v2.png",
      "assets/adaptive-icon.png",
      "src/assets/images-compressed/**/*",
      "src/assets/icons/**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.manifesttheunseen.app",
      "buildNumber": "46",
      "usesAppleSignIn": true,
      "config": {
        "privacyManifestAggregationEnabled": true
      },
      "privacyManifests": {
        "NSPrivacyAccessedAPICategoryUserDefaults": {
          "NSPrivacyAccessedAPITypeReasons": ["CA92.1"]
        }
      },
      "infoPlist": {
        "UIBackgroundModes": [
          "audio"
        ],
        "ITSAppUsesNonExemptEncryption": false,
        "NSMicrophoneUsageDescription": "Record voice journal entries that are transcribed on your device. Audio never leaves your device—only text is saved.",
        "NSPhotoLibraryUsageDescription": "Manifest the Unseen needs photo library access to add images to your vision board and profile picture.",
        "NSCameraUsageDescription": "Manifest the Unseen needs camera access to take photos for your vision board.",
        "NSFaceIDUsageDescription": "Manifest the Unseen uses Face ID to secure your personal journal entries and workbook data."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#9333ea"
      },
      "package": "com.manifesttheunseen.app",
      "permissions": [
        "android.permission.RECORD_AUDIO"
      ]
    },
    "web": {
      "bundler": "metro",
      "favicon": "./assets/icon.png"
    },
    "plugins": [
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#000000",
          "image": "./assets/splash-v2.png",
          "imageWidth": 200
        }
      ],
      [
        "expo-build-properties",
        {
          "ios": {
            "deploymentTarget": "15.1"
          }
        }
      ],
      "expo-mail-composer"
    ],
    "extra": {
      "eas": {
        "projectId": "78b679f0-a4c2-4ed5-94c6-6338dd3d9c70"
      }
    },
    "owner": "agentic-personnel"
  }
}
```

**Verification**:
- [ ] Build number incremented to 46
- [ ] Privacy manifest configuration present
- [ ] Microphone description updated
- [ ] File validates with JSON linter (no syntax errors)

---

### Phase 4: Create Health Disclaimer Screen (1-2 hours)

**File to Create**: `mobile/src/screens/onboarding/DisclaimerScreen.tsx`

**Implementation**:
```typescript
/**
 * Health Disclaimer Screen
 *
 * Shown once on first app launch to comply with App Store Guidelines 5.1.1(ix)
 * for health and wellness apps.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing } from '../../theme';

const DISCLAIMER_KEY = '@disclaimer_accepted';

interface DisclaimerScreenProps {
  onAccept: () => void;
}

export const DisclaimerScreen: React.FC<DisclaimerScreenProps> = ({ onAccept }) => {
  const handleAccept = async () => {
    try {
      await AsyncStorage.setItem(DISCLAIMER_KEY, 'true');
      onAccept();
    } catch (error) {
      console.error('Failed to save disclaimer acceptance:', error);
      onAccept(); // Proceed anyway
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.icon}>⚕️</Text>
          <Text style={styles.title}>Important Disclaimer</Text>
        </View>

        {/* Content */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Manifest the Unseen provides general wellness and personal development
            content for educational and inspirational purposes only.
          </Text>

          <Text style={styles.paragraph}>
            This app is <Text style={styles.bold}>not intended to diagnose, treat,
            cure, or prevent any disease</Text>, medical condition, or mental health
            disorder.
          </Text>

          <Text style={styles.paragraph}>
            The information provided, including AI-generated guidance, meditation
            practices, and workbook exercises, should not be considered professional
            medical, psychological, therapeutic, or financial advice.
          </Text>

          <Text style={styles.paragraph}>
            Results may vary, and we make no guarantees about specific outcomes.
          </Text>
        </View>

        {/* Crisis Info */}
        <View style={[styles.section, styles.crisisSection]}>
          <Text style={styles.crisisTitle}>Mental Health Crisis?</Text>
          <Text style={styles.crisisParagraph}>
            If you are experiencing severe emotional distress or thoughts of self-harm,
            please contact emergency services (911) or a mental health crisis hotline
            immediately.
          </Text>
          <Text style={styles.crisisParagraph}>
            National Suicide Prevention Lifeline: 988
          </Text>
        </View>

        {/* Professional Advice */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Always consult with qualified healthcare professionals before making
            significant changes to your health, wellness, or lifestyle practices.
          </Text>
        </View>
      </ScrollView>

      {/* Accept Button */}
      <View style={styles.footer}>
        <Pressable
          style={styles.button}
          onPress={handleAccept}
        >
          <Text style={styles.buttonText}>I Understand</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

// Check if disclaimer has been accepted
export const hasAcceptedDisclaimer = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(DISCLAIMER_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Failed to check disclaimer status:', error);
    return false;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.lg,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  bold: {
    fontWeight: '600',
    color: colors.text.primary,
  },
  crisisSection: {
    backgroundColor: colors.error[900],
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.error[600],
  },
  crisisTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.error[200],
    marginBottom: spacing.sm,
  },
  crisisParagraph: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.error[100],
    marginBottom: spacing.sm,
  },
  footer: {
    padding: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  button: {
    backgroundColor: colors.primary[600],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.inverse,
  },
});
```

**Integration**: Update `App.tsx` or main navigation to check disclaimer status:
```typescript
const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

useEffect(() => {
  hasAcceptedDisclaimer().then(setDisclaimerAccepted);
}, []);

if (!disclaimerAccepted) {
  return <DisclaimerScreen onAccept={() => setDisclaimerAccepted(true)} />;
}
```

**Add to Guru Chat Screen**: `mobile/src/screens/guru/GuruChatScreen.tsx`
```typescript
{/* Footer Disclaimer */}
<View style={styles.disclaimerFooter}>
  <Text style={styles.disclaimerText}>
    AI guidance is not professional medical or psychological advice
  </Text>
</View>
```

**Verification**:
- [ ] Disclaimer shown on first launch
- [ ] Cannot skip without clicking "I Understand"
- [ ] Not shown again after acceptance
- [ ] Guru footer text visible
- [ ] Crisis hotline info clearly displayed

---

### Phase 5: App Store Connect Configuration (20 minutes)

**A. Privacy Policy URL**
1. Log in to App Store Connect
2. Navigate to: My Apps → Manifest the Unseen → App Information
3. Under "General Information":
   - Privacy Policy URL: `https://manifesttheunseen.app/privacy`
4. Click "Save"

**B. Age Rating**
1. Navigate to: App Information → Age Rating
2. Complete questionnaire:
   - Unrestricted Web Access: NO
   - Gambling and Contests: NO
   - Made for Kids: NO
   - Realistic Violence: NO (all categories)
   - Sexual Content: NO (all categories)
   - Profanity: NO (all categories)
   - Medical/Treatment Information: NO (disclaimer addresses this)
3. Result should be: **12+**
4. Click "Save"

**C. App Privacy Questionnaire**
1. Navigate to: App Privacy
2. Click "Get Started" or "Edit"
3. Answer questions:

**Data Collection**:
- Do you collect data from this app? **YES**

**Contact Info**:
- Email Address: **YES**
  - Used for: App Functionality, Developer Communications
  - Linked to user: YES
  - Used for tracking: NO
- Name: **YES**
  - Used for: App Functionality
  - Linked to user: YES
  - Used for tracking: NO

**User Content**:
- User ID: **YES**
  - Used for: App Functionality
  - Linked to user: YES
  - Used for tracking: NO
- Other User Content (journal entries, workbook responses): **YES**
  - Used for: App Functionality
  - Linked to user: YES
  - Used for tracking: NO
- Photos or Videos: **YES** (vision boards)
  - Used for: App Functionality
  - Linked to user: YES
  - Used for tracking: NO

**Usage Data**:
- Product Interaction: **YES**
  - Used for: App Functionality, Analytics
  - Linked to user: YES
  - Used for tracking: NO

**Identifiers**:
- User ID: **YES** (already listed above)

**Purchases**:
- Purchase History: **YES**
  - Used for: App Functionality
  - Linked to user: YES
  - Used for tracking: NO

4. Review and publish

**Verification Checklist**:
- [ ] Privacy URL saved in App Store Connect
- [ ] Privacy URL accessible (test the link)
- [ ] Age rating set to 12+
- [ ] All privacy questions answered
- [ ] Data types match actual collection
- [ ] No "tracking" marked (you don't track across apps)

---

### Phase 6: Build & Deploy (1 hour)

**Pre-Build Checklist**:
- [ ] All code changes committed
- [ ] Web app deployed and URLs tested
- [ ] Legal links functional in mobile app
- [ ] app.json updated (build 46)
- [ ] Disclaimer screen integrated
- [ ] App Store Connect configured

**Build Commands**:
```bash
# Ensure clean state
cd mobile
git status  # Should be clean

# Verify build number
cat app.json | grep buildNumber  # Should show "46"

# Run build
cd mobile
eas build --platform ios --profile production

# Wait for build to complete (~15-20 minutes)
# Build URL will be provided in terminal
```

**Post-Build**:
1. Download IPA from EAS dashboard
2. Upload to App Store Connect (automatically done by EAS if configured)
3. Or manually upload:
   ```bash
   xcrun altool --upload-app --type ios --file path/to/app.ipa \
     --apiKey YOUR_KEY --apiIssuer YOUR_ISSUER
   ```

**Verification**:
- [ ] Build completed successfully
- [ ] Build number shows 46 in App Store Connect
- [ ] No build errors or warnings
- [ ] IPA size reasonable (<100 MB)

---

### Phase 7: Submission & Review Notes (15 minutes)

**TestFlight Testing** (Optional but Recommended):
1. Upload build to TestFlight
2. Test on physical device:
   - [ ] Legal links open Safari
   - [ ] URLs load correctly
   - [ ] Disclaimer appears on first launch
   - [ ] Subscription flow works
   - [ ] Apple Sign-In works
3. Fix any issues before full submission

**Submission Notes for App Review Team**:
```
App Review Team,

Key compliance notes for Manifest the Unseen:

1. FREE TRIAL: 7-day free trial with full access. Terms clearly displayed on subscription screen. Users can cancel anytime via iOS Settings > App Store > Subscriptions.

2. PRIVACY:
   - Privacy policy: https://manifesttheunseen.app/privacy
   - All in-app links functional
   - Voice recordings transcribed ON-DEVICE using Whisper AI—audio never uploaded
   - Only transcribed text is stored in our secure database

3. HEALTH DISCLAIMER:
   - Disclaimer shown on first launch
   - No medical claims made
   - App is for wellness/personal development only
   - Footer disclaimer on AI chat screens

4. APPLE SIGN-IN: Fully implemented per HIG. Email/password also available as alternative.

5. SUBSCRIPTIONS: All payments through Apple IAP. No alternative payment methods. RevenueCat SDK used for subscription management.

6. TESTING NOTES:
   - Test Apple Sign-In with sandbox account
   - Test subscription with sandbox account (auto-approves in test mode)
   - Legal links open Safari browser successfully

Thank you for your review!
```

**App Review Information** (in App Store Connect):
- Demo Account: Create a test account with sample data
- Notes: Paste submission notes above
- Contact Information: Verify email and phone number

**Verification**:
- [ ] Submission notes added
- [ ] Demo account provided (if required)
- [ ] Contact info current
- [ ] All metadata complete (description, keywords, screenshots)

---

## 🎯 TIMELINE & ESTIMATES

### Total Time Required: 4-6 Hours

| Phase | Task | Time | Can Parallelize? |
|-------|------|------|------------------|
| 1 | Deploy web app | 30-60 min | ❌ (prerequisite) |
| 2 | Fix legal links | 30 min | ✅ (after phase 1) |
| 3 | Update app.json | 10 min | ✅ (parallel) |
| 4 | Create disclaimer screen | 1-2 hours | ✅ (parallel) |
| 5 | App Store Connect config | 20 min | ✅ (parallel) |
| 6 | Build & deploy | 1 hour | ❌ (after code changes) |
| 7 | Submit for review | 15 min | ❌ (after build) |

**Parallelization Strategy**:
- Complete Phase 1 first (web deployment)
- Do Phases 2, 3, 4, 5 in parallel (different team members or sessions)
- Phase 6 requires all code changes committed
- Phase 7 is final submission

---

## 📊 RISK MATRIX

| Issue | Rejection Risk | Fix Complexity | Business Impact | Priority |
|-------|----------------|----------------|-----------------|----------|
| Non-functional terms link (signup) | 🔴 100% | Low | High | P0 |
| Non-functional legal links (paywall) | 🔴 100% | Low | High | P0 |
| Missing privacy URL | 🔴 95% | Medium | High | P0 |
| App privacy labels not filled | 🔴 90% | Low | High | P0 |
| Health disclaimer missing | 🟡 60% | Medium | Medium | P1 |
| Age rating incorrect | 🟡 40% | Low | Low | P1 |
| Microphone permission wording | 🟢 10% | Low | Low | P2 |

**Legend**:
- 🔴 Critical (>80% rejection risk)
- 🟡 High (40-80% rejection risk)
- 🟢 Medium (<40% rejection risk)

---

## 🚀 POST-LAUNCH ENHANCEMENTS

### Phase 2 Features (After App Store Approval)
1. **In-App Legal Viewer** - WebView component instead of opening Safari
2. **Data Export** - GDPR/CCPA "right to portability"
3. **Account Deletion UI** - Currently backend function exists, add UI button
4. **Enhanced Analytics** - TelemetryDeck integration
5. **Error Monitoring** - Sentry configuration (mentioned in privacy policy but not yet configured)

### Security Enhancements
1. **Certificate Pinning** - For Supabase API calls
2. **Jailbreak Detection** - Optional, low priority
3. **Biometric Auth** - For journal access (already mentioned in NSFaceIDUsageDescription)

---

## 📞 SUPPORT & RESOURCES

### Documentation References
- **App Store Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Human Interface Guidelines (Sign in with Apple)**: https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple
- **App Privacy Details**: https://developer.apple.com/app-store/app-privacy-details/

### Internal Documentation
- PRD: `docs/planning/manifest-the-unseen-prd.md`
- TDD: `docs/planning/manifest-the-unseen-tdd.md`
- Security Audit: `docs/security/audits/security-audit.md`
- Setup Guides: `docs/guides/setup/`

### Supabase Configuration
- Auth Providers: `docs/guides/setup/auth-providers-config.md`
- Database: `supabase/migrations/`
- Edge Functions: `supabase/functions/`

---

## ✅ FINAL CHECKLIST

Before clicking "Submit for Review":

### Code
- [ ] All legal links functional (signup + paywall)
- [ ] Web app deployed (privacy + terms URLs work)
- [ ] Build number incremented (46)
- [ ] Privacy manifest configuration added
- [ ] Microphone description enhanced
- [ ] Disclaimer screen created and integrated
- [ ] Guru footer disclaimer added
- [ ] All changes committed to git
- [ ] Build completed successfully

### App Store Connect
- [ ] Privacy policy URL: https://manifesttheunseen.app/privacy
- [ ] Age rating: 12+
- [ ] App privacy questionnaire completed (all data types declared)
- [ ] Third-party SDKs disclosed
- [ ] Demo account provided (if needed)
- [ ] Submission notes added

### Testing
- [ ] Legal links open Safari with correct URLs
- [ ] Privacy/terms pages load on mobile
- [ ] Disclaimer appears on first launch
- [ ] Apple Sign-In works (sandbox)
- [ ] Subscription flow works (sandbox)
- [ ] Voice journal permission shows updated text
- [ ] Tested on iOS 15+ (deployment target)

### Documentation
- [ ] Project status updated with build 46 notes
- [ ] This audit document saved and committed
- [ ] Team notified of changes

---

## 📝 CHANGE LOG

| Date | Build | Changes | Status |
|------|-------|---------|--------|
| 2026-01-14 | 45 | Compliance audit completed | ❌ Blockers found |
| 2026-01-XX | 46 | Legal links fixed, privacy URL added | 🟡 In progress |

---

## 🎯 SUCCESS METRICS

### Submission Success Criteria
- [ ] No immediate rejection (within 24 hours)
- [ ] No "Metadata Rejected" status
- [ ] Moves to "In Review" status
- [ ] Reviewer doesn't request additional info on legal/privacy

### Expected Timeline
- **Submit**: Day 1
- **In Review**: Day 2-3
- **Approval**: Day 5-7
- **Confidence**: 95% approval if all fixes completed

---

**Document Version**: 1.0
**Last Updated**: January 14, 2026
**Next Review**: After build 46 submission

---

END OF COMPLIANCE AUDIT DOCUMENT
