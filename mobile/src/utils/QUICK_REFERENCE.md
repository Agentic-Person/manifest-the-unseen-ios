# Subscription Gating - Quick Reference Card

## Import Components

```typescript
import {
  PhaseLockedPrompt,
  MeditationLockedPrompt,
  QuotaExceededPrompt,
  FeatureLockedPrompt,
} from '@/components';
```

## Import Hooks

```typescript
import {
  usePhaseAccess,
  useMeditationAccess,
  useJournalQuota,
  useAIChatQuota,
  useVoiceTranscriptionAccess,
  useVisionBoardAccess,
} from '@/hooks/useSubscription';
```

## Import Utilities

```typescript
import {
  checkPhaseAccess,
  checkMeditationAccess,
  checkJournalQuota,
  checkAIChatQuota,
  getUpgradeMessage,
  getRequiredTier,
} from '@/utils/subscriptionGating';
```

## Common Patterns

### Pattern 1: Lock Phase

```tsx
function Phase6Dashboard() {
  const hasAccess = usePhaseAccess(6);
  const [showPrompt, setShowPrompt] = useState(false);
  const tier = useSubscriptionStore((state) => state.tier);

  useEffect(() => {
    if (!hasAccess) setShowPrompt(true);
  }, [hasAccess]);

  return (
    <>
      {hasAccess && <View>{/* Phase content */}</View>}
      <PhaseLockedPrompt
        visible={showPrompt}
        onClose={() => navigation.goBack()}
        phaseNumber={6}
        currentTier={tier}
      />
    </>
  );
}
```

### Pattern 2: Lock Meditation

```tsx
function MeditationCard({ meditation, index }) {
  const hasAccess = useMeditationAccess(index);
  const [showPrompt, setShowPrompt] = useState(false);
  const tier = useSubscriptionStore((state) => state.tier);

  const handlePlay = () => {
    if (!hasAccess) {
      setShowPrompt(true);
      return;
    }
    navigation.navigate('MeditationPlayer', { meditationId: meditation.id });
  };

  return (
    <>
      <TouchableOpacity onPress={handlePlay}>
        <Text>{meditation.title}</Text>
        {!hasAccess && <Text>🔒</Text>}
      </TouchableOpacity>
      <MeditationLockedPrompt
        visible={showPrompt}
        onClose={() => setShowPrompt(false)}
        meditationIndex={index}
        meditationTitle={meditation.title}
        currentTier={tier}
      />
    </>
  );
}
```

### Pattern 3: Check Journal Quota

```tsx
function NewJournalButton({ monthlyCount }) {
  const { hasQuota, remaining } = useJournalQuota(monthlyCount);
  const [showPrompt, setShowPrompt] = useState(false);
  const tier = useSubscriptionStore((state) => state.tier);

  const handleCreate = () => {
    if (!hasQuota) {
      setShowPrompt(true);
      return;
    }
    navigation.navigate('NewJournalEntry');
  };

  return (
    <>
      <TouchableOpacity onPress={handleCreate}>
        <Text>New Journal</Text>
        {remaining <= 5 && <Text>{remaining} left</Text>}
      </TouchableOpacity>
      <QuotaExceededPrompt
        visible={showPrompt}
        onClose={() => setShowPrompt(false)}
        quotaType="journal"
        currentTier={tier}
        currentCount={monthlyCount}
        limit={hasQuota ? remaining + monthlyCount : monthlyCount}
      />
    </>
  );
}
```

### Pattern 4: Check AI Chat Quota

```tsx
function ChatInput({ todayCount }) {
  const { hasQuota } = useAIChatQuota(todayCount);
  const [showPrompt, setShowPrompt] = useState(false);
  const tier = useSubscriptionStore((state) => state.tier);

  const handleSend = (message) => {
    if (!hasQuota) {
      setShowPrompt(true);
      return;
    }
    sendMessage(message);
  };

  return (
    <>
      <TextInput
        onSubmitEditing={handleSend}
        editable={hasQuota}
        placeholder={hasQuota ? 'Message...' : 'Limit reached'}
      />
      <QuotaExceededPrompt
        visible={showPrompt}
        onClose={() => setShowPrompt(false)}
        quotaType="ai_chat"
        currentTier={tier}
        currentCount={todayCount}
        limit={todayCount} // Will be calculated inside
      />
    </>
  );
}
```

### Pattern 5: Lock Feature

```tsx
function VoiceRecordButton() {
  const hasAccess = useVoiceTranscriptionAccess();
  const [showPrompt, setShowPrompt] = useState(false);
  const tier = useSubscriptionStore((state) => state.tier);

  const handleRecord = () => {
    if (!hasAccess) {
      setShowPrompt(true);
      return;
    }
    startRecording();
  };

  return (
    <>
      <TouchableOpacity onPress={handleRecord}>
        <Text>🎤 {hasAccess ? 'Record' : '🔒 Locked'}</Text>
      </TouchableOpacity>
      <FeatureLockedPrompt
        visible={showPrompt}
        onClose={() => setShowPrompt(false)}
        feature="voice_transcription"
        currentTier={tier}
      />
    </>
  );
}
```

