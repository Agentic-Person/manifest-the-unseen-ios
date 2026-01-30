'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export interface CompanionNavProps {
  /**
   * Sync status indicator
   */
  syncStatus?: 'synced' | 'syncing' | 'error' | 'offline'
}

/**
 * Simple top navigation for iOS Companion.
 * Includes logo, workbook link, sync status, and settings.
 */
export function CompanionNav({ syncStatus = 'synced' }: CompanionNavProps) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => pathname.startsWith(path)

  return (
    <nav className="sticky top-0 z-50 bg-deep-void/95 backdrop-blur-md border-b border-gold-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and App Name */}
          <Link
            href="/companion/dashboard"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/icon.png"
              alt="Manifest the Unseen"
              width={36}
              height={36}
              className="rounded-full"
            />
            <div className="hidden sm:block">
              <span className="font-serif text-lg text-enlightened">
                Manifest the Unseen
              </span>
              <span className="ml-2 text-xs px-2 py-0.5 bg-deep-teal/30 text-deep-teal border border-deep-teal/30 rounded-full">
                iOS Companion
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {/* Workbook Link */}
            <Link
              href="/companion/dashboard"
              className={`flex items-center gap-2 text-sm transition-colors ${
                isActive('/companion/dashboard') || isActive('/companion/workbook')
                  ? 'text-aged-gold'
                  : 'text-muted-wisdom hover:text-enlightened'
              }`}
            >
              <BookIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Workbook</span>
            </Link>

            {/* Sync Status */}
            <SyncStatusIndicator status={syncStatus} />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-elevated transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-elevated flex items-center justify-center text-aged-gold">
                  <UserIcon className="w-5 h-5" />
                </div>
                <ChevronDownIcon
                  className={`w-4 h-4 text-muted-wisdom transition-transform ${
                    isMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-temple-stone border border-gold-border rounded-lg shadow-xl z-20 py-1">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gold-border">
                      <p className="text-sm text-enlightened truncate">
                        {user?.email || 'User'}
                      </p>
                      <p className="text-xs text-tertiary-text mt-0.5">
                        Subscription managed via iOS
                      </p>
                    </div>

                    {/* Menu Items */}
                    <Link
                      href="/companion/settings"
                      className="block px-4 py-2 text-sm text-muted-wisdom hover:text-enlightened hover:bg-elevated transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <SettingsIcon className="w-4 h-4 inline mr-2" />
                      Settings
                    </Link>

                    <a
                      href="https://apps.apple.com/app/manifest-the-unseen"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-muted-wisdom hover:text-enlightened hover:bg-elevated transition-colors"
                    >
                      <AppleIcon className="w-4 h-4 inline mr-2" />
                      Open iOS App
                    </a>

                    <div className="border-t border-gold-border mt-1 pt-1">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false)
                          signOut()
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-muted-wisdom hover:text-enlightened hover:bg-elevated transition-colors"
                      >
                        <LogoutIcon className="w-4 h-4 inline mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

/**
 * Sync status indicator component
 */
function SyncStatusIndicator({
  status,
}: {
  status: 'synced' | 'syncing' | 'error' | 'offline'
}) {
  const statusConfig = {
    synced: {
      icon: <CheckCircleIcon className="w-4 h-4" />,
      text: 'Synced',
      color: 'text-heart-emerald',
    },
    syncing: {
      icon: <SyncIcon className="w-4 h-4 animate-spin" />,
      text: 'Syncing...',
      color: 'text-aged-gold',
    },
    error: {
      icon: <ExclamationIcon className="w-4 h-4" />,
      text: 'Sync Error',
      color: 'text-burgundy',
    },
    offline: {
      icon: <OfflineIcon className="w-4 h-4" />,
      text: 'Offline',
      color: 'text-tertiary-text',
    },
  }

  const config = statusConfig[status]

  return (
    <div
      className={`flex items-center gap-1.5 text-xs ${config.color}`}
      title={config.text}
    >
      {config.icon}
      <span className="hidden md:inline">{config.text}</span>
    </div>
  )
}

// Icon components
function BookIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  )
}

function UserIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  )
}

function ChevronDownIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function SettingsIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  )
}

function AppleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function LogoutIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  )
}

function CheckCircleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function SyncIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  )
}

function ExclamationIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function OfflineIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
      />
    </svg>
  )
}

export default CompanionNav
