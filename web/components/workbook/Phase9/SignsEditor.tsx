'use client'

export interface Sign {
  id: string
  date: string
  sign_observed: string
  interpretation: string
  action_taken: string
}

export interface SignsData {
  signs: Sign[]
}

export interface SignsEditorProps {
  data: SignsData
  onChange: (data: SignsData) => void
  className?: string
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function SignsEditor({ data, onChange, className = '' }: SignsEditorProps) {
  const handleAddSign = () => {
    const newSign: Sign = {
      id: generateId(),
      date: new Date().toISOString(),
      sign_observed: '',
      interpretation: '',
      action_taken: '',
    }

    onChange({
      ...data,
      signs: [newSign, ...data.signs],
    })
  }

  const handleUpdateSign = (id: string, field: keyof Sign, value: string) => {
    onChange({
      ...data,
      signs: data.signs.map(sign =>
        sign.id === id ? { ...sign, [field]: value } : sign
      ),
    })
  }

  const handleDeleteSign = (id: string) => {
    if (confirm('Delete this sign?')) {
      onChange({
        ...data,
        signs: data.signs.filter(sign => sign.id !== id),
      })
    }
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="bg-elevated border border-aged-gold rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-enlightened mb-1">Signs from the Universe</h4>
            <p className="text-sm text-yellow-800">
              When you&apos;re in alignment, the universe sends signs - synchronicities, patterns, messages. Record them here to strengthen your awareness and trust.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleAddSign}
          className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 hover:scale-105 mx-auto"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="font-semibold">Record a Sign</span>
        </button>
      </div>

      {data.signs.length > 0 ? (
        <div className="space-y-6">
          {data.signs.map((sign, index) => (
            <div key={sign.id} className="bg-elevated rounded-xl border-2 border-aged-gold shadow-lg overflow-hidden">
              <div className="bg-elevated p-6 border-b-2 border-aged-gold">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold">
                      ✨
                    </div>
                    <input
                      type="date"
                      value={sign.date.split('T')[0]}
                      onChange={(e) => handleUpdateSign(sign.id, 'date', new Date(e.target.value).toISOString())}
                      className="p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteSign(sign.id)}
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
                  <label className="block text-sm font-semibold text-muted-wisdom mb-2">The Sign I Observed</label>
                  <textarea
                    value={sign.sign_observed}
                    onChange={(e) => handleUpdateSign(sign.id, 'sign_observed', e.target.value)}
                    placeholder="Describe what happened - synchronicity, pattern, message, coincidence..."
                    rows={3}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none resize-y"
                  />
                </div>

                <div className="bg-elevated border-2 border-purple-300 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-enlightened mb-2">My Interpretation</label>
                  <textarea
                    value={sign.interpretation}
                    onChange={(e) => handleUpdateSign(sign.id, 'interpretation', e.target.value)}
                    placeholder="What does this sign mean to me? What message is it sending?"
                    rows={3}
                    className="w-full p-3 border-2 border-[rgba(196,160,82,0.2)] rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-y bg-elevated"
                  />
                </div>

                <div className="bg-elevated border-2 border-green-300 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-enlightened mb-2">Action I Took</label>
                  <textarea
                    value={sign.action_taken}
                    onChange={(e) => handleUpdateSign(sign.id, 'action_taken', e.target.value)}
                    placeholder="How did I respond to this sign? What did I do?"
                    rows={3}
                    className="w-full p-3 border-2 border-heart-emerald rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none resize-y bg-elevated"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-elevated rounded-xl border-2 border-dashed border-aged-gold">
          <svg className="w-16 h-16 mx-auto text-tertiary-text mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <p className="text-muted-wisdom font-semibold mb-2">No signs recorded yet</p>
          <p className="text-sm text-tertiary-text">Start noticing the universe's messages</p>
        </div>
      )}

      <div className="bg-elevated border border-[rgba(196,160,82,0.2)] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-enlightened mb-4">Types of Signs</h3>
        <ul className="space-y-2 text-sm text-muted-wisdom">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span><strong>Synchronicities:</strong> Meaningful coincidences that feel too perfect to be random</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span><strong>Repetition:</strong> Seeing the same number, symbol, or message repeatedly</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span><strong>Unexpected help:</strong> The right person or resource appearing at the right time</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span><strong>Gut feelings:</strong> Strong intuitive knowing or guidance</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
