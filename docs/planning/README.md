# Planning

Core project planning documents for the Manifest the Unseen iOS app.

---

## Key Documents

| Document | Description | Size |
|----------|-------------|------|
| [manifest-the-unseen-prd.md](manifest-the-unseen-prd.md) | **Product Requirements Document** - Complete feature specs, business logic, user stories | ~54KB |
| [manifest-the-unseen-tdd.md](manifest-the-unseen-tdd.md) | **Technical Design Document** - Architecture, database schema, API design | ~45KB |
| [manifest-the-unseen-summary.md](manifest-the-unseen-summary.md) | Quick reference summary of key decisions | ~10KB |
| [mtu-roadmap.md](mtu-roadmap.md) | Development roadmap and timeline | ~30KB |
| [project-structure.md](project-structure.md) | Monorepo folder structure guide | ~13KB |

---

## Document Hierarchy

```
PRD (What to build)
 |
 +-- TDD (How to build it)
      |
      +-- Roadmap (When to build it)
           |
           +-- Project Structure (Where things go)
```

---

## Reading Order for New Developers

1. **[manifest-the-unseen-summary.md](manifest-the-unseen-summary.md)** - Start here for a quick overview
2. **[manifest-the-unseen-prd.md](manifest-the-unseen-prd.md)** - Read key sections (especially Sections 1-5)
3. **[manifest-the-unseen-tdd.md](manifest-the-unseen-tdd.md)** - Review architecture decisions
4. **[mtu-roadmap.md](mtu-roadmap.md)** - Understand current development phase

---

## Quick Reference

### Product Vision
Digitize a 202-page manifestation workbook into a transformative iOS app with AI-guided wisdom, voice journaling, and meditation practices.

### Tech Stack
- **Frontend:** React Native + TypeScript + NativeWind
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **AI:** Claude API + OpenAI embeddings + pgvector

### Subscription Tiers
| Tier | Price | Features |
|------|-------|----------|
| Novice Path | $7.99/mo | Phases 1-5, basic features |
| Awakening Path | $12.99/mo | Phases 1-8, more features |
| Enlightenment Path | $19.99/mo | All 10 phases, unlimited |

---

## Document Maintenance

These are **living documents** that should be updated as requirements evolve:

- **PRD:** Update when features change or new requirements emerge
- **TDD:** Update when architecture decisions change
- **Roadmap:** Update weekly with progress
- **Summary:** Keep in sync with PRD/TDD changes

---

*See [main docs README](../README.md) for complete documentation index.*
