'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 bg-deep-void border-t border-elevated/30">
      <div className="max-w-4xl mx-auto px-6">
        {/* Main content */}
        <div className="text-center mb-8">
          <h3 className="font-serif text-xl text-enlightened mb-2">
            Manifest the Unseen
          </h3>
          <p className="text-muted-wisdom text-sm">
            Your journey within begins here
          </p>
        </div>

        {/* Links */}
        <div className="flex justify-center items-center gap-6 mb-8 text-sm">
          <a href="/privacy" className="text-muted-wisdom hover:text-aged-gold transition-colors">
            Privacy
          </a>
          <span className="text-elevated">·</span>
          <a href="/terms" className="text-muted-wisdom hover:text-aged-gold transition-colors">
            Terms
          </a>
          <span className="text-elevated">·</span>
          <a href="mailto:hello@manifesttheunseen.app" className="text-muted-wisdom hover:text-aged-gold transition-colors">
            Contact
          </a>
        </div>

        {/* Copyright */}
        <p className="text-center text-muted-wisdom/50 text-xs">
          © {currentYear} Manifest the Unseen
        </p>
      </div>
    </footer>
  )
}
