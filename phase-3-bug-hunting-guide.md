# Phase 3 Bug Hunting Guide

**Purpose:** Visual reference for identifying common bugs during manual testing

---

## Navigation Bugs to Watch For

### ❌ 404 Errors
**What to look for:**
- White page with "404 | This page could not be found"
- URL in address bar shows correct path but page doesn't load
- Console shows "Failed to fetch" or similar errors

**Where it might happen:**
- Clicking "Next Worksheet" button
- Clicking "Previous" button
- Clicking "Back to Phase 3" button
- Direct URL navigation

**Screenshot indicators:**
- Page shows error message instead of worksheet
- Browser console shows red errors
- Network tab shows 404 status codes

**Expected behavior:**
- All navigation should load valid pages
- No 404 errors in console
- Smooth transitions between pages

---

## Image Loading Bugs

### ❌ Broken Header Images
**What to look for:**
- Empty gray box where image should be
- Broken image icon (🖼️ with X)
- Alt text displays instead of image
- Very slow loading (>5 seconds)

**Expected behavior:**
- Header image loads within 1-2 seconds
- Image displays at full width (responsive)
- No broken image icons
- Lazy loading indicator (if applicable)

**How to verify:**
- Open DevTools → Network tab
- Filter by "Img"
- Look for 3 WebP files:
  - `goals_smart_goals.webp` (142 KB)
  - `goals_timeline.webp` (153 KB)
  - `goals_action_plan.webp` (166 KB)
- All should show "200" status code

---

## Button Positioning Bugs

### ❌ Missing Navigation Buttons
**What to look for:**
- Only one button visible (should be two)
- Buttons overlapping each other
- Buttons off-screen on mobile
- Buttons too small to click

**Expected layout:**

```
┌─────────────────────────────────────────────────┐
│ [← Previous]              [Next Worksheet →]    │
└─────────────────────────────────────────────────┘
     (left aligned)              (right aligned)
```

**Red flags:**
- Both buttons on same side
- Buttons stacked vertically on desktop
- "Previous" button on right side
- "Next" button on left side
- Buttons missing entirely

---

## Form Input Bugs

### ❌ Text Field Issues
**What to look for:**
- Can't click into text field
- Text invisible when typing
- Placeholder text doesn't disappear
- Field doesn't expand for long text
- Copy/paste doesn't work
- Special characters cause errors

**Test cases:**
- Type normal text: "My goal is to..."
- Type special characters: !@#$%^&*()
- Type emoji: 🎯 ⭐ 💪
- Paste long text (500+ characters)
- Backspace to clear field

**Expected behavior:**
- All text visible
- Field expands as needed (textarea)
- No character limit errors
- Emoji renders correctly

---

## Date Picker Bugs

### ❌ Calendar Issues
**What to look for:**
- Date picker doesn't open
- Can't select dates
- Selected date doesn't save
- Date format incorrect (MM/DD/YYYY vs DD/MM/YYYY)
- Past dates blocked when they shouldn't be
- Future dates blocked when they shouldn't be

**Test cases:**
- Select today's date
- Select date 1 year in past
- Select date 5 years in future
- Clear selected date
- Type date manually (if allowed)

**Expected behavior:**
- Calendar opens on click
- All dates selectable
- Date displays in readable format
- Date persists after save

---

## Auto-Save Bugs

### ❌ Save Status Issues
**What to look for:**
- Auto-save indicator stuck on "Saving..." forever
- No save indicator visible
- Indicator shows "Error" but no error message
- Changes don't persist after refresh
- Multiple save attempts in rapid succession

**How to test:**
1. Make a change (add goal/milestone/step)
2. Wait 30 seconds
3. Watch auto-save indicator
4. Expected: "Saving..." → "Saved at HH:MM:SS"
5. Refresh page
6. Expected: Data still present

**Red flags:**
- Indicator never changes from "Idle"
- "Saving..." for >5 seconds
- "Error" with no details
- Data lost after refresh

---

## Data Persistence Bugs

### ❌ Lost Data
**What to look for:**
- Add item → refresh → item gone
- Edit item → refresh → changes lost
- Complete milestone → refresh → status reset
- Reorder steps → refresh → order reset

