/**
 * SignCard Component
 *
 * A card component for logging synchronicities and meaningful coincidences
 * in Phase 9: Trust & Surrender. Users can document signs they notice.
 *
 * Features:
 * - Entry fields: Date, What happened, What it might mean, How it made you feel
 * - Categories: Numbers, Animals, People, Events, Dreams, Other
 * - Photo attachment option (placeholder)
 * - Expandable/collapsible view
 *
 * Design (from APP-DESIGN.md):
 * - Background: #1a1a2e (deep charcoal)
 * - Elevated surfaces: #252547
 * - Accent gold: #c9a227 for highlights
 * - Mystical, spiritual aesthetic
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Image,
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
  accentRose: '#8b3a5f',
  accentGreen: '#2d5a4a',
  accentAmber: '#8b6914',
  border: '#3a3a5a',
};

/**
 * Sign Category Type
 */
export type SignCategory =
  | 'numbers'
  | 'animals'
  | 'people'
  | 'events'
  | 'dreams'
  | 'other';

/**
 * Sign Category Configuration
 */
export interface SignCategoryConfig {
  key: SignCategory;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export const SIGN_CATEGORIES: SignCategoryConfig[] = [
  {
    key: 'numbers',
    label: 'Numbers',
    icon: '\u0023\ufe0f\u20e3',
    color: DESIGN_COLORS.accentGold,
    description: 'Repeating numbers, angel numbers, significant dates',
  },
  {
    key: 'animals',
    label: 'Animals',
    icon: '\u{1f98b}',
    color: DESIGN_COLORS.accentGreen,
    description: 'Spirit animals, unusual animal encounters',
  },
  {
    key: 'people',
    label: 'People',
    icon: '\u{1f465}',
    color: DESIGN_COLORS.accentTeal,
    description: 'Chance meetings, messages from others',
  },
  {
    key: 'events',
    label: 'Events',
    icon: '\u2728',
    color: DESIGN_COLORS.accentPurple,
    description: 'Meaningful coincidences, perfect timing',
  },
  {
    key: 'dreams',
    label: 'Dreams',
    icon: '\u{1f319}',
    color: DESIGN_COLORS.accentRose,
    description: 'Vivid dreams, recurring themes, prophetic visions',
  },
  {
    key: 'other',
    label: 'Other',
    icon: '\u{1f52e}',
    color: DESIGN_COLORS.accentAmber,
    description: 'Songs, quotes, physical sensations, intuitions',
  },
];

/**
 * Sign Entry Data
 */
export interface SignEntryData {
  id: string;
  date: string;
  category: SignCategory;
  whatHappened: string;
  possibleMeaning: string;
  howItFelt: string;
  photoUri?: string;
  isRecurring: boolean;
  createdAt: string;
}

/**
 * Component Props
 */
export interface SignCardProps {
  entry: SignEntryData;
  onCategoryChange: (id: string, category: SignCategory) => void;
  onWhatHappenedChange: (id: string, text: string) => void;
  onMeaningChange: (id: string, text: string) => void;
  onFeelingChange: (id: string, text: string) => void;
  onPhotoChange?: (id: string, uri: string | undefined) => void;
  onRecurringToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

/**
 * SignCard Component
 */
export const SignCard: React.FC<SignCardProps> = ({
  entry,
  onCategoryChange,
  onWhatHappenedChange,
  onMeaningChange,
  onFeelingChange,
  onPhotoChange,
  onRecurringToggle,
  onDelete,
  isExpanded = true,
  onToggleExpand,
}) => {
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const selectedCategory = SIGN_CATEGORIES.find((c) => c.key === entry.category);

  /**
   * Handle category selection
   */
  const handleCategorySelect = (category: SignCategory) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChange(entry.id, category);
    setShowCategoryPicker(false);
  };

  /**
   * Toggle recurring status
   */
  const handleRecurringToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRecurringToggle(entry.id);
  };

