'use client'

import { ProgressBar } from '@/components/ui/ProgressBar'

interface OverallProgressProps {
  totalCompleted: number
  totalWorksheets: number
}

const getMotivationalMessage = (percent: number): string => {
  if (percent === 0) return "Every journey begins with a single step. You've got this!"
  if (percent <= 10) return "Great start! Each worksheet brings you closer to your vision."
  if (percent <= 30) return "Building momentum! Keep the energy flowing."
  if (percent <= 60) return "You're making real progress. Your transformation is taking shape."
  if (percent <= 90) return "Almost there! The finish line is in sight."
  if (percent < 100) return "So close! Complete your journey."
  return "Congratulations! You've completed the workbook. Your transformation has begun. 🎉"
}

export function OverallProgress({ totalCompleted, totalWorksheets }: OverallProgressProps) {
  const percent = totalWorksheets > 0
    ? Math.round((totalCompleted / totalWorksheets) * 100)
    : 0

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Your Manifestation Journey
      </h2>
      <p className="text-gray-600 mb-6">
        You've completed {totalCompleted} of {totalWorksheets} worksheets ({percent}%)
      </p>

      <ProgressBar
        current={totalCompleted}
        total={totalWorksheets}
        showCount={false}
      />

      <p className="text-purple-600 font-medium mt-4">
        {getMotivationalMessage(percent)}
      </p>
    </div>
  )
}
