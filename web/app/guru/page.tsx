'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { useWorkbookProgress } from '@/hooks/useWorkbookProgress'
import { useGuruChat } from '@/hooks/useGuruChat'
import { PhaseSelector } from '@/components/guru/PhaseSelector'
import { ChatInterface } from '@/components/guru/ChatInterface'
import { GuruLockedScreen } from '@/components/guru/GuruLockedScreen'
import { isPhaseComplete } from '@/types/guru'

/**
 * Guru AI Chat Page
 *
 * Premium feature for Awakening+ tier subscribers
 * Provides AI-guided phase analysis after workbook completion
 */
export default function GuruPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { tier, status, loading: subLoading } = useSubscription()
  const { phases, loading: progressLoading } = useWorkbookProgress()
  const {
    messages,
    isSending,
    error,
    sendMessage,
    startNewConversation,
    clearError,
  } = useGuruChat()

  const [selectedPhase, setSelectedPhase] = useState<number | null>(null)

  // Check if user has Guru access (Awakening or Enlightenment tier)
  const hasGuruAccess = tier === 'awakening' || tier === 'enlightenment'

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/guru')
    }
  }, [authLoading, user, router])

  // Transform phases data for PhaseSelector
  const phasesWithCompletion = phases.map((phase) => ({
    phaseNumber: phase.phaseNumber,
    completedWorksheets: phase.completedWorksheets,
    totalWorksheets: phase.totalWorksheets,
    isComplete: isPhaseComplete(phase.phaseNumber, phase.completedWorksheets),
  }))

  // Handle phase selection
  const handleSelectPhase = useCallback(
    (phaseNumber: number) => {
      if (selectedPhase !== phaseNumber) {
        setSelectedPhase(phaseNumber)
        startNewConversation()
      }
    },
    [selectedPhase, startNewConversation]
  )

  // Handle sending message
  const handleSendMessage = useCallback(
    (message: string) => {
      if (selectedPhase) {
        sendMessage(message, selectedPhase)
      }
    },
    [selectedPhase, sendMessage]
  )

  // Loading state
  const isLoading = authLoading || subLoading || progressLoading

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-void">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aged-gold mx-auto mb-4" />
          <p className="text-muted-wisdom">Loading Guru...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return null // Will redirect via useEffect
  }

  // Show locked screen if user doesn't have access
  if (!hasGuruAccess) {
    return (
      <div className="min-h-screen bg-deep-void">
        {/* Header */}
        <header className="bg-temple-stone shadow-[0_4px_24px_rgba(0,0,0,0.4)] border-b border-[rgba(196,160,82,0.2)]">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/workbook')}
                className="text-muted-wisdom hover:text-enlightened transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-aged-gold">
                Guru AI
              </h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-wisdom">{user?.email}</p>
              <p className="text-xs text-aged-gold capitalize">
                {tier || 'No'} tier
              </p>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <GuruLockedScreen currentTier={tier} />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-deep-void flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 bg-temple-stone shadow-[0_4px_24px_rgba(0,0,0,0.4)] border-b border-[rgba(196,160,82,0.2)]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/workbook')}
              className="text-muted-wisdom hover:text-enlightened transition-colors"
              aria-label="Back to Workbook"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-aged-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-aged-gold">
                  Guru AI
                </h1>
                <p className="text-xs text-muted-wisdom">
                  Phase Analysis
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-muted-wisdom">{user?.email}</p>
              <p className="text-xs text-aged-gold capitalize">
                {tier} tier
              </p>
            </div>
            {messages.length > 0 && (
              <button
                onClick={startNewConversation}
                className="px-3 py-2 text-sm text-muted-wisdom bg-elevated border border-[rgba(196,160,82,0.2)] rounded-lg hover:bg-temple-stone hover:border-aged-gold transition-all duration-200"
              >
                New Chat
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 py-6">
        {/* Phase Selector */}
        <div className="flex-shrink-0 mb-4">
          <PhaseSelector
            phases={phasesWithCompletion}
            selectedPhase={selectedPhase}
            onSelectPhase={handleSelectPhase}
            loading={progressLoading}
          />
        </div>

        {/* Chat Interface */}
        <div className="flex-1 min-h-0">
          <ChatInterface
            messages={messages}
            selectedPhase={selectedPhase}
            isSending={isSending}
            onSendMessage={handleSendMessage}
            error={error}
            onClearError={clearError}
          />
        </div>
      </main>
    </div>
  )
}
