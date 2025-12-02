/**
 * useAIChat Hook
 *
 * React Query hook for managing AI chat state
 * Handles conversation loading, message sending, and optimistic updates
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiChatService } from '../services/aiChatService';
import type { AIMessage, AIConversation } from '../types/aiChat';

interface UseAIChatOptions {
  conversationId?: string;
}

export function useAIChat(options: UseAIChatOptions = {}) {
  const { conversationId } = options;
  const queryClient = useQueryClient();
  const [currentConversationId, setCurrentConversationId] = useState<
    string | undefined
  >(conversationId);

  // Query for current conversation
  const {
    data: conversation,
    isLoading: isLoadingConversation,
    error: conversationError,
  } = useQuery({
    queryKey: ['ai-chat', currentConversationId],
    queryFn: () =>
      currentConversationId
        ? aiChatService.getConversation(currentConversationId)
        : Promise.resolve(null),
    enabled: !!currentConversationId,
  });

  // Mutation for sending messages
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await aiChatService.sendMessage(
        currentConversationId,
        message
      );

      // If this was a new conversation, store the ID
      if (!currentConversationId) {
        setCurrentConversationId(response.conversationId);
      }

      return response;
    },
    onMutate: async (message: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['ai-chat', currentConversationId],
      });

      // Snapshot previous value
      const previousConversation = queryClient.getQueryData<AIConversation>([
        'ai-chat',
        currentConversationId,
      ]);

      // Optimistically update with user message
      if (previousConversation) {
        const optimisticMessage: AIMessage = {
          role: 'user',
          content: message,
          timestamp: new Date().toISOString(),
        };

        queryClient.setQueryData<AIConversation>(
          ['ai-chat', currentConversationId],
          {
            ...previousConversation,
            messages: [...previousConversation.messages, optimisticMessage],
          }
        );
      }

      return { previousConversation };
    },
    onError: (err, message, context) => {
      // Rollback on error
      if (context?.previousConversation) {
        queryClient.setQueryData(
          ['ai-chat', currentConversationId],
          context.previousConversation
        );
      }
    },
    onSuccess: (data) => {
      // Refetch conversation to get AI response
      queryClient.invalidateQueries({
        queryKey: ['ai-chat', data.conversationId],
      });
    },
  });

  // Extract messages array
  const messages: AIMessage[] = conversation?.messages || [];

  // Helper to start new conversation
  const startNewConversation = () => {
    setCurrentConversationId(undefined);
    queryClient.removeQueries({ queryKey: ['ai-chat'] });
  };

  return {
    // Data
    messages,
    conversation,
    conversationId: currentConversationId,

    // Loading states
    isLoading: isLoadingConversation,
    isSending: sendMessageMutation.isPending,

    // Error states
    error: conversationError || sendMessageMutation.error,

    // Actions
    sendMessage: (message: string) => sendMessageMutation.mutate(message),
    startNewConversation,
  };
}

/**
 * useConversations Hook
 *
 * List all conversations (for future conversation list screen)
 */
export function useConversations() {
  const { data: conversations, isLoading, error } = useQuery({
    queryKey: ['ai-conversations'],
    queryFn: () => aiChatService.listConversations(),
  });

  return {
    conversations: conversations || [],
    isLoading,
    error,
  };
}
