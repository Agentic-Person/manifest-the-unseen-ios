'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/Slider'

export interface EmotionEntry {
  id: string
  emotion: string
  category: string
  intensity: number
  timestamp: string
  notes?: string
}

export interface FeelWheelData {
  selectedEmotions: EmotionEntry[]
}

export interface FeelWheelEditorProps {
  data: FeelWheelData
  onChange: (data: FeelWheelData) => void
  className?: string
}

// Emotion categories with simplified emotions
const EMOTION_CATEGORIES = [
  {
    name: 'Joy',
    color: 'from-sacral-orange to-aged-gold',
    borderColor: 'border-aged-gold',
    bgColor: 'bg-[rgba(196,160,82,0.1)]',
    textColor: 'text-enlightened',
    emotions: ['Happy', 'Excited', 'Content', 'Peaceful', 'Grateful'],
  },
  {
    name: 'Sadness',
    color: 'from-deep-teal to-deep-teal',
    borderColor: 'border-[rgba(196,160,82,0.15)]',
    bgColor: 'bg-elevated',
    textColor: 'text-enlightened',
    emotions: ['Sad', 'Lonely', 'Disappointed', 'Hurt'],
  },
  {
    name: 'Anger',
    color: 'from-burgundy to-burgundy',
    borderColor: 'border-burgundy',
    bgColor: 'bg-[rgba(107,45,61,0.1)]',
    textColor: 'text-enlightened',
    emotions: ['Angry', 'Frustrated', 'Irritated', 'Annoyed'],
  },
  {
    name: 'Fear',
    color: 'from-crown-purple to-crown-purple',
    borderColor: 'border-[rgba(196,160,82,0.15)]',
    bgColor: 'bg-elevated',
    textColor: 'text-enlightened',
    emotions: ['Anxious', 'Worried', 'Scared', 'Nervous'],
  },
  {
    name: 'Surprise',
    color: 'from-deep-teal to-deep-teal',
    borderColor: 'border-deep-teal',
    bgColor: 'bg-[rgba(28,85,104,0.1)]',
    textColor: 'text-enlightened',
    emotions: ['Amazed', 'Confused', 'Curious'],
  },
  {
    name: 'Disgust',
    color: 'from-heart-emerald to-heart-emerald',
    borderColor: 'border-heart-emerald',
    bgColor: 'bg-[rgba(45,90,74,0.1)]',
    textColor: 'text-enlightened',
    emotions: ['Disgusted', 'Contempt'],
  },
]

/**
 * Feel Wheel Editor - Interactive emotion tracking with intensity ratings.
 *
 * Allows users to select emotions from predefined categories, rate their intensity,
 * and add optional notes. Displays a history of selected emotions.
 *
 * @example
 * ```tsx
 * <FeelWheelEditor
 *   data={feelWheelData}
 *   onChange={(newData) => setFeelWheelData(newData)}
 * />
 * ```
 */
