# Web Workbook Components

This directory contains shared UI components and workbook-specific components for the Manifest the Unseen web workbook.

## Directory Structure

```
components/
├── ui/                      # Reusable UI primitives
│   ├── Slider.tsx           # Numeric slider input (1-10 scale)
│   ├── CardList.tsx         # Add/remove list with cards
│   ├── ProgressBar.tsx      # Progress visualization
│   └── AutoSaveIndicator.tsx # Save status indicator
├── workbook/                # Workbook-specific components
│   └── WorksheetLayout.tsx  # Common worksheet wrapper
├── Features.tsx             # Landing page features section
├── Hero.tsx                 # Landing page hero section
└── ... (other landing page components)
```

## UI Components

### Slider

A numeric slider for rating/scale inputs (default 1-10).

**Usage:**
```tsx
import { Slider } from '@/components/ui/Slider'

<Slider
  value={satisfaction}
  onChange={(val) => setSatisfaction(val)}
  label="Career Satisfaction"
  min={1}
  max={10}
/>
```

**Props:**
- `value: number` - Current value
- `onChange: (value: number) => void` - Change handler
- `label: string` - Label text
- `min?: number` - Minimum value (default: 1)
- `max?: number` - Maximum value (default: 10)
- `step?: number` - Step increment (default: 1)
- `className?: string` - Additional CSS classes

**Tests:** `__tests__/components/ui/Slider.test.tsx`

---

### CardList

A component for managing lists of items with add/remove functionality.

**Usage:**
```tsx
import { CardList } from '@/components/ui/CardList'

<CardList
  items={habits}
  onAdd={() => addNewHabit()}
  onRemove={(id) => removeHabit(id)}
  renderItem={(habit) => (
    <div>
      <h3>{habit.name}</h3>
      <p>{habit.frequency}</p>
    </div>
  )}
  addButtonText="Add Habit"
  emptyMessage="No habits yet. Add one to get started!"
/>
```

**Props:**
- `items: T[]` - Array of items (must have `id: string`)
- `onAdd?: () => void` - Add button handler (optional)
- `onRemove: (id: string) => void` - Remove button handler
- `renderItem: (item: T) => ReactNode` - Render function for each item
- `addButtonText?: string` - Add button label (default: "Add Item")
- `emptyMessage?: string` - Empty state message
- `className?: string` - Additional CSS classes

**Tests:** `__tests__/components/ui/CardList.test.tsx`

---

### ProgressBar

A progress bar for displaying completion percentage.

**Usage:**
```tsx
import { ProgressBar } from '@/components/ui/ProgressBar'

<ProgressBar
  current={7}
  total={11}
  label="Phase 1: Self-Evaluation"
  showCount={true}
/>
```

**Props:**
- `current: number` - Current completion count
- `total: number` - Total items
- `label?: string` - Progress label
- `showCount?: boolean` - Show "X / Y" count (default: true)
- `className?: string` - Additional CSS classes

**Features:**
- Calculates percentage automatically
- Handles edge cases (0%, 100%, >100%)
- Gradient purple progress bar
- Accessible with ARIA attributes

**Tests:** `__tests__/components/ui/ProgressBar.test.tsx`

---

### AutoSaveIndicator

A status indicator for auto-save operations.

**Usage:**
```tsx
import { AutoSaveIndicator } from '@/components/ui/AutoSaveIndicator'

<AutoSaveIndicator
  status={saveStatus}
  lastSaved={lastSaveTime}
  errorMessage="Connection failed"
/>
```

**Props:**
- `status: 'idle' | 'saving' | 'saved' | 'error'` - Current save status
- `lastSaved?: Date` - Last successful save timestamp
- `errorMessage?: string` - Custom error message (default: "Error saving")
- `className?: string` - Additional CSS classes

**States:**
- **idle** - Hidden (no indicator shown)
- **saving** - Animated spinner with "Saving..."
- **saved** - Green checkmark with timestamp
- **error** - Red warning icon with error message

**Tests:** `__tests__/components/ui/AutoSaveIndicator.test.tsx`

---

## Workbook Components

### WorksheetLayout

A common layout wrapper for all worksheet pages.

**Usage:**
```tsx
import { WorksheetLayout } from '@/components/workbook/WorksheetLayout'

<WorksheetLayout
  title="Wheel of Life"
  description="Rate your satisfaction in each life area"
  saveStatus={saveStatus}
  lastSaved={lastSaved}
  onNext={() => router.push('/workbook/phase/1/swot-analysis')}
  onPrevious={() => router.push('/workbook/phase/1')}
>
  <WheelOfLifeEditor data={data} onChange={handleChange} />
</WorksheetLayout>
```

