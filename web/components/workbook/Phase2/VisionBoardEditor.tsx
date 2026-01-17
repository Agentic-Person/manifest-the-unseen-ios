'use client'

import { useState } from 'react'

export interface VisionBoardImage {
  id: string
  url: string
  caption?: string
  category?: 'career' | 'relationships' | 'health' | 'wealth' | 'personal' | 'other'
}

export interface VisionBoardData {
  images: VisionBoardImage[]
  title: string
}

export interface VisionBoardEditorProps {
  data: VisionBoardData
  onChange: (data: VisionBoardData) => void
  className?: string
}

const CATEGORIES = [
  { value: 'career', label: 'Career', color: 'bg-blue-100 text-blue-800' },
  { value: 'relationships', label: 'Relationships', color: 'bg-pink-100 text-pink-800' },
  { value: 'health', label: 'Health', color: 'bg-green-100 text-green-800' },
  { value: 'wealth', label: 'Wealth', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'personal', label: 'Personal Growth', color: 'bg-purple-100 text-purple-800' },
  { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800' },
] as const

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Vision Board Editor - Create a visual collage of dreams and goals
 *
 * Simplified web version with image upload, captions, and categories.
 * Note: For production, integrate with Supabase Storage for image uploads.
 *
 * @example
 * ```tsx
 * <VisionBoardEditor
 *   data={visionData}
 *   onChange={(newData) => setVisionData(newData)}
 * />
 * ```
 */
export function VisionBoardEditor({ data, onChange, className = '' }: VisionBoardEditorProps) {
  const [editingImageId, setEditingImageId] = useState<string | null>(null)

  const handleTitleChange = (title: string) => {
    onChange({ ...data, title })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const newImage: VisionBoardImage = {
          id: generateId(),
          url: event.target?.result as string,
          caption: '',
          category: 'other',
        }
        onChange({
          ...data,
          images: [...data.images, newImage],
        })
      }
      reader.readAsDataURL(file)
    })

    // Reset input
    e.target.value = ''
  }

  const handleUpdateImage = (id: string, updates: Partial<VisionBoardImage>) => {
    onChange({
      ...data,
      images: data.images.map((img) =>
        img.id === id ? { ...img, ...updates } : img
      ),
    })
  }

  const handleDeleteImage = (id: string) => {
    if (confirm('Remove this image from your vision board?')) {
      onChange({
        ...data,
        images: data.images.filter((img) => img.id !== id),
      })
    }
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Introduction */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-purple-900 mb-1">
              Create Your Vision Board
            </h4>
            <p className="text-sm text-purple-800">
              Upload images that represent your dreams and goals. Choose pictures that evoke strong emotions
              and inspire you to take action. Add captions to clarify your intentions for each image.
            </p>
          </div>
        </div>
      </div>

      {/* Board Title */}
      <div className="bg-white rounded-xl border-2 border-purple-200 p-6 shadow-md">
        <label className="block mb-2 text-sm font-semibold text-gray-700">
          Board Title
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="My Vision Board 2026"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
      </div>

      {/* Upload Button */}
      <div className="flex justify-center">
        <label className="cursor-pointer">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 hover:scale-105">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-semibold">Add Images to Your Board</span>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Images Grid */}
      {data.images.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.images.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-md hover:shadow-xl transition-all"
            >
              {/* Image */}
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={image.url}
                  alt={image.caption || 'Vision board image'}
                  className="w-full h-full object-cover"
                />

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-700 shadow-lg"
                  aria-label="Delete image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Category Badge */}
                {image.category && (
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      CATEGORIES.find(c => c.value === image.category)?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {CATEGORIES.find(c => c.value === image.category)?.label || 'Other'}
                    </span>
                  </div>
                )}
              </div>

              {/* Caption & Category */}
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={image.caption || ''}
                    onChange={(e) => handleUpdateImage(image.id, { caption: e.target.value })}
                    placeholder="Describe your vision..."
                    className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Category
                  </label>
                  <select
                    value={image.category || 'other'}
                    onChange={(e) => handleUpdateImage(image.id, { category: e.target.value as VisionBoardImage['category'] })}
                    className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600 font-semibold mb-2">Your vision board is empty</p>
          <p className="text-sm text-gray-500">Upload images to start building your visual roadmap to success</p>
        </div>
      )}

      {/* Tips Card */}
      <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Tips for Your Vision Board
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Choose images that evoke strong positive emotions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Include specific goals and general aspirations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Review your board daily to keep your vision fresh</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Update it as your dreams and goals evolve</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Set this as your screensaver or desktop background</span>
          </li>
        </ul>
      </div>

      {/* Statistics */}
      {data.images.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-4">Your Vision Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{data.images.length}</div>
              <div className="text-sm text-gray-600">Total Images</div>
            </div>
            {CATEGORIES.filter(cat => data.images.some(img => img.category === cat.value)).map(cat => (
              <div key={cat.value} className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {data.images.filter(img => img.category === cat.value).length}
                </div>
                <div className="text-sm text-gray-600">{cat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
