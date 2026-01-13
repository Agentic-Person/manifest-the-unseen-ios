import { render, screen, fireEvent } from '@testing-library/react'
import { Slider } from '@/components/ui/Slider'

describe('Slider', () => {
  it('renders with label', () => {
    render(<Slider value={5} onChange={() => {}} label="Test Slider" />)
    expect(screen.getByText('Test Slider')).toBeInTheDocument()
  })

  it('renders with correct default props', () => {
    render(<Slider value={5} onChange={() => {}} label="Test Slider" />)
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('min', '1')
    expect(slider).toHaveAttribute('max', '10')
    expect(slider).toHaveValue('5')
  })

  it('renders with custom min and max values', () => {
    render(
      <Slider
        value={50}
        onChange={() => {}}
        label="Custom Slider"
        min={0}
        max={100}
      />
    )
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('min', '0')
    expect(slider).toHaveAttribute('max', '100')
    expect(slider).toHaveValue('50')
  })

  it('calls onChange when value changes', () => {
    const handleChange = jest.fn()
    render(<Slider value={5} onChange={handleChange} label="Test Slider" />)

    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '8' } })

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith(8)
  })

  it('displays current value', () => {
    render(<Slider value={7} onChange={() => {}} label="Test Slider" />)
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<Slider value={5} onChange={() => {}} label="Career" />)
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAccessibleName('Career')
  })
})
