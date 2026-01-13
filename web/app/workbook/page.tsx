'use client'

import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { useRouter } from 'next/navigation'

export default function WorkbookPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { tier, status, expiresAt, loading: subLoading } = useSubscription()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your workbook...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Manifest the Unseen - Workbook
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">{user?.email}</p>
              <p className="text-xs text-purple-600 font-medium">
                {tier ? `${tier} tier` : 'No subscription'}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Your Workbook! 🎉
          </h2>
          <p className="text-gray-600 mb-6">
            You've successfully authenticated and your subscription is active.
          </p>

          {/* Subscription details */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-purple-900 mb-3">
              Subscription Details
            </h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-600">Status:</dt>
                <dd className="font-medium text-gray-900 capitalize">
                  {status || 'Unknown'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Tier:</dt>
                <dd className="font-medium text-gray-900 capitalize">
                  {tier || 'None'}
                </dd>
              </div>
              {expiresAt && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Expires:</dt>
                  <dd className="font-medium text-gray-900">
                    {new Date(expiresAt).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Next steps */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Next Steps:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">1.</span>
                <span>
                  Workbook phases will be built next using the shared components
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">2.</span>
                <span>
                  Each phase will have worksheets with auto-save functionality
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">3.</span>
                <span>
                  Progress will sync automatically with your mobile app
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
