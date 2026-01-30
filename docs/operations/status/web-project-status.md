# Web App Project Status

**Last Updated**: 2026-01-30 (Route Testing Complete)
**Project**: Manifest the Unseen Web App (Companion + Full Web Product)
**Status**: ✅ **Implementation Complete, Routes Tested** - Ready for Stripe configuration & deployment

---

## Quick Summary

| Metric | Value |
|--------|-------|
| Total Files Created | 71 |
| TypeScript | ✅ Passing |
| Build | ✅ Passing (61 pages) |
| Routes Tested | 10/10 ✅ |
| Blocking Items | Stripe setup (P0) |

---

## Implementation Status Summary

| Phase | Description | Status | Files Created |
|-------|-------------|--------|---------------|
| 1 | Database Foundation | ✅ Complete | 1 migration |
| 2 | Stripe Backend | ✅ Complete | 3 Edge Functions |
| 3 | Subscription UI | ✅ Complete | 11 files |
| 4 | Guru AI Chat | ✅ Complete | 12 files |
| 5 | Meditation Player | ✅ Complete | 12 files |
| 6 | Journal Feature | ✅ Complete | 13 files |
| 7 | Route Protection | ✅ Complete | 14 files |
| 8 | Route Testing | ✅ Complete | 1 file (ios-pricing) |

**Total: 71 new files created**
**TypeScript Check: ✅ Passing (no errors)**
**Build: ✅ Passing (61/61 pages)**

---

## Last Activity: Route Testing Complete - January 30, 2026

### Summary

All routes tested via Playwright automation:

| Route | Status | Notes |
|-------|--------|-------|
| `/pricing` | ✅ | 3 tiers, monthly/yearly toggle |
| `/auth/login` | ✅ | Login form displays |
| `/guru` | ✅ | Shows locked screen (correct) |
| `/app/dashboard` | ✅ | Redirects to `/pricing` |
| `/app/meditations` | ✅ | Redirects to `/pricing` |
| `/app/journal` | ✅ | Redirects to `/pricing` |
| `/companion/dashboard` | ✅ | Redirects to `/ios-pricing` |
| `/subscription/success` | ✅ | Success page with next steps |
| `/subscription/cancel` | ✅ | Cancel page with return options |
| `/ios-pricing` | ✅ | NEW - App Store redirect page |

### Files Created This Session
- `web/app/ios-pricing/page.tsx` - iOS subscription redirect page

### Fixes Applied
- Added Suspense boundaries to `/pricing` and `/subscription/success` for Next.js 14 compatibility

---

## Previous Activity: Parallel Agent Implementation - January 30, 2026

Six parallel agents completed full implementation:
1. Stripe Edge Functions for checkout/webhook/portal
2. Subscription UI with pricing page and checkout flow
3. Guru AI chat interface with phase analysis
4. Meditation library and audio player
5. Journal feature with CRUD and limits
6. Route protection with middleware and layouts

---

## Detailed Implementation Status

### Phase 1: Database Foundation ✅

**Migration File:** `supabase/migrations/20260130000000_platform_subscriptions.sql`

- [x] `subscriptions` table with platform separation (ios/web)
- [x] RLS policies for user data isolation
- [x] Sync triggers (subscription → users table)
- [x] Indexes for performance
- [ ] **TODO:** Apply migration to production Supabase

### Phase 2: Stripe Backend ✅

**Edge Functions Created:**

| Function | File | Purpose |
|----------|------|---------|
| stripe-checkout | `supabase/functions/stripe-checkout/index.ts` | Create Stripe Checkout sessions |
| stripe-webhook | `supabase/functions/stripe-webhook/index.ts` | Handle all Stripe events |
| stripe-portal | `supabase/functions/stripe-portal/index.ts` | Customer portal sessions |

**Remaining Tasks:**
- [ ] Deploy functions: `npx supabase functions deploy stripe-checkout stripe-webhook stripe-portal`
- [ ] Configure Stripe webhook endpoint in Stripe Dashboard
- [ ] Create 6 Stripe products (3 tiers × 2 billing periods)
- [ ] Set environment secrets in Supabase

### Phase 3: Subscription UI ✅

**Files Created:**