**Props:**
- `title: string` - Worksheet title
- `description?: string` - Worksheet description
- `children: ReactNode` - Worksheet content
- `saveStatus?: 'idle' | 'saving' | 'saved' | 'error'` - Auto-save status
- `lastSaved?: Date` - Last save timestamp
- `onNext?: () => void` - Next button handler
- `onPrevious?: () => void` - Previous button handler
- `nextLabel?: string` - Next button text (default: "Next Worksheet")
- `previousLabel?: string` - Previous button text (default: "Previous")
- `showNavigation?: boolean` - Show nav buttons (default: true)
- `className?: string` - Additional CSS classes

**Features:**
- Consistent header with title and description
- Auto-save indicator in top-right
- Purple gradient divider
- White card container for content
- Previous/Next navigation buttons
- Fully responsive

---

## Hooks

### useAutoSave

A hook for automatic debounced saving of data.

**Usage:**
```tsx
import { useAutoSave } from '@/hooks/useAutoSave'
import { supabase } from '@/lib/supabase'

const { status, lastSaved, saveNow } = useAutoSave({
  data: formData,
  onSave: async (data) => {
    const { error } = await supabase
      .from('workbook_progress')
      .upsert({
        user_id: userId,
        worksheet_id: 'wheel-of-life',
        data,
        updated_at: new Date().toISOString(),
      })
    if (error) throw error
  },
  delay: 30000, // 30 seconds
  enabled: true,
})

return (
  <>
    <AutoSaveIndicator status={status} lastSaved={lastSaved} />
    <button onClick={saveNow}>Save Now</button>
  </>
)
```

**Options:**
- `data: T` - Data to save
- `onSave: (data: T) => Promise<void>` - Async save function
- `delay?: number` - Debounce delay in milliseconds (default: 30000)
- `enabled?: boolean` - Enable/disable auto-save (default: true)

**Returns:**
- `status: SaveStatus` - Current save status
- `lastSaved: Date | null` - Last successful save timestamp
- `error: Error | null` - Last error (if any)
- `saveNow: () => Promise<void>` - Immediate save function

**Behavior:**
- Debounces saves by 30 seconds (configurable)
- Shows "Saving..." during save
- Shows "Saved" for 3 seconds after success
- Shows error on failure
- Cancels pending saves when data changes
- Provides manual save option via `saveNow()`

---

## Utility Files

### lib/supabase.ts

Supabase client configuration for the web app.

**Usage:**
```tsx
import { supabase } from '@/lib/supabase'

// Query workbook progress
const { data, error } = await supabase
  .from('workbook_progress')
  .select('*')
  .eq('user_id', userId)
  .eq('worksheet_id', 'wheel-of-life')
  .single()

// Update progress
const { error } = await supabase
  .from('workbook_progress')
  .upsert({
    user_id: userId,
    worksheet_id: 'wheel-of-life',
    data: worksheetData,
    completed: false,
    updated_at: new Date().toISOString(),
  })
```

**Exports:**
- `supabase` - Configured Supabase client
- `WorkbookProgress` - TypeScript interface for workbook_progress table
- `UserProfile` - TypeScript interface for users table

**Configuration:**
- Auto-refresh tokens
- Persist sessions in localStorage
- Detect session from URL (for auth callbacks)

---

## Testing

All components have comprehensive test coverage using Jest and React Testing Library.

**Run tests:**
```bash
cd web
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

**Test files:**
- `__tests__/components/ui/Slider.test.tsx` - 6 tests
- `__tests__/components/ui/CardList.test.tsx` - 6 tests
- `__tests__/components/ui/ProgressBar.test.tsx` - 9 tests
- `__tests__/components/ui/AutoSaveIndicator.test.tsx` - 7 tests

**Total:** 28 tests, all passing ✅

---

## Styling

All components use Tailwind CSS with the following design system:

**Colors:**
- Primary: Purple (`purple-600`, `purple-700`)
- Success: Green (`green-600`)
- Error: Red (`red-600`)
- Neutral: Gray shades

**Spacing:**
- Consistent padding: `p-4`, `p-8`
- Consistent gaps: `gap-2`, `gap-3`, `gap-4`

**Shadows:**
- Cards: `shadow-sm`, hover: `shadow-md`
- Buttons: `shadow-sm`, hover: `shadow-md`

**Borders:**
- Radius: `rounded-lg` (8px), `rounded-xl` (12px), `rounded-full`
- Width: `border` (1px), `border-2`

**Transitions:**
- All interactive elements use `transition-colors` or `transition-all`
- Duration: default (150ms)

---

## Next Steps

These shared components are ready to use in worksheet implementations. Next phases:

1. **Phase 1 Worksheets** - Build 11 worksheets using these components
2. **Phase 2-10 Worksheets** - Continue with remaining phases
3. **Authentication** - Add login/signup forms
4. **Middleware** - Protect routes with subscription checks
5. **Navigation** - Build phase navigator sidebar
6. **Dashboard** - Create workbook progress dashboard

---

## Questions or Issues?

Refer to:
- **PRD**: `docs/planning/web-workbook-prd.md`
- **TDD**: `docs/planning/manifest-the-unseen-tdd.md`
- **Component examples**: Each component file has JSDoc examples
