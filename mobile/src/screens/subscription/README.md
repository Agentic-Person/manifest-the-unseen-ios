# Subscription Paywall UI

Complete subscription paywall implementation for Manifest the Unseen, featuring a beautiful 3-tier pricing display with RevenueCat integration.

## Overview

The subscription paywall provides a visually stunning, persuasive interface for users to choose and purchase subscription tiers. It follows the app's mystical design system with dark purple backgrounds, golden accents, and smooth animations.

## Components

### PaywallScreen

Main screen component that orchestrates the entire subscription flow.

**Features:**
- Beautiful gradient background (dark purple)
- 3-tier horizontal scrollable subscription cards
- Monthly/Yearly price toggle with savings display
- Feature comparison table
- Restore Purchases button
- Close button for dismissal
- Loading states during purchase flow
- Error handling with user-friendly alerts

**Usage:**
```typescript
import { PaywallScreen } from '@/screens/subscription';

// Navigate to paywall
navigation.navigate('Paywall', {
  lockedFeature: 'Phase 9: Trust & Surrender',
  onDismiss: () => navigation.goBack(),
});
```

### SubscriptionCard

Individual subscription tier card component.

**Props:**
- `tier`: SubscriptionTier - Which tier (novice, awakening, enlightenment)
- `period`: SubscriptionPeriod - Monthly or yearly
- `packageData`: SubscriptionPackage | null - RevenueCat package data
- `isPopular`: boolean - Show "Most Popular" badge
- `isCurrentTier`: boolean - User's current subscription tier
- `inTrial`: boolean - User currently in trial period
- `onPurchase`: () => void - Purchase callback
- `isPurchasing`: boolean - Loading state

**Features:**
- Displays tier name, description, pricing
- Shows per-month cost for yearly subscriptions
- Lists all features with checkmarks
- "7-Day Free Trial" badge
- "Most Popular" badge for Awakening tier
- Purchase button with loading states
- Golden gradient overlay for popular tier
- Scale animation on press

### PriceToggle

Monthly/Annual toggle switch component.

**Props:**
- `selectedPeriod`: SubscriptionPeriod - Currently selected period
- `onToggle`: (period: SubscriptionPeriod) => void - Toggle callback

**Features:**
- Dual-button toggle interface
- "Save 37%" badge on Annual option
- Golden highlight for selected option
- Smooth transitions

### PurchaseButton

CTA button for subscription purchase with loading states.

**Props:**
- `onPress`: () => void - Purchase callback
- `isLoading`: boolean - Show loading spinner
- `disabled`: boolean - Disable button
- `isCurrentTier`: boolean - User's current plan
- `inTrial`: boolean - Currently in trial
- `label`: string (optional) - Custom button text

**Features:**
- Golden gradient background
- Loading spinner during purchase
- Different states: "Start Free Trial", "Current Plan", "Current Trial"
- Disabled state for current tier
- Press animation

### FeatureComparison

Horizontal scrollable feature comparison table.

**Props:**
- `currentTier`: SubscriptionTier (optional) - User's current tier

**Features:**
- Compares all features across 3 tiers
- Highlights "Most Popular" Awakening tier
- Shows "Current" badge on user's active tier
- Horizontal scroll for mobile optimization
- Golden color scheme for premium feel

### TrialBadge

Displays "7-Day Free Trial" badge.

**Props:**
- `days`: number (optional, default: 7) - Trial duration

### PopularBadge

Displays "★ Most Popular ★" badge on recommended tier.

## Theme & Design

