/**
 * MeditationCard Component
 *
 * Displays a meditation item with optional thumbnail image.
 * Used for guided meditations, breathing exercises, and music tracks.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, shadows, borderRadius } from '../../theme';
import type { Meditation, MeditationType } from '../../types/meditation';
import { formatDuration, getMeditationIcon, getMeditationTypeLabel } from '../../types/meditation';

interface MeditationCardProps {
  meditation: Meditation;
  onPress: (meditation: Meditation) => void;
  showType?: boolean;
  image?: ImageSourcePropType;
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
  image,
}) => {
  const iconColor = getTypeColor(meditation.type);
  const iconName = getMeditationIcon(meditation.type) as keyof typeof Ionicons.glyphMap;

  // If image is provided, render card with image
  if (image) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.imageCardContainer,
          pressed && styles.pressed,
        ]}
        onPress={() => onPress(meditation)}
        accessibilityRole="button"
        accessibilityLabel={`Play ${meditation.title}, ${formatDuration(meditation.duration_seconds)}`}
      >
        <Image source={image} style={styles.cardImage} resizeMode="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)']}
          style={styles.cardGradient}
        />
        <View style={styles.cardOverlay}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {meditation.title}
            </Text>
            <View style={styles.cardMeta}>
              <Ionicons name={iconName} size={14} color={iconColor} />
              <Text style={styles.cardDuration}>
                {formatDuration(meditation.duration_seconds)}
              </Text>
              {meditation.narrator_gender && meditation.type === 'guided' && (
                <>
                  <Text style={styles.cardDot}>•</Text>
                  <Text style={styles.cardNarrator}>
                    {meditation.narrator_gender === 'female' ? 'Female' : 'Male'}
                  </Text>
                </>
              )}
            </View>
          </View>
          <View style={styles.cardPlayButton}>
            <Ionicons name="play" size={20} color={colors.white} />
          </View>
        </View>
      </Pressable>
    );
  }

  // Default card without image
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
  // Default card styles
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.default,
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
    borderColor: colors.border.gold,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(196, 160, 82, 0.2)',
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
    fontStyle: 'italic',
  },
  playIcon: {
    marginLeft: spacing.xs,
  },

  // Image card styles
  imageCardContainer: {
    height: 160,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.default,
    ...shadows.md,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardDuration: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  cardDot: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  cardNarrator: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
  cardPlayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.dark.accentGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
    ...shadows.md,
  },
});

export default MeditationCard;
