'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-temple-stone/50 border-t border-elevated">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
                <svg className="w-5 h-5 text-deep-void" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-serif text-xl font-bold text-enlightened">
                Manifest the Unseen
              </span>
            </div>
            <p className="text-muted-wisdom mb-6 max-w-sm">
              Your personal manifestation companion. Transform your reality through structured guidance, AI wisdom, and daily practice.
            </p>
            {/* App Store badge placeholder */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-deep-void border border-elevated rounded-lg text-muted-wisdom text-sm">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span>Coming Soon to App Store</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif text-enlightened font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-muted-wisdom hover:text-aged-gold transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-muted-wisdom hover:text-aged-gold transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="text-muted-wisdom hover:text-aged-gold transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-enlightened font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="/privacy" className="text-muted-wisdom hover:text-aged-gold transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-muted-wisdom hover:text-aged-gold transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="mailto:hello@manifesttheunseen.app" className="text-muted-wisdom hover:text-aged-gold transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-elevated flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-wisdom text-sm">
            © {currentYear} Manifest the Unseen. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-wisdom">
            <span>Made with</span>
            <svg className="w-4 h-4 text-root-crimson" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span>for manifestors everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
