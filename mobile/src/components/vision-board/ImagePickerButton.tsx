/**
 * ImagePickerButton Component
 *
 * Button to open the device image gallery using expo-image-picker.
 * Returns the selected image URI for use in the Vision Board.
 *
 * Design (from APP-DESIGN.md):
 * - Dark theme compatible
 * - Primary button style with purple gradient
 */

import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

// Design system colors from APP-DESIGN.md
const DESIGN_COLORS = {
  bgElevated: '#252547',
  textPrimary: '#e8e8e8',
  textSecondary: '#a0a0b0',
  accentPurple: '#4a1a6b',
  accentGold: '#c9a227',
  border: '#3a3a5a',
};

interface ImagePickerButtonProps {
  onImageSelected: (uri: string) => void;
  disabled?: boolean;
}

/**
 * ImagePickerButton Component
 */
const ImagePickerButton: React.FC<ImagePickerButtonProps> = ({
  onImageSelected,
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Request permissions and open image picker
   */
  const handlePickImage = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to add images to your vision board.',
          [{ text: 'OK' }]
        );
        setIsLoading(false);
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square crop
        quality: 0.8, // Good quality while keeping file size reasonable
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onImageSelected(selectedImage.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        'Error',
        'Failed to pick image. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={handlePickImage}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Add image from gallery"
      accessibilityHint="Opens your photo library to select an image"
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={DESIGN_COLORS.textPrimary} />
      ) : (
        <View style={styles.content}>
          <Text style={styles.icon}>+</Text>
          <Text style={styles.text}>Add Image</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: DESIGN_COLORS.accentPurple,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    shadowColor: DESIGN_COLORS.accentPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DESIGN_COLORS.accentGold,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    letterSpacing: 0.5,
  },
});

export default ImagePickerButton;
