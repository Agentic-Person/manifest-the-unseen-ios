'use client'

export interface RoleModel {
  id: string
  name: string
  qualities: string[]
  achievements: string
  lessons_learned: string
  how_to_emulate: string
}

export interface RoleModelsData {
  models: RoleModel[]
}

export interface RoleModelsEditorProps {
  data: RoleModelsData
  onChange: (data: RoleModelsData) => void
  className?: string
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Role Models Editor - Identify inspiring role models and extract lessons
 *
 * Helps users identify people they admire and extract actionable wisdom.
 *
 * @example
 * ```tsx
 * <RoleModelsEditor
 *   data={modelsData}
 *   onChange={(newData) => setModelsData(newData)}
 * />
 * ```
 */
export function RoleModelsEditor({ data, onChange, className = '' }: RoleModelsEditorProps) {
  const handleAddModel = () => {
    const newModel: RoleModel = {
      id: generateId(),
      name: '',
      qualities: [''],
      achievements: '',
      lessons_learned: '',
      how_to_emulate: '',
    }

    onChange({
      ...data,
      models: [...data.models, newModel],
    })
  }

  const handleUpdateModel = (id: string, field: keyof Omit<RoleModel, 'qualities'>, value: string) => {
    onChange({
      ...data,
      models: data.models.map(model =>
        model.id === id ? { ...model, [field]: value } : model
      ),
    })
  }

  const handleAddQuality = (id: string) => {
    onChange({
      ...data,
      models: data.models.map(model =>
        model.id === id ? { ...model, qualities: [...model.qualities, ''] } : model
      ),
    })
  }

  const handleUpdateQuality = (id: string, index: number, value: string) => {
    onChange({
      ...data,
      models: data.models.map(model =>
        model.id === id
          ? { ...model, qualities: model.qualities.map((q, i) => i === index ? value : q) }
          : model
      ),
    })
  }

  const handleRemoveQuality = (id: string, index: number) => {
    onChange({
      ...data,
      models: data.models.map(model =>
        model.id === id
          ? { ...model, qualities: model.qualities.filter((_, i) => i !== index) }
          : model
      ),
    })
  }

  const handleDeleteModel = (id: string) => {
    if (confirm('Delete this role model?')) {
      onChange({
        ...data,
        models: data.models.filter(model => model.id !== id),
      })
    }
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Introduction */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              Your Role Models & Mentors
            </h4>
            <p className="text-sm text-blue-800">
              Identify people who inspire you (living or deceased, personal connections or public figures).
              Study their qualities, achievements, and extract lessons you can apply to your own journey.
            </p>
          </div>
        </div>
      </div>

      {/* Add Model Button */}
      <div className="text-center">
        <button
          onClick={handleAddModel}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 hover:scale-105 mx-auto"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="font-semibold">Add Role Model</span>
        </button>
      </div>

      {/* Models List */}
      {data.models.length > 0 ? (
        <div className="space-y-6">
          {data.models.map((model, index) => (
            <div key={model.id} className="bg-white rounded-xl border-2 border-blue-200 shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b-2 border-blue-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>
                      <label className="block text-sm font-semibold text-gray-600">
                        Role Model Name
                      </label>
                    </div>
                    <input
                      type="text"
                      value={model.name}
                      onChange={(e) => handleUpdateModel(model.id, 'name', e.target.value)}
                      placeholder="e.g., Oprah Winfrey, My grandmother, Elon Musk..."
                      className="w-full p-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                    />
                  </div>

                  <button
                    onClick={() => handleDeleteModel(model.id)}
                    className="flex-shrink-0 text-red-600 hover:text-red-700 p-2"
                    aria-label="Delete role model"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Fields */}
              <div className="p-6 space-y-6">
                {/* Qualities */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Qualities I Admire
                  </label>
                  <div className="space-y-3">
                    {model.qualities.map((quality, qualityIndex) => (
                      <div key={qualityIndex} className="flex items-center gap-3">
                        <span className="flex-shrink-0 text-blue-600 font-bold">✓</span>
                        <input
                          type="text"
                          value={quality}
                          onChange={(e) => handleUpdateQuality(model.id, qualityIndex, e.target.value)}
                          placeholder="e.g., Resilience, Creativity, Authenticity..."
                          className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {model.qualities.length > 1 && (
                          <button
                            onClick={() => handleRemoveQuality(model.id, qualityIndex)}
                            className="flex-shrink-0 text-red-600 hover:text-red-700 p-2"
                            aria-label="Remove quality"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}

                    {model.qualities.length < 10 && (
                      <button
                        onClick={() => handleAddQuality(model.id)}
                        className="w-full py-3 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-blue-600 font-semibold text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Quality
                      </button>
                    )}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notable Achievements
                  </label>
                  <textarea
                    value={model.achievements}
                    onChange={(e) => handleUpdateModel(model.id, 'achievements', e.target.value)}
                    placeholder="What have they accomplished that inspires you?"
                    rows={3}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                  />
                </div>

                {/* Lessons Learned */}
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-green-900 mb-2">
                    💡 Lessons I've Learned From Them
                  </label>
                  <textarea
                    value={model.lessons_learned}
                    onChange={(e) => handleUpdateModel(model.id, 'lessons_learned', e.target.value)}
                    placeholder="What wisdom or insights have you gained by observing them?"
                    rows={3}
                    className="w-full p-3 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y bg-white"
                  />
                </div>

                {/* How to Emulate */}
                <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-purple-900 mb-2">
                    🎯 How I Can Emulate These Qualities
                  </label>
                  <textarea
                    value={model.how_to_emulate}
                    onChange={(e) => handleUpdateModel(model.id, 'how_to_emulate', e.target.value)}
                    placeholder="Specific ways you can apply their approach to your own life..."
                    rows={3}
                    className="w-full p-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-600 font-semibold mb-2">No role models yet</p>
          <p className="text-sm text-gray-500">Who inspires you? Add them here.</p>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gradient-to-br from-yellow-50 to-white border border-yellow-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4">Tips for Choosing Role Models</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold">•</span>
            <span>Mix personal (family, friends) and public figures</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold">•</span>
            <span>Focus on specific qualities, not their entire life</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold">•</span>
            <span>Historical figures count too</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold">•</span>
            <span>It's okay to admire someone despite their flaws</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold">•</span>
            <span>Extract specific, actionable lessons</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
