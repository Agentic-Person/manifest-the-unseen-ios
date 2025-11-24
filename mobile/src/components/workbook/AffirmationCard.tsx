/**
 * AffirmationCard Component
 *
 * Beautiful affirmation display card with favorite toggle for Phase 5.
 * Features elegant typography, soft animations, and haptic feedback.
 *
 * Design: Dark spiritual theme with nurturing, warm accents
 */

import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native';
import * as Haptics from 'expo-haptics';

// Design system colors from APP-DESIGN.md
const DESIGN_COLORS = {
  bgPrimary: '#1a1a2e',
  bgSecondary: '#16213e',
  bgElevated: '#252547',
  textPrimary: '#e8e8e8',
  textSecondary: '#a0a0b0',
  textTertiary: '#6b6b80',
  accentPurple: '#4a1a6b',
  accentGold: '#c9a227',
  accentTeal: '#1a5f5f',
  accentGreen: '#2d5a4a',
  accentRose: '#8b3a5f',
  border: '#3a3a5a',
};

/**
 * Affirmation category types
 */
export type AffirmationCategory =
  | 'self-worth'
  | 'body-love'
  | 'inner-peace'
  | 'confidence'
  | 'abundance';

/**
 * Affirmation data interface
 */
export interface AffirmationData {
  id: string;
  text: string;
  category: AffirmationCategory;
  isFavorite: boolean;
  isCustom: boolean;
  createdAt: string;
}

/**
 * Category display configuration
 */
const CATEGORY_CONFIG: Record<
  AffirmationCategory,
  { label: string; color: string; bgColor: string }
> = {
  'self-worth': {
    label: 'Self-Worth',
    color: DESIGN_COLORS.accentGold,
    bgColor: 'rgba(201, 162, 39, 0.15)',
  },
  'body-love': {
    label: 'Body Love',
    color: DESIGN_COLORS.accentRose,
    bgColor: 'rgba(139, 58, 95, 0.15)',
  },
  'inner-peace': {
    label: 'Inner Peace',
    color: DESIGN_COLORS.accentTeal,
    bgColor: 'rgba(26, 95, 95, 0.15)',
  },
  confidence: {
    label: 'Confidence',
    color: DESIGN_COLORS.accentPurple,
    bgColor: 'rgba(74, 26, 107, 0.25)',
  },
  abundance: {
    label: 'Abundance',
    color: DESIGN_COLORS.accentGreen,
    bgColor: 'rgba(45, 90, 74, 0.15)',
  },
};

/**
 * AffirmationCard component props
 */
export interface AffirmationCardProps {
  affirmation: AffirmationData;
  onToggleFavorite: (id: string) => void;
  onPress?: (affirmation: AffirmationData) => void;
  showCategory?: boolean;
  size?: 'small' | 'medium' | 'large';
}

/**
 * AffirmationCard Component
 */
const AffirmationCard: React.FC<AffirmationCardProps> = ({
  affirmation,
  onToggleFavorite,
  onPress,
  showCategory = true,
  size = 'large',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  const categoryConfig = CATEGORY_CONFIG[affirmation.category];

  /**
   * Handle favorite toggle with animation
   */
  const handleFavoriteToggle = useCallback(() => {
    Haptics.impactAsync(
      affirmation.isFavorite
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Medium
    );

    // Heart bounce animation
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    onToggleFavorite(affirmation.id);
  }, [affirmation.id, affirmation.isFavorite, onToggleFavorite, heartScale]);

  /**
   * Handle card press
   */
  const handlePress = useCallback(() => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress(affirmation);
    }
  }, [affirmation, onPress]);

  /**
   * Handle press in animation
   */
  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  /**
   * Handle press out animation
   */
  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  // Size-based styles
  const sizeStyles = {
    small: {
      padding: 16,
      fontSize: 16,
      lineHeight: 24,
    },
    medium: {
      padding: 20,
      fontSize: 20,
      lineHeight: 30,
    },
    large: {
      padding: 28,
      fontSize: 24,
      lineHeight: 36,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={[
          styles.container,
          { padding: currentSize.padding },
          { backgroundColor: categoryConfig.bgColor },
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={!onPress}
        testID={`affirmation-card-${affirmation.id}`}
        accessibilityRole="button"
        accessibilityLabel={`Affirmation: ${affirmation.text}`}
        accessibilityHint={onPress ? 'Double tap to select this affirmation' : undefined}
      >
        {/* Category Badge */}
        {showCategory && (
          <View
            style={[styles.categoryBadge, { borderColor: categoryConfig.color }]}
            accessibilityLabel={`Category: ${categoryConfig.label}`}
          >
            <Text style={[styles.categoryText, { color: categoryConfig.color }]}>
              {categoryConfig.label}
            </Text>
          </View>
        )}

        {/* Affirmation Text */}
        <Text
          style={[
            styles.affirmationText,
            { fontSize: currentSize.fontSize, lineHeight: currentSize.lineHeight },
          ]}
          accessibilityRole="text"
        >
          "{affirmation.text}"
        </Text>

        {/* Custom Badge */}
        {affirmation.isCustom && (
          <View style={styles.customBadge}>
            <Text style={styles.customBadgeText}>Your Affirmation</Text>
          </View>
        )}

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoriteToggle}
          accessibilityRole="button"
          accessibilityLabel={
            affirmation.isFavorite
              ? 'Remove from favorites'
              : 'Add to favorites'
          }
          accessibilityState={{ selected: affirmation.isFavorite }}
          testID={`favorite-button-${affirmation.id}`}
        >
          <Animated.Text
            style={[
              styles.favoriteIcon,
              affirmation.isFavorite && styles.favoriteIconActive,
              { transform: [{ scale: heartScale }] },
            ]}
          >
            {affirmation.isFavorite ? '\u2665' : '\u2661'}
          </Animated.Text>
        </TouchableOpacity>

        {/* Decorative Quote Marks */}
        <Text style={styles.quoteMarkStart}>"</Text>
        <Text style={styles.quoteMarkEnd}>"</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    position: 'relative',
    overflow: 'hidden',
  },

  // Category badge
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Affirmation text
  affirmationText: {
    color: DESIGN_COLORS.textPrimary,
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 16,
    marginVertical: 12,
  },

  // Custom badge
  customBadge: {
    alignSelf: 'center',
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(201, 162, 39, 0.2)',
    borderRadius: 8,
  },
  customBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: DESIGN_COLORS.accentGold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Favorite button
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  favoriteIcon: {
    fontSize: 24,
    color: DESIGN_COLORS.textTertiary,
  },
  favoriteIconActive: {
    color: DESIGN_COLORS.accentRose,
  },

  // Decorative quotes
  quoteMarkStart: {
    position: 'absolute',
    top: 20,
    left: 16,
    fontSize: 60,
    color: 'rgba(255, 255, 255, 0.05)',
    fontWeight: '700',
  },
  quoteMarkEnd: {
    position: 'absolute',
    bottom: 0,
    right: 16,
    fontSize: 60,
    color: 'rgba(255, 255, 255, 0.05)',
    fontWeight: '700',
  },
});

export default AffirmationCard;
