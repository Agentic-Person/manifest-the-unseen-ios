'use client'

import { WorkbookPhase } from '@manifest/shared'
import { PhaseCard } from './PhaseCard'

interface PhaseGridProps {
  phases: Array<{
    phase: WorkbookPhase
    completedWorksheets: number
    totalWorksheets: number
  }>
  isSubscribed: boolean
  onPhaseClick: (phaseId: number) => void
}

export function PhaseGrid({ phases, isSubscribed, onPhaseClick }: PhaseGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {phases.map(({ phase, completedWorksheets, totalWorksheets }) => (
        <PhaseCard
          key={phase.id}
          phase={phase}
          completedWorksheets={completedWorksheets}
          totalWorksheets={totalWorksheets}
          isLocked={!isSubscribed}
          onClick={() => onPhaseClick(phase.id)}
        />
      ))}
    </div>
  )
}
