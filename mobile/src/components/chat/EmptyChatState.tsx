/**
 * EmptyChatState Component
 *
 * Welcoming message shown when starting a new conversation
 */

import React from 'react';
import { View, Text } from 'react-native';

export function EmptyChatState() {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <View className="items-center mb-8">
        {/* Monk icon/emoji */}
        <Text className="text-6xl mb-4">🧘</Text>
        <Text className="text-2xl font-bold text-white text-center mb-2">
          Welcome, Seeker
        </Text>
        <Text className="text-base text-gray-300 text-center leading-6">
          I am your guide on the path of manifestation and self-discovery.
        </Text>
      </View>

      <View className="space-y-3 w-full">
        <View className="bg-purple-900/20 rounded-lg p-4">
          <Text className="text-sm text-purple-100 font-medium mb-1">
            Ask me about manifestation
          </Text>
          <Text className="text-xs text-purple-300">
            "How do I start my manifestation journey?"
          </Text>
        </View>

        <View className="bg-purple-900/20 rounded-lg p-4">
          <Text className="text-sm text-purple-100 font-medium mb-1">
            Explore limiting beliefs
          </Text>
          <Text className="text-xs text-purple-300">
            "Help me identify my limiting beliefs"
          </Text>
        </View>

        <View className="bg-purple-900/20 rounded-lg p-4">
          <Text className="text-sm text-purple-100 font-medium mb-1">
            Learn techniques
          </Text>
          <Text className="text-xs text-purple-300">
            "Tell me about the 3-6-9 manifestation method"
          </Text>
        </View>
      </View>

      <Text className="text-xs text-gray-400 text-center mt-8 px-4">
        Ask me anything about your spiritual journey, manifestation practices,
        or the workbook exercises
      </Text>
    </View>
  );
}
