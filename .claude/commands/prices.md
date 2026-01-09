---
description: Guide for changing subscription prices (App Store Connect + RevenueCat + Landing Page)
---
# Subscription Price Change Guide

## How Pricing Works

Prices are managed in **App Store Connect** and sync automatically to RevenueCat.
The mobile app fetches prices dynamically - but the **landing page has hardcoded prices**.

## Price Change Checklist

### Step 1: App Store Connect (Required)
1. Go to [App Store Connect](https://appstoreconnect.apple.com) → Apps → Manifest the Unseen
2. Click **Subscriptions** in sidebar
3. Select the subscription group → specific product
4. Scroll to **Subscription Prices** → Click **+**
5. Choose **"Plan Subscription Price Change"**
6. Select countries/regions and new price
7. Set start date (minimum 1-2 days ahead)
8. **Important Decision**: Choose how to handle existing subscribers:
   - **Preserve current price** (grandfathering) - recommended
   - **Apply to all** - requires consent for large increases

### Step 2: RevenueCat (Automatic)
- Prices sync automatically from App Store Connect
- Verify in RevenueCat dashboard after ~24 hours
- No manual changes needed if V2 notifications are configured

### Step 3: Mobile App (Not Required)
The PaywallScreen uses dynamic pricing from RevenueCat:
- `offerings.novice_monthly?.pricePerMonth`
- `offerings.awakening_monthly?.pricePerMonth`
- `offerings.enlightenment_monthly?.pricePerMonth`

**No mobile app code changes needed!**

### Step 4: Landing Page (REQUIRED)
**File:** `web/components/Pricing.tsx`

Update the `tiers` array (lines 16-58):
```typescript
const tiers = [
  {
    name: 'Seeker',
    monthlyPrice: 7.99,    // <-- UPDATE THIS
    yearlyPrice: 79.99,    // <-- UPDATE THIS
    // ...
  },
  {
    name: 'Awakening',
    monthlyPrice: 19.99,   // <-- UPDATE THIS
    yearlyPrice: 199.99,   // <-- UPDATE THIS
    // ...
  },
  {
    name: 'Enlightenment',
    monthlyPrice: 49.99,   // <-- UPDATE THIS
    yearlyPrice: 499.99,   // <-- UPDATE THIS
    // ...
  },
]
```

After updating, redeploy the landing page.

### Step 5: Documentation (Optional)
Update these files if you want docs to reflect new prices:
- `docs/features/subscriptions/revenuecat-quick-reference.md`
- `docs/planning/manifest-the-unseen-summary.md`

## Current Product IDs

| Tier | Monthly | Annual |
|------|---------|--------|
| Novice/Seeker | `manifest_novice_monthly` | `manifest_novice_yearly` |
| Awakening | `manifest_awakening_monthly` | `manifest_awakening_yearly` |
| Enlightenment | `manifest_enlightenment_monthly` | `manifest_enlightenment_yearly` |

## Quick Reference - Files to Update

| Location | File | Action |
|----------|------|--------|
| App Store Connect | Dashboard | Change actual prices (source of truth) |
| Landing Page | `web/components/Pricing.tsx` | Update `tiers` array (lines 16-58) |
| Mobile App | N/A | Prices load dynamically |
| Docs | `docs/features/subscriptions/` | Optional updates |

## Timeline

| Event | Timeline |
|-------|----------|
| Schedule change in App Store Connect | 1-2 days before effective date |
| Sandbox propagation | Up to 1 hour |
| Production propagation | Up to 24 hours |
| Existing subscriber notification | 27-60 days before renewal |

## Important Notes

- **Consent Required** for increases >50% AND >$5/period in certain regions
- **Price decreases** apply to ALL subscribers automatically (cannot grandfather)
- **Test in Sandbox** first - allow 1 hour for metadata changes
- **RevenueCat V2 notifications** must be enabled for accurate revenue tracking
- **Landing page must be manually updated** - it doesn't fetch prices dynamically

$ARGUMENTS
