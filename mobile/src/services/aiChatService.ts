/**
 * AI Chat Service
 *
 * Service layer for interacting with AI chat Edge Function
 * Handles conversation management and message sending
 */

import { supabase } from './supabase';
import type {
  AIConversation,
  SendMessageRequest,
  SendMessageResponse,
  ConversationListItem,
} from '../types/aiChat';

export const aiChatService = {
  /**
   * Send a message to the AI monk
   * If conversationId is provided, continues existing conversation
   * If undefined, creates a new conversation
   */
  async sendMessage(
    conversationId: string | undefined,
    message: string
  ): Promise<SendMessageResponse> {
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: {
        conversationId,
        message,
      } as SendMessageRequest,
    });

    if (error) {
      console.error('[aiChatService] Error sending message:', error);
      throw new Error(error.message || 'Failed to send message');
    }

    if (!data) {
      throw new Error('No response from AI');
    }

    return data as SendMessageResponse;
  },

  /**
   * Get a specific conversation by ID
   * Returns full conversation with all messages
   */
  async getConversation(conversationId: string): Promise<AIConversation> {
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (error) {
      console.error('[aiChatService] Error fetching conversation:', error);
      throw new Error(error.message || 'Failed to load conversation');
    }

    if (!data) {
      throw new Error('Conversation not found');
    }

    return data as AIConversation;
  },

  /**
   * List all conversations for the current user
   * Ordered by most recent first
   * (For future conversation list screen)
   */
  async listConversations(): Promise<ConversationListItem[]> {
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('id, title, messages, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('[aiChatService] Error listing conversations:', error);
      throw new Error(error.message || 'Failed to load conversations');
    }

    // Transform to list items with last message preview
    return ((data || []) as Array<{ id: string; title: string; messages: Array<{ content: string }>; updated_at: string }>).map((conv) => ({
      id: conv.id,
      title: conv.title,
      lastMessage:
        conv.messages && conv.messages.length > 0
          ? conv.messages[conv.messages.length - 1].content
          : '',
      updated_at: conv.updated_at,
    }));
  },

  /**
   * Delete a conversation
   * (For future implementation)
   */
  async deleteConversation(conversationId: string): Promise<void> {
    const { error } = await supabase
      .from('ai_conversations')
      .delete()
      .eq('id', conversationId);

    if (error) {
      console.error('[aiChatService] Error deleting conversation:', error);
      throw new Error(error.message || 'Failed to delete conversation');
    }
  },
};