**Critical test:**
1. Add 3 goals with full details
2. Wait for auto-save
3. Navigate to timeline
4. Add 3 milestones
5. Navigate to action plan
6. Add 3 steps
7. Close browser entirely
8. Reopen and login
9. Navigate back to Phase 3
10. **Expected:** All data still present

**If data is lost:**
- Check browser console for errors
- Check Network tab for failed POST requests
- Check Supabase dashboard for records
- Check user_id matching

---

## Reordering Bugs (Action Plan)

### ❌ Step Number Issues
**What to look for:**
- Step numbers don't update after reorder
- Steps swap but numbers stay same
- Gap in numbering (1, 2, 4, 5 - missing 3)
- Duplicate numbers (1, 2, 2, 3)
- Arrows don't disable correctly

**Test scenario:**
```
Initial:
1. First step
2. Second step
3. Third step
4. Fourth step

Click UP on step 3:

Expected:
1. First step
2. Third step  ← Moved up
3. Second step
4. Fourth step

Wrong:
1. First step
2. Second step
3. Third step  ← Didn't move
4. Fourth step
```

**How to verify:**
- Numbers are sequential (1, 2, 3, 4...)
- Content matches new position
- Top step has disabled UP arrow
- Bottom step has disabled DOWN arrow

---

## Status Change Bugs

### ❌ Status Not Updating
**What to look for:**
- Dropdown selection doesn't change
- Badge color doesn't update
- Line-through style doesn't apply/remove
- Progress summary doesn't recalculate
- Status reverts after refresh

**Test scenario (Action Plan):**
1. Add step (default: "Not Started" - gray)
2. Change to "In Progress"
3. **Expected:** Badge turns blue
4. **Expected:** Progress summary shows 1 in "In Progress"
5. Change to "Completed"
6. **Expected:** Badge turns green
7. **Expected:** Text has line-through
8. **Expected:** Progress bar increases

**Test scenario (Timeline):**
1. Add milestone (default: incomplete)
2. Check completion checkbox
3. **Expected:** Dot turns green
4. **Expected:** Title has line-through
5. **Expected:** "Completed" count increases
6. Uncheck
7. **Expected:** Reverts to original state

---

## Visual Alignment Bugs

### ❌ Layout Issues
**What to look for:**
- Text overlapping other text
- Buttons cut off on mobile
- Images stretched/squashed
- Excessive white space
- Content off-center
- Scrollbars appearing unexpectedly

**Breakpoints to test:**
- 375px (iPhone SE)
- 768px (iPad)
- 1024px (Laptop)
- 1920px (Desktop)

**Common issues:**
- Grid columns stack incorrectly
- Buttons too small on mobile (<44px tap target)
- Text too small to read (<16px)
- Forms wider than viewport

---

## Progress Calculation Bugs

### ❌ Math Errors
**What to look for:**
- Percentage shows >100%
- Percentage shows negative value
- Division by zero error
- Counts don't match reality
- Progress bar overflows container

**SMART Goals (no progress summary):**
- N/A

**Timeline Progress Summary:**
```javascript
// Expected calculation
Total Milestones: 5
Completed: 2
Overdue: 1
% Complete: (2 / 5) * 100 = 40%

// Bug example:
% Complete: 250% ← Wrong!
```

**Action Plan Progress Summary:**
```javascript
// Expected calculation
Total Steps: 10
Completed: 3
In Progress: 2
% Complete: (3 / 10) * 100 = 30%

// Progress bar width: 30%

// Bug example:
% Complete: 30%
Progress bar width: 130% ← Overflows!
```

---

## Empty State Bugs

### ❌ Missing Empty States
**What to look for:**
- Blank white area when no items
- No instructions on what to do
- No "Add First" button
- Confusing messaging

**Expected empty states:**

**SMART Goals:**
- Gray dashed border box
- Clipboard icon
- "No goals yet. Create your first SMART goal!"
- "Create First Goal" button (purple)

**Timeline:**
- Gray dashed border box
- Graph/chart icon
- "No milestones yet. Add your first milestone above!"

**Action Plan:**
- Gray dashed border box
- Clipboard icon
- "No steps yet. Add your first action step above!"

