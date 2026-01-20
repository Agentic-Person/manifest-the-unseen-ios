'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error boundary caught:', error)
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-6xl font-bold text-enlightened mb-4">
          500
        </h1>
        <h2 className="font-serif text-2xl font-semibold text-aged-gold mb-6">
          Something Went Wrong
        </h2>
        <p className="text-muted-wisdom mb-8">
          We&apos;re sorry, an unexpected error occurred.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-aged-gold text-deep-void font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-block px-6 py-3 border border-aged-gold text-aged-gold font-semibold rounded-lg hover:bg-aged-gold hover:text-deep-void transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
