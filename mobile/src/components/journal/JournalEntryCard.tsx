/**
 * JournalEntryCard Component
 *
 * Card component for displaying journal entry preview in a list.
 * Shows date, content preview, and image thumbnails.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, typography, shadows } from '@/theme';
import type { JournalEntry } from '@/types';

export interface JournalEntryCardProps {
  /** Journal entry data */
  entry: JournalEntry;

  /** Callback when card is pressed */
  onPress: () => void;

  /** Callback when delete is triggered (optional) */
  onDelete?: () => void;
}

/**
 * JournalEntryCard Component
 */
export const JournalEntryCard: React.FC<JournalEntryCardProps> = ({
  entry,
  onPress,
  onDelete,
}) => {
  // Format date nicely
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Format time
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    // Handle relative dates
    if (diffDays === 0) {
      return `Today • ${timeStr}`;
    } else if (diffDays === 1) {
      return `Yesterday • ${timeStr}`;
    } else if (diffDays < 7) {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      return `${dayName} • ${timeStr}`;
    } else {
      const dateStr = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
      return `${dateStr} • ${timeStr}`;
    }
  };

  // Truncate content for preview
  const getPreviewText = (content: string, maxLength: number = 120): string => {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength).trim() + '...';
  };

  // Handle card press
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  // Handle long press for delete
  const handleLongPress = async () => {
    if (!onDelete) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: onDelete,
        },
      ],
    );
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      accessibilityRole="button"
      accessibilityLabel={`Journal entry from ${formatDate(entry.created_at)}`}
      accessibilityHint="Tap to view full entry, long press to delete"
    >
      {/* Date Header */}
      <Text style={styles.date}>{formatDate(entry.created_at)}</Text>

      {/* Content Preview */}
      <Text style={styles.content} numberOfLines={3} ellipsizeMode="tail">
        {getPreviewText(entry.content)}
      </Text>

      {/* Image Thumbnails */}
      {entry.images && entry.images.length > 0 && (
        <View style={styles.imagesContainer}>
          {entry.images.slice(0, 4).map((imageUri, index) => (
            <View key={`${imageUri}-${index}`} style={styles.thumbnailWrapper}>
              <Image
                source={{ uri: imageUri }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
              {/* Show count overlay on last image if there are more */}
              {index === 3 && entry.images.length > 4 && (
                <View style={styles.moreOverlay}>
                  <Text style={styles.moreText}>+{entry.images.length - 4}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Tags (if any) */}
      {entry.tags && entry.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {entry.tags.slice(0, 3).map((tag, index) => (
            <View key={`${tag}-${index}`} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
          {entry.tags.length > 3 && (
            <Text style={styles.moreTags}>+{entry.tags.length - 3}</Text>
          )}
        </View>
      )}

      {/* Mood Indicator (if available) */}
      {entry.mood && (
        <View style={styles.moodContainer}>
          <Text style={styles.moodEmoji}>{getMoodEmoji(entry.mood)}</Text>
          <Text style={styles.moodText}>{entry.mood}</Text>
        </View>
      )}
    </Pressable>
  );
};

// Helper function to get mood emoji
const getMoodEmoji = (mood: string): string => {
  const moodMap: Record<string, string> = {
    happy: '😊',
    grateful: '🙏',
    peaceful: '😌',
    excited: '🤩',
    sad: '😢',
    anxious: '😰',
    angry: '😠',
    neutral: '😐',
  };
  return moodMap[mood.toLowerCase()] || '💭';
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.elevated,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    ...shadows.sm,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  date: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  content: {
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
    lineHeight: typography.body.lineHeight,
    marginBottom: spacing.sm,
  },
  imagesContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  thumbnailWrapper: {
    position: 'relative',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
  },
  moreOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.white,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  tag: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  tagText: {
    fontSize: typography.caption.fontSize,
    color: colors.primary[400],
    fontWeight: '600',
  },
  moreTags: {
    fontSize: typography.caption.fontSize,
    color: colors.text.tertiary,
    fontWeight: '600',
    alignSelf: 'center',
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  moodEmoji: {
    fontSize: 16,
  },
  moodText: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

export default JournalEntryCard;
