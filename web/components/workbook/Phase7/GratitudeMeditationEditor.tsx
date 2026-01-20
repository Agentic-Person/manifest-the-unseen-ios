'use client'

export interface MeditationSession {
  id: string
  date: string
  duration: number // in minutes
  reflections: string
  grateful_for: string[]
}

export interface GratitudeMeditationData {
  sessions: MeditationSession[]
}

export interface GratitudeMeditationEditorProps {
  data: GratitudeMeditationData
  onChange: (data: GratitudeMeditationData) => void
  className?: string
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * Gratitude Meditation Editor - Log meditation sessions focused on gratitude
 *
 * Features:
 * - Session logging with duration
 * - Reflection notes
 * - Gratitude list per session
 * - Session history
 *
 * @example
 * ```tsx
 * <GratitudeMeditationEditor
 *   data={meditationData}
 *   onChange={(newData) => setMeditationData(newData)}
 * />
 * ```
 */
export function GratitudeMeditationEditor({ data, onChange, className = '' }: GratitudeMeditationEditorProps) {
  const handleAddSession = () => {
    const newSession: MeditationSession = {
      id: generateId(),
      date: new Date().toISOString(),
      duration: 10,
      reflections: '',
      grateful_for: [''],
    }

    onChange({
      ...data,
      sessions: [newSession, ...data.sessions], // Add to beginning
    })
  }

  const handleUpdateSession = (id: string, field: keyof MeditationSession, value: any) => {
    onChange({
      ...data,
      sessions: data.sessions.map(session =>
        session.id === id ? { ...session, [field]: value } : session
      ),
    })
  }

  const handleAddGratitudeItem = (sessionId: string) => {
    onChange({
      ...data,
      sessions: data.sessions.map(session =>
        session.id === sessionId
          ? { ...session, grateful_for: [...session.grateful_for, ''] }
          : session
      ),
    })
  }

  const handleUpdateGratitudeItem = (sessionId: string, index: number, value: string) => {
    onChange({
      ...data,
      sessions: data.sessions.map(session =>
        session.id === sessionId
          ? {
              ...session,
              grateful_for: session.grateful_for.map((item, i) => i === index ? value : item)
            }
          : session
      ),
    })
  }

  const handleRemoveGratitudeItem = (sessionId: string, index: number) => {
    onChange({
      ...data,
      sessions: data.sessions.map(session =>
        session.id === sessionId
          ? { ...session, grateful_for: session.grateful_for.filter((_, i) => i !== index) }
          : session
      ),
    })
  }

  const handleDeleteSession = (id: string) => {
    if (confirm('Delete this meditation session?')) {
      onChange({
        ...data,
        sessions: data.sessions.filter(session => session.id !== id),
      })
    }
  }

  const totalMinutes = data.sessions.reduce((sum, s) => sum + s.duration, 0)
  const totalSessions = data.sessions.length

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Introduction */}
      <div className="bg-elevated border border-[rgba(196,160,82,0.2)] rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-enlightened mb-1">
              Gratitude Meditation Practice
            </h4>
            <p className="text-sm text-muted-wisdom">
              Combine meditation with gratitude by spending quiet time reflecting on what you&apos;re thankful for.
              Log your sessions and insights to deepen your practice.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {totalSessions > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600">{totalSessions}</div>
              <div className="text-sm text-muted-wisdom">Sessions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">{totalMinutes}</div>
              <div className="text-sm text-muted-wisdom">Total Minutes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {Math.round(totalMinutes / totalSessions)}
              </div>
              <div className="text-sm text-muted-wisdom">Avg Duration</div>
            </div>
          </div>
        </div>
      )}

      {/* Add Session Button */}
      <div className="text-center">
        <button
          onClick={handleAddSession}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 hover:scale-105 mx-auto"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="font-semibold">Log a Meditation Session</span>
        </button>
      </div>

      {/* Sessions List */}
      {data.sessions.length > 0 ? (
        <div className="space-y-6">
          {data.sessions.map((session) => (
            <div key={session.id} className="bg-elevated rounded-xl border-2 border-[rgba(196,160,82,0.2)] shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-elevated p-6 border-b-2 border-[rgba(196,160,82,0.2)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-wisdom mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={session.date.split('T')[0]}
                        onChange={(e) => handleUpdateSession(session.id, 'date', new Date(e.target.value).toISOString())}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-wisdom mb-1">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={session.duration}
                        onChange={(e) => handleUpdateSession(session.id, 'duration', parseInt(e.target.value) || 0)}
                        min="1"
                        max="120"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    className="flex-shrink-0 text-red-600 hover:text-red-700 p-2"
                    aria-label="Delete session"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Reflections */}
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-muted-wisdom mb-2">
                    Session Reflections
                  </label>
                  <textarea
                    value={session.reflections}
                    onChange={(e) => handleUpdateSession(session.id, 'reflections', e.target.value)}
                    placeholder="How did you feel during the meditation? What insights emerged?"
                    rows={4}
                    className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-y"
                  />
                </div>

                {/* Gratitude List */}
                <div>
                  <label className="block text-sm font-semibold text-muted-wisdom mb-3">
                    What I&apos;m Grateful For
                  </label>
                  <div className="space-y-3">
                    {session.grateful_for.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-2">
                          {index + 1}
                        </div>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleUpdateGratitudeItem(session.id, index, e.target.value)}
                          placeholder="Something you&apos;re grateful for..."
                          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                        {session.grateful_for.length > 1 && (
                          <button
                            onClick={() => handleRemoveGratitudeItem(session.id, index)}
                            className="flex-shrink-0 text-red-600 hover:text-red-700 p-2 mt-1"
                            aria-label="Remove item"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}

                    {session.grateful_for.length < 10 && (
                      <button
                        onClick={() => handleAddGratitudeItem(session.id)}
                        className="w-full py-3 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-elevated transition-all flex items-center justify-center gap-2 text-purple-600 font-semibold text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Another Item
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-elevated rounded-xl border-2 border-dashed border-aged-gold">
          <svg className="w-16 h-16 mx-auto text-tertiary-text mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-muted-wisdom font-semibold mb-2">No meditation sessions yet</p>
          <p className="text-sm text-tertiary-text">Log your first gratitude meditation to begin tracking</p>
        </div>
      )}

      {/* Meditation Guide */}
      <div className="bg-elevated border border-[rgba(196,160,82,0.2)] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-enlightened mb-4">Gratitude Meditation Guide</h3>
        <div className="space-y-3 text-sm text-muted-wisdom">
          <div className="bg-elevated rounded-lg p-4 border border-[rgba(196,160,82,0.15)]">
            <p className="font-semibold text-enlightened mb-2">🧘 Simple Practice (10-15 minutes)</p>
            <ol className="space-y-2 ml-4">
              <li>1. Find a quiet space and get comfortable</li>
              <li>2. Close your eyes and take 5 deep breaths</li>
              <li>3. Bring to mind someone or something you&apos;re grateful for</li>
              <li>4. Visualize it vividly - engage all your senses</li>
              <li>5. Feel the warmth of gratitude in your heart</li>
              <li>6. Repeat with 3-5 different things</li>
              <li>7. End with a few deep breaths</li>
            </ol>
          </div>

          <div className="bg-elevated rounded-lg p-4 border border-[rgba(196,160,82,0.15)]">
            <p className="font-semibold text-enlightened mb-2">💡 Tips for Deeper Practice</p>
            <ul className="space-y-1 ml-4">
              <li>• Use a guided meditation if you&apos;re new to this</li>
              <li>• Practice at the same time daily for consistency</li>
              <li>• Focus on feeling, not just thinking</li>
              <li>• Don&apos;t rush - quality over quantity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