**Colors:**
- Background: Deep Void (#0A0A0F) with purple tint
- Primary accent: Aged Gold (#C4A052)
- Highlight: Amber Glow (#D4A84B)
- Text: Enlightened White (#F5F0E6)
- Cards: Temple Stone (#1A1A24) with gradients

**Typography:**
- Tier names: 24px, bold
- Prices: 42px, extra bold
- Features: 14px, medium
- Legal text: 11px, regular

**Spacing:**
- Card width: 300px
- Card margin: 8px (spacing.sm)
- Content padding: 16px (spacing.lg)
- Popular card scale: 1.05x

## Purchase Flow

1. User opens PaywallScreen
2. Offerings loaded from RevenueCat (via Zustand store)
3. User selects period (Monthly/Yearly)
4. User scrolls through tier cards
5. User taps "Start Free Trial" button
6. Purchase initiated via RevenueCat SDK
7. Loading state shown on button
8. Success/Error alert displayed
9. On success: subscription store updated, user redirected
10. On error: error message shown, user can retry

## Error Handling

**Scenarios handled:**
- RevenueCat not configured (shows warning, no crash)
- Network errors during offerings fetch
- Purchase cancellation by user (silent, no error)
- Purchase errors (user-friendly alert)
- Restore purchases failures
- Missing package data

## Integration

### Add to Navigation

```typescript
// In your navigation stack
import { PaywallScreen } from '@/screens/subscription';

<Stack.Screen
  name="Paywall"
  component={PaywallScreen}
  options={{
    presentation: 'modal',
    headerShown: false,
  }}
/>
```

### Trigger from Gating

```typescript
import { usePhaseAccess } from '@/hooks/useSubscription';

const hasAccess = usePhaseAccess(9);

if (!hasAccess) {
  navigation.navigate('Paywall', {
    lockedFeature: 'Phase 9: Trust & Surrender',
  });
}
```

### Restore Purchases

Users can restore previous purchases from the paywall:

1. Tap "Restore Purchases" button at bottom
2. RevenueCat SDK queries Apple/Google servers
3. Entitlements synced to subscription store
4. Success alert shown
5. User redirected

## Testing

### Test in Development

1. Configure RevenueCat sandbox environment
2. Create test subscriptions in App Store Connect
3. Use sandbox tester account
4. Test all flows: purchase, cancel, restore, trial

### Test Scenarios

- [ ] Purchase Novice monthly
- [ ] Purchase Awakening yearly (most popular)
- [ ] Purchase Enlightenment monthly
- [ ] User cancels purchase (should not show error)
- [ ] Purchase fails (network error)
- [ ] Restore with no purchases
- [ ] Restore with active subscription
- [ ] Close paywall without purchasing
- [ ] Navigate from locked feature

## RevenueCat Configuration

Ensure these are configured in RevenueCat dashboard:

**Entitlements:**
- `novice_path`
- `awakening_path`
- `enlightenment_path`

**Products:**
- `manifest_novice_monthly` ($7.99)
- `manifest_novice_yearly` ($59.99)
- `manifest_awakening_monthly` ($12.99)
- `manifest_awakening_yearly` ($99.99)
- `manifest_enlightenment_monthly` ($19.99)
- `manifest_enlightenment_yearly` ($149.99)

**Offering:**
- Create "current" offering with all 6 packages
- Map packages to correct entitlements

## Legal Compliance

The paywall includes:
- Auto-renewal disclosure
- Payment timing notice
- Terms of Service link (TODO: implement)
- Privacy Policy link (TODO: implement)

## Accessibility

All components include:
- `accessibilityRole` for screen readers
- `accessibilityLabel` for buttons
- `accessibilityState` for toggles
- Sufficient color contrast (WCAG AA)
- Touch targets ≥44x44 points

## Performance

**Optimizations:**
- Memoized subscription package lookups
- Conditional rendering for loading states
- Horizontal scroll with snap points
- Gradient caching via expo-linear-gradient
- Minimal re-renders with Zustand selectors

## Future Enhancements

- [ ] Add analytics tracking (TelemetryDeck)
- [ ] Implement promo code support
- [ ] Add testimonials/reviews section
- [ ] Animate tier transitions
- [ ] Add FAQ accordion
- [ ] Implement Terms/Privacy modals
- [ ] Add A/B testing for copy variations
- [ ] Support for introductory pricing
- [ ] Gift subscription option
