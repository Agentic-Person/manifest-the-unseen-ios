'use client'

export interface TrustLevels {
  self: number // 1-10
  universe: number
  process: number
  timing: number
}

export interface TrustReflections {
  where_I_resist: string
  where_I_control: string
  what_I_fear_letting_go: string
}

export interface TrustAssessmentData {
  trust_levels: TrustLevels
  reflections: TrustReflections
}

export interface TrustAssessmentEditorProps {
  data: TrustAssessmentData
  onChange: (data: TrustAssessmentData) => void
  className?: string
}

/**
 * Trust Assessment Editor - Assess trust levels across key areas
 *
 * Uses sliders to rate trust levels and reflective questions to explore resistance.
 *
 * @example
 * ```tsx
 * <TrustAssessmentEditor
 *   data={trustData}
 *   onChange={(newData) => setTrustData(newData)}
 * />
 * ```
 */
export function TrustAssessmentEditor({ data, onChange, className = '' }: TrustAssessmentEditorProps) {
  const handleTrustLevelChange = (key: keyof TrustLevels, value: number) => {
    onChange({
      ...data,
      trust_levels: {
        ...data.trust_levels,
        [key]: value,
      },
    })
  }

  const handleReflectionChange = (key: keyof TrustReflections, value: string) => {
    onChange({
      ...data,
      reflections: {
        ...data.reflections,
        [key]: value,
      },
    })
  }

  const getTrustColor = (level: number): string => {
    if (level <= 3) return 'bg-red-500'
    if (level <= 6) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getTrustLabel = (level: number): string => {
    if (level <= 3) return 'Low Trust'
    if (level <= 6) return 'Moderate Trust'
    return 'High Trust'
  }

  const averageTrust = Math.round(
    (data.trust_levels.self + data.trust_levels.universe + data.trust_levels.process + data.trust_levels.timing) / 4
  )

  const trustAreas = [
    { key: 'self' as const, label: 'Trust in Myself', description: 'My ability to handle whatever comes my way' },
    { key: 'universe' as const, label: 'Trust in the Universe', description: 'That things are unfolding as they should' },
    { key: 'process' as const, label: 'Trust in the Process', description: 'That the journey is as important as the destination' },
    { key: 'timing' as const, label: 'Trust in Divine Timing', description: 'That everything happens when it\'s meant to' },
  ]

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Introduction */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-indigo-900 mb-1">
              Assess Your Trust Levels
            </h4>
            <p className="text-sm text-indigo-800">
              Trust is the foundation of surrender. Honestly assess where you stand in these key areas,
              then explore what's holding you back from deeper trust.
            </p>
          </div>
        </div>
      </div>

      {/* Overall Trust Score */}
      {averageTrust > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-6 text-center">
          <div className="text-5xl font-bold text-purple-600 mb-2">{averageTrust}/10</div>
          <p className="text-lg font-semibold text-purple-900">{getTrustLabel(averageTrust)}</p>
          <p className="text-sm text-purple-700 mt-1">Overall Trust Level</p>
        </div>
      )}

      {/* Trust Level Sliders */}
      <div className="bg-white rounded-xl border-2 border-indigo-200 p-6 shadow-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Rate Your Trust Levels</h3>
        <div className="space-y-8">
          {trustAreas.map((area) => {
            const level = data.trust_levels[area.key]
            return (
              <div key={area.key} className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-800">{area.label}</h4>
                    <p className="text-sm text-gray-600">{area.description}</p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <div className={`px-4 py-2 rounded-full font-bold text-white ${getTrustColor(level)}`}>
                      {level}/10
                    </div>
                  </div>
                </div>

                {/* Slider */}
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={level}
                    onChange={(e) => handleTrustLevelChange(area.key, parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, ${
                        level <= 3 ? '#ef4444' : level <= 6 ? '#eab308' : '#22c55e'
                      } 0%, ${
                        level <= 3 ? '#ef4444' : level <= 6 ? '#eab308' : '#22c55e'
                      } ${(level / 10) * 100}%, #e5e7eb ${(level / 10) * 100}%, #e5e7eb 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reflective Questions */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Exploring Resistance</h3>

        {/* Where I Resist */}
        <div className="bg-white rounded-xl border-2 border-orange-200 p-6">
          <label className="block text-sm font-semibold text-orange-900 mb-2">
            Where do I resist trusting?
          </label>
          <textarea
            value={data.reflections.where_I_resist}
            onChange={(e) => handleReflectionChange('where_I_resist', e.target.value)}
            placeholder="What situations, people, or outcomes do I struggle to trust?"
            rows={4}
            className="w-full p-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y"
          />
        </div>

        {/* Where I Control */}
        <div className="bg-white rounded-xl border-2 border-red-200 p-6">
          <label className="block text-sm font-semibold text-red-900 mb-2">
            Where do I try to control outcomes?
          </label>
          <textarea
            value={data.reflections.where_I_control}
            onChange={(e) => handleReflectionChange('where_I_control', e.target.value)}
            placeholder="What am I holding onto too tightly? Where am I micromanaging?"
            rows={4}
            className="w-full p-3 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-y"
          />
        </div>

        {/* What I Fear Letting Go */}
        <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
          <label className="block text-sm font-semibold text-purple-900 mb-2">
            What am I afraid will happen if I let go?
          </label>
          <textarea
            value={data.reflections.what_I_fear_letting_go}
            onChange={(e) => handleReflectionChange('what_I_fear_letting_go', e.target.value)}
            placeholder="What's the worst-case scenario I&apos;m trying to prevent?"
            rows={4}
            className="w-full p-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
          />
        </div>
      </div>

      {/* Trust Building Tips */}
      <div className="bg-gradient-to-br from-teal-50 to-white border border-teal-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-teal-900 mb-4">Building Trust</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-teal-600 font-bold">•</span>
            <span><strong>Start small:</strong> Practice trusting in low-stakes situations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-600 font-bold">•</span>
            <span><strong>Look for evidence:</strong> Recall times when things worked out</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-600 font-bold">•</span>
            <span><strong>Release attachment:</strong> Focus on effort, not outcomes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-600 font-bold">•</span>
            <span><strong>Trust yourself first:</strong> Self-trust is the foundation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-600 font-bold">•</span>
            <span><strong>Practice patience:</strong> Trust grows over time</span>
          </li>
        </ul>
      </div>

      {/* Quote */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 text-center">
        <p className="text-lg italic text-gray-800 mb-2">
          "Trust the timing of your life."
        </p>
        <p className="text-sm text-gray-600">
          What's meant for you will not pass you by.
        </p>
      </div>
    </div>
  )
}
