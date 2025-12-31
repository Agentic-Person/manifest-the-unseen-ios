# RevenueCat Offerings Debug - Working Document

**Created**: December 29, 2025
**Status**: 🔴 NOT WORKING - Offerings fail to load
**Build**: 39 (testflight-sandbox profile)

---

## Current Problem

PaywallScreen shows: **"Unable to load subscriptions. Please check your internet connection"**

This error appears immediately when clicking "Manage Subscriptions" in the app.

---

## Configuration Summary

### App Store Connect Products (6 total)

| Product ID | Display Name | Price | Duration | Availability | Status |
|------------|--------------|-------|----------|--------------|--------|
| manifest_novice_monthly | Novice Path Monthly | $7.99 | 1 month | 175 countries | Missing Metadata |
| manifest_novice_yearly | Novice Path Yearly | $79.99 | 1 year | 175 countries | Missing Metadata |
| manifest_awakening_monthly | Awakening Path Monthly | $19.99 | 1 month | 175 countries | Missing Metadata |
| manifest_awakening_yearly | Awakening Path Yearly | $199.99 | 1 year | 175 countries | Missing Metadata |
| manifest_enlightenment_monthly | Enlightenment Path Monthly | $49.99 | 1 month | 175 countries | Missing Metadata |
| manifest_enlightenment_yearly | Enlightenment Path Yearly | $499.99 | 1 year | 175 countries | Missing Metadata |

**Note**: "Missing Metadata" is because Review Screenshot not uploaded (chicken-egg problem - need working app to screenshot).

### RevenueCat Dashboard Configuration

**App**: Manifest the Unseen (iOS)
**API Key (Production)**: `appl_syRiYucCEYWABHxxiKjporBRJVM`
**API Key (Test)**: `test_BNBlDdtGQwZdpmfspkxtempIcYP`

#### Offerings (must verify in RevenueCat Dashboard)
- [ ] "current" offering exists and is set as default
- [ ] Package IDs match code expectations (see below)

#### Expected Package IDs (from code)
```typescript
// mobile/src/types/subscription.ts
export const PACKAGE_IDS = {
  NOVICE_MONTHLY: 'novice_monthly',
  NOVICE_ANNUAL: 'novice_annual',
  AWAKENING_MONTHLY: 'awakening_monthly',
  AWAKENING_ANNUAL: 'awakening_annual',
  ENLIGHTENMENT_MONTHLY: 'enlightenment_monthly',
  ENLIGHTENMENT_ANNUAL: 'enlightenment_annual',
} as const;
```

#### Entitlements (verified Dec 29)
| Entitlement | Products Attached |
|-------------|-------------------|
| novice_path | manifest_novice_monthly, manifest_novice_yearly |
| awakening_path | manifest_awakening_monthly, manifest_awakening_yearly |
| enlightenment_path | manifest_enlightenment_monthly, manifest_enlightenment_yearly |

---

## Code Flow Analysis

### 1. App Initialization (`App.tsx`)
```
App starts → initializeApp() → configurePurchases() → loadOfferings()
```

### 2. Configure Purchases (`subscriptionService.ts:41-80`)
```typescript
export async function configurePurchases(userId?: string): Promise<void> {
  // Skip in web mode
  if (Platform.OS === 'web') return;

  // ⚠️ BYPASS: Skip in DEV/TestFlight mode
  const isTestFlight = process.env.EXPO_PUBLIC_TESTFLIGHT_FULL_ACCESS === 'true';
  if (__DEV__ || isTestFlight) {
    console.log('[Subscription] DEV/TestFlight mode - skipping RevenueCat configuration');
    return;  // SDK NOT INITIALIZED!
  }

  // Actual initialization...
  Purchases.configure({ apiKey: REVENUECAT_API_KEY_IOS });
}
```

**Issue**: If `TESTFLIGHT_FULL_ACCESS=true`, SDK is never configured!

