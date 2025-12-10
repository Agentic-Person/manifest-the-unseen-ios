# Subscription Feature Gating - Usage Guide

Complete guide for implementing subscription-based feature gating in the Manifest the Unseen React Native app.

## Overview

The subscription gating system provides:

1. **Utility Functions** (`subscriptionGating.ts`) - Pure functions for checking access and quotas
2. **React Hooks** (`useSubscription.ts`) - React hooks for components
3. **UI Components** (`UpgradePrompt.tsx` and variants) - Pre-built upgrade prompts

## Subscription Tiers

| Tier | Phases | Meditations | Journals/Month | AI Chat/Day | Voice | Vision Board |
|------|--------|-------------|----------------|-------------|-------|--------------|
| Free | 1-2 | 0 | 5 | 3 | No | No |
| Novice | 1-5 | 3 | 50 | 10 | No | No |
| Awakening | 1-8 | 6 | 200 | 50 | Yes | Yes |
| Enlightenment | 1-10 | 18 (all) | Unlimited | Unlimited | Yes | Yes |

## Quick Start

### 1. Check Phase Access

```tsx
import { usePhaseAccess } from '@/hooks/useSubscription';
import { PhaseLockedPrompt } from '@/components';

function PhaseDashboard({ phaseNumber }: { phaseNumber: number }) {
  const hasAccess = usePhaseAccess(phaseNumber);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const tier = useSubscriptionStore((state) => state.tier);

  const handlePhaseClick = () => {
    if (!hasAccess) {
      setShowUpgrade(true);
      return;
    }
    // Navigate to phase
    navigation.navigate('Phase${phaseNumber}Dashboard');
  };

  return (
    <>
      <TouchableOpacity onPress={handlePhaseClick}>
        <Text>Phase {phaseNumber}</Text>
        {!hasAccess && <Text>🔒</Text>}
      </TouchableOpacity>

      <PhaseLockedPrompt
        visible={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        phaseNumber={phaseNumber}
        currentTier={tier}
      />
    </>
  );
}
```

### 2. Check Meditation Access

```tsx
import { useMeditationAccess } from '@/hooks/useSubscription';
import { MeditationLockedPrompt } from '@/components';

function MeditationCard({ meditation, index }: Props) {
  const hasAccess = useMeditationAccess(index);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const tier = useSubscriptionStore((state) => state.tier);

  const handlePlay = () => {
    if (!hasAccess) {
      setShowUpgrade(true);
      return;
    }
    // Play meditation
  };

  return (
    <>
      <TouchableOpacity onPress={handlePlay}>
        <Text>{meditation.title}</Text>
        {!hasAccess && <Text>🔒 Locked</Text>}
      </TouchableOpacity>

      <MeditationLockedPrompt
        visible={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        meditationIndex={index}
        meditationTitle={meditation.title}
        currentTier={tier}
      />
    </>
  );
}
```

### 3. Check Journal Quota

```tsx
import { useJournalQuota } from '@/hooks/useSubscription';
import { QuotaExceededPrompt } from '@/components';

function NewJournalButton() {
  const monthlyCount = 45; // Get from backend/store
  const { hasQuota, limit, remaining } = useJournalQuota(monthlyCount);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const tier = useSubscriptionStore((state) => state.tier);

  const handleNewJournal = () => {
    if (!hasQuota) {
      setShowUpgrade(true);
      return;
    }
    // Create new journal
    navigation.navigate('NewJournalEntry');
  };

  return (
    <>
      <TouchableOpacity onPress={handleNewJournal}>
        <Text>New Journal Entry</Text>
        {!hasQuota && <Text>Limit Reached</Text>}
      </TouchableOpacity>

      {/* Show quota warning when close to limit */}
      {hasQuota && remaining <= 5 && (
        <Text style={styles.warning}>
          {remaining} entries remaining this month
        </Text>
      )}

      <QuotaExceededPrompt
        visible={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        quotaType="journal"
        currentTier={tier}
        currentCount={monthlyCount}
        limit={limit}
      />
    </>
  );
}
```

### 4. Check AI Chat Quota

```tsx
import { useAIChatQuota } from '@/hooks/useSubscription';
import { QuotaExceededPrompt } from '@/components';

function AIChatInput() {
  const todayCount = 8; // Get from backend/store
  const { hasQuota, limit, remaining, isUnlimited } = useAIChatQuota(todayCount);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const tier = useSubscriptionStore((state) => state.tier);

  const handleSendMessage = async (message: string) => {
    if (!hasQuota) {
      setShowUpgrade(true);
      return;
    }
    // Send message to AI
  };

  return (
    <>
      <TextInput
        placeholder={
          hasQuota
            ? 'Ask the AI monk...'
            : 'Daily limit reached'
        }
        editable={hasQuota}
        onSubmitEditing={handleSendMessage}
      />

      {hasQuota && !isUnlimited && (
        <Text>{remaining} messages remaining today</Text>
      )}

      <QuotaExceededPrompt
        visible={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        quotaType="ai_chat"
        currentTier={tier}
        currentCount={todayCount}
        limit={limit}
      />
    </>
  );
}
```

