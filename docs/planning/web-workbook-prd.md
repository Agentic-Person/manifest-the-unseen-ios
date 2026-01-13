# Web Workbook Companion PRD

> **Purpose**: Build a browser-based workbook for Manifest the Unseen, allowing users to complete all 10 phases on desktop/tablet where keyboard input is easier than mobile.

---

## Executive Summary

| Attribute | Value |
|-----------|-------|
| **Platform** | Next.js 14 (extend existing `web/` directory) |
| **Scope** | Complete workbook (10 phases, 30 worksheets) |
| **Auth** | Email/password via Supabase (matches Apple ID email) |
| **Access Control** | Active mobile subscription required |
| **Data Sync** | Same Supabase backend as mobile (instant sync) |
| **Approach** | Full TDD with Ralph Wiggum iterative loops |

---

## User Stories

1. **As a subscriber**, I want to complete workbook exercises on my computer so I can type faster and see more content at once.

2. **As a subscriber**, I want my progress to sync between mobile and web so I can switch devices seamlessly.

3. **As a non-subscriber**, I should be redirected to the landing page to download the app.

---

## Technical Architecture

### Authentication Flow

```
User enters email + password
        ↓
Supabase Auth validates credentials
        ↓
Query users.subscription_status
        ↓
┌─────────────────────────────────────┐
│ subscription_status === 'active' ?  │
└─────────────────────────────────────┘
        │                    │
       YES                   NO
        ↓                    ↓
   /workbook            / (landing page)
```

### Subscription Sync (New)

```
Mobile: User subscribes via App Store
        ↓
RevenueCat processes payment
        ↓
RevenueCat sends webhook to:
  POST /api/webhooks/revenuecat
        ↓
Webhook handler updates Supabase:
  users.subscription_tier = 'novice' | 'awakening' | 'enlightenment'
  users.subscription_status = 'active' | 'canceled' | 'expired'
  users.subscription_expires_at = timestamp
        ↓
Web app middleware checks subscription_status
        ↓
User gets access to /workbook/*
```

### Data Layer

All worksheet data is stored in `workbook_progress` table:

```sql
workbook_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  phase_number INTEGER (1-10),
  worksheet_id TEXT,
  data JSONB,              -- Flexible worksheet data
  completed BOOLEAN,
  completed_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(user_id, worksheet_id)
)
```

---

## File Structure

```
web/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Landing page (existing)
│   ├── auth/
│   │   ├── login/page.tsx            # Email login form
│   │   ├── signup/page.tsx           # Email signup form
│   │   └── callback/route.ts         # Auth callback handler
│   ├── workbook/
│   │   ├── layout.tsx                # Sidebar + phase navigation
│   │   ├── page.tsx                  # Workbook dashboard
│   │   ├── phase/[phaseNumber]/
│   │   │   ├── page.tsx              # Phase overview
│   │   │   └── [worksheetId]/page.tsx
│   │   └── progress/page.tsx         # Overall progress view
│   └── api/
│       └── webhooks/
│           └── revenuecat/route.ts   # Subscription webhook
├── components/
│   ├── ui/                           # Reusable primitives
│   │   ├── Slider.tsx
│   │   ├── CardList.tsx
│   │   ├── ProgressBar.tsx
│   │   └── AutoSaveIndicator.tsx
│   ├── workbook/                     # Workbook-specific
│   │   ├── PhaseNavigator.tsx
│   │   ├── WorksheetLayout.tsx
│   │   └── ExerciseHeader.tsx
│   ├── charts/                       # Visualizations
│   │   ├── WheelOfLifeChart.tsx
│   │   ├── TrustRadar.tsx
│   │   └── TimelineChart.tsx
│   └── auth/
│       ├── LoginForm.tsx
│       └── SignupForm.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useWorkbook.ts
│   ├── useAutoSave.ts
│   └── useSubscription.ts
├── lib/
│   ├── supabase.ts                   # Supabase client
│   ├── auth.ts                       # Auth utilities
│   └── constants.ts                  # Worksheet IDs, etc.
├── __tests__/                        # Test files
│   ├── phase-1/
│   ├── phase-2/
│   └── ...
└── middleware.ts                     # Auth + subscription check
```

---

## Complete Worksheet Inventory

### Phase 1: Self-Evaluation (11 worksheets)

