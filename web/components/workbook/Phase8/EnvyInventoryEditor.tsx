'use client'

export interface EnvyItem {
  id: string
  person: string
  what_I_envy: string
  why_it_triggers_me: string
  what_it_reveals: string // What I truly want
}

export interface EnvyInventoryData {
  envyItems: EnvyItem[]
}

export interface EnvyInventoryEditorProps {
  data: EnvyInventoryData
  onChange: (data: EnvyInventoryData) => void
  className?: string
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Envy Inventory Editor - Identify and explore feelings of envy
 *
 * Helps users understand that envy can be a compass pointing to unmet desires.
 *
 * @example
 * ```tsx
 * <EnvyInventoryEditor
 *   data={envyData}
 *   onChange={(newData) => setEnvyData(newData)}
 * />
 * ```
 */
export function EnvyInventoryEditor({ data, onChange, className = '' }: EnvyInventoryEditorProps) {
  const handleAddItem = () => {
    const newItem: EnvyItem = {
      id: generateId(),
      person: '',
      what_I_envy: '',
      why_it_triggers_me: '',
      what_it_reveals: '',
    }

    onChange({
      ...data,
      envyItems: [...data.envyItems, newItem],
    })
  }

  const handleUpdateItem = (id: string, field: keyof EnvyItem, value: string) => {
    onChange({
      ...data,
      envyItems: data.envyItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    })
  }

  const handleDeleteItem = (id: string) => {
    if (confirm('Remove this envy item?')) {
      onChange({
        ...data,
        envyItems: data.envyItems.filter(item => item.id !== id),
      })
    }
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Introduction */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-orange-900 mb-1">
              Envy as a Compass
            </h4>
            <p className="text-sm text-orange-800">
              Envy gets a bad rap, but it's actually valuable feedback. When you envy someone, you're receiving
              information about unfulfilled desires. This exercise helps you decode that message and transform
              envy into inspired action.
            </p>
          </div>
        </div>
      </div>

      {/* Add Item Button */}
      <div className="text-center">
        <button
          onClick={handleAddItem}
          className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 hover:scale-105 mx-auto"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="font-semibold">Add Envy Item</span>
        </button>
      </div>

      {/* Envy Items List */}
      {data.envyItems.length > 0 ? (
        <div className="space-y-6">
          {data.envyItems.map((item, index) => (
            <div key={item.id} className="bg-white rounded-xl border-2 border-orange-200 shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 border-b-2 border-orange-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Envy Exploration</h3>
                </div>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-red-600 hover:text-red-700 p-2"
                  aria-label="Delete item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Fields */}
              <div className="p-6 space-y-6">
                {/* Person */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Who do I envy?
                  </label>
                  <input
                    type="text"
                    value={item.person}
                    onChange={(e) => handleUpdateItem(item.id, 'person', e.target.value)}
                    placeholder="Person's name or description..."
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* What I Envy */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What specifically do I envy about them?
                  </label>
                  <textarea
                    value={item.what_I_envy}
                    onChange={(e) => handleUpdateItem(item.id, 'what_I_envy', e.target.value)}
                    placeholder="Be specific: their career success, relationship, lifestyle, confidence, freedom..."
                    rows={3}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y"
                  />
                </div>

                {/* Why It Triggers Me */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Why does this trigger me? What emotions come up?
                  </label>
                  <textarea
                    value={item.why_it_triggers_me}
                    onChange={(e) => handleUpdateItem(item.id, 'why_it_triggers_me', e.target.value)}
                    placeholder="Explore honestly: inadequacy, frustration, longing, comparison, fear..."
                    rows={3}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y"
                  />
                </div>

                {/* What It Reveals */}
                <div className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-300 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-green-900 mb-2">
                    💡 What does this reveal about what I truly want?
                  </label>
                  <textarea
                    value={item.what_it_reveals}
                    onChange={(e) => handleUpdateItem(item.id, 'what_it_reveals', e.target.value)}
                    placeholder="Transform the envy: What unmet need or desire is this pointing to?"
                    rows={3}
                    className="w-full p-3 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y bg-white"
                  />
                  <p className="text-xs text-green-700 mt-2">
                    This is the golden insight - envy is showing you what you value and want for yourself.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-gray-600 font-semibold mb-2">No envy items yet</p>
          <p className="text-sm text-gray-500">Be honest with yourself - what makes you feel envious?</p>
        </div>
      )}

      {/* Understanding Envy */}
      <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Understanding Envy</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
            <span><strong>Envy is information:</strong> It shows you what you value and desire</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
            <span><strong>It's not about them:</strong> The person you envy is just a mirror</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
            <span><strong>Transform it:</strong> Use envy as fuel for inspired action</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
            <span><strong>Admiration vs Envy:</strong> Admiration says "I celebrate them." Envy says "I want that too."</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
            <span><strong>The gift:</strong> Envy reveals your path forward</span>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 text-center">
        <p className="text-lg italic text-gray-800 mb-2">
          "Envy is the art of counting someone else's blessings instead of your own."
        </p>
        <p className="text-sm text-gray-600">
          But when understood, it becomes the art of discovering your own path.
        </p>
      </div>
    </div>
  )
}