  /**
   * Handle delete
   */
  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onDelete) {
      onDelete(entry.id);
    }
  };

  /**
   * Handle photo add (placeholder)
   */
  const handleAddPhoto = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement image picker
    console.log('Photo picker would open here');
    if (onPhotoChange) {
      // Simulating photo selection
      onPhotoChange(entry.id, undefined);
    }
  };

  /**
   * Toggle expand/collapse
   */
  const handleToggleExpand = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onToggleExpand) {
      onToggleExpand();
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View
      style={styles.container}
      accessibilityRole="article"
      accessibilityLabel={`Synchronicity entry: ${entry.whatHappened || 'New entry'}`}
    >
      {/* Header */}
      <Pressable
        style={styles.header}
        onPress={handleToggleExpand}
        accessibilityRole="button"
        accessibilityLabel={isExpanded ? 'Collapse entry' : 'Expand entry'}
      >
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: `${selectedCategory?.color || DESIGN_COLORS.accentGold}30` },
          ]}
        >
          <Text style={styles.categoryIcon}>{selectedCategory?.icon}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerDate}>{formatDate(entry.date)}</Text>
          <Text style={styles.headerCategory}>{selectedCategory?.label}</Text>
          {entry.isRecurring && (
            <View style={styles.recurringBadge}>
              <Text style={styles.recurringBadgeText}>{'\u{1f501}'} Recurring</Text>
            </View>
          )}
        </View>
        <View style={styles.headerActions}>
          {onDelete && (
            <Pressable
              style={styles.deleteButton}
              onPress={handleDelete}
              accessibilityRole="button"
              accessibilityLabel="Delete this entry"
            >
              <Text style={styles.deleteButtonText}>{'\u00d7'}</Text>
            </Pressable>
          )}
          <Text style={styles.expandIcon}>{isExpanded ? '\u25b2' : '\u25bc'}</Text>
        </View>
      </Pressable>

      {/* Collapsed Preview */}
      {!isExpanded && entry.whatHappened && (
        <Text style={styles.previewText} numberOfLines={2}>
          {entry.whatHappened}
        </Text>
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.content}>
          {/* Category Selector */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Category</Text>
            <Pressable
              style={styles.categorySelector}
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              accessibilityRole="button"
              accessibilityLabel="Select category"
            >
              <Text style={styles.categorySelectorIcon}>{selectedCategory?.icon}</Text>
              <Text style={styles.categorySelectorText}>{selectedCategory?.label}</Text>
              <Text style={styles.categorySelectorArrow}>{showCategoryPicker ? '\u25b2' : '\u25bc'}</Text>
            </Pressable>
            {showCategoryPicker && (
              <View style={styles.categoryPicker}>
                {SIGN_CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat.key}
                    style={[
                      styles.categoryOption,
                      entry.category === cat.key && styles.categoryOptionSelected,
                    ]}
                    onPress={() => handleCategorySelect(cat.key)}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${cat.label} category`}
                  >
                    <Text style={styles.categoryOptionIcon}>{cat.icon}</Text>
                    <View style={styles.categoryOptionInfo}>
                      <Text style={styles.categoryOptionLabel}>{cat.label}</Text>
                      <Text style={styles.categoryOptionDesc}>{cat.description}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* What Happened */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>What Happened?</Text>
            <TextInput
              style={styles.textInput}
              value={entry.whatHappened}
              onChangeText={(text) => onWhatHappenedChange(entry.id, text)}
              placeholder="Describe the synchronicity or sign you noticed..."
              placeholderTextColor={DESIGN_COLORS.textTertiary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              accessibilityLabel="What happened"
              accessibilityHint="Describe what you observed or experienced"
            />
          </View>

          {/* What It Might Mean */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>What Might This Mean?</Text>
            <TextInput
              style={styles.textInput}
              value={entry.possibleMeaning}
              onChangeText={(text) => onMeaningChange(entry.id, text)}
              placeholder="What message or meaning could this hold for you?"
              placeholderTextColor={DESIGN_COLORS.textTertiary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              accessibilityLabel="Possible meaning"
              accessibilityHint="Interpret what this sign might mean for you"
            />
          </View>

          {/* How It Made You Feel */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>How Did It Make You Feel?</Text>
            <TextInput
              style={styles.textInput}
              value={entry.howItFelt}
              onChangeText={(text) => onFeelingChange(entry.id, text)}
              placeholder="Describe your emotional response..."
              placeholderTextColor={DESIGN_COLORS.textTertiary}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
              accessibilityLabel="How it felt"
              accessibilityHint="Describe your emotional reaction"
            />
          </View>

          {/* Photo Attachment */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Photo (Optional)</Text>
            {entry.photoUri ? (
              <View style={styles.photoContainer}>
                <Image source={{ uri: entry.photoUri }} style={styles.photo} />
                <Pressable
                  style={styles.removePhotoButton}
                  onPress={() => onPhotoChange?.(entry.id, undefined)}
                  accessibilityRole="button"
                  accessibilityLabel="Remove photo"
                >
                  <Text style={styles.removePhotoText}>{'\u00d7'}</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={styles.addPhotoButton}
                onPress={handleAddPhoto}
                accessibilityRole="button"
                accessibilityLabel="Add a photo"
              >
                <Text style={styles.addPhotoIcon}>{'\u{1f4f7}'}</Text>
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </Pressable>
            )}
          </View>

          {/* Recurring Toggle */}
          <Pressable
            style={styles.recurringToggle}
            onPress={handleRecurringToggle}
            accessibilityRole="checkbox"
            accessibilityLabel="Mark as recurring sign"
            accessibilityState={{ checked: entry.isRecurring }}
          >
            <View
              style={[
                styles.checkbox,
                entry.isRecurring && styles.checkboxChecked,
              ]}
            >
              {entry.isRecurring && (
                <Text style={styles.checkboxIcon}>{'\u2713'}</Text>
              )}
            </View>
            <View style={styles.recurringInfo}>
              <Text style={styles.recurringLabel}>This is a recurring sign</Text>
              <Text style={styles.recurringHint}>
                Mark this if you've seen this sign multiple times
              </Text>
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_COLORS.border,
  },
  categoryBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryIcon: {
    fontSize: 20,
  },
  headerInfo: {
    flex: 1,
  },
  headerDate: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 2,
  },
  headerCategory: {
    fontSize: 12,
    color: DESIGN_COLORS.textSecondary,
  },
  recurringBadge: {
    marginTop: 4,
    backgroundColor: `${DESIGN_COLORS.accentGold}20`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  recurringBadgeText: {
    fontSize: 10,
    color: DESIGN_COLORS.accentGold,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: DESIGN_COLORS.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  deleteButtonText: {
    fontSize: 18,
    color: DESIGN_COLORS.textTertiary,
  },
  expandIcon: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
  },
  previewText: {
    fontSize: 13,
    color: DESIGN_COLORS.textSecondary,
    paddingHorizontal: 14,
    paddingBottom: 14,
    fontStyle: 'italic',
  },
  content: {
    padding: 14,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: DESIGN_COLORS.textPrimary,
    lineHeight: 22,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    minHeight: 70,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  categorySelectorIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  categorySelectorText: {
    flex: 1,
    fontSize: 15,
    color: DESIGN_COLORS.textPrimary,
  },
  categorySelectorArrow: {
    fontSize: 10,
    color: DESIGN_COLORS.textTertiary,
  },
  categoryPicker: {
    marginTop: 8,
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    overflow: 'hidden',
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_COLORS.border,
  },
  categoryOptionSelected: {
    backgroundColor: `${DESIGN_COLORS.accentGold}20`,
  },
  categoryOptionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  categoryOptionInfo: {
    flex: 1,
  },
  categoryOptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 2,
  },
  categoryOptionDesc: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: DESIGN_COLORS.border,
    borderStyle: 'dashed',
  },
  addPhotoIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  addPhotoText: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
  },
  photoContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePhotoText: {
    fontSize: 18,
    color: DESIGN_COLORS.textPrimary,
  },
  recurringToggle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: DESIGN_COLORS.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: DESIGN_COLORS.accentGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: DESIGN_COLORS.accentGold,
  },
  checkboxIcon: {
    fontSize: 14,
    color: DESIGN_COLORS.bgPrimary,
    fontWeight: '700',
  },
  recurringInfo: {
    flex: 1,
  },
  recurringLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 2,
  },
  recurringHint: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
  },
});

export default SignCard;
