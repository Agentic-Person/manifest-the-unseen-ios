/**
 * User Query Hooks
 *
 * TanStack Query hooks for user-related data fetching.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../services/queryClient';
import { getUserProfile, updateUserProfile } from '../services/supabase';
import { useAuthStore } from '../stores/authStore';
import type { UserProfile } from '../types/store';
import type { Database } from '../types/database';

/**
 * Use User Profile Query
 *
 * Fetches the current user's profile from Supabase.
 * Automatically refetches when user ID changes.
 *
 * @example
 * ```tsx
 * function ProfileScreen() {
 *   const { data: profile, isLoading, error } = useUserProfile();
 *
 *   if (isLoading) return <Loading />;
 *   if (error) return <Error message={error.message} />;
 *
 *   return <Text>{profile?.fullName}</Text>;
 * }
 * ```
 */
export const useUserProfile = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery<UserProfile, Error>({
    queryKey: queryKeys.users.profile(user?.id || ''),
    queryFn: async (): Promise<UserProfile> => {
      if (!user?.id) {
        throw new Error('No authenticated user');
      }
      const data = await getUserProfile(user.id);
      // Transform database row to UserProfile type
      return {
        id: data.id,
        email: data.email,
        fullName: data.full_name ?? undefined,
        avatarUrl: data.avatar_url ?? undefined,
        subscriptionTier: data.subscription_tier,
        subscriptionStatus: data.subscription_status,
        trialEndsAt: data.trial_ends_at ?? undefined,
        currentPhase: data.current_phase,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    },
    enabled: !!user?.id, // Only run query if user is authenticated
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Use Update User Profile Mutation
 *
 * Mutation hook for updating user profile.
 * Automatically invalidates and refetches profile on success.
 *
 * @example
 * ```tsx
 * function EditProfileScreen() {
 *   const updateProfile = useUpdateUserProfile();
 *
 *   const handleSave = () => {
 *     updateProfile.mutate({
 *       fullName: 'John Doe',
 *       avatarUrl: 'https://...',
 *     });
 *   };
 *
 *   return (
 *     <Button
 *       onPress={handleSave}
 *       loading={updateProfile.isPending}
 *     >
 *       Save
 *     </Button>
 *   );
 * }
 * ```
 */
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const setProfile = useAuthStore((state) => state.setProfile);

  return useMutation({
    mutationFn: async (updates: Partial<UserProfile>): Promise<UserProfile> => {
      if (!user?.id) {
        throw new Error('No authenticated user');
      }
      // Transform camelCase UserProfile to snake_case database fields
      const dbUpdates: Database['public']['Tables']['users']['Update'] = {};
      if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
      if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;
      if (updates.subscriptionTier !== undefined) dbUpdates.subscription_tier = updates.subscriptionTier;
      if (updates.subscriptionStatus !== undefined) dbUpdates.subscription_status = updates.subscriptionStatus;
      if (updates.trialEndsAt !== undefined) dbUpdates.trial_ends_at = updates.trialEndsAt;
      if (updates.currentPhase !== undefined) dbUpdates.current_phase = updates.currentPhase;

      const data = await updateUserProfile(user.id, dbUpdates);
      // Transform response back to UserProfile
      return {
        id: data.id,
        email: data.email,
        fullName: data.full_name ?? undefined,
        avatarUrl: data.avatar_url ?? undefined,
        subscriptionTier: data.subscription_tier,
        subscriptionStatus: data.subscription_status,
        trialEndsAt: data.trial_ends_at ?? undefined,
        currentPhase: data.current_phase,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    },
    onSuccess: (data) => {
      // Update Zustand store
      setProfile(data);

      // Invalidate and refetch user profile query
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.profile(user?.id || ''),
      });
    },
  });
};

/**
 * Use Subscription Status Query
 *
 * Fetches the user's subscription status.
 * Useful for feature gating and UI updates.
 *
 * @example
 * ```tsx
 * function SubscriptionBanner() {
 *   const { data: status } = useSubscriptionStatus();
 *
 *   if (status?.tier === 'free') {
 *     return <UpgradeBanner />;
 *   }
 *
 *   return null;
 * }
 * ```
 */
export const useSubscriptionStatus = () => {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);

  return useQuery({
    queryKey: queryKeys.subscription.status(user?.id || ''),
    queryFn: async () => {
      if (!profile) {
        throw new Error('No user profile');
      }

      return {
        tier: profile.subscriptionTier,
        status: profile.subscriptionStatus,
        trialEndsAt: profile.trialEndsAt,
      };
    },
    enabled: !!user?.id && !!profile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