### 3. Get Offerings (`subscriptionService.ts:123-242`)
```typescript
export async function getOfferings(): Promise<SubscriptionOffering | null> {
  // Web mock
  if (Platform.OS === 'web') { return mockOfferings; }

  try {
    const offerings = await Purchases.getOfferings();  // Fails if SDK not configured

    if (!offerings.current) {
      console.warn('No current offerings available');  // RevenueCat dashboard issue
      return null;
    }

    // Map packages to our structure
    const packages = offerings.current.availablePackages;
    // ... findPackageById() for each tier
  } catch (error) {
    console.error('Failed to get offerings:', error);
    return null;  // Silent failure - no details to UI
  }
}
```

### 4. Load Offerings (`subscriptionStore.ts:190-220`)
```typescript
loadOfferings: async () => {
  set({ isLoadingOfferings: true, error: null });

  try {
    const OFFERINGS_TIMEOUT = 10000;  // 10 second timeout
    const offerings = await Promise.race([
      getOfferings(),
      timeoutPromise,
    ]);

    set({ offerings, isLoadingOfferings: false, error: null });
  } catch (error) {
    set({ offerings: null, isLoadingOfferings: false, error: error.message });
  }
}
```

### 5. PaywallScreen Render (`PaywallScreen.tsx:288-324`)
```typescript
// Error state shown when:
// - isLoadingOfferings = false
// - offerings = null
if (!offerings) {
  return <ErrorView message={offeringsError || 'Please check your internet connection'} />;
}
```

---

## Build Profiles

| Profile | TESTFLIGHT_FULL_ACCESS | RevenueCat | Use For |
|---------|------------------------|------------|---------|
| `testflight` | `true` | **BYPASSED** | Beta testing (features unlocked) |
| `testflight-sandbox` | `false` | **CONNECTED** | Testing real purchases |
| `production` | `false` | Connected | App Store release |

**Build 39 uses `testflight-sandbox`** so RevenueCat should be active.

---

## Debugging Steps

### Step 1: Add Debug Logging
Added to `subscriptionService.ts` - watch for these logs:

```
[RC Debug] 🚀 configurePurchases() called
[RC Debug] ✅ RevenueCat SDK configured
[RC Debug] 🔍 getOfferings() starting...
[RC Debug] Raw offerings response: {...}
[RC Debug] Current offering: {...}
[RC Debug] Available packages: [...]
[RC Debug] ❌ Error: {...}
```

### Step 2: Run Locally
```bash
cd mobile && npx expo run:ios
```

### Step 3: Check Console Output

**Scenario A - SDK Not Configured**
```
[RC Debug] 🚀 configurePurchases() called
[RC Debug] ⏭️ Skipping - DEV/TestFlight mode
```
→ Fix: Remove bypass or use production profile

**Scenario B - No Current Offering**
```
[RC Debug] Raw offerings response: { all: {...}, current: null }
```
→ Fix: Set default offering in RevenueCat dashboard

**Scenario C - Package ID Mismatch**
```
[RC Debug] Available packages: ['monthly', 'yearly']
[RC Debug] Looking for: 'novice_monthly' - NOT FOUND
```
→ Fix: Update package IDs in RevenueCat or code

**Scenario D - Network/Timeout**
```
[RC Debug] ❌ Error: { code: 'NETWORK_ERROR', message: '...' }
```
→ Fix: Check internet, increase timeout

---

## Action Items

- [ ] Run locally with debug logging
- [ ] Check RevenueCat dashboard for "current" offering
- [ ] Verify package IDs match between code and dashboard
- [ ] Fix identified issue
- [ ] Test offerings load successfully
- [ ] Take screenshots for App Store Connect Review Info
- [ ] Submit working build

---

## Session Log

### Dec 29, 2025 - Initial Investigation
- Configured availability for all 6 products in App Store Connect
- Added subscription group localization ("Premium Access")
- Build 39 still fails to load offerings
- Discovered Review Screenshot != Image (Optional) in App Store Connect
- Need to test locally to diagnose actual error

### Next: Add debug logging and run locally

---

## References

- RevenueCat iOS SDK: https://docs.revenuecat.com/docs/ios
- RevenueCat Offerings: https://docs.revenuecat.com/docs/entitlements#offerings
- App Store Connect Subscriptions: https://developer.apple.com/help/app-store-connect/manage-subscriptions/
