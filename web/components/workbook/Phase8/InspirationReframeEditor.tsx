'use client'

export interface ReframeItem {
  id: string
  envy_statement: string
  reframed_inspiration: string
  action_steps: string[]
}

export interface InspirationReframeData {
  reframes: ReframeItem[]
}

export interface InspirationReframeEditorProps {
  data: InspirationReframeData
  onChange: (data: InspirationReframeData) => void
  className?: string
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Inspiration Reframe Editor - Transform envy into inspired action
 *
 * Takes envy statements and reframes them into empowering inspiration with action steps.
 *
 * @example
 * ```tsx
 * <InspirationReframeEditor
 *   data={reframeData}
 *   onChange={(newData) => setReframeData(newData)}
 * />
 * ```
 */
export function InspirationReframeEditor({ data, onChange, className = '' }: InspirationReframeEditorProps) {
  const handleAddReframe = () => {
    const newReframe: ReframeItem = {
      id: generateId(),
      envy_statement: '',
      reframed_inspiration: '',
      action_steps: [''],
    }

    onChange({
      ...data,
      reframes: [...data.reframes, newReframe],
    })
  }

  const handleUpdateReframe = (id: string, field: keyof Omit<ReframeItem, 'action_steps'>, value: string) => {
    onChange({
      ...data,
      reframes: data.reframes.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    })
  }

  const handleAddActionStep = (id: string) => {
    onChange({
      ...data,
      reframes: data.reframes.map(item =>
        item.id === id ? { ...item, action_steps: [...item.action_steps, ''] } : item
      ),
    })
  }

  const handleUpdateActionStep = (id: string, index: number, value: string) => {
    onChange({
      ...data,
      reframes: data.reframes.map(item =>
        item.id === id
          ? { ...item, action_steps: item.action_steps.map((step, i) => i === index ? value : step) }
          : item
      ),
    })
  }

  const handleRemoveActionStep = (id: string, index: number) => {
    onChange({
      ...data,
      reframes: data.reframes.map(item =>
        item.id === id
          ? { ...item, action_steps: item.action_steps.filter((_, i) => i !== index) }
          : item
      ),
    })
  }

  const handleDeleteReframe = (id: string) => {
    if (confirm('Delete this reframe?')) {
      onChange({
        ...data,
        reframes: data.reframes.filter(item => item.id !== id),
      })
    }
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Introduction */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-green-900 mb-1">
              From Envy to Inspiration
            </h4>
            <p className="text-sm text-green-800">
              Now take your envy inventory and transform it into inspired action. Reframe each envy statement
              into an empowering "I am inspired to..." statement, then create actionable steps to move forward.
            </p>
          </div>
        </div>
      </div>

      {/* Add Reframe Button */}
      <div className="text-center">
        <button
          onClick={handleAddReframe}
          className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 hover:scale-105 mx-auto"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="font-semibold">Add Inspiration Reframe</span>
        </button>
      </div>

      {/* Reframes List */}
      {data.reframes.length > 0 ? (
        <div className="space-y-6">
          {data.reframes.map((reframe, index) => (
            <div key={reframe.id} className="bg-white rounded-xl border-2 border-green-200 shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 border-b-2 border-green-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Transformation</h3>
                </div>
                <button
                  onClick={() => handleDeleteReframe(reframe.id)}
                  className="text-red-600 hover:text-red-700 p-2"
                  aria-label="Delete reframe"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Fields */}
              <div className="p-6 space-y-6">
                {/* Envy Statement */}
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-red-900 mb-2">
                    ❌ Envy Statement (from previous exercise)
                  </label>
                  <textarea
                    value={reframe.envy_statement}
                    onChange={(e) => handleUpdateReframe(reframe.id, 'envy_statement', e.target.value)}
                    placeholder="e.g., I'm jealous that Sarah has such a successful online business while I'm stuck in my 9-5..."
                    rows={3}
                    className="w-full p-3 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-y bg-white"
                  />
                </div>

                {/* Arrow */}
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                {/* Reframed Inspiration */}
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-green-900 mb-2">
                    ✨ Reframed as Inspiration
                  </label>
                  <textarea
                    value={reframe.reframed_inspiration}
                    onChange={(e) => handleUpdateReframe(reframe.id, 'reframed_inspiration', e.target.value)}
                    placeholder="e.g., I'm inspired to build my own online business. Sarah's success shows me it's possible and motivates me to start."
                    rows={3}
                    className="w-full p-3 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y bg-white"
                  />
                  <p className="text-xs text-green-700 mt-2">
                    Start with "I'm inspired to..." or "This shows me that I can..."
                  </p>
                </div>

                {/* Action Steps */}
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-blue-900 mb-3">
                    🎯 Action Steps I Can Take
                  </label>
                  <div className="space-y-3">
                    {reframe.action_steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-2">
                          {stepIndex + 1}
                        </div>
                        <input
                          type="text"
                          value={step}
                          onChange={(e) => handleUpdateActionStep(reframe.id, stepIndex, e.target.value)}
                          placeholder="Specific, actionable step..."
                          className="flex-1 p-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        />
                        {reframe.action_steps.length > 1 && (
                          <button
                            onClick={() => handleRemoveActionStep(reframe.id, stepIndex)}
                            className="flex-shrink-0 text-red-600 hover:text-red-700 p-2 mt-1"
                            aria-label="Remove step"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}

                    {reframe.action_steps.length < 10 && (
                      <button
                        onClick={() => handleAddActionStep(reframe.id)}
                        className="w-full py-3 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-100 transition-all flex items-center justify-center gap-2 text-blue-600 font-semibold text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Action Step
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p className="text-gray-600 font-semibold mb-2">No reframes yet</p>
          <p className="text-sm text-gray-500">Transform your envy into inspired action</p>
        </div>
      )}

      {/* Reframing Tips */}
      <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">Reframing Formula</h3>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <p className="font-semibold text-purple-900 mb-2">Before (Envy):</p>
            <p className="text-sm text-gray-700 italic">"I'm jealous that they have X while I don't."</p>
          </div>
          <div className="text-center text-purple-600 text-2xl font-bold">↓</div>
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <p className="font-semibold text-purple-900 mb-2">After (Inspiration):</p>
            <p className="text-sm text-gray-700 italic">"I'm inspired to create X for myself. Their success shows it's possible."</p>
          </div>
        </div>
      </div>
    </div>
  )
}
