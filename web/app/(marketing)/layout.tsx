import Footer from '@/components/Footer'

/**
 * Marketing layout for public pages.
 * Includes the standard footer component.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}
