'use client'

import { PHASE_TITLES, getRequiredWorksheets } from '@/types/guru'

interface PhaseProgress {
  phaseNumber: number
  completedWorksheets: number
  totalWorksheets: number
  isComplete: boolean
}

interface PhaseSelectorProps {
  phases: PhaseProgress[]
  selectedPhase: number | null
  onSelectPhase: (phaseNumber: number) => void
  loading?: boolean
}

/**
 * PhaseSelector allows users to select a completed phase for Guru analysis
 * Shows phase title, completion status, and disables incomplete phases
 */
export function PhaseSelector({
  phases,
  selectedPhase,
  onSelectPhase,
  loading = false,
}: PhaseSelectorProps) {
  if (loading) {
    return (
      <div className="bg-temple-stone rounded-xl border border-[rgba(196,160,82,0.2)] p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-elevated rounded w-24 mb-3" />
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-28 bg-elevated rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-temple-stone rounded-xl border border-[rgba(196,160,82,0.2)] p-4">
      <div className="flex items-center gap-2 mb-3">
        <svg
          className="w-5 h-5 text-aged-gold"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span className="text-sm font-medium text-enlightened">Select Phase</span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {phases.map((phase) => {
          const isSelected = selectedPhase === phase.phaseNumber
          const phaseTitle = PHASE_TITLES[phase.phaseNumber] || `Phase ${phase.phaseNumber}`

          return (
            <button
              key={phase.phaseNumber}
              onClick={() => phase.isComplete && onSelectPhase(phase.phaseNumber)}
              disabled={!phase.isComplete}
              className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-primary text-enlightened ring-2 ring-crown-purple ring-offset-2 ring-offset-temple-stone'
                  : phase.isComplete
                  ? 'bg-elevated border border-[rgba(196,160,82,0.2)] text-enlightened hover:border-aged-gold hover:bg-[rgba(196,160,82,0.1)]'
                  : 'bg-elevated/50 border border-transparent text-muted-wisdom/50 cursor-not-allowed'
              }`}
              title={
                phase.isComplete
                  ? phaseTitle
                  : `Complete ${phase.completedWorksheets}/${phase.totalWorksheets} worksheets to unlock`
              }
            >
              <span className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isSelected
                    ? 'bg-enlightened text-crown-purple'
                    : phase.isComplete
                    ? 'bg-aged-gold/20 text-aged-gold'
                    : 'bg-muted-wisdom/20 text-muted-wisdom/50'
                }`}>
                  {phase.phaseNumber}
                </span>
                <span className="hidden sm:inline truncate max-w-[120px]">
                  {phaseTitle}
                </span>
              </span>

              {/* Completion indicator */}
              {phase.isComplete && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-heart-emerald rounded-full border-2 border-temple-stone">
                  <svg
                    className="w-full h-full text-enlightened"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Completion hint */}
      {phases.every((p) => !p.isComplete) && (
        <p className="text-xs text-muted-wisdom mt-3">
          Complete at least one phase to unlock Guru analysis
        </p>
      )}
    </div>
  )
}
