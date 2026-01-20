'use client'

export interface GraduationData {
  commitments: string[]
  rituals_to_maintain: string[]
  completion_date: string
  final_reflections: string
  celebration_plan: string
}

export interface GraduationEditorProps {
  data: GraduationData
  onChange: (data: GraduationData) => void
  className?: string
}

export function GraduationEditor({ data, onChange, className = '' }: GraduationEditorProps) {
  const handleUpdateField = (field: keyof Omit<GraduationData, 'commitments' | 'rituals_to_maintain'>, value: string) => {
    onChange({ ...data, [field]: value })
  }

  const handleAddCommitment = () => {
    onChange({ ...data, commitments: [...data.commitments, ''] })
  }

  const handleUpdateCommitment = (index: number, value: string) => {
    const commitments = [...data.commitments]
    commitments[index] = value
    onChange({ ...data, commitments })
  }

  const handleRemoveCommitment = (index: number) => {
    onChange({ ...data, commitments: data.commitments.filter((_, i) => i !== index) })
  }

  const handleAddRitual = () => {
    onChange({ ...data, rituals_to_maintain: [...data.rituals_to_maintain, ''] })
  }

  const handleUpdateRitual = (index: number, value: string) => {
    const rituals = [...data.rituals_to_maintain]
    rituals[index] = value
    onChange({ ...data, rituals_to_maintain: rituals })
  }

  const handleRemoveRitual = (index: number) => {
    onChange({ ...data, rituals_to_maintain: data.rituals_to_maintain.filter((_, i) => i !== index) })
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Celebration Banner */}
      <div className="bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-100 border-2 border-yellow-300 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">🎓 🎉 ✨</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Congratulations!</h2>
        <p className="text-lg text-gray-700">
          You've completed all 10 phases of your manifestation journey.
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-purple-900 mb-1">Your Graduation Ceremony</h4>
            <p className="text-sm text-purple-800">
              Mark this milestone. Commit to maintaining what you've learned and celebrate how far you've come.
            </p>
          </div>
        </div>
      </div>

      {/* Completion Date */}
      <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
        <label className="block text-lg font-semibold text-gray-900 mb-3">Completion Date</label>
        <input
          type="date"
          value={data.completion_date}
          onChange={(e) => handleUpdateField('completion_date', e.target.value)}
          className="w-full p-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-lg"
        />
      </div>

      {/* Ongoing Commitments */}
      <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-300 rounded-xl p-6">
        <label className="block text-lg font-semibold text-blue-900 mb-3">My Ongoing Commitments</label>
        <p className="text-sm text-blue-700 mb-4">What practices will you continue?</p>
        <div className="space-y-3">
          {data.commitments.map((commitment, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="flex-shrink-0 text-blue-600 font-bold mt-3">✓</span>
              <input
                type="text"
                value={commitment}
                onChange={(e) => handleUpdateCommitment(idx, e.target.value)}
                placeholder="I commit to..."
                className="flex-1 p-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              />
              {data.commitments.length > 1 && (
                <button
                  onClick={() => handleRemoveCommitment(idx)}
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
            onClick={handleAddCommitment}
            className="w-full py-3 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-blue-600 font-semibold text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Commitment
          </button>
        </div>
      </div>

      {/* Rituals to Maintain */}
      <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-300 rounded-xl p-6">
        <label className="block text-lg font-semibold text-green-900 mb-3">Rituals to Maintain</label>
        <p className="text-sm text-green-700 mb-4">Which daily/weekly practices will you keep?</p>
        <div className="space-y-3">
          {data.rituals_to_maintain.map((ritual, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="flex-shrink-0 text-green-600 font-bold mt-3">🔄</span>
              <input
                type="text"
                value={ritual}
                onChange={(e) => handleUpdateRitual(idx, e.target.value)}
                placeholder="Daily gratitude, weekly journaling, morning meditation..."
                className="flex-1 p-3 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
              />
              {data.rituals_to_maintain.length > 1 && (
                <button
                  onClick={() => handleRemoveRitual(idx)}
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
            onClick={handleAddRitual}
            className="w-full py-3 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-2 text-green-600 font-semibold text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Ritual
          </button>
        </div>
      </div>

      {/* Final Reflections */}
      <div className="bg-white rounded-xl border-2 border-purple-200 p-6 shadow-md">
        <label className="block text-lg font-semibold text-gray-900 mb-3">Final Reflections</label>
        <textarea
          value={data.final_reflections}
          onChange={(e) => handleUpdateField('final_reflections', e.target.value)}
          placeholder="What does completing this journey mean to you? How do you feel?"
          rows={8}
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-y"
          style={{ fontFamily: 'Georgia, serif', lineHeight: '1.8' }}
        />
      </div>

      {/* Celebration Plan */}
      <div className="bg-gradient-to-br from-pink-50 to-white border-2 border-pink-300 rounded-xl p-6">
        <label className="block text-lg font-semibold text-pink-900 mb-3">How Will You Celebrate?</label>
        <textarea
          value={data.celebration_plan}
          onChange={(e) => handleUpdateField('celebration_plan', e.target.value)}
          placeholder="Plan a meaningful way to honor this achievement..."
          rows={4}
          className="w-full p-4 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none resize-y bg-white"
        />
      </div>

      {/* Inspirational Close */}
      <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 border-2 border-purple-300 rounded-xl p-8 text-center">
        <p className="text-2xl font-bold text-gray-900 mb-4">
          "The journey doesn't end here - it begins."
        </p>
        <p className="text-gray-700 max-w-2xl mx-auto">
          You've built the foundation. Now it&apos;s time to live what you've learned,
          continue manifesting your dreams, and trust the unfolding of your unique path.
        </p>
        <div className="text-4xl mt-6">🌟 ✨ 🎊</div>
      </div>
    </div>
  )
}
