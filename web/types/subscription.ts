/**
 * Subscription Types for Multi-Platform Support
 *
 * Supports both iOS (RevenueCat) and Web (Stripe) subscriptions
 */

export type Platform = 'ios' | 'web'
export type SubscriptionProvider = 'revenuecat' | 'stripe'
export type SubscriptionTier = 'novice' | 'awakening' | 'enlightenment'
export type SubscriptionStatus = 'active' | 'trialing' | 'canceled' | 'past_due' | 'expired'
export type BillingInterval = 'month' | 'year'

/**
 * Subscription record from database
 */
export interface Subscription {
  id: string
  user_id: string
  platform: Platform
  tier: SubscriptionTier
  status: SubscriptionStatus
  provider: SubscriptionProvider
  stripe_customer_id?: string | null
  stripe_subscription_id?: string | null
  stripe_price_id?: string | null
  revenuecat_app_user_id?: string | null
  current_period_start?: string | null
  current_period_end?: string | null
  cancel_at_period_end: boolean
  trial_end?: string | null
  billing_interval?: BillingInterval | null
  created_at: string
  updated_at: string
}

/**
 * Stripe product/price configuration
 */
export interface StripePriceConfig {
  priceId: string
  tier: SubscriptionTier
  interval: BillingInterval
  amount: number // in cents
  currency: string
}

/**
 * Pricing tier display info
 */
export interface PricingTier {
  id: SubscriptionTier
  name: string
  tagline: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  yearlyDiscount: number // percentage saved
  features: string[]
  highlighted: boolean
  stripeMonthlyPriceId: string
  stripeYearlyPriceId: string
}

/**
 * Stripe checkout session request
 */
export interface CheckoutRequest {
  priceId: string
  tier: SubscriptionTier
  billingInterval: BillingInterval
  successUrl?: string
  cancelUrl?: string
}

/**
 * Stripe checkout session response
 */
export interface CheckoutResponse {
  checkoutUrl: string
  sessionId: string
}

/**
 * Customer portal request
 */
export interface PortalRequest {
  returnUrl?: string
}

/**
 * Customer portal response
 */
export interface PortalResponse {
  portalUrl: string
}

/**
 * Subscription hook return type
 */
export interface UseSubscriptionReturn {
  subscription: Subscription | null
  isSubscribed: boolean
  tier: SubscriptionTier | null
  status: SubscriptionStatus | null
  platform: Platform | null
  expiresAt: Date | null
  cancelAtPeriodEnd: boolean
  billingInterval: BillingInterval | null
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
}

/**
 * Pricing tiers configuration
 * Matches iOS App Store pricing for consistency
 */
export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'novice',
    name: 'Seeker',
    tagline: 'Begin Your Journey',
    description: 'Perfect for starting your manifestation practice',
    monthlyPrice: 7.99,
    yearlyPrice: 69.99,
    yearlyDiscount: 27, // save ~27%
    features: [
      'Phases 1-5 of the workbook',
      '3 guided meditations',
      '50 journal entries per month',
      'Basic progress tracking',
      'Daily affirmations',
    ],
    highlighted: false,
    stripeMonthlyPriceId: 'price_novice_monthly', // Replace with actual Stripe price IDs
    stripeYearlyPriceId: 'price_novice_yearly',
  },
  {
    id: 'awakening',
    name: 'Awakening',
    tagline: 'Most Popular',
    description: 'Unlock advanced features and AI guidance',
    monthlyPrice: 18.99,
    yearlyPrice: 189.99,
    yearlyDiscount: 17, // save ~17%
    features: [
      'Phases 1-8 of the workbook',
      '6 guided meditations',
      '200 journal entries per month',
      'Guru AI phase analysis',
      'Advanced progress analytics',
      'All breathing exercises',
    ],
    highlighted: true,
    stripeMonthlyPriceId: 'price_awakening_monthly',
    stripeYearlyPriceId: 'price_awakening_yearly',
  },
  {
    id: 'enlightenment',
    name: 'Enlightenment',
    tagline: 'Complete Experience',
    description: 'Full access to everything, forever',
    monthlyPrice: 29.99,
    yearlyPrice: 279.99,
    yearlyDiscount: 22, // save ~22%
    features: [
      'All 10 workbook phases',
      'All meditations & prayers',
      'Unlimited journal entries',
      'Unlimited Guru AI guidance',
      'Priority support',
      'Early access to new features',
      'Lifetime content updates',
    ],
    highlighted: false,
    stripeMonthlyPriceId: 'price_enlightenment_monthly',
    stripeYearlyPriceId: 'price_enlightenment_yearly',
  },
]

/**
 * Get pricing tier by ID
 */
export function getPricingTier(tierId: SubscriptionTier): PricingTier | undefined {
  return PRICING_TIERS.find(tier => tier.id === tierId)
}

/**
 * Get display name for subscription tier
 */
export function getTierDisplayName(tier: SubscriptionTier): string {
  const tierMap: Record<SubscriptionTier, string> = {
    novice: 'Seeker',
    awakening: 'Awakening',
    enlightenment: 'Enlightenment',
  }
  return tierMap[tier]
}

/**
 * Get display name for subscription status
 */
export function getStatusDisplayName(status: SubscriptionStatus): string {
  const statusMap: Record<SubscriptionStatus, string> = {
    active: 'Active',
    trialing: 'Trial',
    canceled: 'Canceled',
    past_due: 'Past Due',
    expired: 'Expired',
  }
  return statusMap[status]
}

/**
 * Check if status is considered "subscribed"
 */
export function isActiveStatus(status: SubscriptionStatus): boolean {
  return status === 'active' || status === 'trialing'
}
