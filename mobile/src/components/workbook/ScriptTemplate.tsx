/**
 * ScriptTemplate Component
 *
 * Template selector card for manifestation scripting exercises.
 * Provides pre-defined templates with prompts for writing scripts.
 *
 * Features:
 * - Multiple script templates
 * - Category icons
 * - Selection highlight with haptic feedback
 * - Dark spiritual theme
 *
 * @example
 * ```tsx
 * <ScriptTemplate
 *   template={{
 *     id: 'dream-life',
 *     title: 'A Day in My Dream Life',
 *     description: 'Describe your ideal day from morning to night',
 *     icon: '\u2728',
 *     prompts: ['Wake up feeling...', 'Your morning routine includes...']
 *   }}
 *   isSelected={true}
 *   onSelect={() => handleSelect('dream-life')}
 * />
 * ```
 */

import React, { useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '../Text';
import { colors, spacing, borderRadius, shadows } from '../../theme';

/**
 * Script template data structure
 */
export interface ScriptTemplateData {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'life' | 'career' | 'relationships' | 'abundance' | 'health' | 'custom';
  prompts: string[];
  exampleOpening?: string;
}

/**
 * Category colors
 */
export const CATEGORY_COLORS: Record<ScriptTemplateData['category'], string> = {
  life: colors.dark.accentGold,
  career: colors.dark.accentTeal,
  relationships: colors.dark.accentRose,
  abundance: colors.dark.accentGreen,
  health: '#4a8b6b', // Forest teal
  custom: colors.dark.accentPurple,
};

/**
 * Predefined script templates
 */
export const SCRIPT_TEMPLATES: ScriptTemplateData[] = [
  {
    id: 'dream-day',
    title: 'A Day in My Dream Life',
    description: 'Describe your perfect day from sunrise to sunset',
    icon: '\u2600', // Sun
    category: 'life',
    prompts: [
      'I wake up feeling completely...',
      'My morning begins with...',
      'The space I live in is...',
      'Throughout my day, I...',
      'The people around me are...',
      'By evening, I feel...',
    ],
    exampleOpening: 'I wake up feeling completely rested and at peace in my beautiful home...',
  },
  {
    id: 'dream-career',
    title: 'My Dream Career',
    description: 'Script your ideal professional life and work',
    icon: '\u2B50', // Star
    category: 'career',
    prompts: [
      'My work brings me joy because...',
      'I am recognized for...',
      'My typical workday includes...',
      'I earn...',
      'My colleagues and I...',
      'I contribute to the world by...',
    ],
    exampleOpening: 'I am living my dream career, doing work that fills me with purpose every single day...',
  },
  {
    id: 'ideal-relationship',
    title: 'My Ideal Relationship',
    description: 'Describe your perfect romantic partnership',
    icon: '\u2764', // Heart
    category: 'relationships',
    prompts: [
      'My partner and I share...',
      'We communicate by...',
      'Our daily life together includes...',
      'We support each other through...',
      'Our love continues to grow because...',
      'Together, we...',
    ],
    exampleOpening: 'I am in a deeply fulfilling relationship with someone who truly sees and cherishes me...',
  },
  {
    id: 'financial-abundance',
    title: 'Financial Abundance',
    description: 'Script your relationship with money and wealth',
    icon: '\uD83D\uDCB0', // Money bag
    category: 'abundance',
    prompts: [
      'Money flows to me...',
      'I use my abundance to...',
      'My financial security allows me to...',
      'I am grateful for...',
      'I invest in...',
      'My relationship with money is...',
    ],
    exampleOpening: 'I am financially free and abundant, with more than enough to live my dream life...',
  },
  {
    id: 'optimal-health',
    title: 'My Optimal Health',
    description: 'Describe your healthiest, most vibrant self',
    icon: '\uD83C\uDF31', // Seedling
    category: 'health',
    prompts: [
      'My body feels...',
      'I nourish myself with...',
      'My energy levels are...',
      'I move my body by...',
      'My mental clarity allows me to...',
      'I am grateful for my health because...',
    ],
    exampleOpening: 'I am in the best health of my life, feeling strong, energized, and vibrant every day...',
  },
  {
    id: 'custom',
    title: 'Create Your Own',
    description: 'Write a custom script about anything you desire',
    icon: '\u270F', // Pencil
    category: 'custom',
    prompts: [
      'Start with "I am" or "I have"...',
      'Write in present tense as if it\'s already true...',
      'Include sensory details - what do you see, hear, feel?',
      'Express gratitude throughout...',
      'Describe how this reality makes you feel...',
    ],
    exampleOpening: 'I am living my most extraordinary life, where everything I\'ve ever dreamed of...',
  },
];

/**
 * Props for ScriptTemplate component
 */
export interface ScriptTemplateProps {
  /** Template data */
  template: ScriptTemplateData;
  /** Whether this template is currently selected */
  isSelected: boolean;
  /** Callback when template is selected */
  onSelect: () => void;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Custom style */
  style?: ViewStyle;
  /** Test ID for E2E testing */
  testID?: string;
}

/**
 * ScriptTemplate Component
 */
export const ScriptTemplate: React.FC<ScriptTemplateProps> = ({
  template,
  isSelected,
  onSelect,
  disabled = false,
  style,
  testID,
}) => {
  const categoryColor = CATEGORY_COLORS[template.category];

  const handlePress = useCallback(() => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onSelect();
    }
  }, [disabled, onSelect]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected, disabled }}
      accessibilityLabel={`${template.title}: ${template.description}`}
      testID={testID}
    >
      <View
        style={[
          styles.container,
          isSelected && styles.containerSelected,
          isSelected && { borderColor: categoryColor },
          disabled && styles.containerDisabled,
          style,
        ]}
      >
        {/* Icon Badge */}
        <View
          style={[
            styles.iconBadge,
            { backgroundColor: `${categoryColor}20` },
            isSelected && { backgroundColor: `${categoryColor}40` },
          ]}
        >
          <Text style={styles.icon}>{template.icon}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{template.title}</Text>
          <Text style={styles.description}>{template.description}</Text>

          {/* Prompts Preview */}
          {isSelected && template.prompts.length > 0 && (
            <View style={styles.promptsPreview}>
              <Text style={[styles.promptsLabel, { color: categoryColor }]}>
                Writing prompts:
              </Text>
              {template.prompts.slice(0, 3).map((prompt, index) => (
                <Text key={index} style={styles.promptItem}>
                  {'\u2022'} {prompt}
                </Text>
              ))}
              {template.prompts.length > 3 && (
                <Text style={styles.morePrompts}>
                  +{template.prompts.length - 3} more prompts...
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Selection Indicator */}
        <View
          style={[
            styles.radioOuter,
            isSelected && { borderColor: categoryColor },
          ]}
        >
          {isSelected && (
            <View
              style={[
                styles.radioInner,
                { backgroundColor: categoryColor },
              ]}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.sm,
  },

  containerSelected: {
    backgroundColor: `${colors.dark.bgElevated}`,
    borderWidth: 2,
  },

  containerDisabled: {
    opacity: 0.5,
  },

  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },

  icon: {
    fontSize: 24,
  },

  content: {
    flex: 1,
    marginRight: spacing.sm,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginBottom: spacing.xs / 2,
  },

  description: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    lineHeight: 18,
  },

  promptsPreview: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: `${colors.dark.textTertiary}30`,
  },

  promptsLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  promptItem: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    marginBottom: 2,
  },

  morePrompts: {
    fontSize: 11,
    color: colors.dark.textTertiary,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.dark.textTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default ScriptTemplate;
