/**
 * ChatInput Component
 *
 * Multiline text input with send button for chat messages
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
      <View className="border-t border-gray-700 bg-[#1a1a2e] px-4 py-3">
        <View className="flex-row items-end space-x-2">
          <View className="flex-1">
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder={placeholder}
              placeholderTextColor="#6B7280"
              multiline
              maxLength={2000}
              editable={!disabled}
              className="
                bg-gray-800
                rounded-2xl px-4 py-3
                text-base text-white
                max-h-32
              "
              style={{ minHeight: 44 }}
              returnKeyType="default"
              blurOnSubmit={false}
            />
          </View>

          <Pressable
            onPress={handleSend}
            disabled={!canSend}
            className={`
              w-11 h-11 rounded-full items-center justify-center
              ${
                canSend
                  ? 'bg-purple-600 active:bg-purple-700'
                  : 'bg-gray-300 dark:bg-gray-700'
              }
            `}
          >
            <Ionicons
              name="arrow-up"
              size={24}
              color={canSend ? '#FFFFFF' : '#9CA3AF'}
            />
          </Pressable>
        </View>

        {/* Character count (optional) */}
        {message.length > 1800 && (
          <View className="mt-1 px-1">
            <View
              className={`text-xs ${
                message.length >= 2000
                  ? 'text-red-500'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {message.length}/2000
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
