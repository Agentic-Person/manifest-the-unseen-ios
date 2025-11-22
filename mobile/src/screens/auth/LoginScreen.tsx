/**
 * Login Screen
 *
 * Allows existing users to sign in with email/password or Apple Sign-In.
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

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { setUser, setSession, setProfile, setLoading, setError } = useAuthStore();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const canSubmit = email.length > 0 && password.length > 0 && !isSubmitting;

  /**
   * Handle Email/Password Sign In
   */
  const handleSignIn = async () => {
    // Validate
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setLoading(true);

      const result = await authService.signInWithEmail(email, password);

      if (result.error) {
        // Handle specific error messages
        const message = result.error.message;
        if (message.includes('Invalid login credentials')) {
          setErrorMessage('Invalid email or password. Please try again.');
        } else if (message.includes('Email not confirmed')) {
          setErrorMessage('Please confirm your email before signing in.');
        } else {
          setErrorMessage(message);
        }
        setLoading(false);
        return;
      }

      // Update auth store
      if (result.user) setUser(result.user);
      if (result.session) setSession(result.session);
      if (result.profile) setProfile(result.profile);

      setLoading(false);
      setError(null);

      // Navigation handled by RootNavigator based on auth state
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
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
    // const result = await authService.signInWithApple();
  };

  /**
   * Navigate to Forgot Password
   */
  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  /**
   * Navigate to Signup
   */
  const handleGoToSignup = () => {
    navigation.navigate('Signup');
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
            Welcome Back
          </Text>
          <Text variant="body" style={styles.subtitle}>
            Sign in to continue your manifestation journey
          </Text>
        </View>

        {/* Error Message */}
        {errorMessage && (
          <Card elevation="flat" style={styles.errorCard}>
            <Text variant="body" style={styles.errorText}>
              {errorMessage}
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
          containerStyle={styles.input}
        />

        {/* Password Input */}
        <TextInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isSubmitting}
          containerStyle={styles.input}
        />

        {/* Forgot Password Link */}
        <TouchableOpacity
          onPress={handleForgotPassword}
          disabled={isSubmitting}
          style={styles.forgotPassword}
        >
          <Text variant="body" style={styles.forgotPasswordText}>
            Forgot your password?
          </Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <Button
          title="Sign In"
          onPress={handleSignIn}
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
          title="Sign in with Apple"
          onPress={handleAppleSignIn}
          disabled={isSubmitting}
          variant="secondary"
          style={styles.button}
        />

        {/* Sign Up Link */}
        <View style={styles.footer}>
          <Text variant="body" style={styles.footerText}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={handleGoToSignup} disabled={isSubmitting}>
            <Text variant="body" style={styles.footerLink}>
              Sign Up
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
  },
  errorCard: {
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.error[600],
  },
  input: {
    marginBottom: spacing.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    color: colors.primary[600],
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
    marginTop: spacing.xl,
  },
  footerText: {
    color: colors.text.secondary,
  },
  footerLink: {
    color: colors.primary[600],
    fontWeight: '600',
  },
});
