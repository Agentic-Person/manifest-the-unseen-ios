'use client'

import { Slider } from '@/components/ui/Slider'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

export interface WheelOfLifeData {
  career: number
  health: number
  relationships: number
  finance: number
  personalGrowth: number
  family: number
  recreation: number
  spirituality: number
}

export interface WheelOfLifeEditorProps {
  data: WheelOfLifeData
  onChange: (data: WheelOfLifeData) => void
  className?: string
}

const LIFE_AREAS = [
  { key: 'career' as const, label: 'Career', color: '#8b5cf6' },
  { key: 'health' as const, label: 'Health & Fitness', color: '#10b981' },
  { key: 'relationships' as const, label: 'Relationships', color: '#ef4444' },
  { key: 'finance' as const, label: 'Finance', color: '#f59e0b' },
  { key: 'personalGrowth' as const, label: 'Personal Growth', color: '#3b82f6' },
  { key: 'family' as const, label: 'Family & Friends', color: '#ec4899' },
  { key: 'recreation' as const, label: 'Fun & Recreation', color: '#14b8a6' },
  { key: 'spirituality' as const, label: 'Spirituality', color: '#a855f7' },
]

/**
 * Wheel of Life Editor - Interactive radar chart with 8 life area sliders.
 *
 * Visualizes life satisfaction across 8 key areas on a scale of 1-10.
 * Includes both interactive sliders and a beautiful radar chart visualization.
 *
 * @example
 * ```tsx
 * <WheelOfLifeEditor
 *   data={wheelData}
 *   onChange={(newData) => setWheelData(newData)}
 * />
 * ```
 */
export function WheelOfLifeEditor({ data, onChange, className = '' }: WheelOfLifeEditorProps) {
  const handleChange = (key: keyof WheelOfLifeData, value: number) => {
    onChange({ ...data, [key]: value })
  }

  // Prepare data for radar chart
  const chartData = LIFE_AREAS.map(area => ({
    area: area.label,
    value: data[area.key],
    fullMark: 10,
  }))

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Radar Chart Visualization */}
      <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-purple-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          Your Life Balance Wheel
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={chartData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="area"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              tickCount={6}
            />
            <Radar
              name="Satisfaction"
              dataKey="value"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.6}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
              formatter={(value: any) => [`${value}/10`, 'Score']}
            />
          </RadarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 text-center mt-4">
          A balanced wheel is round - aim for similar scores across all areas
        </p>
      </div>

      {/* Life Area Sliders */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Rate Your Satisfaction (1-10)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LIFE_AREAS.map(area => (
            <div key={area.key} className="space-y-2">
              <Slider
                value={data[area.key]}
                onChange={(value) => handleChange(area.key, value)}
                label={area.label}
                min={1}
                max={10}
                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-3">
          Your Life Balance Score
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {calculateAverage(data)}
            </p>
            <p className="text-sm text-gray-600">Average Score</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {getHighestArea(data)}
            </p>
            <p className="text-sm text-gray-600">Highest Area</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {getLowestArea(data)}
            </p>
            <p className="text-sm text-gray-600">Needs Attention</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {calculateBalance(data)}%
            </p>
            <p className="text-sm text-gray-600">Balance Score</p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              💡 Insight
            </h4>
            <p className="text-sm text-blue-800">
              {getInsight(data)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions
function calculateAverage(data: WheelOfLifeData): string {
  const values = Object.values(data)
  const sum = values.reduce((acc, val) => acc + val, 0)
  const avg = sum / values.length
  return avg.toFixed(1)
}

function getHighestArea(data: WheelOfLifeData): string {
  let max = 0
  let maxArea = ''
  LIFE_AREAS.forEach(area => {
    if (data[area.key] > max) {
      max = data[area.key]
      maxArea = area.label
    }
  })
  return maxArea || 'N/A'
}

function getLowestArea(data: WheelOfLifeData): string {
  let min = 11
  let minArea = ''
  LIFE_AREAS.forEach(area => {
    if (data[area.key] < min) {
      min = data[area.key]
      minArea = area.label
    }
  })
  return minArea || 'N/A'
}

function calculateBalance(data: WheelOfLifeData): number {
  const values = Object.values(data)
  const avg = values.reduce((acc, val) => acc + val, 0) / values.length

  // Calculate standard deviation
  const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length
  const stdDev = Math.sqrt(variance)

  // Convert to balance score (lower std dev = better balance)
  // Perfect balance (stdDev = 0) = 100%, high imbalance = lower %
  const balanceScore = Math.max(0, 100 - (stdDev * 20))
  return Math.round(balanceScore)
}

function getInsight(data: WheelOfLifeData): string {
  const avg = parseFloat(calculateAverage(data))
  const balance = calculateBalance(data)
  const lowest = getLowestArea(data)

  if (avg >= 8 && balance >= 80) {
    return "Excellent! You have both high satisfaction and great balance across your life areas. Keep nurturing all aspects of your life."
  } else if (avg >= 7 && balance < 60) {
    return `Your overall satisfaction is good, but there's significant imbalance. Consider giving more attention to ${lowest} to create a more rounded life.`
  } else if (avg < 6) {
    return `Your average score suggests some life areas need attention. Start by focusing on ${lowest} - small improvements here can have a big impact on your overall well-being.`
  } else if (balance >= 80) {
    return "You have great balance across your life! Focus on gradually increasing satisfaction in all areas together for holistic growth."
  }

  return "Your wheel shows areas of strength and opportunities for growth. Use this as a starting point to set goals for improvement."
}
