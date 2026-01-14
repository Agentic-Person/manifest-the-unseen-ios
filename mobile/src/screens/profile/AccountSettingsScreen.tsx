/**
 * Account Settings Screen
 *
 * Allows users to view and edit their profile information.
 * Includes account deletion for App Store compliance (Guideline 5.1.1).
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ProfileStackScreenProps } from '../../types/navigation';
import { colors, spacing } from '../../theme';
import { useUser, useProfile, useAuthStore } from '../../stores/authStore';
import { useUpdateUserProfile } from '../../hooks/useUser';
import { useAvatarUpload } from '../../hooks/useAvatarUpload';
import { SettingsSection } from '../../components/settings/SettingsSection';
import { SettingsRow } from '../../components/settings/SettingsRow';
import { authService } from '../../services/auth';

type Props = ProfileStackScreenProps<'AccountSettings'>;

/**
 * Account Settings Screen Component
 *
 * Displays:
 * - Avatar (user initial)
 * - Full name (editable)
 * - Email (read-only)
 * - Save button
 * - Delete Account (App Store requirement)
 */
const AccountSettingsScreen = (_props: Props) => {
  const user = useUser();
  const profile = useProfile();
  const updateProfile = useUpdateUserProfile();
  const signOut = useAuthStore((state) => state.signOut);
  const { pickAndUploadAvatar, isUploading: isUploadingAvatar } = useAvatarUpload();

  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [hasChanges, setHasChanges] = useState(false);

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setFullName(profile?.fullName || '');
  }, [profile?.fullName]);

  useEffect(() => {
    setHasChanges(fullName !== (profile?.fullName || ''));
  }, [fullName, profile?.fullName]);

  const handleSave = async () => {
    if (!hasChanges) return;

    try {
      await updateProfile.mutateAsync({ fullName: fullName.trim() });
      Alert.alert('Success', 'Your profile has been updated.');
      setHasChanges(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const getInitial = () => {
    if (fullName) return fullName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  /**
   * Handle Delete Account - Step 1: Show confirmation alert
   */
  const handleDeleteAccountPress = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.\n\nAll your data will be deleted:\n- Workbook progress\n- Journal entries\n- Meditation history\n- Profile information',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',
          style: 'destructive',
          onPress: () => setShowDeleteModal(true),
        },
      ]
    );
  };

  /**
   * Handle Delete Account - Step 2: Verify password and delete
   */
  const handleConfirmDelete = async () => {
    if (!deletePassword.trim()) {
      setDeleteError('Please enter your password');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    // Timeout protection: 15 seconds max for delete operation
    const DELETION_TIMEOUT_MS = 15000;

    try {
      // Create a promise that rejects after timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('TIMEOUT'));
        }, DELETION_TIMEOUT_MS);
      });

      // Race between delete operation and timeout
      const result = await Promise.race([
        authService.deleteAccount(deletePassword),
        timeoutPromise,
      ]);

      if (result.error) {
        setDeleteError(result.error.message);
        setIsDeleting(false);
        return;
      }

      // Close modal
      setShowDeleteModal(false);

      // Clear auth state
      signOut();

      // Show success message
      Alert.alert(
        'Account Deleted',
        'Your account has been permanently deleted.',
        [{ text: 'OK' }]
      );

      // Navigation will happen automatically when auth state changes

    } catch (error) {
      // Handle timeout specifically
      if (error instanceof Error && error.message === 'TIMEOUT') {
        setDeleteError('Request timed out. Please check your connection and try again.');
      } else {
        setDeleteError('An unexpected error occurred. Please try again.');
      }
      setIsDeleting(false);
    }
  };

  /**
   * Close delete modal and reset state
   */
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletePassword('');
    setDeleteError(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity
            style={styles.avatar}
            onPress={pickAndUploadAvatar}
            disabled={isUploadingAvatar}
            activeOpacity={0.7}
          >
            {isUploadingAvatar ? (
              <ActivityIndicator size="large" color={colors.white} />
            ) : profile?.avatarUrl ? (
              <Image
                source={{ uri: profile.avatarUrl }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarText}>{getInitial()}</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.avatarHint}>
            Tap to change
          </Text>
        </View>

        {/* Profile Information */}
        <SettingsSection title="Profile Information">
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your name"
              placeholderTextColor={colors.text.tertiary}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
          <SettingsRow
            label="Email"
            value={user?.email || 'Not set'}
            isLast
          />
        </SettingsSection>

        {/* Account Info */}
        <SettingsSection title="Account">
          <SettingsRow
            label="Member Since"
            value={profile?.createdAt
              ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })
              : 'Unknown'}
            isLast
          />
        </SettingsSection>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            !hasChanges && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!hasChanges || updateProfile.isPending}
        >
          {updateProfile.isPending ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>

        {/* Danger Zone */}
        <SettingsSection title="Danger Zone">
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccountPress}
            accessibilityRole="button"
            accessibilityLabel="Delete account"
          >
            <Text style={styles.deleteButtonText}>Delete Account</Text>
            <Text style={styles.deleteButtonSubtext}>
              Permanently delete your account and all data
            </Text>
          </TouchableOpacity>
        </SettingsSection>
      </ScrollView>

      {/* Delete Account Password Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseDeleteModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={handleCloseDeleteModal}
          />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
            <Text style={styles.modalDescription}>
              Please enter your password to confirm account deletion.
              This action cannot be undone.
            </Text>

            <TextInput
              style={styles.passwordInput}
              value={deletePassword}
              onChangeText={setDeletePassword}
              placeholder="Enter your password"
              placeholderTextColor={colors.text.tertiary}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isDeleting}
            />

            {deleteError && (
              <Text style={styles.errorText}>{deleteError}</Text>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCloseDeleteModal}
                disabled={isDeleting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmDeleteButton,
                  isDeleting && styles.confirmDeleteButtonDisabled,
                ]}
                onPress={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={styles.confirmDeleteButtonText}>
                    Delete Account
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing['2xl'],
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.white,
  },
  avatarHint: {
    fontSize: 13,
    color: colors.text.tertiary,
  },
  inputRow: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  inputLabel: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  textInput: {
    fontSize: 16,
    color: colors.text.primary,
    padding: 0,
  },
  saveButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveButtonDisabled: {
    backgroundColor: colors.border.default,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  // Delete Account Styles
  deleteButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  deleteButtonSubtext: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: spacing.lg,
    width: '85%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  passwordInput: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  cancelButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  confirmDeleteButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
  },
  confirmDeleteButtonDisabled: {
    opacity: 0.6,
  },
  confirmDeleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});

export default AccountSettingsScreen;
