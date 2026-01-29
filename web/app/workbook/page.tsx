'use client'

import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { useWorkbookProgress } from '@/hooks/useWorkbookProgress'
import { useRouter } from 'next/navigation'
import { WORKBOOK_PHASES, getFirstWorksheetSlug, WorkbookPhase } from '@/lib/shared'
import { OverallProgress } from '@/components/workbook/OverallProgress'
import { PhaseGrid } from '@/components/workbook/PhaseGrid'

export default function WorkbookPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { tier, status, loading: subLoading } = useSubscription()
  const {
    phases,
    overallCompleted,
    overallTotal,
    loading: progressLoading
  } = useWorkbookProgress()
  const router = useRouter()

  // All authenticated users have access to all phases
  const isSubscribed = user !== null

  const handlePhaseClick = (phaseNumber: number) => {
    // Free users: redirect to pricing
    if (!isSubscribed) {
      router.push('/#pricing')
      return
    }

    // Paid users: navigate to first worksheet
    const firstWorksheet = getFirstWorksheetSlug(phaseNumber)
    if (firstWorksheet) {
      router.push(`/workbook/phase/${phaseNumber}/${firstWorksheet}`)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-void">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aged-gold mx-auto mb-4"></div>
          <p className="text-muted-wisdom">Loading your workbook...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-deep-void">
      {/* Header */}
      <header className="bg-temple-stone shadow-[0_4px_24px_rgba(0,0,0,0.4)] border-b border-[rgba(196,160,82,0.2)]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-aged-gold">
            Manifest the Unseen - Workbook
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-wisdom">{user?.email}</p>
              <p className="text-xs text-aged-gold font-medium">
                {tier ? `${tier} tier` : 'No subscription'}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm text-muted-wisdom bg-elevated border border-[rgba(196,160,82,0.2)] rounded-lg hover:bg-temple-stone hover:border-aged-gold transition-all duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Overall Progress */}
        <div className="mb-8">
          <OverallProgress
            totalCompleted={overallCompleted}
            totalWorksheets={overallTotal}
          />
        </div>

        {/* Phase Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-aged-gold mb-4">
            Workbook Phases
          </h2>
          {progressLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aged-gold mx-auto mb-4"></div>
              <p className="text-muted-wisdom">Loading phases...</p>
            </div>
          ) : (
            <PhaseGrid
              phases={phases.map(p => ({
                phase: WORKBOOK_PHASES.find((wp: WorkbookPhase) => wp.id === p.phaseNumber)!,
                completedWorksheets: p.completedWorksheets,
                totalWorksheets: p.totalWorksheets
              }))}
              isSubscribed={isSubscribed}
              onPhaseClick={handlePhaseClick}
            />
          )}
        </div>

        {/* All authenticated users have full access */}
      </main>
    </div>
  )
}
