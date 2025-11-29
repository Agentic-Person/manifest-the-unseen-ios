/**
 * Loading Component
 *
 * Spinner and skeleton loading states
 * Supports multiple variants for different use cases
 *
 * @example
 * ```tsx
 * <Loading variant="spinner" size={50} />
 * <Loading variant="skeleton" type="text" />
 * ```
 */

import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors, spacing, borderRadius } from '../theme';

export type LoadingVariant = 'spinner' | 'skeleton';
export type SkeletonType = 'text' | 'image' | 'card';
export type LoadingSize = 'small' | 'large';

export interface LoadingProps {
  /** Loading variant */
  variant?: LoadingVariant;

  /** Skeleton type (only for variant="skeleton") */
  skeletonType?: SkeletonType;

  /** Size */
  size?: LoadingSize;

  /** Custom color (only for spinner) */
  color?: string;

  /** Custom style */
  style?: ViewStyle;

  /** Accessibility label */
  accessibilityLabel?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  skeletonType = 'text',
  size = 'large',
  color = colors.primary[600],
  style,
  accessibilityLabel = 'Loading',
}) => {
  if (variant === 'spinner') {
    return (
      <View
        style={[styles.spinnerContainer, style]}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={accessibilityLabel}
      >
        <ActivityIndicator
          size={size}
          color={color}
        />
      </View>
    );
  }

  // Skeleton variant
  return (
    <View
      style={[styles.skeletonContainer, style]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
    >
      {skeletonType === 'text' && (
        <>
          <View style={[styles.skeletonLine, styles.skeletonLineLong]} />
          <View style={[styles.skeletonLine, styles.skeletonLineMedium]} />
          <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
        </>
      )}

      {skeletonType === 'image' && (
        <View style={styles.skeletonImage} />
      )}

      {skeletonType === 'card' && (
        <View style={styles.skeletonCard}>
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonLine} />
          <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },

  skeletonContainer: {
    width: '100%',
  },

  skeletonLine: {
    height: 12,
    backgroundColor: colors.gray[700],
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },

  skeletonLineLong: {
    width: '100%',
  },

  skeletonLineMedium: {
    width: '80%',
  },

  skeletonLineShort: {
    width: '60%',
  },

  skeletonImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.gray[700],
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },

  skeletonCard: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
});
