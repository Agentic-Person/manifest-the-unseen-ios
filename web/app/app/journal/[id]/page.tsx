'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useJournal } from '@/hooks/useJournal'
import { JournalEditor, JournalEditorData } from '@/components/journal/JournalEditor'
import { JournalEntry, formatDate } from '@/types/database'

export default function EditJournalEntryPage() {
  const params = useParams()
  const router = useRouter()
  const entryId = params.id as string

  const { user, loading: authLoading } = useAuth()
  const { getEntry, updateEntry, deleteEntry, error: journalError } = useJournal()

  const [entry, setEntry] = useState<JournalEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch entry on mount
  useEffect(() => {
    if (!user || !entryId) return

    const fetchEntry = async () => {
      setLoading(true)
      setError(null)

      const fetchedEntry = await getEntry(entryId)

      if (fetchedEntry) {
        setEntry(fetchedEntry)
      } else {
        setError('Entry not found or you do not have permission to view it.')
      }

      setLoading(false)
    }

    fetchEntry()
  }, [user, entryId, getEntry])

  const handleSave = useCallback(async (data: JournalEditorData) => {
    if (!entryId) return

    const updatedEntry = await updateEntry(entryId, {
      content: data.content,
      mood: data.mood,
      tags: data.tags,
    })

    if (updatedEntry) {
      setEntry(updatedEntry)
    }
  }, [entryId, updateEntry])

  const handleDelete = useCallback(async () => {
    if (!entryId) return

    setIsDeleting(true)
    const success = await deleteEntry(entryId)

    if (success) {
      router.push('/app/journal')
    } else {
      setIsDeleting(false)
      setError('Failed to delete entry. Please try again.')
    }
  }, [entryId, deleteEntry, router])

  const handleCancel = () => {
    router.push('/app/journal')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-void">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aged-gold mx-auto mb-4"></div>
          <p className="text-muted-wisdom">Loading entry...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-void">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-aged-gold mb-4">Please sign in</h1>
          <p className="text-muted-wisdom mb-6">You need to be signed in to view your journal entries.</p>
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

  if (error || !entry) {
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
              Entry Not Found
            </h1>
          </div>
        </header>

        {/* Error message */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <svg
              className="w-20 h-20 mx-auto mb-6 text-muted-wisdom/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-ancient-script mb-4">
              Entry Not Found
            </h2>
            <p className="text-muted-wisdom mb-8 max-w-md mx-auto">
              {error || 'This journal entry could not be found. It may have been deleted or you may not have permission to view it.'}
            </p>
            <Link
              href="/app/journal"
              className="px-6 py-3 bg-aged-gold text-deep-void rounded-lg font-medium hover:bg-aged-gold/90 transition-all duration-200 shadow-[0_0_12px_rgba(196,160,82,0.3)]"
            >
              Back to Journal
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const initialData: JournalEditorData = {
    content: entry.content,
    mood: entry.mood as JournalEditorData['mood'],
    tags: entry.tags || [],
  }

  return (
    <div className="min-h-screen bg-deep-void">
      {/* Header */}
      <header className="bg-temple-stone shadow-[0_4px_24px_rgba(0,0,0,0.4)] border-b border-[rgba(196,160,82,0.2)]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/app/journal"
              className="text-muted-wisdom hover:text-aged-gold transition-colors"
              title="Back to Journal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-aged-gold">
                Edit Entry
              </h1>
              <p className="text-xs text-muted-wisdom/60">
                Created {formatDate(entry.created_at)}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Error message */}
        {journalError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">{journalError.message}</p>
          </div>
        )}

        {/* Editor */}
        <div className="bg-temple-stone border border-[rgba(196,160,82,0.2)] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
          <JournalEditor
            initialData={initialData}
            isNew={false}
            onSave={handleSave}
            onCancel={handleCancel}
            onDelete={handleDelete}
            disabled={isDeleting}
            autoSaveEnabled={true}
            autoSaveDelay={5000}
          />
        </div>
      </main>
    </div>
  )
}
