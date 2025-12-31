---
task_id: TEST-YYYY-MM-###
title: "Test: [Feature/Component]"
test_type: [unit|integration|e2e]
target: [Component/Feature name or TASK-XXX]
phase: "[Phase 1-5] - [Phase Name]"
status: [pending|in-progress|completed]
priority: [P0|P1|P2|P3]
assigned_agent: [unit-test-agent|integration-test-agent|e2e-test-agent]
estimated_hours:
actual_hours:
created: YYYY-MM-DD
updated: YYYY-MM-DD
completed: YYYY-MM-DD
---

## Testing Objective
What needs to be tested and why.

## Target Information
**Related implementation**: TASK-YYYY-MM-###

**Component/Feature**:
- Name and location
- What it does
- Key functionality

**Test coverage goal**: X%

## Test Scope
**In scope**:
- Functions/components to test
- User flows to validate
- Edge cases to cover
- Error scenarios

**Out of scope**:
- What we're not testing (yet)
- Dependencies handled separately

## Test Plan

### Unit Tests (if unit testing)
**Files to test**:
- `src/utils/file1.ts`
- `src/hooks/useFile2.ts`
- `src/components/Component.tsx`

**Test cases**:

#### `function1()`
- [ ] **Happy path**: Returns expected result for valid input
- [ ] **Edge case**: Handles empty input
- [ ] **Edge case**: Handles null/undefined
- [ ] **Error case**: Throws on invalid input
- [ ] **Edge case**: Handles large input

#### `Component1`
- [ ] **Rendering**: Renders without crashing
- [ ] **Props**: Renders with different prop combinations
- [ ] **User interaction**: Responds to button clicks
- [ ] **State changes**: Updates UI on state change
- [ ] **Accessibility**: VoiceOver labels present

### Integration Tests (if integration testing)
**Integration points to test**:
- Component A + Component B interaction
- API call + state update flow
- Form submission + database save

**Test scenarios**:

#### Scenario 1: [Flow name]
1. **Setup**: Initial state/data
2. **Action**: User action or event
3. **Expected**: What should happen
4. **Verify**: What to check

#### Scenario 2: [Flow name]
1. **Setup**: Initial state/data
2. **Action**: User action or event
3. **Expected**: What should happen
4. **Verify**: What to check

### E2E Tests (if E2E testing)
**User flows to test**:

#### Flow 1: [User journey name]
- [ ] **Step 1**: Navigate to screen X
- [ ] **Step 2**: Tap button Y
- [ ] **Step 3**: Enter data Z
- [ ] **Step 4**: Verify result A
- [ ] **Step 5**: Verify persistence (reload app)

#### Flow 2: [User journey name]
- [ ] **Step 1**: Action
- [ ] **Step 2**: Action
- [ ] **Step 3**: Verification

## Test Implementation
**Testing framework**: [Jest|React Native Testing Library|Detox]

**Setup required**:
- Mocks needed
- Test data
- Environment config

**Helper functions**:
- Utility to create
- Reusable test setup

## Test Cases

### TC-001: [Test case name]
**Description**: What this test validates

**Type**: [Unit|Integration|E2E]

**Priority**: [P0|P1|P2]

**Preconditions**:
- State/data required
- Setup needed

**Steps**:
1. Action 1
2. Action 2
3. Action 3

**Expected result**:
- What should happen
- What to verify

**Code**:
```typescript
describe('[Component/Function]', () => {
  it('should [behavior]', () => {
    // Arrange
    const input = ...;

    // Act
    const result = ...;

    // Assert
    expect(result).toBe(expected);
  });
});
```

### TC-002: [Test case name]
[Repeat structure for each test case]

## Edge Cases & Error Scenarios
**Edge cases to test**:
- [ ] Empty state (no data)
- [ ] Loading state
- [ ] Error state (network failure)
- [ ] Large data sets
- [ ] Rapid user interaction
- [ ] Offline mode
- [ ] Low battery/memory

**Error scenarios**:
- [ ] Invalid input
- [ ] Network timeout
- [ ] Authentication failure
- [ ] Permission denied
- [ ] Database error

## Acceptance Criteria
- [ ] All test cases passing
- [ ] Code coverage ≥ X%
- [ ] No skipped tests (without justification)
- [ ] Fast execution time (< Y seconds)
- [ ] No flaky tests
- [ ] Tests are maintainable
- [ ] Tests are documented

## Test Results

### Summary
- **Total tests**: X
- **Passing**: X
- **Failing**: X
- **Skipped**: X
- **Coverage**: X%
- **Execution time**: X seconds

### Failed Tests
1. **TC-XXX**: [Test name]
   - **Failure reason**: Why it failed
   - **Fix needed**: What needs to change

### Coverage Report
- **Statements**: X%
- **Branches**: X%
- **Functions**: X%
- **Lines**: X%

**Uncovered areas**:
- Function/component not tested
- Reason why (if intentional)

## Follow-Up Actions
- [ ] Fix failing test #1
- [ ] Add missing coverage for [area]
- [ ] Refactor test for better clarity
- [ ] Add test documentation
- [ ] Update test data fixtures

## Notes
**Testing challenges encountered**:
- Challenge 1 and solution
- Challenge 2 and solution

**Test maintenance tips**:
- How to update these tests
- Common pitfalls
- Useful debugging techniques
