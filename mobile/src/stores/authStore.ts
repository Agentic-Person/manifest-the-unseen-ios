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
 * Auth Store
 *
 * @example
 * ```tsx
 * import { useAuthStore } from '@/stores/authStore';
 *
 * function MyComponent() {
 *   const { user, isAuthenticated, signOut } = useAuthStore();
 *
 *   if (!isAuthenticated) {
 *     return <SignInScreen />;
 *   }
 *
 *   return <Text>Welcome {user?.email}</Text>;
 * }
 * ```
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      /**
       * Set User
       */
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        });
      },

      /**
       * Set User Profile
       */
      setProfile: (profile) => {
        set({ profile });
      },

      /**
       * Set Session
       */
      setSession: (session) => {
        set({
          session,
          isAuthenticated: !!session,
        });
      },

      /**
       * Set Loading State
       */
      setLoading: (isLoading) => {
        set({ isLoading });
      },

      /**
       * Set Error
       */
      setError: (error) => {
        set({ error });
      },

      /**
       * Initialize Auth
       * Checks for existing session and restores auth state
       */
      initialize: async () => {
        try {
          set({ isLoading: true });

          const { data: { session } } = await supabase.auth.getSession();

          if (session) {
            set({
              user: session.user,
              session: session,
              isAuthenticated: true,
            });

            // Fetch profile
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
          console.error('Failed to initialize auth:', error);
          set({ isLoading: false });
        }
      },

      /**
       * Sign Out
       * Clears user session and resets auth state
       */
      signOut: async () => {
        try {
          set({ isLoading: true, error: null });

          const { error } = await supabase.auth.signOut();

          if (error) throw error;

          // Reset state
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

      /**
       * Refresh User Profile
       * Fetches latest user profile from Supabase
       */
      refreshProfile: async () => {
        try {
          const { user } = get();

          if (!user) {
            throw new Error('No authenticated user');
          }

          // Fetch user profile from Supabase
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

      /**
       * Reset Store
       * Resets all state to initial values
       */
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'manifest-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist essential auth data
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * Selector Hooks
 * Optimized hooks that only re-render when specific values change
 */

export const useUser = () => useAuthStore((state) => state.user);
export const useProfile = () => useAuthStore((state) => state.profile);
export const useSession = () => useAuthStore((state) => state.session);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

/**
 * Action Hooks
 * Separate hooks for actions to prevent unnecessary re-renders
 */

export const useSignOut = () => useAuthStore((state) => state.signOut);
export const useRefreshProfile = () =>
  useAuthStore((state) => state.refreshProfile);

/**
 * Subscription Tier Helper
 * Returns the user's current subscription tier
 */
export const useSubscriptionTier = () =>
  useAuthStore((state) => state.profile?.subscriptionTier ?? 'free');

/**
 * Feature Gate Helper
 * Checks if user has access to a specific feature based on tier
 */
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
