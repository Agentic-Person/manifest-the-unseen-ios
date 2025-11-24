/**
 * RoleModelCard Component
 *
 * Displays a role model with photo, inspiration notes, and lessons learned.
 * Used in Phase 8 Role Models exercise.
 *
 * Features:
 * - Optional photo with placeholder avatar
 * - Category badge with color coding
 * - Expandable lessons learned section
 * - Quote display (optional)
 * - Edit and delete actions
 * - Haptic feedback on interactions
 * - Dark spiritual theme
 *
 * @example
 * ```tsx
 * <RoleModelCard
 *   roleModel={roleModelData}
 *   onEdit={() => editRoleModel(roleModel.id)}
 *   onDelete={() => deleteRoleModel(roleModel.id)}
 *   onPickPhoto={() => pickPhoto(roleModel.id)}
 * />
 * ```
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '../Text';
import { colors, spacing, borderRadius, shadows } from '../../theme';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * Role model categories with their colors and icons
 */
export const ROLE_MODEL_CATEGORIES = {
  career: {
    label: 'Career',
    color: '#2563eb',
    icon: '\u{1F4BC}', // Briefcase
  },
  personalGrowth: {
    label: 'Personal Growth',
    color: '#9333ea',
    icon: '\u{1F331}', // Seedling
  },
  relationships: {
    label: 'Relationships',
    color: '#db2777',
    icon: '\u{1F49D}', // Heart ribbon
  },
  health: {
    label: 'Health',
    color: '#16a34a',
    icon: '\u{1F3CB}', // Weight lifter
  },
  creativity: {
    label: 'Creativity',
    color: '#d97706',
    icon: '\u{1F3A8}', // Artist palette
  },
} as const;

export type RoleModelCategory = keyof typeof ROLE_MODEL_CATEGORIES;

/**
 * Role model data structure
 */
export interface RoleModel {
  id: string;
  name: string;
  photoUri?: string;
  category: RoleModelCategory;
  inspiration: string; // What inspires you about them
  lessons: string[]; // Lessons learned from them
  quote?: string; // Optional quote from them
  createdAt: string;
  updatedAt: string;
}

/**
 * Props for RoleModelCard component
 */
export interface RoleModelCardProps {
  /** The role model to display */
  roleModel: RoleModel;

  /** Called when edit is pressed */
  onEdit: () => void;

  /** Called when delete is confirmed */
  onDelete: () => void;

  /** Called when photo should be picked */
  onPickPhoto: () => void;

  /** Test ID for automation */
  testID?: string;
}

/**
 * Avatar placeholder component
 */
const AvatarPlaceholder: React.FC<{ name: string; color: string }> = ({ name, color }) => {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View style={[styles.avatarPlaceholder, { backgroundColor: `${color}40` }]}>
      <Text style={[styles.avatarInitials, { color }]}>{initials}</Text>
    </View>
  );
};

/**
 * RoleModelCard Component
 */
