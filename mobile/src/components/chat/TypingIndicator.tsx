/**
 * TypingIndicator Component
 *
 * Animated dots showing AI is thinking/typing
 * Ancient mystical design with gold accents
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { colors } from '@/theme';

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
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.monkLabel}>
          Wisdom Monk
        </Text>
        <View style={styles.dotsContainer}>
          <Animated.View style={[dotStyle(dot1), styles.dot]} />
          <Animated.View style={[dotStyle(dot2), styles.dot]} />
          <Animated.View style={[dotStyle(dot3), styles.dot]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  bubble: {
    backgroundColor: colors.background.secondary, // Temple Stone
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  monkLabel: {
    fontSize: 12,
    color: colors.brand.amber, // Amber Glow
    fontWeight: '600',
    marginBottom: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.brand.gold, // Aged Gold
  },
});