| Worksheet ID | Component | UI Pattern | Data Type |
|-------------|-----------|------------|-----------|
| `wheel-of-life` | WheelOfLifeEditor | 8 sliders + radar chart | 8 numeric values (1-10) |
| `swot-analysis` | SWOTEditor | 4-quadrant grid | 4 string arrays |
| `habits-audit` | HabitsAuditEditor | Add/remove list | Array of {name, type, frequency} |
| `values-assessment` | ValuesEditor | Ranked list | Array with rank property |
| `abc-model` | ABCModelEditor | 3-step form | {activating, belief, consequence} |
| `strengths-weaknesses` | StrengthsWeaknessesEditor | Two-column list | 2 string arrays |
| `comfort-zone` | ComfortZoneEditor | Visualization | Zone data |
| `know-yourself` | KnowYourselfEditor | Q&A form | Q&A pairs |
| `abilities-rating` | AbilitiesRatingEditor | Sliders | Numeric ratings |
| `thought-awareness` | ThoughtAwarenessEditor | Journal/log | Thought entries |
| `feel-wheel` | FeelWheelEditor | Emotion wheel | Emotion selections |

### Phase 2: Values & Vision (3 worksheets)

| Worksheet ID | Component | UI Pattern |
|-------------|-----------|------------|
| `life-mission` | LifeMissionEditor | Rich text editor |
| `purpose-statement` | PurposeStatementEditor | Text area |
| `vision-board` | VisionBoardEditor | **DEFERRED** |

### Phase 3: Goal Setting (3 worksheets)

| Worksheet ID | Component | UI Pattern |
|-------------|-----------|------------|
| `smart-goals` | SMARTGoalEditor | SMART criteria form |
| `timeline` | TimelineEditor | Timeline visualization |
| `action-plan` | ActionPlanEditor | Step list with milestones |

### Phase 4: Facing Fears (3 worksheets)

| Worksheet ID | Component | UI Pattern |
|-------------|-----------|------------|
| `fear-inventory` | FearInventoryEditor | Cards + intensity slider |
| `limiting-beliefs` | LimitingBeliefsEditor | Belief → reframe pairs |
| `fear-facing-plan` | FearFacingPlanEditor | Action plan builder |

### Phase 5: Self-Love & Self-Care (3 worksheets)

| Worksheet ID | Component | UI Pattern |
|-------------|-----------|------------|
| `self-love-affirmations` | AffirmationsEditor | Card deck |
| `self-care-routine` | SelfCareRoutineEditor | Routine tracker |
| `inner-child` | InnerChildEditor | Guided reflection |

### Phase 6: Manifestation Techniques (3 worksheets)

| Worksheet ID | Component | UI Pattern |
|-------------|-----------|------------|
| `369-method` | ThreeSixNineEditor | Daily tracker (3-6-9 pattern) |
| `scripting` | ScriptingEditor | Rich text |
| `woop-method` | WOOPEditor | 4-step wizard |

### Phase 7: Practicing Gratitude (3 worksheets)

| Worksheet ID | Component | UI Pattern |
|-------------|-----------|------------|
| `gratitude-journal` | GratitudeJournalEditor | Multi-item entries |
| `gratitude-letters` | GratitudeLettersEditor | Letter editor |
| `gratitude-meditation` | GratitudeMeditationEditor | **DEFERRED** |

### Phase 8: Envy to Inspiration (3 worksheets)

| Worksheet ID | Component | UI Pattern |
|-------------|-----------|------------|
| `envy-inventory` | EnvyInventoryEditor | Card inventory |
| `inspiration-reframe` | InspirationReframeEditor | Reframe exercise |
| `role-models` | RoleModelsEditor | Profile cards |

### Phase 9: Trust & Surrender (3 worksheets)

| Worksheet ID | Component | UI Pattern |
|-------------|-----------|------------|
| `trust-assessment` | TrustAssessmentEditor | Radar chart |
| `surrender-practice` | SurrenderPracticeEditor | Guided exercise |
| `signs-tracking` | SignsTrackingEditor | Timeline/journal |

### Phase 10: Graduation (3 worksheets)

| Worksheet ID | Component | UI Pattern |
|-------------|-----------|------------|
| `journey-review` | JourneyReviewEditor | Comprehensive reflection |
| `future-letter` | FutureLetterEditor | Long-form editor |
| `graduation` | GraduationEditor | Certificate display |

---

## Testing Strategy (TDD)

### Per-Worksheet Test Template

