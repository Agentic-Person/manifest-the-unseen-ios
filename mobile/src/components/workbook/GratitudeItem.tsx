/**
 * GratitudeItem Component
 *
 * A single gratitude entry with category selection and optional photo attachment.
 * Used in the Daily Gratitude Journal screen.
 *
 * Features:
 * - Text input for gratitude item
 * - Category selector (People, Experiences, Things, Opportunities, Growth)
 * - Optional photo attachment via expo-image-picker
 * - Delete functionality
 * - Haptic feedback on interactions
 *
 * Design (from APP-DESIGN.md):
 * - Background: #252547 (elevated surface)
 * - Text: #e8e8e8 (soft off-white)
 * - Accent gold: #c9a227 for selected states
 * - Category colors match theme
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';

// Design system colors from APP-DESIGN.md
const DESIGN_COLORS = {
  bgPrimary: '#1a1a2e',
  bgElevated: '#252547',
  textPrimary: '#e8e8e8',
  textSecondary: '#a0a0b0',
  textTertiary: '#6b6b80',
  accentGold: '#c9a227',
  accentPurple: '#4a1a6b',
  accentTeal: '#1a5f5f',
  accentGreen: '#2d5a4a',
  accentRose: '#8b3a5f',
  accentAmber: '#8b6914',
  border: '#3a3a5a',
  error: '#dc2626',
};

// Category configuration with colors
export const GRATITUDE_CATEGORIES = {
  people: {
    label: 'People',
    color: DESIGN_COLORS.accentRose,
    icon: 'heart',
  },
  experiences: {
    label: 'Experiences',
    color: DESIGN_COLORS.accentPurple,
    icon: 'star',
  },
  things: {
    label: 'Things',
    color: DESIGN_COLORS.accentAmber,
    icon: 'gift',
  },
  opportunities: {
    label: 'Opportunities',
    color: DESIGN_COLORS.accentTeal,
    icon: 'door',
  },
  growth: {
    label: 'Growth',
    color: DESIGN_COLORS.accentGreen,
    icon: 'leaf',
  },
} as const;

export type GratitudeCategory = keyof typeof GRATITUDE_CATEGORIES;

export interface GratitudeItemData {
  id: string;
  text: string;
  category: GratitudeCategory;
  photoUri?: string;
  createdAt: string;
}

export interface GratitudeItemProps {
  /** The gratitude item data */
  item: GratitudeItemData;
  /** Callback when text changes */
  onTextChange: (id: string, text: string) => void;
  /** Callback when category changes */
  onCategoryChange: (id: string, category: GratitudeCategory) => void;
  /** Callback when photo is added/changed */
  onPhotoChange: (id: string, photoUri: string | undefined) => void;
  /** Callback when item is deleted */
  onDelete: (id: string) => void;
  /** Index number for display */
  index: number;
}

/**
 * GratitudeItem Component
 */
