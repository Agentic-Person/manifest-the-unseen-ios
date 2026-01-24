/**
 * useAvatarUpload Hook
 *
 * Handles avatar image selection and upload to Supabase Storage.
 * Uses expo-image-picker for image selection and Supabase Storage for hosting.
 */

import { useState, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system';
import { supabase, getPublicUrl } from '../services/supabase';
import { useUser } from '../stores/authStore';
import { useUpdateUserProfile } from './useUser';
import { logger } from '../utils/logger';

/**
 * Convert base64 string to ArrayBuffer
 */
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

interface UseAvatarUploadResult {
  /** Function to pick and upload a new avatar */
  pickAndUploadAvatar: () => Promise<string | null>;
  /** Whether an upload is in progress */
  isUploading: boolean;
  /** Last error message, if any */
  error: string | null;
}

/**
 * Hook for handling avatar upload
 *
 * @example
 * ```tsx
 * const { pickAndUploadAvatar, isUploading, error } = useAvatarUpload();
 *
 * const handleAvatarPress = async () => {
 *   const url = await pickAndUploadAvatar();
 *   if (url) {
 *     console.log('Avatar uploaded:', url);
 *   }
 * };
 * ```
 */
export const useAvatarUpload = (): UseAvatarUploadResult => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();
  const updateProfile = useUpdateUserProfile();

  const pickAndUploadAvatar = useCallback(async (): Promise<string | null> => {
    if (!user?.id) {
      setError('User not authenticated');
      Alert.alert('Error', 'Please sign in to update your avatar.');
      return null;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to update your avatar.',
          [{ text: 'OK' }]
        );
        setIsUploading(false);
        return null;
      }

      // Launch image picker with square crop
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square crop for avatar
        quality: 0.7, // Good quality while keeping file size small
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        setIsUploading(false);
        return null;
      }

      const selectedImage = result.assets[0];
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = selectedImage.uri.split('.').pop() || 'jpg';
      const filePath = `${user.id}/${timestamp}.${fileExtension}`;

      // Read the file and convert to base64
      let base64Data: string;

      if (Platform.OS === 'web') {
        // For web, fetch the blob and convert to base64
        const response = await fetch(selectedImage.uri);
        const blob = await response.blob();
        base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } else {
        // For native, use FileSystem
        base64Data = await FileSystem.readAsStringAsync(selectedImage.uri, {
          encoding: 'base64',
        });
      }

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, base64ToArrayBuffer(base64Data), {
          contentType: `image/${fileExtension === 'png' ? 'png' : 'jpeg'}`,
          upsert: true, // Replace existing file if any
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Get public URL
      const publicUrl = getPublicUrl('avatars', data.path);

      // Update user profile with new avatar URL
      await updateProfile.mutateAsync({ avatarUrl: publicUrl });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsUploading(false);
      return publicUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload avatar';
      setError(errorMessage);
      logger.error('[useAvatarUpload] Error:', err);

      Alert.alert('Upload Failed', 'Failed to upload avatar. Please try again.', [{ text: 'OK' }]);

      setIsUploading(false);
      return null;
    }
  }, [user?.id, updateProfile]);

  return {
    pickAndUploadAvatar,
    isUploading,
    error,
  };
};

export default useAvatarUpload;
