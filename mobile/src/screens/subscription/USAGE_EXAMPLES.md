# Subscription Paywall - Usage Examples

This document provides practical examples of how to use the subscription paywall UI throughout the app.

## Basic Navigation

### Navigate to Paywall

```typescript
import { useNavigation } from '@react-navigation/native';

function MyComponent() {
  const navigation = useNavigation();

  const showPaywall = () => {
    navigation.navigate('Paywall');
  };

  return (
    <Button onPress={showPaywall} title="Subscribe" />
  );
}
```

## Gating Features

### Phase Access Gating

```typescript
import { usePhaseAccess } from '@/hooks/useSubscription';
import { useNavigation } from '@react-navigation/native';

function Phase9Screen() {
  const navigation = useNavigation();
  const hasAccess = usePhaseAccess(9);

  useEffect(() => {
    if (!hasAccess) {
      // Redirect to paywall with context
      navigation.replace('Paywall', {
        lockedFeature: 'Phase 9: Trust & Surrender',
        onDismiss: () => navigation.navigate('Workbook'),
      });
    }
  }, [hasAccess]);

  if (!hasAccess) {
    return null; // Or loading indicator
  }

  return (
    <View>
      {/* Phase 9 content */}
    </View>
  );
}
```

### Meditation Access Gating

```typescript
import { useMeditationAccess } from '@/hooks/useSubscription';

function MeditationCard({ meditation, index }) {
  const navigation = useNavigation();
  const hasAccess = useMeditationAccess(index);

  const handlePress = () => {
    if (!hasAccess) {
      navigation.navigate('Paywall', {
        lockedFeature: 'Premium Meditations',
      });
      return;
    }

    // Play meditation
    navigation.navigate('MeditationPlayer', { meditation });
  };

  return (
    <Pressable onPress={handlePress}>
      {!hasAccess && <Text>🔒 Premium</Text>}
      <Text>{meditation.title}</Text>
    </Pressable>
  );
}
```

### Journal Quota Gating

```typescript
import { useJournalQuota } from '@/hooks/useSubscription';

function NewJournalButton() {
  const navigation = useNavigation();
  const [journalsThisMonth, setJournalsThisMonth] = useState(45);
  const { hasQuota, limit, remaining } = useJournalQuota(journalsThisMonth);

  const handleCreateJournal = () => {
    if (!hasQuota) {
      Alert.alert(
        'Journal Limit Reached',
        `You've reached your limit of ${limit} journal entries this month. Upgrade to continue journaling.`,
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

    // Create journal entry
    navigation.navigate('NewJournalEntry');
  };

  return (
    <View>
      <Button onPress={handleCreateJournal} title="New Journal Entry" />
      {!hasQuota && (
        <Text style={{ color: 'red' }}>
          {remaining} / {limit} entries remaining this month
        </Text>
      )}
    </View>
  );
}
```

### AI Chat Quota Gating

```typescript
import { useAIChatQuota } from '@/hooks/useSubscription';

