'use client'

import { useEffect, useState } from 'react'
import { supabase, UserProfile } from '@/lib/supabase'
import { useAuth } from './useAuth'

export type SubscriptionTier = 'novice' | 'awakening' | 'enlightenment' | null
export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'billing_issue' | null

export interface UseSubscriptionReturn {
  isSubscribed: boolean
  tier: SubscriptionTier
  status: SubscriptionStatus
  expiresAt: Date | null
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
}

/**
 * useSubscription hook checks user's subscription status from the users table.
 * Subscription data is synced from mobile app via RevenueCat webhook.
 *
 * @example
 * ```tsx
 * const { isSubscribed, tier, status, loading } = useSubscription()
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
export function useSubscription(): UseSubscriptionReturn {
  const { user, loading: authLoading } = useAuth()
  const [tier, setTier] = useState<SubscriptionTier>(null)
  const [status, setStatus] = useState<SubscriptionStatus>(null)
  const [expiresAt, setExpiresAt] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSubscription = async () => {
    if (!user) {
      setTier(null)
      setStatus(null)
      setExpiresAt(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

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
    } catch (err) {
      console.error('Subscription fetch error:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch subscription'))
      setTier(null)
      setStatus(null)
      setExpiresAt(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      fetchSubscription()
    }
  }, [user, authLoading])

  // Set up real-time subscription to users table
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel(`subscription-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          const updated = payload.new as UserProfile
          setTier(updated.subscription_tier)
          setStatus(updated.subscription_status)
          setExpiresAt(
            updated.subscription_expires_at
              ? new Date(updated.subscription_expires_at)
              : null
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const isSubscribed = status === 'active'

  return {
    isSubscribed,
    tier,
    status,
    expiresAt,
    loading: authLoading || loading,
    error,
    refresh: fetchSubscription,
  }
}
