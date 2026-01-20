'use client'

export interface ABCModelData {
  activatingEvent: string
  belief: string
  consequence: string
}

export interface ABCModelEditorProps {
  data: ABCModelData
  onChange: (data: ABCModelData) => void
  className?: string
}

/**
 * ABC Model Editor - Cognitive Behavioral Therapy pattern analyzer.
 *
 * Helps users understand how Activating events trigger Beliefs that lead to Consequences.
 * Based on Albert Ellis's Rational Emotive Behavior Therapy (REBT) framework.
 *
 * @example
 * ```tsx
 * <ABCModelEditor
 *   data={abcData}
 *   onChange={(newData) => setABCData(newData)}
 * />
 * ```
 */
export function ABCModelEditor({ data, onChange, className = '' }: ABCModelEditorProps) {
  const handleChange = (field: keyof ABCModelData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Info Box - ABC Model Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Understanding the ABC Model
            </h3>
            <p className="text-sm text-blue-800 mb-3">
              The ABC Model reveals how your thoughts shape your emotions and behaviors.
              It&apos;s not the events themselves that upset us, but our beliefs about those events.
            </p>
            <div className="space-y-1 text-sm text-blue-800">
              <p><strong className="font-semibold">A - Activating Event:</strong> What happened? (the trigger)</p>
              <p><strong className="font-semibold">B - Belief:</strong> What did you tell yourself about it?</p>
              <p><strong className="font-semibold">C - Consequence:</strong> How did you feel or behave as a result?</p>
            </div>
          </div>
        </div>
      </div>

      {/* ABC Flow - Visual representation */}
      <div className="space-y-6">
        {/* A - Activating Event */}
        <div className="relative">
          <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-6 border-2 border-red-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                A
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Activating Event
              </h3>
            </div>
            <label htmlFor="activating-event" className="block text-sm font-medium text-gray-700 mb-2">
              Describe the situation or trigger (be specific and objective)
            </label>
            <textarea
              id="activating-event"
              value={data.activatingEvent}
              onChange={(e) => handleChange('activatingEvent', e.target.value)}
              placeholder="Example: My friend didn't reply to my text message for 2 days..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none text-gray-900 placeholder-gray-400"
            />
            <p className="text-xs text-gray-500 mt-2">
              Tip: Stick to the facts - what would a video camera capture?
            </p>
          </div>

          {/* Arrow Down */}
          <div className="flex justify-center my-3">
            <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M12 16v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* B - Belief */}
        <div className="relative">
          <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl p-6 border-2 border-yellow-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                B
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Belief
              </h3>
            </div>
            <label htmlFor="belief" className="block text-sm font-medium text-gray-700 mb-2">
              What did you tell yourself about this event? (your interpretation, thoughts, self-talk)
            </label>
            <textarea
              id="belief"
              value={data.belief}
              onChange={(e) => handleChange('belief', e.target.value)}
              placeholder="Example: They must be ignoring me. They don&apos;t value our friendship. I must have done something wrong..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none text-gray-900 placeholder-gray-400"
            />
            <p className="text-xs text-gray-500 mt-2">
              Tip: Listen to your inner dialogue - what story are you telling yourself?
            </p>
          </div>

          {/* Arrow Down */}
          <div className="flex justify-center my-3">
            <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M12 16v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* C - Consequence */}
        <div className="relative">
          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border-2 border-green-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                C
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Consequence
              </h3>
            </div>
            <label htmlFor="consequence" className="block text-sm font-medium text-gray-700 mb-2">
              How did you feel and behave as a result? (emotions and actions)
            </label>
            <textarea
              id="consequence"
              value={data.consequence}
              onChange={(e) => handleChange('consequence', e.target.value)}
              placeholder="Example: I felt anxious and hurt. I avoided reaching out to them and withdrew from other friendships too..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-gray-900 placeholder-gray-400"
            />
            <p className="text-xs text-gray-500 mt-2">
              Tip: Include both feelings (anxious, sad, angry) and behaviors (what you did or didn't do)
            </p>
          </div>
        </div>
      </div>

      {/* Insight Box */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-purple-900 mb-1">
              Key Insight
            </h4>
            <p className="text-sm text-purple-800">
              Once you identify the pattern (A → B → C), you can challenge and change your beliefs (B) to create better consequences (C).
              The power is in recognizing that it&apos;s your interpretation, not the event itself, that drives your emotional response.
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      {data.activatingEvent && data.belief && data.consequence && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">
              Great work! You've completed your ABC analysis. This awareness is the first step toward positive change.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