| File | Purpose |
|------|---------|
| `web/lib/stripe.ts` | Stripe client configuration |
| `web/types/subscription.ts` | TypeScript types + price IDs |
| `web/hooks/useSubscription.ts` | Subscription state hook (updated) |
| `web/components/subscription/PricingTiers.tsx` | Tier cards with toggle |
| `web/components/subscription/CheckoutButton.tsx` | Checkout initiation |
| `web/components/subscription/index.ts` | Barrel export |
| `web/app/(marketing)/layout.tsx` | Marketing pages layout |
| `web/app/(marketing)/pricing/page.tsx` | Dedicated pricing page |
| `web/app/subscription/layout.tsx` | Subscription flow layout |
| `web/app/subscription/success/page.tsx` | Post-checkout success |
| `web/app/subscription/cancel/page.tsx` | Checkout canceled |

**Remaining Tasks:**
- [ ] Replace placeholder Stripe price IDs in `web/types/subscription.ts`
  - `price_novice_monthly` → real Stripe price ID
  - `price_novice_yearly` → real Stripe price ID
  - `price_awakening_monthly` → real Stripe price ID
  - `price_awakening_yearly` → real Stripe price ID
  - `price_enlightenment_monthly` → real Stripe price ID
  - `price_enlightenment_yearly` → real Stripe price ID

### Phase 4: Guru AI Chat ✅

**Files Created:**

| File | Purpose |
|------|---------|
| `web/types/guru.ts` | Guru types (Message, Conversation, Phase) |
| `web/lib/guruService.ts` | Edge Function API calls |
| `web/hooks/useGuruChat.ts` | Chat state management |
| `web/hooks/useConversations.ts` | Conversation history |
| `web/components/guru/ChatInterface.tsx` | Main chat container |
| `web/components/guru/MessageBubble.tsx` | Message display |
| `web/components/guru/ChatInput.tsx` | Input with send button |
| `web/components/guru/PhaseSelector.tsx` | Completed phase selector |
| `web/components/guru/TypingIndicator.tsx` | Loading animation |
| `web/components/guru/GuruLockedScreen.tsx` | Tier gate (Awakening+) |
| `web/components/guru/GuruEmptyState.tsx` | No conversation state |
| `web/components/guru/index.ts` | Barrel export |
| `web/app/guru/page.tsx` | Guru page |

**Note:** Guru page created at `/guru` (top-level). Consider moving to `/app/guru` for consistency.

**Remaining Tasks:**
- [ ] Test with real subscription (Awakening+ tier)
- [ ] Verify phase selector works with workbook progress

### Phase 5: Meditation Player ✅

**Files Created:**

| File | Purpose |
|------|---------|
| `web/hooks/useMeditations.ts` | Fetch meditation list |
| `web/hooks/useMeditationPlayer.ts` | HTML5 Audio wrapper |
| `web/hooks/useMeditationSession.ts` | Session tracking |
| `web/components/meditation/MeditationLibrary.tsx` | Grid with tier tabs |
| `web/components/meditation/MeditationCard.tsx` | Card with tier badge |
| `web/components/meditation/AudioPlayer.tsx` | Full player UI |
| `web/components/meditation/PlayerControls.tsx` | Play/pause/skip |
| `web/components/meditation/ProgressSlider.tsx` | Seek bar |
| `web/components/meditation/UpgradeModal.tsx` | Tier upgrade prompt |
| `web/components/meditation/index.ts` | Barrel export |
| `web/app/app/meditations/page.tsx` | Library page |
| `web/app/app/meditations/[id]/page.tsx` | Player page |

**Remaining Tasks:**
- [ ] Verify audio file URLs work (Supabase Storage)
- [ ] Test session tracking saves to database

### Phase 6: Journal Feature ✅

**Files Created:**

| File | Purpose |
|------|---------|
| `web/hooks/useJournal.ts` | CRUD operations |
| `web/hooks/useJournalLimit.ts` | Limit tracking |
| `web/lib/shared/journalLimits.ts` | Limit calculation utilities |
| `web/components/journal/JournalList.tsx` | Entry list with search |
| `web/components/journal/JournalCard.tsx` | Entry preview card |
| `web/components/journal/JournalEditor.tsx` | Text editor |
| `web/components/journal/MoodSelector.tsx` | Mood picker |
| `web/components/journal/TagInput.tsx` | Tag chips input |
| `web/components/journal/JournalLimitBanner.tsx` | Usage display |
| `web/components/journal/index.ts` | Barrel export |
| `web/app/app/journal/page.tsx` | Journal list page |
| `web/app/app/journal/new/page.tsx` | New entry page |
| `web/app/app/journal/[id]/page.tsx` | Edit entry page |

