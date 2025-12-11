'use client'

const steps = [
  {
    number: '01',
    title: 'Start Your Free Trial',
    description: 'Begin with 7 days of full Enlightenment Path access. Explore all 10 phases, unlimited meditations, and AI wisdom.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Journey Through 10 Phases',
    description: 'Work through self-evaluation, goal setting, manifestation techniques, and more—at your own pace.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Manifest Daily',
    description: 'Journal your thoughts, meditate with guidance, and receive AI wisdom tailored to your current phase.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section className="py-24 bg-deep-void">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-enlightened">How It </span>
            <span className="text-gradient-gold">Works</span>
          </h2>
          <p className="text-xl text-muted-wisdom max-w-2xl mx-auto">
            Your transformation journey in three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-aged-gold/30 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center">
                {/* Step number badge */}
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-temple-stone border-2 border-aged-gold/50 mb-6">
                  <span className="text-aged-gold font-serif text-2xl font-bold">{step.number}</span>
                  {/* Icon overlay */}
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-deep-void border border-aged-gold/30 flex items-center justify-center text-aged-gold">
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-serif text-xl font-semibold text-enlightened mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-wisdom leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="#pricing"
            className="inline-flex items-center px-8 py-4 bg-gradient-gold text-deep-void font-semibold rounded-full hover:opacity-90 transition-all duration-300 glow-gold-hover"
          >
            Start Your Journey
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
