'use client'

export interface Affirmation {
  id: string
  text: string
  category: string
}

export interface SelfLoveAffirmationsData {
  affirmations: Affirmation[]
}

export interface SelfLoveAffirmationsEditorProps {
  data: SelfLoveAffirmationsData
  onChange: (data: SelfLoveAffirmationsData) => void
  className?: string
}

const CATEGORIES = ['Self-Worth', 'Body Love', 'Confidence', 'Forgiveness', 'Growth']

export function SelfLoveAffirmationsEditor({ data, onChange, className = '' }: SelfLoveAffirmationsEditorProps) {
  const addAffirmation = (category: string, text: string) => {
    const affirmation: Affirmation = {
      id: `affirmation-${Date.now()}`,
      text,
      category,
    }
    onChange({ affirmations: [...data.affirmations, affirmation] })
  }

  const removeAffirmation = (id: string) => {
    onChange({ affirmations: data.affirmations.filter(a => a.id !== id) })
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="bg-elevated border border-[rgba(196,160,82,0.2)] rounded-lg p-4">
        <p className="text-sm text-muted-wisdom">Create personalized affirmations to nurture self-love and compassion.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((category) => {
          const categoryAffirmations = data.affirmations.filter(a => a.category === category)
          return (
            <div key={category} className="bg-elevated rounded-xl border-2 border-[rgba(196,160,82,0.2)] p-4">
              <h4 className="font-semibold text-enlightened mb-3">{category}</h4>
              <div className="space-y-2 mb-3">
                {categoryAffirmations.map((aff) => (
                  <div key={aff.id} className="bg-temple-stone rounded p-2 border border-[rgba(196,160,82,0.15)] flex justify-between items-start">
                    <p className="text-sm flex-1">{aff.text}</p>
                    <button onClick={() => removeAffirmation(aff.id)} className="text-red-500 hover:text-red-700 ml-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add affirmation..."
                className="w-full p-2 border rounded text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    addAffirmation(category, e.currentTarget.value.trim())
                    e.currentTarget.value = ''
                  }
                }}
              />
            </div>
          )
        })}
      </div>

      <div className="bg-elevated border border-[rgba(196,160,82,0.2)] rounded-lg p-6">
        <h4 className="font-semibold text-enlightened mb-2">Example Affirmations</h4>
        <ul className="text-sm text-muted-wisdom space-y-1">
          <li>• I am worthy of love and respect</li>
          <li>• I embrace my unique journey and celebrate my progress</li>
          <li>• I choose to see beauty in myself today</li>
        </ul>
      </div>
    </div>
  )
}
