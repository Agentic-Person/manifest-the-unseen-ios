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
            console.log('[Auth] DEV_SKIP_AUTH enabled - signing in as demo user');

            // First check if we already have a valid session
            const { data: existingSession } = await supabase.auth.getSession();
            if (existingSession?.session) {
              console.log('[Auth] Existing session found for:', existingSession.session.user.email);
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
              console.error('[Auth] Demo user sign-in failed:', error.message);
              console.log('[Auth] Hint: Ensure demo user exists in Supabase with password set');
              set({ isLoading: false });
              return;
            }

            console.log('[Auth] Demo user signed in successfully:', data.user.id);
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
          console.error('Failed to initialize auth:', error);
          set({ isLoading: false });
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true, error: null });

          const { error } = await supabase.auth.signOut();

          if (error) throw error;

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
      storage: createJSONStorage(() => AsyncStorage),
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
