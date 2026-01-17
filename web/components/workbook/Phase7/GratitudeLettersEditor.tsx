'use client'

export interface GratitudeLetter {
  id: string
  recipient: string
  content: string
  relationship: string
  createdAt: string
  sent?: boolean
}

export interface GratitudeLettersData {
  letters: GratitudeLetter[]
}

export interface GratitudeLettersEditorProps {
  data: GratitudeLettersData
  onChange: (data: GratitudeLettersData) => void
  className?: string
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Gratitude Letters Editor - Write thank you letters to people who impacted your life
 *
 * Features:
 * - Compose heartfelt letters
 * - Track recipient and relationship
 * - Mark as sent
 * - Letter history
 *
 * @example
 * ```tsx
 * <GratitudeLettersEditor
 *   data={lettersData}
 *   onChange={(newData) => setLettersData(newData)}
 * />
 * ```
 */
export function GratitudeLettersEditor({ data, onChange, className = '' }: GratitudeLettersEditorProps) {
  const handleAddLetter = () => {
    const newLetter: GratitudeLetter = {
      id: generateId(),
      recipient: '',
      content: '',
      relationship: '',
      createdAt: new Date().toISOString(),
      sent: false,
    }

    onChange({
      ...data,
      letters: [...data.letters, newLetter],
    })
  }

  const handleUpdateLetter = (id: string, field: keyof GratitudeLetter, value: string | boolean) => {
    onChange({
      ...data,
      letters: data.letters.map(letter =>
        letter.id === id ? { ...letter, [field]: value } : letter
      ),
    })
  }

  const handleDeleteLetter = (id: string) => {
    if (confirm('Delete this gratitude letter?')) {
      onChange({
        ...data,
        letters: data.letters.filter(letter => letter.id !== id),
      })
    }
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Introduction */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-pink-900 mb-1">
              Write Gratitude Letters
            </h4>
            <p className="text-sm text-pink-800">
              Express your appreciation to people who have made a positive impact on your life. Writing gratitude letters
              strengthens relationships and increases both your happiness and theirs. You can choose to send them or keep
              them private.
            </p>
          </div>
        </div>
      </div>

      {/* Add Letter Button */}
      <div className="text-center">
        <button
          onClick={handleAddLetter}
          className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 hover:scale-105 mx-auto"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="font-semibold">Write a New Gratitude Letter</span>
        </button>
      </div>

      {/* Letters List */}
      {data.letters.length > 0 ? (
        <div className="space-y-6">
          {data.letters.map((letter, index) => (
            <div key={letter.id} className="bg-white rounded-xl border-2 border-pink-200 shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 border-b-2 border-pink-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Recipient Name
                        </label>
                        <input
                          type="text"
                          value={letter.recipient}
                          onChange={(e) => handleUpdateLetter(letter.id, 'recipient', e.target.value)}
                          placeholder="e.g., Sarah Johnson"
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Relationship
                        </label>
                        <input
                          type="text"
                          value={letter.relationship}
                          onChange={(e) => handleUpdateLetter(letter.id, 'relationship', e.target.value)}
                          placeholder="e.g., Mother, Mentor, Friend"
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteLetter(letter.id)}
                    className="flex-shrink-0 text-red-600 hover:text-red-700 p-2"
                    aria-label="Delete letter"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Letter Content */}
              <div className="p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Letter
                </label>
                <textarea
                  value={letter.content}
                  onChange={(e) => handleUpdateLetter(letter.id, 'content', e.target.value)}
                  placeholder="Dear [Name],&#10;&#10;I want to express my heartfelt gratitude for...&#10;&#10;[Share specific examples of how they've impacted your life]&#10;&#10;Thank you for being such an important part of my journey.&#10;&#10;With gratitude,&#10;[Your Name]"
                  rows={12}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none resize-y"
                  style={{ fontFamily: 'Georgia, serif', lineHeight: '1.8' }}
                />
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-gray-500">{letter.content.length} characters</p>
                  <p className="text-xs text-gray-400">
                    {new Date(letter.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={letter.sent || false}
                    onChange={(e) => handleUpdateLetter(letter.id, 'sent', e.target.checked)}
                    className="w-5 h-5 text-pink-600 rounded focus:ring-2 focus:ring-pink-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    {letter.sent ? '✅ Sent to recipient' : 'Mark as sent'}
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600 font-semibold mb-2">No gratitude letters yet</p>
          <p className="text-sm text-gray-500">Start by writing your first letter to someone who made a difference</p>
        </div>
      )}

      {/* Statistics */}
      {data.letters.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-4">Your Gratitude Letters</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{data.letters.length}</div>
              <div className="text-sm text-gray-600">Total Letters</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {data.letters.filter(l => l.sent).length}
              </div>
              <div className="text-sm text-gray-600">Sent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(data.letters.reduce((sum, l) => sum + l.content.length, 0) / data.letters.length)}
              </div>
              <div className="text-sm text-gray-600">Avg Length</div>
            </div>
          </div>
        </div>
      )}

      {/* Writing Tips */}
      <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Letter Writing Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Be specific about what they did and how it helped you</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Share concrete examples and vivid memories</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Express the emotional impact they had on you</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Don't worry about perfect grammar - focus on authenticity</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Consider reading it to them in person for maximum impact</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Even if you don't send it, the act of writing brings benefits</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
