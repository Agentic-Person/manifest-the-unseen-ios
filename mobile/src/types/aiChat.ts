/**
 * AI Chat Types
 *
 * Type definitions for AI monk companion chat feature
 */

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIConversation {
  id: string;
  user_id: string;
  title?: string;
  messages: AIMessage[];
  created_at: string;
  updated_at: string;
}

export interface SendMessageRequest {
  conversationId?: string;
  message: string;
}

export interface SendMessageResponse {
  conversationId: string;
  response: string;
  timestamp: string;
}

export interface ConversationListItem {
  id: string;
  title?: string;
  lastMessage: string;
  updated_at: string;
}

// Loading and error states
export type ChatLoadingState = 'idle' | 'sending' | 'receiving' | 'error';

export interface ChatError {
  message: string;
  code?: string;
}
