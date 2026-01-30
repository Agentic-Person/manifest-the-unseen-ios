/**
 * Stripe Client Utilities
 *
 * Functions to interact with Stripe Edge Functions for subscription management.
 * Uses the existing Supabase client pattern from web/lib/supabase.ts.
 */

import { supabase } from './supabase'
import type {
  CheckoutRequest,
  CheckoutResponse,
  PortalRequest,
  PortalResponse,
} from '@/types/subscription'

// Validate required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

/**
 * Creates a Stripe Checkout session via the stripe-checkout Edge Function.
 *
 * @param request - Checkout request with priceId, tier, and billing interval
 * @returns Promise with checkout URL and session ID
 *
 * @example
 * ```ts
 * const { checkoutUrl } = await createCheckoutSession({
 *   priceId: 'price_awakening_monthly',
 *   tier: 'awakening',
 *   billingInterval: 'month',
 *   successUrl: '/subscription/success',
 *   cancelUrl: '/pricing',
 * })
 * window.location.href = checkoutUrl
 * ```
 */
export async function createCheckoutSession(
  request: CheckoutRequest
): Promise<CheckoutResponse> {
  // Get the current session for auth
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()

  if (sessionError || !session) {
    throw new Error('You must be logged in to subscribe')
  }

  // Build the full URLs
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const successUrl = request.successUrl
    ? `${baseUrl}${request.successUrl}`
    : `${baseUrl}/subscription/success`
  const cancelUrl = request.cancelUrl
    ? `${baseUrl}${request.cancelUrl}`
    : `${baseUrl}/pricing`

  const response = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      priceId: request.priceId,
      tier: request.tier,
      billingInterval: request.billingInterval,
      successUrl,
      cancelUrl,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Checkout failed: ${response.statusText}`)
  }

  const data = await response.json()

  if (!data.checkoutUrl) {
    throw new Error('No checkout URL returned from server')
  }

  return {
    checkoutUrl: data.checkoutUrl,
    sessionId: data.sessionId,
  }
}

/**
 * Creates a Stripe Customer Portal session via the stripe-portal Edge Function.
 *
 * @param request - Portal request with optional return URL
 * @returns Promise with portal URL
 *
 * @example
 * ```ts
 * const { portalUrl } = await createPortalSession({
 *   returnUrl: '/app/dashboard',
 * })
 * window.location.href = portalUrl
 * ```
 */
export async function createPortalSession(
  request: PortalRequest = {}
): Promise<PortalResponse> {
  // Get the current session for auth
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()

  if (sessionError || !session) {
    throw new Error('You must be logged in to manage subscription')
  }

  // Build the return URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const returnUrl = request.returnUrl
    ? `${baseUrl}${request.returnUrl}`
    : `${baseUrl}/app/dashboard`

  const response = await fetch(`${supabaseUrl}/functions/v1/stripe-portal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ returnUrl }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Portal request failed: ${response.statusText}`)
  }

  const data = await response.json()

  if (!data.portalUrl) {
    throw new Error('No portal URL returned from server')
  }

  return {
    portalUrl: data.portalUrl,
  }
}

/**
 * Redirects the user to Stripe Checkout.
 * Convenience wrapper around createCheckoutSession.
 *
 * @param request - Checkout request parameters
 */
export async function redirectToCheckout(request: CheckoutRequest): Promise<void> {
  const { checkoutUrl } = await createCheckoutSession(request)
  window.location.href = checkoutUrl
}

/**
 * Redirects the user to the Stripe Customer Portal.
 * Convenience wrapper around createPortalSession.
 *
 * @param returnUrl - Optional URL to return to after portal session
 */
export async function redirectToPortal(returnUrl?: string): Promise<void> {
  const { portalUrl } = await createPortalSession({ returnUrl })
  window.location.href = portalUrl
}
