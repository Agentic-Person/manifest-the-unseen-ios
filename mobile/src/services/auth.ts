/**
 * Authentication Service
 *
 * Wraps Supabase Auth with typed methods for authentication flows.
 * Handles signup, signin, password reset, and session management.
 */

import { supabase } from './supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import type { UserProfile } from '../types/store';
import type { Database } from '../types/database';
import * as AppleAuthentication from 'expo-apple-authentication';

type UserRow = Database['public']['Tables']['users']['Row'];

/**
 * Authentication Result
 * Standard response type for auth operations
 */
export interface AuthResult {
  user?: User | null;
  session?: Session | null;
  profile?: UserProfile | null;
  error?: AuthError | Error | null;
}

/**
 * Sign Up Result
 * Specific to signup operations with email confirmation
 */
export interface SignUpResult extends AuthResult {
  requiresEmailConfirmation?: boolean;
}

/**
 * Authentication Service
 * Provides typed wrappers around Supabase Auth methods
 */
export const authService = {
  /**
   * Sign Up with Email and Password
   *
   * Creates a new user account. Depending on config, may require email confirmation.
   *
   * @param email - User's email address
   * @param password - User's password (min 8 characters recommended)
   * @param fullName - Optional full name for user profile
   * @returns SignUpResult with user, session, and confirmation status
   *
   * @example
   * ```tsx
   * const result = await authService.signUpWithEmail(
   *   'user@example.com',
   *   'securePassword123',
   *   'John Doe'
   * );
   *
   * if (result.error) {
   *   console.error('Signup failed:', result.error.message);
   * } else if (result.requiresEmailConfirmation) {
   *   console.log('Please check your email to confirm');
   * } else {
   *   console.log('Signed up successfully:', result.user);
   * }
   * ```
   */
  signUpWithEmail: async (
    email: string,
    password: string,
    fullName?: string
  ): Promise<SignUpResult> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { error };
      }

      // Check if email confirmation is required
      const requiresEmailConfirmation =
        data.user && !data.session && data.user.identities?.length === 0;

      return {
        user: data.user,
        session: data.session,
        requiresEmailConfirmation: !!requiresEmailConfirmation,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error : new Error('Signup failed'),
      };
    }
  },

  /**
   * Sign In with Email and Password
   *
   * Authenticates existing user with email/password credentials.
   *
   * @param email - User's email address
   * @param password - User's password
   * @returns AuthResult with user and session
   *
   * @example
   * ```tsx
   * const result = await authService.signInWithEmail(
   *   'user@example.com',
   *   'password123'
   * );
   *
   * if (result.error) {
   *   console.error('Login failed:', result.error.message);
   * } else {
   *   console.log('Logged in as:', result.user?.email);
   * }
   * ```
   */
  signInWithEmail: async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      // Fetch user profile
      const profile = await authService.fetchUserProfile(data.user.id);

      return {
        user: data.user,
        session: data.session,
        profile,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error : new Error('Login failed'),
      };
    }
  },

  /**
   * Sign In with Apple
   *
   * Initiates Apple Sign-In flow (native iOS).
   * Requires Apple Developer account configuration.
   *
   * @returns AuthResult with user and session
   *
   * @example
   * ```tsx
   * const result = await authService.signInWithApple();
   * ```
   */
  signInWithApple: async (): Promise<AuthResult> => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Sign in via Supabase with Apple credential
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken!,
      });

      if (error) {
        return { error };
      }

      // Fetch user profile
      const profile = await authService.fetchUserProfile(data.user.id);

      return {
        user: data.user,
        session: data.session,
        profile,
      };
    } catch (error: any) {
      if (error.code === 'ERR_REQUEST_CANCELED') {
        return {
          error: new Error('Apple Sign-In was cancelled'),
        };
      }
      return {
        error: error instanceof Error ? error : new Error('Apple Sign-In failed'),
      };
    }
  },

  /**
   * Sign Out
   *
   * Ends the current user session and clears local storage.
   *
   * @returns AuthResult with any errors
   *
   * @example
   * ```tsx
   * const result = await authService.signOut();
   * if (result.error) {
   *   console.error('Sign out failed:', result.error);
   * }
   * ```
   */
  signOut: async (): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error };
      }

      return {};
    } catch (error) {
      return {
        error: error instanceof Error ? error : new Error('Sign out failed'),
      };
    }
  },

  /**
   * Reset Password
   *
   * Sends password reset email to user.
   * User will receive link to reset their password.
   *
   * @param email - User's email address
   * @returns AuthResult with any errors
   *
   * @example
   * ```tsx
   * const result = await authService.resetPassword('user@example.com');
   * if (result.error) {
   *   console.error('Password reset failed:', result.error);
   * } else {
   *   console.log('Password reset email sent!');
   * }
   * ```
   */
  resetPassword: async (email: string): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'manifesttheunseen://auth/reset-password',
      });

      if (error) {
        return { error };
      }

      return {};
    } catch (error) {
      return {
        error:
          error instanceof Error ? error : new Error('Password reset failed'),
      };
    }
  },

  /**
   * Update Password
   *
   * Updates the password for the currently authenticated user.
   * Typically used after password reset or in settings.
   *
   * @param newPassword - New password
   * @returns AuthResult with any errors
   *
   * @example
   * ```tsx
   * const result = await authService.updatePassword('newSecurePassword123');
   * ```
   */
  updatePassword: async (newPassword: string): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error };
      }

      return {};
    } catch (error) {
      return {
        error:
          error instanceof Error ? error : new Error('Password update failed'),
      };
    }
  },

  /**
   * Get Current User
   *
   * Retrieves the currently authenticated user.
   * Returns null if no user is authenticated.
   *
   * @returns Current user or null
   */
  getCurrentUser: async (): Promise<User | null> => {
    const res = await supabase.auth.getUser();
    return res.data.user ?? null;
  },

  /**
   * Get Current Session
   *
   * Retrieves the current session (including access/refresh tokens).
   *
   * @returns Current session or null
   */
  getCurrentSession: async (): Promise<Session | null> => {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  /**
   * Fetch User Profile
   *
   * Retrieves user profile data from the database.
   *
   * @param userId - User ID
   * @returns UserProfile or null
   */
  fetchUserProfile: async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Failed to fetch user profile:', error);
        return null;
      }

      const row = data as UserRow;
      // Map database fields to UserProfile type
      return {
        id: row.id,
        email: row.email,
        fullName: row.full_name ?? undefined,
        avatarUrl: row.avatar_url ?? undefined,
        subscriptionTier: row.subscription_tier,
        subscriptionStatus: row.subscription_status,
        trialEndsAt: row.trial_ends_at ?? undefined,
        currentPhase: row.current_phase || 1,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  /**
   * Listen to Auth State Changes
   *
   * Sets up a listener for authentication state changes.
   * Useful for updating UI when user signs in/out.
   *
   * @param callback - Function to call when auth state changes
   * @returns Subscription object with unsubscribe method
   *
   * @example
   * ```tsx
   * const subscription = authService.onAuthStateChange((event, session) => {
   *   console.log('Auth event:', event);
   *   console.log('Session:', session);
   * });
   *
   * // Later, unsubscribe
   * subscription.unsubscribe();
   * ```
   */
  onAuthStateChange: (
    callback: (event: string, session: Session | null) => void
  ) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};
