import { redirect } from 'next/navigation'

/**
 * Companion root page - redirects to dashboard
 */
export default function CompanionPage() {
  redirect('/companion/dashboard')
}
