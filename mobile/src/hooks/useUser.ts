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

  return useQuery({
    queryKey: queryKeys.users.profile(user?.id || ''),
    queryFn: () => {
      if (!user?.id) {
        throw new Error('No authenticated user');
      }
      return getUserProfile(user.id);
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
    mutationFn: (updates: Partial<UserProfile>) => {
      if (!user?.id) {
        throw new Error('No authenticated user');
      }
      return updateUserProfile(user.id, updates);
    },
    onSuccess: (data) => {
      // Update Zustand store
      setProfile(data as UserProfile);

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
