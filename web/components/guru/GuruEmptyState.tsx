'use client'

import { getStarterPrompts, getPhaseTitle } from '@/types/guru'

interface GuruEmptyStateProps {
  selectedPhase: number | null
  onSelectPrompt: (prompt: string) => void
}

/**
 * GuruEmptyState shows when no conversation is active
 * Displays welcome message and starter prompts
 */
export function GuruEmptyState({
  selectedPhase,
  onSelectPrompt,
}: GuruEmptyStateProps) {
  const starterPrompts = selectedPhase ? getStarterPrompts(selectedPhase) : []
  const phaseTitle = selectedPhase ? getPhaseTitle(selectedPhase) : ''

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      {/* Guru Icon */}
      <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mb-6 shadow-lg shadow-crown-purple/20">
        <svg
          className="w-10 h-10 text-aged-gold"
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

      {/* Welcome Text */}
      <h2 className="text-2xl font-heading font-light text-aged-gold mb-2">
        Welcome to the Guru
      </h2>
      <p className="text-muted-wisdom mb-6 max-w-md">
        The Guru provides AI-guided analysis of your completed workbook phases,
        offering personalized insights and wisdom for your manifestation journey.
      </p>

      {selectedPhase ? (
        <>
          {/* Phase Selected */}
          <div className="bg-temple-stone rounded-xl border border-[rgba(196,160,82,0.2)] p-4 mb-6 max-w-md w-full">
            <p className="text-sm text-muted-wisdom mb-2">
              Ready to analyze
            </p>
            <p className="text-lg font-medium text-enlightened">
              Phase {selectedPhase}: {phaseTitle}
            </p>
          </div>

          {/* Starter Prompts */}
          <div className="w-full max-w-md">
            <p className="text-sm text-muted-wisdom mb-3">
              Try asking the Guru:
            </p>
            <div className="space-y-2">
              {starterPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => onSelectPrompt(prompt)}
                  className="w-full text-left px-4 py-3 bg-elevated border border-[rgba(196,160,82,0.2)] rounded-lg text-enlightened/90 text-sm hover:border-aged-gold hover:bg-[rgba(196,160,82,0.05)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-aged-gold focus:ring-offset-2 focus:ring-offset-deep-void"
                >
                  <span className="text-aged-gold mr-2">-</span>
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* No Phase Selected */
        <div className="bg-elevated rounded-xl border border-[rgba(196,160,82,0.2)] p-6 max-w-md">
          <svg
            className="w-8 h-8 text-aged-gold mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <p className="text-enlightened font-medium mb-2">
            Select a completed phase above
          </p>
          <p className="text-sm text-muted-wisdom">
            Choose from your completed workbook phases to begin your Guru consultation.
          </p>
        </div>
      )}
    </div>
  )
}
