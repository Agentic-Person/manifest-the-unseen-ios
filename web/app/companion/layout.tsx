'use client'

import { useState, useEffect } from 'react'
import { CompanionNav } from '@/components/companion/CompanionNav'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

/**
 * Layout for iOS Companion product.
 * Simple navigation with workbook access and sync status.
 */
export default function CompanionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('synced')

  // Simulated sync status - in production this would come from a real sync service
  useEffect(() => {
    // Check online status
    const updateOnlineStatus = () => {
      if (!navigator.onLine) {
        setSyncStatus('offline')
      } else {
        setSyncStatus('synced')
      }
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    updateOnlineStatus()

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-deep-void flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-aged-gold/30 border-t-aged-gold rounded-full animate-spin" />
          <p className="text-muted-wisdom text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated (middleware should handle this, but double-check)
  if (!user) {
    router.push('/auth/login?platform=ios')
    return null
  }

  return (
    <div className="min-h-screen bg-deep-void">
      {/* Navigation */}
      <CompanionNav syncStatus={syncStatus} />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>

      {/* Footer with iOS App Link */}
      <footer className="border-t border-gold-border bg-temple-stone/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-wisdom">
                This is the web companion for iOS subscribers.
              </p>
              <p className="text-xs text-tertiary-text mt-1">
                Full features including Guru AI, meditations, and journal are
                available in the iOS app.
              </p>
            </div>
            <a
              href="https://apps.apple.com/app/manifest-the-unseen"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-elevated border border-gold-border rounded-lg text-sm text-enlightened hover:border-aged-gold transition-colors"
            >
              <AppleIcon className="w-5 h-5" />
              Open iOS App
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function AppleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}
