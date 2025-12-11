import type { Metadata } from 'next'
import { Cormorant_Garamond, Raleway } from 'next/font/google'
import './globals.css'

// Elegant serif for headings - classical, meditative feel
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-heading',
  display: 'swap',
})

// Clean sans-serif for body - modern, readable
const raleway = Raleway({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Manifest the Unseen | Your Personal Manifestation Companion',
  description: 'Transform a 202-page manifestation workbook into your daily practice. AI-guided wisdom, voice journaling, guided meditations, and a complete 10-phase transformation journey.',
  keywords: ['manifestation', 'meditation', 'journaling', 'personal development', 'wellness', 'mindfulness', 'iOS app'],
  authors: [{ name: 'Manifest the Unseen' }],
  openGraph: {
    title: 'Manifest the Unseen | Your Personal Manifestation Companion',
    description: 'Transform a 202-page manifestation workbook into your daily practice. AI-guided wisdom, voice journaling, and guided meditations.',
    url: 'https://manifesttheunseen.app',
    siteName: 'Manifest the Unseen',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manifest the Unseen | Your Personal Manifestation Companion',
    description: 'Transform a 202-page manifestation workbook into your daily practice.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`scroll-smooth ${cormorant.variable} ${raleway.variable}`}>
      <body className="font-body bg-deep-void text-enlightened antialiased">
        {children}
      </body>
    </html>
  )
}
