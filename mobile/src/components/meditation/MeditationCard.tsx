/**
 * MeditationCard Component
 *
 * Displays a meditation item in a list with title, duration, and type icon.
 * Used for guided meditations, breathing exercises, and music tracks.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, shadows, borderRadius } from '../../theme';
import type { Meditation, MeditationType } from '../../types/meditation';
import { formatDuration, getMeditationIcon, getMeditationTypeLabel } from '../../types/meditation';

interface MeditationCardProps {
  meditation: Meditation;
  onPress: (meditation: Meditation) => void;
  showType?: boolean;
}

/**
 * Get icon color based on meditation type
 */
const getTypeColor = (type: MeditationType): string => {
  switch (type) {
    case 'guided':
      return colors.dark.accentPurple;
    case 'breathing':
      return colors.dark.accentTeal;
    case 'music':
      return colors.dark.accentGold;
    default:
      return colors.dark.accentGold;
  }
};

/**
 * MeditationCard Component
 */
export const MeditationCard: React.FC<MeditationCardProps> = ({
  meditation,
  onPress,
  showType = false,
}) => {
  const iconColor = getTypeColor(meditation.type);
  const iconName = getMeditationIcon(meditation.type) as keyof typeof Ionicons.glyphMap;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={() => onPress(meditation)}
      accessibilityRole="button"
      accessibilityLabel={`Play ${meditation.title}, ${formatDuration(meditation.duration_seconds)}`}
    >
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
        <Ionicons name={iconName} size={24} color={iconColor} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {meditation.title}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.duration}>
            {formatDuration(meditation.duration_seconds)}
          </Text>
          {showType && (
            <>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.type}>
                {getMeditationTypeLabel(meditation.type)}
              </Text>
            </>
          )}
          {meditation.narrator_gender && meditation.type === 'guided' && (
            <>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.narrator}>
                {meditation.narrator_gender === 'female' ? 'Female' : 'Male'} voice
              </Text>
            </>
          )}
        </View>
        {meditation.description && (
          <Text style={styles.description} numberOfLines={2}>
            {meditation.description}
          </Text>
        )}
      </View>

      {/* Play indicator */}
      <View style={styles.playIcon}>
        <Ionicons name="play-circle" size={32} color={colors.dark.accentGold} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  dot: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginHorizontal: 6,
  },
  type: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  narrator: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  description: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: 4,
    lineHeight: 18,
  },
  playIcon: {
    marginLeft: spacing.xs,
  },
});

export default MeditationCard;
