/**
 * MeditationCard Component
 *
 * Displays a meditation item with full-width image card design.
 * Matches the workbook exercise card style with golden borders.
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
  /** Index for fallback display when no image */
  index?: number;
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
 *
 * Renders meditation cards with full-width images matching workbook style.
 */
export const MeditationCard: React.FC<MeditationCardProps> = ({
  meditation,
  onPress,
  showType = false,
  image,
  index = 0,
}) => {
  const iconColor = getTypeColor(meditation.type);
  const iconName = getMeditationIcon(meditation.type) as keyof typeof Ionicons.glyphMap;

  // Always render the new card style (with or without image)
  return (
    <Pressable
      style={({ pressed }) => [
        styles.cardContainer,
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress(meditation)}
      accessibilityRole="button"
      accessibilityLabel={`Play ${meditation.title}, ${formatDuration(meditation.duration_seconds)}`}
    >
      {/* Image Section */}
      <View style={styles.imageSection}>
        {image ? (
          <Image source={image} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <View style={[styles.placeholderImage, { backgroundColor: `${iconColor}30` }]}>
            <Ionicons name={iconName} size={48} color={iconColor} />
          </View>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.imageGradient}
        />
        {/* Duration Badge - Bottom Right */}
        <View style={styles.durationBadge}>
          <Ionicons name="time-outline" size={12} color={colors.white} />
          <Text style={styles.durationText}>
            {formatDuration(meditation.duration_seconds)}
          </Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <View style={styles.contentInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {meditation.title}
            </Text>
            {meditation.narrator_gender && meditation.type === 'guided' && (
              <Text style={styles.narratorBadge}>
                {meditation.narrator_gender === 'female' ? '♀' : '♂'}
              </Text>
            )}
          </View>
          {meditation.description && (
            <Text style={styles.cardDescription} numberOfLines={1}>
              {meditation.description}
            </Text>
          )}
        </View>
        <View style={styles.playButton}>
          <Ionicons name="play" size={18} color={colors.white} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Card container - matches workbook exercise cards
  cardContainer: {
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.brand.gold,
    ...shadows.md,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  // Image section
  imageSection: {
    height: 120,
    position: 'relative',
    backgroundColor: colors.background.tertiary,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },

  // Duration badge - bottom right of image
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: borderRadius.md,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },

  // Content section
  contentSection: {
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  narratorBadge: {
    fontSize: 14,
    color: colors.dark.accentGold,
    marginLeft: spacing.xs,
  },
  cardDescription: {
    fontSize: 13,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.accentGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
    ...shadows.sm,
  },
});

export default MeditationCard;
