'use client'

import { Slider } from '@/components/ui/Slider'

export interface AbilitiesRatingData {
  abilities: Array<{
    name: string
    rating: number
  }>
}

export interface AbilitiesRatingEditorProps {
  data: AbilitiesRatingData
  onChange: (data: AbilitiesRatingData) => void
  className?: string
}

const DEFAULT_ABILITIES = [
  'Communication',
  'Problem Solving',
  'Leadership',
  'Creativity',
  'Technical Skills',
  'Time Management',
  'Emotional Intelligence',
  'Physical Fitness',
  'Financial Management',
  'Learning Ability',
  'Adaptability',
  'Organization',
]

/**
 * Abilities Rating Editor - Rate personal abilities on a scale of 1-10.
 *
 * Helps users assess their strengths and areas for improvement across
 * 12 core abilities that impact success and personal development.
 *
 * @example
 * ```tsx
 * <AbilitiesRatingEditor
 *   data={abilitiesData}
 *   onChange={(newData) => setAbilitiesData(newData)}
 * />
 * ```
 */
export function AbilitiesRatingEditor({ data, onChange, className = '' }: AbilitiesRatingEditorProps) {
  // Ensure all default abilities are present
  const ensureAbilities = (current: AbilitiesRatingData): AbilitiesRatingData => {
    const existingNames = new Set(current.abilities.map(a => a.name))
    const missingAbilities = DEFAULT_ABILITIES
      .filter(name => !existingNames.has(name))
      .map(name => ({ name, rating: 5 }))

    return {
      abilities: [...current.abilities, ...missingAbilities],
    }
  }

  const currentData = ensureAbilities(data)

  const handleRatingChange = (abilityName: string, newRating: number) => {
    const updatedAbilities = currentData.abilities.map(ability =>
      ability.name === abilityName
        ? { ...ability, rating: newRating }
        : ability
    )
    onChange({ abilities: updatedAbilities })
  }

  const getRatingColor = (rating: number): string => {
    if (rating < 4) return 'text-red-600'
    if (rating <= 7) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getRatingLabel = (rating: number): string => {
    if (rating <= 2) return 'Needs Development'
    if (rating <= 4) return 'Below Average'
    if (rating <= 6) return 'Average'
    if (rating <= 8) return 'Good'
    return 'Excellent'
  }

  // Calculate statistics
  const calculateAverage = (): string => {
    const sum = currentData.abilities.reduce((acc, a) => acc + a.rating, 0)
    const avg = sum / currentData.abilities.length
    return avg.toFixed(1)
  }

  const getHighestAbility = (): string => {
    let max = 0
    let maxAbility = ''
    currentData.abilities.forEach(ability => {
      if (ability.rating > max) {
        max = ability.rating
        maxAbility = ability.name
      }
    })
    return maxAbility || 'N/A'
  }

  const getLowestAbility = (): string => {
    let min = 11
    let minAbility = ''
    currentData.abilities.forEach(ability => {
      if (ability.rating < min) {
        min = ability.rating
        minAbility = ability.name
      }
    })
    return minAbility || 'N/A'
  }

  const getStrongAbilities = (): string[] => {
    return currentData.abilities
      .filter(a => a.rating >= 8)
      .map(a => a.name)
  }

  const getDevelopmentAbilities = (): string[] => {
    return currentData.abilities
      .filter(a => a.rating < 4)
      .map(a => a.name)
  }

  const getInsight = (): string => {
    const avg = parseFloat(calculateAverage())
    const strongCount = getStrongAbilities().length
    const weakCount = getDevelopmentAbilities().length

    if (avg >= 8) {
      return "Outstanding! You have strong abilities across the board. Focus on maintaining these strengths while continuing to challenge yourself in new areas."
    } else if (strongCount >= 4) {
      return `You have ${strongCount} strong abilities - these are your superpowers! Consider how you can leverage these strengths to improve other areas.`
    } else if (weakCount >= 3) {
      return `You've identified ${weakCount} areas that need development. This self-awareness is powerful - pick one ability to focus on first and create a concrete improvement plan.`
    } else if (avg >= 6) {
      return "Your abilities are well-balanced. Look for opportunities to transform 'good' abilities into 'excellent' ones through deliberate practice."
    }

    return "This assessment reveals your current ability landscape. Focus on consistent improvement in 1-2 areas at a time for sustainable growth."
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Introduction */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">
          Rate Your Abilities
        </h3>
        <p className="text-purple-800 text-sm">
          Assess your current proficiency in each ability from 1 (needs significant development) to 10 (mastery level).
          Be honest with yourself - this assessment helps identify both your strengths and growth opportunities.
        </p>
      </div>

      {/* Ability Sliders */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Your Abilities Assessment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentData.abilities.map(ability => (
            <div key={ability.name} className="space-y-2">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <Slider
                  value={ability.rating}
                  onChange={(value) => handleRatingChange(ability.name, value)}
                  label={ability.name}
                  min={1}
                  max={10}
                />
                <div className="mt-2 flex justify-between items-center text-xs">
                  <span className={`font-medium ${getRatingColor(ability.rating)}`}>
                    {getRatingLabel(ability.rating)}
                  </span>
                  <span className="text-gray-500">
                    {ability.rating}/10
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">
          Your Abilities Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center border border-purple-100">
            <p className="text-3xl font-bold text-purple-600 mb-1">
              {calculateAverage()}
            </p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-purple-100">
            <p className="text-lg font-bold text-green-600 mb-1 truncate">
              {getHighestAbility()}
            </p>
            <p className="text-sm text-gray-600">Top Strength</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-purple-100">
            <p className="text-lg font-bold text-red-600 mb-1 truncate">
              {getLowestAbility()}
            </p>
            <p className="text-sm text-gray-600">Growth Opportunity</p>
          </div>
        </div>
      </div>

      {/* Strengths and Development Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="text-lg font-semibold text-green-900">
              Your Strengths
            </h4>
          </div>
          {getStrongAbilities().length > 0 ? (
            <ul className="space-y-2">
              {getStrongAbilities().map(ability => (
                <li key={ability} className="text-sm text-green-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  {ability}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-green-700">
              No abilities rated 8 or higher yet. Keep developing your skills!
            </p>
          )}
        </div>

        {/* Development Areas */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h4 className="text-lg font-semibold text-orange-900">
              Development Areas
            </h4>
          </div>
          {getDevelopmentAbilities().length > 0 ? (
            <ul className="space-y-2">
              {getDevelopmentAbilities().map(ability => (
                <li key={ability} className="text-sm text-orange-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                  {ability}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-orange-700">
              Great! No critical development areas identified. Focus on elevating good abilities to great.
            </p>
          )}
        </div>
      </div>

      {/* Insight */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              Insight
            </h4>
            <p className="text-sm text-blue-800">
              {getInsight()}
            </p>
          </div>
        </div>
      </div>

      {/* Action Prompt */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          Next Steps
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold mt-0.5">1.</span>
            <span>Choose 1-2 abilities you want to improve in the next 90 days</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold mt-0.5">2.</span>
            <span>Identify specific actions you can take to develop these abilities</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold mt-0.5">3.</span>
            <span>Consider how your strengths can support your development areas</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