export const RoleModelCard: React.FC<RoleModelCardProps> = ({
  roleModel,
  onEdit,
  onDelete,
  onPickPhoto,
  testID,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const category = ROLE_MODEL_CATEGORIES[roleModel.category];

  /**
   * Toggle expanded state with animation
   */
  const toggleExpanded = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpanded((prev) => !prev);
  }, []);

  /**
   * Handle edit press with haptic feedback
   */
  const handleEdit = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onEdit();
  }, [onEdit]);

  /**
   * Handle delete with confirmation
   */
  const handleDelete = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Remove Role Model',
      `Are you sure you want to remove ${roleModel.name} from your role models?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onDelete();
          },
        },
      ]
    );
  }, [onDelete, roleModel.name]);

  /**
   * Handle photo press
   */
  const handlePhotoPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPickPhoto();
  }, [onPickPhoto]);

  return (
    <View
      style={[styles.container, { borderTopColor: category.color }]}
      testID={testID}
      accessible
      accessibilityRole="none"
      accessibilityLabel={`Role model: ${roleModel.name}, Category: ${category.label}`}
    >
      {/* Header Row */}
      <View style={styles.header}>
        {/* Photo/Avatar */}
        <TouchableOpacity
          onPress={handlePhotoPress}
          accessibilityRole="button"
          accessibilityLabel={roleModel.photoUri ? 'Change photo' : 'Add photo'}
          testID={`${testID}-photo`}
        >
          {roleModel.photoUri ? (
            <Image
              source={{ uri: roleModel.photoUri }}
              style={styles.avatar}
              accessibilityLabel={`Photo of ${roleModel.name}`}
            />
          ) : (
            <AvatarPlaceholder name={roleModel.name} color={category.color} />
          )}
          <View style={styles.photoEditBadge}>
            <Text style={styles.photoEditIcon}>{'\u{1F4F7}'}</Text>
          </View>
        </TouchableOpacity>

        {/* Name and Category */}
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{roleModel.name}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: `${category.color}25` }]}>
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[styles.categoryText, { color: category.color }]}>
              {category.label}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEdit}
            accessibilityRole="button"
            accessibilityLabel="Edit role model"
            testID={`${testID}-edit`}
          >
            <Text style={styles.actionIcon}>{'\u270F\uFE0F'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDelete}
            accessibilityRole="button"
            accessibilityLabel="Delete role model"
            testID={`${testID}-delete`}
          >
            <Text style={styles.actionIcon}>{'\uD83D\uDDD1\uFE0F'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Inspiration */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{'\u{2728}'} What inspires me</Text>
        <Text style={styles.inspirationText}>{roleModel.inspiration}</Text>
      </View>

      {/* Quote (if provided) */}
      {roleModel.quote && (
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>"{roleModel.quote}"</Text>
          <Text style={styles.quoteAuthor}>- {roleModel.name}</Text>
        </View>
      )}

      {/* Lessons Toggle */}
      <TouchableOpacity
        style={styles.lessonsToggle}
        onPress={toggleExpanded}
        accessibilityRole="button"
        accessibilityLabel={isExpanded ? 'Hide lessons' : 'Show lessons'}
        testID={`${testID}-lessons-toggle`}
      >
        <Text style={styles.lessonsToggleText}>
          {'\u{1F4DA}'} Lessons Learned ({roleModel.lessons.length})
        </Text>
        <Text style={styles.lessonsToggleIcon}>
          {isExpanded ? '\u{1F53C}' : '\u{1F53D}'}
        </Text>
      </TouchableOpacity>

      {/* Expanded Lessons */}
      {isExpanded && (
        <View style={styles.lessonsContainer}>
          {roleModel.lessons.length === 0 ? (
            <Text style={styles.noLessonsText}>
              No lessons added yet. Tap edit to add what you've learned.
            </Text>
          ) : (
            roleModel.lessons.map((lesson, index) => (
              <View key={index} style={styles.lessonItem}>
                <Text style={styles.lessonBullet}>{'\u{1F4A1}'}</Text>
                <Text style={styles.lessonText}>{lesson}</Text>
              </View>
            ))
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
    padding: spacing.md,
    marginBottom: spacing.md,
    borderTopWidth: 4,
    ...shadows.sm,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },

  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarInitials: {
    fontSize: 20,
    fontWeight: '700',
  },

  photoEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.dark.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.dark.bgElevated,
  },

  photoEditIcon: {
    fontSize: 10,
  },

  headerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginBottom: spacing.xs,
  },

  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    gap: spacing.xs,
  },

  categoryIcon: {
    fontSize: 12,
  },

  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  actions: {
    flexDirection: 'column',
    gap: spacing.xs,
  },

  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.dark.textTertiary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionIcon: {
    fontSize: 14,
  },

  section: {
    marginBottom: spacing.md,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark.accentGold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },

  inspirationText: {
    fontSize: 15,
    color: colors.dark.textPrimary,
    lineHeight: 22,
  },

  quoteContainer: {
    backgroundColor: `${colors.dark.accentPurple}15`,
    borderLeftWidth: 3,
    borderLeftColor: colors.dark.accentPurple,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  quoteText: {
    fontSize: 14,
    color: colors.dark.textPrimary,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: spacing.xs,
  },

  quoteAuthor: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    textAlign: 'right',
  },

  lessonsToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: `${colors.dark.textTertiary}20`,
  },

  lessonsToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.dark.textSecondary,
  },

  lessonsToggleIcon: {
    fontSize: 14,
  },

  lessonsContainer: {
    paddingTop: spacing.sm,
  },

  lessonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },

  lessonBullet: {
    fontSize: 14,
    marginTop: 2,
  },

  lessonText: {
    flex: 1,
    fontSize: 14,
    color: colors.dark.textPrimary,
    lineHeight: 20,
  },

  noLessonsText: {
    fontSize: 14,
    color: colors.dark.textTertiary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
});

export default RoleModelCard;
