import { render, screen } from '@testing-library/react'
import { ProgressBar } from '@/components/ui/ProgressBar'

describe('ProgressBar', () => {
  it('renders with label', () => {
    render(<ProgressBar current={5} total={10} label="Phase 1 Progress" />)
    expect(screen.getByText('Phase 1 Progress')).toBeInTheDocument()
  })

  it('calculates and displays correct percentage', () => {
    render(<ProgressBar current={3} total={10} label="Progress" />)
    expect(screen.getByText('30%')).toBeInTheDocument()
  })

  it('displays 0% when current is 0', () => {
    render(<ProgressBar current={0} total={10} label="Progress" />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('displays 100% when current equals total', () => {
    render(<ProgressBar current={10} total={10} label="Progress" />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('displays completion count', () => {
    render(<ProgressBar current={7} total={12} label="Progress" />)
    expect(screen.getByText('7 / 12')).toBeInTheDocument()
  })

  it('handles decimal percentages by rounding', () => {
    render(<ProgressBar current={1} total={3} label="Progress" />)
    expect(screen.getByText('33%')).toBeInTheDocument()
  })

  it('handles percentage greater than 100% gracefully', () => {
    render(<ProgressBar current={15} total={10} label="Progress" />)
    const percentage = screen.getByText(/\d+%/)
    expect(percentage).toBeInTheDocument()
  })

  it('renders without label when not provided', () => {
    const { container } = render(<ProgressBar current={5} total={10} />)
    expect(container.querySelector('.text-sm')).not.toBeInTheDocument()
  })

  it('has proper progress bar width styling', () => {
    const { container } = render(<ProgressBar current={6} total={10} label="Progress" />)
    const progressBar = container.querySelector('[role="progressbar"]')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('aria-valuenow', '60')
    expect(progressBar).toHaveAttribute('aria-valuemin', '0')
    expect(progressBar).toHaveAttribute('aria-valuemax', '100')
  })
})
