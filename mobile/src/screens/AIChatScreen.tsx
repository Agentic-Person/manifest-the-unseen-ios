/**
 * AIChatScreen
 *
 * Main AI monk chat interface
 * Displays conversation history and allows sending messages
 * Ancient mystical design with Deep Void background and gold accents
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAIChat } from '../hooks/useAIChat';
import { MessageBubble } from '../components/chat/MessageBubble';
import { ChatInput } from '../components/chat/ChatInput';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { EmptyChatState } from '../components/chat/EmptyChatState';
import { colors } from '@/theme';
import type { AIMessage } from '../types/aiChat';

export function AIChatScreen() {
  const flatListRef = useRef<FlatList>(null);
  const {
    messages,
    isLoading,
    isSending,
    error,
    sendMessage,
  } = useAIChat();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSend = (message: string) => {
    sendMessage(message);
  };

  const renderMessage = ({ item }: { item: AIMessage }) => (
    <MessageBubble message={item} />
  );

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.brand.gold} />
          <Text style={styles.loadingText}>
            Loading conversation...
          </Text>
        </View>
      );
    }

    return <EmptyChatState />;
  };

  const renderError = () => {
    if (!error) return null;

    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>
          Error
        </Text>
        <Text style={styles.errorMessage}>
          {error instanceof Error ? error.message : 'Something went wrong'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Messages List */}
      <View style={styles.messagesContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => `${item.timestamp}-${index}`}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
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

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isSending} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  messagesContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.secondary,
  },
  errorContainer: {
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    borderColor: 'rgba(220, 38, 38, 0.4)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
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
    paddingHorizontal: 16,
  },
});
