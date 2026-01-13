import { render, screen } from '@testing-library/react'
import { AutoSaveIndicator } from '@/components/ui/AutoSaveIndicator'

describe('AutoSaveIndicator', () => {
  it('renders idle state correctly', () => {
    render(<AutoSaveIndicator status="idle" />)
    expect(screen.queryByText(/saving|saved|error/i)).not.toBeInTheDocument()
  })

  it('renders saving state with spinner', () => {
    render(<AutoSaveIndicator status="saving" />)
    expect(screen.getByText('Saving...')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders saved state with checkmark', () => {
    render(<AutoSaveIndicator status="saved" />)
    expect(screen.getByText('Saved')).toBeInTheDocument()
  })

  it('renders error state with warning', () => {
    render(<AutoSaveIndicator status="error" />)
    expect(screen.getByText('Error saving')).toBeInTheDocument()
  })

  it('renders custom error message', () => {
    render(<AutoSaveIndicator status="error" errorMessage="Connection lost" />)
    expect(screen.getByText('Connection lost')).toBeInTheDocument()
  })

  it('has proper aria-live attribute for accessibility', () => {
    const { rerender } = render(<AutoSaveIndicator status="idle" />)

    rerender(<AutoSaveIndicator status="saving" />)
    const statusElement = screen.getByRole('status')
    expect(statusElement).toHaveAttribute('aria-live', 'polite')
  })

  it('shows last saved timestamp when provided', () => {
    const lastSaved = new Date('2024-01-01T12:00:00')
    render(<AutoSaveIndicator status="saved" lastSaved={lastSaved} />)
    expect(screen.getByText(/saved/i)).toBeInTheDocument()
  })
})
