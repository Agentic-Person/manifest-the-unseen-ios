# MCP Infrastructure Testing Handoff

**Created**: 2025-11-21
**Purpose**: Instructions for Claude Code session WITH MCP servers to execute infrastructure testing
**Priority**: High
**Estimated Duration**: ~45 minutes (excluding Android Studio installation)

---

## Prerequisites

This Claude Code session MUST have the following MCP servers configured:

### Required MCP Servers

1. **Supabase MCP** - For database verification
   ```json
   "supabase": {
     "command": "npx",
     "args": ["-y", "@supabase/mcp-server"]
   }
   ```

2. **Playwright MCP** - For E2E testing automation
   ```json
   "playwright": {
     "command": "npx",
     "args": ["-y", "@executeautomation/playwright-mcp-server"]
   }
   ```

### Verify MCP Status
Run `/mcp` to confirm servers are connected before proceeding.

---

## Project Context

**Project**: Manifest the Unseen - iOS manifestation workbook app
**Location**: `C:\projects\mobileApps\manifest-the-unseen-ios`
**Current Phase**: Week 3 of 28 - Infrastructure + Authentication
**Status**: Infrastructure built, needs end-to-end testing

### What's Already Built
- React Native + Expo SDK 54 (272 packages)
- Supabase local instance with 8 tables, 27 RLS policies
- Authentication service (371 lines, 10 methods)
- 4 auth screens: Welcome, Login, Signup, Forgot Password
- Navigation: Auth flow + 5-tab main navigator
- Design system: purple/gold brand, 5 atomic components

### What Needs Testing
- Supabase services running correctly
- Database schema verified
- Auth flow works end-to-end
- UI screens render and navigate properly

---

## Agent Orchestration Pattern

Use **Orchestrator + 3 Specialists** for parallel processing:

```
┌─────────────────────────────────────┐
│     INFRASTRUCTURE ORCHESTRATOR     │
│  (You - coordinates all agents)     │
└──────────────┬──────────────────────┘
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│ INFRA  │ │  E2E   │ │  DOCS  │
│VERIFIER│ │ TESTER │ │UPDATER │
└────────┘ └────────┘ └────────┘
    │          │          │
    ▼          ▼          ▼
 Supabase   Playwright   File
   MCP        MCP       System
```

### Spawn Sub-Agents Using Task Tool

You can spawn parallel agents using the Task tool with subagent_type. Run these in parallel where possible.

---

## Execution Plan

### Phase 1: Environment Verification (5 min)

Run these commands to verify environment:

```bash
# Check Node.js
node --version  # Should be v18+

# Start Supabase (if not running)
npx supabase start

# Check Supabase status
npx supabase status

# Verify TypeScript
cd mobile && npm run type-check  # Should show 0 errors
```

### Phase 2: Database Verification via Supabase MCP (10 min)

Using the Supabase MCP, verify:

1. **Tables exist** (8 tables):
   - `users`
   - `workbook_progress`
   - `journal_entries`
   - `meditations`
   - `meditation_sessions`
   - `ai_conversations`
   - `vision_boards`
   - `knowledge_embeddings`

2. **RLS Policies active** (27 policies total)
   - Each user table should have SELECT, INSERT, UPDATE, DELETE policies
   - Policies should filter by `auth.uid() = user_id`

3. **Auth configuration**
   - Email/password provider enabled
   - Apple Sign-In provider configured (placeholder)

### Phase 3: E2E Auth Testing via Playwright MCP (20 min)

Using the Playwright MCP, automate testing:

#### Test 1: Screen Navigation
```
1. Start Expo: cd mobile && npm start
2. Open app in browser (press 'w') or emulator
3. Navigate: Welcome → Login → Signup → Forgot Password
4. Screenshot each screen
5. Verify all screens render without errors
```

#### Test 2: Form Validation
```
1. On Signup screen:
   - Submit empty form → verify error messages
   - Enter invalid email → verify validation
   - Enter mismatched passwords → verify error
   - Screenshot validation states

2. On Login screen:
   - Submit empty form → verify error messages
   - Enter invalid credentials → verify error handling
```

