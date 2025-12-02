/**
 * MessageBubble Component
 *
 * Displays a single chat message with different styling for user vs AI messages
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { AIMessage } from '../../types/aiChat';

interface MessageBubbleProps {
  message: AIMessage;
  onLongPress?: () => void;
}

export function MessageBubble({ message, onLongPress }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <Pressable
      onLongPress={onLongPress}
      className={`mb-4 ${isUser ? 'items-end' : 'items-start'}`}
    >
      <View
        className={`
          max-w-[80%] rounded-2xl px-4 py-3
          ${
            isUser
              ? 'bg-purple-600 rounded-br-sm'
              : 'bg-gray-800 rounded-bl-sm'
          }
        `}
      >
        {!isUser && (
          <Text className="text-xs text-purple-400 font-semibold mb-1">
            Wisdom Monk
          </Text>
        )}
        <Text
          className={`
            text-base leading-6
            ${isUser ? 'text-white' : 'text-gray-100'}
          `}
        >
          {message.content}
        </Text>
        <Text
          className={`
            text-xs mt-1
            ${isUser ? 'text-purple-200' : 'text-gray-400'}
          `}
        >
          {formatMessageTime(message.timestamp)}
        </Text>
      </View>
    </Pressable>
  );
}

function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  // Show time if today, date if older
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
