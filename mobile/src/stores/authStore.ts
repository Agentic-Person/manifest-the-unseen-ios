/**
 * Authentication Store
 *
 * Manages user authentication state using Zustand.
 * Integrates with Supabase Auth for session management.
 */

import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';
import type { AuthState } from '../types/store';
import { logger } from '../utils/logger';
import { AuthTokenStorage } from '../utils/secureStorage';

/**
 * Initial State
 */
const initialState = {
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

/**
 * Hybrid Storage Implementation
 * - Sensitive data (session tokens) stored in SecureStorage (encrypted)
 * - Non-sensitive data (user profile) stored in AsyncStorage (unencrypted)
 * - Maintains backward compatibility during migration
 */
const createHybridStorage = (): StateStorage => {
  return {
    getItem: async (name: string): Promise<string | null> => {
      try {
        // Try to get session from SecureStorage first (new encrypted location)
        const secureSession = await AuthTokenStorage.getSession();

        if (secureSession) {
          logger.debug('[AuthStore] Retrieved session from SecureStorage');

          // Get profile from AsyncStorage (non-sensitive)
          const profileJson = await AsyncStorage.getItem(`${name}_profile`);
          const profile = profileJson ? JSON.parse(profileJson) : null;

          // Reconstruct the full state
          return JSON.stringify({
            session: secureSession,
            user: secureSession.user,
            profile: profile,
            isAuthenticated: true,
          });
        }

        // Backward compatibility: Try old AsyncStorage location
        const oldData = await AsyncStorage.getItem(name);

        if (oldData) {
          logger.debug('[AuthStore] Found data in AsyncStorage, migrating to SecureStorage');

          // Parse old data
          const parsed = JSON.parse(oldData);

          // Migrate session to SecureStorage if it exists
          if (parsed.session) {
            await AuthTokenStorage.setSession(parsed.session);
            logger.info('[AuthStore] Migrated session to SecureStorage');
          }

          // Keep profile in AsyncStorage
          if (parsed.profile) {
            await AsyncStorage.setItem(`${name}_profile`, JSON.stringify(parsed.profile));
          }

          // Remove old combined storage
          await AsyncStorage.removeItem(name);

          return oldData;
        }

        return null;
      } catch (error) {
        logger.error('[AuthStore] Failed to get item from hybrid storage', error);
        return null;
      }
    },

    setItem: async (name: string, value: string): Promise<void> => {
      try {
        const parsed = JSON.parse(value);

        // Store session in SecureStorage (encrypted)
        if (parsed.session) {
          await AuthTokenStorage.setSession(parsed.session);
          logger.debug('[AuthStore] Saved session to SecureStorage');
        } else {
          // Clear session if null
          await AuthTokenStorage.clearSession();
        }

        // Store profile in AsyncStorage (non-sensitive, can be unencrypted)
        if (parsed.profile) {
          await AsyncStorage.setItem(`${name}_profile`, JSON.stringify(parsed.profile));
          logger.debug('[AuthStore] Saved profile to AsyncStorage');
        } else {
          await AsyncStorage.removeItem(`${name}_profile`);
        }
      } catch (error) {
        logger.error('[AuthStore] Failed to set item in hybrid storage', error);
        throw error;
      }
    },

    removeItem: async (name: string): Promise<void> => {
      try {
        // Clear both secure and async storage
        await AuthTokenStorage.clearSession();
        await AsyncStorage.removeItem(`${name}_profile`);
        await AsyncStorage.removeItem(name); // Remove old format if exists
        logger.debug('[AuthStore] Cleared hybrid storage');
      } catch (error) {
        logger.error('[AuthStore] Failed to remove item from hybrid storage', error);
        throw error;
      }
    },
  };
};

/**
 * Auth Store
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        });
      },

      setProfile: (profile) => {
        set({ profile });
      },

      setSession: (session) => {
        set({
          session,
          isAuthenticated: !!session,
        });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error });
      },

      initialize: async () => {
        try {
          set({ isLoading: true });

          // Dev mode: Skip auth UI but actually sign in as demo user
          // This ensures we have a valid JWT for RLS policies to work
          if (process.env.EXPO_PUBLIC_DEV_SKIP_AUTH === 'true') {
            logger.debug('DEV_SKIP_AUTH enabled - signing in as demo user');

            // First check if we already have a valid session
            const { data: existingSession } = await supabase.auth.getSession();
            if (existingSession?.session) {
              logger.debug('Existing session found', { userId: existingSession.session.user.id });
              set({
                user: existingSession.session.user,
                session: existingSession.session,
                profile: {
                  id: existingSession.session.user.id,
                  email: existingSession.session.user.email,
                  fullName: 'Demo User',
                  displayName: 'Demo User',
                  subscriptionTier: 'enlightenment',
                  subscriptionStatus: 'active',
                  currentPhase: 1,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                } as any,
                isAuthenticated: true,
                isLoading: false,
              });
              return;
            }

            // Sign in as demo user to get a valid JWT for RLS
            const devEmail = 'test@manifest.app';
            const devPassword = process.env.EXPO_PUBLIC_DEV_PASSWORD || 'TestPassword123!';

            const { data, error } = await supabase.auth.signInWithPassword({
              email: devEmail,
              password: devPassword,
            });

            if (error) {
              logger.error('Demo user sign-in failed', { message: error.message });
              logger.info('Hint: Ensure demo user exists in Supabase with password set');
              set({ isLoading: false });
              return;
            }

            logger.debug('Demo user signed in successfully', { userId: data.user.id });
            set({
              user: data.user,
              session: data.session,
              profile: {
                id: data.user.id,
                email: data.user.email,
                fullName: 'Demo User',
                displayName: 'Demo User',
                subscriptionTier: 'enlightenment',
                subscriptionStatus: 'active',
                currentPhase: 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              } as any,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }

          const { data: { session } } = await supabase.auth.getSession();

          if (session) {
            set({
              user: session.user,
              session: session,
              isAuthenticated: true,
            });

            const { data: profile, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (!error && profile) {
              set({ profile });
            }
          }

          set({ isLoading: false });
        } catch (error) {
          logger.error('Failed to initialize auth', error);
          set({ isLoading: false });
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true, error: null });

          const { error } = await supabase.auth.signOut();

          if (error) throw error;

          // Clear secure storage (auth tokens)
          await AuthTokenStorage.clearSession();
          logger.info('[AuthStore] Cleared secure session storage on sign out');

          set({
            ...initialState,
            isLoading: false,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to sign out';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      refreshProfile: async () => {
        try {
          const { user } = get();

          if (!user) {
            throw new Error('No authenticated user');
          }

          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;

          set({ profile });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Failed to refresh profile';
          set({ error: errorMessage });
          throw error;
        }
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'manifest-auth-storage',
      storage: createJSONStorage(() => createHybridStorage()),
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useUser = () => useAuthStore((state) => state.user);
export const useProfile = () => useAuthStore((state) => state.profile);
export const useSession = () => useAuthStore((state) => state.session);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

export const useSignOut = () => useAuthStore((state) => state.signOut);
export const useRefreshProfile = () =>
  useAuthStore((state) => state.refreshProfile);

export const useSubscriptionTier = () =>
  useAuthStore((state) => state.profile?.subscriptionTier ?? 'free');

export const useHasFeatureAccess = (requiredTier: string): boolean => {
  const tier = useSubscriptionTier();

  const tierHierarchy = {
    free: 0,
    novice: 1,
    awakening: 2,
    enlightenment: 3,
  };

  const userTierLevel = tierHierarchy[tier as keyof typeof tierHierarchy] ?? 0;
  const requiredTierLevel =
    tierHierarchy[requiredTier as keyof typeof tierHierarchy] ?? 0;

  return userTierLevel >= requiredTierLevel;
};
