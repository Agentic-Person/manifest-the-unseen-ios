'use client'

export default function Error() {
  return (
    <html>
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: '#0a0a0a', color: '#f4f4f4' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px' }}>500</h1>
            <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#d4af37' }}>Something Went Wrong</h2>
            <p style={{ marginBottom: '32px' }}>We&apos;re sorry, an unexpected error occurred.</p>
            <a href="/" style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: '#d4af37', color: '#0a0a0a', fontWeight: '600', borderRadius: '8px', textDecoration: 'none' }}>
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
