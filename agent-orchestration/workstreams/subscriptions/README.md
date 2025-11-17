# Subscriptions Workstream

**Status**: Not Started
**Timeline**: Weeks 21-22 (Phase 4)
**Priority**: P0 - Required for Monetization

---

## Overview

The subscription system enables monetization via three-tier Zen Buddhist-themed subscriptions (Novice, Awakening, Enlightenment) with a 7-day free trial. Features include paywall UI, RevenueCat integration, feature gating at UI and database levels, and upgrade prompts.

## Timeline

- **Planning**: Weeks 19-20
- **Implementation**: Weeks 21-22
- **Testing**: Weeks 22-23
- **Ongoing**: Conversion optimization

## Key Agents Involved

- **Primary**: Subscriptions Specialist (RevenueCat, paywall)
- **Support**: Backend Specialist (webhooks, tier sync), Frontend Specialist (UI)
- **Review**: Security Auditor (payment security), Code Review Agent

## Key Tasks

1. **StoreKit 2 Configuration** (Subscriptions Specialist)
   - Configure products in App Store Connect
   - 3 tiers × 2 billing periods = 6 products
   - 7-day free trial
   - Test in sandbox

2. **RevenueCat Setup** (Subscriptions Specialist)
   - Create account
   - Configure products and entitlements
   - Set up webhooks
   - Test purchase flow

3. **RevenueCat Integration** (Subscriptions Specialist)
   - Install SDK
   - Configure with API key
   - Fetch offerings
   - Purchase flow
   - Restore purchases
   - Check entitlements

4. **Paywall UI** (Frontend Specialist + Subscriptions Specialist)
   - Tier comparison screen
   - Feature list per tier
   - Monthly vs annual toggle
   - Annual savings badges
   - "Most Popular" badge
   - Terms/privacy links
   - Restore purchases button

5. **Feature Gating** (Subscriptions Specialist + Backend Specialist)
   - Client-side entitlement checks
   - Database RLS with tier checks
   - Workbook phase gating
   - Meditation gating
   - Journal entry limits
   - AI chat limits
   - Vision board limits

6. **Subscription Sync** (Backend Specialist)
   - RevenueCat webhook handler (Edge Function)
   - Update users.subscription_tier
   - Handle expiry, refunds, billing issues

7. **Upgrade Prompts** (Frontend Specialist)
   - Show when hitting limits
   - Phase locked prompts
   - Journal limit prompts
   - AI limit prompts
   - Meditation locked prompts

8. **Family Sharing** (Subscriptions Specialist)
   - Enable in App Store Connect
   - Test family sharing flow

## Dependencies

**Blocks**:
- All tier-gated features

**Blocked By**:
- Authentication
- All features must be implemented to gate them
- Apple Developer account

## Success Metrics

- Trial→Paid conversion > 25%
- Purchase flow < 30 seconds
- Entitlements update immediately
- Restore purchases works
- Tier limits enforced correctly
- Paywall attractive and clear

## Testing Checklist

- [ ] Can purchase all 6 products in sandbox
- [ ] 7-day trial works correctly
- [ ] Entitlements update immediately
- [ ] Feature gating works (all features)
- [ ] Restore purchases restores entitlements
- [ ] Upgrade flow works
- [ ] Downgrade flow works
- [ ] Family Sharing works
- [ ] Subscription status syncs to Supabase
- [ ] Webhooks process correctly

## Technical Details

**Subscription Tiers**:

| Tier | Price | Phases | Meditations | Journal | AI Chat | Vision Boards |
|------|-------|--------|-------------|---------|---------|---------------|
| 🌱 Novice | $7.99/mo<br>$59.99/yr | 1-5 | 3 (female) | 50/mo | 30/day | 1 |
| 🧘 Awakening | $12.99/mo<br>$99.99/yr | 1-8 | 6 (both) | 200/mo | 100/day | 3 |
| ✨ Enlightenment | $19.99/mo<br>$149.99/yr | 1-10 | All | Unlimited | Unlimited | Unlimited |

**Free Trial**:
- 7 days
- Full Enlightenment access
- Requires payment method
- Auto-renews unless cancelled

**RevenueCat Entitlements**:
- `novice`
- `awakening`
- `enlightenment`

**Feature Gating Pattern**:
```typescript
function useSubscriptionTier() {
  const { data: customerInfo } = useQuery({
    queryKey: ['customer-info'],
    queryFn: () => Purchases.getCustomerInfo(),
  });

  const tier = useMemo(() => {
    if (!customerInfo) return 'none';
    if (customerInfo.entitlements.active['enlightenment']) return 'enlightenment';
    if (customerInfo.entitlements.active['awakening']) return 'awakening';
    if (customerInfo.entitlements.active['novice']) return 'novice';
    return 'none';
  }, [customerInfo]);

  return { tier };
}
```

**Database Sync**:
```sql
-- Supabase Edge Function receives webhook
-- Updates user's subscription_tier
UPDATE users
SET subscription_tier = 'awakening',
    subscription_status = 'active',
    subscription_expires_at = '2025-12-01'
WHERE id = user_id;
```

## Resources

- **PRD**: Section 9 - Monetization Strategy
- **TDD**: Section 6 - Subscription Management
- **RevenueCat Docs**: https://docs.revenuecat.com
- **App Store Guidelines**: https://developer.apple.com/app-store/review/guidelines/

## Current Status

**Not Started**

## Notes

(Add notes on conversion optimization, paywall A/B tests)
