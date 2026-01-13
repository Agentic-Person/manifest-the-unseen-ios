'use client'

import { useState } from 'react'

export interface ComfortZoneData {
  comfortZone: string[]      // Things in comfort zone
  stretchZone: string[]      // Things in stretch zone
  panicZone: string[]        // Things in panic zone
}

export interface ComfortZoneEditorProps {
  data: ComfortZoneData
  onChange: (data: ComfortZoneData) => void
  className?: string
}

type ZoneType = 'comfortZone' | 'stretchZone' | 'panicZone'

interface ZoneItem {
  id: string
  text: string
}

const ZONE_CONFIG = {
  comfortZone: {
    label: 'Comfort Zone',
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    textColor: 'text-green-900',
    badgeColor: 'bg-green-100',
    description: 'Activities you feel completely safe and confident doing',
    placeholder: 'e.g., Daily routine, familiar tasks...',
  },
  stretchZone: {
    label: 'Stretch Zone',
    color: 'yellow',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
    textColor: 'text-yellow-900',
    badgeColor: 'bg-yellow-100',
    description: 'Activities that challenge you but are achievable with effort',
    placeholder: 'e.g., Public speaking, learning new skills...',
  },
  panicZone: {
    label: 'Panic Zone',
    color: 'red',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    textColor: 'text-red-900',
    badgeColor: 'bg-red-100',
    description: 'Activities that feel overwhelming and cause significant anxiety',
    placeholder: 'e.g., Extreme risks, major life changes...',
  },
} as const

/**
 * ComfortZoneEditor - Interactive visualization of comfort, stretch, and panic zones.
 *
 * Helps users identify activities in each zone to understand where growth opportunities exist.
 * The stretch zone is where personal growth happens.
 *
 * @example
 * ```tsx
 * <ComfortZoneEditor
 *   data={comfortZoneData}
 *   onChange={(newData) => setComfortZoneData(newData)}
 * />
 * ```
 */