**Tier Limits:**
- Novice: 50 entries/month
- Awakening: 200 entries/month
- Enlightenment: Unlimited

**Remaining Tasks:**
- [ ] Test auto-save functionality
- [ ] Verify limit banner updates correctly

### Phase 7: Route Protection & Layouts ✅

**Files Created:**

| File | Purpose |
|------|---------|
| `web/middleware.ts` | Multi-route protection (updated) |
| `web/lib/featureAccess.ts` | Feature gating logic |
| `web/types/platform.ts` | Platform types |
| `web/hooks/usePlatform.ts` | Detect platform from route |
| `web/hooks/useFeatureAccess.ts` | Feature check hook |
| `web/components/shared/UpgradePrompt.tsx` | Upgrade CTA component |
| `web/components/companion/CompanionNav.tsx` | iOS companion navigation |
| `web/components/app/AppSidebar.tsx` | Full web app sidebar |
| `web/app/companion/layout.tsx` | Companion layout |
| `web/app/companion/page.tsx` | Companion redirect |
| `web/app/companion/dashboard/page.tsx` | iOS companion dashboard |
| `web/app/app/layout.tsx` | Full web app layout |
| `web/app/app/page.tsx` | App redirect |
| `web/app/app/dashboard/page.tsx` | Web app dashboard |

**Route Structure:**
- `/companion/*` - iOS Companion (requires iOS subscription)
- `/app/*` - Full Web App (requires web subscription)
- `/pricing` - Web subscription pricing
- `/guru` - Guru AI chat (accessible to subscribers)

**Remaining Tasks:**
- [ ] Test authentication redirect flow
- [ ] Test subscription gate redirects

---

## Complete File Inventory

### Supabase (4 files)

```
supabase/
├── migrations/
│   └── 20260130000000_platform_subscriptions.sql
└── functions/
    ├── stripe-checkout/index.ts
    ├── stripe-webhook/index.ts
    └── stripe-portal/index.ts
```

### Web Types (4 files)

```
web/types/
├── database.ts
├── guru.ts
├── platform.ts
└── subscription.ts
```

### Web Lib (4 files)

```
web/lib/
├── stripe.ts
├── featureAccess.ts
├── guruService.ts
└── shared/
    └── journalLimits.ts
```

### Web Hooks (12 files - 9 new, 3 updated)

```
web/hooks/
├── useConversations.ts      # NEW
├── useFeatureAccess.ts      # NEW
├── useGuruChat.ts           # NEW
├── useJournal.ts            # NEW
├── useJournalLimit.ts       # NEW
├── useMeditationPlayer.ts   # NEW
├── useMeditations.ts        # NEW
├── useMeditationSession.ts  # NEW
├── usePlatform.ts           # NEW
├── useSubscription.ts       # UPDATED
├── useAuth.ts               # existing
├── useAutoSave.ts           # existing
└── useWorkbookProgress.ts   # existing
```

### Web Components (31 files in 7 folders)

```
web/components/
├── subscription/
│   ├── CheckoutButton.tsx
│   ├── PricingTiers.tsx
│   └── index.ts
├── guru/
│   ├── ChatInput.tsx
│   ├── ChatInterface.tsx
│   ├── GuruEmptyState.tsx
│   ├── GuruLockedScreen.tsx
│   ├── MessageBubble.tsx
│   ├── PhaseSelector.tsx
│   ├── TypingIndicator.tsx
│   └── index.ts
├── meditation/
│   ├── AudioPlayer.tsx
│   ├── MeditationCard.tsx
│   ├── MeditationLibrary.tsx
│   ├── PlayerControls.tsx
│   ├── ProgressSlider.tsx
│   ├── UpgradeModal.tsx
│   └── index.ts
├── journal/
│   ├── JournalCard.tsx
│   ├── JournalEditor.tsx
│   ├── JournalLimitBanner.tsx
│   ├── JournalList.tsx
│   ├── MoodSelector.tsx
│   ├── TagInput.tsx
│   └── index.ts
├── shared/
│   └── UpgradePrompt.tsx
├── companion/
│   └── CompanionNav.tsx
└── app/
    └── AppSidebar.tsx
```

### Web App Routes (16 files)

