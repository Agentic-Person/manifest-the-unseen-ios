# Phase 1 Dark Theme Redesign - Agent Orchestration Plan

**Created**: 2025-01-13
**Status**: READY FOR EXECUTION
**Estimated Time**: 3-4 hours with parallel agents
**Files to Modify**: 15 files total (1 config, 13 components, 1 pattern directory)

---

## Executive Summary

Transform all 11 Phase 1 worksheets from bright white corporate design to dark mystical theme matching the mobile app aesthetic.

**User Decisions (Confirmed)**:
- ✅ Moderate mystical intensity (subtle sacred geometry backgrounds at 5% opacity)
- ✅ Minimal hover interactions (color changes only, no glows)
- ✅ Gradient buttons (deep-purple to royal-purple)
- ✅ Keep green autosave indicator

---

## Color Palette Reference

### Core Colors (Add to Tailwind Config)
```typescript
// Backgrounds
'deep-charcoal': '#1a1a2e',      // Primary background
'dark-slate-blue': '#16213e',    // Alternative background
'elevated': '#252547',            // Cards (UPDATE from #22222E)

// Text
'enlightened': '#e8e8e8',        // Primary text (UPDATE from #F5F0E6)
'muted-wisdom': '#a0a0b0',       // Secondary text (UPDATE from #A09080)
'subtle-hint': '#6b6b80',        // Tertiary text (NEW)

// Primary Accents
'deep-purple': '#4a1a6b',        // PRIMARY accent (NEW)
'royal-purple': '#6b2d8b',       // Highlights (NEW)
'indigo-depth': '#2d1b4e',       // Gradients (NEW)

// SWOT Colors
'forest-green': '#2d5a4a',       // Strengths (exists as heart-emerald)
'deep-amber': '#8b6914',         // Weaknesses (exists as burnished-bronze)
'deep-teal': '#1a5f5f',          // Opportunities (exists)
'burgundy': '#6b2d3d',           // Threats (NEW)

// Emotion/Chakra Colors (keep existing)
'aged-gold': '#C4A052',
'amber-glow': '#D4A84B',
'deep-rose': '#8b3a5f',
'sacral-orange': '#C4702C',
'root-crimson': '#7A3333',
```

### Custom Shadows
```typescript
boxShadow: {
  'mystical': '0 4px 20px rgba(74, 26, 107, 0.3)',
  'elevated-card': '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
}
```

### Global Find/Replace Pattern
```
text-gray-900 → text-enlightened
text-gray-700 → text-muted-wisdom
text-gray-600 → text-muted-wisdom
text-gray-500 → text-subtle-hint
bg-white → bg-elevated
bg-gray-50 → bg-elevated
border-gray-200 → border-deep-purple/30
border-gray-300 → border-deep-purple/50
bg-purple-600 → bg-gradient-to-r from-deep-purple to-royal-purple
```

### Hover States (Minimal)
```css
// Buttons
hover:bg-deep-purple/90

// Interactive cards/items
hover:bg-elevated/80

// NO shadow-mystical on hover (user chose minimal)
// NO scale transforms
```

---

## Execution Plan

### ROUND 0: Foundation (Orchestrator Does This - 5 min)

**Task**: Update Tailwind configuration to enable all color classes

**File**: `web/tailwind.config.ts`

**Actions**:
1. Add missing colors to `theme.extend.colors`:
   - `deep-charcoal`, `deep-purple`, `royal-purple`, `indigo-depth`
   - `burgundy`, `subtle-hint`

2. Update existing colors:
   - `enlightened`: '#e8e8e8'
   - `muted-wisdom`: '#a0a0b0'
   - `elevated`: '#252547'

3. Add custom shadows to `theme.extend.boxShadow`:
   - `mystical`
   - `elevated-card`

4. Run `npm run build` to verify Tailwind compilation

**Success Criteria**:
- ✅ TypeScript compiles
- ✅ No Tailwind errors
- ✅ All color classes available

---

### ROUND 1: Core Components + Complex Worksheets (5 Parallel Agents - 1 hour)

Launch all 5 agents in a **SINGLE MESSAGE** with multiple Task tool calls.

#### Agent 1: WorksheetLayout Component

**File**: `web/components/workbook/WorksheetLayout.tsx`

**Critical**: This wraps ALL worksheets - must be perfect

