'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useJournal } from '@/hooks/useJournal'
import { useJournalLimit } from '@/hooks/useJournalLimit'
import { JournalEditor, JournalEditorData } from '@/components/journal/JournalEditor'
import { JournalLimitBanner } from '@/components/journal/JournalLimitBanner'

export default function NewJournalEntryPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { createEntry, loading: createLoading, error: createError } = useJournal()
  const { canCreateEntry, loading: limitLoading } = useJournalLimit()

  const [entryId, setEntryId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (data: JournalEditorData) => {
    if (!data.content.trim()) return
    if (!canCreateEntry && !entryId) {
      router.push('/pricing')
      return
    }

    setIsSaving(true)
    try {
      // If we already have an entry ID, this is an update (auto-save)
      // Otherwise, create a new entry
      if (!entryId) {
        const newEntry = await createEntry({
          content: data.content,
          mood: data.mood,
          tags: data.tags,
        })

        if (newEntry) {
          setEntryId(newEntry.id)
          // After first save, redirect to edit page for future saves
          router.replace(`/app/journal/${newEntry.id}`)
        }
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    router.push('/app/journal')
  }

  if (authLoading || limitLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-void">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aged-gold mx-auto mb-4"></div>
          <p className="text-muted-wisdom">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-void">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-aged-gold mb-4">Please sign in</h1>
          <p className="text-muted-wisdom mb-6">You need to be signed in to create journal entries.</p>
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-aged-gold text-deep-void rounded-lg font-medium hover:bg-aged-gold/90 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (!canCreateEntry) {
    return (
      <div className="min-h-screen bg-deep-void">
        {/* Header */}
        <header className="bg-temple-stone shadow-[0_4px_24px_rgba(0,0,0,0.4)] border-b border-[rgba(196,160,82,0.2)]">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link
              href="/app/journal"
              className="text-muted-wisdom hover:text-aged-gold transition-colors"
              title="Back to Journal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-aged-gold">
              New Entry
            </h1>
          </div>
        </header>

        {/* Limit reached message */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <svg
              className="w-20 h-20 mx-auto mb-6 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-ancient-script mb-4">
              Monthly Limit Reached
            </h2>
            <p className="text-muted-wisdom mb-8 max-w-md mx-auto">
              You&apos;ve reached your journal entry limit for this month.
              Upgrade your plan to continue writing and capturing your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pricing"
                className="px-6 py-3 bg-aged-gold text-deep-void rounded-lg font-medium hover:bg-aged-gold/90 transition-all duration-200 shadow-[0_0_12px_rgba(196,160,82,0.3)]"
              >
                View Upgrade Options
              </Link>
              <Link
                href="/app/journal"
                className="px-6 py-3 bg-elevated border border-[rgba(196,160,82,0.2)] text-muted-wisdom rounded-lg font-medium hover:border-aged-gold/50 transition-colors"
              >
                Back to Journal
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-deep-void">
      {/* Header */}
      <header className="bg-temple-stone shadow-[0_4px_24px_rgba(0,0,0,0.4)] border-b border-[rgba(196,160,82,0.2)]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/app/journal"
            className="text-muted-wisdom hover:text-aged-gold transition-colors"
            title="Back to Journal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-aged-gold">
            New Entry
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Limit banner */}
        <JournalLimitBanner className="mb-6" />

        {/* Error message */}
        {createError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">{createError.message}</p>
          </div>
        )}

        {/* Editor */}
        <div className="bg-temple-stone border border-[rgba(196,160,82,0.2)] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
          <JournalEditor
            isNew={true}
            onSave={handleSave}
            onCancel={handleCancel}
            disabled={isSaving || createLoading}
            autoSaveEnabled={false} // Don't auto-save new entries until first manual save
          />
        </div>
      </main>
    </div>
  )
}
