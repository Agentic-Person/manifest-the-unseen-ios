/**
 * Authentication Store
 *
 * Manages user authentication state using Zustand.
 * Integrates with Supabase Auth for session management.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';
import type { AuthState } from '../types/store';

/**
 * Timeout wrapper for promises
 * Prevents hanging if Supabase is slow or unavailable
 */
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
  return Promise.race([promise, timeout]);
};

const AUTH_TIMEOUT_MS = 10000; // 10 seconds

/**
 * Initial State
 */
const initialState = {
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  authState: 'loading' as const,
  error: null,
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
          authState: user ? 'authenticated' : 'anonymous',
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
          authState: session ? 'authenticated' : 'anonymous',
        });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error });
      },

      setAnonymous: () => {
        set({
          authState: 'anonymous',
          isLoading: false,
          isAuthenticated: false,
        });
      },

      initialize: async () => {
        try {
          set({ isLoading: true, authState: 'loading' });

          // Check for existing session with timeout protection
          const {
            data: { session },
          } = await withTimeout(supabase.auth.getSession(), AUTH_TIMEOUT_MS);

          if (session) {
            set({
              user: session.user,
              session,
              isAuthenticated: true,
              authState: 'authenticated',
            });

            // Fetch profile with timeout protection
            try {
              const fetchProfile = async () => {
                const { data, error } = await supabase
                  .from('users')
                  .select('*')
                  .eq('id', session.user.id)
                  .single();
                return { data, error };
              };

              const profileResult = await withTimeout(fetchProfile(), AUTH_TIMEOUT_MS);

              if (!profileResult.error && profileResult.data) {
                set({ profile: profileResult.data });
              }
            } catch (profileError) {
              // Profile fetch failed but we still have the session
              // Log and continue - user can still use the app
              console.warn('Failed to fetch profile during init:', profileError);
            }
          } else {
            // No session - set anonymous state for App Store compliance
            // Users can browse and purchase without registration
            set({
              authState: 'anonymous',
              isAuthenticated: false,
            });
          }

          set({ isLoading: false });
        } catch (error) {
          // Handle timeout or other errors gracefully
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error('Failed to initialize auth:', errorMessage);

          // Don't crash the app - set anonymous state
          set({
            user: null,
            session: null,
            profile: null,
            isAuthenticated: false,
            authState: 'anonymous',
            isLoading: false,
          });
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true, error: null });

          const { error } = await supabase.auth.signOut();

          if (error) {
            throw error;
          }

          // Set anonymous state instead of loading
          // User returns to guest mode after signing out
          set({
            user: null,
            profile: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
            authState: 'anonymous',
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to sign out';
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

          if (error) {
            throw error;
          }

          set({ profile });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to refresh profile';
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
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // DO NOT persist session - Supabase handles this
        // Persisting it causes sync issues with Supabase's auto-refresh
        profile: state.profile,
      }),
    }
  )
);

export const useUser = () => useAuthStore((state) => state.user);
export const useProfile = () => useAuthStore((state) => state.profile);
export const useSession = () => useAuthStore((state) => state.session);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAuthState = () => useAuthStore((state) => state.authState);

export const useSignOut = () => useAuthStore((state) => state.signOut);
export const useRefreshProfile = () => useAuthStore((state) => state.refreshProfile);
export const useSetAnonymous = () => useAuthStore((state) => state.setAnonymous);

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
  const requiredTierLevel = tierHierarchy[requiredTier as keyof typeof tierHierarchy] ?? 0;

  return userTierLevel >= requiredTierLevel;
};
