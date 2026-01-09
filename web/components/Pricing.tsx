'use client'

import { useState, useEffect } from 'react'

// =============================================================================
// Promo Configuration
// =============================================================================

const PROMO_CODE = 'EARLY50'
const PROMO_DISCOUNT = 0.50 // 50%

// =============================================================================
// Tier Data
// =============================================================================

const tiers = [
  {
    name: 'Seeker',
    tagline: 'Begin your journey',
    monthlyPrice: 4.99,
    yearlyPrice: 49.99,
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
    monthlyPrice: 11.99,
    yearlyPrice: 129.99,
    features: [
      'Everything in Seeker',
      '6+ guided meditations',
      'Guru Access',
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
      '24+ guided meditations',
      '12+ prayers/affirmations',
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

  const scrollToQRCode = () => {
    const element = document.getElementById('promo-qr')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Add a brief highlight effect
      element.classList.add('ring-2', 'ring-amber-glow')
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-amber-glow')
      }, 2000)
    }
  }

  return (
    <section id="pricing" className="relative z-10 py-24 bg-deep-void">
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
          <div id="promo-qr" className="mb-10 p-6 bg-gradient-to-r from-crown-purple/30 to-amber-glow/20 rounded-2xl border border-amber-glow/40">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              {/* QR Code Placeholder */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center border-4 border-amber-glow/50 shadow-[0_0_20px_rgba(212,168,75,0.3)]">
                  <div className="text-center text-deep-void">
                    <svg className="w-12 h-12 mx-auto mb-1 opacity-40" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h1v1h-1v-1zm-3 0h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm1 1h1v1h-1v-1zm1-1h1v1h-1v-1zm1 1h1v1h-1v-1zm0 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-2-2h1v1h-1v-1zm0 2h1v1h-1v-1zm-1-1h1v1h-1v-1z"/>
                    </svg>
                    <span className="text-xs font-medium opacity-60">QR Code</span>
                  </div>
                </div>
                <p className="text-xs text-muted-wisdom text-center mt-2">Scan to download</p>
              </div>

              {/* Promo Content */}
              <div className="text-center md:text-left">
                <p className="text-xs uppercase tracking-widest text-amber-glow mb-2">
                  Limited Time Offer
                </p>
                <h3 className="font-serif text-2xl text-enlightened mb-2">
                  Get <span className="text-amber-glow font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">50% OFF</span> Monthly or Yearly
                </h3>
                <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                  <code className="bg-deep-void px-4 py-2 rounded-lg text-xl font-mono text-amber-glow border border-amber-glow/50 drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
                    {PROMO_CODE}
                  </code>
                  <button
                    onClick={handleCopyCode}
                    className="text-sm text-muted-wisdom hover:text-enlightened transition-colors px-3 py-1 rounded border border-elevated hover:border-amber-glow/50"
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
                    {/* Monthly with discount */}
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-lg text-muted-wisdom line-through">
                        ${tier.monthlyPrice}
                      </span>
                      <span className="text-3xl font-bold text-amber-glow drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                        ${getDiscountedPrice(tier.monthlyPrice)}
                      </span>
                      <span className="text-muted-wisdom text-sm">/mo</span>
                    </div>
                    {/* Yearly with discount */}
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-sm text-muted-wisdom line-through">
                        ${tier.yearlyPrice}/yr
                      </span>
                      <span className="text-lg font-bold text-amber-glow drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
                        ${getDiscountedPrice(tier.yearlyPrice)}/yr
                      </span>
                    </div>
                    <p className="text-xs text-amber-glow mt-2 font-semibold drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]">
                      50% OFF with code {PROMO_CODE}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-light text-enlightened">${tier.monthlyPrice}</span>
                      <span className="text-muted-wisdom text-sm">/mo</span>
                    </div>
                    <p className="text-xs text-muted-wisdom mt-1">
                      ${tier.yearlyPrice}/yr · Save {Math.round((1 - tier.yearlyPrice / (tier.monthlyPrice * 12)) * 100)}%
                    </p>
                  </>
                )}
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
                onClick={tier.badge !== 'Coming Soon' ? scrollToQRCode : undefined}
                className={`w-full py-2.5 px-4 rounded-full text-sm transition-all duration-300 ${
                  tier.badge === 'Coming Soon'
                    ? 'bg-transparent text-muted-wisdom border-2 border-white/50 cursor-not-allowed'
                    : 'bg-transparent text-enlightened border-2 border-white/60 hover:border-white/80'
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
