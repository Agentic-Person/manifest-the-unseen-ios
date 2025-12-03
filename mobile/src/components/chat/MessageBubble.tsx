/**
 * MessageBubble Component
 *
 * Displays a single chat message with different styling for user vs AI messages
 * Uses ancient mystical design system with Temple Stone and Gold accents
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '@/theme';
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
      style={[styles.container, isUser ? styles.containerUser : styles.containerAI]}
    >
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAI,
        ]}
      >
        {!isUser && (
          <Text style={styles.monkLabel}>
            Wisdom Monk
          </Text>
        )}
        <Text style={styles.messageText}>
          {message.content}
        </Text>
        <Text style={[styles.timestamp, isUser ? styles.timestampUser : styles.timestampAI]}>
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

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  containerUser: {
    alignItems: 'flex-end',
  },
  containerAI: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleUser: {
    backgroundColor: 'rgba(196, 160, 82, 0.15)', // Gold-tinted background
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: colors.background.secondary, // Temple Stone (#1A1A24)
    borderWidth: 1,
    borderColor: colors.border.default, // Subtle gold border (rgba(196, 160, 82, 0.15))
    borderBottomLeftRadius: 4,
  },
  monkLabel: {
    fontSize: 12,
    color: colors.brand.amber, // Amber Glow (#D4A84B)
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.primary, // Enlightened White (#F5F0E6)
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  timestampUser: {
    color: 'rgba(196, 160, 82, 0.7)', // Lighter gold for user messages
  },
  timestampAI: {
    color: colors.text.secondary, // Muted Wisdom (#A09080)
  },
});
