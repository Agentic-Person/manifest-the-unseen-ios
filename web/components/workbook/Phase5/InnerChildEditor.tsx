'use client'

export interface InnerChildData {
  memories: string
  needs: string
  message: string
  healing: string
}

export interface InnerChildEditorProps {
  data: InnerChildData
  onChange: (data: InnerChildData) => void
  className?: string
}

const PROMPTS = [
  { key: 'memories' as const, label: 'Childhood Memories', prompt: 'What memories from childhood still affect you today?' },
  { key: 'needs' as const, label: 'Unmet Needs', prompt: 'What did your younger self need but didn\'t receive?' },
  { key: 'message' as const, label: 'Message to Your Inner Child', prompt: 'What would you say to comfort your younger self?' },
  { key: 'healing' as const, label: 'Healing Actions', prompt: 'How can you give yourself what you needed then?' },
]

export function InnerChildEditor({ data, onChange, className = '' }: InnerChildEditorProps) {
  const updateField = (key: keyof InnerChildData, value: string) => {
    onChange({ ...data, [key]: value })
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Connect with and heal your inner child through guided reflection and compassionate self-dialogue.
        </p>
      </div>

      <div className="space-y-6">
        {PROMPTS.map((prompt) => (
          <div key={prompt.key} className="bg-white rounded-xl border-2 border-blue-200 p-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">{prompt.label}</h4>
            <p className="text-sm text-gray-600 mb-4">{prompt.prompt}</p>
            <textarea
              value={data[prompt.key]}
              onChange={(e) => updateField(prompt.key, e.target.value)}
              rows={6}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Take your time to reflect..."
            />
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <h4 className="font-semibold text-purple-900 mb-2">Healing Tip</h4>
        <p className="text-sm text-purple-800">
          Be gentle with yourself. Inner child work can bring up difficult emotions. It&apos;s okay to take breaks and return when you&apos;re ready.
        </p>
      </div>
    </div>
  )
}
