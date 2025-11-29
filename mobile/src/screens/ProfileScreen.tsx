/**
 * Profile Screen
 *
 * User profile, settings, and subscription management.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import type { MainTabScreenProps } from '../types/navigation';
import { useUser, useProfile, useSignOut } from '../stores/authStore';
import { useUserProfile } from '../hooks/useUser';
import { colors } from '../theme';

type Props = MainTabScreenProps<'Profile'>;

/**
 * Profile Screen Component
 */
const ProfileScreen = (_props: Props) => {
  const user = useUser();
  const profile = useProfile();
  const signOut = useSignOut();
  const { isLoading } = useUserProfile();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>{profile?.fullName || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {/* Subscription Card */}
      {profile && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Subscription</Text>
          <View style={styles.subscriptionInfo}>
            <View>
              <Text style={styles.tierName}>
                {profile.subscriptionTier.charAt(0).toUpperCase() +
                 profile.subscriptionTier.slice(1)} Path
              </Text>
              <Text style={styles.tierStatus}>
                Status: {profile.subscriptionStatus}
              </Text>
            </View>
            <TouchableOpacity style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>Manage</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Settings Options */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Settings</Text>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Account Settings</Text>
          <Text style={styles.optionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Notifications</Text>
          <Text style={styles.optionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Appearance</Text>
          <Text style={styles.optionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Privacy & Security</Text>
          <Text style={styles.optionArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Support Options */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Support</Text>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Help Center</Text>
          <Text style={styles.optionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>About</Text>
          <Text style={styles.optionArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Version Info */}
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  card: {
    backgroundColor: colors.background.elevated,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subscriptionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tierName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  tierStatus: {
    fontSize: 14,
    color: colors.success[400],
    textTransform: 'capitalize',
  },
  upgradeButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  optionText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  optionArrow: {
    fontSize: 24,
    color: colors.text.tertiary,
  },
  signOutButton: {
    backgroundColor: colors.error[500],
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  versionText: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: 24,
  },
  text: {
    fontSize: 16,
    color: colors.text.primary,
  },
});

export default ProfileScreen;
