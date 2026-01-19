# Phase 3 Manual Testing Checklist

**Date:** _____________
**Tester:** _____________
**Browser:** _____________
**Device:** _____________

---

## Pre-Test Setup

- [ ] Server running at `http://localhost:3003`
- [ ] Logged in with test user account
- [ ] Browser cache cleared
- [ ] DevTools console open (check for errors)

---

## Test 1: SMART Goals Worksheet

**URL:** `http://localhost:3003/workbook/phase/3/smart-goals`

### Visual & Layout
- [ ] Header image loads (`goals_smart_goals.webp`)
- [ ] Title displays: "SMART Goals"
- [ ] Description displays correctly
- [ ] Auto-save indicator visible (top right)
- [ ] SMART framework reference card visible (S-M-A-R-T breakdown)
- [ ] Info banner present (purple background)

### Navigation Buttons (Top)
- [ ] "Back to Phase 3" button present (left)
- [ ] "Next Worksheet" button present (right)
- [ ] Both buttons have proper styling

### Navigation Buttons (Bottom)
- [ ] Same buttons present at bottom
- [ ] Buttons are mirrors of top navigation

### Empty State
- [ ] Empty state shows "No goals yet" message
- [ ] "Create First Goal" button is prominent
- [ ] Click button → form appears

### Form Functionality
- [ ] Click "Create First Goal" → goal card appears
- [ ] Goal number badge shows "1"
- [ ] Title field editable
- [ ] All 5 SMART fields present:
  - [ ] Specific (blue border)
  - [ ] Measurable (green border)
  - [ ] Achievable (yellow border)
  - [ ] Relevant (orange border)
  - [ ] Time-bound (red border)
- [ ] Deadline date picker works
- [ ] "Done" button toggles to summary view
- [ ] Summary view shows filled fields in colored boxes
- [ ] "Edit" button returns to edit mode
- [ ] Delete button (X) removes goal

### Multi-Goal Testing
- [ ] Click "+ Add Another Goal" button
- [ ] Second goal appears with number "2"
- [ ] Edit first goal while second exists
- [ ] Both goals save independently

### Auto-Save
- [ ] Wait 30 seconds after editing
- [ ] Auto-save indicator changes to "Saving..."
- [ ] Indicator changes to "Saved" with timestamp
- [ ] Refresh page → data persists

### Navigation
- [ ] Click "Next Worksheet" → navigates to timeline
- [ ] Use browser back → returns to SMART goals
- [ ] Click "Back to Phase 3" → returns to phase overview
- [ ] Navigate back to SMART goals → data still present

**Issues Found:**
_________________________________________________________
_________________________________________________________

---

## Test 2: Timeline Worksheet

**URL:** `http://localhost:3003/workbook/phase/3/timeline`

### Visual & Layout
- [ ] Header image loads (`goals_timeline.webp`)
- [ ] Title displays: "Goal Timeline"
- [ ] Description displays correctly
- [ ] Auto-save indicator visible
- [ ] Info banner present (blue background)
- [ ] "Add New Milestone" form card visible (purple gradient)

### Navigation Buttons
- [ ] "Previous" button present (top and bottom)
- [ ] "Next Worksheet" button present (top and bottom)
- [ ] Previous button links to SMART goals

### Empty State
- [ ] Empty state shows "No milestones yet"
- [ ] Instruction text: "Add your first milestone above!"
- [ ] Graph icon visible

### Form Functionality
- [ ] Milestone Title field accepts text
- [ ] Target Date field opens date picker
- [ ] Description field accepts text (optional)
- [ ] "Add Milestone" button disabled when title/date empty
- [ ] Button enabled when both required fields filled
- [ ] Click "Add Milestone" → milestone appears on timeline

### Timeline Visual
- [ ] Vertical purple line appears
- [ ] Milestone dot appears on timeline
- [ ] Dot color: purple (upcoming)
- [ ] Milestone card shows:
  - [ ] Title
  - [ ] Formatted date (long format)
  - [ ] Description (if provided)
  - [ ] Completion checkbox
  - [ ] Delete button

