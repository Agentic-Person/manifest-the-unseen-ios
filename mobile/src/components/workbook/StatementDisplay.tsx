/**
 * StatementDisplay Component
 *
 * A beautifully styled display for the user's generated purpose statement.
 * Features elegant typography with a serif-like feel and the ability to edit.
 *
 * Design follows APP-DESIGN.md specifications:
 * - Dark spiritual theme
 * - Elegant serif/script font feel
 * - Muted gold accents for enlightenment
 * - Card with subtle inner glow
 *
 * @example
 * ```tsx
 * <StatementDisplay
 *   statement="My purpose is to inspire others..."
 *   isEditing={isEditing}
 *   onStatementChange={setStatement}
 *   onEditToggle={() => setIsEditing(!isEditing)}
 * />
 * ```
 */

import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Text } from '../Text';
import { colors, spacing, borderRadius, typography, fontWeights } from '../../theme';

/**
 * Props for the StatementDisplay component
 */
export interface StatementDisplayProps {
  /** The purpose statement text */
  statement: string;
  /** Whether the statement is in edit mode */
  isEditing: boolean;
  /** Callback when statement changes (during editing) */
  onStatementChange: (text: string) => void;
  /** Callback to toggle edit mode */
  onEditToggle: () => void;
  /** Test ID for automation */
  testID?: string;
}

/**
 * StatementDisplay Component
 */
export const StatementDisplay: React.FC<StatementDisplayProps> = ({
  statement,
  isEditing,
  onStatementChange,
  onEditToggle,
  testID,
}) => {
  return (
    <View style={styles.container} testID={testID}>
      {/* Header with decorative elements */}
      <View style={styles.headerContainer}>
        <View style={styles.decorativeLine} />
        <Text style={styles.headerText}>Your Purpose Statement</Text>
        <View style={styles.decorativeLine} />
      </View>

      {/* Sacred geometry inspired frame */}
      <View style={styles.frameOuter}>
        <View style={styles.frameInner}>
          {/* Corner decorations */}
          <View style={[styles.cornerDecoration, styles.cornerTopLeft]} />
          <View style={[styles.cornerDecoration, styles.cornerTopRight]} />
          <View style={[styles.cornerDecoration, styles.cornerBottomLeft]} />
          <View style={[styles.cornerDecoration, styles.cornerBottomRight]} />

          {/* Statement content */}
          {isEditing ? (
            <TextInput
              style={styles.statementInput}
              value={statement}
              onChangeText={onStatementChange}
              multiline
              textAlignVertical="top"
              placeholder="Your purpose statement will appear here..."
              placeholderTextColor={colors.dark.textTertiary}
              accessibilityLabel="Edit your purpose statement"
              testID={`${testID}-input`}
            />
          ) : (
            <Text style={styles.statementText} testID={`${testID}-text`}>
              {statement || 'Your purpose statement will be generated from your answers...'}
            </Text>
          )}
        </View>
      </View>

      {/* Edit toggle button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={onEditToggle}
        accessibilityRole="button"
        accessibilityLabel={isEditing ? 'Save changes' : 'Edit statement'}
        testID={`${testID}-edit-button`}
      >
        <Text style={styles.editButtonText}>
          {isEditing ? 'Done Editing' : 'Personalize Your Statement'}
        </Text>
      </TouchableOpacity>

      {/* Inspirational footer */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerQuote}>
          "When you know your purpose, you know your path."
        </Text>
      </View>
    </View>
  );
};

/**
 * Styles following APP-DESIGN.md dark spiritual theme
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },

  decorativeLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.dark.accentGold,
    opacity: 0.4,
    maxWidth: 60,
  },

  headerText: {
    ...typography.h3,
    fontSize: 18,
    fontWeight: fontWeights.semibold as any,
    color: colors.dark.accentGold,
    marginHorizontal: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  frameOuter: {
    backgroundColor: 'rgba(74, 26, 107, 0.15)',
    borderRadius: borderRadius.xl,
    padding: spacing.xs,
    marginBottom: spacing.xl,
    shadowColor: colors.dark.accentPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },

  frameInner: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    minHeight: 200,
    position: 'relative',
    // Inner glow effect
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 39, 0.2)',
  },

  cornerDecoration: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: colors.dark.accentGold,
    opacity: 0.5,
  },

  cornerTopLeft: {
    top: spacing.sm,
    left: spacing.sm,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 4,
  },

  cornerTopRight: {
    top: spacing.sm,
    right: spacing.sm,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 4,
  },

  cornerBottomLeft: {
    bottom: spacing.sm,
    left: spacing.sm,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 4,
  },

  cornerBottomRight: {
    bottom: spacing.sm,
    right: spacing.sm,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 4,
  },

  statementText: {
    ...typography.body,
    fontSize: 18,
    color: colors.dark.textPrimary,
    lineHeight: 32,
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },

  statementInput: {
    ...typography.body,
    fontSize: 18,
    color: colors.dark.textPrimary,
    lineHeight: 32,
    textAlign: 'center',
    minHeight: 150,
    letterSpacing: 0.3,
  },

  editButton: {
    alignSelf: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.dark.accentGold,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xl,
  },

  editButtonText: {
    ...typography.bodySmall,
    fontSize: 14,
    color: colors.dark.accentGold,
    fontWeight: fontWeights.medium as any,
    letterSpacing: 0.5,
  },

  footerContainer: {
    marginTop: 'auto',
    paddingTop: spacing.lg,
  },

  footerQuote: {
    ...typography.bodySmall,
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.dark.textSecondary,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default StatementDisplay;
