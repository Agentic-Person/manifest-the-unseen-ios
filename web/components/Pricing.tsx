'use client'

import { useState, useEffect } from 'react'

// =============================================================================
// Promo Configuration
// =============================================================================

const PROMO_CODE = 'EARLY50'
const PROMO_DISCOUNT = 0.50 // 50%
const PROMO_DURATION_MONTHS = 3

// =============================================================================
// Tier Data
// =============================================================================

const tiers = [
  {
    name: 'Novice',
    tagline: 'Begin your journey',
    monthlyPrice: 7.99,
    yearlyPrice: 79.99,
    features: [
      'All 10 workbook phases',
      'Progress tracking',
      'Offline access',
    ],
    highlighted: false,
  },
  {
    name: 'Awakening',
    tagline: 'Deepen your practice',
    monthlyPrice: 19.99,
    yearlyPrice: 199.99,
    features: [
      'Everything in Novice',
      '6+ guided meditations',
      'Limited Guru access',
      'Advanced analytics',
    ],
    highlighted: true,
    badge: 'Popular',
  },
  {
    name: 'Enlightenment',
    tagline: 'The complete experience',
    monthlyPrice: 49.99,
    yearlyPrice: 499.99,
    features: [
      'Everything in Awakening',
      'Voice journaling + Guru feedback',
      '12+ meditation tracks',
      'Unlimited Guru access',
    ],
    highlighted: false,
    badge: 'Coming Soon',
  },
]

// =============================================================================
// Helper Functions
// =============================================================================

const getDiscountedPrice = (price: number): string => {
  return (price * (1 - PROMO_DISCOUNT)).toFixed(2)
}

// =============================================================================
// Component
// =============================================================================

export default function Pricing() {
  const [remainingSlots, setRemainingSlots] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  // Fetch remaining promo slots from Supabase Edge Function
  useEffect(() => {
    const fetchPromoSlots = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
          console.log('[Pricing] Supabase not configured, showing promo without live count')
          setRemainingSlots(30) // Default to max if not configured
          setIsLoading(false)
          return
        }

        const response = await fetch(
          `${supabaseUrl}/functions/v1/validate-promo`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey,
            },
            body: JSON.stringify({ code: PROMO_CODE, checkOnly: true }),
          }
        )

        const data = await response.json()
        if (data.valid) {
          setRemainingSlots(data.remainingSlots)
        } else {
          // Code is invalid or expired
          setRemainingSlots(0)
        }
      } catch (error) {
        console.error('[Pricing] Failed to fetch promo slots:', error)
        // Show promo anyway with unknown slots
        setRemainingSlots(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPromoSlots()
  }, [])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(PROMO_CODE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Show promo if slots remaining or still loading
  const showPromo = remainingSlots === null || remainingSlots > 0

  return (
    <section id="pricing" className="py-24 bg-deep-void">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-8">
          <p className="text-aged-gold/80 text-sm uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-enlightened mb-4">
            Choose Your Path
          </h2>
          <p className="text-muted-wisdom text-sm">
            7-day free trial · Cancel anytime
          </p>
        </div>

        {/* Promo Banner */}
        {showPromo && !isLoading && (
          <div className="mb-10 p-6 bg-gradient-to-r from-crown-purple/30 to-aged-gold/20 rounded-2xl border border-aged-gold/30">
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-aged-gold/80 mb-2">
                Limited Time Offer
              </p>
              <h3 className="font-serif text-2xl text-enlightened mb-2">
                Get <span className="text-aged-gold font-semibold">50% OFF</span> for {PROMO_DURATION_MONTHS} Months
              </h3>
              <div className="flex items-center justify-center gap-3 mb-3">
                <code className="bg-deep-void px-4 py-2 rounded-lg text-xl font-mono text-aged-gold border border-aged-gold/50">
                  {PROMO_CODE}
                </code>
                <button
                  onClick={handleCopyCode}
                  className="text-sm text-muted-wisdom hover:text-enlightened transition-colors px-3 py-1 rounded border border-elevated hover:border-aged-gold/50"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-sm text-muted-wisdom">
                Enter this code in the app after downloading
              </p>
              {remainingSlots !== null && remainingSlots < 15 && (
                <p className="mt-2 text-sm font-semibold text-orange-400">
                  Only {remainingSlots} spots remaining!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Promo Expired Banner */}
        {remainingSlots === 0 && !isLoading && (
          <div className="mb-10 p-4 bg-temple-stone/30 rounded-xl border border-elevated text-center">
            <p className="text-muted-wisdom text-sm">
              Early bird offer has ended. Regular pricing applies.
            </p>
          </div>
        )}

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative p-6 rounded-xl transition-all duration-300 ${
                tier.highlighted
                  ? 'bg-temple-stone/50 border border-aged-gold/50'
                  : 'bg-temple-stone/20 border border-elevated'
              }`}
            >
              {/* Badge */}
              {tier.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs rounded-full ${
                  tier.badge === 'Coming Soon'
                    ? 'bg-crown-purple/80 text-enlightened'
                    : 'bg-aged-gold text-deep-void'
                }`}>
                  {tier.badge}
                </div>
              )}

              {/* Tier header */}
              <div className="text-center mb-6 pt-2">
                <h3 className="font-serif text-xl text-enlightened mb-1">
                  {tier.name}
                </h3>
                <p className="text-muted-wisdom text-xs">{tier.tagline}</p>
              </div>

              {/* Pricing */}
              <div className="text-center mb-6">
                {showPromo && !isLoading ? (
                  <>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-lg text-muted-wisdom line-through">
                        ${tier.monthlyPrice}
                      </span>
                      <span className="text-3xl font-light text-aged-gold">
                        ${getDiscountedPrice(tier.monthlyPrice)}
                      </span>
                      <span className="text-muted-wisdom text-sm">/mo</span>
                    </div>
                    <p className="text-xs text-aged-gold mt-1">
                      for first {PROMO_DURATION_MONTHS} months, then ${tier.monthlyPrice}/mo
                    </p>
                  </>
                ) : (
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-light text-enlightened">${tier.monthlyPrice}</span>
                    <span className="text-muted-wisdom text-sm">/mo</span>
                  </div>
                )}
                <p className="text-xs text-muted-wisdom mt-1">
                  ${tier.yearlyPrice}/yr · Save {Math.round((1 - tier.yearlyPrice / (tier.monthlyPrice * 12)) * 100)}%
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted-wisdom">
                    <span className="text-aged-gold mt-0.5">·</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className={`w-full py-2.5 px-4 rounded-full text-sm transition-all duration-300 ${
                  tier.highlighted
                    ? 'bg-aged-gold text-deep-void hover:bg-aged-gold/90'
                    : tier.badge === 'Coming Soon'
                    ? 'bg-transparent text-muted-wisdom border border-elevated cursor-not-allowed'
                    : 'bg-transparent text-enlightened border border-aged-gold/30 hover:border-aged-gold/50'
                }`}
                disabled={tier.badge === 'Coming Soon'}
              >
                {tier.badge === 'Coming Soon' ? 'Coming Soon' : 'Start Free Trial'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
