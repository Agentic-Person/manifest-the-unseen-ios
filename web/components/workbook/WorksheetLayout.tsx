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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
              {description && (
                <p className="text-gray-600 text-lg">{description}</p>
              )}
            </div>
            <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved || undefined} />
          </div>
          <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" />
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
              className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
            className="flex items-center gap-2 px-6 py-3 text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        {children}
      </div>

      {/* Bottom Navigation */}
      {showNavigation && (onNext || onPrevious) && (
        <div className="flex items-center justify-between gap-4">
          {onPrevious ? (
            <button
              type="button"
              onClick={onPrevious}
              className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
            className="flex items-center gap-2 px-6 py-3 text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