```typescript
// web/__tests__/phase-1/wheel-of-life.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { WheelOfLifeEditor } from '@/components/workbook/Phase1/WheelOfLifeEditor'

describe('WheelOfLifeEditor', () => {
  it('renders all 8 life area sliders', () => {
    render(<WheelOfLifeEditor />)
    expect(screen.getByLabelText('Career')).toBeInTheDocument()
    expect(screen.getByLabelText('Health')).toBeInTheDocument()
    // ... all 8 areas
  })

  it('updates values when sliders change', async () => {
    render(<WheelOfLifeEditor />)
    const slider = screen.getByLabelText('Career')
    fireEvent.change(slider, { target: { value: 8 } })
    expect(slider).toHaveValue('8')
  })

  it('auto-saves data after 30 seconds', async () => {
    // Test debounced save
  })

  it('loads existing data on mount', async () => {
    // Test data fetching
  })

  it('displays save indicator during save', async () => {
    // Test UI feedback
  })
})
```

### Integration Tests (Playwright)

```typescript
// web/__tests__/e2e/phase-1-workflow.spec.ts

import { test, expect } from '@playwright/test'

test('complete Phase 1 workflow', async ({ page }) => {
  await page.goto('/workbook/phase/1')

  // Fill wheel of life
  await page.click('[data-testid="wheel-of-life"]')
  await page.fill('[name="career"]', '7')
  // ... complete worksheet

  // Navigate to next
  await page.click('[data-testid="next-worksheet"]')

  // Verify progress updates
  await expect(page.locator('[data-testid="phase-1-progress"]'))
    .toHaveText('1/11 complete')
})
```

### Visual Verification (Playwright MCP)

Use the connected Playwright MCP server to verify UI matches the landing page styling.

**When to Run Visual Checks:**
- After each worksheet component is built
- After each phase is complete
- During final integration

**Visual Check Process:**
```
1. mcp__playwright__browser_navigate → worksheet URL
2. mcp__playwright__browser_snapshot → get accessibility tree
3. Verify key elements exist (forms, buttons, headers)
4. mcp__playwright__browser_take_screenshot → save visual reference
5. Compare styling to landing page patterns
```

**Failsafe Rules (CRITICAL):**
| Scenario | Action |
|----------|--------|
| Playwright MCP unavailable | Log "VISUAL CHECK SKIPPED" and CONTINUE |
| Browser fails to connect | Retry once, then skip and CONTINUE |
| Screenshot fails | Log warning and CONTINUE |
| Max attempts per page | 2 |

**Key Principle**: Visual checks are **verification, not blocking** - never fail a build for visual issues.

**Design Reference Files:**
- **Landing Page (PRIMARY)**: `web/components/` - existing landing page has the target look/feel
- Colors: `mobile/src/theme/colors.ts`
- Typography: `mobile/src/theme/typography.ts`
- Components: `mobile/src/components/` (for mobile styling patterns)

**Key Visual Elements to Verify:**
- Cards with subtle shadows
- Gradient progress bars
- Rounded buttons (consistent radius)
- Form inputs with proper spacing
- Phase navigation sidebar styling
- Header/footer consistency

---

## Environment Variables

```env
# .env.local (web)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# RevenueCat Webhook
REVENUECAT_WEBHOOK_SECRET=whsec_...
```

---

## Acceptance Criteria

### Must Have (v1)
- [ ] Email authentication works
- [ ] RevenueCat webhook updates subscription status
- [ ] Non-subscribers redirected to landing page
- [ ] All 28 worksheets render and save (excl. 2 deferred)
- [ ] Auto-save works (30s debounce)
- [ ] Data syncs with mobile app
- [ ] Progress tracking accurate
- [ ] TypeScript compiles without errors
- [ ] All tests pass

### Nice to Have (v2)
- [ ] Vision board with image uploads
- [ ] Gratitude meditation player
- [ ] Dark mode toggle
- [ ] Keyboard shortcuts

---

## Deferred Features

| Feature | Reason | Target |
|---------|--------|--------|
| Vision Board | Image upload complexity | v2 |
| Gratitude Meditation | Requires audio player | v2 |
| Journal | Out of scope | v2+ |
| Guru AI Chat | Out of scope | v2+ |
| Meditation Library | Out of scope | Future |

---

## Key Reference Files

