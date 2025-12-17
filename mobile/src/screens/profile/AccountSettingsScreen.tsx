/**
 * Account Settings Screen
 *
 * Allows users to view and edit their profile information.
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ProfileStackScreenProps } from '../../types/navigation';
import { colors, spacing } from '../../theme';
import { useUser, useProfile } from '../../stores/authStore';
import { useUpdateUserProfile } from '../../hooks/useUser';
import { SettingsSection } from '../../components/settings/SettingsSection';
import { SettingsRow } from '../../components/settings/SettingsRow';

type Props = ProfileStackScreenProps<'AccountSettings'>;

/**
 * Account Settings Screen Component
 *
 * Displays:
 * - Avatar (user initial)
 * - Full name (editable)
 * - Email (read-only)
 * - Save button
 */
const AccountSettingsScreen = (_props: Props) => {
  const user = useUser();
  const profile = useProfile();
  const updateProfile = useUpdateUserProfile();

  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [hasChanges, setHasChanges] = useState(false);

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

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitial()}</Text>
          </View>
          <Text style={styles.avatarHint}>
            Avatar customization coming soon
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
      </ScrollView>
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
});

export default AccountSettingsScreen;
