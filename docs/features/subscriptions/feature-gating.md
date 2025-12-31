# Subscription & Feature Gating Documentation

**Last Updated**: December 28, 2025 (Build 36)
**Purpose**: Document the subscription tier system and feature access rules

---

## Business Model Overview

| Tier | Price | Guru Access | Key Features |
|------|-------|-------------|--------------|
| **Free/Trial** | $0 (7 days) | ✅ 3/day limit | Full app access for 7 days |
| **Novice** | $7.99/mo, $79.92/yr | ❌ Locked | Workbook, music meditations |
| **Awakening** | $19.99/mo, $199.90/yr | ✅ Unlimited | + Guided meditations, Guru |
| **Enlightenment** | $49.99/mo, $499.90/yr | ✅ Unlimited | + Coming Soon features |

---

## Feature Access by Tier

| Feature | Free/Trial | Novice | Awakening | Enlightenment |
|---------|------------|--------|-----------|---------------|
| Workbook (all 10 phases) | ✅ | ✅ | ✅ | ✅ |
| Music Meditations (6) | ✅ | ✅ | ✅ | ✅ |
| Guided Meditations (6) | ✅ | ❌ | ✅ | ✅ |
| Vision Board | ✅ | ✅ | ✅ | ✅ |
| Guru Analysis | ✅ **3/day** | ❌ | ✅ Unlimited | ✅ Unlimited |
| Advanced Analytics | ❌ | ❌ | ✅ | ✅ |
| Full Guru Chat | ❌ | ❌ | ❌ | Coming Soon |
| Voice Journaling | ❌ | ❌ | ❌ | Coming Soon |

---

## Key Files

### 1. Feature Limits Definition
**File**: `mobile/src/types/subscription.ts`

```typescript
export const FEATURE_LIMITS = {
  free: {
    maxPhase: 10,                 // All phases during trial
    maxMeditations: 18,           // All meditations during trial
    hasGuidedMeditations: true,   // Guided meditations during trial
    hasGuruAnalysis: true,        // Guru enabled (rate-limited - see guruRateLimitStore)
    hasVisionBoard: true,
    // ...
  },
  novice: {
    maxPhase: 10,
    maxMeditations: 6,            // Music only
    hasGuidedMeditations: false,
    hasGuruAnalysis: false,       // NO Guru - must upgrade to Awakening
    hasVisionBoard: true,
    // ...
  },
  awakening: {
    maxPhase: 10,
    maxMeditations: 12,
    hasGuidedMeditations: true,
    hasGuruAnalysis: true,        // Unlimited Guru
    hasAdvancedAnalytics: true,
    hasVisionBoard: true,
    // ...
  },
  // ...
};
```

### 2. Guru Rate Limiting (Free/Trial Only)
**File**: `mobile/src/stores/guruRateLimitStore.ts`

- Tracks daily Guru usage with AsyncStorage
- Key: `guru_daily_usage` → `{ date: "YYYY-MM-DD", count: number }`
- Limit: 3 requests per 24 hours
- Resets at midnight local time
- Only applies to `free` tier (Awakening+ = unlimited)

**Usage in GuruScreen**:
```typescript
const { canMakeRequest, incrementUsage, getRemainingRequests } = useGuruRateLimit();
const tier = useSubscriptionStore((state) => state.tier);
const isUnlimited = tier === 'awakening' || tier === 'enlightenment';

// Before sending request:
if (!isUnlimited && !canMakeRequest()) {
  // Show rate limit exceeded modal
  return;
}

// After successful request:
if (!isUnlimited) {
  await incrementUsage();
}
```

### 3. Subscription Store
**File**: `mobile/src/stores/subscriptionStore.ts`

- Manages global subscription state
- Loads from RevenueCat on app start
- Falls back to `free` tier if RevenueCat fails
- `checkAccess(feature)` method for feature gating

### 4. Subscription Hooks
**File**: `mobile/src/hooks/useSubscription.ts`

