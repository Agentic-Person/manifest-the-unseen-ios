'use client'

import { useState } from 'react'

const faqs = [
  {
    question: 'What\'s included in the free trial?',
    answer: 'Full access to all features for 7 days. No credit card required.',
  },
  {
    question: 'How does voice journaling work?',
    answer: 'Speak naturally and our on-device AI transcribes instantly. Your audio never leaves your phone.',
  },
  {
    question: 'Is my data private?',
    answer: 'Yes. Voice transcription happens on-device, journals are encrypted, and we never sell your data.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, cancel through your Apple ID settings. You keep access until the billing period ends.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 bg-temple-stone/20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-aged-gold/80 text-sm uppercase tracking-widest mb-3">
            Questions
          </p>
          <h2 className="font-serif text-3xl font-light text-enlightened">
            Common Questions
          </h2>
        </div>

        {/* FAQ accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-elevated/50"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-4 text-left flex items-center justify-between gap-4"
              >
                <span className="text-enlightened text-sm">
                  {faq.question}
                </span>
                <svg
                  className={`w-4 h-4 text-aged-gold/60 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-40 pb-4' : 'max-h-0'
                }`}
              >
                <p className="text-muted-wisdom text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
