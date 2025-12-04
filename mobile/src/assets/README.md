# Asset Management Guide

## Directory Structure

```
assets/
├── images/
│   ├── phases/           # Workbook phase headers (10 phases)
│   ├── meditation/       # Meditation screen backgrounds
│   ├── backgrounds/      # General app backgrounds
│   └── illustrations/    # Decorative elements (lotus, chakras, etc.)
├── icons/
│   ├── navigation/       # Tab bar icons (need active/inactive states)
│   └── ui/              # General UI icons (play, pause, mic, etc.)
└── index.ts             # Central export - UPDATE THIS when adding images
```

## Naming Conventions

### Phase Images
```
phase-1-self-evaluation.png
phase-2-values-vision.png
phase-3-goal-setting.png
phase-4-fears-beliefs.png
phase-5-self-love.png
phase-6-manifestation.png
phase-7-gratitude.png
phase-8-envy-inspiration.png
phase-9-trust-surrender.png
phase-10-letting-go.png
```

### Navigation Icons (need both states)
```
home.png / home-active.png
workbook.png / workbook-active.png
meditate.png / meditate-active.png
journal.png / journal-active.png
wisdom.png / wisdom-active.png
profile.png / profile-active.png
```

### General Naming Rules
- Use **kebab-case**: `lotus-flower.png` not `lotusFlower.png`
- Be descriptive: `breathing-circle-animation.png` not `img1.png`
- Include state if applicable: `button-pressed.png`, `icon-active.png`

## Resolution Guidelines (iOS)

React Native automatically picks the right resolution based on device. Provide these sizes:

| Suffix | Scale | Example Base 100px | Use Case |
|--------|-------|-------------------|----------|
| (none) | @1x | 100x100px | Older devices |
| @2x | @2x | 200x200px | iPhone 8, SE |
| @3x | @3x | 300x300px | iPhone 12-16 Pro |

### File Naming for Multi-Resolution
```
lotus.png        # 100x100 (@1x)
lotus@2x.png     # 200x200 (@2x)
lotus@3x.png     # 300x300 (@3x)
```

React Native will automatically use the correct one. You only `require('./lotus.png')` in code.

### Recommended Base Sizes

| Asset Type | Base Size (@1x) | @2x | @3x |
|------------|-----------------|-----|-----|
| Phase headers | 375x200px | 750x400 | 1125x600 |
| Tab icons | 25x25px | 50x50 | 75x75 |
| UI icons | 24x24px | 48x48 | 72x72 |
| Backgrounds | 375x812px | 750x1624 | 1125x2436 |
| Meditation cards | 160x100px | 320x200 | 480x300 |

### Quick Approach (Single High-Res)

If you only have one size, provide the @3x version and name it without suffix:
```
phase-1-self-evaluation.png  # 1125x600px (the @3x size)
```

React Native will scale it down. Quality is good, but file size is larger.

## Adding New Images

1. **Drop the file** in the appropriate folder
2. **Update `index.ts`** - uncomment or add the require statement
3. **Import in component**:
   ```tsx
   import { PhaseImages, NavigationIcons } from '@/assets';

   <Image source={PhaseImages.phase1} />
   <Image source={NavigationIcons.home} />
   ```

## Image Optimization

Before adding images, optimize them:

### Online Tools
- [TinyPNG](https://tinypng.com/) - PNG/JPG compression
- [Squoosh](https://squoosh.app/) - Advanced compression options

### Recommended Formats
- **PNG**: Icons, illustrations with transparency
- **JPG**: Photos, complex backgrounds (no transparency needed)
- **WebP**: Best compression (check React Native support)

### Target File Sizes
- Icons: < 10KB each
- Phase headers: < 100KB each
- Backgrounds: < 200KB each

## Current Phase Images Needed

Upload these 10 files to `images/phases/`:

- [ ] `phase-1-self-evaluation.png`
- [ ] `phase-2-values-vision.png`
- [ ] `phase-3-goal-setting.png`
- [ ] `phase-4-fears-beliefs.png`
- [ ] `phase-5-self-love.png`
- [ ] `phase-6-manifestation.png`
- [ ] `phase-7-gratitude.png`
- [ ] `phase-8-envy-inspiration.png`
- [ ] `phase-9-trust-surrender.png`
- [ ] `phase-10-letting-go.png`

Once uploaded, the app will automatically use them via the `PhaseImages` export.
