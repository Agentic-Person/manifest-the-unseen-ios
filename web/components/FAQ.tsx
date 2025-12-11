'use client'

import { useState } from 'react'

const faqs = [
  {
    question: 'What\'s included in the 7-day free trial?',
    answer: 'You get full access to the Enlightenment Path tier—all 10 workbook phases, unlimited meditations, unlimited AI chat, and all premium features. No credit card required to start. Experience everything before choosing your path.',
  },
  {
    question: 'How does voice journaling work?',
    answer: 'Simply tap the microphone and speak. Our on-device AI (powered by Whisper) transcribes your words instantly. The audio never leaves your phone—only the text is saved. This ensures maximum privacy while making journaling effortless.',
  },
  {
    question: 'Is my data private and secure?',
    answer: 'Absolutely. Voice transcription happens on your device—audio never uploads to servers. Journal entries are encrypted. We use Apple Sign-In for secure authentication. Your personal growth journey stays personal.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, cancel anytime through your Apple ID subscriptions. You\'ll keep access until the end of your billing period. If you cancel during the free trial, you won\'t be charged at all.',
  },
  {
    question: 'What are the 10 phases of the workbook?',
    answer: 'The journey includes: (1) Self-Evaluation, (2) Values & Vision, (3) Goal Setting, (4) Facing Fears & Limiting Beliefs, (5) Self-Love & Self-Care, (6) Manifestation Techniques, (7) Gratitude, (8) Turning Envy Into Inspiration, (9) Trust & Surrender, and (10) Letting Go.',
  },
  {
    question: 'What makes the AI Monk Companion special?',
    answer: 'Unlike generic AI chatbots, our companion is trained specifically on manifestation wisdom, ancient teachings, and the methodologies in our workbook. It knows which phase you\'re in and provides contextual guidance for your specific journey.',
  },
  {
    question: 'Can I use the app offline?',
    answer: 'Yes! Meditations can be downloaded for offline playback. Journaling works offline with entries syncing when you reconnect. The workbook is fully accessible offline too.',
  },
  {
    question: 'What if I want to upgrade or downgrade my plan?',
    answer: 'You can change your subscription tier anytime. Upgrades take effect immediately with prorated billing. Downgrades take effect at your next billing cycle.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 bg-deep-void">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-enlightened">Frequently Asked </span>
            <span className="text-gradient-gold">Questions</span>
          </h2>
          <p className="text-xl text-muted-wisdom">
            Everything you need to know about your manifestation journey
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-elevated rounded-xl overflow-hidden bg-temple-stone/30"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-temple-stone/50 transition-colors"
              >
                <span className="font-serif text-lg text-enlightened">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-aged-gold flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-5 text-muted-wisdom leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 bg-temple-stone/30 rounded-2xl border border-elevated">
          <p className="text-enlightened mb-2">Still have questions?</p>
          <p className="text-muted-wisdom mb-4">We&apos;re here to help you on your journey.</p>
          <a
            href="mailto:hello@manifesttheunseen.app"
            className="inline-flex items-center text-aged-gold hover:underline"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            hello@manifesttheunseen.app
          </a>
        </div>
      </div>
    </section>
  )
}
