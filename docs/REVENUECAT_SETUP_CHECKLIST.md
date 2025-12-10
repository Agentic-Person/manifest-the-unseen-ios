# RevenueCat Setup Checklist

Complete step-by-step guide to set up RevenueCat for Manifest the Unseen iOS app.

---

## ✅ Checklist Overview

- [ ] **Step 1:** Create RevenueCat Dashboard account and iOS app configuration
- [ ] **Step 2:** Add RevenueCat API key to mobile/.env file
- [ ] **Step 3:** Configure 3 entitlements in RevenueCat dashboard
- [ ] **Step 4:** Create 6 products in RevenueCat dashboard with pricing and trials
- [ ] **Step 5:** Initialize RevenueCat in App.tsx with configurePurchases()
- [ ] **Step 6:** Build and test with EAS development build on iPhone

---

## Step 1: Create RevenueCat Dashboard Account and iOS App Configuration

### 1.1: Sign Up for RevenueCat

1. Go to **[https://app.revenuecat.com/](https://app.revenuecat.com/)**
2. Click **"Sign Up"**
3. Create account (free up to $10K MRR)
4. Verify your email

### 1.2: Create New Project

1. After login, click **"Create New Project"**
2. **Project Name:** `Manifest the Unseen`
3. Click **"Create"**

### 1.3: Add iOS App

1. In your project, click **"Add App"**
2. Select **Platform:** iOS
3. **Bundle ID:** Check your `mobile/app.json` for your bundle ID
   ```json
   {
     "expo": {
       "ios": {
         "bundleIdentifier": "com.yourcompany.manifesttheunseen"
       }
     }
   }
   ```
4. **App Name:** Manifest the Unseen
5. Click **"Save"**

### 1.4: Get API Keys

1. Navigate to **Settings → API Keys** (left sidebar)
2. Copy your **iOS Public SDK Key**
   - Starts with `appl_` (production) or `test_` (sandbox)
3. **SAVE THIS KEY** - you'll need it in Step 2

> 📝 **Note:** Keep this tab open, you'll need to come back to configure products and entitlements.

**Status:** ☐ Complete

---

## Step 2: Add RevenueCat API Key to mobile/.env File

### 2.1: Update .env File

Your `.env` file has been prepared with the correct format. Now add your API key:

1. Open `mobile/.env` in your editor
2. Find this line:
   ```env
   EXPO_PUBLIC_REVENUECAT_IOS_KEY=paste_your_ios_key_here
   ```
3. Replace `paste_your_ios_key_here` with your **iOS API key** from Step 1.4

**Example:**
```env
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_AbCdEfGhIjKlMnOpQrStUvWxYz123456
```

### 2.2: Verify Environment Variable

The subscription service is already configured to read this variable:
- Location: `mobile/src/services/subscriptionService.ts`
- Variable: `process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY`

**Status:** ☐ Complete

---

## Step 3: Configure 3 Entitlements in RevenueCat Dashboard

### What are Entitlements?

Entitlements represent the **access level** a user has, regardless of which product they purchased. This allows you to change products without changing your app code.

### 3.1: Create Novice Path Entitlement

1. In RevenueCat Dashboard, go to **"Entitlements"** (left sidebar)
2. Click **"+ New Entitlement"**
3. **Entitlement Identifier:** `novice_path`
   - ⚠️ **MUST MATCH EXACTLY** - this is hardcoded in your app
4. **Display Name:** `Novice Path`
5. **Description:** `Access to Phases 1-5, 3 meditations, 50 journals/month`
6. Click **"Save"**

### 3.2: Create Awakening Path Entitlement

1. Click **"+ New Entitlement"** again
2. **Entitlement Identifier:** `awakening_path`
3. **Display Name:** `Awakening Path`
4. **Description:** `Access to Phases 1-8, 6 meditations, 200 journals/month`
5. Click **"Save"**

### 3.3: Create Enlightenment Path Entitlement

1. Click **"+ New Entitlement"** again
2. **Entitlement Identifier:** `enlightenment_path`
3. **Display Name:** `Enlightenment Path`
4. **Description:** `All 10 phases, 18 meditations, unlimited journals`
5. Click **"Save"**

### ✅ Verify Entitlements

You should now see 3 entitlements:
- ✓ `novice_path`
- ✓ `awakening_path`
- ✓ `enlightenment_path`

**Status:** ☐ Complete

---

## Step 4: Create 6 Products in RevenueCat Dashboard

### Prerequisites

Before creating products in RevenueCat, you need to create them in **App Store Connect** first.

### 4.1: Create Products in App Store Connect

1. Go to **[App Store Connect](https://appstoreconnect.apple.com/)**
2. Select your app
3. Go to **"In-App Purchases"** section
4. Create these **6 auto-renewable subscription products:**

#### Product 1: Novice Monthly
- **Product ID:** `manifest_novice_monthly`
- **Reference Name:** Novice Path Monthly
- **Type:** Auto-Renewable Subscription
- **Subscription Group:** `manifest_subscriptions` (create if new)
- **Duration:** 1 month
- **Price:** $7.99 USD
- **Free Trial:** 7 days
- **Localized Name:** "Novice Path"
- **Localized Description:** "Begin your journey with Phases 1-5, 3 meditations, and 50 journal entries per month."

#### Product 2: Novice Yearly
- **Product ID:** `manifest_novice_yearly`
- **Reference Name:** Novice Path Yearly
- **Type:** Auto-Renewable Subscription
- **Subscription Group:** `manifest_subscriptions`
- **Duration:** 1 year
- **Price:** $59.99 USD (saves 37%)
- **Free Trial:** 7 days
- **Localized Name:** "Novice Path (Annual)"
- **Localized Description:** "Annual access to Phases 1-5, 3 meditations, and 50 journal entries per month."

#### Product 3: Awakening Monthly ⭐ Most Popular
- **Product ID:** `manifest_awakening_monthly`
- **Reference Name:** Awakening Path Monthly
- **Type:** Auto-Renewable Subscription
- **Subscription Group:** `manifest_subscriptions`
- **Duration:** 1 month
- **Price:** $12.99 USD
- **Free Trial:** 7 days
- **Localized Name:** "Awakening Path"
- **Localized Description:** "Accelerate your growth with Phases 1-8, 6 meditations, and 200 journal entries per month."

#### Product 4: Awakening Yearly
- **Product ID:** `manifest_awakening_yearly`
- **Reference Name:** Awakening Path Yearly
- **Type:** Auto-Renewable Subscription
- **Subscription Group:** `manifest_subscriptions`
- **Duration:** 1 year
- **Price:** $99.99 USD (saves 36%)
- **Free Trial:** 7 days
- **Localized Name:** "Awakening Path (Annual)"
- **Localized Description:** "Annual access to Phases 1-8, 6 meditations, and 200 journal entries per month."

#### Product 5: Enlightenment Monthly
- **Product ID:** `manifest_enlightenment_monthly`
- **Reference Name:** Enlightenment Path Monthly
- **Type:** Auto-Renewable Subscription
- **Subscription Group:** `manifest_subscriptions`
- **Duration:** 1 month
- **Price:** $19.99 USD
- **Free Trial:** 7 days
- **Localized Name:** "Enlightenment Path"
- **Localized Description:** "Complete access to all 10 phases, 18 meditations, and unlimited journal entries."

#### Product 6: Enlightenment Yearly
- **Product ID:** `manifest_enlightenment_yearly`
- **Reference Name:** Enlightenment Path Yearly
- **Type:** Auto-Renewable Subscription
- **Subscription Group:** `manifest_subscriptions`
- **Duration:** 1 year
- **Price:** $149.99 USD (saves 37%)
- **Free Trial:** 7 days
- **Localized Name:** "Enlightenment Path (Annual)"
- **Localized Description:** "Annual complete access to all 10 phases, 18 meditations, and unlimited journal entries."

> ⚠️ **Important:** Products need to be submitted for review in App Store Connect, but you can test them with sandbox accounts before approval.

### 4.2: Connect App Store Connect to RevenueCat

1. In RevenueCat Dashboard, go to **"App Store Connect Integration"**
2. Follow the instructions to generate an API key:
   - Go to App Store Connect → **Users and Access** → **Keys** → **In-App Purchase**
   - Click **"+"** to generate a new key
   - Download the `.p8` file
   - Upload to RevenueCat
3. Wait 5-10 minutes for sync

### 4.3: Import Products to RevenueCat

1. In RevenueCat Dashboard, go to **"Products"** (left sidebar)
2. Click **"Import from App Store Connect"**
3. Select all 6 products
4. Click **"Import"**

### 4.4: Map Products to Entitlements

For each product, you need to attach it to the correct entitlement:

1. Click on **`manifest_novice_monthly`**
2. Under **"Entitlements"**, select **`novice_path`**
3. Click **"Save"**

Repeat for all products:
- `manifest_novice_monthly` → `novice_path`
- `manifest_novice_yearly` → `novice_path`
- `manifest_awakening_monthly` → `awakening_path`
- `manifest_awakening_yearly` → `awakening_path`
- `manifest_enlightenment_monthly` → `enlightenment_path`
- `manifest_enlightenment_yearly` → `enlightenment_path`

### 4.5: Create "Current" Offering

1. Go to **"Offerings"** (left sidebar)
2. Click **"+ New Offering"**
3. **Offering Identifier:** `current`
   - ⚠️ **MUST be named "current"** - RevenueCat SDK looks for this by default
4. **Display Name:** `Standard Offering`
5. **Description:** `Default subscription offering`
6. Click **"Create"**

### 4.6: Add Packages to Offering

1. In the `current` offering, click **"+ Add Package"**
2. Add all 6 products as separate packages
3. Organize them by tier:
   - **Package:** `novice_monthly` → Product: `manifest_novice_monthly`
   - **Package:** `novice_yearly` → Product: `manifest_novice_yearly`
   - **Package:** `awakening_monthly` → Product: `manifest_awakening_monthly`
   - **Package:** `awakening_yearly` → Product: `manifest_awakening_yearly`
   - **Package:** `enlightenment_monthly` → Product: `manifest_enlightenment_monthly`
   - **Package:** `enlightenment_yearly` → Product: `manifest_enlightenment_yearly`

### 4.7: Set as Default Offering

1. Make sure `current` offering is set as **"Default"**
2. This ensures the SDK fetches it automatically

### ✅ Verify Product Configuration

You should now have:
- ✓ 6 products imported from App Store Connect
- ✓ Each product mapped to correct entitlement
- ✓ "current" offering created with all 6 packages
- ✓ Offering set as default

**Status:** ☐ Complete

---

## Step 5: Initialize RevenueCat in App.tsx

Now we'll add RevenueCat initialization to your app's startup sequence.

### 5.1: Update App.tsx

Open `mobile/App.tsx` and make the following changes:

```typescript
/**
 * App Root Component
 *
 * Main entry point for the Manifest the Unseen iOS app.
 * Sets up providers for navigation, state management, and server state.
 */

import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

// Import services and navigation
import { queryClient } from './src/services/queryClient';
import { RootNavigator } from './src/navigation/RootNavigator';
import { configurePurchases } from './src/services/subscriptionService'; // ADD THIS

// Import stores for initialization
import { useAppStore } from './src/stores/appStore';
import { useSubscriptionStore } from './src/stores/subscriptionStore'; // ADD THIS

/**
 * App Component
 */
const App = () => {
  const setAppReady = useAppStore((state) => state.setAppReady);
  const initializeSubscription = useSubscriptionStore(
    (state) => state.initialize
  ); // ADD THIS

  /**
   * Initialize App
   */
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing Manifest the Unseen...');

        // 1. Initialize RevenueCat SDK
        await configurePurchases();
        console.log('✅ RevenueCat initialized');

        // 2. Load subscription state
        await initializeSubscription();
        console.log('✅ Subscription state loaded');

        // TODO: Add any other initialization logic here
        // - Load cached data
        // - Check for updates
        // - Initialize analytics
        // - Request permissions

        // Mark app as ready
        setAppReady(true);
        console.log('✅ App ready');
      } catch (error) {
        console.error('❌ App initialization error:', error);
        // Still mark as ready to show error screen
        setAppReady(true);
      }
    };

    initializeApp();
  }, [setAppReady, initializeSubscription]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <RootNavigator />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
```

### 5.2: What This Does

- **Line 15:** Imports `configurePurchases()` from your subscription service
- **Line 19:** Imports `useSubscriptionStore` to initialize subscription state
- **Lines 38-44:** Initializes RevenueCat SDK and loads subscription state on app startup
- Logs show clear status messages in console

**Status:** ☐ Complete

---

## Step 6: Build and Test with EAS Development Build on iPhone

### 6.1: Prerequisites

Make sure you have:
- [ ] Xcode installed (for iOS development)
- [ ] EAS CLI installed: `npm install -g eas-cli`
- [ ] EAS account set up: `eas login`
- [ ] iOS device or simulator ready

### 6.2: Configure EAS Build

Check if `eas.json` exists in your `mobile/` directory:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

### 6.3: Create Development Build

Run from the `mobile/` directory:

```bash
# Navigate to mobile directory
cd mobile

# Create development build for iOS simulator
eas build --profile development --platform ios

# OR for physical device
eas build --profile development --platform ios --local
```

### 6.4: Install Build on Device

After build completes:

**For Simulator:**
1. Download the `.tar.gz` file
2. Extract and drag to simulator

**For Physical Device:**
1. Download the build from EAS
2. Install via TestFlight or direct install

### 6.5: Start Development Server

```bash
# From mobile/ directory
npx expo start --dev-client
```

### 6.6: Test RevenueCat Integration

1. **Check Logs:** Look for these messages in console:
   ```
   🚀 Initializing Manifest the Unseen...
   ✅ RevenueCat initialized
   ✅ Subscription state loaded
   ✅ App ready
   ```

2. **Navigate to Paywall:**
   - Open the app
   - Go to Settings or any premium feature
   - Paywall should appear

3. **Test Offerings:**
   - Check that all 6 subscription options display
   - Verify pricing is correct
   - Verify "7-Day Free Trial" badge shows

4. **Test Purchase (Sandbox):**
   - Create sandbox tester in App Store Connect
   - Sign out of App Store on device
   - Attempt a purchase
   - Sign in with sandbox account
   - Complete purchase
   - Verify entitlement is granted

### 6.7: Verify Subscription Status

After purchase:
- Check subscription tier updates in app
- Go to Settings → Subscription Status
- Verify trial period shows correctly
- Test feature gating (locked features should unlock)

### 6.8: Test Restore Purchases

1. Delete and reinstall app
2. Tap "Restore Purchases"
3. Verify subscription is restored
4. Check that entitlements are active

**Status:** ☐ Complete

---

## 🎉 Completion Checklist

Review all steps:

- [ ] ✅ RevenueCat account created
- [ ] ✅ iOS app configured in RevenueCat
- [ ] ✅ API key added to `.env` file
- [ ] ✅ 3 entitlements created: `novice_path`, `awakening_path`, `enlightenment_path`
- [ ] ✅ 6 products created in App Store Connect
- [ ] ✅ Products imported to RevenueCat
- [ ] ✅ Products mapped to entitlements
- [ ] ✅ "current" offering created
- [ ] ✅ RevenueCat initialized in App.tsx
- [ ] ✅ Development build created
- [ ] ✅ Tested on iPhone
- [ ] ✅ Purchase flow working
- [ ] ✅ Restore purchases working

---

## Troubleshooting

### Issue: "No offerings available"

**Cause:** RevenueCat can't fetch offerings
**Solution:**
1. Check API key in `.env` is correct
2. Verify "current" offering exists in dashboard
3. Ensure products are added to offering
4. Wait a few minutes for changes to propagate

### Issue: "Purchase failed"

**Cause:** Not signed in with sandbox account
**Solution:**
1. Sign out of App Store on device
2. Don't sign in until prompted during purchase
3. Use sandbox tester credentials, not real Apple ID

### Issue: "Product not found"

**Cause:** Product IDs don't match
**Solution:**
1. Verify App Store Connect product IDs match exactly:
   - `manifest_novice_monthly`
   - `manifest_novice_yearly`
   - etc.
2. Check `mobile/src/types/subscription.ts` for correct IDs

### Issue: "Entitlement not granted after purchase"

**Cause:** Product not mapped to entitlement
**Solution:**
1. Go to RevenueCat → Products
2. Click each product
3. Verify entitlement is attached
4. Save and wait a few minutes

---

## Next Steps After Setup

1. **Create Paywall Design** in RevenueCat Dashboard
2. **Set up Analytics** to track conversion rates
3. **Configure Webhooks** for backend sync
4. **Test all subscription flows** thoroughly
5. **Submit products for App Store review**
6. **Create TestFlight build** for beta testing
7. **Plan promotional offers** and discounts

---

## Resources

- **RevenueCat Dashboard:** [https://app.revenuecat.com/](https://app.revenuecat.com/)
- **App Store Connect:** [https://appstoreconnect.apple.com/](https://appstoreconnect.apple.com/)
- **RevenueCat Docs:** [https://docs.revenuecat.com/](https://docs.revenuecat.com/)
- **EAS Build Docs:** [https://docs.expo.dev/build/introduction/](https://docs.expo.dev/build/introduction/)

---

**Setup Date:** December 8, 2025
