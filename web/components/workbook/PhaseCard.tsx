'use client'

import { WorkbookPhase } from '@/lib/shared'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { getPhaseHeaderImage } from '@/lib/worksheetImages'

interface PhaseCardProps {
  phase: WorkbookPhase
  completedWorksheets: number
  totalWorksheets: number
  isLocked: boolean
  onClick: () => void
}

export function PhaseCard({
  phase,
  completedWorksheets,
  totalWorksheets,
  isLocked,
  onClick
}: PhaseCardProps) {
  const percent = totalWorksheets > 0
    ? Math.round((completedWorksheets / totalWorksheets) * 100)
    : 0

  const headerImage = getPhaseHeaderImage(phase.id, phase.title)

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className="w-full text-left rounded-xl border-2 transition-all overflow-hidden bg-temple-stone border-[rgba(196,160,82,0.2)] hover:border-aged-gold hover:shadow-[0_8px_32px_rgba(196,160,82,0.2)] cursor-pointer"
    >
      {/* Phase Header Image */}
      <div className="relative w-full h-40 overflow-hidden">
        <img
          src={headerImage}
          alt={`Phase ${phase.id}: ${phase.title}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-shrink-0 w-8 h-8 bg-aged-gold text-deep-void rounded-lg flex items-center justify-center font-bold text-sm shadow-lg">
              {phase.id}
            </div>
            <h3 className="text-base font-bold text-white flex-1 line-clamp-1" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.9)' }}>
              {phase.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Description */}
        <p className="text-muted-wisdom text-sm mb-4 line-clamp-2">
          {phase.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-3">
          <ProgressBar
            current={completedWorksheets}
            total={totalWorksheets}
            label=""
            showCount={true}
          />
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-tertiary-text">
            ⏱️ Est. {phase.estimatedMinutes} minutes
          </span>
          {/* All phases unlocked for authenticated users */}
        </div>
      </div>
    </button>
  )
}
