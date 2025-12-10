# Subscription Paywall - Quick Integration Guide

This guide shows you how to add the subscription paywall to your navigation and start using it in your app.

## Step 1: Add to Navigation Stack

Add the PaywallScreen to your navigation configuration.

### Option A: Modal Presentation (Recommended)

```typescript
// In your navigation/AppNavigator.tsx or similar file

import { PaywallScreen } from '@/screens/subscription';

// Add to your stack navigator
<Stack.Navigator>
  {/* ... other screens ... */}

  <Stack.Screen
    name="Paywall"
    component={PaywallScreen}
    options={{
      presentation: 'modal',
      headerShown: false,
      animation: 'slide_from_bottom',
    }}
  />
</Stack.Navigator>
```

### Option B: Regular Screen

```typescript
<Stack.Screen
  name="Paywall"
  component={PaywallScreen}
  options={{
    headerShown: false,
    title: 'Choose Your Path',
  }}
/>
```

## Step 2: Add TypeScript Type

Add the Paywall screen to your navigation types.

```typescript
// In mobile/src/types/navigation.ts

export type RootStackParamList = {
  // ... other screens ...

  Paywall: {
    lockedFeature?: string;
    onDismiss?: () => void;
  } | undefined;
};
```

## Step 3: Navigate to Paywall

### Basic Navigation

```typescript
import { useNavigation } from '@react-navigation/native';

function MyComponent() {
  const navigation = useNavigation();

  const showPaywall = () => {
    navigation.navigate('Paywall');
  };

  return <Button onPress={showPaywall} title="Subscribe" />;
}
```

### With Context

```typescript
const showPaywall = () => {
  navigation.navigate('Paywall', {
    lockedFeature: 'Phase 9: Trust & Surrender',
    onDismiss: () => navigation.navigate('Home'),
  });
};
```

## Step 4: Add Feature Gating

Use subscription hooks to gate premium features.

### Example: Phase Gating

```typescript
import { usePhaseAccess } from '@/hooks/useSubscription';

function Phase9Screen() {
  const navigation = useNavigation();
  const hasAccess = usePhaseAccess(9);

  useEffect(() => {
    if (!hasAccess) {
      navigation.replace('Paywall', {
        lockedFeature: 'Phase 9: Trust & Surrender',
        onDismiss: () => navigation.navigate('Workbook'),
      });
    }
  }, [hasAccess]);

  if (!hasAccess) return null;

  return <View>{/* Phase 9 content */}</View>;
}
```

### Example: Journal Quota

```typescript
import { useJournalQuota } from '@/hooks/useSubscription';

function NewJournalButton({ journalsThisMonth }) {
  const navigation = useNavigation();
  const { hasQuota, limit, remaining } = useJournalQuota(journalsThisMonth);

  const handlePress = () => {
    if (!hasQuota) {
      Alert.alert(
        'Limit Reached',
        `You've used ${limit} journal entries. Upgrade for more.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Upgrade',
            onPress: () => navigation.navigate('Paywall', {
              lockedFeature: 'Unlimited Journals',
            }),
          },
        ]
      );
      return;
    }

    navigation.navigate('NewJournalEntry');
  };

  return (
    <Button onPress={handlePress} title="New Journal Entry" />
  );
}
```

## Step 5: Configure RevenueCat

Before the paywall will work, configure RevenueCat.

### 5.1: Add API Keys

Add your RevenueCat API keys to `.env`:

```env
EXPO_PUBLIC_REVENUECAT_IOS_KEY=your_ios_key_here
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=your_android_key_here
```

### 5.2: Initialize RevenueCat

In your `App.tsx` or root component:

```typescript
import { configurePurchases } from '@/services/subscriptionService';
import { useInitializeSubscription } from '@/hooks/useSubscription';

