/**
 * TypingIndicator Component
 *
 * Animated dots showing AI is thinking/typing
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';

export function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animations = Animated.parallel([
      animate(dot1, 0),
      animate(dot2, 200),
      animate(dot3, 400),
    ]);

    animations.start();

    return () => animations.stop();
  }, [dot1, dot2, dot3]);

  const dotStyle = (animatedValue: Animated.Value) => ({
    opacity: animatedValue,
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -4],
        }),
      },
    ],
  });

  return (
    <View className="mb-4 items-start">
      <View className="bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
        <Text className="text-xs text-purple-400 font-semibold mb-1">
          Wisdom Monk
        </Text>
        <View className="flex-row items-center space-x-1">
          <Animated.View
            style={dotStyle(dot1)}
            className="w-2 h-2 rounded-full bg-purple-600"
          />
          <Animated.View
            style={dotStyle(dot2)}
            className="w-2 h-2 rounded-full bg-purple-600 ml-1"
          />
          <Animated.View
            style={dotStyle(dot3)}
            className="w-2 h-2 rounded-full bg-purple-600 ml-1"
          />
        </View>
      </View>
    </View>
  );
}
