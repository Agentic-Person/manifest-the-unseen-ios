# Workbook System Workstream

**Status**: Not Started
**Timeline**: Weeks 5-12 (Phase 1-2)
**Priority**: P0 - Core Product Value

---

## Overview

The workbook system is the heart of Manifest the Unseen. It digitizes the complete 202-page workbook into 10 interactive phases with forms, progress tracking, and auto-save. Users work through self-evaluation, goal setting, manifestation techniques, and more.

## Timeline

- **Planning**: Weeks 2-4
- **Implementation**: Weeks 5-12
  - Weeks 5-6: Phases 1-3
  - Weeks 9-10: Phases 4-7
  - Weeks 11-12: Phases 8-10 + Progress System
- **Testing**: Week 12
- **Ongoing**: Content updates, bug fixes

## Key Agents Involved

- **Primary**: Forms & Data Specialist (forms, validation, auto-save)
- **Support**: Frontend Specialist (UI, progress dashboard), Backend Specialist (database, RLS)
- **Review**: Code Review Agent (form quality), Accessibility Review Agent (VoiceOver)

## Key Tasks

### Phase 1 Implementation (Weeks 5-6)
1. **Database Schema** (Backend Specialist)
   - workbook_progress table
   - JSONB data field for flexibility
   - RLS policies
   - Indexes

2. **Form Builder System** (Forms & Data Specialist)
   - Reusable form components (text, number, slider, radio, checkbox)
   - React Hook Form + Zod validation
   - Auto-save (every 30 seconds)

3. **Phase 1: Self-Evaluation** (Forms & Data Specialist)
   - Wheel of Life (8 areas)
   - Feel Wheel
   - Habit tracking
   - SWOT analysis
   - Values, strengths, comfort zone

4. **Phase 2: Values & Vision** (Forms & Data Specialist)
   - Core values clarification
   - Vision board planning
   - Life purpose
   - Future self visualization

5. **Phase 3: Goal Setting** (Forms & Data Specialist)
   - SMART goals framework
   - Action plans
   - Milestones
   - Timeline

### Phase 2 Implementation (Weeks 9-10)
6. **Phases 4-7** (Forms & Data Specialist)
   - Phase 4: Facing Fears & Limiting Beliefs
   - Phase 5: Self-Love & Self-Care
   - Phase 6: Manifestation Techniques (9 methods)
   - Phase 7: Gratitude

### Final Implementation (Weeks 11-12)
7. **Phases 8-10** (Forms & Data Specialist)
   - Phase 8: Envy → Inspiration
   - Phase 9: Trust & Surrender
   - Phase 10: Letting Go

8. **Progress Dashboard** (Frontend Specialist)
   - Overall completion %
   - Phase breakdown
   - Streak counter
   - Achievements
   - Visual timeline

9. **Export to PDF** (Backend Specialist + Frontend Specialist)

## Dependencies

**Blocks**:
- None (core feature)

**Blocked By**:
- Authentication (must be logged in)
- Supabase database setup

## Success Metrics

- Users complete Phase 1 in < 20 minutes
- Auto-save success rate > 99%
- Phase completion rate > 60% for Phase 1
- Zero data loss incidents
- Forms are intuitive (feedback from beta)

## Testing Checklist

- [ ] All 10 phases functional
- [ ] Forms validate correctly
- [ ] Auto-save works every 30 seconds
- [ ] Progress tracks accurately
- [ ] Can navigate between phases
- [ ] Export to PDF generates correctly
- [ ] Offline editing works (syncs when online)
- [ ] VoiceOver users can complete forms

## Technical Details

**Database Structure**:
```sql
CREATE TABLE workbook_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  phase_number INT NOT NULL,
  worksheet_id TEXT NOT NULL,
  data JSONB NOT NULL, -- Flexible storage
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, phase_number, worksheet_id)
);
```

**Form Patterns**:
- React Hook Form for state management
- Zod schemas for validation
- TanStack Query mutations for saving
- Optimistic updates for instant UX

**Auto-Save**:
- Debounced save every 30 seconds
- Save on form blur
- Save before navigation
- Retry on failure

## Workbook Content Breakdown

### Phase 1: Self-Evaluation (14 worksheets)
Wheel of Life, Feel Wheel, Habits, ABC Model, SWOT, Values, Strengths, Comfort Zone, Know Yourself, Abilities, Thought Awareness

### Phase 2: Values & Vision (5 worksheets)
Core Values, Vision Board Planning, Life Purpose, Priorities, Future Self

### Phase 3: Goal Setting (5 worksheets)
SMART Goals, Action Plan, Milestones, Timeline, Checkpoints

### Phase 4: Facing Fears (7 worksheets)
Decatastrophizing, Thoughts on Trial, Reframing, Limiting Beliefs, Cognitive Restructuring, Core Beliefs, Letter to Past Self

### Phase 5: Self-Love & Self-Care (5 worksheets)
Self-Care Routines, Self-Compassion, Boundaries, Affirmations, Daily Rituals

### Phase 6: Manifestation Techniques (9 methods)
3-6-9 Method, WOOP, Visualization, 21-Day Money Challenge, Mirror Method, Scripting, Knot Method, Discount Trigger, Gratitude Blitz

### Phase 7: Practicing Gratitude (4 worksheets)
Daily Gratitude, Prompts, Recognition, Appreciation Tracking

### Phase 8: Envy → Inspiration (3 worksheets)
Envy Transformation, Inspiration Board, Mindset Shift

### Phase 9: Trust & Surrender (4 worksheets)
Letting Go, Trust-Building, Surrender Practices, Faith Development

### Phase 10: Trust & Letting Go (4 worksheets)
Final Integration, Release Rituals, Future Timeline, Completion Ceremony

## Resources

- **PRD**: Section 3.1.1 - Digital Workbook System
- **TDD**: Section 5 - React Native Implementation (Forms)
- **Workbook PDF**: `/docs/pdf.net_ManifestTheUnseen-Workbook_compressed.pdf`

## Current Status

**Not Started**

## Notes

(Add implementation notes here as work progresses)
