'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/app/AppSidebar'
import { useAuth } from '@/hooks/useAuth'

/**
 * Layout for Full Web App product.
 * Full sidebar navigation with all features.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Handle responsive sidebar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
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
    router.push('/auth/login?platform=web')
    return null
  }

  return (
    <div className="min-h-screen bg-deep-void">
      {/* Sidebar */}
      <AppSidebar
        collapsed={sidebarCollapsed}
        onCollapseChange={setSidebarCollapsed}
      />

      {/* Mobile Header */}
      {isMobile && (
        <header className="lg:hidden fixed top-0 right-0 left-16 z-30 bg-deep-void/95 backdrop-blur-md border-b border-gold-border">
          <div className="flex items-center justify-between h-14 px-4">
            <h1 className="text-lg font-serif text-enlightened">
              Manifest the Unseen
            </h1>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 text-muted-wisdom hover:text-enlightened transition-colors"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main
        className={`min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        } ${isMobile ? 'ml-16 pt-14' : ''}`}
      >
        <div className="p-6 lg:p-8">{children}</div>
      </main>

      {/* Mobile sidebar overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-deep-void/80 z-30 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  )
}

function MenuIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  )
}