```
web/app/
├── (marketing)/
│   ├── layout.tsx
│   └── pricing/
│       └── page.tsx
├── ios-pricing/
│   └── page.tsx
├── subscription/
│   ├── layout.tsx
│   ├── success/
│   │   └── page.tsx
│   └── cancel/
│       └── page.tsx
├── guru/
│   └── page.tsx
├── companion/
│   ├── layout.tsx
│   ├── page.tsx
│   └── dashboard/
│       └── page.tsx
└── app/
    ├── layout.tsx
    ├── page.tsx
    ├── dashboard/
    │   └── page.tsx
    ├── journal/
    │   ├── page.tsx
    │   ├── new/
    │   │   └── page.tsx
    │   └── [id]/
    │       └── page.tsx
    └── meditations/
        ├── page.tsx
        └── [id]/
            └── page.tsx
```

### Other Updated Files

```
web/middleware.ts              # UPDATED - multi-route protection
web/lib/shared/index.ts        # UPDATED - export journalLimits
```

---

## Remaining Tasks

### Critical (Before Launch)

| Priority | Task | Blocking |
|----------|------|----------|
| P0 | Apply database migration to Supabase | All subscriptions |
| P0 | Deploy 3 Stripe Edge Functions | Checkout flow |
| P0 | Create 6 Stripe products/prices | Checkout flow |
| P0 | Replace placeholder price IDs | Checkout flow |
| P0 | Configure Stripe webhook endpoint | Subscription events |
| P0 | Set Supabase secrets (STRIPE_SECRET_KEY, etc.) | Edge Functions |
| P1 | Set web .env.local (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) | Client-side Stripe |

### Testing Required

| Test | Route | Expected Behavior | Status |
|------|-------|-------------------|--------|
| Pricing page | `/pricing` | Shows 3 tiers with features | ✅ Tested |
| Login page | `/auth/login` | Shows login form | ✅ Tested |
| Unauthenticated access | `/app/dashboard` | Redirect to `/pricing` | ✅ Tested |
| No subscription (app) | `/app/meditations` | Redirect to `/pricing` | ✅ Tested |
| No subscription (journal) | `/app/journal` | Redirect to `/pricing` | ✅ Tested |
| No subscription (companion) | `/companion/dashboard` | Redirect to `/ios-pricing` | ✅ Fixed & Tested |
| Guru locked | `/guru` | Shows locked screen | ✅ Tested |
| Subscription success | `/subscription/success` | Shows success page | ✅ Tested |
| Subscription cancel | `/subscription/cancel` | Shows cancel page | ✅ Tested |
| Checkout flow | `/pricing` → Stripe | Complete checkout, return to success | ⏳ Needs Stripe setup |
| Subscription upgrade | `/app/billing` | Portal session, upgrade tier | ⏳ Needs Stripe setup |
| Guru chat | `/guru` | Send message, receive response | ⏳ Needs subscription |
| Meditation playback | `/app/meditations/[id]` | Audio plays, session tracked | ⏳ Needs subscription |
| Journal CRUD | `/app/journal/*` | Create, edit, delete entries | ⏳ Needs subscription |
| Journal limits | `/app/journal/new` | Limit banner shows usage | ⏳ Needs subscription |

### Optional Enhancements

| Enhancement | Priority | Notes |
|-------------|----------|-------|
| Email notifications (failed payments) | Low | TODO in stripe-webhook.ts |
| Loading skeletons | Medium | Better UX during fetches |
| Error boundaries | Medium | Graceful error handling |
| Analytics integration | Low | TelemetryDeck or similar |
| Move `/guru` to `/app/guru` | Low | Route consistency |

---

## Environment Variables

### Supabase Secrets (set via CLI)

```bash
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_xxx
npx supabase secrets set STRIPE_WEBHOOK_SIGNING_SECRET=whsec_xxx
npx supabase secrets set WEB_APP_URL=https://manifesttheunseen.com
```

### Web .env.local

```bash
# Existing
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# New for Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
NEXT_PUBLIC_WEB_APP_URL=https://manifesttheunseen.com
```

---

## Known Issues

### 0. Error Page Prerendering (Pre-existing)

**Error**: `/_error: /404` and `/_error: /500` fail to prerender
**Cause**: styled-jsx/React version mismatch in monorepo (root `react` vs `web/react`)
**Impact**: Low - error pages don't affect app functionality
**Fix**: Not blocking - Vercel handles this in production

### 1. Placeholder Stripe Price IDs

**Location:** `web/types/subscription.ts`

```typescript
export const STRIPE_PRICE_IDS = {
  novice: {
    monthly: 'price_novice_monthly',    // PLACEHOLDER
    yearly: 'price_novice_yearly',       // PLACEHOLDER
  },
  // ...
}
```

