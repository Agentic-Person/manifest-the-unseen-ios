---
task_id: REVIEW-YYYY-MM-###
title: "[Type] Review - [Target]"
review_type: [code|security|performance|accessibility|architecture]
target: [Component/Feature name or TASK-XXX]
phase: "[Phase 1-5] - [Phase Name]"
status: [pending|in-progress|completed]
priority: [P0|P1|P2|P3]
assigned_agent: [code-reviewer|security-auditor|performance-reviewer|accessibility-reviewer]
estimated_hours:
actual_hours:
created: YYYY-MM-DD
updated: YYYY-MM-DD
completed: YYYY-MM-DD
---

## Review Objective
What aspect of the code/feature is being reviewed and why.

## Scope
**What to review**:
- Files/components included
- Specific concerns to focus on
- Out of scope items

**Review criteria**:
- Standards to apply (React Native best practices, iOS HIG, etc.)
- Performance benchmarks
- Security requirements
- Accessibility guidelines

## Target Information
**Related task**: TASK-YYYY-MM-###

**Files/Components**:
- `path/to/file1.tsx`
- `path/to/file2.ts`
- `path/to/component/`

**Context**:
- What this code does
- Why it was implemented this way
- Key decisions made

## Review Checklist

### Code Quality (if code review)
- [ ] **Readability**: Code is clear and self-documenting
- [ ] **Naming**: Variables, functions, components well-named
- [ ] **Structure**: Logical organization and separation of concerns
- [ ] **DRY**: No unnecessary duplication
- [ ] **SOLID**: Follows SOLID principles
- [ ] **Error Handling**: Comprehensive error handling
- [ ] **TypeScript**: Proper typing, no `any` without justification
- [ ] **Comments**: Complex logic explained

### Security (if security review)
- [ ] **Authentication**: Proper auth checks
- [ ] **Authorization**: RLS policies correct
- [ ] **Data Exposure**: No sensitive data leaked
- [ ] **Injection**: No SQL/XSS/command injection risks
- [ ] **Encryption**: Sensitive data encrypted
- [ ] **API Keys**: No hardcoded secrets
- [ ] **HTTPS**: All API calls use HTTPS
- [ ] **Validation**: Input validation present

### Performance (if performance review)
- [ ] **Rendering**: No unnecessary re-renders
- [ ] **Memoization**: useMemo/useCallback used appropriately
- [ ] **Lists**: FlatList used for long lists
- [ ] **Images**: Images optimized
- [ ] **Network**: API calls optimized, cached when possible
- [ ] **Bundle Size**: No bloated dependencies
- [ ] **Memory**: No memory leaks
- [ ] **Async**: Async operations handled efficiently

### Accessibility (if accessibility review)
- [ ] **VoiceOver**: Screen reader support complete
- [ ] **Labels**: All interactive elements labeled
- [ ] **Touch Targets**: Minimum 44x44pt
- [ ] **Contrast**: Sufficient color contrast
- [ ] **Dynamic Type**: Supports text scaling
- [ ] **Focus**: Logical focus order
- [ ] **Announcements**: Important changes announced
- [ ] **Reduced Motion**: Respects reduce motion setting

### React Native Best Practices
- [ ] **Platform-Specific**: Handles iOS/Android differences
- [ ] **Performance**: Optimized for mobile
- [ ] **Navigation**: Proper navigation patterns
- [ ] **State**: State management appropriate
- [ ] **Styling**: NativeWind used correctly
- [ ] **Native Modules**: Native code justified and minimal

### PRD Alignment
- [ ] **Requirements**: Meets PRD specifications
- [ ] **User Stories**: Satisfies user stories
- [ ] **Acceptance Criteria**: All criteria met
- [ ] **Design**: Matches design specs
- [ ] **Edge Cases**: Handles edge cases

## Findings

### Critical Issues (Must Fix)
1. **[Issue title]**
   - **Location**: `file.ts:123`
   - **Problem**: Description
   - **Impact**: Security/Performance/User impact
   - **Recommendation**: How to fix
   - **Priority**: P0

### High Priority (Should Fix)
1. **[Issue title]**
   - **Location**: `file.ts:456`
   - **Problem**: Description
   - **Impact**: Impact description
   - **Recommendation**: How to fix
   - **Priority**: P1

### Medium Priority (Nice to Fix)
1. **[Issue title]**
   - **Location**: `file.ts:789`
   - **Problem**: Description
   - **Recommendation**: How to fix
   - **Priority**: P2

### Low Priority (Optional)
1. **[Issue title]**
   - **Suggestion**: Improvement idea
   - **Benefit**: What this would improve

## Positive Observations
- What was done well
- Good patterns to replicate
- Clever solutions

## Recommendations
1. **Immediate actions**: Critical fixes needed before merge
2. **Short-term improvements**: Address in next sprint
3. **Long-term considerations**: Technical debt to track

## Approval Status
- [ ] **Approved**: Ready to merge
- [ ] **Approved with minor changes**: Can merge after small fixes
- [ ] **Changes requested**: Needs revision before approval
- [ ] **Rejected**: Major issues, significant rework needed

## Review Notes
**Reviewer**: [Agent name]
**Date**: YYYY-MM-DD

[Detailed review commentary]

## Follow-Up Actions
- [ ] Fix critical issue #1
- [ ] Address high priority issue #2
- [ ] Create technical debt ticket for [issue]
- [ ] Update documentation based on findings
