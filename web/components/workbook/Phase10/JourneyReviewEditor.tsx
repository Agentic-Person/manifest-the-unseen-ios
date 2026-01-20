'use client'

export interface PhaseSummary {
  phase_number: number
  key_insights: string[]
  biggest_breakthrough: string
  challenges_overcome: string
}

export interface JourneyReviewData {
  phase_summaries: PhaseSummary[]
  overall_transformation: string
  biggest_surprise: string
  newfound_strengths: string[]
}

export interface JourneyReviewEditorProps {
  data: JourneyReviewData
  onChange: (data: JourneyReviewData) => void
  className?: string
}

const PHASE_NAMES = [
  'Self-Evaluation',
  'Values & Vision',
  'Goal Setting',
  'Facing Fears',
  'Self-Love & Self-Care',
  'Manifestation Techniques',
  'Practicing Gratitude',
  'Turning Envy Into Inspiration',
  'Trust & Surrender',
  'Trust & Letting Go',
]

export function JourneyReviewEditor({ data, onChange, className = '' }: JourneyReviewEditorProps) {
  const handleUpdatePhaseSummary = (phaseNum: number, field: keyof Omit<PhaseSummary, 'key_insights'>, value: string) => {
    const summaries = [...data.phase_summaries]
    const index = summaries.findIndex(s => s.phase_number === phaseNum)

    if (index >= 0) {
      summaries[index] = { ...summaries[index], [field]: value }
    } else {
      summaries.push({
        phase_number: phaseNum,
        key_insights: [''],
        biggest_breakthrough: field === 'biggest_breakthrough' ? value : '',
        challenges_overcome: field === 'challenges_overcome' ? value : '',
      })
    }

    onChange({ ...data, phase_summaries: summaries.sort((a, b) => a.phase_number - b.phase_number) })
  }

  const handleAddInsight = (phaseNum: number) => {
    const summaries = [...data.phase_summaries]
    const index = summaries.findIndex(s => s.phase_number === phaseNum)

    if (index >= 0) {
      summaries[index].key_insights.push('')
    } else {
      summaries.push({
        phase_number: phaseNum,
        key_insights: [''],
        biggest_breakthrough: '',
        challenges_overcome: '',
      })
    }

    onChange({ ...data, phase_summaries: summaries.sort((a, b) => a.phase_number - b.phase_number) })
  }

  const handleUpdateInsight = (phaseNum: number, insightIndex: number, value: string) => {
    const summaries = [...data.phase_summaries]
    const index = summaries.findIndex(s => s.phase_number === phaseNum)

    if (index >= 0) {
      summaries[index].key_insights[insightIndex] = value
      onChange({ ...data, phase_summaries: summaries })
    }
  }

  const handleAddStrength = () => {
    onChange({ ...data, newfound_strengths: [...data.newfound_strengths, ''] })
  }

  const handleUpdateStrength = (index: number, value: string) => {
    const strengths = [...data.newfound_strengths]
    strengths[index] = value
    onChange({ ...data, newfound_strengths: strengths })
  }

  const getPhaseSummary = (phaseNum: number): PhaseSummary => {
    return data.phase_summaries.find(s => s.phase_number === phaseNum) || {
      phase_number: phaseNum,
      key_insights: [''],
      biggest_breakthrough: '',
      challenges_overcome: '',
    }
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="bg-elevated border border-[rgba(196,160,82,0.2)] rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-enlightened mb-1">Review Your Journey</h4>
            <p className="text-sm text-muted-wisdom">
              Reflect on your entire manifestation journey. What have you learned? How have you grown? Celebrate your transformation.
            </p>
          </div>
        </div>
      </div>

      {/* Phase-by-Phase Review */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-enlightened">Phase-by-Phase Reflections</h3>

        {PHASE_NAMES.map((name, idx) => {
          const phaseNum = idx + 1
          const summary = getPhaseSummary(phaseNum)

          return (
            <div key={phaseNum} className="bg-elevated rounded-xl border-2 border-[rgba(196,160,82,0.2)] p-6">
              <h4 className="text-lg font-semibold text-enlightened mb-4">
                Phase {phaseNum}: {name}
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-muted-wisdom mb-2">Key Insights</label>
                  {summary.key_insights.map((insight, insightIdx) => (
                    <input
                      key={insightIdx}
                      type="text"
                      value={insight}
                      onChange={(e) => handleUpdateInsight(phaseNum, insightIdx, e.target.value)}
                      placeholder="What did you learn?"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none mb-2"
                    />
                  ))}
                  <button
                    onClick={() => handleAddInsight(phaseNum)}
                    className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    + Add Insight
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-wisdom mb-2">Biggest Breakthrough</label>
                  <textarea
                    value={summary.biggest_breakthrough}
                    onChange={(e) => handleUpdatePhaseSummary(phaseNum, 'biggest_breakthrough', e.target.value)}
                    placeholder="What was your biggest aha moment?"
                    rows={2}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-y"
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Overall Transformation */}
      <div className="bg-elevated border-2 border-green-300 rounded-xl p-6">
        <label className="block text-lg font-semibold text-enlightened mb-3">Overall Transformation</label>
        <textarea
          value={data.overall_transformation}
          onChange={(e) => onChange({ ...data, overall_transformation: e.target.value })}
          placeholder="How have you transformed through this journey?"
          rows={5}
          className="w-full p-4 border-2 border-heart-emerald rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none resize-y bg-elevated"
        />
      </div>

      {/* Biggest Surprise */}
      <div className="bg-elevated border-2 border-yellow-300 rounded-xl p-6">
        <label className="block text-lg font-semibold text-enlightened mb-3">Biggest Surprise</label>
        <textarea
          value={data.biggest_surprise}
          onChange={(e) => onChange({ ...data, biggest_surprise: e.target.value })}
          placeholder="What surprised you most about this journey?"
          rows={3}
          className="w-full p-4 border-2 border-aged-gold rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none resize-y bg-elevated"
        />
      </div>

      {/* Newfound Strengths */}
      <div className="bg-elevated border-2 border-blue-300 rounded-xl p-6">
        <label className="block text-lg font-semibold text-enlightened mb-3">Newfound Strengths</label>
        {data.newfound_strengths.map((strength, idx) => (
          <input
            key={idx}
            type="text"
            value={strength}
            onChange={(e) => handleUpdateStrength(idx, e.target.value)}
            placeholder="A strength you've discovered..."
            className="w-full p-3 border-2 border-[rgba(196,160,82,0.2)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-2 bg-elevated"
          />
        ))}
        <button
          onClick={handleAddStrength}
          className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
        >
          + Add Strength
        </button>
      </div>
    </div>
  )
}