| Purpose | Path |
|---------|------|
| Worksheet types | `mobile/src/types/workbook.ts` |
| Workbook CRUD | `mobile/src/services/workbook.ts` |
| Zod validation | `packages/shared/src/validation/` |
| Database schema | `supabase/migrations/` |
| Feature gating | `docs/features/subscriptions/feature-gating.md` |

---

# Ralph Wiggum Execution Prompts

> Copy these prompts to run the Ralph Wiggum plugin for each phase.

## Foundation (Manual - Do First)

Before running Ralph loops, manually set up:
1. RevenueCat webhook in dashboard pointing to your domain
2. Basic Next.js structure (if not exists)

---

## Prompt: Shared Components

```
/ralph-loop "
Build shared UI components for the Manifest the Unseen web workbook.

## Project Context
- Next.js 14 App Router in web/ directory
- Tailwind CSS for styling
- TDD approach: Write tests FIRST

## Tasks
1. Create web/components/ui/Slider.tsx
   - Props: value, onChange, min=1, max=10, label
   - Test: renders, value changes, accessibility

2. Create web/components/ui/CardList.tsx
   - Props: items, onAdd, onRemove, renderItem
   - Test: renders items, add/remove works

3. Create web/components/ui/ProgressBar.tsx
   - Props: current, total, label
   - Test: renders percentage correctly

4. Create web/components/ui/AutoSaveIndicator.tsx
   - Props: status ('idle' | 'saving' | 'saved' | 'error')
   - Test: shows correct state

5. Create web/components/workbook/WorksheetLayout.tsx
   - Common layout wrapper for all worksheets
   - Header, content area, navigation

6. Create web/lib/supabase.ts
   - Supabase browser client setup

7. Create web/hooks/useAutoSave.ts
   - Debounced save hook (30s)

## Completion
When all components have passing tests and TypeScript compiles clean, output exactly:
'SHARED COMPONENTS COMPLETE'
" --max-iterations 30 --completion-promise "SHARED COMPONENTS COMPLETE"
```

---

## Prompt: Auth & Middleware

```
/ralph-loop "
Build authentication and subscription middleware for web workbook.

## Project Context
- Next.js 14 App Router
- Supabase Auth (email/password)
- Users table has subscription_tier and subscription_status columns

## Tasks
1. Create web/app/auth/login/page.tsx
   - Email + password form
   - Supabase signInWithPassword
   - Redirect to /workbook on success
   - Test: form renders, validation works, auth flow

2. Create web/app/auth/signup/page.tsx
   - Email + password + confirm password
   - Supabase signUp
   - Test: form validation, signup flow

3. Create web/app/auth/callback/route.ts
   - Handle auth callback from Supabase

4. Create web/middleware.ts
   - Protect /workbook/* routes
   - Check: user authenticated AND subscription_status = 'active'
   - Redirect to / if unauthorized
   - Test: blocks unauthenticated, blocks non-subscribers

5. Create web/hooks/useAuth.ts
   - Auth state hook
   - user, loading, signIn, signOut

6. Create web/hooks/useSubscription.ts
   - Check subscription_tier and subscription_status
   - Return: { isSubscribed, tier, expiresAt }

## Completion
When auth flow works end-to-end with tests passing, output exactly:
'AUTH COMPLETE'
" --max-iterations 25 --completion-promise "AUTH COMPLETE"
```

---

## Prompt: RevenueCat Webhook

```
/ralph-loop "
Build RevenueCat webhook handler for subscription sync.

## Project Context
- Next.js 14 API route
- Supabase service role client for admin updates
- RevenueCat sends webhooks on subscription events

## Tasks
1. Create web/app/api/webhooks/revenuecat/route.ts
   - POST handler
   - Validate webhook signature (X-RevenueCat-Signature header)
   - Extract: app_user_id, event.type, product_id, expiration_at_ms

2. Map product IDs to tiers:
   - manifest_novice_* → 'novice'
   - manifest_awakening_* → 'awakening'
   - manifest_enlightenment_* → 'enlightenment'

3. Map event types to status:
   - INITIAL_PURCHASE, RENEWAL → 'active'
   - CANCELLATION → 'canceled'
   - EXPIRATION → 'expired'
   - BILLING_ISSUE → 'billing_issue'

4. Update Supabase users table:
   - SET subscription_tier, subscription_status, subscription_expires_at
   - WHERE id = app_user_id

5. Tests:
   - Mock webhook payloads for each event type
   - Verify database updates correctly
   - Verify invalid signatures rejected

## Completion
When webhook handles all event types with passing tests, output exactly:
'WEBHOOK COMPLETE'
" --max-iterations 20 --completion-promise "WEBHOOK COMPLETE"
```

