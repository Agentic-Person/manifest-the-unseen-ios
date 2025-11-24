/**
 * WOOPSection Component
 *
 * Individual section input for the WOOP manifestation method.
 * WOOP = Wish, Outcome, Obstacle, Plan
 *
 * Features:
 * - Letter badge with color coding
 * - Expandable text input area
 * - Prompt guidance text
 * - Character count
 * - Haptic feedback
 * - Dark spiritual theme
 *
 * @example
 * ```tsx
 * <WOOPSection
 *   section="wish"
 *   value={wishText}
 *   onChange={setWishText}
 *   isActive={currentStep === 0}
 * />
 * ```
 */

import React, { useCallback, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '../Text';
import { colors, spacing, borderRadius, shadows } from '../../theme';

/**
 * WOOP section types
 */
export type WOOPSectionType = 'wish' | 'outcome' | 'obstacle' | 'plan';

/**
 * Section configuration
 */
export interface WOOPSectionConfig {
  letter: string;
  title: string;
  prompt: string;
  placeholder: string;
  color: string;
  glowColor: string;
  icon: string;
}

/**
 * WOOP section configurations
 */
export const WOOP_CONFIG: Record<WOOPSectionType, WOOPSectionConfig> = {
  wish: {
    letter: 'W',
    title: 'Wish',
    prompt: 'What is your most important wish or goal?',
    placeholder: 'I wish to...',
    color: colors.dark.accentGold,
    glowColor: 'rgba(201, 162, 39, 0.3)',
    icon: '\u2B50', // Star
  },
  outcome: {
    letter: 'O',
    title: 'Outcome',
    prompt: 'What would be the best outcome? How would you feel?',
    placeholder: 'When I achieve this, I will feel...',
    color: colors.dark.accentTeal,
    glowColor: 'rgba(26, 95, 95, 0.3)',
    icon: '\uD83C\uDFC6', // Trophy
  },
  obstacle: {
    letter: 'O',
    title: 'Obstacle',
    prompt: 'What internal obstacle might prevent you from achieving your wish?',
    placeholder: 'The main obstacle holding me back is...',
    color: colors.dark.accentAmber,
    glowColor: 'rgba(139, 105, 20, 0.3)',
    icon: '\uD83D\uDEA7', // Construction
  },
  plan: {
    letter: 'P',
    title: 'Plan',
    prompt: 'If [obstacle], then I will [action]. Create an if-then plan.',
    placeholder: 'If [obstacle occurs], then I will...',
    color: colors.dark.accentGreen,
    glowColor: 'rgba(45, 90, 74, 0.3)',
    icon: '\uD83D\uDCDD', // Memo
  },
};

/**
 * Props for WOOPSection component
 */
export interface WOOPSectionProps {
  /** Which WOOP section this is */
  section: WOOPSectionType;
  /** Current value of the input */
  value: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Whether this section is currently active/expanded */
  isActive: boolean;
  /** Callback when section header is pressed */
  onPress?: () => void;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Maximum character limit */
  maxLength?: number;
  /** Custom style */
  style?: ViewStyle;
  /** Test ID for E2E testing */
  testID?: string;
}

/**
 * WOOPSection Component
 */
export const WOOPSection: React.FC<WOOPSectionProps> = ({
  section,
  value,
  onChange,
  isActive,
  onPress,
  disabled = false,
  maxLength = 500,
  style,
  testID,
}) => {
  const config = WOOP_CONFIG[section];
  const inputRef = useRef<TextInput>(null);
  const expandAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  // Animate expansion
  useEffect(() => {
    Animated.spring(expandAnim, {
      toValue: isActive ? 1 : 0,
      useNativeDriver: false,
      tension: 100,
      friction: 15,
    }).start();

    // Focus input when becoming active
    if (isActive && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isActive, expandAnim]);

  const handleHeaderPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  }, [onPress]);

  const handleChangeText = useCallback((text: string) => {
    if (text.length <= maxLength) {
      onChange(text);
    }
  }, [maxLength, onChange]);

  const isComplete = value.trim().length > 10;
  const charCount = value.length;

  // Animated styles
  const contentHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  const contentOpacity = expandAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <View
      style={[
        styles.container,
        isActive && styles.containerActive,
        isActive && { borderColor: config.color },
        isComplete && !isActive && styles.containerComplete,
        style,
      ]}
      testID={testID}
    >
      {/* Header - Always Visible */}
      <TouchableOpacity
        onPress={handleHeaderPress}
        disabled={disabled}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ expanded: isActive }}
        accessibilityLabel={`${config.title} section`}
        accessibilityHint={isActive ? 'Collapse section' : 'Expand section'}
        testID={testID ? `${testID}-header` : undefined}
      >
        <View style={styles.header}>
          {/* Letter Badge */}
          <View
            style={[
              styles.letterBadge,
              { backgroundColor: isActive ? config.color : `${config.color}40` },
              isComplete && !isActive && { backgroundColor: config.color },
            ]}
          >
            <Text
              style={[
                styles.letter,
                { color: isActive || isComplete ? colors.dark.bgPrimary : config.color },
              ]}
            >
              {config.letter}
            </Text>
          </View>

          {/* Title & Preview */}
          <View style={styles.headerContent}>
            <Text style={styles.title}>{config.title}</Text>
            {!isActive && value && (
              <Text style={styles.preview} numberOfLines={1}>
                {value}
              </Text>
            )}
            {!isActive && !value && (
              <Text style={styles.emptyHint}>Tap to add...</Text>
            )}
          </View>

          {/* Status Icon */}
          <View style={styles.statusContainer}>
            {isComplete ? (
              <Text style={[styles.statusIcon, { color: config.color }]}>{'\u2713'}</Text>
            ) : (
              <Text style={styles.expandIcon}>{isActive ? '\u25B2' : '\u25BC'}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Expandable Content */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            maxHeight: contentHeight,
            opacity: contentOpacity,
          },
        ]}
      >
        <View style={styles.content}>
          {/* Prompt */}
          <View style={styles.promptContainer}>
            <Text style={styles.promptIcon}>{config.icon}</Text>
            <Text style={styles.prompt}>{config.prompt}</Text>
          </View>

          {/* Input */}
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={handleChangeText}
            placeholder={config.placeholder}
            placeholderTextColor={colors.dark.textTertiary}
            multiline
            numberOfLines={4}
            maxLength={maxLength}
            editable={!disabled}
            style={[
              styles.input,
              { borderColor: `${config.color}40` },
            ]}
            accessibilityLabel={`${config.title} input`}
            testID={testID ? `${testID}-input` : undefined}
          />

          {/* Character Count */}
          <View style={styles.footer}>
            <Text style={styles.charCount}>
              {charCount}/{maxLength}
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    ...shadows.sm,
  },

  containerActive: {
    backgroundColor: colors.dark.bgElevated,
  },

  containerComplete: {
    borderColor: `${colors.dark.textTertiary}30`,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },

  letterBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },

  letter: {
    fontSize: 20,
    fontWeight: '700',
  },

  headerContent: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },

  preview: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    marginTop: 2,
  },

  emptyHint: {
    fontSize: 13,
    color: colors.dark.textTertiary,
    fontStyle: 'italic',
    marginTop: 2,
  },

  statusContainer: {
    width: 24,
    alignItems: 'center',
  },

  statusIcon: {
    fontSize: 18,
    fontWeight: '700',
  },

  expandIcon: {
    fontSize: 12,
    color: colors.dark.textTertiary,
  },

  contentContainer: {
    overflow: 'hidden',
  },

  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },

  promptContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },

  promptIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },

  prompt: {
    flex: 1,
    fontSize: 14,
    color: colors.dark.textSecondary,
    lineHeight: 20,
  },

  input: {
    backgroundColor: colors.dark.bgPrimary,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.dark.textPrimary,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 100,
    textAlignVertical: 'top',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.xs,
  },

  charCount: {
    fontSize: 11,
    color: colors.dark.textTertiary,
  },
});

export default WOOPSection;
