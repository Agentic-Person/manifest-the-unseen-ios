'use client'

export interface ThreeSixNineData {
  morning: string[]
  afternoon: string[]
  evening: string[]
}

export interface ThreeSixNineEditorProps {
  data: ThreeSixNineData
  onChange: (data: ThreeSixNineData) => void
  className?: string
}

export function ThreeSixNineEditor({ data, onChange, className = '' }: ThreeSixNineEditorProps) {
  const updateSection = (section: keyof ThreeSixNineData, index: number, value: string) => {
    const newData = { ...data }
    newData[section][index] = value
    onChange(newData)
  }

  const initializeData = () => {
    if (data.morning.length === 0) {
      onChange({
        morning: ['', '', ''],
        afternoon: ['', '', '', '', '', ''],
        evening: ['', '', '', '', '', '', '', '', ''],
      })
    }
  }

  React.useEffect(() => {
    initializeData()
  }, [])

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-purple-900 mb-1">The 3-6-9 Method</h4>
        <p className="text-sm text-purple-800">Write your manifestation affirmation 3 times in the morning, 6 times in the afternoon, and 9 times in the evening.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl border-2 border-yellow-200 p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4">Morning (3x)</h3>
          {[0, 1, 2].map((i) => (
            <textarea
              key={i}
              value={data.morning[i] || ''}
              onChange={(e) => updateSection('morning', i, e.target.value)}
              placeholder={`Affirmation ${i + 1}`}
              rows={3}
              className="w-full p-3 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          ))}
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl border-2 border-orange-200 p-6">
          <h3 className="text-lg font-semibold text-orange-900 mb-4">Afternoon (6x)</h3>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <textarea
              key={i}
              value={data.afternoon[i] || ''}
              onChange={(e) => updateSection('afternoon', i, e.target.value)}
              placeholder={`Affirmation ${i + 1}`}
              rows={2}
              className="w-full p-2 border rounded-lg mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          ))}
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border-2 border-purple-200 p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-4">Evening (9x)</h3>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <textarea
              key={i}
              value={data.evening[i] || ''}
              onChange={(e) => updateSection('evening', i, e.target.value)}
              placeholder={`Affirmation ${i + 1}`}
              rows={2}
              className="w-full p-2 border rounded-lg mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

import React from 'react'
