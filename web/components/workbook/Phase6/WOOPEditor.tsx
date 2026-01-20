'use client'

export interface WOOPData {
  wish: string
  outcome: string
  obstacle: string
  plan: string
}

export interface WOOPEditorProps {
  data: WOOPData
  onChange: (data: WOOPData) => void
  className?: string
}

const STEPS = [
  { key: 'wish' as const, label: 'Wish', prompt: 'What do you wish to accomplish?' },
  { key: 'outcome' as const, label: 'Outcome', prompt: 'What is the best possible outcome?' },
  { key: 'obstacle' as const, label: 'Obstacle', prompt: 'What internal obstacle might hold you back?' },
  { key: 'plan' as const, label: 'Plan', prompt: 'If the obstacle occurs, what will you do?' },
]

export function WOOPEditor({ data, onChange, className = '' }: WOOPEditorProps) {
  const updateField = (key: keyof WOOPData, value: string) => {
    onChange({ ...data, [key]: value })
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="bg-elevated border border-[rgba(196,160,82,0.2)] rounded-lg p-4">
        <h4 className="font-semibold text-enlightened mb-1">WOOP Method</h4>
        <p className="text-sm text-muted-wisdom">Wish, Outcome, Obstacle, Plan - A proven mental strategy for achieving goals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STEPS.map((step, index) => (
          <div key={step.key} className="bg-elevated rounded-xl border-2 border-[rgba(196,160,82,0.2)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-crown-purple text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold text-enlightened">{step.label}</h3>
            </div>
            <p className="text-sm text-muted-wisdom mb-4">{step.prompt}</p>
            <textarea
              value={data[step.key]}
              onChange={(e) => updateField(step.key, e.target.value)}
              rows={6}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