**What's wrong:**
- Just shows "[]" or "undefined"
- No visual indication what to do
- Error message instead of empty state

---

## Console Error Patterns

### ❌ Common React Errors

**Key Mismatch:**
```
Warning: Each child in a list should have a unique "key" prop.
```
**Impact:** List items may not update correctly

**Hydration Mismatch:**
```
Error: Hydration failed because the initial UI does not match what was rendered on the server.
```
**Impact:** Page may flash/rerender, data may be lost

**State Update Warning:**
```
Warning: Cannot update a component while rendering a different component.
```
**Impact:** Infinite loops, performance issues

**Network Error:**
```
POST https://xxx.supabase.co/rest/v1/workbook_progress 401 Unauthorized
```
**Impact:** Data not saving, authentication issue

---

## Performance Red Flags

### ❌ Slow Operations
**What to look for:**
- Button click delay >500ms
- Form typing lag
- Scroll jank (stuttering)
- Memory leaks (tab crashes after 5 min)
- CPU at 100% in Task Manager

**Benchmarks:**
- Auto-save should complete in <500ms
- Page navigation should be instant (<100ms)
- Image load should be <2s
- Typing should have zero lag

**How to measure:**
- DevTools → Performance tab
- Record interaction
- Look for red bars (long tasks >50ms)
- Check memory usage over time

---

## Mobile-Specific Bugs

### ❌ Touch Issues
**What to look for:**
- Button requires multiple taps
- Tap targets too small (<44px)
- Zoom required to read text
- Form fields don't open keyboard
- Keyboard covers input field
- Can't scroll form when keyboard open

**Test gestures:**
- Single tap (buttons)
- Long press (no custom menu)
- Swipe (scroll only, no gestures)
- Pinch zoom (should be disabled on form fields)

---

## Accessibility Bugs

### ❌ A11y Issues
**What to look for:**
- Can't tab to all interactive elements
- No focus indicator (invisible focus)
- Poor color contrast (text hard to read)
- Images missing alt text
- Buttons with no labels (just icons)
- Screen reader announces wrong info

**Quick tests:**
- Tab through entire page (keyboard only)
- Use screen reader (VoiceOver/TalkBack)
- Check contrast with tool (https://webaim.org/resources/contrastchecker/)

---

## How to Report Bugs

### Bug Report Template

```
## Bug Title
[Short description]

## Severity
[ ] Critical (blocks usage)
[ ] High (major issue)
[ ] Medium (annoying)
[ ] Low (cosmetic)

## Worksheet
[ ] SMART Goals
[ ] Timeline
[ ] Action Plan

## Steps to Reproduce
1. Navigate to...
2. Click on...
3. Enter...
4. Observe...

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happened]

## Screenshot
[Attach screenshot if possible]

## Console Errors
[Copy/paste any errors from console]

## Environment
- Browser: [Chrome 120]
- OS: [Windows 11]
- Screen size: [1920x1080]
- Device: [Desktop/Mobile]

## Additional Notes
[Any other relevant info]
```

---

## Critical Bugs vs. Minor Bugs

### 🔴 CRITICAL (Stop the release)
- Data loss (auto-save not working)
- Can't navigate between worksheets
- Page crashes/white screen
- Images don't load at all
- Can't add any items
- 401/403 errors (auth issues)

### 🟡 HIGH (Fix before TestFlight)
- Some navigation broken
- Calculations wrong
- Progress not updating
- Mobile unusable
- Accessibility issues

### 🟢 MEDIUM (Fix before production)
- Visual misalignment
- Slow performance
- Minor typos
- Console warnings

### ⚪ LOW (Nice to have)
- Color inconsistencies
- Minor UX improvements
- Extra features

---

## When in Doubt, Screenshot It

**Always capture:**
1. The bug in action (before screenshot)
2. Expected behavior (comparison screenshot)
3. Browser console (errors)
4. Network tab (failed requests)
5. Full page context (not just the bug area)

**Tools:**
- Windows: Win + Shift + S
- Mac: Cmd + Shift + 4
- Browser DevTools: Right-click → "Capture screenshot"

---

**Remember:** The goal is to catch bugs NOW before users find them. Be thorough!