**Changes**:
- Line ~41: Page wrapper → `bg-deep-charcoal`
- Line ~56: Title → `text-enlightened`
- Line ~58: Description → `text-muted-wisdom`
- Line ~63: Divider → `bg-gradient-to-r from-deep-purple to-royal-purple`
- Line ~67: Content card → `bg-elevated shadow-elevated-card border border-deep-purple/30`
- Line ~78: Previous button → `bg-elevated border-deep-purple/50 text-muted-wisdom hover:bg-elevated/80`
- Line ~103: Next button → `bg-gradient-to-r from-deep-purple to-royal-purple text-enlightened hover:bg-deep-purple/90`
- AutoSave indicator: Keep green (#10b981) - DO NOT CHANGE

**Success Criteria**:
- ✅ Dark background throughout
- ✅ All text readable (enlightened color)
- ✅ Gradient buttons
- ✅ TypeScript compiles

---

#### Agent 2: Slider Component

**File**: `web/components/ui/Slider.tsx`

**Used By**: WheelOfLifeEditor, AbilitiesRatingEditor, FeelWheelEditor

**Changes**:
- Track background → `bg-elevated`
- Active fill → `bg-gradient-to-r from-deep-purple to-royal-purple`
- Thumb → `bg-deep-purple border-enlightened/20`
- Labels → `text-muted-wisdom`
- Value display → `text-enlightened`

**Success Criteria**:
- ✅ Slider visible on dark background
- ✅ Active portion clearly shows gradient
- ✅ TypeScript compiles

---

#### Agent 3: WheelOfLifeEditor (COMPLEX - Recharts)

**File**: `web/components/workbook/Phase1/WheelOfLifeEditor.tsx`

**Complexity**: Contains Recharts radar chart requiring inline style updates

**Changes**:

1. **Recharts Theme** (CRITICAL - inline styles):
```tsx
<PolarGrid stroke="rgba(160, 160, 176, 0.2)" />
<PolarAngleAxis tick={{ fill: '#a0a0b0' }} />
<PolarRadiusAxis tick={{ fill: '#6b6b80' }} />
<Radar
  stroke="#4a1a6b"
  fill="#4a1a6b"
  fillOpacity={0.4}
/>
<Tooltip
  contentStyle={{
    backgroundColor: '#252547',
    border: '1px solid rgba(74, 26, 107, 0.5)',
    color: '#e8e8e8',
    borderRadius: '8px'
  }}
/>
```

2. **Summary cards**:
- Keep chakra colors for icons (career, health, etc.)
- Card backgrounds → `bg-elevated border-deep-purple/30`
- Text → `text-enlightened` and `text-muted-wisdom`

3. **Instruction box**:
- `bg-elevated border-deep-purple/30` instead of purple-50

**Success Criteria**:
- ✅ Radar chart visible on dark background
- ✅ Chart colors muted (deep purple, not bright)
- ✅ Summary cards readable
- ✅ TypeScript compiles

---

#### Agent 4: SWOTEditor (CRITICAL - Wrong Colors)

**File**: `web/components/workbook/Phase1/SWOTEditor.tsx`

**HIGHEST PRIORITY**: Currently using COMPLETELY WRONG colors

**Critical Color Fixes**:

**Strengths Quadrant**:
- Container: `bg-elevated border-2 border-forest-green/50 rounded-xl`
- Header icon: `bg-forest-green`
- Header text: `text-forest-green`
- Description: `text-muted-wisdom`
- Item cards: `bg-deep-charcoal border-forest-green/30`
- Item text: `text-enlightened`
- Input border: `border-forest-green/30`
- Add button: `bg-forest-green text-enlightened hover:bg-forest-green/90`

**Weaknesses Quadrant**:
- Same pattern but use `deep-amber` (#8b6914)

**Opportunities Quadrant**:
- Same pattern but use `deep-teal` (#1a5f5f)

**Threats Quadrant**:
- Same pattern but use `burgundy` (#6b2d3d)

**Summary Section**:
- Background: `bg-elevated border-deep-purple/30`
- Stats text: `text-enlightened`
- Badges: Use matching quadrant colors

**Current Wrong Colors to Remove**:
- ❌ Bright green (#10b981)
- ❌ Bright red (#ef4444)
- ❌ Bright blue (#3b82f6)
- ❌ Bright orange (#f59e0b)

**Success Criteria**:
- ✅ SWOT colors match design spec exactly
- ✅ All four quadrants clearly differentiated
- ✅ Text readable on dark backgrounds
- ✅ TypeScript compiles

---

#### Agent 5: ValuesEditor

**File**: `web/components/workbook/Phase1/ValuesEditor.tsx`

**Changes**:

1. **Value items**:
- Card background: `bg-elevated border-deep-purple/30`
- Value text: `text-enlightened`
- Rank badge: `bg-gradient-to-r from-deep-purple to-royal-purple text-enlightened`
- Top 3 badges: `bg-aged-gold text-deep-charcoal` (special emphasis)
- Up/down arrows: `text-aged-gold hover:bg-elevated/80`

2. **Summary section**:
- Background: `bg-elevated border-deep-purple/30`
- Title: `text-enlightened`
- Top values list: `text-aged-gold font-semibold`

3. **Instructions**:
- Background: `bg-elevated border-deep-purple/30`
- Text: `text-muted-wisdom`

**Success Criteria**:
- ✅ Top 3 values highlighted with gold
- ✅ Ranking clear and readable
- ✅ TypeScript compiles

---

### ROUND 2: Middle Complexity Worksheets (5 Parallel Agents - 1 hour)

#### Agent 6: FeelWheelEditor

**File**: `web/components/workbook/Phase1/FeelWheelEditor.tsx`

**Changes**:

**Emotion category cards**:
- Joy: `bg-elevated border-sacral-orange/50`
- Sadness: `bg-elevated border-deep-teal/50`
- Anger: `bg-elevated border-root-crimson/50`
- Fear: `bg-elevated border-deep-purple/50`
- Surprise: `bg-elevated border-deep-teal/50`
- Disgust: `bg-elevated border-forest-green/50`

**Emotion buttons**:
- Unselected: `bg-elevated border-[category-color]/30 text-muted-wisdom`
- Selected: `bg-[category-color]/20 border-[category-color] text-enlightened`
- Hover: `hover:bg-[category-color]/10`

**Intensity slider**: Use Slider component (already themed by Agent 2)

**History cards**:
- Background: `bg-elevated border-deep-purple/30`
- Timestamp: `text-subtle-hint`
- Emotion: `text-[category-color]`

**Success Criteria**:
- ✅ 6 emotion categories clearly differentiated
- ✅ Selected emotions stand out
- ✅ TypeScript compiles

---

#### Agent 7: HabitsAuditEditor

**File**: `web/components/workbook/Phase1/HabitsAuditEditor.tsx`

**Changes**:

**Good Habits Section**:
- Container: `bg-elevated border-2 border-forest-green/50`
- Header: `text-forest-green`
- Item cards: `bg-deep-charcoal border-forest-green/30`
- Item text: `text-enlightened`
- Add button: `bg-forest-green text-enlightened hover:bg-forest-green/90`

**Bad Habits Section**:
- Container: `bg-elevated border-2 border-root-crimson/50`
- Header: `text-root-crimson`
- Item cards: `bg-deep-charcoal border-root-crimson/30`
- Item text: `text-enlightened`
- Add button: `bg-root-crimson text-enlightened hover:bg-root-crimson/90`

**Summary**:
- Background: `bg-elevated border-deep-purple/30`
- Stats: `text-enlightened`

**Success Criteria**:
- ✅ Good/bad habits clearly differentiated
- ✅ All text readable
- ✅ TypeScript compiles

---

#### Agent 8: ABCModelEditor

**File**: `web/components/workbook/Phase1/ABCModelEditor.tsx`

**Changes**:

**A Section (Activating Event)**:
- Container: `bg-elevated border-2 border-root-crimson/50`
- Header: `text-root-crimson`
- Textarea: `bg-deep-charcoal border-root-crimson/30 text-enlightened`

**B Section (Belief)**:
- Container: `bg-elevated border-2 border-sacral-orange/50`
- Header: `text-sacral-orange`
- Textarea: `bg-deep-charcoal border-sacral-orange/30 text-enlightened`

**C Section (Consequence)**:
- Container: `bg-elevated border-2 border-forest-green/50`
- Header: `text-forest-green`
- Textarea: `bg-deep-charcoal border-forest-green/30 text-enlightened`

**Arrows between sections**: `text-aged-gold`

**Completion badge**: `bg-aged-gold text-deep-charcoal`

**Success Criteria**:
- ✅ Three sections clearly flow A→B→C
- ✅ Color coding helps understanding
- ✅ TypeScript compiles

---

#### Agent 9: StrengthsWeaknessesEditor

**File**: `web/components/workbook/Phase1/StrengthsWeaknessesEditor.tsx`

**Changes**:

**Strengths Column**:
- Container: `bg-elevated border-2 border-forest-green/50`
- Header: `text-forest-green`
- Item cards: `bg-deep-charcoal border-forest-green/30 text-enlightened`
- Add button: `bg-forest-green text-enlightened`

**Weaknesses Column**:
- Container: `bg-elevated border-2 border-sacral-orange/50`
- Header: `text-sacral-orange`
- Item cards: `bg-deep-charcoal border-sacral-orange/30 text-enlightened`
- Add button: `bg-sacral-orange text-enlightened`

**Summary**:
- Background: `bg-elevated border-deep-purple/30`
- Badges: Use matching column colors

**Success Criteria**:
- ✅ Two columns clearly differentiated
- ✅ All text readable
- ✅ TypeScript compiles

---

#### Agent 10: ComfortZoneEditor

**File**: `web/components/workbook/Phase1/ComfortZoneEditor.tsx`

**Changes**:

**Comfort Zone Card**:
- Container: `bg-elevated border-2 border-forest-green/50`
- Header: `text-forest-green`
- Items: `bg-deep-charcoal border-forest-green/30 text-enlightened`
- Add button: `bg-forest-green text-enlightened`

**Stretch Zone Card**:
- Container: `bg-elevated border-2 border-sacral-orange/50`
- Header: `text-sacral-orange`
- Items: `bg-deep-charcoal border-sacral-orange/30 text-enlightened`
- Add button: `bg-sacral-orange text-enlightened`

**Panic Zone Card**:
- Container: `bg-elevated border-2 border-root-crimson/50`
- Header: `text-root-crimson`
- Items: `bg-deep-charcoal border-root-crimson/30 text-enlightened`
- Add button: `bg-root-crimson text-enlightened`

**Concentric Circles Visualization**:
- Outer (Panic): `bg-root-crimson/20 border-root-crimson/50`
- Middle (Stretch): `bg-sacral-orange/20 border-sacral-orange/50`
- Inner (Comfort): `bg-forest-green/20 border-forest-green/50`

**Success Criteria**:
- ✅ Three zones clearly differentiated
- ✅ Visual metaphor clear
- ✅ TypeScript compiles

---

### ROUND 3: Simple Worksheets + Preview + Patterns (5 Parallel Agents - 1 hour)

#### Agent 11: KnowYourselfEditor

**File**: `web/components/workbook/Phase1/KnowYourselfEditor.tsx`

**Changes**:

**Accordion items**:
- Collapsed: `bg-elevated border-deep-purple/30 text-enlightened`
- Expanded: `bg-elevated border-aged-gold/50 text-enlightened`
- Hover: `hover:bg-elevated/80`

**Question text**: `text-enlightened font-semibold`

**Answer textarea**:
- Background: `bg-deep-charcoal`
- Border: `border-deep-purple/30`
- Text: `text-enlightened`
- Placeholder: `placeholder:text-subtle-hint`

**Progress bar**:
- Track: `bg-elevated`
- Fill: `bg-gradient-to-r from-deep-purple to-royal-purple`

**Checkmarks**: `text-aged-gold`

**Success Criteria**:
- ✅ Accordion clear and functional
- ✅ Progress visible
- ✅ TypeScript compiles

---

#### Agent 12: AbilitiesRatingEditor

**File**: `web/components/workbook/Phase1/AbilitiesRatingEditor.tsx`

**Changes**:

**Ability items**:
- Container: `bg-elevated border-deep-purple/30`
- Label: `text-enlightened`
- Slider: Use themed Slider component (Agent 2)
- Rating display:
  - Low (<4): `text-root-crimson`
  - Medium (4-7): `text-sacral-orange`
  - High (8+): `text-forest-green`

**Summary cards**:
- Strengths card: `bg-elevated border-forest-green/50`
- Development card: `bg-elevated border-sacral-orange/50`
- Headers: Use matching colors
- List items: `text-enlightened`

**Success Criteria**:
- ✅ Sliders functional
- ✅ Color-coded ratings clear
- ✅ TypeScript compiles

---

#### Agent 13: ThoughtAwarenessEditor

**File**: `web/components/workbook/Phase1/ThoughtAwarenessEditor.tsx`

**Changes**:

**Entry cards**:
- Background: `bg-elevated`
- Positive entries: `border-l-4 border-l-forest-green`
- Negative entries: `border-l-4 border-l-root-crimson`
- Neutral entries: `border-l-4 border-l-aged-gold`
- Thought text: `text-enlightened`
- Timestamp: `text-subtle-hint`
- Category badge: Use matching border color

**Add entry form**:
- Container: `bg-elevated border-deep-purple/30`
- Textarea: `bg-deep-charcoal border-deep-purple/30 text-enlightened`
- Category selector: `bg-deep-charcoal border-deep-purple/30 text-enlightened`
- Submit button: `bg-gradient-to-r from-deep-purple to-royal-purple text-enlightened`

**Summary**:
- Background: `bg-elevated border-deep-purple/30`
- Stats: `text-enlightened` with category-colored badges

**Success Criteria**:
- ✅ Entries clearly categorized by color
- ✅ Form functional
- ✅ TypeScript compiles

---

#### Agent 14: Preview Page

**File**: `web/app/preview/phase-1/page.tsx`

**Changes**:

**Overall layout**:
- Page background: `bg-deep-charcoal`

**Header**:
- Background: `bg-elevated border-b border-deep-purple/30`
- Title: `text-enlightened`
- Subtitle: `text-muted-wisdom`

**Sidebar**:
- Container: `bg-elevated border-deep-purple/30`
- Title: `text-enlightened`
- Inactive worksheets: `text-muted-wisdom hover:bg-elevated/80`
- Active worksheet: `bg-gradient-to-r from-deep-purple/30 to-royal-purple/30 text-enlightened border-l-4 border-l-aged-gold`

**Content area**:
- Container: `bg-elevated shadow-elevated-card border border-deep-purple/30`
- Gradient bar: `bg-gradient-to-r from-deep-purple to-royal-purple`

**Success Criteria**:
- ✅ Dark theme throughout
- ✅ Sidebar navigation clear
- ✅ Active state visible
- ✅ TypeScript compiles

---

#### Agent 15: Sacred Geometry Patterns

**Task**: Create 2-3 subtle SVG patterns for background decoration

**Directory**: `web/public/patterns/` (create if needed)

**Patterns to create**:

1. **mandala-subtle.svg** - Simple circular mandala pattern
   - Size: 400x400px
   - Color: Deep purple (#4a1a6b)
   - Stroke width: 1px
   - Opacity will be controlled by CSS (5%)

2. **endless-knot.svg** - Tibetan endless knot
   - Size: 200x200px
   - Color: Deep purple (#4a1a6b)
   - Stroke width: 2px
   - Tileable pattern

3. **sacred-geometry-grid.svg** - Flower of life or geometric grid
   - Size: 300x300px
   - Color: Deep purple (#4a1a6b)
   - Stroke width: 1px

**Implementation**:
Add to WorksheetLayout.tsx content card:
```tsx
<div
  className="bg-elevated shadow-elevated-card border border-deep-purple/30 p-8"
  style={{
    backgroundImage: 'url(/patterns/mandala-subtle.svg)',
    backgroundSize: '400px 400px',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundBlendMode: 'overlay',
    opacity: 0.95  // Pattern at 5% opacity via blend
  }}
>
```

**Success Criteria**:
- ✅ 2-3 SVG files created
- ✅ Patterns subtle and non-distracting
- ✅ Integrated into WorksheetLayout

---

## Testing & Verification (Orchestrator - 30 min)

### Visual Testing with Playwright

```bash
# Navigate to preview page
cd web && npm run dev

# Open Playwright in browser
# Navigate to http://localhost:3000/preview/phase-1

# Take screenshots of all 11 worksheets
# Verify:
# - No bright white backgrounds
# - Text readable (contrast check)
# - SWOT colors correct
# - Sacred geometry patterns visible but subtle
```

### TypeScript Compilation

```bash
cd web
npm run type-check
# Should complete with no errors
```

### Build Test

```bash
cd web
npm run build
# Should complete successfully
```

### Checklist

- [ ] No `bg-white` anywhere in component files
- [ ] No bright saturated colors (#10b981, #ef4444, #3b82f6, #f59e0b)
- [ ] SWOT uses correct colors (forest-green, deep-amber, deep-teal, burgundy)
- [ ] All text uses `text-enlightened`, `text-muted-wisdom`, or `text-subtle-hint`
- [ ] All buttons use gradient or elevated backgrounds
- [ ] Hover states use minimal color changes (no glows)
- [ ] Green autosave indicator unchanged
- [ ] Sacred geometry patterns visible at 5% opacity
- [ ] TypeScript compiles with no errors
- [ ] Next.js build succeeds
- [ ] All 11 worksheets visually inspected

---

## Rollback Strategy

### Git Safety Net

```bash
# Before starting Round 1
git checkout -b feature/phase-1-dark-theme-redesign
git commit -m "checkpoint: before dark theme redesign"

# After each round
git add [modified files]
git commit -m "feat(dark-theme): round [N] complete"

# If issues arise
git log --oneline  # Find last good commit
git revert [bad-commit-hash]
# OR
git reset --hard [last-good-commit]
```

### Round-by-Round Rollback

If a round fails:
1. Review agent output for errors
2. Fix issues manually or re-run specific agent
3. Don't proceed to next round until current round passes tests

---

## Agent Prompt Template

Use this template when invoking agents:

```
Update [FILE_NAME] to use the mystical dark theme from the design spec.

**Context**: We're redesigning Phase 1 worksheets from bright white to dark mystical theme. Tailwind config already has all colors defined.

**File**: [FULL_FILE_PATH]

**Changes Required**:
[SPECIFIC CHANGES FROM AGENT SECTION ABOVE]

**Color Palette** (all available in Tailwind):
- Backgrounds: deep-charcoal, elevated
- Text: enlightened, muted-wisdom, subtle-hint
- Primary: deep-purple, royal-purple
- SWOT: forest-green, deep-amber, deep-teal, burgundy
- Chakra: aged-gold, sacral-orange, root-crimson

**Hover States**: Minimal - use hover:bg-[color]/90 or hover:bg-elevated/80

**Critical**:
- Keep ALL functionality unchanged
- TypeScript must compile
- Follow exact color mappings above
- DO NOT change autosave green indicator (#10b981)

Read the file, make ONLY visual changes, verify TypeScript compiles.
```

---

## Execution Commands

### Round 0 (Orchestrator)
```bash
# Manually update tailwind.config.ts
# Then verify
cd web && npm run build
```

### Round 1 (5 parallel agents)
```bash
# In Claude Code, send ONE message with 5 Task tool calls:
Task: Agent 1 - WorksheetLayout
Task: Agent 2 - Slider
Task: Agent 3 - WheelOfLifeEditor
Task: Agent 4 - SWOTEditor
Task: Agent 5 - ValuesEditor
```

### Round 2 (5 parallel agents)
```bash
# In Claude Code, send ONE message with 5 Task tool calls:
Task: Agent 6 - FeelWheelEditor
Task: Agent 7 - HabitsAuditEditor
Task: Agent 8 - ABCModelEditor
Task: Agent 9 - StrengthsWeaknessesEditor
Task: Agent 10 - ComfortZoneEditor
```

### Round 3 (5 parallel agents)
```bash
# In Claude Code, send ONE message with 5 Task tool calls:
Task: Agent 11 - KnowYourselfEditor
Task: Agent 12 - AbilitiesRatingEditor
Task: Agent 13 - ThoughtAwarenessEditor
Task: Agent 14 - Preview page
Task: Agent 15 - Sacred geometry patterns
```

### Testing
```bash
cd web
npm run type-check
npm run build
npm run dev  # Manual visual inspection
```

---

## Success Criteria

### Visual
- ✅ All worksheets use dark backgrounds (no white)
- ✅ Text readable with proper contrast
- ✅ SWOT colors match spec exactly
- ✅ Buttons use gradients
- ✅ Sacred geometry visible but subtle

### Technical
- ✅ TypeScript compiles with no errors
- ✅ Next.js build succeeds
- ✅ No runtime errors in console
- ✅ All functionality preserved

### User Experience
- ✅ Mystical, meditative atmosphere
- ✅ Easy on the eyes (no bright whites)
- ✅ Professional and polished
- ✅ Matches mobile app aesthetic

---

## Notes for Future You

- **Tailwind config is foundation** - must be done first
- **WorksheetLayout affects all worksheets** - critical to get right
- **SWOT colors are most wrong** - highest impact fix
- **Recharts requires inline styles** - can't use Tailwind classes
- **Agent 15 can run anytime** - patterns are independent
- **Test after each round** - don't compound errors
- **Keep green autosave indicator** - user confirmed

---

## File Location

**This file**: `.claude/dark-theme-orchestration.md`

**Related files**:
- Plan: `.claude/plans/fancy-mixing-crayon.md`
- Design spec: `docs/planning/app-design.md`

---

**Status**: READY FOR EXECUTION
**Next Step**: Update `web/tailwind.config.ts` then launch Round 1 agents
