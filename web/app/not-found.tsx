import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-6xl font-bold text-enlightened mb-4">
          404
        </h1>
        <h2 className="font-serif text-2xl font-semibold text-aged-gold mb-6">
          Page Not Found
        </h2>
        <p className="text-muted-wisdom mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-aged-gold text-deep-void font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
