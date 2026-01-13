'use client'

import { ChangeEvent } from 'react'

export interface SliderProps {
  value: number
  onChange: (value: number) => void
  label: string
  min?: number
  max?: number
  step?: number
  className?: string
}

/**
 * Slider component for numeric input with visual range control.
 *
 * @example
 * ```tsx
 * <Slider
 *   value={7}
 *   onChange={(val) => setValue(val)}
 *   label="Career Satisfaction"
 *   min={1}
 *   max={10}
 * />
 * ```
 */
export function Slider({
  value,
  onChange,
  label,
  min = 1,
  max = 10,
  step = 1,
  className = '',
}: SliderProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value))
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex justify-between items-center">
        <label htmlFor={`slider-${label}`} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <span className="text-sm font-semibold text-purple-600">
          {value}
        </span>
      </div>
      <input
        id={`slider-${label}`}
        type="range"
        role="slider"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 hover:accent-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