export function ComfortZoneEditor({ data, onChange, className = '' }: ComfortZoneEditorProps) {
  const [newItems, setNewItems] = useState<Record<ZoneType, string>>({
    comfortZone: '',
    stretchZone: '',
    panicZone: '',
  })

  const handleAddItem = (zone: ZoneType) => {
    const text = newItems[zone].trim()
    if (!text) return

    onChange({
      ...data,
      [zone]: [...data[zone], text],
    })

    setNewItems({ ...newItems, [zone]: '' })
  }

  const handleRemoveItem = (zone: ZoneType, index: number) => {
    onChange({
      ...data,
      [zone]: data[zone].filter((_, i) => i !== index),
    })
  }

  const handleMoveItem = (fromZone: ZoneType, toZone: ZoneType, index: number) => {
    const item = data[fromZone][index]
    onChange({
      ...data,
      [fromZone]: data[fromZone].filter((_, i) => i !== index),
      [toZone]: [...data[toZone], item],
    })
  }

  const handleKeyDown = (zone: ZoneType, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddItem(zone)
    }
  }

  const renderZoneCard = (zone: ZoneType) => {
    const config = ZONE_CONFIG[zone]
    const items = data[zone]

    return (
      <div
        key={zone}
        className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl p-6 space-y-4`}
      >
        {/* Zone Header */}
        <div className="text-center mb-4">
          <h3 className={`text-xl font-bold ${config.textColor} mb-2`}>
            {config.label}
          </h3>
          <p className="text-sm text-gray-600">{config.description}</p>
        </div>

        {/* Items List */}
        <div className="space-y-2 min-h-[120px]">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No items yet. Add activities below.
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={`${zone}-${index}`}
                className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 group hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <p className="text-gray-800">{item}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Move buttons */}
                    {zone !== 'comfortZone' && (
                      <button
                        type="button"
                        onClick={() => handleMoveItem(zone, zone === 'stretchZone' ? 'comfortZone' : 'stretchZone', index)}
                        className="p-1 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        title={`Move to ${zone === 'stretchZone' ? 'Comfort' : 'Stretch'} Zone`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}
                    {zone !== 'panicZone' && (
                      <button
                        type="button"
                        onClick={() => handleMoveItem(zone, zone === 'comfortZone' ? 'stretchZone' : 'panicZone', index)}
                        className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title={`Move to ${zone === 'comfortZone' ? 'Stretch' : 'Panic'} Zone`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(zone, index)}
                      className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Item Input */}
        <div className="pt-2 border-t border-gray-300">
          <div className="flex gap-2">
            <input
              type="text"
              value={newItems[zone]}
              onChange={(e) => setNewItems({ ...newItems, [zone]: e.target.value })}
              onKeyDown={(e) => handleKeyDown(zone, e)}
              placeholder={config.placeholder}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => handleAddItem(zone)}
              disabled={!newItems[zone].trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>
        </div>

        {/* Item Count Badge */}
        <div className="flex justify-center pt-2">
          <span className={`${config.badgeColor} ${config.textColor} text-xs font-semibold px-3 py-1 rounded-full`}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Introduction */}
      <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-purple-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          Understanding Your Zones
        </h3>
        <div className="space-y-2 text-gray-700">
          <p>
            <strong className="text-green-700">Comfort Zone:</strong> Where you feel safe and confident.
            This is your baseline - familiar and easy activities.
          </p>
          <p>
            <strong className="text-yellow-700">Stretch Zone:</strong> Where growth happens! These activities
            challenge you but are achievable with effort. This is your sweet spot for personal development.
          </p>
          <p>
            <strong className="text-red-700">Panic Zone:</strong> Activities that feel overwhelming.
            These may be too far outside your current capabilities and can cause excessive stress.
          </p>
        </div>
      </div>

      {/* Visual Representation */}
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          Concentric Zones Visualization
        </h3>
        <div className="relative max-w-2xl mx-auto aspect-square">
          {/* Panic Zone (outer) */}
          <div className="absolute inset-0 bg-red-100 rounded-full border-4 border-red-300 flex items-center justify-center">
            <span className="text-red-700 font-bold text-lg absolute top-8">Panic Zone</span>
          </div>
          {/* Stretch Zone (middle) */}
          <div className="absolute inset-[15%] bg-yellow-100 rounded-full border-4 border-yellow-300 flex items-center justify-center">
            <span className="text-yellow-700 font-bold text-lg absolute top-6">Stretch Zone</span>
          </div>
          {/* Comfort Zone (inner) */}
          <div className="absolute inset-[35%] bg-green-100 rounded-full border-4 border-green-300 flex items-center justify-center">
            <span className="text-green-700 font-bold text-base">Comfort Zone</span>
          </div>
        </div>
        <p className="text-center text-gray-600 mt-6 text-sm">
          Growth happens when you regularly step into your stretch zone
        </p>
      </div>

      {/* Zone Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderZoneCard('comfortZone')}
        {renderZoneCard('stretchZone')}
        {renderZoneCard('panicZone')}
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
              Growth Insight
            </h4>
            <p className="text-sm text-blue-800">
              {getInsight(data)}
            </p>
          </div>
        </div>
      </div>

      {/* Action Tips */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-3">
          Tips for Using Your Zones
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold">1.</span>
            <span>Identify activities in each zone to understand where you currently are</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold">2.</span>
            <span>Set goals to gradually move items from stretch zone to comfort zone</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold">3.</span>
            <span>Avoid spending too much time in panic zone - break those items into smaller stretch zone steps</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold">4.</span>
            <span>Regularly challenge yourself with stretch zone activities for continuous growth</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

// Helper function for insights
function getInsight(data: ComfortZoneData): string {
  const comfortCount = data.comfortZone.length
  const stretchCount = data.stretchZone.length
  const panicCount = data.panicZone.length

  if (stretchCount === 0 && comfortCount > 0) {
    return "You've identified your comfort zone - great start! Now add some stretch zone activities to identify growth opportunities. Remember, growth happens outside your comfort zone."
  } else if (stretchCount > comfortCount && stretchCount > 3) {
    return "Excellent! You've identified many stretch zone activities. These are your growth opportunities. Pick 1-2 to focus on this month and gradually expand your comfort zone."
  } else if (panicCount > stretchCount + comfortCount) {
    return "Many items are in your panic zone. Consider breaking these down into smaller, more manageable stretch zone steps. What's one small action you could take toward a panic zone item?"
  } else if (stretchCount >= 3 && panicCount === 0) {
    return "Well-balanced! You have clear stretch goals without overwhelming panic zone items. Focus on gradually mastering your stretch zone activities."
  } else if (comfortCount > 5 && stretchCount < 2) {
    return "You're very comfortable in your current zone. Challenge yourself by identifying 3-5 stretch zone activities to promote growth and development."
  }

  return "Understanding your zones is the first step to growth. Focus on your stretch zone - that's where the magic happens! Your comfort zone expands as you master new challenges."
}
