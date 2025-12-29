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
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useGuru } from '../hooks/useGuru';
import { MessageBubble } from '../components/chat/MessageBubble';
import { ChatInput } from '../components/chat/ChatInput';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { PhaseSelector } from '../components/guru/PhaseSelector';
import { GuruEmptyState } from '../components/guru/GuruEmptyState';
import GuruLockedScreen from './GuruLockedScreen';
import { useGuruRateLimit, GURU_DAILY_LIMIT } from '../stores/guruRateLimitStore';
import { useEffectiveAccess } from '../hooks/useSubscription';
import { colors, spacing, shadows } from '../theme';
import type { GuruMessage } from '../types/guru';
import type { MainTabScreenProps } from '../types/navigation';

export function GuruScreen() {
  const route = useRoute<MainTabScreenProps<'Guru'>['route']>();
  const navigation = useNavigation<MainTabScreenProps<'Guru'>['navigation']>();
  const flatListRef = useRef<FlatList>(null);
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
  } = useGuru();

  // Get effective access (combines trial + subscription)
  const { effectiveTier, isTrialUser, hasGuruAnalysis } = useEffectiveAccess();

  // Rate limiting for trial users only
  const { canMakeRequest, incrementUsage, getResetTime, loadUsage } = useGuruRateLimit();
  const [showRateLimitModal, setShowRateLimitModal] = useState(false);

  // Rate limit only applies to trial users, paid Awakening+ users have unlimited
  const shouldRateLimit = isTrialUser;
  const hasUnlimitedGuru = !isTrialUser && (effectiveTier === 'awakening' || effectiveTier === 'enlightenment');

  // Load rate limit usage on mount
  useEffect(() => {
    loadUsage();
  }, [loadUsage]);

  // Handle pre-selected phase from navigation params
  useEffect(() => {
    const preSelectedPhase = route.params?.preSelectedPhase;

    // Only auto-select if:
    // 1. User has access
    // 2. Phase is provided in params
    // 3. Phase is completed
    // 4. No phase is currently selected
    if (
      hasAccess &&
      preSelectedPhase &&
      completedPhases.includes(preSelectedPhase) &&
      !selectedPhase
    ) {
      selectPhase(preSelectedPhase);
      // Clear the param after consuming to prevent re-selection on back
      // This fixes the navigation loop bug where backing out would re-trigger auto-selection
      navigation.setParams({ preSelectedPhase: undefined });
    }
  }, [route.params?.preSelectedPhase, hasAccess, completedPhases, selectedPhase, selectPhase, navigation]);

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

  // Handle send message with rate limiting
  const handleSend = async (message: string) => {
    // Check rate limit for trial users only (paid Awakening+ have unlimited)
    if (shouldRateLimit && !canMakeRequest()) {
      setShowRateLimitModal(true);
      return;
    }

    await sendMessage(message);

    // Increment usage after successful send for trial users only
    if (shouldRateLimit) {
      await incrementUsage();
    }
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
  // Filter out system messages as MessageBubble only handles user/assistant
  const displayMessages = messages.filter(
    (msg) => msg.role === 'user' || msg.role === 'assistant'
  );

  const renderMessage = ({ item }: { item: GuruMessage }) => (
    <MessageBubble message={item as { role: 'user' | 'assistant'; content: string; timestamp: string }} />
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
          data={displayMessages}
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

      {/* Input - wrapped with bottom margin for tab bar clearance */}
      <View style={styles.inputWrapper}>
        <ChatInput onSend={handleSend} disabled={isSending} />
      </View>

      {/* Rate Limit Exceeded Modal */}
      <Modal
        visible={showRateLimitModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRateLimitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="time-outline" size={48} color={colors.brand.amber} />
            </View>
            <Text style={styles.modalTitle}>Daily Limit Reached</Text>
            <Text style={styles.modalMessage}>
              You've used your {GURU_DAILY_LIMIT} free Guru analyses for today.
              {'\n\n'}
              Upgrade to Awakening for unlimited Guru access!
            </Text>
            <Text style={styles.modalResetText}>
              Resets in {getResetTime()}
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalSecondaryButton}
                onPress={() => setShowRateLimitModal(false)}
              >
                <Text style={styles.modalSecondaryButtonText}>Close</Text>
              </Pressable>
              <Pressable
                style={styles.modalPrimaryButton}
                onPress={() => {
                  setShowRateLimitModal(false);
                  navigation.navigate('Paywall' as any);
                }}
              >
                <Text style={styles.modalPrimaryButtonText}>Upgrade</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    zIndex: 10,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
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
    paddingBottom: 100,
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
  inputWrapper: {
    marginBottom: 80,
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
  // Rate limit modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.background.elevated,
    borderRadius: 16,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    ...shadows.lg,
  },
  modalIconContainer: {
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalMessage: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  modalResetText: {
    fontSize: 14,
    color: colors.brand.amber,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalSecondaryButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
  },
  modalSecondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  modalPrimaryButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    backgroundColor: colors.brand.gold,
    alignItems: 'center',
  },
  modalPrimaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background.primary,
  },
});

export default GuruScreen;
