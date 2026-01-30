'use client'

import { useEffect, useState } from 'react'
import { supabase, UserProfile } from '@/lib/supabase'
import { useAuth } from './useAuth'
import type {
  Platform,
  Subscription,
  SubscriptionTier,
  SubscriptionStatus,
  BillingInterval,
  UseSubscriptionReturn as SubscriptionReturnType,
} from '@/types/subscription'

// Legacy types for backward compatibility with users table
export type LegacySubscriptionTier = 'novice' | 'awakening' | 'enlightenment' | null
export type LegacySubscriptionStatus = 'active' | 'canceled' | 'expired' | 'billing_issue' | null

// Combined hook options
export interface UseSubscriptionOptions {
  /**
   * Platform to check subscription for.
   * - 'ios': Query subscriptions table for iOS RevenueCat subscriptions
   * - 'web': Query subscriptions table for web Stripe subscriptions
   * - undefined: Query users table for legacy/mobile subscriptions (backward compatible)
   */
  platform?: Platform
}

// Hook return type combining legacy and new return types
export interface UseSubscriptionReturn {
  // New subscription object (when using platform parameter)
  subscription: Subscription | null
  // Common fields
  isSubscribed: boolean
  tier: SubscriptionTier | LegacySubscriptionTier
  status: SubscriptionStatus | LegacySubscriptionStatus
  expiresAt: Date | null
  // New fields from subscriptions table
  platform: Platform | null
  cancelAtPeriodEnd: boolean
  billingInterval: BillingInterval | null
  // State
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
}

/**
 * useSubscription hook checks user's subscription status.
 *
 * Supports two modes:
 * 1. Without platform parameter: Queries the users table (legacy, backward compatible)
 * 2. With platform parameter: Queries the subscriptions table for platform-specific subscription
 *
 * @param options - Configuration options
 * @returns Subscription state and methods
 *
 * @example
 * ```tsx
 * // Legacy mode - queries users table (for mobile app compatibility)
 * const { isSubscribed, tier, status, loading } = useSubscription()
 *
 * // Platform-specific mode - queries subscriptions table
 * const { subscription, isSubscribed, tier } = useSubscription({ platform: 'web' })
 *
 * if (loading) return <div>Loading...</div>
 * if (!isSubscribed) return <div>Please subscribe to access workbook</div>
 *
 * return (
 *   <div>
 *     <p>Active subscription: {tier}</p>
 *     <Workbook />
 *   </div>
 * )
 * ```
 */
export function useSubscription(options?: UseSubscriptionOptions): UseSubscriptionReturn {
  const { user, loading: authLoading } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [tier, setTier] = useState<SubscriptionTier | LegacySubscriptionTier>(null)
  const [status, setStatus] = useState<SubscriptionStatus | LegacySubscriptionStatus>(null)
  const [expiresAt, setExpiresAt] = useState<Date | null>(null)
  const [platform, setPlatform] = useState<Platform | null>(null)
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false)
  const [billingInterval, setBillingInterval] = useState<BillingInterval | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const resetState = () => {
    setSubscription(null)
    setTier(null)
    setStatus(null)
    setExpiresAt(null)
    setPlatform(null)
    setCancelAtPeriodEnd(false)
    setBillingInterval(null)
  }

  const fetchSubscription = async () => {
    if (!user) {
      resetState()
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      if (options?.platform) {
        // Query subscriptions table for platform-specific subscription
        const { data, error: queryError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('platform', options.platform)
          .in('status', ['active', 'trialing'])
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (queryError) {
          // No subscription found is not an error
          if (queryError.code === 'PGRST116') {
            resetState()
            return
          }
          throw queryError
        }

        const sub = data as Subscription
        setSubscription(sub)
        setTier(sub.tier)
        setStatus(sub.status)
        setExpiresAt(sub.current_period_end ? new Date(sub.current_period_end) : null)
        setPlatform(sub.platform)
        setCancelAtPeriodEnd(sub.cancel_at_period_end)
        setBillingInterval(sub.billing_interval || null)
      } else {
        // Legacy mode: Query users table for backward compatibility
        const { data, error: queryError } = await supabase
          .from('users')
          .select('subscription_tier, subscription_status, subscription_expires_at')
          .eq('id', user.id)
          .single()

        if (queryError) throw queryError

        const profile = data as Pick<
          UserProfile,
          'subscription_tier' | 'subscription_status' | 'subscription_expires_at'
        >

        setTier(profile.subscription_tier)
        setStatus(profile.subscription_status)
        setExpiresAt(
          profile.subscription_expires_at
            ? new Date(profile.subscription_expires_at)
            : null
        )
        // Keep platform-specific fields null in legacy mode
        setPlatform(null)
        setCancelAtPeriodEnd(false)
        setBillingInterval(null)
        setSubscription(null)
      }
    } catch (err) {
      console.error('Subscription fetch error:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch subscription'))
      resetState()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      fetchSubscription()
    }
  }, [user, authLoading, options?.platform])

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return

    const tableName = options?.platform ? 'subscriptions' : 'users'
    const filterColumn = options?.platform ? 'user_id' : 'id'

    const channel = supabase
      .channel(`subscription-${user.id}-${options?.platform || 'legacy'}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
          filter: `${filterColumn}=eq.${user.id}`,
        },
        (payload) => {
          if (options?.platform) {
            // Handle subscriptions table updates
            const updated = payload.new as Subscription
            if (updated && updated.platform === options.platform) {
              setSubscription(updated)
              setTier(updated.tier)
              setStatus(updated.status)
              setExpiresAt(
                updated.current_period_end
                  ? new Date(updated.current_period_end)
                  : null
              )
              setPlatform(updated.platform)
              setCancelAtPeriodEnd(updated.cancel_at_period_end)
              setBillingInterval(updated.billing_interval || null)
            }
          } else {
            // Handle users table updates (legacy)
            const updated = payload.new as UserProfile
            if (updated) {
              setTier(updated.subscription_tier)
              setStatus(updated.subscription_status)
              setExpiresAt(
                updated.subscription_expires_at
                  ? new Date(updated.subscription_expires_at)
                  : null
              )
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, options?.platform])

  const isSubscribed = status === 'active' || status === 'trialing'

  return {
    subscription,
    isSubscribed,
    tier,
    status,
    expiresAt,
    platform,
    cancelAtPeriodEnd,
    billingInterval,
    loading: authLoading || loading,
    error,
    refresh: fetchSubscription,
  }
}