### 5. Check Feature Access (Voice, Vision Board)

```tsx
import { useVoiceTranscriptionAccess, useVisionBoardAccess } from '@/hooks/useSubscription';
import { FeatureLockedPrompt } from '@/components';

function JournalEntryScreen() {
  const hasVoiceAccess = useVoiceTranscriptionAccess();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const tier = useSubscriptionStore((state) => state.tier);

  const handleVoiceRecord = () => {
    if (!hasVoiceAccess) {
      setShowUpgrade(true);
      return;
    }
    // Start voice recording
  };

  return (
    <>
      <TouchableOpacity
        onPress={handleVoiceRecord}
        disabled={!hasVoiceAccess}
      >
        <Text>🎤 Voice Record</Text>
        {!hasVoiceAccess && <Text>🔒</Text>}
      </TouchableOpacity>

      <FeatureLockedPrompt
        visible={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        feature="voice_transcription"
        currentTier={tier}
      />
    </>
  );
}
```

## Pure Utility Functions

When hooks aren't available (outside components), use pure functions:

```tsx
import {
  checkPhaseAccess,
  checkMeditationAccess,
  checkJournalQuota,
  checkAIChatQuota,
  getUpgradeMessage,
  getRequiredTier,
} from '@/utils/subscriptionGating';

// In a service or utility file
function canAccessPhase(tier: SubscriptionTier, phaseNumber: number): boolean {
  return checkPhaseAccess(tier, phaseNumber);
}

// Get upgrade message for custom UI
function getCustomUpgradeMessage(phaseNumber: number, currentTier: SubscriptionTier) {
  const message = getUpgradeMessage('phase', currentTier, { phaseNumber });
  return {
    title: message.title,
    description: message.description,
    tierNeeded: message.requiredTier,
  };
}

// Find minimum tier needed
function findRequiredTier(phaseNumber: number): SubscriptionTier | null {
  return getRequiredTier(`phase_${phaseNumber}`);
}
```

## Component Props Reference

### UpgradePrompt (Base Component)

```tsx
interface UpgradePromptProps {
  visible: boolean;           // Show/hide modal
  onClose: () => void;        // Called when dismissed
  title: string;              // Modal title
  description: string;        // Explanation text
  requiredTier: SubscriptionTier; // Tier needed
  benefits: string[];         // Feature list
  onUpgrade?: () => void;     // Custom upgrade handler (optional)
}
```

### PhaseLockedPrompt

```tsx
interface PhaseLockedPromptProps {
  visible: boolean;
  onClose: () => void;
  phaseNumber: number;        // 1-10
  currentTier: SubscriptionTier;
  onUpgrade?: () => void;
}
```

### MeditationLockedPrompt

```tsx
interface MeditationLockedPromptProps {
  visible: boolean;
  onClose: () => void;
  meditationIndex: number;    // 0-17
  meditationTitle?: string;   // Custom title
  currentTier: SubscriptionTier;
  onUpgrade?: () => void;
}
```

### QuotaExceededPrompt

```tsx
interface QuotaExceededPromptProps {
  visible: boolean;
  onClose: () => void;
  quotaType: 'journal' | 'ai_chat';
  currentTier: SubscriptionTier;
  currentCount: number;       // Current usage
  limit: number;              // Tier limit
  onUpgrade?: () => void;
}
```

### FeatureLockedPrompt

```tsx
interface FeatureLockedPromptProps {
  visible: boolean;
  onClose: () => void;
  feature: FeatureType;       // 'voice_transcription', 'vision_board', etc.
  currentTier: SubscriptionTier;
  customTitle?: string;       // Override default title
  customDescription?: string; // Override default description
  onUpgrade?: () => void;
}
```

## Custom Navigation Handler

By default, prompts navigate to Profile screen. To customize:

```tsx
import { UpgradePrompt } from '@/components';
import { useNavigation } from '@react-navigation/native';

function MyComponent() {
  const navigation = useNavigation();

  const handleUpgrade = () => {
    // Navigate to custom paywall screen
    navigation.navigate('Paywall', {
      selectedTier: 'awakening',
      source: 'phase_6_locked',
    });
  };

  return (
    <UpgradePrompt
      visible={showPrompt}
      onClose={() => setShowPrompt(false)}
      title="Unlock Phase 6"
      description="..."
      requiredTier="awakening"
      benefits={[...]}
      onUpgrade={handleUpgrade}  // Custom handler
    />
  );
}
```

## Best Practices

### 1. Always Show Visual Indicators

```tsx
// Good: Clear locked indicator
<View style={styles.card}>
  <Text>{phase.title}</Text>
  {!hasAccess && (
    <View style={styles.lockedBadge}>
      <Text>🔒 Locked</Text>
    </View>
  )}
</View>

// Bad: No indication until user taps
<TouchableOpacity onPress={handleClick}>
  <Text>{phase.title}</Text>
</TouchableOpacity>
```

### 2. Show Quota Progress

