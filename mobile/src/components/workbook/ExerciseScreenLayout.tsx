/**
 * Exercise Screen Layout
 *
 * A reusable layout component for all workbook exercise screens.
 * Provides:
 * - Scrollable content area
 * - Sticky completion button at the bottom
 * - Proper safe area handling
 * - Consistent spacing and styling
 *
 * Usage:
 * ```tsx
 * <ExerciseScreenLayout
 *   completionProps={{
 *     isCompleted: savedProgress?.completed || false,
 *     canComplete,
 *     isAutoCompleted,
 *     isSaving,
 *     onPress: markComplete,
 *   }}
 * >
 *   <ExerciseHeader ... />
 *   {/* Exercise content *\/}
 *   <SaveIndicator ... />
 * </ExerciseScreenLayout>
 * ```
 */

import React, { ReactNode, forwardRef } from 'react';
import { View, ScrollView, StyleSheet, ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StickyCompletionButton } from './StickyCompletionButton';
import { spacing } from '../../theme';

interface CompletionProps {
  isCompleted: boolean;
  canComplete: boolean;
  isAutoCompleted: boolean;
  isSaving: boolean;
  onPress: () => void;
  /** Optional callback to trigger navigation after completion */
  onComplete?: () => void;
}

interface ExerciseScreenLayoutProps extends Omit<ScrollViewProps, 'children'> {
  children: ReactNode;
  completionProps: CompletionProps;
  /** Background color for the container (default: #1a1a2e) */
  backgroundColor?: string;
  /** Additional padding at the bottom for content above the sticky button */
  extraBottomPadding?: number;
}

export const ExerciseScreenLayout = forwardRef<ScrollView, ExerciseScreenLayoutProps>(
  (
    {
      children,
      completionProps,
      backgroundColor = '#1a1a2e',
      extraBottomPadding = 0,
      style,
      contentContainerStyle,
      ...scrollViewProps
    },
    ref
  ) => {
    const insets = useSafeAreaInsets();

    // Calculate padding needed at the bottom of scroll content to ensure
    // it doesn't get hidden behind the sticky button (approx 100px for button + hints)
    const stickyButtonHeight = 100 + Math.max(insets.bottom, spacing.md);

    return (
      <View style={[styles.container, { backgroundColor }]}>
        <ScrollView
          ref={ref}
          style={[styles.scrollView, style]}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: stickyButtonHeight + extraBottomPadding },
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          {...scrollViewProps}
        >
          {children}
        </ScrollView>

        <StickyCompletionButton
          isCompleted={completionProps.isCompleted}
          canComplete={completionProps.canComplete}
          isAutoCompleted={completionProps.isAutoCompleted}
          isSaving={completionProps.isSaving}
          onPress={completionProps.onPress}
          onComplete={completionProps.onComplete}
        />
      </View>
    );
  }
);

ExerciseScreenLayout.displayName = 'ExerciseScreenLayout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
});
