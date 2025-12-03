/**
 * ChatInput Component
 *
 * Multiline text input with send button for chat messages
 * Styled with ancient mystical design system
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/theme';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Ask the monk anything...',
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSend = () => {
    const trimmed = message.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setMessage('');
    }
  };

  const canSend = message.trim().length > 0 && !disabled;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        <View style={styles.inputRow}>
          <View style={styles.inputWrapper}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              placeholderTextColor={colors.text.tertiary}
              multiline
              maxLength={2000}
              editable={!disabled}
              style={[
                styles.textInput,
                isFocused && styles.textInputFocused,
                disabled && styles.textInputDisabled,
              ]}
              returnKeyType="default"
              blurOnSubmit={false}
            />
          </View>

          <Pressable
            onPress={handleSend}
            disabled={!canSend}
            style={({ pressed }) => [
              styles.sendButton,
              canSend ? styles.sendButtonActive : styles.sendButtonDisabled,
              pressed && canSend && styles.sendButtonPressed,
            ]}
          >
            <Ionicons
              name="arrow-up"
              size={24}
              color={canSend ? colors.text.primary : colors.text.tertiary}
            />
          </Pressable>
        </View>

        {/* Character count warning */}
        {message.length > 1800 && (
          <View style={styles.charCountContainer}>
            <Text
              style={[
                styles.charCount,
                message.length >= 2000 && styles.charCountLimit,
              ]}
            >
              {message.length}/2000
            </Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(196, 160, 82, 0.2)',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing[3],
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  inputWrapper: {
    flex: 1,
  },
  textInput: {
    backgroundColor: 'rgba(26, 26, 36, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(196, 160, 82, 0.2)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing[3],
    fontSize: 16,
    lineHeight: 22,
    color: colors.text.primary,
    minHeight: 44,
    maxHeight: 128,
  },
  textInputFocused: {
    borderColor: colors.border.focused,
  },
  textInputDisabled: {
    opacity: 0.6,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.brand.gold,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(107, 107, 107, 0.3)',
  },
  sendButtonPressed: {
    backgroundColor: colors.primary[600],
    opacity: 0.9,
  },
  charCountContainer: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  charCount: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  charCountLimit: {
    color: colors.error[500],
  },
});
