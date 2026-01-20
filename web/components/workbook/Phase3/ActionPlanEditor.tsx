'use client'

import { useState } from 'react'

export interface ActionStep {
  id: string
  description: string
  deadline: string
  status: 'not-started' | 'in-progress' | 'completed'
}

export interface ActionPlanData {
  steps: ActionStep[]
}

export interface ActionPlanEditorProps {
  data: ActionPlanData
  onChange: (data: ActionPlanData) => void
  className?: string
}

/**
 * Action Plan Editor - Step-by-step plan builder with deadlines and status tracking.
 *
 * @example
 * ```tsx
 * <ActionPlanEditor
 *   data={planData}
 *   onChange={(newData) => setPlanData(newData)}
 * />
 * ```
 */
export function ActionPlanEditor({ data, onChange, className = '' }: ActionPlanEditorProps) {
  const [newStep, setNewStep] = useState({ description: '', deadline: '' })

  const addStep = () => {
    if (!newStep.description) return

    const step: ActionStep = {
      id: `step-${Date.now()}`,
      ...newStep,
      status: 'not-started',
    }

    onChange({ steps: [...data.steps, step] })
    setNewStep({ description: '', deadline: '' })
  }

  const updateStep = (id: string, updates: Partial<ActionStep>) => {
    onChange({
      steps: data.steps.map(step => (step.id === id ? { ...step, ...updates } : step)),
    })
  }

  const removeStep = (id: string) => {
    onChange({ steps: data.steps.filter(step => step.id !== id) })
  }

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...data.steps]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newSteps.length) return

    ;[newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]]
    onChange({ steps: newSteps })
  }

  const getStatusColor = (status: ActionStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-elevated text-green-400 border-[rgba(74,222,128,0.3)]'
      case 'in-progress':
        return 'bg-elevated text-blue-400 border-[rgba(96,165,250,0.3)]'
      default:
        return 'bg-elevated text-muted-wisdom border-[rgba(196,160,82,0.15)]'
    }
  }

  const getStatusIcon = (status: ActionStep['status']) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'in-progress':
        return (
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-muted-wisdom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Introduction */}
      <div className="bg-elevated border border-[rgba(196,160,82,0.15)] rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-aged-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-enlightened mb-1">
              Create Your Action Plan
            </h4>
            <p className="text-sm text-muted-wisdom">
              Break down your goals into concrete, actionable steps. Each step should be clear, specific,
              and have a deadline. Track your progress as you complete each step.
            </p>
          </div>
        </div>
      </div>

      {/* Add Step Form */}
      <div className="bg-elevated rounded-xl border border-[rgba(196,160,82,0.15)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <h3 className="text-lg font-semibold text-aged-gold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Step
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted-wisdom mb-2">
              Step Description*
            </label>
            <input
              type="text"
              value={newStep.description}
              onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
              placeholder="e.g., Research and purchase running shoes"
              className="w-full p-3 bg-[rgba(26,26,36,0.8)] border border-[rgba(196,160,82,0.15)] rounded-lg focus:outline-none focus:ring-2 focus:ring-aged-gold text-enlightened"
              onKeyPress={(e) => e.key === 'Enter' && addStep()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-wisdom mb-2">
              Deadline (optional)
            </label>
            <input
              type="date"
              value={newStep.deadline}
              onChange={(e) => setNewStep({ ...newStep, deadline: e.target.value })}
              className="w-full p-3 bg-[rgba(26,26,36,0.8)] border border-[rgba(196,160,82,0.15)] rounded-lg focus:outline-none focus:ring-2 focus:ring-aged-gold text-enlightened"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={addStep}
          disabled={!newStep.description}
          className="mt-4 w-full py-3 px-4 bg-gradient-primary text-white rounded-lg hover:brightness-110 disabled:bg-temple-stone disabled:cursor-not-allowed transition-all font-medium"
        >
          Add Step
        </button>
      </div>

      {/* Steps List */}
      {data.steps.length === 0 ? (
        <div className="text-center py-12 bg-elevated rounded-xl border-2 border-dashed border-[rgba(196,160,82,0.15)]">
          <svg className="w-16 h-16 text-tertiary-text mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-tertiary-text">No steps yet. Add your first action step above!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.steps.map((step, index) => (
            <div
              key={step.id}
              className={`bg-temple-stone rounded-lg border p-4 shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all ${
                step.status === 'completed' ? 'border-[rgba(74,222,128,0.3)] opacity-75' : 'border-[rgba(196,160,82,0.15)]'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Step Number & Reorder */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 bg-gradient-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => moveStep(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-tertiary-text hover:text-muted-wisdom disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Move up"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveStep(index, 'down')}
                      disabled={index === data.steps.length - 1}
                      className="p-1 text-tertiary-text hover:text-muted-wisdom disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Move down"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <p className={`text-enlightened mb-2 ${step.status === 'completed' ? 'line-through' : ''}`}>
                    {step.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    {step.deadline && (
                      <span className="text-muted-wisdom">
                        Due: {new Date(step.deadline).toLocaleDateString()}
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-tertiary-text">Status:</span>
                      <select
                        value={step.status}
                        onChange={(e) =>
                          updateStep(step.id, { status: e.target.value as ActionStep['status'] })
                        }
                        className={`px-3 py-1 border rounded-md text-sm font-medium ${getStatusColor(step.status)}`}
                      >
                        <option value="not-started">Not Started</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Status Icon & Remove */}
                <div className="flex items-center gap-2">
                  {getStatusIcon(step.status)}
                  <button
                    type="button"
                    onClick={() => removeStep(step.id)}
                    className="p-2 text-red-400 hover:bg-elevated rounded transition-colors"
                    aria-label="Remove step"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progress Summary */}
      {data.steps.length > 0 && (
        <div className="bg-elevated border border-[rgba(196,160,82,0.15)] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <h3 className="text-lg font-semibold text-aged-gold mb-4">Action Plan Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-aged-gold">{data.steps.length}</p>
              <p className="text-sm text-muted-wisdom">Total Steps</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">
                {data.steps.filter(s => s.status === 'completed').length}
              </p>
              <p className="text-sm text-muted-wisdom">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">
                {data.steps.filter(s => s.status === 'in-progress').length}
              </p>
              <p className="text-sm text-muted-wisdom">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-400">
                {data.steps.length > 0
                  ? Math.round((data.steps.filter(s => s.status === 'completed').length / data.steps.length) * 100)
                  : 0}
                %
              </p>
              <p className="text-sm text-muted-wisdom">Complete</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-temple-stone rounded-full h-3">
            <div
              className="bg-gradient-primary h-3 rounded-full transition-all"
              style={{
                width: `${
                  data.steps.length > 0
                    ? (data.steps.filter(s => s.status === 'completed').length / data.steps.length) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
