import { redirect } from 'next/navigation'

/**
 * App root page - redirects to dashboard
 */
export default function AppPage() {
  redirect('/app/dashboard')
}
