'use client'

export interface LetterData {
  recipient: 'past_self' | 'future_self'
  content: string
  timeline: string
  promises: string[]
}

export interface FutureLetterData {
  letter: LetterData
}

export interface FutureLetterEditorProps {
  data: FutureLetterData
  onChange: (data: FutureLetterData) => void
  className?: string
}

export function FutureLetterEditor({ data, onChange, className = '' }: FutureLetterEditorProps) {
  const handleUpdateLetter = (field: keyof LetterData, value: string | string[]) => {
    onChange({
      letter: { ...data.letter, [field]: value },
    })
  }

  const handleAddPromise = () => {
    onChange({
      letter: {
        ...data.letter,
        promises: [...data.letter.promises, ''],
      },
    })
  }

  const handleUpdatePromise = (index: number, value: string) => {
    const promises = [...data.letter.promises]
    promises[index] = value
    onChange({ letter: { ...data.letter, promises } })
  }

  const handleRemovePromise = (index: number) => {
    onChange({
      letter: {
        ...data.letter,
        promises: data.letter.promises.filter((_, i) => i !== index),
      },
    })
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-indigo-900 mb-1">Letter to Your Future Self</h4>
            <p className="text-sm text-indigo-800">
              Write a letter to your future self or past self. Acknowledge your journey, make promises, and set intentions for what's to come.
            </p>
          </div>
        </div>
      </div>

      {/* Recipient Selection */}
      <div className="bg-white rounded-xl border-2 border-indigo-200 p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Writing to:</label>
        <div className="flex gap-4">
          <button
            onClick={() => handleUpdateLetter('recipient', 'past_self')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              data.letter.recipient === 'past_self'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                : 'border-gray-300 hover:border-indigo-300'
            }`}
          >
            <div className="text-2xl mb-2">⏪</div>
            <div className="font-semibold">Past Self</div>
            <div className="text-xs text-gray-600 mt-1">Acknowledge how far you've come</div>
          </button>

          <button
            onClick={() => handleUpdateLetter('recipient', 'future_self')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              data.letter.recipient === 'future_self'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                : 'border-gray-300 hover:border-indigo-300'
            }`}
          >
            <div className="text-2xl mb-2">⏩</div>
            <div className="font-semibold">Future Self</div>
            <div className="text-xs text-gray-600 mt-1">Set intentions for who you're becoming</div>
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Timeline</label>
        <input
          type="text"
          value={data.letter.timeline}
          onChange={(e) => handleUpdateLetter('timeline', e.target.value)}
          placeholder="e.g., 1 year from now, 5 years, December 2030..."
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
      </div>

      {/* Letter Content */}
      <div className="bg-white rounded-xl border-2 border-indigo-200 p-6 shadow-md">
        <label className="block text-lg font-semibold text-gray-900 mb-4">Your Letter</label>
        <textarea
          value={data.letter.content}
          onChange={(e) => handleUpdateLetter('content', e.target.value)}
          placeholder={
            data.letter.recipient === 'past_self'
              ? "Dear Past Me,\n\nI want you to know...\n\nThank you for...\n\nBecause of you, I am now...\n\nWith love,\nFuture You"
              : "Dear Future Me,\n\nBy the time you read this...\n\nI hope you remember...\n\nKeep going because...\n\nWith love,\nPresent You"
          }
          rows={15}
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-y"
          style={{ fontFamily: 'Georgia, serif', lineHeight: '1.8' }}
        />
        <p className="text-sm text-gray-500 mt-2">{data.letter.content.length} characters</p>
      </div>

      {/* Promises */}
      <div className="bg-gradient-to-br from-pink-50 to-white border-2 border-pink-300 rounded-xl p-6">
        <label className="block text-lg font-semibold text-pink-900 mb-3">Promises to Myself</label>
        <div className="space-y-3">
          {data.letter.promises.map((promise, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="flex-shrink-0 text-pink-600 font-bold mt-3">✓</span>
              <input
                type="text"
                value={promise}
                onChange={(e) => handleUpdatePromise(idx, e.target.value)}
                placeholder="I promise to..."
                className="flex-1 p-3 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none bg-white"
              />
              {data.letter.promises.length > 1 && (
                <button
                  onClick={() => handleRemovePromise(idx)}
                  className="flex-shrink-0 text-red-600 hover:text-red-700 p-2 mt-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            onClick={handleAddPromise}
            className="w-full py-3 border-2 border-dashed border-pink-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all flex items-center justify-center gap-2 text-pink-600 font-semibold text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Promise
          </button>
        </div>
      </div>
    </div>
  )
}
