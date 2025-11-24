# Manifest the Unseen - App Design Specification

**Document Version**: 1.0
**Last Updated**: November 22, 2025
**Status**: Active Development

---

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Visual Style](#visual-style)
5. [Screen Designs](#screen-designs)
6. [App Icon & Branding](#app-icon--branding)
7. [Component Guidelines](#component-guidelines)

---

## Design Philosophy

### Core Theme: **Dark Mode Meditation App**
- **NO bright whites** - everything muted and low contrast
- **NO harsh contrasting areas** - smooth, calming transitions
- White only appears in fonts/text, never backgrounds
- Mellow, meditative atmosphere throughout

### Cultural Aesthetic: **Ancient Wisdom Fusion**
A blend of spiritual traditions:
- **Tibetan Buddhism** - mandalas, sacred geometry, meditation
- **Hindu** - chakras, third eye, lotus flowers, om symbols
- **Mayan** - earth connection, cosmic patterns, ancient knowledge

### Emotional Vibe
- Deep thinking and introspection
- Mind over matter
- Opening the third eye / higher consciousness
- Chakra healing and energy flow
- Earth connection - natural, grounded, organic

### Visual Keywords
- Down-to-earth tones
- All natural / organic
- Hippie aesthetic
- Gems and crystals
- Earth's meditations
- Fluid energy (like kundalini up the spine)
- Sacred and mystical

---

## Color Palette

### Primary Backgrounds (Dark Theme)
```
Deep Charcoal:     #1a1a2e  (primary background)
Dark Slate Blue:   #16213e  (alternative background)
Elevated Surface:  #252547  (cards, elevated elements)
```

### Text Colors
```
Primary Text:      #e8e8e8  (soft off-white, NEVER pure white #fff)
Secondary Text:    #a0a0b0  (muted gray)
Tertiary Text:     #6b6b80  (subtle hints)
```

### Accent Colors (Muted Jewel Tones)
```
Deep Purple:       #4a1a6b  (primary accent)
Royal Purple:      #6b2d8b  (highlights)
Indigo:            #2d1b4e  (gradients)

Deep Teal:         #1a5f5f  (opportunities, wisdom)
Forest Green:      #2d5a4a  (growth, nature, strengths)
Emerald:           #1d4a3a  (healing)

Muted Gold:        #c9a227  (enlightenment, value)
Deep Amber:        #8b6914  (earth, grounding)
Burnt Orange:      #a65d1a  (warmth)

Deep Rose:         #8b3a5f  (heart, compassion)
Burgundy:          #6b2d3d  (awareness, threats)
Coral Muted:       #a64d5a  (energy)
```

### SWOT-Specific Colors
```
Strengths:         #2d5a4a  (deep forest green)
Weaknesses:        #8b6914  (deep amber/brown)
Opportunities:     #1a5f5f  (deep teal)
Threats:           #6b2d3d  (deep burgundy)
```

### Gradients
```
Primary Gradient:  #4a1a6b → #2d1b4e  (purple depth)
Ethereal Glow:     #1a5f5f → #2d5a4a  (teal to green)
Sunset Earth:      #8b6914 → #a65d1a  (amber warmth)
```

---

## Typography

### Font Style Goals
- Elegant, possibly Sanskrit-inspired for headers
- Clean, readable for body text
- Hand-drawn/organic feel for decorative elements

### Recommended Font Pairings
```
Headers:           Cinzel, Cormorant Garamond, or similar serif
Body:              Inter, Source Sans Pro, or system default
Accent/Labels:     Handwritten style (Caveat, Patrick Hand)
```

### Font Sizes (Mobile)
```
Hero Title:        28-32px, bold
Section Title:     20-24px, semibold
Card Title:        16-18px, semibold
Body Text:         14-16px, regular
Caption/Label:     12px, regular
Small/Hint:        10px, light
```

---

## Visual Style

### Hand-Drawn / Whiteboard Aesthetic
Inspired by whiteboard explainer videos where someone draws while narrating:
- Sketch-like icons and illustrations
- Thought bubbles connecting concepts
- Flowing arrows and organic connections
- Hand-drawn borders and flourishes
- Looks illustrated, not sterile/corporate

### Sacred Geometry Elements
Use as subtle backgrounds or decorative accents:
- Flower of Life patterns
- Metatron's Cube
- Sri Yantra inspired forms
- Mandala radiating patterns
- Concentric circles (enlightenment expanding)

### Corner & Edge Treatment
- All corners rounded (modern app feel)
- Soft shadows with slight glow
- No harsh borders - use subtle gradients instead
- Cards feel like they're floating

### Iconography Style
- Hand-illustrated appearance
- Spiritual/ancient symbolism
- Consistent line weight
- Works on dark backgrounds
- 8 Life Area Icons needed:
  1. Career - scroll/tablet/quill
  2. Health - lotus flower or healing hands
  3. Relationships - intertwined symbols/rings
  4. Finance - coins/abundance vessel
  5. Personal Growth - rising sun/enlightenment rays
  6. Family - tree of life
  7. Recreation - flowing water/waves of joy
  8. Spirituality - third eye/om symbol

---

## Screen Designs

### 1. Wheel of Life Screen

**Layout**: Target/Bullseye Style (NOT pie chart)

```
┌─────────────────────────────────────┐
│         "Wheel of Life"             │  ← Sanskrit-inspired font
│   Rate each area of your life       │
├─────────────────────────────────────┤
│                                     │
│     [Icon] Career    [Icon] Health  │  ← 8 icons around wheel
│         ╲               ╱           │
│    [Icon]  ╲    ●    ╱  [Icon]      │
│    Finance   ╲  │  ╱   Relationships│
│               ╲ │ ╱                 │
│         ───────●───────             │  ← Concentric rings 1-10
│               ╱ │ ╲                 │     (center = 1, outer = 10)
│    [Icon]  ╱    │    ╲  [Icon]      │
│    Spirit    ╱  │  ╲   Personal     │
│         ╱       │       ╲           │
│     [Icon] Rec   [Icon] Family      │
│                                     │
│   ●───●───●───●───●───●───●───●     │  ← Dots connected = your shape
│                                     │
├─────────────────────────────────────┤
│  [Sliders for each life area]       │
│  Career: ●────────────○ 7           │
│  Health: ●──────○───── 5            │
│  ...                                │
└─────────────────────────────────────┘
```

**Key Features**:
- Concentric rings representing levels 1-10
- User places a DOT on each slice at their rating
- All dots CONNECTED with a line forming a polygon
- Goal: reach outer circle (10 in all areas) = perfect balance
- The connected shape shows life "balance" visually
- Hand-drawn style icons for each life area around the wheel

**Colors**:
- Background: #1a1a2e
- Rings: Subtle gradient from dark center to slightly lighter outer
- Each slice can have a subtle color tint matching its icon
- Connected polygon line: Muted gold (#c9a227) with glow

---

### 2. Phase 1 Dashboard Screen

**Layout**: Exercise List with Progress

```
┌─────────────────────────────────────┐
│  PHASE 1                            │  ← Muted gold label
│  Self-Evaluation                    │  ← Large elegant title
│  Discover who you truly are         │  ← Subtitle with flourish
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │ Your Progress          45%  │    │  ← Progress card
│  │ ████████░░░░░░░░░░░░░      │    │
│  │ 5 of 11 exercises done      │    │
│  └─────────────────────────────┘    │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │ [mandala]  Wheel of Life   →│    │  ← Exercise cards
│  │            Rate 8 life areas│    │     Hand-drawn icons
│  │            ████░░ 60%  10m  │    │     Progress + time
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ [emotion]  Feel Wheel      →│    │
│  │            Track emotions   │    │
│  │            ░░░░░░ 0%   5m   │    │
│  └─────────────────────────────┘    │
│  ... (9 more exercises)             │
└─────────────────────────────────────┘
```

**Exercise Icons** (hand-drawn spiritual style):
1. Wheel of Life - target/mandala
2. Feel Wheel - emotion faces in circle
3. Habit Tracking - flowing chart/waves
4. ABC Model - thought bubble with connections
5. SWOT Analysis - four-petal flower
6. Personal Values - gem/crystal cluster
7. Strengths & Weaknesses - yin-yang inspired
8. Comfort Zone - expanding circles
9. Know Yourself - mirror with reflection
10. Abilities Rating - constellation/stars
11. Thought Awareness - third eye/lotus opening

**Visual Elements**:
- Thought bubbles and arrows connecting related exercises
- Hand-drawn underlines and flourishes
- Cards have subtle inner glow, not harsh borders

---

### 3. SWOT Analysis Screen

**Layout**: Organic Mandala Quadrants (NOT corporate grid)

```
┌─────────────────────────────────────┐
│         "SWOT Analysis"             │
│   Explore your inner landscape      │
├─────────────────────────────────────┤
│                                     │
│      ╭──────────╮ ╭──────────╮      │
│     ╱ STRENGTHS  ╲╱ WEAKNESSES╲     │  ← Organic petal shapes
│    │   #2d5a4a   ││  #8b6914   │    │     NOT harsh grid
│    │ [leaf tags] ││ [stone tags]│   │
│    │ + Add       ││ + Add       │   │
│     ╲            ╱╲            ╱     │
│      ╰──────────╯ ╰──────────╯      │
│            ╲  [mandala]  ╱          │  ← Central connecting element
│             ╲   center  ╱           │
│      ╭──────────╮ ╭──────────╮      │
│     ╱OPPORTUNITY ╲╱  THREATS  ╲     │
│    │   #1a5f5f   ││  #6b2d3d   │    │
│    │ [wave tags] ││ [fire tags] │   │
│    │ + Add       ││ + Add       │   │
│     ╲            ╱╲            ╱     │
│      ╰──────────╯ ╰──────────╯      │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 💡 Insights                 │    │  ← AI-generated insights
│  │ Your strengths in X can     │    │
│  │ help overcome threats in Y  │    │
│  └─────────────────────────────┘    │
│                                     │
│  [  Save & Continue  ]              │  ← Primary button
└─────────────────────────────────────┘
```

**Key Design Points**:
- Quadrants shaped like flower petals or mandala sections
- Hand-drawn borders, organic flowing shapes
- Flowing arrows showing how quadrants relate
- Tags shaped like natural elements (leaves, stones, waves)
- Central mandala/compass connecting all four
- Add buttons styled as seeds or crystals

---

## App Icon & Branding

### App Name
**Manifest the Unseen**

### Icon Concept Options

**Option A: Third Eye**
- Mystical eye with sacred geometry radiating
- Deep purple gradient background
- Subtle gold/teal accents in the iris
- Hand-drawn quality to the eye shape

**Option B: Lotus Opening**
- Lotus flower mid-bloom (awakening)
- Third eye or gem in the center
- Purple petals with gold center
- Represents transformation/enlightenment

**Option C: Sacred Geometry**
- Simplified Flower of Life or Metatron's Cube
- Deep purple with gold line work
- Central eye or light point
- Represents cosmic order/manifestation

**Option D: Crystal/Gem**
- Faceted crystal emanating light
- Purple crystal with ethereal glow
- Represents clarity, energy, earth connection

### Icon Color Palette
```
Primary:           Deep purple gradient (#4a1a6b → #2d1b4e)
Accent:            Muted gold (#c9a227)
Secondary Accent:  Deep teal (#1a5f5f)
Highlight:         Soft rose (#8b3a5f)
```

### Icon Requirements
- Works at small sizes (app icon on phone)
- Readable at 1024x1024 for App Store
- Dark theme compatible
- Minimalist but meaningful
- NOT corporate or generic

---

## Component Guidelines

### Buttons

**Primary Button**
```css
background: linear-gradient(135deg, #4a1a6b, #2d1b4e);
color: #e8e8e8;
border-radius: 12px;
padding: 16px 32px;
box-shadow: 0 4px 20px rgba(74, 26, 107, 0.3);
```

**Secondary Button**
```css
background: transparent;
border: 1px solid #4a1a6b;
color: #c9a227;
border-radius: 12px;
```

### Cards
```css
background: #252547;
border-radius: 16px;
padding: 16px;
box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
/* Subtle inner highlight on top edge */
```

### Input Fields
```css
background: #1a1a2e;
border: 1px solid #3a3a5a;
border-radius: 12px;
color: #e8e8e8;
/* On focus: subtle purple glow */
```

### Tags/Chips
```css
background: rgba(74, 26, 107, 0.3);
border: 1px solid #4a1a6b;
border-radius: 20px;
padding: 8px 16px;
color: #e8e8e8;
/* Organic, rounded, stone-like feel */
```

### Progress Bars
```css
background-track: #252547;
background-fill: linear-gradient(90deg, #4a1a6b, #c9a227);
border-radius: 8px;
height: 8px;
/* Subtle glow on the fill */
```

---

## Implementation Notes

### Tailwind CSS Integration
Since the app uses NativeWind (Tailwind for React Native), create custom theme:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-primary': '#1a1a2e',
        'bg-secondary': '#16213e',
        'bg-elevated': '#252547',

        // Text
        'text-primary': '#e8e8e8',
        'text-secondary': '#a0a0b0',
        'text-tertiary': '#6b6b80',

        // Accents
        'accent-purple': '#4a1a6b',
        'accent-teal': '#1a5f5f',
        'accent-gold': '#c9a227',
        'accent-rose': '#8b3a5f',
        'accent-green': '#2d5a4a',
        'accent-amber': '#8b6914',
        'accent-burgundy': '#6b2d3d',
      }
    }
  }
}
```

### Asset Requirements
- [ ] 8 Life Area icons (SVG, hand-drawn style)
- [ ] 11 Exercise icons (SVG, spiritual style)
- [ ] App icon (1024x1024 PNG)
- [ ] Sacred geometry background patterns (SVG)
- [ ] Mandala decorative elements (SVG)

---

## Approved Designs (Canva)

### Round 2 - Dark/Spiritual Theme (November 22, 2025)

**STATUS: APPROVED** - Moving forward with these designs

#### Wheel of Life Mockups
| # | Canva URL | Notes |
|---|-----------|-------|
| 1 | https://www.canva.com/d/2AuJ0p_oK_4nxM6 | |
| 2 | https://www.canva.com/d/J9x4z4hSCrO3ORx | |
| 3 | https://www.canva.com/d/PnJA_Lfhlaq5oHd | |
| 4 | https://www.canva.com/d/F7nXeJ28yQmy-Um | Multi-page |

#### Phase 1 Dashboard Mockups
| # | Canva URL | Notes |
|---|-----------|-------|
| 1 | https://www.canva.com/d/Qodk3eQvKJm_khS | 8 pages - comprehensive |
| 2 | https://www.canva.com/d/1D-Wlg4Fl_LQDZA | |
| 3 | https://www.canva.com/d/rzMNUGn9ruz4GG8 | 5 pages |
| 4 | https://www.canva.com/d/t0b9AKwHYlesDBG | |

#### SWOT Analysis Mockups (Organic/Spiritual)
| # | Canva URL | Notes |
|---|-----------|-------|
| 1 | https://www.canva.com/d/q9ua2U2kHVxZShs | |
| 2 | https://www.canva.com/d/JJPoJ7NfViyLXKH | |
| 3 | https://www.canva.com/d/6iQfJjBWeQROUPj | |
| 4 | https://www.canva.com/d/yOE8xBGasNjQ447 | 4 pages |

#### App Icon / Logo - ✅ APPROVED
**Final Design:** https://www.canva.com/design/DAG5fDUuSKw/vrxVe9MlJt0uA7o-oI2BhQ/edit

**Design Elements:**
- **Central Figure**: Pencil-sketched meditating monk in lotus position
  - Hand-drawn line work with detailed robes
  - Serene contemplative face
  - Natural hair styling (topknot)
- **Chakras**: Seven chakras with sacred geometry symbols
  - Root (red) → Sacral (orange) → Solar Plexus (yellow) → Heart (green) → Throat (blue) → Third Eye (indigo) → Crown (violet)
  - Each chakra contains its traditional symbol (Muladhara, Svadhishthana, Manipura, Anahata, Vishuddha, Ajna, Sahasrara)
- **Halo Effect**: Luminous golden glow around head with floating orbs
- **Background**: Intricate mandala wheel pattern
  - Lotus flower base
  - Chakra-colored wheel segments (ties to Wheel of Life concept)
  - Sacred geometry patterns, compass-like spikes
  - Dark charcoal background (#1a1a2e)

**Aesthetic:**
- Ancient Tibetan thangka art inspired
- Hand-drawn pencil sketch quality (NOT flat digital)
- Mystical, sacred, weathered feel
- Works at both large and small sizes

**Reference Images Used:**
- Om Mandala: `C:\projects\manifest_the_unseen\snips\19f8ee8e-c6fe-4104-a750-c29a9254b0c7.png`
- Tibetan Monk: `C:\projects\manifest_the_unseen\snips\Tibetan-monk.png`
- Intricate Mandala Line Art: `C:\projects\mobileApps\manifest-the-unseen-ios\snips\Screenshot 2025-11-22 211235.png`
- Rose/Purple Mandala: `C:\projects\mobileApps\manifest-the-unseen-ios\snips\Screenshot 2025-11-22 211119.png`

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Nov 22, 2025 | Initial design specification |
| 1.1 | Nov 22, 2025 | Added approved Canva designs from Round 2 |
| 1.2 | Nov 22, 2025 | **LOGO APPROVED** - Final monk/chakra/mandala design selected |

---

*"What you seek is seeking you." - Rumi*
