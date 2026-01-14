'use client'

import { useState } from 'react'
import { WheelOfLifeEditor } from '@/components/workbook/Phase1/WheelOfLifeEditor'
import { SWOTEditor } from '@/components/workbook/Phase1/SWOTEditor'
import { HabitsAuditEditor } from '@/components/workbook/Phase1/HabitsAuditEditor'
import { ValuesEditor } from '@/components/workbook/Phase1/ValuesEditor'
import { ABCModelEditor } from '@/components/workbook/Phase1/ABCModelEditor'
import { StrengthsWeaknessesEditor } from '@/components/workbook/Phase1/StrengthsWeaknessesEditor'
import { ComfortZoneEditor } from '@/components/workbook/Phase1/ComfortZoneEditor'
import { KnowYourselfEditor } from '@/components/workbook/Phase1/KnowYourselfEditor'
import { AbilitiesRatingEditor } from '@/components/workbook/Phase1/AbilitiesRatingEditor'
import { ThoughtAwarenessEditor } from '@/components/workbook/Phase1/ThoughtAwarenessEditor'
import { FeelWheelEditor } from '@/components/workbook/Phase1/FeelWheelEditor'

const worksheets = [
  { id: 'wheel-of-life', name: '1. Wheel of Life', component: WheelOfLifeEditor, defaultData: { career: 5, health: 5, relationships: 5, finance: 5, personalGrowth: 5, family: 5, recreation: 5, spirituality: 5 } },
  { id: 'swot-analysis', name: '2. SWOT Analysis', component: SWOTEditor, defaultData: { strengths: [], weaknesses: [], opportunities: [], threats: [] } },
  { id: 'habits-audit', name: '3. Habits Audit', component: HabitsAuditEditor, defaultData: { habits: [] } },
  { id: 'values-assessment', name: '4. Values Assessment', component: ValuesEditor, defaultData: { values: [] } },
  { id: 'abc-model', name: '5. ABC Model', component: ABCModelEditor, defaultData: { activatingEvent: '', belief: '', consequence: '' } },
  { id: 'strengths-weaknesses', name: '6. Strengths & Weaknesses', component: StrengthsWeaknessesEditor, defaultData: { strengths: [], weaknesses: [] } },
  { id: 'comfort-zone', name: '7. Comfort Zone', component: ComfortZoneEditor, defaultData: { comfortZone: [], stretchZone: [], panicZone: [] } },
  { id: 'know-yourself', name: '8. Know Yourself', component: KnowYourselfEditor, defaultData: { questions: [] } },
  { id: 'abilities-rating', name: '9. Abilities Rating', component: AbilitiesRatingEditor, defaultData: { abilities: [] } },
  { id: 'thought-awareness', name: '10. Thought Awareness', component: ThoughtAwarenessEditor, defaultData: { entries: [] } },
  { id: 'feel-wheel', name: '11. Feel Wheel', component: FeelWheelEditor, defaultData: { selectedEmotions: [] } },
]

export default function Phase1PreviewPage() {
  const [selectedWorksheet, setSelectedWorksheet] = useState(0)
  const [data, setData] = useState<any>(worksheets[0].defaultData)

  const handleWorksheetChange = (index: number) => {
    setSelectedWorksheet(index)
    setData(worksheets[index].defaultData)
  }

  const CurrentEditor = worksheets[selectedWorksheet].component

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Phase 1 Worksheets Preview</h1>
          <p className="text-sm text-gray-600 mt-1">Demo mode - no authentication required</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Worksheets</h2>
              <nav className="space-y-1">
                {worksheets.map((worksheet, index) => (
                  <button
                    key={worksheet.id}
                    onClick={() => handleWorksheetChange(index)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedWorksheet === index
                        ? 'bg-purple-100 text-purple-900'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {worksheet.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {worksheets[selectedWorksheet].name}
                </h2>
                <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full w-24" />
              </div>

              <CurrentEditor data={data} onChange={setData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