function AIChatInput() {
  const navigation = useNavigation();
  const [messagesToday, setMessagesToday] = useState(8);
  const { hasQuota, limit, remaining, isUnlimited } = useAIChatQuota(messagesToday);

  const handleSendMessage = (message: string) => {
    if (!hasQuota) {
      Alert.alert(
        'Daily Limit Reached',
        `You've used all ${limit} AI chat messages for today. Upgrade for unlimited access.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Upgrade',
            onPress: () => navigation.navigate('Paywall', {
              lockedFeature: 'Unlimited AI Chat',
            }),
          },
        ]
      );
      return;
    }

    // Send message
    sendAIMessage(message);
    setMessagesToday(prev => prev + 1);
  };

  return (
    <View>
      <TextInput onSubmitEditing={(e) => handleSendMessage(e.nativeEvent.text)} />
      {!isUnlimited && (
        <Text>
          {remaining} / {limit} messages remaining today
        </Text>
      )}
    </View>
  );
}
```

## Showing Current Subscription

### Profile Screen Subscription Info

```typescript
import { useSubscriptionSummary } from '@/hooks/useSubscription';
import { useNavigation } from '@react-navigation/native';

function ProfileScreen() {
  const navigation = useNavigation();
  const summary = useSubscriptionSummary();

  return (
    <View>
      <Text>Current Plan: {summary.tierName}</Text>
      <Text>Status: {summary.statusLabel}</Text>

      {summary.isInTrial && (
        <Text>Trial ends: {new Date(summary.trialEndDate).toLocaleDateString()}</Text>
      )}

      {summary.period && (
        <Text>Billing: {summary.periodLabel}</Text>
      )}

      <Button
        title={summary.tier === 'free' ? 'Subscribe Now' : 'Manage Subscription'}
        onPress={() => navigation.navigate('Paywall')}
      />
    </View>
  );
}
```

## Feature-Specific Paywalls

### Voice Transcription Gating

```typescript
import { useVoiceTranscriptionAccess } from '@/hooks/useSubscription';

function JournalEntryScreen() {
  const navigation = useNavigation();
  const hasVoiceTranscription = useVoiceTranscriptionAccess();

  const handleVoiceRecording = () => {
    if (!hasVoiceTranscription) {
      Alert.alert(
        'Premium Feature',
        'Voice transcription is available with Awakening Path or higher.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Learn More',
            onPress: () => navigation.navigate('Paywall', {
              lockedFeature: 'Voice Transcription',
            }),
          },
        ]
      );
      return;
    }

    // Start voice recording
    startVoiceRecording();
  };

  return (
    <View>
      <Button
        onPress={handleVoiceRecording}
        title={hasVoiceTranscription ? 'Record Voice' : '🔒 Record Voice (Premium)'}
      />
    </View>
  );
}
```

### Vision Board Gating

```typescript
import { useVisionBoardAccess } from '@/hooks/useSubscription';

function VisionBoardScreen() {
  const navigation = useNavigation();
  const hasVisionBoard = useVisionBoardAccess();

  useEffect(() => {
    if (!hasVisionBoard) {
      Alert.alert(
        'Vision Board',
        'Create inspiring vision boards with Awakening Path or higher.',
        [
          { text: 'Go Back', onPress: () => navigation.goBack() },
          {
            text: 'Upgrade',
            onPress: () => navigation.replace('Paywall', {
              lockedFeature: 'Vision Board Creation',
              onDismiss: () => navigation.navigate('Workbook'),
            }),
          },
        ]
      );
    }
  }, [hasVisionBoard]);

  if (!hasVisionBoard) {
    return null;
  }

  return (
    <View>
      {/* Vision board UI */}
    </View>
  );
}
```

## Upgrade Prompts

### Smart Upgrade Recommendations

```typescript
import { useUpgradeTierRecommendation } from '@/hooks/useSubscription';

function LockedFeaturePrompt({ feature }: { feature: string }) {
  const navigation = useNavigation();
  const recommendedTier = useUpgradeTierRecommendation(feature);

  if (!recommendedTier) {
    return null; // Already at highest tier
  }

  const tierNames = {
    novice: 'Novice Path',
    awakening: 'Awakening Path',
    enlightenment: 'Enlightenment Path',
  };

  return (
    <View style={styles.upgradePrompt}>
      <Text>This feature requires {tierNames[recommendedTier]}</Text>
      <Button
        title="Upgrade Now"
        onPress={() => navigation.navigate('Paywall', {
          lockedFeature: feature,
        })}
      />
    </View>
  );
}
```

## Testing the Paywall

### Mock Offerings for Development

```typescript
// In development, you can test the UI without RevenueCat

function TestPaywallScreen() {
  // This would normally come from RevenueCat
  const mockOfferings = {
    novice: {
      monthly: {
        id: 'test_novice_monthly',
        tier: 'novice',
        period: 'monthly',
        price: '$7.99',
        pricePerMonth: '$7.99',
        currencyCode: 'USD',
        title: 'Novice Path',
        description: 'Monthly subscription',
        rcPackage: null,
      },
      yearly: {
        id: 'test_novice_yearly',
        tier: 'novice',
        period: 'yearly',
        price: '$59.99',
        pricePerMonth: '$5.00/mo',
        currencyCode: 'USD',
        title: 'Novice Path',
        description: 'Annual subscription',
        rcPackage: null,
      },
    },
    // ... other tiers
  };

  return <PaywallScreen offerings={mockOfferings} />;
}
```

## Handling Edge Cases

### Network Errors

The paywall handles network errors gracefully:

```typescript
// When offerings fail to load
// PaywallScreen shows loading state indefinitely
// User can close and retry later

// When purchase fails
// User-friendly alert shown
// User can retry purchase
```

### User Cancellation

```typescript
// When user cancels purchase flow
// No error shown (silent)
// Paywall remains open
// User can try different tier or close
```

### Already Subscribed

```typescript
// When user already has active subscription
// Their tier card shows "Current Plan"
// Button disabled
// Other tiers still purchasable (upgrade/downgrade)
```

### Trial Already Used

```typescript
// RevenueCat handles trial eligibility automatically
// If user already used trial, they see regular price
// No changes needed in UI code
```

## Analytics Integration

### Track Paywall Views

```typescript
import { useEffect } from 'react';
import { trackEvent } from '@/services/analytics';

function PaywallScreen() {
  useEffect(() => {
    trackEvent('paywall_viewed', {
      source: route.params?.lockedFeature || 'unknown',
      currentTier: currentTier,
    });
  }, []);

  // ... rest of component
}
```

### Track Purchase Attempts

```typescript
const handlePurchase = async (tier: SubscriptionTier) => {
  trackEvent('purchase_attempted', { tier, period: selectedPeriod });

  const result = await purchasePackage(packageData);

  if (result.success) {
    trackEvent('purchase_completed', {
      tier,
      period: selectedPeriod,
      revenue: packageData.price,
    });
  } else if (!result.userCancelled) {
    trackEvent('purchase_failed', {
      tier,
      period: selectedPeriod,
      error: result.error?.message,
    });
  } else {
    trackEvent('purchase_cancelled', { tier, period: selectedPeriod });
  }
};
```

## Customization

### Custom Locked Feature Messages

```typescript
navigation.navigate('Paywall', {
  lockedFeature: 'Phase 9: Trust & Surrender',
  // Or more descriptive:
  lockedFeature: 'Advanced manifestation techniques in Phase 9',
});
```

### Custom Dismiss Behavior

```typescript
navigation.navigate('Paywall', {
  onDismiss: () => {
    // Custom logic on close
    navigation.navigate('Home');
    showWelcomeMessage();
  },
});
```

### Prevent Dismissal (Force Upgrade)

```typescript
// Remove close button by modifying PaywallScreen
// Only allow navigation after purchase
// Use case: Trial expired, force upgrade to continue
```

## Best Practices

1. **Always provide context**: Tell users WHY they're seeing the paywall
2. **Show value**: Highlight the feature they're trying to access
3. **Non-intrusive**: Don't force paywall on every app open
4. **Clear CTAs**: "Start Free Trial" is more effective than "Subscribe"
5. **Handle errors gracefully**: Network issues, cancellations, etc.
6. **Test thoroughly**: Use sandbox environment before production
7. **Track conversions**: Measure which triggers convert best
8. **Update offerings**: Keep tier features in sync with actual app capabilities