### Multi-Milestone Testing
- [ ] Add 3 more milestones with different dates
- [ ] Verify auto-sort by date (earliest to latest)
- [ ] Add a past-date milestone
- [ ] Verify "Overdue" badge appears
- [ ] Verify dot is orange for overdue

### Status Testing
- [ ] Click completion checkbox on a milestone
- [ ] Dot changes to green
- [ ] Title gets line-through style
- [ ] Progress summary updates
- [ ] Click again → reverts to incomplete

### Progress Summary
- [ ] "Total Milestones" count correct
- [ ] "Completed" count correct
- [ ] "Overdue" count correct
- [ ] Percentage calculation correct

### Auto-Save & Navigation
- [ ] Wait 30 seconds → auto-save triggers
- [ ] Refresh page → all milestones persist
- [ ] Click "Next Worksheet" → navigates to action plan
- [ ] Click "Previous" → returns to SMART goals

**Issues Found:**
_________________________________________________________
_________________________________________________________

---

## Test 3: Action Plan Worksheet

**URL:** `http://localhost:3003/workbook/phase/3/action-plan`

### Visual & Layout
- [ ] Header image loads (`goals_action_plan.webp`)
- [ ] Title displays: "Action Plan"
- [ ] Description displays correctly
- [ ] Auto-save indicator visible
- [ ] Info banner present (purple background)
- [ ] "Add New Step" form card visible (blue gradient)

### Navigation Buttons
- [ ] "Previous" button present (top and bottom)
- [ ] "Next Worksheet" button present (top and bottom)
- [ ] Previous button links to timeline
- [ ] Next button should go to Phase 4

### Empty State
- [ ] Empty state shows "No steps yet"
- [ ] Instruction text visible
- [ ] Clipboard icon visible

### Form Functionality
- [ ] Step Description field accepts text
- [ ] Deadline field opens date picker (optional)
- [ ] "Add Step" button disabled when description empty
- [ ] Button enabled when description filled
- [ ] Press Enter key → adds step (keyboard shortcut)
- [ ] Click "Add Step" → step appears in list

### Step Display
- [ ] Step has number badge "1"
- [ ] Description text visible
- [ ] Status dropdown shows "Not Started" (gray)
- [ ] Deadline shows if provided
- [ ] Delete button (X) present
- [ ] Reorder arrows present (↑ ↓)

### Multi-Step Testing
- [ ] Add 5 steps total
- [ ] Verify numbering: 1, 2, 3, 4, 5
- [ ] First step: up arrow disabled
- [ ] Last step: down arrow disabled

### Reordering
- [ ] Click up arrow on step 3
- [ ] Verify step 3 becomes step 2
- [ ] Numbering updates correctly
- [ ] Click down arrow on step 2
- [ ] Verify step 2 becomes step 3 again

### Status Changes
- [ ] Change step 1 status to "In Progress"
- [ ] Badge color changes to blue
- [ ] Progress summary updates
- [ ] Change step 2 status to "Completed"
- [ ] Badge color changes to green
- [ ] Text gets line-through style
- [ ] Progress summary updates

### Progress Summary
- [ ] "Total Steps" count correct
- [ ] "Completed" count correct
- [ ] "In Progress" count correct
- [ ] Percentage calculation correct
- [ ] Progress bar fills correctly (purple-blue gradient)
- [ ] Progress bar width matches percentage

### Delete Testing
- [ ] Delete a middle step
- [ ] Numbering updates (no gaps)
- [ ] Progress summary recalculates
- [ ] Delete first step
- [ ] Delete last step

### Auto-Save & Navigation
- [ ] Wait 30 seconds → auto-save triggers
- [ ] Refresh page → all steps persist
- [ ] Click "Next Worksheet"
- [ ] **Expected:** Navigate to `/workbook/phase/4` (next phase)
- [ ] Verify Phase 4 page loads

**Issues Found:**
_________________________________________________________
_________________________________________________________

---

## Test 4: Data Persistence (Critical)

