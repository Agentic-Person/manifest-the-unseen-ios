/**
 * GuruScreen
 *
 * Main screen for the Guru feature - phase-based analysis conversations.
 * Premium feature exclusive to Enlightenment tier.
 *
 * State machine:
 * - locked: Show GuruLockedScreen
 * - selecting: Show PhaseSelector (or GuruEmptyState if no completed phases)
 * - loading: Show loading indicator
 * - conversation: Show chat interface
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGuru } from '../hooks/useGuru';
import { MessageBubble } from '../components/chat/MessageBubble';
import { ChatInput } from '../components/chat/ChatInput';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { PhaseSelector } from '../components/guru/PhaseSelector';
import { GuruEmptyState } from '../components/guru/GuruEmptyState';
import GuruLockedScreen from './GuruLockedScreen';
import { colors, spacing, shadows } from '../theme';
import type { GuruMessage } from '../types/guru';
import { UpgradePrompt } from '../components/UpgradePrompt';
import { TIER_PRICING } from '../types/subscription';

export function GuruScreen() {
  const flatListRef = useRef<FlatList>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const {
    hasAccess,
    completedPhases,
    isLoadingPhases,
    selectedPhase,
    messages,
    isLoading,
    isSending,
    error,
    selectPhase,
    clearSelectedPhase,
    sendMessage,
    // Quota info
    dailyQuota,
    messagesUsedToday,
    hasQuotaRemaining,
    isUnlimited,
    subscriptionTier,
  } = useGuru();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // Handle phase selection
  const handleSelectPhase = (phaseNumber: number) => {
    selectPhase(phaseNumber);
  };

  // Handle back from conversation
  const handleBack = () => {
    clearSelectedPhase();
  };

  // Handle send message
  const handleSend = async (message: string) => {
    // Check quota before sending
    if (!hasQuotaRemaining) {
      setShowUpgradePrompt(true);
      return;
    }

    try {
      await sendMessage(message);
    } catch (err) {
      // If quota exceeded error, show upgrade prompt
      if (err instanceof Error && err.message.includes('limit reached')) {
        setShowUpgradePrompt(true);
      }
    }
  };

  // Get recommended upgrade tier
  const getRecommendedTier = (): 'novice' | 'awakening' | 'enlightenment' => {
    if (subscriptionTier === 'free') return 'novice';
    if (subscriptionTier === 'novice') return 'awakening';
    return 'enlightenment';
  };

  // STATE: Locked (no access)
  if (!hasAccess) {
    return <GuruLockedScreen />;
  }

  // STATE: Loading phases
  if (isLoadingPhases) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Guru</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.brand.gold} />
          <Text style={styles.loadingText}>Loading your phases...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // STATE: Selecting phase (no phase selected)
  if (!selectedPhase) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Guru</Text>
        </View>

        {completedPhases.length === 0 ? (
          // No completed phases - show empty state
          <GuruEmptyState />
        ) : (
          // Show phase selector
          <View style={styles.selectorContainer}>
            <PhaseSelector
              completedPhases={completedPhases}
              onSelectPhase={handleSelectPhase}
            />

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={24} color={colors.brand.amber} />
              <Text style={styles.infoText}>
                Select a completed phase to receive personalized insights based on
                your unique journey and responses.
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // STATE: Conversation (phase selected)
  const renderMessage = ({ item }: { item: GuruMessage }) => (
    <MessageBubble message={item} />
  );

  const renderError = () => {
    if (!error) return null;

    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorMessage}>
          {error instanceof Error ? error.message : 'Something went wrong'}
        </Text>
      </View>
    );
  };

  const renderEmptyConversation = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.brand.gold} />
          <Text style={styles.loadingText}>Analyzing your phase...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyConversationContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="bulb-outline" size={48} color={colors.dark.accentGold} />
        </View>
        <Text style={styles.emptyTitle}>Phase {selectedPhase} Analysis</Text>
        <Text style={styles.emptyDescription}>
          Ask me anything about your journey through this phase. I'll provide
          personalized insights based on your responses.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with Back Button */}
      <View style={styles.conversationHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Back to phase selection"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Phase {selectedPhase} Guru</Text>
          <Text style={styles.headerSubtitle}>Personalized Analysis</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Messages List */}
      <View style={styles.messagesContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => `${item.timestamp}-${index}`}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyConversation}
          ListHeaderComponent={renderError}
          onContentSizeChange={() => {
            if (messages.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: false });
            }
          }}
        />

        {/* Typing Indicator */}
        {isSending && (
          <View style={styles.typingContainer}>
            <TypingIndicator />
          </View>
        )}
      </View>

      {/* Quota indicator */}
      {!isUnlimited && (
        <View style={styles.quotaIndicator}>
          <Text style={[
            styles.quotaText,
            !hasQuotaRemaining && styles.quotaTextWarning,
          ]}>
            {hasQuotaRemaining
              ? `${dailyQuota - messagesUsedToday} messages remaining today`
              : `Daily limit reached (${dailyQuota}/day)`}
          </Text>
        </View>
      )}

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isSending || !hasQuotaRemaining} />

      {/* Upgrade Prompt Modal */}
      <UpgradePrompt
        visible={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        title="Daily Message Limit Reached"
        description={`You've used all ${dailyQuota} daily messages. Upgrade to get more messages per day.`}
        requiredTier={getRecommendedTier()}
        benefits={TIER_PRICING[getRecommendedTier()].features}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.text.secondary,
  },
  selectorContainer: {
    flex: 1,
    paddingTop: spacing.lg,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.background.elevated,
    borderWidth: 1,
    borderColor: colors.border.gold,
    borderRadius: 12,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.xl,
    ...shadows.sm,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  messagesContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    flexGrow: 1,
  },
  errorContainer: {
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    borderColor: 'rgba(220, 38, 38, 0.4)',
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorTitle: {
    fontWeight: '600',
    marginBottom: 4,
    color: colors.error[300],
  },
  errorMessage: {
    fontSize: 14,
    color: colors.error[200],
  },
  typingContainer: {
    paddingHorizontal: spacing.md,
  },
  emptyConversationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIconContainer: {
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  quotaIndicator: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.background.elevated,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  quotaText: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  quotaTextWarning: {
    color: colors.error[400],
    fontWeight: '600',
  },
});

export default GuruScreen;
