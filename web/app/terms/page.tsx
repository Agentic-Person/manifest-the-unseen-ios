import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service | Manifest the Unseen',
  description: 'Terms of Service for Manifest the Unseen iOS application',
}

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-deep-void">
      {/* Header */}
      <header className="border-b border-elevated">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-aged-gold hover:opacity-80 transition-opacity">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-enlightened mb-4">
          Terms of Service
        </h1>
        <p className="text-muted-wisdom mb-12">
          Last updated: December 10, 2025
        </p>

        <div className="prose prose-invert prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              By downloading, installing, or using Manifest the Unseen (&quot;the App&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the App.
            </p>
            <p className="text-muted-wisdom leading-relaxed">
              We reserve the right to update these Terms at any time. Continued use of the App after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">2. Description of Service</h2>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              Manifest the Unseen is a personal development and manifestation application that provides:
            </p>
            <ul className="list-disc pl-6 text-muted-wisdom space-y-2">
              <li>A digital workbook with 10 phases of transformation exercises</li>
              <li>Voice-to-text journaling functionality</li>
              <li>Guided meditation and breathing exercises</li>
              <li>AI-powered wisdom companion (&quot;AI Monk&quot;)</li>
              <li>Vision board creation tools</li>
              <li>Progress tracking and analytics</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">3. Account Registration</h2>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              To use the App, you must create an account using Apple Sign-In. You agree to:
            </p>
            <ul className="list-disc pl-6 text-muted-wisdom space-y-2">
              <li>Provide accurate account information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
            <p className="text-muted-wisdom leading-relaxed mt-4">
              You must be at least 13 years old to use this App. By using the App, you represent that you meet this requirement.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">4. Subscription Terms</h2>

            <h3 className="font-serif text-xl font-semibold text-enlightened mb-3">4.1 Subscription Tiers</h3>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              The App offers three subscription tiers: Novice Path, Awakening Path, and Enlightenment Path. Each tier provides different levels of access to features as described in the App.
            </p>

            <h3 className="font-serif text-xl font-semibold text-enlightened mb-3">4.2 Free Trial</h3>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              New users receive a 7-day free trial with full Enlightenment Path access. The trial automatically converts to a paid subscription unless cancelled before the trial period ends.
            </p>

            <h3 className="font-serif text-xl font-semibold text-enlightened mb-3">4.3 Billing</h3>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              Subscriptions are billed through Apple&apos;s App Store. Payment will be charged to your Apple ID account at confirmation of purchase. Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period.
            </p>

            <h3 className="font-serif text-xl font-semibold text-enlightened mb-3">4.4 Cancellation</h3>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              You may cancel your subscription at any time through your Apple ID account settings. Cancellation takes effect at the end of the current billing period. No refunds are provided for partial periods.
            </p>

            <h3 className="font-serif text-xl font-semibold text-enlightened mb-3">4.5 Price Changes</h3>
            <p className="text-muted-wisdom leading-relaxed">
              We reserve the right to change subscription prices. Existing subscribers will be notified of any price changes before their next billing cycle.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">5. User Content</h2>

            <h3 className="font-serif text-xl font-semibold text-enlightened mb-3">5.1 Your Content</h3>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              You retain ownership of all content you create within the App, including journal entries, workbook responses, and vision board images (&quot;User Content&quot;).
            </p>

            <h3 className="font-serif text-xl font-semibold text-enlightened mb-3">5.2 License Grant</h3>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              By using the App, you grant us a limited license to store, process, and display your User Content solely for the purpose of providing and improving our services. We will not share your User Content with third parties except as described in our Privacy Policy.
            </p>

            <h3 className="font-serif text-xl font-semibold text-enlightened mb-3">5.3 Prohibited Content</h3>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              You agree not to upload or create content that:
            </p>
            <ul className="list-disc pl-6 text-muted-wisdom space-y-2">
              <li>Violates any laws or regulations</li>
              <li>Infringes on third-party intellectual property rights</li>
              <li>Contains malicious code or viruses</li>
              <li>Is harmful, threatening, abusive, or harassing</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">6. Intellectual Property</h2>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              The App, including its design, features, content, meditations, and AI responses, is protected by copyright, trademark, and other intellectual property laws. You may not:
            </p>
            <ul className="list-disc pl-6 text-muted-wisdom space-y-2">
              <li>Copy, modify, or distribute any part of the App</li>
              <li>Reverse engineer or decompile the App</li>
              <li>Remove any copyright or proprietary notices</li>
              <li>Use our trademarks without written permission</li>
              <li>Record or redistribute meditation audio content</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">7. AI-Generated Content Disclaimer</h2>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              The AI Monk Companion provides general guidance and wisdom based on manifestation principles. Important disclaimers:
            </p>
            <ul className="list-disc pl-6 text-muted-wisdom space-y-2">
              <li>AI responses are not professional medical, psychological, or financial advice</li>
              <li>AI-generated content may occasionally contain errors or inaccuracies</li>
              <li>You should consult qualified professionals for specific concerns</li>
              <li>We do not guarantee specific outcomes from following AI guidance</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <ul className="list-disc pl-6 text-muted-wisdom space-y-2">
              <li>The App is provided &quot;AS IS&quot; without warranties of any kind</li>
              <li>We do not guarantee uninterrupted or error-free service</li>
              <li>We are not liable for any indirect, incidental, or consequential damages</li>
              <li>Our total liability shall not exceed the amount you paid for the subscription in the past 12 months</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">9. Health Disclaimer</h2>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              The App is designed for personal development and general wellness. It is not intended to:
            </p>
            <ul className="list-disc pl-6 text-muted-wisdom space-y-2">
              <li>Diagnose, treat, cure, or prevent any disease</li>
              <li>Replace professional medical or mental health treatment</li>
              <li>Provide emergency services or crisis intervention</li>
            </ul>
            <p className="text-muted-wisdom leading-relaxed mt-4">
              If you are experiencing a mental health crisis, please contact emergency services or a mental health professional immediately.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">10. Termination</h2>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              We may suspend or terminate your account if you:
            </p>
            <ul className="list-disc pl-6 text-muted-wisdom space-y-2">
              <li>Violate these Terms</li>
              <li>Engage in fraudulent or illegal activity</li>
              <li>Abuse or misuse the App or its features</li>
              <li>Attempt to circumvent subscription restrictions</li>
            </ul>
            <p className="text-muted-wisdom leading-relaxed mt-4">
              Upon termination, your right to use the App ceases immediately. You may request deletion of your data in accordance with our Privacy Policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">11. Governing Law</h2>
            <p className="text-muted-wisdom leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles. Any disputes arising from these Terms shall be resolved in the courts of appropriate jurisdiction.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">12. Severability</h2>
            <p className="text-muted-wisdom leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall continue in full force and effect.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">13. Entire Agreement</h2>
            <p className="text-muted-wisdom leading-relaxed">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and Manifest the Unseen regarding the use of the App.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">14. Contact Information</h2>
            <p className="text-muted-wisdom leading-relaxed">
              For questions about these Terms, please contact us:
            </p>
            <ul className="list-none mt-4 text-muted-wisdom space-y-2">
              <li>Email: <a href="mailto:legal@manifesttheunseen.app" className="text-aged-gold hover:underline">legal@manifesttheunseen.app</a></li>
              <li>Website: <a href="https://manifesttheunseen.app" className="text-aged-gold hover:underline">manifesttheunseen.app</a></li>
            </ul>
          </section>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-elevated py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-wisdom text-sm">
          <p>© {new Date().getFullYear()} Manifest the Unseen. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
