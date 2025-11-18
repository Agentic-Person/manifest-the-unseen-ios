/**
 * Forgot Password Screen
 *
 * Allows users to request a password reset email.
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
import { colors, spacing, typography } from '../../theme';

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // Form State
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const canSubmit = email.length > 0 && !isSubmitting;

  /**
   * Handle Password Reset Request
   */
  const handleResetPassword = async () => {
    // Validate
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const result = await authService.resetPassword(email);

      if (result.error) {
        setErrorMessage(result.error.message);
        return;
      }

      // Success
      setSuccessMessage(
        'Password reset email sent! Please check your inbox and follow the instructions.'
      );

      // Navigate back to login after 5 seconds
      setTimeout(() => {
        navigation.navigate('Login');
      }, 5000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Password reset failed';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Navigate Back to Login
   */
  const handleBackToLogin = () => {
    navigation.navigate('Login');
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
            Reset Password
          </Text>
          <Text variant="body" style={styles.subtitle}>
            Enter your email and we'll send you instructions to reset your
            password
          </Text>
        </View>

        {/* Error Message */}
        {errorMessage && (
          <Card variant="danger" style={styles.messageCard}>
            <Text variant="body" style={styles.errorText}>
              {errorMessage}
            </Text>
          </Card>
        )}

        {/* Success Message */}
        {successMessage && (
          <Card variant="success" style={styles.messageCard}>
            <Text variant="body" style={styles.successText}>
              {successMessage}
            </Text>
          </Card>
        )}

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
          style={styles.input}
        />

        {/* Send Reset Link Button */}
        <Button
          title="Send Reset Link"
          onPress={handleResetPassword}
          disabled={!canSubmit}
          loading={isSubmitting}
          variant="primary"
          style={styles.button}
        />

        {/* Info Card */}
        <Card variant="info" style={styles.infoCard}>
          <Text variant="body" style={styles.infoText}>
            <Text style={styles.infoBold}>Didn't receive the email?</Text>
            {'\n\n'}
            • Check your spam/junk folder
            {'\n'}
            • Make sure you entered the correct email address
            {'\n'}
            • Wait a few minutes and check again
          </Text>
        </Card>

        {/* Back to Login Link */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleBackToLogin}
            disabled={isSubmitting}
            style={styles.backButton}
          >
            <Text variant="body" style={styles.backButtonText}>
              ← Back to Sign In
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
    justifyContent: 'center',
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
    paddingHorizontal: spacing.md,
  },
  messageCard: {
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.status.error,
  },
  successText: {
    color: colors.status.success,
  },
  input: {
    marginBottom: spacing.xl,
  },
  button: {
    marginBottom: spacing.xl,
  },
  infoCard: {
    marginBottom: spacing.xl,
  },
  infoText: {
    color: colors.text.secondary,
    lineHeight: 22,
  },
  infoBold: {
    fontWeight: '600',
    color: colors.text.primary,
  },
  footer: {
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: spacing.sm,
  },
  backButtonText: {
    color: colors.brand.purple,
    fontWeight: '600',
  },
});
