/**
 * Signup Screen
 *
 * Allows new users to create an account with email/password or Apple Sign-In.
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';
import { Text } from '../../components/Text';
import { Card } from '../../components/Card';
import { authService } from '../../services/auth';
import { useAuthStore } from '../../stores/authStore';
import { colors, spacing } from '../../theme';

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

export const SignupScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { setUser, setSession, setProfile, setLoading, setError } = useAuthStore();

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isStrongPassword = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  };

  const canSubmit =
    fullName.length > 0 &&
    email.length > 0 &&
    password.length >= 8 &&
    confirmPassword.length > 0 &&
    password === confirmPassword &&
    agreeToTerms &&
    !isSubmitting;

  /**
   * Handle Email/Password Sign Up
   */
  const handleSignUp = async () => {
    // Validate
    if (fullName.trim().length < 2) {
      setErrorMessage('Please enter your full name');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (!isStrongPassword(password)) {
      setErrorMessage(
        'Password must be at least 8 characters with uppercase, lowercase, and a number'
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      setErrorMessage('Please accept the Terms and Conditions');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      setLoading(true);

      const result = await authService.signUpWithEmail(email, password, fullName);

      if (result.error) {
        const message = result.error.message;
        if (message.includes('already registered')) {
          setErrorMessage('An account with this email already exists. Please sign in.');
        } else {
          setErrorMessage(message);
        }
        setLoading(false);
        return;
      }

      // Check if email confirmation is required
      if (result.requiresEmailConfirmation) {
        setSuccessMessage(
          'Account created! Please check your email to confirm your address, then sign in.'
        );
        setLoading(false);

        // Navigate to login after 3 seconds
        setTimeout(() => {
          navigation.navigate('Login');
        }, 3000);
        return;
      }

      // If no confirmation required, user is signed in automatically
      if (result.user) setUser(result.user);
      if (result.session) setSession(result.session);

      // Fetch profile (created by trigger)
      if (result.user) {
        const profile = await authService.fetchUserProfile(result.user.id);
        if (profile) setProfile(profile);
      }

      setLoading(false);
      setError(null);

      // Navigation handled by RootNavigator based on auth state
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      setErrorMessage(message);
      setError(message);
      setLoading(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle Apple Sign In
   */
  const handleAppleSignIn = async () => {
    setErrorMessage('Apple Sign-In coming soon! Use email for now.');
    // TODO: Implement Apple Sign-In
  };

  /**
   * Navigate to Login
   */
  const handleGoToLogin = () => {
    navigation.navigate('Login');
  };

  /**
   * Toggle Terms Acceptance
   */
  const toggleTerms = () => {
    setAgreeToTerms(!agreeToTerms);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h1" style={styles.title}>
            Begin Your Journey
          </Text>
          <Text variant="body" style={styles.subtitle}>
            Create your account and start manifesting
          </Text>
        </View>

        {/* Error Message */}
        {errorMessage && (
          <Card elevation="flat" style={styles.messageCard}>
            <Text variant="body" style={styles.errorText}>
              {errorMessage}
            </Text>
          </Card>
        )}

        {/* Success Message */}
        {successMessage && (
          <Card elevation="flat" style={styles.messageCard}>
            <Text variant="body" style={styles.successText}>
              {successMessage}
            </Text>
          </Card>
        )}

        {/* Full Name Input */}
        <TextInput
          label="Full Name"
          placeholder="John Doe"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          editable={!isSubmitting}
          containerStyle={styles.input}
        />

        {/* Email Input */}
        <TextInput
          label="Email"
          placeholder="your@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isSubmitting}
          containerStyle={styles.input}
        />

        {/* Password Input */}
        <TextInput
          label="Password"
          placeholder="At least 8 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isSubmitting}
          containerStyle={styles.input}
          helperText="Must include uppercase, lowercase, and a number"
        />

        {/* Confirm Password Input */}
        <TextInput
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!isSubmitting}
          containerStyle={styles.input}
        />

        {/* Terms and Conditions */}
        <TouchableOpacity
          onPress={toggleTerms}
          disabled={isSubmitting}
          style={styles.termsContainer}
        >
          <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
            {agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text variant="body" style={styles.termsText}>
            I agree to the{' '}
            <Text style={styles.termsLink}>Terms and Conditions</Text>
          </Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <Button
          title="Create Account"
          onPress={handleSignUp}
          disabled={!canSubmit}
          loading={isSubmitting}
          variant="primary"
          style={styles.button}
        />

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text variant="caption" style={styles.dividerText}>
            OR
          </Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Apple Sign In */}
        <Button
          title="Sign up with Apple"
          onPress={handleAppleSignIn}
          disabled={isSubmitting}
          variant="secondary"
          style={styles.button}
        />

        {/* Login Link */}
        <View style={styles.footer}>
          <Text variant="body" style={styles.footerText}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={handleGoToLogin} disabled={isSubmitting}>
            <Text variant="body" style={styles.footerLink}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
    paddingTop: spacing['2xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
  messageCard: {
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.error[600],
  },
  successText: {
    color: colors.success[600],
  },
  input: {
    marginBottom: spacing.md,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.border.default,
    borderRadius: 4,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  checkmark: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    color: colors.text.secondary,
    flex: 1,
  },
  termsLink: {
    color: colors.primary[600],
    fontWeight: '600',
  },
  button: {
    marginBottom: spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.default,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.text.tertiary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  footerText: {
    color: colors.text.secondary,
  },
  footerLink: {
    color: colors.primary[600],
    fontWeight: '600',
  },
});
