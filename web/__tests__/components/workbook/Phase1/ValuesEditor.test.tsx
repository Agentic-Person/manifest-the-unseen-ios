import { render, screen, fireEvent } from '@testing-library/react'
import { ValuesEditor, ValuesData } from '@/components/workbook/Phase1/ValuesEditor'

describe('ValuesEditor', () => {
  const mockOnChange = jest.fn()

  const defaultData: ValuesData = {
    values: [
      { id: 'family', name: 'Family', rank: 1 },
      { id: 'health', name: 'Health & Wellness', rank: 2 },
      { id: 'career', name: 'Career Success', rank: 3 },
    ],
  }

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('renders values list', () => {
    render(<ValuesEditor data={defaultData} onChange={mockOnChange} />)

    expect(screen.getAllByText('Family').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Health & Wellness').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Career Success').length).toBeGreaterThan(0)
  })

  it('highlights top 3 values', () => {
    render(<ValuesEditor data={defaultData} onChange={mockOnChange} />)

    // All three should be marked as top priorities
    const topPriorityLabels = screen.getAllByText('Top Priority Value')
    expect(topPriorityLabels).toHaveLength(3)
  })

  it('displays top 3 summary', () => {
    render(<ValuesEditor data={defaultData} onChange={mockOnChange} />)

    expect(screen.getByText('Your Top 3 Core Values')).toBeInTheDocument()
  })

  it('calls onChange when moving value up', () => {
    render(<ValuesEditor data={defaultData} onChange={mockOnChange} />)

    // Get all "Move up" buttons
    const moveUpButtons = screen.getAllByLabelText('Move up')

    // Click the "Move up" button for the second item (Health)
    fireEvent.click(moveUpButtons[1])

    expect(mockOnChange).toHaveBeenCalled()
    const newData = mockOnChange.mock.calls[0][0] as ValuesData

    // Health should now be rank 1, Family should be rank 2
    expect(newData.values.find(v => v.id === 'health')?.rank).toBe(1)
    expect(newData.values.find(v => v.id === 'family')?.rank).toBe(2)
  })

  it('calls onChange when moving value down', () => {
    render(<ValuesEditor data={defaultData} onChange={mockOnChange} />)

    // Get all "Move down" buttons
    const moveDownButtons = screen.getAllByLabelText('Move down')

    // Click the "Move down" button for the first item (Family)
    fireEvent.click(moveDownButtons[0])

    expect(mockOnChange).toHaveBeenCalled()
    const newData = mockOnChange.mock.calls[0][0] as ValuesData

    // Family should now be rank 2, Health should be rank 1
    expect(newData.values.find(v => v.id === 'family')?.rank).toBe(2)
    expect(newData.values.find(v => v.id === 'health')?.rank).toBe(1)
  })

  it('calls onChange when rank input is changed', () => {
    render(<ValuesEditor data={defaultData} onChange={mockOnChange} />)

    // Get all rank inputs
    const rankInputs = screen.getAllByLabelText(/Rank:/)

    // Change the first value's rank to 3
    fireEvent.change(rankInputs[0], { target: { value: '3' } })

    expect(mockOnChange).toHaveBeenCalled()
    const newData = mockOnChange.mock.calls[0][0] as ValuesData

    // Family should now be rank 3
    expect(newData.values.find(v => v.id === 'family')?.rank).toBe(3)
  })

  it('initializes with default values when data is empty', () => {
    const emptyData: ValuesData = { values: [] }
    render(<ValuesEditor data={emptyData} onChange={mockOnChange} />)

    // Should show the default 12 values (Family appears twice - in list and summary)
    expect(screen.getAllByText('Family').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Health & Wellness').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Career Success').length).toBeGreaterThan(0)
    expect(screen.getByText('Spirituality & Faith')).toBeInTheDocument()
  })

  it('disables move up button for first item', () => {
    render(<ValuesEditor data={defaultData} onChange={mockOnChange} />)

    const moveUpButtons = screen.getAllByLabelText('Move up')

    // First item's move up button should be disabled
    expect(moveUpButtons[0]).toBeDisabled()
  })

  it('disables move down button for last item', () => {
    render(<ValuesEditor data={defaultData} onChange={mockOnChange} />)

    const moveDownButtons = screen.getAllByLabelText('Move down')

    // Last item's move down button should be disabled
    expect(moveDownButtons[moveDownButtons.length - 1]).toBeDisabled()
  })
})
