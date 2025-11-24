/**
 * MissionSection Component
 *
 * An expandable/collapsible section for the Life Mission worksheet.
 * Each section represents one dimension of the user's mission (Personal, Professional, Impact, Legacy).
 * Features smooth animation, guiding prompts, and multiline text input.
 *
 * @example
 * ```tsx
 * <MissionSection
 *   id="personal"
 *   title="Personal Mission"
 *   subtitle="Who I am at my core"
 *   prompt="Describe the person you aspire to be..."
 *   icon="star"
 *   color="#4a1a6b"
 *   value={personalMission}
 *   onChangeText={setPersonalMission}
 *   isExpanded={expandedSection === 'personal'}
 *   onToggle={() => toggleSection('personal')}
 * />
 * ```
 */

import React, { useCallback, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TextInput as RNTextInput,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import { Text } from '../Text';
import { colors, spacing, borderRadius, shadows } from '../../theme';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * Mission section ID type
 */
export type MissionId = 'personal' | 'professional' | 'impact' | 'legacy';

/**
 * Props for the MissionSection component
 */
export interface MissionSectionProps {
  /** Unique identifier for this mission section */
  id: MissionId;

  /** Section title (e.g., "Personal Mission") */
  title: string;

  /** Short subtitle describing the section */
  subtitle: string;

  /** Guiding prompt to help user write their mission */
  prompt: string;

  /** Emoji or icon for the section */
  icon: string;

  /** Accent color for the section (hex) */
  color: string;

  /** Current text value */
  value: string;

  /** Callback when text changes */
  onChangeText: (text: string) => void;

  /** Whether this section is currently expanded */
  isExpanded: boolean;

  /** Callback when section header is tapped */
  onToggle: () => void;

  /** Test ID for automation */
  testID?: string;
}

/**
 * MissionSection Component
 */
export const MissionSection: React.FC<MissionSectionProps> = ({
  id: _id, // Used for key prop by parent
  title,
  subtitle,
  prompt,
  icon,
  color,
  value,
  onChangeText,
  isExpanded,
  onToggle,
  testID,
}) => {
  const rotateAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  // Animate chevron rotation when expanded state changes
  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isExpanded, rotateAnim]);

  /**
   * Handle toggle with animation
   */
  const handleToggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle();
  }, [onToggle]);

  // Calculate character count
  const characterCount = value.length;
  const maxCharacters = 500;

  // Create background color with opacity
  const bgColorLight = `${color}15`; // 15 is ~9% opacity in hex
  const borderColor = `${color}40`; // 40 is ~25% opacity

  // Chevron rotation interpolation
  const chevronRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View
      style={[
        styles.container,
        { borderColor: isExpanded ? borderColor : 'transparent' },
      ]}
      testID={testID}
    >
      {/* Section Header - Tappable */}
      <TouchableOpacity
        style={[
          styles.header,
          { backgroundColor: bgColorLight },
          isExpanded && styles.headerExpanded,
        ]}
        onPress={handleToggle}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        accessibilityLabel={`${title} section, ${isExpanded ? 'expanded' : 'collapsed'}`}
        accessibilityHint={isExpanded ? 'Double tap to collapse' : 'Double tap to expand'}
        testID={`${testID}-header`}
      >
        <View style={styles.headerLeft}>
          {/* Icon Container */}
          <View style={[styles.iconContainer, { backgroundColor: color }]}>
            <Text style={styles.icon}>{icon}</Text>
          </View>

          {/* Title and Subtitle */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        {/* Chevron */}
        <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
          <Text style={styles.chevron}>{'>'}</Text>
        </Animated.View>
      </TouchableOpacity>

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.content}>
          {/* Hand-drawn style divider */}
          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: color }]} />
            <Text style={styles.dividerStar}>*</Text>
            <View style={[styles.divider, { backgroundColor: color }]} />
          </View>

          {/* Guiding Prompt */}
          <Text style={styles.prompt}>{prompt}</Text>

          {/* Text Input */}
          <View style={styles.inputContainer}>
            <RNTextInput
              style={[styles.textInput, { borderColor: borderColor }]}
              value={value}
              onChangeText={onChangeText}
              placeholder="Write your thoughts here..."
              placeholderTextColor={colors.dark.textTertiary}
              multiline
              numberOfLines={6}
              maxLength={maxCharacters}
              textAlignVertical="top"
              testID={`${testID}-input`}
            />

            {/* Character Counter */}
            <Text
              style={[
                styles.characterCount,
                characterCount > maxCharacters * 0.9 && styles.characterCountWarning,
              ]}
            >
              {characterCount}/{maxCharacters}
            </Text>
          </View>

          {/* Completion indicator */}
          {value.length > 50 && (
            <View style={styles.completionBadge}>
              <Text style={styles.completionText}>In progress</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

/**
 * Styles - Dark Spiritual Theme
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    ...shadows.sm,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.lg - 1,
  },

  headerExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    ...shadows.xs,
  },

  icon: {
    fontSize: 24,
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginBottom: 2,
  },

  subtitle: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    fontStyle: 'italic',
  },

  chevron: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark.textTertiary,
    marginLeft: spacing.sm,
  },

  content: {
    padding: spacing.md,
    paddingTop: spacing.sm,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  divider: {
    flex: 1,
    height: 1,
    opacity: 0.3,
  },

  dividerStar: {
    fontSize: 12,
    color: colors.dark.textTertiary,
    marginHorizontal: spacing.sm,
  },

  prompt: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.dark.textSecondary,
    marginBottom: spacing.md,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },

  inputContainer: {
    position: 'relative',
  },

  textInput: {
    backgroundColor: colors.dark.bgPrimary,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    paddingBottom: spacing.lg,
    minHeight: 150,
    fontSize: 16,
    lineHeight: 24,
    color: colors.dark.textPrimary,
    textAlignVertical: 'top',
  },

  characterCount: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    fontSize: 12,
    color: colors.dark.textTertiary,
  },

  characterCountWarning: {
    color: colors.dark.accentAmber,
  },

  completionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: `${colors.dark.accentGreen}30`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
  },

  completionText: {
    fontSize: 12,
    color: colors.dark.accentGreen,
    fontWeight: '600',
  },
});

export default MissionSection;