### Return to Worksheets
- [ ] Navigate back to `/workbook/phase/3/smart-goals`
- [ ] Verify all goals still present
- [ ] Verify all field values correct
- [ ] Navigate to timeline
- [ ] Verify all milestones present
- [ ] Verify completion status preserved
- [ ] Navigate to action plan
- [ ] Verify all steps present
- [ ] Verify order preserved
- [ ] Verify status preserved

### Cross-Browser Testing
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge

**Data Persistence Issues:**
_________________________________________________________
_________________________________________________________

---

## Test 5: Edge Cases

### SMART Goals
- [ ] Try to save goal with empty title → should allow
- [ ] Enter very long text (500+ chars) in fields
- [ ] Enter special characters (!@#$%^&*)
- [ ] Enter emoji in text fields
- [ ] Create 10+ goals → verify scrolling works

### Timeline
- [ ] Add milestone without title → button disabled ✓
- [ ] Add milestone without date → button disabled ✓
- [ ] Enter past date (1 year ago)
- [ ] Enter future date (5 years ahead)
- [ ] Add 20 milestones → verify timeline scrolls

### Action Plan
- [ ] Add step without description → button disabled ✓
- [ ] Reorder when only 1 step → arrows disabled ✓
- [ ] Rapid clicks on reorder arrows
- [ ] Change status rapidly (3 clicks in 1 second)
- [ ] Add 30 steps → verify performance

**Edge Case Issues:**
_________________________________________________________
_________________________________________________________

---

## Test 6: Responsive Design

### Mobile (375px width)
- [ ] Open DevTools → Responsive mode
- [ ] Set width to 375px (iPhone SE)
- [ ] Navigate to SMART goals
- [ ] Verify form is usable
- [ ] Verify buttons are tappable
- [ ] Repeat for timeline
- [ ] Repeat for action plan

### Tablet (768px width)
- [ ] Set width to 768px (iPad)
- [ ] Verify grid layouts adapt
- [ ] Verify all worksheets usable

### Desktop (1920px width)
- [ ] Set width to 1920px
- [ ] Verify max-width constraint (4xl = 896px)
- [ ] Content centered properly

**Responsive Issues:**
_________________________________________________________
_________________________________________________________

---

## Test 7: Accessibility

### Keyboard Navigation
- [ ] Tab through all buttons
- [ ] Focus indicators visible
- [ ] Enter key works on buttons
- [ ] Escape key closes modals (if any)

### Screen Reader
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Button labels read correctly
- [ ] Form fields have labels
- [ ] Images have alt text

**Accessibility Issues:**
_________________________________________________________
_________________________________________________________

---

## Test 8: Console Errors

### Check Developer Console
- [ ] Navigate to each worksheet
- [ ] Check for console errors (red text)
- [ ] Check for console warnings (yellow text)
- [ ] Note any network errors (404s, 500s)

**Console Errors Found:**
_________________________________________________________
_________________________________________________________

---

## Test 9: Network Tab

### Monitor Network Activity
- [ ] Open DevTools → Network tab
- [ ] Navigate to SMART goals
- [ ] Verify images load (200 status)
- [ ] Make an edit
- [ ] Wait for auto-save
- [ ] Verify Supabase POST request (200 status)
- [ ] Check request payload (should be JSON)

**Network Issues:**
_________________________________________________________
_________________________________________________________

---

## Final Sign-Off

### Overall Assessment
- [ ] All 3 worksheets functional
- [ ] All navigation works correctly
- [ ] All images load
- [ ] Auto-save working
- [ ] No critical bugs found

### Recommendations
Priority 1 (Must Fix Before TestFlight):
_________________________________________________________
_________________________________________________________

Priority 2 (Fix Before Production):
_________________________________________________________
_________________________________________________________

Priority 3 (Nice to Have):
_________________________________________________________
_________________________________________________________

### Approval
**Status:** [ ] PASS  [ ] FAIL  [ ] PASS WITH CONDITIONS

**Tester Signature:** _____________
**Date:** _____________

**Notes:**
_________________________________________________________
_________________________________________________________
_________________________________________________________
_________________________________________________________
