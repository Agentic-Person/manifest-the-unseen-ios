'use client'

const tiers = [
  {
    name: 'Novice Path',
    emoji: '🌱',
    tagline: 'Begin your journey of awakening',
    monthlyPrice: 7.99,
    yearlyPrice: 59.99,
    features: [
      'Phases 1-5 of workbook',
      '3 guided meditations',
      '50 journal entries/month',
      '30 AI chat messages/day',
      '1 vision board',
      'Female narrator only',
    ],
    highlighted: false,
  },
  {
    name: 'Awakening Path',
    emoji: '🧘',
    tagline: 'Deepen your practice and expand awareness',
    monthlyPrice: 12.99,
    yearlyPrice: 99.99,
    features: [
      'Phases 1-8 of workbook',
      '6 guided meditations',
      '200 journal entries/month',
      '100 AI chat messages/day',
      '3 vision boards',
      'Male + female narrators',
      'Advanced analytics',
      'Priority support',
    ],
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enlightenment Path',
    emoji: '✨',
    tagline: 'Embody mastery and unlimited potential',
    monthlyPrice: 19.99,
    yearlyPrice: 149.99,
    features: [
      'All 10 workbook phases',
      'Unlimited meditations',
      'Unlimited journal entries',
      'Unlimited AI chat',
      'Unlimited vision boards',
      'Premium analytics + PDF exports',
      'Early access to new content',
      'Priority video support',
    ],
    highlighted: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-temple-stone/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-enlightened">Choose Your </span>
            <span className="text-gradient-gold">Path</span>
          </h2>
          <p className="text-xl text-muted-wisdom max-w-2xl mx-auto mb-4">
            Start with a 7-day free trial. Full Enlightenment access, no credit card required.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-aged-gold/10 border border-aged-gold/30 rounded-full text-aged-gold text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>Save up to 37% with annual billing</span>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative p-8 rounded-2xl transition-all duration-300 ${
                tier.highlighted
                  ? 'bg-gradient-to-b from-aged-gold/10 to-deep-void border-2 border-aged-gold glow-gold scale-105'
                  : 'bg-deep-void/50 border border-elevated hover:border-aged-gold/30'
              }`}
            >
              {/* Popular badge */}
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-gold text-deep-void text-sm font-semibold rounded-full">
                  {tier.badge}
                </div>
              )}

              {/* Tier header */}
              <div className="text-center mb-6">
                <span className="text-4xl mb-4 block">{tier.emoji}</span>
                <h3 className="font-serif text-2xl font-bold text-enlightened mb-2">
                  {tier.name}
                </h3>
                <p className="text-muted-wisdom text-sm">{tier.tagline}</p>
              </div>

              {/* Pricing */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-enlightened">${tier.monthlyPrice}</span>
                  <span className="text-muted-wisdom">/month</span>
                </div>
                <p className="text-sm text-muted-wisdom mt-1">
                  or ${tier.yearlyPrice}/year
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      className={`w-5 h-5 flex-shrink-0 ${tier.highlighted ? 'text-aged-gold' : 'text-heart-emerald'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-muted-wisdom text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className={`w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
                  tier.highlighted
                    ? 'bg-gradient-gold text-deep-void hover:opacity-90'
                    : 'bg-temple-stone text-enlightened border border-aged-gold/30 hover:bg-aged-gold/10'
                }`}
              >
                Coming Soon
              </button>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-12 text-center">
          <p className="text-muted-wisdom text-sm mb-4">Trusted payment processing</p>
          <div className="flex justify-center items-center gap-8 opacity-50">
            <span className="text-muted-wisdom font-medium">Apple Pay</span>
            <span className="text-muted-wisdom">•</span>
            <span className="text-muted-wisdom font-medium">Secure Checkout</span>
            <span className="text-muted-wisdom">•</span>
            <span className="text-muted-wisdom font-medium">Cancel Anytime</span>
          </div>
        </div>
      </div>
    </section>
  )
}