---

## Prompt: Phase 1 - Self-Evaluation

```
/ralph-loop "
Build Phase 1 (Self-Evaluation) worksheets for web workbook.

## Project Context
- Next.js 14 App Router in web/
- 11 worksheets in this phase
- TDD: Write tests FIRST, then implementation
- Data saves to workbook_progress table via Supabase

## Worksheets to Build

1. wheel-of-life
   - 8 sliders: career, health, relationships, finance, personalGrowth, family, recreation, spirituality
   - Each slider 1-10
   - SVG radar/bullseye chart visualization
   - Component: web/components/workbook/Phase1/WheelOfLifeEditor.tsx
   - Page: web/app/workbook/phase/1/wheel-of-life/page.tsx

2. swot-analysis
   - 4 quadrant grid (Strengths, Weaknesses, Opportunities, Threats)
   - Each quadrant is add/remove list
   - Component: SWOTEditor.tsx

3. habits-audit
   - Add/remove habit items
   - Each has: name, type (good/bad), frequency
   - Component: HabitsAuditEditor.tsx

4. values-assessment
   - Ranked list of values
   - Drag to reorder or number input
   - Component: ValuesEditor.tsx

5. abc-model
   - 3 text fields: Activating event, Belief, Consequence
   - Component: ABCModelEditor.tsx

6. strengths-weaknesses
   - Two column layout
   - Add/remove items per column
   - Component: StrengthsWeaknessesEditor.tsx

7. comfort-zone
   - Visualization of comfort/growth zones
   - Component: ComfortZoneEditor.tsx

8. know-yourself
   - Q&A format with predefined questions
   - Component: KnowYourselfEditor.tsx

9. abilities-rating
   - Multiple sliders for different abilities
   - Component: AbilitiesRatingEditor.tsx

10. thought-awareness
    - Journal/log format
    - Add thought entries with timestamps
    - Component: ThoughtAwarenessEditor.tsx

11. feel-wheel
    - Emotion selection wheel
    - Component: FeelWheelEditor.tsx

## For Each Worksheet
1. Create test file: web/__tests__/phase-1/[id].test.tsx
2. Test: renders, accepts input, saves to Supabase, loads existing data
3. Create component in web/components/workbook/Phase1/
4. Create page in web/app/workbook/phase/1/[id]/
5. Visual verification (if Playwright MCP available):
   - Navigate to page with mcp__playwright__browser_navigate
   - Take snapshot with mcp__playwright__browser_snapshot
   - Verify UI matches landing page styling
   - Take screenshot for reference

## Completion Criteria
- All 11 worksheets have passing tests
- TypeScript compiles without errors
- Components render in browser without console errors
- Visual check passed OR skipped with 'VISUAL CHECK SKIPPED' logged

## Failsafe
If Playwright MCP is unavailable or errors, log 'VISUAL CHECK SKIPPED' and continue.
Do NOT block completion for visual check failures.

When complete, output exactly: 'PHASE 1 TESTS PASS'
" --max-iterations 50 --completion-promise "PHASE 1 TESTS PASS"
```

---

## Prompt: Phase 2 - Values & Vision

```
/ralph-loop "
Build Phase 2 (Values & Vision) worksheets for web workbook.

## Worksheets (2 active, 1 deferred)

1. life-mission
   - Rich text editor for mission statement
   - Guidance prompts on the side
   - Component: LifeMissionEditor.tsx

2. purpose-statement
   - Text area with character count
   - Guiding questions
   - Component: PurposeStatementEditor.tsx

3. vision-board - SKIP (deferred to v2)

## Pattern
- Test first in web/__tests__/phase-2/
- Component in web/components/workbook/Phase2/
- Page in web/app/workbook/phase/2/[id]/

## Completion
When both worksheets work with passing tests, output exactly:
'PHASE 2 TESTS PASS'
" --max-iterations 20 --completion-promise "PHASE 2 TESTS PASS"
```

---

## Prompt: Phase 3 - Goal Setting

