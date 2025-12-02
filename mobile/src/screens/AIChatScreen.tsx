/**
 * AIChatScreen
 *
 * Main AI monk chat interface
 * Displays conversation history and allows sending messages
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  SafeAreaView,
} from 'react-native';
import { useAIChat } from '../hooks/useAIChat';
import { MessageBubble } from '../components/chat/MessageBubble';
import { ChatInput } from '../components/chat/ChatInput';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { EmptyChatState } from '../components/chat/EmptyChatState';
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
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#9333EA" />
          <Text className="text-gray-400 mt-4">
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
      <View className="bg-red-900/20 border border-red-800 rounded-lg p-4 mx-4 mb-4">
        <Text className="text-red-200 font-semibold mb-1">
          Error
        </Text>
        <Text className="text-red-300 text-sm">
          {error instanceof Error ? error.message : 'Something went wrong'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1a1a2e]">
      {/* Messages List */}
      <View className="flex-1">
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => `${item.timestamp}-${index}`}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 8,
            flexGrow: 1,
          }}
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
          <View className="px-4">
            <TypingIndicator />
          </View>
        )}
      </View>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isSending} />
    </SafeAreaView>
  );
}
