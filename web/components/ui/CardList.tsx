'use client'

import { ReactNode } from 'react'

export interface CardListProps<T extends { id: string }> {
  items: T[]
  onAdd?: () => void
  onRemove: (id: string) => void
  renderItem: (item: T) => ReactNode
  addButtonText?: string
  emptyMessage?: string
  className?: string
}

/**
 * CardList component for displaying and managing a list of items with add/remove functionality.
 *
 * @example
 * ```tsx
 * <CardList
 *   items={habits}
 *   onAdd={() => addHabit()}
 *   onRemove={(id) => removeHabit(id)}
 *   renderItem={(habit) => <div>{habit.name}</div>}
 *   addButtonText="Add Habit"
 * />
 * ```
 */
export function CardList<T extends { id: string }>({
  items,
  onAdd,
  onRemove,
  renderItem,
  addButtonText = 'Add Item',
  emptyMessage = 'No items yet. Add one to get started!',
  className = '',
}: CardListProps<T>) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Item list */}
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-1">{renderItem(item)}</div>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
                aria-label={`Remove item ${item.id}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="sr-only">Remove</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add button */}
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {addButtonText}
          </span>
        </button>
      )}
    </div>
  )
}