function App() {
  useEffect(() => {
    // Initialize RevenueCat
    configurePurchases();
  }, []);

  // Load subscription state
  useInitializeSubscription();

  return <AppContent />;
}
```

### 5.3: Create Products in App Store Connect

1. Go to App Store Connect
2. Navigate to your app > In-App Purchases
3. Create 6 products:
   - `manifest_novice_monthly` - $7.99/month
   - `manifest_novice_yearly` - $59.99/year
   - `manifest_awakening_monthly` - $12.99/month
   - `manifest_awakening_yearly` - $99.99/year
   - `manifest_enlightenment_monthly` - $19.99/month
   - `manifest_enlightenment_yearly` - $149.99/year
4. Enable 7-day free trial on all products

### 5.4: Configure RevenueCat Dashboard

1. Go to RevenueCat dashboard
2. Create project (if not exists)
3. Add your app
4. Create 3 entitlements:
   - `novice_path`
   - `awakening_path`
   - `enlightenment_path`
5. Create "current" offering
6. Add all 6 products to offering
7. Map products to entitlements

## Step 6: Test Purchase Flow

### 6.1: Create Sandbox Tester

1. Go to App Store Connect > Users and Access
2. Create sandbox tester account
3. Sign out of App Store on device
4. Sign in with sandbox account when prompted during purchase

### 6.2: Test Scenarios

- [ ] Purchase Novice monthly subscription
- [ ] Purchase Awakening yearly subscription
- [ ] Purchase Enlightenment subscription
- [ ] Cancel purchase (should not show error)
- [ ] Restore purchases with no purchases
- [ ] Restore purchases with active subscription
- [ ] Trial countdown shows correctly
- [ ] Subscription gates features properly
- [ ] Upgrade from lower tier
- [ ] Downgrade from higher tier

## Step 7: Add to Profile Screen (Optional)

Show current subscription in user profile:

```typescript
import { useSubscriptionSummary } from '@/hooks/useSubscription';

function ProfileScreen() {
  const navigation = useNavigation();
  const summary = useSubscriptionSummary();

  return (
    <View>
      <Text>Plan: {summary.tierName}</Text>
      <Text>Status: {summary.statusLabel}</Text>

      {summary.isInTrial && (
        <Text>Trial ends: {new Date(summary.trialEndDate).toLocaleDateString()}</Text>
      )}

      <Button
        title={summary.tier === 'free' ? 'Subscribe' : 'Manage Subscription'}
        onPress={() => navigation.navigate('Paywall')}
      />
    </View>
  );
}
```

## Step 8: Add Analytics (Optional)

Track paywall performance:

```typescript
// In PaywallScreen.tsx

import { trackEvent } from '@/services/analytics';

// Track view
useEffect(() => {
  trackEvent('paywall_viewed', {
    source: route.params?.lockedFeature || 'menu',
    currentTier,
  });
}, []);

// Track purchase
const handlePurchase = async (tier) => {
  trackEvent('purchase_attempted', { tier, period: selectedPeriod });

  const result = await purchasePackage(pkg);

  if (result.success) {
    trackEvent('purchase_completed', { tier, period: selectedPeriod });
  }
};
```

## Common Issues & Solutions

### Issue: "Offerings not available"
**Solution:** Check that RevenueCat API key is configured and "current" offering exists in dashboard.

### Issue: "Purchase failed immediately"
**Solution:** Ensure you're signed in with sandbox tester account, not your real Apple ID.

### Issue: "Trial badge not showing"
**Solution:** Free trial is configured in App Store Connect product settings, not RevenueCat.

### Issue: "Current tier not highlighting"
**Solution:** Ensure subscription store is initialized and customer info is loaded.

### Issue: "Restore purchases finds nothing"
**Solution:** Make a purchase first with the sandbox account, then test restore.

## Production Checklist

Before releasing to production:

- [ ] RevenueCat production API keys configured
- [ ] All products submitted and approved in App Store Connect
- [ ] Free trial configured (7 days)
- [ ] Entitlements mapped correctly in RevenueCat
- [ ] "current" offering published in RevenueCat
- [ ] Subscription terms & privacy policy accessible
- [ ] Analytics tracking implemented
- [ ] Error handling tested
- [ ] Tested on multiple device sizes
- [ ] Tested with slow network
- [ ] Tested restore purchases flow
- [ ] Tested upgrade/downgrade flows
- [ ] Legal text reviewed by lawyer
- [ ] Auto-renewal disclosure present
- [ ] Sandbox testing completed
- [ ] TestFlight beta tested

## Need Help?

1. Check README.md for detailed component documentation
2. Review USAGE_EXAMPLES.md for code patterns
3. Use ComponentShowcase.tsx to preview UI
4. Check RevenueCat documentation: https://docs.revenuecat.com
5. Review subscription types: `mobile/src/types/subscription.ts`
6. Check subscription hooks: `mobile/src/hooks/useSubscription.ts`

## Quick Reference

**Import Paths:**
```typescript
import { PaywallScreen } from '@/screens/subscription';
import { usePhaseAccess, useJournalQuota } from '@/hooks/useSubscription';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
```

**Navigation:**
```typescript
navigation.navigate('Paywall', { lockedFeature: 'Feature Name' });
```

**Check Access:**
```typescript
const hasAccess = usePhaseAccess(phaseNumber);
```

**Get Current Tier:**
```typescript
const tier = useSubscriptionStore((state) => state.tier);
```

That's it! You're ready to start monetizing your app.