Key hooks:
- `useGuruAccess()` - Returns `FEATURE_LIMITS[tier].hasGuruAnalysis`
- `useGuidedMeditationAccess()` - Returns `FEATURE_LIMITS[tier].hasGuidedMeditations`
- `usePhaseAccess(phaseNumber)` - Returns `phaseNumber <= FEATURE_LIMITS[tier].maxPhase`
- `useFeatureAccess()` - Returns all feature flags for current tier

---

## RevenueCat Configuration

### Entitlements (RevenueCat Dashboard)
| Entitlement ID | Tier |
|----------------|------|
| `novice_path` | Novice |
| `awakening_path` | Awakening |
| `enlightenment_path` | Enlightenment |

### Products (App Store Connect)
| Product ID | Tier | Period |
|------------|------|--------|
| `manifest_novice_monthly` | Novice | Monthly |
| `manifest_novice_yearly` | Novice | Yearly |
| `manifest_awakening_monthly` | Awakening | Monthly |
| `manifest_awakening_yearly` | Awakening | Yearly |
| `manifest_enlightenment_monthly` | Enlightenment | Monthly |
| `manifest_enlightenment_yearly` | Enlightenment | Yearly |

### Important: Product → Entitlement Attachment
Products MUST be attached to entitlements in RevenueCat dashboard:
- Go to Products → Select product → Attach to entitlement
- If not attached, purchases won't grant access!

---

## TestFlight vs Production Builds

### TestFlight Profile (`eas.json` → testflight)
```json
{
  "env": {
    "EXPO_PUBLIC_TESTFLIGHT_FULL_ACCESS": "true"
  }
}
```
- Bypasses RevenueCat entirely
- Grants `enlightenment` tier access
- For internal testing only

### Production Profile (`eas.json` → production)
```json
{
  "env": {
    "EXPO_PUBLIC_TESTFLIGHT_FULL_ACCESS": "false"
  }
}
```
- Uses real RevenueCat
- Real subscription flow
- For App Store submission

---

## Troubleshooting

### Issue: Features locked even though user should have access
**Causes**:
1. RevenueCat failed to load → defaults to `free` tier
2. Products not attached to entitlements in RevenueCat
3. Old "default" offering used instead of "current" offering

**Check**:
- RevenueCat Dashboard → Customer → Check entitlements
- Verify EXPO_PUBLIC_REVENUECAT_IOS_KEY is correct
- Check console logs for RevenueCat errors

### Issue: "Unable to load subscriptions" error
**Cause**: RevenueCat `getOfferings()` failed

**Fix** (Build 35+): PaywallScreen now shows error UI with "Try Again" button instead of infinite spinner

### Issue: Guru says "rate limit exceeded" for paid users
**Cause**: Rate limit check not skipping Awakening+ users

**Fix**: Ensure GuruScreen checks tier before applying rate limit:
```typescript
const isUnlimited = tier === 'awakening' || tier === 'enlightenment';
if (isUnlimited || canMakeRequest()) { /* allow */ }
```

---

## Build History

| Build | Date | Changes |
|-------|------|---------|
| 34 | Dec 27 | Subscription sync fixes |
| 35 | Dec 28 | PaywallScreen infinite spinner fix |
| 36 | Dec 28 | Feature gating fix + Guru rate limiting |

---

## Related Files

- `mobile/src/types/subscription.ts` - Type definitions, FEATURE_LIMITS
- `mobile/src/stores/subscriptionStore.ts` - Global subscription state
- `mobile/src/stores/guruRateLimitStore.ts` - Guru daily usage tracking
- `mobile/src/hooks/useSubscription.ts` - Feature access hooks
- `mobile/src/services/subscriptionService.ts` - RevenueCat API wrapper
- `mobile/src/screens/subscription/PaywallScreen.tsx` - Purchase UI
- `mobile/src/screens/GuruScreen.tsx` - Guru with rate limit check
- `mobile/eas.json` - Build profiles (testflight vs production)
