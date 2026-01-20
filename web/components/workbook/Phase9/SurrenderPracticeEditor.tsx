'use client'

export interface SurrenderPractice {
  id: string
  date: string
  what_I_surrender: string
  affirmation: string
  feelings_before: string
  feelings_after: string
}

export interface SurrenderPracticeData {
  practices: SurrenderPractice[]
}

export interface SurrenderPracticeEditorProps {
  data: SurrenderPracticeData
  onChange: (data: SurrenderPracticeData) => void
  className?: string
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function SurrenderPracticeEditor({ data, onChange, className = '' }: SurrenderPracticeEditorProps) {
  const handleAddPractice = () => {
    const newPractice: SurrenderPractice = {
      id: generateId(),
      date: new Date().toISOString(),
      what_I_surrender: '',
      affirmation: '',
      feelings_before: '',
      feelings_after: '',
    }

    onChange({
      ...data,
      practices: [newPractice, ...data.practices],
    })
  }

  const handleUpdatePractice = (id: string, field: keyof SurrenderPractice, value: string) => {
    onChange({
      ...data,
      practices: data.practices.map(practice =>
        practice.id === id ? { ...practice, [field]: value } : practice
      ),
    })
  }

  const handleDeletePractice = (id: string) => {
    if (confirm('Delete this surrender practice?')) {
      onChange({
        ...data,
        practices: data.practices.filter(practice => practice.id !== id),
      })
    }
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="bg-elevated border border-[rgba(196,160,82,0.2)] rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-enlightened mb-1">Practice Surrender</h4>
            <p className="text-sm text-muted-wisdom">
              Surrender is not giving up - it&apos;s letting go of the need to control. Practice releasing what you cannot control and affirming trust in the process.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleAddPractice}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 hover:scale-105 mx-auto"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="font-semibold">Add Surrender Practice</span>
        </button>
      </div>

      {data.practices.length > 0 ? (
        <div className="space-y-6">
          {data.practices.map((practice, index) => (
            <div key={practice.id} className="bg-elevated rounded-xl border-2 border-[rgba(196,160,82,0.2)] shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 border-b-2 border-[rgba(196,160,82,0.2)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <input
                      type="date"
                      value={practice.date.split('T')[0]}
                      onChange={(e) => handleUpdatePractice(practice.id, 'date', new Date(e.target.value).toISOString())}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleDeletePractice(practice.id)}
                    className="flex-shrink-0 text-red-600 hover:text-red-700 p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-muted-wisdom mb-2">What I Surrender</label>
                  <textarea
                    value={practice.what_I_surrender}
                    onChange={(e) => handleUpdatePractice(practice.id, 'what_I_surrender', e.target.value)}
                    placeholder="What am I releasing control over?"
                    rows={3}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-y"
                  />
                </div>

                <div className="bg-elevated border-2 border-blue-300 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-enlightened mb-2">Surrender Affirmation</label>
                  <textarea
                    value={practice.affirmation}
                    onChange={(e) => handleUpdatePractice(practice.id, 'affirmation', e.target.value)}
                    placeholder="I release... I trust... I surrender..."
                    rows={3}
                    className="w-full p-3 border-2 border-[rgba(196,160,82,0.2)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y bg-elevated"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-muted-wisdom mb-2">Feelings Before</label>
                    <textarea
                      value={practice.feelings_before}
                      onChange={(e) => handleUpdatePractice(practice.id, 'feelings_before', e.target.value)}
                      placeholder="How did I feel while holding on?"
                      rows={3}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-muted-wisdom mb-2">Feelings After</label>
                    <textarea
                      value={practice.feelings_after}
                      onChange={(e) => handleUpdatePractice(practice.id, 'feelings_after', e.target.value)}
                      placeholder="How do I feel after surrendering?"
                      rows={3}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-y"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-elevated rounded-xl border-2 border-dashed border-aged-gold">
          <svg className="w-16 h-16 mx-auto text-tertiary-text mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <p className="text-muted-wisdom font-semibold mb-2">No surrender practices yet</p>
          <p className="text-sm text-tertiary-text">Begin practicing the art of letting go</p>
        </div>
      )}
    </div>
  )
}
