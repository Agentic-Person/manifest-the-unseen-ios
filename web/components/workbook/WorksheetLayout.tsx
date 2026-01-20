'use client'

import { ReactNode } from 'react'
import { AutoSaveIndicator } from '@/components/ui/AutoSaveIndicator'

export interface WorksheetLayoutProps {
  title: string
  description?: string
  headerImage?: string
  children: ReactNode
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error'
  lastSaved?: Date | null
  onNext?: () => void
  onPrevious?: () => void
  nextLabel?: string
  previousLabel?: string
  showNavigation?: boolean
  className?: string
}

/**
 * WorksheetLayout provides a common layout wrapper for all worksheet pages.
 * Includes header, content area, auto-save indicator, and navigation buttons.
 *
 * @example
 * ```tsx
 * <WorksheetLayout
 *   title="Wheel of Life"
 *   description="Rate your satisfaction in each life area"
 *   saveStatus={saveStatus}
 *   onNext={() => navigate('/next')}
 *   onPrevious={() => navigate('/previous')}
 * >
 *   <WheelOfLifeEditor />
 * </WorksheetLayout>
 * ```
 */
export function WorksheetLayout({
  title,
  description,
  headerImage,
  children,
  saveStatus = 'idle',
  lastSaved,
  onNext,
  onPrevious,
  nextLabel = 'Next Worksheet',
  previousLabel = 'Previous',
  showNavigation = true,
  className = '',
}: WorksheetLayoutProps) {
  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 ${className}`}>
      {/* Header Image Banner */}
      {headerImage && (
        <div className="relative w-full h-64 -mx-4 mb-8 rounded-b-2xl overflow-hidden shadow-lg">
          <img
            src={headerImage}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-3xl font-bold text-white mb-2" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9)' }}>{title}</h1>
            {description && (
              <p className="text-white text-lg" style={{ textShadow: '1px 1px 6px rgba(0, 0, 0, 0.9)' }}>{description}</p>
            )}
          </div>
        </div>
      )}

      {/* Header (without image) */}
      {!headerImage && (
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-aged-gold mb-2">{title}</h1>
              {description && (
                <p className="text-muted-wisdom text-lg">{description}</p>
              )}
            </div>
            <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved || undefined} />
          </div>
          <div className="h-1 bg-gradient-to-r from-aged-gold to-burnished-bronze rounded-full" />
        </div>
      )}

      {/* Auto-save indicator (when header image is shown) */}
      {headerImage && (
        <div className="flex justify-end mb-4">
          <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved || undefined} />
        </div>
      )}

      {/* Top Navigation */}
      {showNavigation && (onNext || onPrevious) && (
        <div className="flex items-center justify-between gap-4 mb-6">
          {onPrevious ? (
            <button
              type="button"
              onClick={onPrevious}
              className="flex items-center gap-2 px-6 py-3 text-muted-wisdom bg-elevated border border-[rgba(196,160,82,0.2)] rounded-lg hover:bg-temple-stone hover:border-aged-gold transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-aged-gold focus:ring-offset-2 focus:ring-offset-deep-void"
            >
              <svg
                className="w-5 h-5"
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
              {previousLabel}
            </button>
          ) : (
            <div />
          )}

          {/* Center Workbook Home Button */}
          <button
            type="button"
            onClick={() => window.location.href = '/workbook'}
            className="flex items-center gap-2 px-6 py-3 text-aged-gold bg-[rgba(196,160,82,0.1)] border border-aged-gold rounded-lg hover:bg-[rgba(196,160,82,0.2)] transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-aged-gold focus:ring-offset-2 focus:ring-offset-deep-void"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Workbook Home
          </button>

          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-primary text-enlightened rounded-lg hover:brightness-110 transition-all duration-200 font-medium shadow-[0_4px_16px_rgba(107,76,154,0.3)] hover:shadow-[0_6px_20px_rgba(107,76,154,0.4)] focus:outline-none focus:ring-2 focus:ring-crown-purple focus:ring-offset-2 focus:ring-offset-deep-void"
            >
              {nextLabel}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="bg-temple-stone rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] border border-[rgba(196,160,82,0.15)] p-8 mb-8 hover:border-[rgba(196,160,82,0.25)] transition-all duration-200">
        {children}
      </div>

      {/* Bottom Navigation */}
      {showNavigation && (onNext || onPrevious) && (
        <div className="flex items-center justify-between gap-4">
          {onPrevious ? (
            <button
              type="button"
              onClick={onPrevious}
              className="flex items-center gap-2 px-6 py-3 text-muted-wisdom bg-elevated border border-[rgba(196,160,82,0.2)] rounded-lg hover:bg-temple-stone hover:border-aged-gold transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-aged-gold focus:ring-offset-2 focus:ring-offset-deep-void"
            >
              <svg
                className="w-5 h-5"
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
              {previousLabel}
            </button>
          ) : (
            <div />
          )}

          {/* Center Workbook Home Button */}
          <button
            type="button"
            onClick={() => window.location.href = '/workbook'}
            className="flex items-center gap-2 px-6 py-3 text-aged-gold bg-[rgba(196,160,82,0.1)] border border-aged-gold rounded-lg hover:bg-[rgba(196,160,82,0.2)] transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-aged-gold focus:ring-offset-2 focus:ring-offset-deep-void"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Workbook Home
          </button>

          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-primary text-enlightened rounded-lg hover:brightness-110 transition-all duration-200 font-medium shadow-[0_4px_16px_rgba(107,76,154,0.3)] hover:shadow-[0_6px_20px_rgba(107,76,154,0.4)] focus:outline-none focus:ring-2 focus:ring-crown-purple focus:ring-offset-2 focus:ring-offset-deep-void"
            >
              {nextLabel}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