export function FeelWheelEditor({ data, onChange, className = '' }: FeelWheelEditorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [intensity, setIntensity] = useState(5)
  const [notes, setNotes] = useState('')

  const handleEmotionSelect = (category: string, emotion: string) => {
    setSelectedCategory(category)
    setSelectedEmotion(emotion)
    setIntensity(5) // Reset to middle value
    setNotes('')
  }

  const handleAddEmotion = () => {
    if (!selectedEmotion || !selectedCategory) return

    const newEntry: EmotionEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      emotion: selectedEmotion,
      category: selectedCategory,
      intensity,
      timestamp: new Date().toISOString(),
      notes: notes.trim() || undefined,
    }

    onChange({
      selectedEmotions: [...data.selectedEmotions, newEntry],
    })

    // Reset form
    setSelectedEmotion(null)
    setSelectedCategory(null)
    setIntensity(5)
    setNotes('')
  }

  const handleRemoveEmotion = (id: string) => {
    onChange({
      selectedEmotions: data.selectedEmotions.filter(e => e.id !== id),
    })
  }

  const getCategoryData = (categoryName: string) => {
    return EMOTION_CATEGORIES.find(c => c.name === categoryName)
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Instructions */}
      <div className="bg-gradient-to-br from-elevated to-elevated rounded-xl p-6 border border-[rgba(196,160,82,0.15)]">
        <h3 className="text-xl font-semibold text-enlightened mb-3">
          The Feel Wheel
        </h3>
        <p className="text-muted-wisdom mb-4">
          Emotions are complex and nuanced. Use this wheel to identify and track your feelings with more precision. Select an emotion category, then choose a specific emotion and rate its intensity.
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-wisdom">
          <svg className="w-5 h-5 text-aged-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Click an emotion to select it, then rate how strongly you feel it (1-10)</span>
        </div>
      </div>

      {/* Emotion Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-enlightened">
          Select Your Emotions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EMOTION_CATEGORIES.map(category => (
            <div
              key={category.name}
              className={`p-4 rounded-lg border-2 ${category.borderColor} ${category.bgColor} transition-all hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]`}
            >
              <h4 className={`text-lg font-semibold ${category.textColor} mb-3 flex items-center gap-2`}>
                <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${category.color}`}></div>
                {category.name}
              </h4>
              <div className="space-y-2">
                {category.emotions.map(emotion => {
                  const isSelected = selectedEmotion === emotion && selectedCategory === category.name
                  return (
                    <button
                      key={emotion}
                      onClick={() => handleEmotionSelect(category.name, emotion)}
                      className={`
                        w-full text-left px-3 py-2 rounded-md transition-all
                        ${isSelected
                          ? `bg-gradient-to-r ${category.color} text-white font-semibold shadow-[0_4px_24px_rgba(0,0,0,0.4)]`
                          : `bg-temple-stone ${category.textColor} hover:bg-opacity-80 border border-[rgba(196,160,82,0.15)]`
                        }
                      `}
                    >
                      {emotion}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Intensity Selector - Shown when emotion is selected */}
      {selectedEmotion && selectedCategory && (
        <div className="bg-elevated rounded-xl p-6 border-2 border-[rgba(196,160,82,0.2)] shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <h3 className="text-lg font-semibold text-enlightened mb-4">
            How strongly do you feel <span className="text-aged-gold">{selectedEmotion}</span>?
          </h3>

          <div className="space-y-4">
            <Slider
              value={intensity}
              onChange={setIntensity}
              label="Intensity Level"
              min={1}
              max={10}
              className="mb-4"
            />

            <div className="space-y-2">
              <label htmlFor="emotion-notes" className="block text-sm font-medium text-muted-wisdom">
                Notes (optional)
              </label>
              <textarea
                id="emotion-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What triggered this emotion? Any context you want to remember..."
                className="w-full px-4 py-2 border border-[rgba(196,160,82,0.15)] rounded-lg focus:ring-2 focus:ring-aged-gold focus:border-aged-gold resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddEmotion}
                className="flex-1 bg-gradient-primary text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
              >
                Add Emotion
              </button>
              <button
                onClick={() => {
                  setSelectedEmotion(null)
                  setSelectedCategory(null)
                  setNotes('')
                }}
                className="px-6 py-3 border-2 border-[rgba(196,160,82,0.15)] text-muted-wisdom rounded-lg font-semibold hover:bg-elevated transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emotion History */}
      {data.selectedEmotions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-enlightened">
            Your Emotional Journey
          </h3>
          <div className="space-y-3">
            {data.selectedEmotions.slice().reverse().map(entry => {
              const categoryData = getCategoryData(entry.category)
              return (
                <div
                  key={entry.id}
                  className={`p-4 rounded-lg border-2 ${categoryData?.borderColor} ${categoryData?.bgColor} flex gap-4`}
                >
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${categoryData?.color}`}></div>
                      <span className={`font-semibold ${categoryData?.textColor}`}>
                        {entry.emotion}
                      </span>
                      <span className="text-sm text-tertiary-text">
                        ({entry.category})
                      </span>
                      <div className="flex items-center gap-1 ml-auto">
                        <svg className="w-4 h-4 text-tertiary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span className="font-bold text-muted-wisdom">{entry.intensity}/10</span>
                      </div>
                    </div>
                    {entry.notes && (
                      <p className="text-sm text-muted-wisdom mb-2 pl-6">
                        {entry.notes}
                      </p>
                    )}
                    <p className="text-xs text-tertiary-text pl-6">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveEmotion(entry.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-burgundy transition-colors"
                    aria-label="Remove emotion"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="bg-elevated border border-[rgba(196,160,82,0.15)] rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-deep-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-enlightened mb-1">
              Why Track Emotions?
            </h4>
            <p className="text-sm text-muted-wisdom">
              Emotional awareness is the first step to emotional intelligence. By naming and rating your emotions, you gain clarity about your inner experience. Over time, you'll notice patterns that can guide your personal growth and help you respond more skillfully to life's challenges.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {data.selectedEmotions.length > 0 && (
        <div className="bg-gradient-to-br from-elevated to-elevated border border-[rgba(196,160,82,0.15)] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-enlightened mb-4">
            Emotional Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-aged-gold">
                {data.selectedEmotions.length}
              </p>
              <p className="text-sm text-muted-wisdom">Total Emotions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-aged-gold">
                {getMostFrequentCategory(data.selectedEmotions)}
              </p>
              <p className="text-sm text-muted-wisdom">Most Frequent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-aged-gold">
                {getAverageIntensity(data.selectedEmotions)}
              </p>
              <p className="text-sm text-muted-wisdom">Avg Intensity</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-aged-gold">
                {getHighestIntensityEmotion(data.selectedEmotions)}
              </p>
              <p className="text-sm text-muted-wisdom">Strongest</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper functions
function getMostFrequentCategory(emotions: EmotionEntry[]): string {
  if (emotions.length === 0) return 'N/A'

  const counts: Record<string, number> = {}
  emotions.forEach(e => {
    counts[e.category] = (counts[e.category] || 0) + 1
  })

  let maxCount = 0
  let mostFrequent = 'N/A'
  Object.entries(counts).forEach(([category, count]) => {
    if (count > maxCount) {
      maxCount = count
      mostFrequent = category
    }
  })

  return mostFrequent
}

function getAverageIntensity(emotions: EmotionEntry[]): string {
  if (emotions.length === 0) return 'N/A'

  const sum = emotions.reduce((acc, e) => acc + e.intensity, 0)
  const avg = sum / emotions.length
  return avg.toFixed(1)
}

function getHighestIntensityEmotion(emotions: EmotionEntry[]): string {
  if (emotions.length === 0) return 'N/A'

  let highest = emotions[0]
  emotions.forEach(e => {
    if (e.intensity > highest.intensity) {
      highest = e
    }
  })

  return highest.emotion
}
