'use client'

export interface ScriptingData {
  script: string
}

export interface ScriptingEditorProps {
  data: ScriptingData
  onChange: (data: ScriptingData) => void
  className?: string
}

export function ScriptingEditor({ data, onChange, className = '' }: ScriptingEditorProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-sm text-purple-800">Write your manifestation as if it has already happened. Use present tense and vivid details.</p>
      </div>
      <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
        <textarea
          value={data.script}
          onChange={(e) => onChange({ script: e.target.value })}
          placeholder="I am so grateful that... (Write in present tense as if your manifestation has already occurred)"
          rows={15}
          className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          style={{ fontFamily: 'Georgia, serif', lineHeight: '1.8' }}
        />
        <p className="text-sm text-gray-500 mt-2">{data.script.length} characters</p>
      </div>
    </div>
  )
}
