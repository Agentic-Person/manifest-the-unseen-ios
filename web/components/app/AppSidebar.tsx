'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { getTierDisplayName } from '@/types/subscription'

export interface AppSidebarProps {
  /**
   * Whether sidebar is collapsed (mobile)
   */
  collapsed?: boolean

  /**
   * Callback when collapse state changes
   */
  onCollapseChange?: (collapsed: boolean) => void
}

/**
 * Full sidebar navigation for web app.
 * Icons for each section with active state highlighting.
 */
export function AppSidebar({ collapsed = false, onCollapseChange }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { tier, isSubscribed } = useSubscription()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const isActive = (path: string) => pathname.startsWith(path)

  const navItems = [
    {
      name: 'Dashboard',
      href: '/app/dashboard',
      icon: DashboardIcon,
      active: isActive('/app/dashboard'),
    },
    {
      name: 'Workbook',
      href: '/app/workbook',
      icon: BookIcon,
      active: isActive('/app/workbook'),
    },
    {
      name: 'Guru AI',
      href: '/app/guru',
      icon: SparklesIcon,
      active: isActive('/app/guru'),
    },
    {
      name: 'Meditations',
      href: '/app/meditations',
      icon: MeditationIcon,
      active: isActive('/app/meditations'),
    },
    {
      name: 'Journal',
      href: '/app/journal',
      icon: JournalIcon,
      active: isActive('/app/journal'),
    },
  ]

  const bottomNavItems = [
    {
      name: 'Settings',
      href: '/app/settings',
      icon: SettingsIcon,
      active: isActive('/app/settings'),
    },
    {
      name: 'Billing',
      href: '/app/billing',
      icon: BillingIcon,
      active: isActive('/app/billing'),
    },
  ]

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-temple-stone border-r border-gold-border z-40 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header / Logo */}
        <div className="p-4 border-b border-gold-border">
          <Link
            href="/app/dashboard"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/icon.png"
              alt="Manifest the Unseen"
              width={40}
              height={40}
              className="rounded-full"
            />
            {!collapsed && (
              <div>
                <span className="font-serif text-lg text-enlightened block">
                  Manifest
                </span>
                <span className="text-xs text-muted-wisdom">the Unseen</span>
              </div>
            )}
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                item.active
                  ? 'bg-aged-gold/10 text-aged-gold'
                  : 'text-muted-wisdom hover:text-enlightened hover:bg-elevated'
              }`}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-3 border-t border-gold-border space-y-1">
          {bottomNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                item.active
                  ? 'bg-aged-gold/10 text-aged-gold'
                  : 'text-muted-wisdom hover:text-enlightened hover:bg-elevated'
              }`}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </Link>
          ))}
        </div>

        {/* User Section */}
        <div className="p-3 border-t border-gold-border">
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-elevated transition-colors ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-aged-gold/20 flex items-center justify-center text-aged-gold flex-shrink-0">
                <UserIcon className="w-4 h-4" />
              </div>
              {!collapsed && (
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm text-enlightened truncate">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-muted-wisdom">
                    {tier ? getTierDisplayName(tier) : 'Free'}
                  </p>
                </div>
              )}
              {!collapsed && (
                <ChevronUpIcon
                  className={`w-4 h-4 text-muted-wisdom transition-transform ${
                    isUserMenuOpen ? '' : 'rotate-180'
                  }`}
                />
              )}
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div
                  className={`absolute bottom-full mb-2 bg-elevated border border-gold-border rounded-lg shadow-xl z-20 py-1 ${
                    collapsed ? 'left-full ml-2 w-48' : 'left-0 right-0'
                  }`}
                >
                  {collapsed && (
                    <div className="px-3 py-2 border-b border-gold-border">
                      <p className="text-sm text-enlightened truncate">
                        {user?.email || 'User'}
                      </p>
                      <p className="text-xs text-muted-wisdom">
                        {tier ? getTierDisplayName(tier) : 'Free'}
                      </p>
                    </div>
                  )}

                  <Link
                    href="/app/profile"
                    className="block px-3 py-2 text-sm text-muted-wisdom hover:text-enlightened hover:bg-deep-void transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Profile
                  </Link>

                  <Link
                    href="/app/billing"
                    className="block px-3 py-2 text-sm text-muted-wisdom hover:text-enlightened hover:bg-deep-void transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Manage Subscription
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-sm text-muted-wisdom hover:text-enlightened hover:bg-deep-void transition-colors border-t border-gold-border"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Collapse Toggle */}
          {onCollapseChange && (
            <button
              onClick={() => onCollapseChange(!collapsed)}
              className="w-full flex items-center justify-center gap-2 mt-3 p-2 text-xs text-tertiary-text hover:text-muted-wisdom transition-colors"
            >
              {collapsed ? (
                <ChevronRightIcon className="w-4 h-4" />
              ) : (
                <>
                  <ChevronLeftIcon className="w-4 h-4" />
                  <span>Collapse</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}

// Icon components
function DashboardIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
      />
    </svg>
  )
}

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

function SparklesIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  )
}

function MeditationIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  )
}

function JournalIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
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

function BillingIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
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

function ChevronUpIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  )
}

function ChevronLeftIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRightIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

export default AppSidebar