```tsx
// Good: Progressive disclosure
const { hasQuota, remaining, percentUsed } = useJournalQuota(count);

return (
  <>
    {percentUsed >= 80 && hasQuota && (
      <View style={styles.warning}>
        <Text>{remaining} entries remaining</Text>
      </View>
    )}
    {!hasQuota && (
      <View style={styles.error}>
        <Text>Monthly limit reached - Upgrade for more</Text>
      </View>
    )}
  </>
);
```

### 3. Pre-check Before Navigation

```tsx
// Good: Check before navigation
const handlePhaseClick = () => {
  if (!hasAccess) {
    setShowUpgradePrompt(true);
    return; // Don't navigate
  }
  navigation.navigate('PhaseDashboard', { phaseNumber });
};

// Bad: Check after navigation (shows locked screen)
navigation.navigate('PhaseDashboard', { phaseNumber });
// Then check access in PhaseDashboard
```

### 4. Track Upgrade Funnel

```tsx
const handleUpgrade = () => {
  // Track which feature triggered upgrade
  analytics.track('upgrade_prompt_shown', {
    feature: 'phase_6',
    currentTier: tier,
    requiredTier: 'awakening',
  });

  navigation.navigate('Paywall');
};
```

## Error Handling

All utility functions validate inputs and throw errors:

```tsx
try {
  const hasAccess = checkPhaseAccess(tier, phaseNumber);
} catch (error) {
  // Handle invalid phase number (must be 1-10)
  console.error('Invalid phase number:', error);
}

try {
  const quota = checkJournalQuota(tier, -5);
} catch (error) {
  // Throws: "Current count cannot be negative"
  console.error('Invalid count:', error);
}
```

## Testing

### Unit Tests

```tsx
import { checkPhaseAccess, getUpgradeMessage } from '@/utils/subscriptionGating';

describe('subscriptionGating', () => {
  describe('checkPhaseAccess', () => {
    it('free tier can access phases 1-2', () => {
      expect(checkPhaseAccess('free', 1)).toBe(true);
      expect(checkPhaseAccess('free', 2)).toBe(true);
      expect(checkPhaseAccess('free', 3)).toBe(false);
    });

    it('novice tier can access phases 1-5', () => {
      expect(checkPhaseAccess('novice', 5)).toBe(true);
      expect(checkPhaseAccess('novice', 6)).toBe(false);
    });

    it('throws on invalid phase number', () => {
      expect(() => checkPhaseAccess('free', 0)).toThrow();
      expect(() => checkPhaseAccess('free', 11)).toThrow();
    });
  });
});
```

### Component Tests

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { PhaseLockedPrompt } from '@/components';

describe('PhaseLockedPrompt', () => {
  it('shows correct upgrade message for phase 6', () => {
    const { getByText } = render(
      <PhaseLockedPrompt
        visible={true}
        onClose={jest.fn()}
        phaseNumber={6}
        currentTier="novice"
      />
    );

    expect(getByText('Unlock Phase 6')).toBeTruthy();
    expect(getByText(/Awakening Path/)).toBeTruthy();
  });

  it('calls onUpgrade when upgrade button pressed', () => {
    const onUpgrade = jest.fn();
    const { getByText } = render(
      <PhaseLockedPrompt
        visible={true}
        onClose={jest.fn()}
        phaseNumber={6}
        currentTier="novice"
        onUpgrade={onUpgrade}
      />
    );

    fireEvent.press(getByText('Upgrade Now'));
    expect(onUpgrade).toHaveBeenCalled();
  });
});
```

## Troubleshooting

### Prompt Not Showing

```tsx
// Check that visible state is managed correctly
const [showPrompt, setShowPrompt] = useState(false);

// Make sure to set to true when needed
if (!hasAccess) {
  setShowPrompt(true);  // ✅ Correct
}

// Don't forget onClose handler
<PhaseLockedPrompt
  visible={showPrompt}
  onClose={() => setShowPrompt(false)}  // ✅ Important
  ...
/>
```

### Navigation Not Working

```tsx
// Ensure navigation is available
import { useNavigation } from '@react-navigation/native';

function MyComponent() {
  const navigation = useNavigation();  // ✅ Must be in component

  // Use navigation in onUpgrade
  const handleUpgrade = () => {
    navigation.navigate('Profile');
  };

  return <UpgradePrompt onUpgrade={handleUpgrade} ... />;
}
```

### Wrong Tier Calculated

```tsx
// Make sure subscription store is initialized
import { useInitializeSubscription } from '@/hooks/useSubscription';

function App() {
  useInitializeSubscription();  // ✅ Call in root component
  // ...
}
```

## Future Enhancements

Planned improvements:

1. **Analytics Integration** - Track upgrade funnel conversion
2. **A/B Testing** - Test different messaging and CTAs
3. **Localization** - Multi-language support for prompts
4. **Promo Codes** - Special offers in upgrade prompts
5. **Trial Extensions** - Offer trial extensions for engaged users

## Support

For questions or issues:
- Check existing subscription hooks in `@/hooks/useSubscription.ts`
- Review subscription types in `@/types/subscription.ts`
- See RevenueCat integration in `@/services/subscriptionService.ts`