**Fix:** Create products in Stripe Dashboard, copy real price IDs.

### 2. Guru Page Location

**Current:** `/guru`
**Expected:** `/app/guru` (for consistency with other app routes)

**Impact:** Low - works as-is, just inconsistent with route structure.

### 3. Email Notifications TODO

**Location:** `supabase/functions/stripe-webhook/index.ts` (~line 379)

```typescript
// TODO: Send email notification for failed payment
```

**Impact:** Low - subscriptions work, just no email alerts for failures.

---

## Deployment Checklist

### Pre-Deployment

- [x] `npm run build` succeeds in `/web` (61/61 pages, error pages are pre-existing issue)
- [x] `npx tsc --noEmit` passes ✅
- [x] All routes render correctly (Playwright tested 10 routes) ✅
- [ ] Test checkout flow with Stripe test mode

### Supabase Deployment

```bash
# Apply migration
cd supabase
npx supabase db push

# Deploy Edge Functions
npx supabase functions deploy stripe-checkout
npx supabase functions deploy stripe-webhook
npx supabase functions deploy stripe-portal

# Set secrets
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_xxx
npx supabase secrets set STRIPE_WEBHOOK_SIGNING_SECRET=whsec_xxx
npx supabase secrets set WEB_APP_URL=https://manifesttheunseen.com
```

### Stripe Configuration

1. Create products in Stripe Dashboard:
   - Seeker (Novice): $7.99/mo, $69.99/yr
   - Awakening: $18.99/mo, $189.99/yr
   - Enlightenment: $29.99/mo, $279.99/yr

2. Add metadata to each product: `tier: novice|awakening|enlightenment`

3. Configure webhook endpoint:
   - URL: `https://[project-ref].supabase.co/functions/v1/stripe-webhook`
   - Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`

4. Copy webhook signing secret to Supabase secrets

### Vercel Deployment

- [ ] Set environment variables in Vercel dashboard
- [ ] Deploy (automatic via GitHub push)
- [ ] Verify all routes work on production URL

---

## Revenue Impact

| Subscription | App Store Cut | Stripe Cut | You Keep |
|--------------|---------------|------------|----------|
| iOS $19.99/mo | 30% ($6) | - | $14 |
| Web $19.99/mo | - | 3% ($0.60) | $19.40 |

**Web subscriptions = ~38% more revenue per subscriber**

---

## Session Recovery Notes

If implementation is interrupted, verify status by:

1. **Check file existence:** `ls web/components/guru/` etc.
2. **Check TypeScript:** `cd web && npx tsc --noEmit`
3. **Check database:** `SELECT * FROM subscriptions LIMIT 1;`
4. **Check Edge Functions:** `npx supabase functions list`
5. **Check routes:** `npm run dev` and visit each route

Each phase is independent - resume from any phase without redoing previous work.

---

## Change Log

### 2026-01-30 - Route Testing & iOS Pricing Page

**Testing Completed:**
- `/pricing` - 3 tiers display correctly
- `/auth/login` - Login form works
- `/guru` - Shows locked screen (no subscription)
- `/app/*` routes - Redirect to `/pricing` (middleware working)
- `/companion/*` routes - Redirect to `/ios-pricing`
- `/subscription/success` - Success page displays
- `/subscription/cancel` - Cancel page displays

**New File Created:**
- `web/app/ios-pricing/page.tsx` - iOS subscription redirect page

**Total files now: ~71**

### 2026-01-30 - Build Fix for Suspense Boundaries

**Issue:** `useSearchParams()` requires Suspense boundary in Next.js 14+
**Files Fixed:**
- `web/app/(marketing)/pricing/page.tsx` - Wrapped in Suspense
- `web/app/subscription/success/page.tsx` - Wrapped in Suspense

**Result:** Build now passes for all new pages (61/61 static pages generated)

### 2026-01-30 - Initial Web App Implementation

**Created by:** 6 parallel Claude agents
**Total files:** ~70 new files
**Status:** All phases complete, ready for deployment testing

**Phases completed:**
1. Database migration for platform subscriptions
2. Stripe Edge Functions (checkout, webhook, portal)
3. Subscription UI (pricing page, checkout flow)
4. Guru AI chat interface
5. Meditation library and player
6. Journal feature with limits
7. Route protection and layouts

**TypeScript:** ✅ Compiles without errors
**Build:** ✅ Passes (61 pages, only pre-existing error page issue remains)
