import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Privacy Policy | Manifest the Unseen',
  description: 'Privacy Policy for Manifest the Unseen iOS application',
}

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>
        <p className="text-muted-wisdom mb-12">
          Last updated: December 10, 2025
        </p>

        <div className="prose prose-invert prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">1. Introduction</h2>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              Welcome to Manifest the Unseen (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
            </p>
            <p className="text-muted-wisdom leading-relaxed">
              By using Manifest the Unseen, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">2. Information We Collect</h2>

            <h3 className="font-serif text-xl font-semibold text-enlightened mb-3">2.1 Account Information</h3>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              When you create an account using Apple Sign-In, we receive your Apple ID identifier and, if you choose to share it, your email address and name. We do not have access to your Apple ID password.
            </p>

            <h3 className="font-serif text-xl font-semibold text-enlightened mb-3">2.2 Journal Entries</h3>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              Your journal entries (created via text or voice) are stored securely in our database. Voice recordings are transcribed on-device using AI technology—<strong>audio files never leave your device</strong>. Only the transcribed text is stored.
            </p>

            <h3 className="font-serif text-xl font-semibold text-enlightened mb-3">2.3 Workbook Progress</h3>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              We store your responses to workbook exercises and track your progress through the 10 phases to provide a personalized experience.
            </p>

            <h3 className="font-serif text-xl font-semibold text-enlightened mb-3">2.4 Meditation & Usage Data</h3>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              We track meditation session completions, streaks, and general app usage to provide progress analytics and improve our services.
            </p>

            <h3 className="font-serif text-xl font-semibold text-enlightened mb-3">2.5 AI Conversations</h3>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              Conversations with our AI Monk Companion are stored to provide context-aware responses and conversation history. These conversations may be used to improve AI responses but are never shared with third parties for marketing purposes.
            </p>

            <h3 className="font-serif text-xl font-semibold text-enlightened mb-3">2.6 Vision Board Images</h3>
            <p className="text-muted-wisdom leading-relaxed">
              Images you upload to vision boards are stored securely in our cloud storage with access restricted to your account only.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-muted-wisdom space-y-2">
              <li>To provide and maintain our service</li>
              <li>To personalize your experience and track your transformation journey</li>
              <li>To provide AI-powered guidance based on your current phase and history</li>
              <li>To send notifications (with your consent) for meditation reminders and streaks</li>
              <li>To process subscription payments through Apple&apos;s App Store</li>
              <li>To analyze usage patterns and improve our app (using anonymized, aggregated data)</li>
              <li>To respond to your requests or questions</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">4. Data Security</h2>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-muted-wisdom space-y-2">
              <li><strong>On-device voice processing:</strong> Audio recordings are transcribed locally and never uploaded</li>
              <li><strong>Encrypted storage:</strong> Journal entries are encrypted at rest</li>
              <li><strong>Secure authentication:</strong> Apple Sign-In provides secure, password-less authentication</li>
              <li><strong>Row-Level Security:</strong> Database policies ensure you can only access your own data</li>
              <li><strong>HTTPS:</strong> All data transmission is encrypted using TLS</li>
              <li><strong>Biometric protection:</strong> Optional Face ID/Touch ID lock for sensitive content</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">5. Third-Party Services</h2>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 text-muted-wisdom space-y-2">
              <li><strong>Supabase:</strong> Database hosting and authentication (data stored in secure cloud infrastructure)</li>
              <li><strong>Anthropic (Claude):</strong> AI conversation processing (no personal data stored by Anthropic)</li>
              <li><strong>RevenueCat:</strong> Subscription management (connects to Apple&apos;s systems)</li>
              <li><strong>Apple App Store:</strong> Payment processing (we never see your payment details)</li>
              <li><strong>TelemetryDeck:</strong> Privacy-focused analytics (no personal identifiers collected)</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">6. Data Retention</h2>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              We retain your data for as long as your account is active. If you delete your account:
            </p>
            <ul className="list-disc pl-6 text-muted-wisdom space-y-2">
              <li>Personal data is deleted within 30 days</li>
              <li>Anonymized, aggregated analytics data may be retained</li>
              <li>Backup copies are automatically purged within 90 days</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">7. Your Rights</h2>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc pl-6 text-muted-wisdom space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your data (&quot;right to be forgotten&quot;)</li>
              <li><strong>Portability:</strong> Request your data in a machine-readable format</li>
              <li><strong>Objection:</strong> Object to certain processing of your data</li>
            </ul>
            <p className="text-muted-wisdom leading-relaxed mt-4">
              To exercise these rights, contact us at <a href="mailto:privacy@manifesttheunseen.app" className="text-aged-gold hover:underline">privacy@manifesttheunseen.app</a>.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">8. Children&apos;s Privacy</h2>
            <p className="text-muted-wisdom leading-relaxed">
              Manifest the Unseen is not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">9. International Data Transfers</h2>
            <p className="text-muted-wisdom leading-relaxed">
              Your data may be processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers in compliance with applicable data protection laws.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">10. California Privacy Rights (CCPA)</h2>
            <p className="text-muted-wisdom leading-relaxed mb-4">
              California residents have additional rights under the CCPA:
            </p>
            <ul className="list-disc pl-6 text-muted-wisdom space-y-2">
              <li>Right to know what personal information is collected</li>
              <li>Right to know whether personal information is sold or disclosed</li>
              <li>Right to opt-out of the sale of personal information (we do not sell your data)</li>
              <li>Right to non-discrimination for exercising CCPA rights</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">11. Changes to This Policy</h2>
            <p className="text-muted-wisdom leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. Continued use of the app after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-enlightened mb-4">12. Contact Us</h2>
            <p className="text-muted-wisdom leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-none mt-4 text-muted-wisdom space-y-2">
              <li>Email: <a href="mailto:privacy@manifesttheunseen.app" className="text-aged-gold hover:underline">privacy@manifesttheunseen.app</a></li>
              <li>Website: <a href="https://manifesttheunseen.app" className="text-aged-gold hover:underline">manifesttheunseen.app</a></li>
            </ul>
          </section>
        </div>
      </article>

      <Footer />
    </main>
  )
}