export const GratitudeItem: React.FC<GratitudeItemProps> = ({
  item,
  onTextChange,
  onCategoryChange,
  onPhotoChange,
  onDelete,
  index,
}) => {
  const [showCategories, setShowCategories] = useState(false);

  /**
   * Handle image picker
   */
  const handleAddPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant photo library access to add images.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onPhotoChange(item.id, result.assets[0].uri);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  /**
   * Handle photo removal
   */
  const handleRemovePhoto = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPhotoChange(item.id, undefined);
  };

  /**
   * Handle category selection
   */
  const handleCategorySelect = (category: GratitudeCategory) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onCategoryChange(item.id, category);
    setShowCategories(false);
  };

  /**
   * Handle delete with confirmation
   */
  const handleDelete = () => {
    Alert.alert(
      'Delete Gratitude',
      'Are you sure you want to remove this gratitude item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            onDelete(item.id);
          },
        },
      ]
    );
  };

  const categoryConfig = GRATITUDE_CATEGORIES[item.category];

  return (
    <View style={styles.container}>
      {/* Header with index and delete */}
      <View style={styles.header}>
        <View style={styles.indexBadge}>
          <Text style={styles.indexText}>{index}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          accessibilityRole="button"
          accessibilityLabel={`Delete gratitude item ${index}`}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.deleteText}>Remove</Text>
        </TouchableOpacity>
      </View>

      {/* Text Input */}
      <TextInput
        style={styles.textInput}
        value={item.text}
        onChangeText={(text) => onTextChange(item.id, text)}
        placeholder="What are you grateful for?"
        placeholderTextColor={DESIGN_COLORS.textTertiary}
        multiline
        numberOfLines={3}
        maxLength={500}
        accessibilityLabel={`Gratitude item ${index} text`}
        accessibilityHint="Enter what you are grateful for"
      />

      {/* Category Selector */}
      <View style={styles.categorySection}>
        <Text style={styles.categoryLabel}>Category:</Text>
        <Pressable
          style={[
            styles.categoryButton,
            { borderColor: categoryConfig.color },
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowCategories(!showCategories);
          }}
          accessibilityRole="button"
          accessibilityLabel={`Category: ${categoryConfig.label}. Tap to change.`}
        >
          <View
            style={[styles.categoryDot, { backgroundColor: categoryConfig.color }]}
          />
          <Text style={styles.categoryButtonText}>{categoryConfig.label}</Text>
          <Text style={styles.categoryArrow}>{showCategories ? '\u25B2' : '\u25BC'}</Text>
        </Pressable>
      </View>

      {/* Category Dropdown */}
      {showCategories && (
        <View style={styles.categoryDropdown}>
          {(Object.keys(GRATITUDE_CATEGORIES) as GratitudeCategory[]).map(
            (categoryKey) => {
              const config = GRATITUDE_CATEGORIES[categoryKey];
              const isSelected = categoryKey === item.category;
              return (
                <TouchableOpacity
                  key={categoryKey}
                  style={[
                    styles.categoryOption,
                    isSelected && styles.categoryOptionSelected,
                    { borderColor: config.color },
                  ]}
                  onPress={() => handleCategorySelect(categoryKey)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${config.label} category`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <View
                    style={[
                      styles.categoryDot,
                      { backgroundColor: config.color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.categoryOptionText,
                      isSelected && styles.categoryOptionTextSelected,
                    ]}
                  >
                    {config.label}
                  </Text>
                  {isSelected && <Text style={styles.checkmark}>{'\u2713'}</Text>}
                </TouchableOpacity>
              );
            }
          )}
        </View>
      )}

      {/* Photo Section */}
      <View style={styles.photoSection}>
        {item.photoUri ? (
          <View style={styles.photoPreview}>
            <Image source={{ uri: item.photoUri }} style={styles.photo} />
            <TouchableOpacity
              style={styles.removePhotoButton}
              onPress={handleRemovePhoto}
              accessibilityRole="button"
              accessibilityLabel="Remove photo"
            >
              <Text style={styles.removePhotoText}>{'\u2715'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addPhotoButton}
            onPress={handleAddPhoto}
            accessibilityRole="button"
            accessibilityLabel="Add photo to gratitude item"
            accessibilityHint="Opens photo library to select an image"
          >
            <Text style={styles.addPhotoIcon}>{'\uD83D\uDCF7'}</Text>
            <Text style={styles.addPhotoText}>Add Photo</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  indexBadge: {
    backgroundColor: DESIGN_COLORS.accentGold,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    fontSize: 14,
    fontWeight: '700',
    color: DESIGN_COLORS.bgPrimary,
  },
  deleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteText: {
    fontSize: 12,
    color: DESIGN_COLORS.error,
    fontWeight: '500',
  },

  // Text Input
  textInput: {
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: DESIGN_COLORS.textPrimary,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
    lineHeight: 22,
  },

  // Category
  categorySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    marginRight: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.bgPrimary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  categoryButtonText: {
    fontSize: 13,
    color: DESIGN_COLORS.textPrimary,
    marginRight: 6,
  },
  categoryArrow: {
    fontSize: 10,
    color: DESIGN_COLORS.textSecondary,
  },

  // Category Dropdown
  categoryDropdown: {
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 4,
  },
  categoryOptionSelected: {
    backgroundColor: 'rgba(201, 162, 39, 0.1)',
  },
  categoryOptionText: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    flex: 1,
  },
  categoryOptionTextSelected: {
    color: DESIGN_COLORS.textPrimary,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: DESIGN_COLORS.accentGold,
    fontWeight: '600',
  },

  // Photo
  photoSection: {
    marginTop: 4,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN_COLORS.bgPrimary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    borderStyle: 'dashed',
  },
  addPhotoIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  addPhotoText: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    fontWeight: '500',
  },
  photoPreview: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePhotoText: {
    fontSize: 14,
    color: DESIGN_COLORS.textPrimary,
    fontWeight: '600',
  },
});

export default GratitudeItem;