```
/ralph-loop "
Build Phase 3 (Goal Setting) worksheets for web workbook.

## Worksheets

1. smart-goals
   - SMART goal form: Specific, Measurable, Achievable, Relevant, Time-bound
   - Multiple goals support
   - Deadline date picker
   - Component: SMARTGoalEditor.tsx

2. timeline
   - Timeline visualization
   - Add milestones with dates
   - Component: TimelineEditor.tsx

3. action-plan
   - Ordered step list
   - Each step has: description, deadline, status
   - Component: ActionPlanEditor.tsx

## Completion
'PHASE 3 TESTS PASS'
" --max-iterations 25 --completion-promise "PHASE 3 TESTS PASS"
```

---

## Prompt: Phases 4-10

```
/ralph-loop "
Build remaining phases (4-10) for web workbook.

## Phase 4: Facing Fears (3 worksheets)
- fear-inventory: Cards with intensity slider (1-10)
- limiting-beliefs: Belief text → reframe text pairs
- fear-facing-plan: Action plan for facing fears

## Phase 5: Self-Love (3 worksheets)
- self-love-affirmations: Add/view affirmation cards
- self-care-routine: Routine items with frequency
- inner-child: Guided reflection text areas

## Phase 6: Manifestation (3 worksheets)
- 369-method: Daily tracker (3 morning, 6 afternoon, 9 evening)
- scripting: Rich text manifestation script
- woop-method: 4-step wizard (Wish, Outcome, Obstacle, Plan)

## Phase 7: Gratitude (2 active)
- gratitude-journal: Daily entries with multiple items + mood
- gratitude-letters: Letter text editor
- gratitude-meditation: SKIP (deferred)

## Phase 8: Envy to Inspiration (3 worksheets)
- envy-inventory: Card-based envy entries
- inspiration-reframe: Reframe text exercise
- role-models: Profile cards with qualities

## Phase 9: Trust & Surrender (3 worksheets)
- trust-assessment: Radar chart visualization
- surrender-practice: Guided surrender cards
- signs-tracking: Timeline of meaningful signs

## Phase 10: Graduation (3 worksheets)
- journey-review: Comprehensive reflection form
- future-letter: Long-form letter editor
- graduation: Certificate display with user name/date

## Pattern for Each
1. Write tests in web/__tests__/phase-X/
2. Build component in web/components/workbook/PhaseX/
3. Create page in web/app/workbook/phase/X/[id]/

## Completion
When ALL phases 4-10 have passing tests, output exactly:
'ALL PHASES COMPLETE'
" --max-iterations 100 --completion-promise "ALL PHASES COMPLETE"
```

---

## Final Integration Prompt

```
/ralph-loop "
Complete final integration and polish for web workbook.

## Tasks

1. Phase Navigator
   - Sidebar showing all 10 phases
   - Progress indicator per phase
   - Current phase highlighted
   - Component: web/components/workbook/PhaseNavigator.tsx

2. Workbook Dashboard
   - Page: web/app/workbook/page.tsx
   - Overall progress summary
   - Quick links to incomplete worksheets
   - Recent activity

3. Progress Page
   - Page: web/app/workbook/progress/page.tsx
   - Visual progress for all phases
   - Completion percentages
   - Time spent stats (if available)

4. Navigation Flow
   - Next/Previous worksheet buttons
   - Phase completion celebration
   - Redirect on phase complete

5. Responsive Design
   - Test all pages on tablet width (768px)
   - Ensure forms are usable on smaller screens

6. Error Handling
   - Network error states
   - Retry mechanisms
   - User-friendly error messages

7. Final Test Suite
   - Run all tests: npm test
   - Run Playwright e2e: npm run test:e2e
   - Fix any failures

## Completion
When dashboard, navigation, and all integration tests pass, output exactly:
'WEB WORKBOOK COMPLETE'
" --max-iterations 40 --completion-promise "WEB WORKBOOK COMPLETE"
```

---

## Execution Checklist

- [ ] Manual: Configure RevenueCat webhook in dashboard
- [ ] Run: Shared Components prompt
- [ ] Run: Auth & Middleware prompt
- [ ] Run: RevenueCat Webhook prompt
- [ ] Run: Phase 1 prompt
- [ ] Run: Phase 2 prompt
- [ ] Run: Phase 3 prompt
- [ ] Run: Phases 4-10 prompt
- [ ] Run: Final Integration prompt
- [ ] Manual: Test end-to-end with real subscription
- [ ] Manual: Deploy to production

---

*Generated for Ralph Wiggum iterative development*
