/**
 * ImagePicker Component
 *
 * Gallery image selection with thumbnail preview and removal.
 * Supports multiple image selection up to a configurable limit.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { colors, spacing, typography, shadows } from '@/theme';

export interface ImagePickerProps {
  /** Array of local image URIs */
  images: string[];

  /** Callback when images change */
  onImagesChange: (images: string[]) => void;

  /** Maximum number of images allowed (default: 5) */
  maxImages?: number;

  /** Disable image selection */
  disabled?: boolean;
}

/**
 * ImagePicker Component
 */
export const ImagePicker: React.FC<ImagePickerProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  disabled = false,
}) => {
  // Request permissions and pick images
  const handlePickImages = async () => {
    try {
      // Request permission
      const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant photo library access to add images to your journal.',
        );
        return;
      }

      // Calculate how many more images can be added
      const remainingSlots = maxImages - images.length;
      if (remainingSlots <= 0) {
        Alert.alert(
          'Maximum Images Reached',
          `You can only add up to ${maxImages} images per entry.`,
        );
        return;
      }

      // Haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Launch image picker
      const result = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: remainingSlots,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImageUris = result.assets.map(asset => asset.uri);
        const updatedImages = [...images, ...newImageUris].slice(0, maxImages);
        onImagesChange(updatedImages);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick images. Please try again.');
    }
  };

  // Remove image at index
  const handleRemoveImage = async (index: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>📷 Add Images</Text>
        <Text style={styles.count}>
          {images.length}/{maxImages}
        </Text>
      </View>

      {/* Image Grid */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.imageGrid}
      >
        {/* Add Image Button */}
        {images.length < maxImages && (
          <Pressable
            style={({ pressed }) => [
              styles.imageSlot,
              styles.addButton,
              pressed && styles.addButtonPressed,
              disabled && styles.addButtonDisabled,
            ]}
            onPress={handlePickImages}
            disabled={disabled}
          >
            <Text style={styles.addIcon}>+</Text>
            <Text style={styles.addText}>Add</Text>
          </Pressable>
        )}

        {/* Image Thumbnails */}
        {images.map((uri, index) => (
          <View key={`${uri}-${index}`} style={styles.imageSlot}>
            <Image
              source={{ uri }}
              style={styles.thumbnail}
              resizeMode="cover"
            />

            {/* Remove Button */}
            <Pressable
              style={({ pressed }) => [
                styles.removeButton,
                pressed && styles.removeButtonPressed,
              ]}
              onPress={() => handleRemoveImage(index)}
              accessibilityLabel={`Remove image ${index + 1}`}
              accessibilityRole="button"
            >
              <Text style={styles.removeIcon}>✕</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {/* Helper Text */}
      {images.length === 0 && (
        <Text style={styles.helperText}>
          Tap + to add photos from your gallery
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  headerText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
  },
  count: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  imageGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  imageSlot: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  addButton: {
    backgroundColor: colors.background.secondary,
    borderWidth: 2,
    borderColor: colors.border.default,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addIcon: {
    fontSize: 32,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  addText: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error[600],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  removeButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.9 }],
  },
  removeIcon: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '700',
    lineHeight: 14,
  },
  helperText: {
    fontSize: typography.caption.fontSize,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});

export default ImagePicker;
