/**
 * Profile Screen
 *
 * User profile, settings, and subscription management.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import Constants from 'expo-constants';
import type { ProfileStackScreenProps } from '../types/navigation';
import { useUser, useProfile, useSignOut } from '../stores/authStore';
import { useUserProfile } from '../hooks/useUser';
import { useSubscriptionSummary } from '../hooks/useSubscription';
import { colors } from '../theme';

type Props = ProfileStackScreenProps<'ProfileHome'>;

/**
 * Profile Screen Component
 */
const ProfileScreen = ({ navigation }: Props) => {
  const user = useUser();
  const profile = useProfile();
  const signOut = useSignOut();
  const { isFetching, error } = useUserProfile();
  // Use RevenueCat subscription status (source of truth for purchases)
  const { tierName, statusLabel } = useSubscriptionSummary();

  // Get app version from expo-constants
  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const buildNumber = Constants.expoConfig?.ios?.buildNumber || '1';

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Only show loading if we're actually fetching AND don't have profile data
  // This prevents infinite loading when query is disabled or fails
  if (isFetching && !profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  // If there's an error and no profile, show error state
  if (error && !profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Unable to load profile</Text>
        <Pressable
          style={({ pressed }) => [styles.signOutButton, pressed && styles.signOutButtonPressed]}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          {profile?.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>
              {profile?.fullName?.charAt(0).toUpperCase() ||
                user?.email?.charAt(0).toUpperCase() ||
                'U'}
            </Text>
          )}
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
              <Text style={styles.tierName}>{tierName}</Text>
              <Text style={styles.tierStatus}>{statusLabel}</Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.upgradeButton,
                pressed && styles.upgradeButtonPressed,
              ]}
              onPress={() => navigation.navigate('Paywall')}
            >
              <Text style={styles.upgradeButtonText}>Manage</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Settings Options */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Settings</Text>

        <Pressable
          style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
          onPress={() => navigation.navigate('AccountSettings')}
        >
          <Text style={styles.optionText}>Account Settings</Text>
          <Text style={styles.optionArrow}>›</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.optionText}>Notifications</Text>
          <Text style={styles.optionArrow}>›</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
          onPress={() => navigation.navigate('Appearance')}
        >
          <Text style={styles.optionText}>Appearance</Text>
          <Text style={styles.optionArrow}>›</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
          onPress={() => navigation.navigate('PrivacySecurity')}
        >
          <Text style={styles.optionText}>Privacy & Security</Text>
          <Text style={styles.optionArrow}>›</Text>
        </Pressable>
      </View>

      {/* Support Options */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Support</Text>

        <Pressable
          style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
          onPress={() => navigation.navigate('HelpCenter')}
        >
          <Text style={styles.optionText}>Help Center</Text>
          <Text style={styles.optionArrow}>›</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
          onPress={() => navigation.navigate('About')}
        >
          <Text style={styles.optionText}>About</Text>
          <Text style={styles.optionArrow}>›</Text>
        </Pressable>
      </View>

      {/* Sign Out Button - Improved touch handling for iPad */}
      <Pressable
        style={({ pressed }) => [styles.signOutButton, pressed && styles.signOutButtonPressed]}
        onPress={handleSignOut}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
        accessibilityRole="button"
        accessibilityLabel="Sign out of your account"
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>

      {/* Version Info */}
      <Text style={styles.versionText}>
        Version {appVersion} ({buildNumber})
      </Text>
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    paddingVertical: 10,
    borderRadius: 8,
  },
  upgradeButtonPressed: {
    opacity: 0.8,
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  optionPressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
    padding: 18,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  signOutButtonPressed: {
    opacity: 0.8,
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
