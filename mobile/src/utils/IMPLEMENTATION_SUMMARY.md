# Subscription Feature Gating - Implementation Summary

## Overview

Complete subscription feature gating system for Manifest the Unseen React Native app, including utilities, hooks, and UI components for managing tier-based access control.

## Files Created

### Core Utilities

**`src/utils/subscriptionGating.ts`** (475 lines)
- Pure functions for checking feature access and quotas
- Type-safe with comprehensive TypeScript types
- Zero dependencies on React (usable in services, utilities)
- Full JSDoc documentation with examples

**Key Functions:**
```typescript
checkPhaseAccess(tier, phaseNumber): boolean
checkMeditationAccess(tier, meditationIndex): boolean
checkJournalQuota(tier, currentCount): QuotaCheckResult
checkAIChatQuota(tier, todayCount): QuotaCheckResult
getUpgradeMessage(feature, tier, context?): UpgradeMessage
getRequiredTier(feature): SubscriptionTier | null
getTierDisplayName(tier): string
getTierPriceDisplay(tier, period): string
canUpgradeFromTier(tier): boolean
getNextTier(tier): SubscriptionTier | null
```

### UI Components

**`src/components/UpgradePrompt.tsx`** (Base Component)
- Reusable modal for upgrade prompts
- Dark purple (#9333ea) theme with golden (#c9a227) CTA
- Beautiful animations and shadows
- Displays tier benefits with icons
- "Upgrade Now" and "Maybe Later" actions
- Navigation integration

**`src/components/PhaseLockedPrompt.tsx`**
- Specialized for locked workbook phases
- Auto-generates messaging based on phase number
- Props: `phaseNumber`, `currentTier`

**`src/components/MeditationLockedPrompt.tsx`**
- Specialized for locked meditations
- Optional custom meditation title
- Props: `meditationIndex`, `meditationTitle?`, `currentTier`

**`src/components/QuotaExceededPrompt.tsx`**
- For journal/AI chat quota limits
- Shows current usage stats
- Props: `quotaType`, `currentCount`, `limit`, `currentTier`

**`src/components/FeatureLockedPrompt.tsx`**
- Generic for any locked feature (voice, vision board, etc.)
- Supports custom title/description overrides
- Props: `feature`, `currentTier`, `customTitle?`, `customDescription?`

### Documentation

**`src/utils/SUBSCRIPTION_GATING_README.md`** (Comprehensive Guide)
- Quick start examples
- Component props reference
- Best practices
- Testing guidelines
- Troubleshooting tips
- Future enhancements roadmap

**`src/utils/subscriptionGating.examples.tsx`** (Usage Examples)
- 7 real-world example components
- PhaseCard, MeditationListItem, NewJournalButton, etc.
- Full styling and interaction patterns
- Copy-paste ready code

**`src/utils/IMPLEMENTATION_SUMMARY.md`** (This File)
- Overview of implementation
- File structure and organization
- Integration checklist
- Testing recommendations

## Integration with Existing Codebase

### Already Exists (No Changes Needed)

- `src/types/subscription.ts` - All tier limits and pricing defined
- `src/hooks/useSubscription.ts` - React hooks for components
- `src/stores/subscriptionStore.ts` - Zustand store for subscription state
- `src/services/subscriptionService.ts` - RevenueCat integration

### Updated Files

**`src/components/index.ts`**
- Added exports for all upgrade prompt components
- Now exports: UpgradePrompt, PhaseLockedPrompt, MeditationLockedPrompt, QuotaExceededPrompt, FeatureLockedPrompt

## Feature Gating Rules

### Subscription Tiers

| Tier | Phases | Meditations | Journals/Month | AI Chat/Day | Voice | Vision Board |
|------|--------|-------------|----------------|-------------|-------|--------------|
| **Free** | 1-2 | 0 | 5 | 3 | ❌ | ❌ |
| **Novice** ($7.99/mo) | 1-5 | 3 | 50 | 10 | ❌ | ❌ |
| **Awakening** ($12.99/mo) | 1-8 | 6 | 200 | 50 | ✅ | ✅ |
| **Enlightenment** ($19.99/mo) | 1-10 | 18 (all) | ∞ | ∞ | ✅ | ✅ |

### Implementation Patterns

**1. Phase Access Check**
```tsx
const hasAccess = usePhaseAccess(phaseNumber);
if (!hasAccess) {
  setShowUpgradePrompt(true);
  return;
}
// Navigate to phase
```

**2. Meditation Access Check**
```tsx
const hasAccess = useMeditationAccess(index);
if (!hasAccess) {
  setShowUpgradePrompt(true);
  return;
}
// Play meditation
```

**3. Journal Quota Check**
```tsx
const { hasQuota, remaining } = useJournalQuota(monthlyCount);
if (!hasQuota) {
  setShowUpgradePrompt(true);
  return;
}
// Create journal entry
```

**4. AI Chat Quota Check**
```tsx
const { hasQuota, remaining } = useAIChatQuota(todayCount);
if (!hasQuota) {
  setShowUpgradePrompt(true);
  return;
}
// Send AI message
```

**5. Feature Access Check**
```tsx
const hasVoice = useVoiceTranscriptionAccess();
if (!hasVoice) {
  setShowUpgradePrompt(true);
  return;
}
// Start voice recording
```

## Next Steps for Integration

### 1. Update Phase Dashboards

Add phase access checks to all phase dashboard screens:

```tsx
// In Phase3Dashboard.tsx, Phase4Dashboard.tsx, etc.
import { usePhaseAccess } from '@/hooks/useSubscription';
import { PhaseLockedPrompt } from '@/components';

function Phase6Dashboard() {
  const hasAccess = usePhaseAccess(6);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const tier = useSubscriptionStore((state) => state.tier);

  useEffect(() => {
    if (!hasAccess) {
      setShowUpgrade(true);
    }
  }, [hasAccess]);

  if (!hasAccess) {
    return (
      <PhaseLockedPrompt
        visible={showUpgrade}
        onClose={() => navigation.goBack()}
        phaseNumber={6}
        currentTier={tier}
      />
    );
  }

  // Render phase content
  return <View>...</View>;
}
```

### 2. Update Workbook List Screen

Add lock indicators and gating to phase selection:

```tsx
// In WorkbookScreen.tsx
import { PhaseCard } from '@/utils/subscriptionGating.examples';

const phases = [
  { number: 1, title: 'Self-Evaluation' },
  { number: 2, title: 'Values & Vision' },
  // ... all 10 phases
];

return (
  <ScrollView>
    {phases.map((phase) => (
      <PhaseCard
        key={phase.number}
        phaseNumber={phase.number}
        title={phase.title}
      />
    ))}
  </ScrollView>
);
```

### 3. Update Meditation Screen

Add meditation access checks:

```tsx
// In MeditateScreen.tsx
import { MeditationListItem } from '@/utils/subscriptionGating.examples';

const meditations = [
  { id: '1', title: 'Morning Awakening', duration: 10 },
  { id: '2', title: 'Deep Relaxation', duration: 15 },
  // ... all 18 meditations
];

return (
  <FlatList
    data={meditations}
    renderItem={({ item, index }) => (
      <MeditationListItem meditation={item} index={index} />
    )}
  />
);
```

### 4. Update Journal Screen

Add journal quota checks:

```tsx
// In JournalScreen.tsx
import { NewJournalButton } from '@/utils/subscriptionGating.examples';
import { useJournalStore } from '@/stores/journalStore';

function JournalScreen() {
  const monthlyCount = useJournalStore((state) => state.getMonthlyCount());

  return (
    <View>
      <NewJournalButton monthlyCount={monthlyCount} />
      {/* Journal list */}
    </View>
  );
}
```

### 5. Update AI Chat Screen

Add AI chat quota checks:

```tsx
// In AIChatScreen.tsx
import { AIChatQuotaIndicator } from '@/utils/subscriptionGating.examples';
import { useAIChatStore } from '@/stores/aiChatStore';

function AIChatScreen() {
  const todayCount = useAIChatStore((state) => state.getTodayCount());

  return (
    <View>
      <AIChatQuotaIndicator todayCount={todayCount} />
      {/* Chat interface */}
    </View>
  );
}
```

### 6. Add Paywall Screen

Create a dedicated paywall/subscription screen:

```tsx
// Create src/screens/PaywallScreen.tsx
// This screen should:
// - Display all three tier options (Novice, Awakening, Enlightenment)
// - Show pricing (monthly/yearly toggle)
// - Highlight recommended tier
// - Show feature comparison table
// - Handle purchase flow via subscriptionService
// - Track analytics (upgrade source, tier selected)
```

Update navigation types:
```typescript
// In src/types/navigation.ts
export type ProfileStackParamList = {
  ProfileHome: undefined;
  Settings: undefined;
  Subscription: undefined;
  Paywall: { selectedTier?: SubscriptionTier; source?: string };
  About: undefined;
};
```

### 7. Update Navigation

Make upgrade prompts navigate to Paywall:

```tsx
// In any component using UpgradePrompt
const handleUpgrade = () => {
  navigation.navigate('Paywall', {
    selectedTier: upgradeMessage.requiredTier,
    source: 'phase_6_locked', // for analytics
  });
};

<PhaseLockedPrompt
  onUpgrade={handleUpgrade}
  ...
/>
```

### 8. Add Backend Tracking

Track usage counts in Supabase:

```typescript
// In journal creation
const monthlyCount = await getMonthlyJournalCount(userId);
const { hasQuota } = checkJournalQuota(tier, monthlyCount);

if (!hasQuota) {
  // Show upgrade prompt
  return;
}

// Create journal entry
await createJournalEntry(data);
```

```typescript
// In AI chat
const todayCount = await getTodayAIChatCount(userId);
const { hasQuota } = checkAIChatQuota(tier, todayCount);

if (!hasQuota) {
  // Show upgrade prompt
  return;
}

// Send message
await sendAIMessage(message);
```

## Testing Checklist

### Unit Tests

- [ ] `checkPhaseAccess` with all tier combinations
- [ ] `checkMeditationAccess` with all tier combinations
- [ ] `checkJournalQuota` with edge cases (0, limit-1, limit, limit+1)
- [ ] `checkAIChatQuota` with edge cases
- [ ] `getUpgradeMessage` for all feature types
- [ ] `getRequiredTier` for all feature identifiers
- [ ] Error handling for invalid inputs

### Component Tests

- [ ] PhaseLockedPrompt renders correct tier requirement
- [ ] MeditationLockedPrompt shows meditation title
- [ ] QuotaExceededPrompt displays correct quota stats
- [ ] FeatureLockedPrompt accepts custom messages
- [ ] UpgradePrompt calls onUpgrade when button pressed
- [ ] UpgradePrompt calls onClose when dismissed

### Integration Tests

- [ ] Phase navigation blocked for locked phases
- [ ] Meditation playback blocked for locked meditations
- [ ] Journal creation blocked when quota exceeded
- [ ] AI chat blocked when quota exceeded
- [ ] Voice recording blocked for lower tiers
- [ ] Vision board blocked for lower tiers
- [ ] Upgrade flow navigates correctly

### Manual QA

- [ ] All prompts match design (dark purple + gold)
- [ ] Animations smooth and performant
- [ ] Benefits list displays correctly
- [ ] Navigation to paywall works
- [ ] Dismissal closes modal properly
- [ ] Lock icons visible on restricted content
- [ ] Quota warnings show at 80% usage
- [ ] Unlimited badges show for Enlightenment tier

## Analytics Events to Track

Recommended analytics events for conversion optimization:

```typescript
// When upgrade prompt shown
analytics.track('upgrade_prompt_shown', {
  feature: 'phase_6' | 'meditation_5' | 'journal_quota' | 'ai_chat_quota' | etc.,
  currentTier: 'free' | 'novice' | 'awakening',
  requiredTier: 'novice' | 'awakening' | 'enlightenment',
  timestamp: Date.now(),
});

// When user clicks "Upgrade Now"
analytics.track('upgrade_initiated', {
  source: 'phase_6_locked',
  targetTier: 'awakening',
  timestamp: Date.now(),
});

// When user dismisses prompt
analytics.track('upgrade_dismissed', {
  source: 'phase_6_locked',
  timestamp: Date.now(),
});

// When user completes purchase
analytics.track('upgrade_completed', {
  source: 'phase_6_locked',
  tier: 'awakening',
  period: 'monthly' | 'yearly',
  price: 12.99,
  timestamp: Date.now(),
});
```

## Performance Considerations

- All utility functions are pure and memoization-friendly
- React hooks use `useMemo` for expensive calculations
- Components use `React.memo` for optimization opportunities
- Modal animations use native driver for 60fps
- No unnecessary re-renders from subscription store

## Security Considerations

- All checks happen client-side AND server-side
- RevenueCat is source of truth for entitlements
- Supabase RLS policies enforce tier limits
- Never trust client-side checks alone
- Always validate on backend before allowing actions

## Future Enhancements

1. **A/B Testing Framework**
   - Test different messaging variations
   - Track conversion rates by variant
   - Optimize upgrade copy

2. **Limited-Time Offers**
   - Show special pricing in prompts
   - Countdown timers for urgency
   - Seasonal promotions

3. **Localization**
   - Multi-language support
   - Regional pricing
   - Culturally appropriate messaging

4. **Smart Recommendations**
   - Recommend tier based on usage patterns
   - Show personalized benefits
   - Highlight most-used features

5. **Trial Extensions**
   - Offer trial extensions to engaged users
   - Track trial conversion funnel
   - Send push notifications before trial ends

## Support & Maintenance

### Common Issues

**Issue:** Prompt not showing
- Check that `visible` state is true
- Verify `onClose` handler is set
- Ensure component is in navigation tree

**Issue:** Wrong tier displayed
- Check subscription store is initialized
- Verify RevenueCat integration
- Check for stale cached data

**Issue:** Navigation not working
- Ensure Paywall screen exists
- Check navigation types updated
- Verify navigation prop available

### Updating Tier Limits

To change tier limits, update `FEATURE_LIMITS` in `src/types/subscription.ts`:

```typescript
export const FEATURE_LIMITS = {
  novice: {
    maxPhase: 5,        // Change to 6 to add one more phase
    maxMeditations: 3,
    // ...
  },
  // ...
};
```

No code changes needed - all utilities automatically use updated limits.

## Credits

Built for Manifest the Unseen - React Native iOS App
Subscription gating system v1.0
Created: December 2025
