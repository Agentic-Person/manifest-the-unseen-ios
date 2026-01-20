'use client'

export interface SelfCareActivity {
  id: string
  activity: string
  frequency: 'daily' | 'weekly' | 'monthly'
  category: 'physical' | 'emotional' | 'mental' | 'spiritual'
}

export interface SelfCareRoutineData {
  activities: SelfCareActivity[]
}

export interface SelfCareRoutineEditorProps {
  data: SelfCareRoutineData
  onChange: (data: SelfCareRoutineData) => void
  className?: string
}

export function SelfCareRoutineEditor({ data, onChange, className = '' }: SelfCareRoutineEditorProps) {
  const addActivity = () => {
    const activity: SelfCareActivity = {
      id: `activity-${Date.now()}`,
      activity: '',
      frequency: 'daily',
      category: 'physical',
    }
    onChange({ activities: [...data.activities, activity] })
  }

  const updateActivity = (id: string, updates: Partial<SelfCareActivity>) => {
    onChange({
      activities: data.activities.map(a => (a.id === id ? { ...a, ...updates } : a)),
    })
  }

  const removeActivity = (id: string) => {
    onChange({ activities: data.activities.filter(a => a.id !== id) })
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="bg-elevated border border-[rgba(196,160,82,0.2)] rounded-lg p-4">
        <p className="text-sm text-muted-wisdom">Design a sustainable self-care routine that nurtures all aspects of your wellbeing.</p>
      </div>

      {data.activities.length === 0 ? (
        <div className="text-center py-12 bg-elevated rounded-xl border-2 border-dashed border-aged-gold">
          <button onClick={addActivity} className="px-6 py-3 bg-heart-emerald text-white rounded-lg hover:brightness-110">
            Create First Self-Care Activity
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.activities.map((activity) => (
            <div key={activity.id} className="bg-elevated rounded-lg border-2 border-heart-emerald p-4 flex gap-4">
              <input
                type="text"
                value={activity.activity}
                onChange={(e) => updateActivity(activity.id, { activity: e.target.value })}
                placeholder="Self-care activity..."
                className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <select
                value={activity.category}
                onChange={(e) => updateActivity(activity.id, { category: e.target.value as SelfCareActivity['category'] })}
                className="p-2 border rounded"
              >
                <option value="physical">Physical</option>
                <option value="emotional">Emotional</option>
                <option value="mental">Mental</option>
                <option value="spiritual">Spiritual</option>
              </select>
              <select
                value={activity.frequency}
                onChange={(e) => updateActivity(activity.id, { frequency: e.target.value as SelfCareActivity['frequency'] })}
                className="p-2 border rounded"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <button onClick={() => removeActivity(activity.id)} className="p-2 text-burgundy hover:bg-[rgba(107,45,61,0.1)] rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}

          <button onClick={addActivity} className="w-full py-3 border-2 border-heart-emerald text-heart-emerald rounded-lg hover:bg-[rgba(45,90,74,0.1)]">
            + Add Activity
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['physical', 'emotional', 'mental', 'spiritual'] as const).map((cat) => (
          <div key={cat} className="text-center p-4 bg-elevated rounded-lg">
            <p className="text-2xl font-bold text-heart-emerald">{data.activities.filter(a => a.category === cat).length}</p>
            <p className="text-sm text-muted-wisdom capitalize">{cat}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