#### Test 3: Auth Flow E2E
```
1. On Signup screen:
   - Fill: Name = "Test User"
   - Fill: Email = "test@example.com"
   - Fill: Password = "TestPass123!"
   - Fill: Confirm Password = "TestPass123!"
   - Check Terms checkbox
   - Submit form

2. Verify in Supabase:
   - Open http://localhost:54323 (Supabase Studio)
   - Navigate to Authentication > Users
   - Confirm test user was created

3. On Login screen:
   - Enter test credentials
   - Submit
   - Verify navigation to main app (TabNavigator)
   - Verify Profile tab shows user info

4. Test Sign Out:
   - Find sign out button in Profile
   - Tap sign out
   - Verify return to Welcome screen
```

### Phase 4: Document Results (10 min)

After testing, update these files:

#### Update: `MTU-PROJECT-STATUS.md`
- Change "Last Activity" date to test date
- Update "What's Working Right Now" section:
  - Change `🚧 Database Tables` to `✅ Database Tables - Verified with real data`
  - Change `❌ Real Authentication Flow` to `✅ Real Authentication Flow - Tested end-to-end`
- Add test results to "Testing Status" section
- Mark manual testing checklist items as complete

#### Create: `agent-orchestration/logs/sessions/2025-11/session-2025-11-21.md`
Use this template:
```markdown
# Development Session Log - November 21, 2025

**Date**: 2025-11-21
**Phase**: Infrastructure Testing
**Week**: Week 3 of 28

## Session Objectives
1. Verify Supabase infrastructure via MCP
2. Run E2E auth tests via Playwright MCP
3. Document test results

## Work Completed
[Fill in with actual results]

## Test Results
- [ ] Supabase services: [PASS/FAIL]
- [ ] Database tables verified: [PASS/FAIL]
- [ ] RLS policies active: [PASS/FAIL]
- [ ] Auth screens render: [PASS/FAIL]
- [ ] Form validation works: [PASS/FAIL]
- [ ] Signup creates user: [PASS/FAIL]
- [ ] Login establishes session: [PASS/FAIL]
- [ ] Sign out works: [PASS/FAIL]

## Screenshots Captured
[List any screenshots taken by Playwright]

## Issues Discovered
[Document any bugs or problems found]

## Next Session Priorities
1. Start Workbook Phase 1 (Wheel of Life, SWOT Analysis)
2. [Other priorities based on findings]
```

---

## Success Criteria

All of these must be true when complete:

- [ ] Supabase status shows all services "Running"
- [ ] All 8 database tables confirmed to exist
- [ ] RLS policies are active on user tables
- [ ] Welcome screen renders correctly
- [ ] Login screen renders with form validation
- [ ] Signup screen renders with all fields
- [ ] Forgot Password screen renders
- [ ] Navigation between auth screens works
- [ ] Test user successfully created in database
- [ ] Test user can log in and reach main app
- [ ] Sign out returns to Welcome screen
- [ ] MTU-PROJECT-STATUS.md updated with results
- [ ] Session log created with test results

---

## Troubleshooting

### Supabase Not Starting
```bash
# Check Docker is running
docker ps

# Reset Supabase if needed
npx supabase stop
npx supabase start
```

### Expo Not Starting
```bash
# Clear cache
cd mobile
npx expo start --clear
```

### Playwright Can't Connect
```bash
# Install browsers
npx playwright install

# Verify playwright MCP is responding
# Check /mcp output for playwright server status
```

### Database Connection Issues
- Verify `.env` has correct Supabase URL: `http://localhost:54321`
- Verify anon key matches output from `npx supabase status`

---

## Files to Reference

| File | Purpose |
|------|---------|
| `MTU-PROJECT-STATUS.md` | Current project state (UPDATE THIS) |
| `CLAUDE.md` | Project instructions and context |
| `docs/manifest-the-unseen-prd.md` | Product requirements |
| `docs/manifest-the-unseen-tdd.md` | Technical design |
| `mobile/src/services/auth.ts` | Auth service implementation |
| `mobile/src/screens/auth/` | Auth screen components |
| `supabase/migrations/` | Database schema |

---

## After Completion

1. Mark this task file as complete by moving to `agent-orchestration/tasks/completed/`
2. Update `MTU-PROJECT-STATUS.md` with final test results
3. Commit changes: `git add . && git commit -m "test: verify infrastructure and auth flow E2E"`
4. Note any issues in session log for future fixes

---

**Handoff prepared by**: Claude Code (Session without MCP)
**Handoff date**: 2025-11-21
**Ready for execution**: Yes - pending MCP server configuration
