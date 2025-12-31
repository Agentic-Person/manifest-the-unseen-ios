# Whop Integration Plan

> **Status**: Planning Document (Post-iOS MVP)
> **Created**: 2025-11-23
> **Priority**: After iOS App Store Launch
> **Estimated Build Time**: 4-6 weeks

This document outlines the strategy for integrating **Manifest the Unseen** with the Whop platform as a B2B web application. The Whop version will run alongside the iOS app, sharing the same backend infrastructure.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Whop Web App Specification](#2-whop-web-app-specification)
3. [Authentication Flow](#3-authentication-flow)
4. [Feature Mapping](#4-feature-mapping)
5. [Payment & Subscription Strategy](#5-payment--subscription-strategy)
6. [Implementation Checklist](#6-implementation-checklist)
7. [Technical Reference](#7-technical-reference)
8. [B2B White-Label Strategy](#8-b2b-white-label-strategy)

---

## 1. Architecture Overview

### Two-App Architecture

The Manifest the Unseen ecosystem consists of two separate frontend applications sharing a common backend:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     MANIFEST THE UNSEEN ECOSYSTEM                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────┐      ┌──────────────────────────┐        │
│  │      iOS Mobile App      │      │     Whop Web App         │        │
│  │      (React Native)      │      │     (NextJS)             │        │
│  ├──────────────────────────┤      ├──────────────────────────┤        │
│  │ Distribution:            │      │ Distribution:            │        │
│  │ • Apple App Store        │      │ • Whop App Marketplace   │        │
│  │                          │      │ • Whop iframe embed      │        │
│  ├──────────────────────────┤      ├──────────────────────────┤        │
│  │ Authentication:          │      │ Authentication:          │        │
│  │ • Apple Sign-In          │      │ • Whop OAuth             │        │
│  │ • Email/Password         │      │ • Whop SSO               │        │
│  ├──────────────────────────┤      ├──────────────────────────┤        │
│  │ Payments:                │      │ Payments:                │        │
│  │ • RevenueCat             │      │ • Whop Payments          │        │
│  │ • Apple In-App Purchase  │      │ • Stripe (via Whop)      │        │
│  ├──────────────────────────┤      ├──────────────────────────┤        │
│  │ Target Users:            │      │ Target Users:            │        │
│  │ • Direct consumers       │      │ • B2B (coaches/creators) │        │
│  │ • App Store discovery    │      │ • Whop community members │        │
│  └────────────┬─────────────┘      └────────────┬─────────────┘        │
│               │                                  │                      │
│               └──────────────┬───────────────────┘                      │
│                              │                                          │
│                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │                    SHARED SUPABASE BACKEND                    │      │
│  ├──────────────────────────────────────────────────────────────┤      │
│  │  Database (PostgreSQL)                                        │      │
│  │  • users (with whop_user_id column)                          │      │
│  │  • workbook_progress                                          │      │
│  │  • journal_entries                                            │      │
│  │  • ai_conversations                                           │      │
│  │  • meditation_sessions                                        │      │
│  │  • subscriptions (platform: 'ios' | 'whop')                  │      │
│  │                                                               │      │
│  │  Auth                                                         │      │
│  │  • Supabase Auth (iOS users)                                 │      │
│  │  • Whop user linking via whop_user_id                        │      │
│  │                                                               │      │
│  │  Edge Functions                                               │      │
│  │  • ai-chat (shared)                                          │      │
│  │  • whop-webhook-handler (Whop-specific)                      │      │
│  │                                                               │      │
│  │  Storage                                                      │      │
│  │  • Vision board images                                        │      │
│  │  • Meditation audio files                                     │      │
│  └──────────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Separate frontend apps** | Whop apps run in iframes (web-only), iOS needs native mobile |
| **Shared Supabase backend** | Single source of truth, users can access from both platforms |
| **Platform-specific payments** | Apple requires IAP for iOS; Whop handles web payments |
| **Whop user linking** | `whop_user_id` column in users table enables cross-platform identity |

### User Account Linking Strategy

Users may access Manifest the Unseen from both platforms. Account linking works as follows:

```
Scenario 1: User starts on iOS, later uses Whop
─────────────────────────────────────────────────
1. User signs up on iOS → Supabase user created (email: user@example.com)
2. User later accesses via Whop with same email
3. Whop OAuth returns whop_user_id
4. Backend matches email → links whop_user_id to existing Supabase user
5. All progress, journals, etc. are preserved

Scenario 2: User starts on Whop, later downloads iOS app
─────────────────────────────────────────────────────────
1. User signs up via Whop → Supabase user created with whop_user_id
2. User downloads iOS app, signs in with same email
3. Backend matches email → same user account
4. All progress syncs to mobile app

Scenario 3: Different emails (no linking)
─────────────────────────────────────────
1. User has separate accounts on each platform
2. No automatic linking (different emails)
3. Manual account merge available via support
```

---

## 2. Whop Web App Specification

### Project Structure

The Whop web app will be a separate NextJS project in the monorepo:

```
manifest-the-unseen/
├── mobile/                    # React Native iOS app (existing)
├── web/                       # Whop NextJS app (new)
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Landing/redirect
│   │   ├── experience/       # Experience Views (end users)
│   │   │   ├── workbook/
│   │   │   ├── journal/
│   │   │   ├── meditate/
│   │   │   └── chat/
│   │   └── dashboard/        # Dashboard Views (company owners)
│   │       ├── analytics/
│   │       ├── members/
│   │       └── settings/
│   ├── components/
│   │   ├── ui/               # Frosted UI components
│   │   └── workbook/         # Workbook-specific components
│   ├── lib/
│   │   ├── whop.ts           # Whop SDK client
│   │   ├── supabase.ts       # Supabase client (shared config)
│   │   └── auth.ts           # Auth utilities
│   ├── .env.local
│   ├── package.json
│   └── next.config.js
├── packages/
│   └── shared/               # Shared TypeScript (existing plan)
│       ├── models/
│       ├── validation/
│       └── api/
└── supabase/                  # Database migrations, Edge Functions
```

### Whop App Types

Whop apps have two view types:

#### Experience View (End Users)
What Whop members see when they access the app:

| Feature | Description |
|---------|-------------|
| Workbook | All 10 phases with exercises (same as iOS) |
| Journal | Voice journaling with transcription |
| Meditate | Audio meditation player |
| AI Chat | Wisdom chat with Claude |
| Progress | Dashboard showing completion stats |

#### Dashboard View (Company Owners)
What coaches/creators see when managing their Whop:

| Feature | Description |
|---------|-------------|
| Member Analytics | Track member engagement, completion rates |
| Content Customization | Add custom prompts, branding (future) |
| Revenue Dashboard | Subscription metrics, MRR |
| Member Management | View/manage member access |

### Technology Stack

```json
{
  "framework": "Next.js 14+ (App Router)",
  "ui": "@whop/frosted-ui",
  "sdk": "@whop/sdk",
  "database": "@supabase/supabase-js",
  "styling": "Tailwind CSS",
  "state": "Zustand + TanStack Query",
  "forms": "React Hook Form + Zod",
  "deployment": "Vercel"
}
```

### Frosted UI Components

Whop provides `@whop/frosted-ui` for consistent design:

```tsx
import { Button, Card, Input, Modal } from '@whop/frosted-ui';

// Components auto-adapt to Whop's light/dark mode
export function WorkbookCard({ phase }) {
  return (
    <Card>
      <h3>{phase.title}</h3>
      <p>{phase.description}</p>
      <Button variant="primary">Start Phase</Button>
    </Card>
  );
}
```

---

## 3. Authentication Flow

### Whop OAuth Integration

```
┌─────────────────────────────────────────────────────────────┐
│                    WHOP AUTH FLOW                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User clicks "Open App" in Whop                         │
│     │                                                       │
│     ▼                                                       │
│  2. Whop loads app in iframe with auth token               │
│     │                                                       │
│     ▼                                                       │
│  3. App calls verifyUserToken() with Whop SDK              │
│     │                                                       │
│     ▼                                                       │
│  4. SDK returns { userId, email, ... }                     │
│     │                                                       │
│     ▼                                                       │
│  5. App checks Supabase for existing user                  │
│     │                                                       │
│     ├─── User exists (by email or whop_user_id)            │
│     │    → Update whop_user_id if needed                   │
│     │    → Create session                                   │
│     │                                                       │
│     └─── User doesn't exist                                │
│          → Create new Supabase user                        │
│          → Set whop_user_id                                │
│          → Create session                                   │
│                                                             │
│  6. User is now authenticated                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Code Example: Auth Middleware

```typescript
// web/lib/auth.ts
import { Whop } from '@whop/sdk';
import { createClient } from '@supabase/supabase-js';

const whop = new Whop({
  apiKey: process.env.WHOP_API_KEY!,
  appId: process.env.WHOP_APP_ID!,
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Server-side only
);

export async function authenticateWhopUser(headers: Headers) {
  // 1. Verify Whop token
  const whopUser = await whop.verifyUserToken(headers);

  if (!whopUser) {
    throw new Error('Invalid Whop token');
  }

  // 2. Find or create Supabase user
  let { data: user } = await supabase
    .from('users')
    .select('*')
    .or(`whop_user_id.eq.${whopUser.id},email.eq.${whopUser.email}`)
    .single();

  if (!user) {
    // Create new user
    const { data: newUser } = await supabase
      .from('users')
      .insert({
        email: whopUser.email,
        whop_user_id: whopUser.id,
        display_name: whopUser.name,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    user = newUser;
  } else if (!user.whop_user_id) {
    // Link existing user to Whop
    await supabase
      .from('users')
      .update({ whop_user_id: whopUser.id })
      .eq('id', user.id);
  }

  return user;
}
```

### Access Control

```typescript
// Check if user has access to specific features
export async function checkMembershipAccess(
  whopUserId: string,
  companyId: string
) {
  const hasAccess = await whop.checkAccess({
    userId: whopUserId,
    companyId: companyId,
  });

  return hasAccess;
}
```

---

## 4. Feature Mapping

### iOS to Web Feature Parity

| iOS Feature | Web Equivalent | Notes |
|-------------|----------------|-------|
| **Workbook Phases 1-10** | ✅ Full parity | Same exercises, web-optimized UI |
| **Voice Journaling** | ✅ Web Audio API | Browser-based recording |
| **Whisper Transcription** | ⚠️ Server-side | Can't run on-device in browser |
| **Meditation Player** | ✅ HTML5 Audio | Same audio files |
| **AI Wisdom Chat** | ✅ Full parity | Same Edge Function |
| **Vision Boards** | ✅ Full parity | Drag-drop may be easier on web |
| **Progress Tracking** | ✅ Full parity | Same database |
| **Push Notifications** | ⚠️ Web Push | Different API, optional |
| **Offline Mode** | ❌ Limited | Service worker caching possible |
| **Apple Sign-In** | ❌ Not applicable | Whop auth only |

### Web-Only Features

| Feature | Description |
|---------|-------------|
| **Dashboard Views** | Analytics for company owners |
| **Keyboard Shortcuts** | Power user features |
| **Larger Screen Layouts** | Multi-column workbook views |
| **Print/Export** | Generate PDF workbook exports |
| **Embed Widgets** | Embeddable progress widgets |

### Voice Journaling Adaptation

iOS uses on-device Whisper for privacy. Web version options:

| Option | Pros | Cons |
|--------|------|------|
| **Server-side Whisper** | Works everywhere | Audio sent to server (privacy) |
| **Whisper.cpp WASM** | Client-side | Large download, slow |
| **OpenAI Whisper API** | Fast, accurate | Costs per minute |

**Recommendation**: Offer choice - "Private mode" (no transcription) or "Enhanced mode" (server transcription with consent).

---

## 5. Payment & Subscription Strategy

### Platform-Specific Payments

```
┌─────────────────────────────────────────────────────────────┐
│                    PAYMENT ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  iOS App                        Whop Web App               │
│  ─────────                      ────────────               │
│  RevenueCat                     Whop Payments              │
│      │                              │                       │
│      ▼                              ▼                       │
│  Apple IAP                      Stripe                     │
│      │                              │                       │
│      └──────────────┬───────────────┘                       │
│                     │                                       │
│                     ▼                                       │
│           ┌─────────────────┐                              │
│           │   Supabase      │                              │
│           │   subscriptions │                              │
│           │   table         │                              │
│           └─────────────────┘                              │
│                                                             │
│  Schema:                                                    │
│  subscriptions {                                            │
│    user_id: uuid,                                          │
│    platform: 'ios' | 'whop',                               │
│    tier: 'novice' | 'awakening' | 'enlightenment',         │
│    status: 'active' | 'cancelled' | 'expired',             │
│    external_id: string, // RevenueCat or Whop sub ID       │
│    expires_at: timestamp,                                   │
│  }                                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Tier Mapping

| Tier | iOS (RevenueCat) | Whop | Features |
|------|------------------|------|----------|
| **Novice Path** | $7.99/mo | Custom pricing | Phases 1-5, 3 meditations |
| **Awakening Path** | $12.99/mo | Custom pricing | Phases 1-8, 6 meditations |
| **Enlightenment Path** | $19.99/mo | Custom pricing | All content, unlimited |

### Whop Payment Integration

```typescript
// Create checkout for Whop user
const checkout = await whop.checkoutConfigurations.create({
  company_id: process.env.WHOP_COMPANY_ID,
  plan_id: 'plan_enlightenment_monthly',
  user_id: whopUser.id,
});

// Redirect user to checkout
redirect(checkout.url);
```

### Webhook Handling

```typescript
// supabase/functions/whop-webhook-handler/index.ts
import { Whop } from '@whop/sdk';

const whop = new Whop({ apiKey: Deno.env.get('WHOP_API_KEY')! });

Deno.serve(async (req) => {
  const event = await whop.webhooks.unwrap(
    await req.text(),
    req.headers.get('whop-signature')!
  );

  switch (event.type) {
    case 'membership.created':
      await handleNewMembership(event.data);
      break;
    case 'membership.cancelled':
      await handleCancellation(event.data);
      break;
    case 'payment.completed':
      await handlePayment(event.data);
      break;
  }

  return new Response('OK');
});

async function handleNewMembership(data: MembershipData) {
  // Update user's subscription in Supabase
  await supabase
    .from('subscriptions')
    .upsert({
      user_id: data.user_id, // Linked via whop_user_id
      platform: 'whop',
      tier: mapWhopPlanToTier(data.plan_id),
      status: 'active',
      external_id: data.membership_id,
      expires_at: data.expires_at,
    });
}
```

---

## 6. Implementation Checklist

### Prerequisites (Before Starting Whop Development)

- [ ] iOS app is live on App Store
- [ ] iOS app has stable user base (validates product-market fit)
- [ ] Supabase backend is production-ready
- [ ] Shared TypeScript package is extracted (`packages/shared`)
- [ ] Whop developer account and app registration confirmed

### Phase 1: Project Setup (Week 1)

- [ ] Create `web/` directory with NextJS 14 app
- [ ] Install Whop SDK (`@whop/sdk`) and Frosted UI
- [ ] Configure environment variables
- [ ] Set up Supabase client for web
- [ ] Configure Whop dev proxy for local development
- [ ] Add `whop_user_id` column to users table (migration)

### Phase 2: Authentication (Week 2)

- [ ] Implement Whop OAuth flow
- [ ] Create user linking logic (Whop → Supabase)
- [ ] Build auth middleware for API routes
- [ ] Test auth flow in Whop dev environment
- [ ] Handle edge cases (existing users, email mismatches)

### Phase 3: Core Experience Views (Weeks 2-4)

- [ ] Port workbook UI to web (Phases 1-10)
- [ ] Implement journal feature (web audio recording)
- [ ] Implement meditation player (HTML5 audio)
- [ ] Implement AI chat interface
- [ ] Build progress dashboard
- [ ] Responsive design for various screen sizes

### Phase 4: Payments & Subscriptions (Week 4)

- [ ] Create Whop checkout integration
- [ ] Build webhook handler Edge Function
- [ ] Implement feature gating based on subscription
- [ ] Test payment flows end-to-end
- [ ] Handle subscription upgrades/downgrades

### Phase 5: Dashboard Views (Week 5)

- [ ] Build company owner analytics dashboard
- [ ] Member engagement metrics
- [ ] Revenue/subscription overview
- [ ] Access control for dashboard vs experience views

### Phase 6: Polish & Launch (Week 6)

- [ ] Light/dark mode testing
- [ ] Error handling and edge cases
- [ ] Performance optimization
- [ ] Whop App Store submission
- [ ] Documentation and support materials

### Post-Launch

- [ ] Monitor analytics and user feedback
- [ ] Iterate on web-specific UX improvements
- [ ] Consider B2B white-label features

---

## 7. Technical Reference

### Environment Variables

```bash
# .env.local (web app)

# Whop
WHOP_API_KEY=whop_xxx
NEXT_PUBLIC_WHOP_APP_ID=app_xxx
WHOP_WEBHOOK_SECRET=whsec_xxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_KEY=eyJxxx  # Server-side only

# AI Services (same as iOS)
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx

# App Config
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Whop API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `verifyUserToken()` | Authenticate incoming user |
| `checkAccess()` | Verify membership permissions |
| `checkoutConfigurations.create()` | Create payment checkout |
| `webhooks.unwrap()` | Verify and parse webhooks |
| `memberships.list()` | Get user's memberships |

### Database Schema Additions

```sql
-- Migration: Add Whop user linking
ALTER TABLE users
ADD COLUMN whop_user_id TEXT UNIQUE;

-- Index for fast lookups
CREATE INDEX idx_users_whop_user_id ON users(whop_user_id);

-- Update subscriptions table
ALTER TABLE subscriptions
ADD COLUMN platform TEXT NOT NULL DEFAULT 'ios'
CHECK (platform IN ('ios', 'whop'));
```

### Webhook Events to Handle

| Event | Action |
|-------|--------|
| `membership.created` | Create/update subscription record |
| `membership.cancelled` | Mark subscription as cancelled |
| `membership.expired` | Mark subscription as expired |
| `payment.completed` | Log payment, extend subscription |
| `payment.failed` | Alert user, retry logic |

---

## 8. B2B White-Label Strategy

### Vision: Coaches & Creators on Whop

The Whop integration opens B2B opportunities where other coaches and creators on Whop can offer Manifest the Unseen to their communities:

```
┌─────────────────────────────────────────────────────────────┐
│                    B2B WHITE-LABEL MODEL                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Coach A's Whop          Coach B's Whop         Our Whop   │
│  ─────────────          ─────────────          ─────────   │
│  "Mindset Mastery"      "Spiritual Growth"     "Manifest"  │
│       │                      │                     │        │
│       └──────────────────────┼─────────────────────┘        │
│                              │                              │
│                              ▼                              │
│                    ┌─────────────────┐                     │
│                    │  Manifest the   │                     │
│                    │  Unseen App     │                     │
│                    │  (Multi-tenant) │                     │
│                    └─────────────────┘                     │
│                                                             │
│  Features per Company:                                      │
│  • Custom branding (logo, colors) - Future                 │
│  • Custom welcome message                                   │
│  • Member analytics dashboard                              │
│  • Revenue sharing (Whop handles)                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Future White-Label Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Custom Branding | Company logo, accent colors | Medium |
| Custom Prompts | Add company-specific exercises | Low |
| Co-Branding | "Powered by Manifest the Unseen" | High |
| Analytics Export | CSV/API access to member data | Medium |
| Custom AI Persona | Train AI on company's content | Low |

### Revenue Model

- **Direct sales**: Our Whop → 100% revenue (minus Whop fees)
- **B2B partners**: Their Whop → Revenue share (e.g., 70/30)
- **Enterprise**: Custom pricing for large organizations

---

## Summary

The Whop integration is a **separate web application** that:

1. **Does not affect iOS development** - Completely independent codebase
2. **Shares the Supabase backend** - Same users, data, and AI services
3. **Opens B2B opportunities** - Coaches/creators can offer to their communities
4. **Should be built after iOS MVP** - Validates product before expanding

### Timeline Estimate

| Phase | Duration | Milestone |
|-------|----------|-----------|
| iOS MVP → App Store | Current focus | Product validation |
| Whop Setup + Auth | 2 weeks | Users can sign in |
| Core Features | 2-3 weeks | Full workbook + AI chat |
| Payments + Polish | 1-2 weeks | Ready for Whop App Store |
| **Total** | **4-6 weeks** | Post-iOS launch |

---

*Document version: 1.0*
*Last updated: 2025-11-23*