## Tier Limits Reference

| Tier | Phases | Meditations | Journals/mo | AI/day | Voice | Board |
|------|--------|-------------|-------------|--------|-------|-------|
| Free | 1-2 | 0 | 5 | 3 | No | No |
| Novice | 1-5 | 3 | 50 | 10 | No | No |
| Awakening | 1-8 | 6 | 200 | 50 | Yes | Yes |
| Enlightenment | 1-10 | 18 | ∞ | ∞ | Yes | Yes |

## Feature Type Values

```typescript
type FeatureType =
  | 'phase'                  // Use with phaseNumber context
  | 'meditation'             // Use with meditationIndex context
  | 'journal_quota'          // For journal limit messages
  | 'ai_chat_quota'          // For AI chat limit messages
  | 'voice_transcription'    // For voice feature
  | 'vision_board'           // For vision board feature
  | 'unlimited_journals'     // For unlimited journal upsell
  | 'unlimited_ai_chat';     // For unlimited chat upsell
```

## Utility Functions

```typescript
// Check access (returns boolean)
checkPhaseAccess('novice', 6)           // false
checkMeditationAccess('awakening', 5)   // true

// Check quota (returns QuotaCheckResult)
checkJournalQuota('free', 4)
// { hasQuota: true, limit: 5, remaining: 1, isUnlimited: false, percentUsed: 80 }

checkAIChatQuota('enlightenment', 100)
// { hasQuota: true, limit: -1, remaining: -1, isUnlimited: true, percentUsed: 0 }

// Get upgrade message
getUpgradeMessage('phase', 'novice', { phaseNumber: 6 })
// { title: 'Unlock Phase 6', description: '...', requiredTier: 'awakening', benefits: [...] }

// Get required tier
getRequiredTier('phase_9')        // 'enlightenment'
getRequiredTier('meditation_2')   // 'novice'
getRequiredTier('vision_board')   // 'awakening'
```

## Styling Guide

Use these colors for consistency:

```typescript
const colors = {
  primary: '#9333EA',      // Purple (tier badges, buttons)
  gold: '#C9A227',         // Gold (CTA buttons)
  background: '#0F0A1A',   // Dark background
  card: '#1F1B2E',         // Card background
  text: '#FFFFFF',         // White text
  textMuted: '#9CA3AF',    // Gray text
  error: '#EF4444',        // Red (quota exceeded)
  success: '#10B981',      // Green (enabled features)
  warning: '#F59E0B',      // Orange (quota warning)
};
```

## Error Handling

All functions throw on invalid input:

```typescript
try {
  checkPhaseAccess('free', 11);  // Throws
} catch (error) {
  // "Phase number must be between 1 and 10"
}

try {
  checkJournalQuota('novice', -5);  // Throws
} catch (error) {
  // "Current count cannot be negative"
}
```

## Testing Helpers

```typescript
// Mock subscription tier
const mockTier = (tier: SubscriptionTier) => {
  useSubscriptionStore.setState({ tier });
};

// Mock usage counts
const mockJournalCount = (count: number) => {
  // Set up your journal store mock
};

// Test phase access
describe('Phase access', () => {
  it('blocks phase 6 for novice tier', () => {
    expect(checkPhaseAccess('novice', 6)).toBe(false);
  });
});
```

## Debug Checklist

- [ ] Subscription store initialized?
- [ ] Current tier correct?
- [ ] Usage counts accurate?
- [ ] Navigation available?
- [ ] Prompt visible state managed?
- [ ] onClose handler set?

## Performance Tips

- Use hooks in components (memoized)
- Use utilities in services (pure functions)
- Don't check access in render loops
- Cache usage counts (don't fetch every render)
- Use React.memo for list items with locks

## Common Mistakes

❌ Don't do this:
```tsx
// Checking in every render
{items.map(item => {
  const hasAccess = checkPhaseAccess(tier, item.phase);  // ❌ Every render
  return <Item locked={!hasAccess} />;
})}
```

✅ Do this instead:
```tsx
// Memoize or move to component
const ItemWithAccess = React.memo(({ item }) => {
  const hasAccess = usePhaseAccess(item.phase);  // ✅ Memoized
  return <Item locked={!hasAccess} />;
});

{items.map(item => <ItemWithAccess key={item.id} item={item} />)}
```

## Quick Links

- Full Documentation: `SUBSCRIPTION_GATING_README.md`
- Usage Examples: `subscriptionGating.examples.tsx`
- Implementation Guide: `IMPLEMENTATION_SUMMARY.md`
- Core Utilities: `subscriptionGating.ts`
- Components: `src/components/`
