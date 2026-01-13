import { render, screen, fireEvent } from '@testing-library/react'
import { CardList } from '@/components/ui/CardList'

describe('CardList', () => {
  const mockItems = [
    { id: '1', text: 'Item 1' },
    { id: '2', text: 'Item 2' },
    { id: '3', text: 'Item 3' },
  ]

  const renderItem = (item: { id: string; text: string }) => (
    <div data-testid={`item-${item.id}`}>{item.text}</div>
  )

  it('renders all items', () => {
    render(
      <CardList
        items={mockItems}
        onAdd={() => {}}
        onRemove={() => {}}
        renderItem={renderItem}
      />
    )

    expect(screen.getByTestId('item-1')).toHaveTextContent('Item 1')
    expect(screen.getByTestId('item-2')).toHaveTextContent('Item 2')
    expect(screen.getByTestId('item-3')).toHaveTextContent('Item 3')
  })

  it('renders empty state when no items', () => {
    render(
      <CardList
        items={[]}
        onAdd={() => {}}
        onRemove={() => {}}
        renderItem={renderItem}
        emptyMessage="No items yet"
      />
    )

    expect(screen.getByText('No items yet')).toBeInTheDocument()
  })

  it('calls onAdd when add button is clicked', () => {
    const handleAdd = jest.fn()
    render(
      <CardList
        items={mockItems}
        onAdd={handleAdd}
        onRemove={() => {}}
        renderItem={renderItem}
      />
    )

    const addButton = screen.getByRole('button', { name: /add/i })
    fireEvent.click(addButton)

    expect(handleAdd).toHaveBeenCalledTimes(1)
  })

  it('calls onRemove with item id when remove button is clicked', () => {
    const handleRemove = jest.fn()
    render(
      <CardList
        items={mockItems}
        onAdd={() => {}}
        onRemove={handleRemove}
        renderItem={renderItem}
      />
    )

    const removeButtons = screen.getAllByRole('button', { name: /remove/i })
    fireEvent.click(removeButtons[0]) // Click first remove button

    expect(handleRemove).toHaveBeenCalledTimes(1)
    expect(handleRemove).toHaveBeenCalledWith('1')
  })

  it('renders custom add button text', () => {
    render(
      <CardList
        items={mockItems}
        onAdd={() => {}}
        onRemove={() => {}}
        renderItem={renderItem}
        addButtonText="Add New Item"
      />
    )

    expect(screen.getByText('Add New Item')).toBeInTheDocument()
  })

  it('does not show add button when onAdd is not provided', () => {
    render(
      <CardList
        items={mockItems}
        onRemove={() => {}}
        renderItem={renderItem}
      />
    )

    expect(screen.queryByRole('button', { name: /add/i })).not.toBeInTheDocument()
  })
})
