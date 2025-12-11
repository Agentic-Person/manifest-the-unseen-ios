'use client'

const tiers = [
  {
    name: 'Novice',
    tagline: 'Begin your journey',
    monthlyPrice: 7.99,
    yearlyPrice: 59.99,
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
    yearlyPrice: 149.99,
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
    yearlyPrice: 449.99,
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

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-deep-void">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
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
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-light text-enlightened">${tier.monthlyPrice}</span>
                  <span className="text-muted-wisdom text-sm">/mo</span>
                </div>
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
