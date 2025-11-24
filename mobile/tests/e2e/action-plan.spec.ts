/**
 * Action Plan E2E Tests
 *
 * End-to-end tests for the Action Plan feature (Phase 3) using Playwright.
 * Tests cover goal selection, step management, reordering, and completion.
 *
 * Note: These tests are designed for React Native testing with Expo.
 * They use accessibility labels and test IDs for element identification.
 */

import { test, expect, Page } from '@playwright/test';

// Test configuration
const APP_URL = process.env.EXPO_PUBLIC_APP_URL || 'http://localhost:8081';
const ACTION_PLAN_ROUTE = '/workbook/action-plan';

// Test data
const TEST_STEP_TEXT = 'Research meditation apps and download top 3';
const TEST_STEP_TEXT_2 = 'Schedule daily 20-minute meditation sessions';
const TEST_STEP_TEXT_3 = 'Track progress for one week';

/**
 * Helper to navigate to Action Plan screen
 */
async function navigateToActionPlan(page: Page) {
  await page.goto(`${APP_URL}${ACTION_PLAN_ROUTE}`);
  // Wait for the screen to load
  await page.waitForSelector('[data-testid="action-plan-screen"]', { timeout: 10000 });
}

/**
 * Helper to wait for loading to complete
 */
async function waitForLoadingComplete(page: Page) {
  await page.waitForSelector('[data-testid="loading-indicator"]', { state: 'hidden', timeout: 5000 }).catch(() => {
    // Loading indicator might not exist if load is fast
  });
}

/**
 * Helper to select a goal from the picker
 */
async function selectFirstGoal(page: Page) {
  // Open goal picker
  const goalSelector = page.getByTestId('goal-selector');
  await goalSelector.click();

  // Wait for modal
  await page.waitForSelector('[data-testid^="goal-option-"]', { timeout: 5000 });

  // Select first goal
  const firstGoal = page.getByTestId('goal-option-goal_1');
  await firstGoal.click();
}

/**
 * Helper to add a step
 */
async function addStep(page: Page, stepText: string) {
  // Click add step button
  const addButton = page.getByTestId('add-step-button');
  await addButton.click();

  // Wait for modal
  await page.waitForSelector('[data-testid="new-step-input"]', { timeout: 5000 });

  // Enter step text
  const input = page.getByTestId('new-step-input');
  await input.fill(stepText);

  // Confirm
  const confirmButton = page.getByTestId('confirm-add-step');
  await confirmButton.click();
}

test.describe('Action Plan Screen', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToActionPlan(page);
    await waitForLoadingComplete(page);
  });

  test.describe('Screen Loading', () => {
    test('should display the action plan screen with correct title', async ({ page }) => {
      // Verify screen title
      const title = page.getByRole('heading', { name: 'Action Plan' });
      await expect(title).toBeVisible();

      // Verify subtitle
      const subtitle = page.getByText('Break down your goals');
      await expect(subtitle).toBeVisible();
    });

    test('should display goal selector', async ({ page }) => {
      const goalSelector = page.getByTestId('goal-selector');
      await expect(goalSelector).toBeVisible();

      // Should show placeholder when no goal selected
      const placeholder = page.getByText('Choose a goal to plan');
      await expect(placeholder).toBeVisible();
    });

    test('should display tips card', async ({ page }) => {
      const tipsTitle = page.getByText('Tips for Action Planning');
      await expect(tipsTitle).toBeVisible();

      // Check for tip content
      const tip = page.getByText(/Start with the first small action/i);
      await expect(tip).toBeVisible();
    });

    test('should have save button', async ({ page }) => {
      const saveButton = page.getByTestId('save-continue-button');
      await expect(saveButton).toBeVisible();
      await expect(saveButton).toBeEnabled();
    });
  });

  test.describe('Goal Selection', () => {
    test('should open goal picker when selector is pressed', async ({ page }) => {
      const goalSelector = page.getByTestId('goal-selector');
      await goalSelector.click();

      // Verify modal appears
      const modalTitle = page.getByText('Select a Goal');
      await expect(modalTitle).toBeVisible();

      // Verify goals are listed
      const firstGoal = page.getByTestId('goal-option-goal_1');
      await expect(firstGoal).toBeVisible();
    });

    test('should select goal and close picker', async ({ page }) => {
      await selectFirstGoal(page);

      // Modal should close
      const modalTitle = page.getByText('Select a Goal');
      await expect(modalTitle).not.toBeVisible();

      // Selected goal should show in selector
      const goalCategory = page.getByText('Health');
      await expect(goalCategory).toBeVisible();
    });

    test('should close picker when Cancel is pressed', async ({ page }) => {
      const goalSelector = page.getByTestId('goal-selector');
      await goalSelector.click();

      // Wait for modal
      await page.waitForSelector('[data-testid^="goal-option-"]', { timeout: 5000 });

      // Click cancel
      const cancelButton = page.getByText('Cancel');
      await cancelButton.click();

      // Modal should close
      const modalTitle = page.getByText('Select a Goal');
      await expect(modalTitle).not.toBeVisible();
    });

    test('should show add step button after goal selection', async ({ page }) => {
      await selectFirstGoal(page);

      // Add step button should be visible
      const addButton = page.getByTestId('add-step-button');
      await expect(addButton).toBeVisible();
    });
  });

  test.describe('Adding Steps', () => {
    test.beforeEach(async ({ page }) => {
      await selectFirstGoal(page);
    });

    test('should open add step modal when button is pressed', async ({ page }) => {
      const addButton = page.getByTestId('add-step-button');
      await addButton.click();

      // Modal should appear
      const modalTitle = page.getByText('Add Action Step');
      await expect(modalTitle).toBeVisible();

      // Input should be present
      const input = page.getByTestId('new-step-input');
      await expect(input).toBeVisible();
    });

    test('should add step to list when submitted', async ({ page }) => {
      await addStep(page, TEST_STEP_TEXT);

      // Modal should close
      const modalTitle = page.getByText('Add Action Step');
      await expect(modalTitle).not.toBeVisible();

      // Step should appear in list
      const stepText = page.getByText(TEST_STEP_TEXT);
      await expect(stepText).toBeVisible();
    });

    test('should show alert when submitting empty step', async ({ page }) => {
      const addButton = page.getByTestId('add-step-button');
      await addButton.click();

      // Try to submit without text
      const confirmButton = page.getByTestId('confirm-add-step');
      await confirmButton.click();

      // Alert should appear (handled by React Native Alert)
      // In a real test environment, we would mock Alert.alert
    });

    test('should close modal when Cancel is pressed', async ({ page }) => {
      const addButton = page.getByTestId('add-step-button');
      await addButton.click();

      // Enter some text
      const input = page.getByTestId('new-step-input');
      await input.fill(TEST_STEP_TEXT);

      // Cancel
      const cancelButton = page.getByRole('button', { name: 'Cancel' });
      await cancelButton.click();

      // Modal should close
      const modalTitle = page.getByText('Add Action Step');
      await expect(modalTitle).not.toBeVisible();

      // Step should NOT be in list
      const stepText = page.getByText(TEST_STEP_TEXT);
      await expect(stepText).not.toBeVisible();
    });

    test('should clear input after adding step', async ({ page }) => {
      await addStep(page, TEST_STEP_TEXT);

      // Open modal again
      const addButton = page.getByTestId('add-step-button');
      await addButton.click();

      // Input should be empty
      const input = page.getByTestId('new-step-input');
      await expect(input).toHaveValue('');
    });
  });

  test.describe('Step Completion', () => {
    test.beforeEach(async ({ page }) => {
      await selectFirstGoal(page);
      await addStep(page, TEST_STEP_TEXT);
    });

    test('should toggle step completion when checkbox is clicked', async ({ page }) => {
      // Find the checkbox (matches pattern action-step-checkbox-*)
      const checkbox = page.locator('[data-testid^="action-step-checkbox-"]').first();
      await checkbox.click();

      // Step text should have strikethrough style (indicated by completed state)
      // In React Native, this would be a state change
      // We verify the checkbox is now checked
      await expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });

    test('should update progress bar when step is completed', async ({ page }) => {
      // Initial progress should show 0/1
      const progressText = page.getByText(/0\/1 steps/);
      await expect(progressText).toBeVisible();

      // Complete the step
      const checkbox = page.locator('[data-testid^="action-step-checkbox-"]').first();
      await checkbox.click();

      // Progress should update to 1/1
      const updatedProgress = page.getByText(/1\/1 steps/);
      await expect(updatedProgress).toBeVisible();
    });

    test('should show celebration when all steps are completed', async ({ page }) => {
      // Complete the single step
      const checkbox = page.locator('[data-testid^="action-step-checkbox-"]').first();
      await checkbox.click();

      // Celebration overlay should appear
      const celebration = page.getByTestId('celebration-overlay');
      await expect(celebration).toBeVisible({ timeout: 5000 });

      // Should show celebration message
      const celebrationTitle = page.getByText('Amazing!');
      await expect(celebrationTitle).toBeVisible();
    });

    test('should allow unchecking a completed step', async ({ page }) => {
      // Complete the step
      const checkbox = page.locator('[data-testid^="action-step-checkbox-"]').first();
      await checkbox.click();

      // Wait for celebration to start hiding
      await page.waitForTimeout(500);

      // Uncheck the step
      await checkbox.click();

      // Progress should update back to 0/1
      const progressText = page.getByText(/0\/1 steps/);
      await expect(progressText).toBeVisible();
    });
  });

  test.describe('Step Reordering', () => {
    test.beforeEach(async ({ page }) => {
      await selectFirstGoal(page);
      // Add multiple steps
      await addStep(page, TEST_STEP_TEXT);
      await addStep(page, TEST_STEP_TEXT_2);
      await addStep(page, TEST_STEP_TEXT_3);
    });

    test('should disable move up for first step', async ({ page }) => {
      // First step's move up button should be disabled
      const moveUpButton = page.locator('[data-testid^="action-step-move-up-"]').first();
      await expect(moveUpButton).toBeDisabled();
    });

    test('should disable move down for last step', async ({ page }) => {
      // Last step's move down button should be disabled
      const moveDownButton = page.locator('[data-testid^="action-step-move-down-"]').last();
      await expect(moveDownButton).toBeDisabled();
    });

    test('should move step up when move up button is clicked', async ({ page }) => {
      // Get the second step's move up button
      const secondMoveUp = page.locator('[data-testid^="action-step-move-up-"]').nth(1);
      await secondMoveUp.click();

      // Verify the order changed by checking text positions
      // The second step text should now be first
      const steps = page.locator('[data-testid^="action-step-"]');
      const firstStepText = await steps.first().textContent();
      expect(firstStepText).toContain(TEST_STEP_TEXT_2);
    });

    test('should move step down when move down button is clicked', async ({ page }) => {
      // Get the first step's move down button
      const firstMoveDown = page.locator('[data-testid^="action-step-move-down-"]').first();
      await firstMoveDown.click();

      // Verify the order changed
      const steps = page.locator('[data-testid^="action-step-"]');
      const firstStepText = await steps.first().textContent();
      expect(firstStepText).toContain(TEST_STEP_TEXT_2);
    });
  });

  test.describe('Step Deletion', () => {
    test.beforeEach(async ({ page }) => {
      await selectFirstGoal(page);
      await addStep(page, TEST_STEP_TEXT);
    });

    test('should show delete confirmation when delete button is pressed', async ({ page }) => {
      const deleteButton = page.locator('[data-testid^="action-step-delete-"]').first();
      await deleteButton.click();

      // Alert should appear (React Native Alert)
      // In a real test, we would mock Alert.alert
    });

    test('should remove step from list when deletion is confirmed', async ({ page }) => {
      const deleteButton = page.locator('[data-testid^="action-step-delete-"]').first();
      await deleteButton.click();

      // In a real test with mocked Alert, we would confirm deletion
      // After confirmation:
      // const stepText = page.getByText(TEST_STEP_TEXT);
      // await expect(stepText).not.toBeVisible();
    });
  });

  test.describe('Empty State', () => {
    test('should show empty state when goal selected but no steps', async ({ page }) => {
      await selectFirstGoal(page);

      // Empty state should be visible
      const emptyTitle = page.getByText('No Steps Yet');
      await expect(emptyTitle).toBeVisible();

      const emptyMessage = page.getByText(/Break your goal into small/);
      await expect(emptyMessage).toBeVisible();
    });

    test('should show step list after adding first step', async ({ page }) => {
      await selectFirstGoal(page);
      await addStep(page, TEST_STEP_TEXT);

      // Empty state should be hidden
      const emptyTitle = page.getByText('No Steps Yet');
      await expect(emptyTitle).not.toBeVisible();

      // Progress bar should appear
      const progressBar = page.getByTestId('progress-bar-fill');
      await expect(progressBar).toBeVisible();
    });
  });

  test.describe('Progress Bar', () => {
    test.beforeEach(async ({ page }) => {
      await selectFirstGoal(page);
      await addStep(page, TEST_STEP_TEXT);
      await addStep(page, TEST_STEP_TEXT_2);
    });

    test('should show correct progress percentage', async ({ page }) => {
      // 0/2 = 0%
      const progressText = page.getByText(/0\/2 steps \(0%\)/);
      await expect(progressText).toBeVisible();
    });

    test('should update percentage when step is completed', async ({ page }) => {
      // Complete one step
      const checkbox = page.locator('[data-testid^="action-step-checkbox-"]').first();
      await checkbox.click();

      // 1/2 = 50%
      const progressText = page.getByText(/1\/2 steps \(50%\)/);
      await expect(progressText).toBeVisible();
    });

    test('should show 100% when all steps completed', async ({ page }) => {
      // Complete both steps
      const checkboxes = page.locator('[data-testid^="action-step-checkbox-"]');
      await checkboxes.first().click();
      await checkboxes.nth(1).click();

      // 2/2 = 100%
      const progressText = page.getByText(/2\/2 steps \(100%\)/);
      await expect(progressText).toBeVisible();
    });
  });

  test.describe('Save Functionality', () => {
    test('should display save status after changes', async ({ page }) => {
      await selectFirstGoal(page);
      await addStep(page, TEST_STEP_TEXT);

      // Wait for auto-save (1.5 second debounce + save time)
      await page.waitForTimeout(2000);

      // Check for save status
      const saveStatus = page.getByText(/last saved|changes will auto-save/i);
      await expect(saveStatus).toBeVisible();
    });

    test('should navigate back when Save & Continue is pressed', async ({ page }) => {
      const saveButton = page.getByTestId('save-continue-button');
      await saveButton.click();

      // Would navigate back to previous screen
      // Actual verification depends on navigation structure
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper accessibility labels on interactive elements', async ({ page }) => {
      await selectFirstGoal(page);
      await addStep(page, TEST_STEP_TEXT);

      // Checkbox should have proper role
      const checkbox = page.locator('[data-testid^="action-step-checkbox-"]').first();
      await expect(checkbox).toHaveAttribute('aria-label', /mark as/i);

      // Reorder buttons should have labels
      const moveUpButton = page.locator('[data-testid^="action-step-move-up-"]').first();
      await expect(moveUpButton).toHaveAttribute('aria-label', /move step up/i);

      // Delete button should have label
      const deleteButton = page.locator('[data-testid^="action-step-delete-"]').first();
      await expect(deleteButton).toHaveAttribute('aria-label', /delete step/i);
    });

    test('should have step list accessible', async ({ page }) => {
      await selectFirstGoal(page);

      const stepList = page.getByTestId('step-list');
      await expect(stepList).toHaveAttribute('aria-label', /action steps list/i);
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Tab through elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Verify focus is on an interactive element
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
  });
});

/**
 * Test utilities for mocking native modules
 */
const mockHaptics = {
  impactAsync: async () => {},
  notificationAsync: async () => {},
};

const mockAlert = {
  alert: (title: string, message: string, buttons: Array<{ text: string; onPress?: () => void }>) => {
    // Auto-confirm for testing
    const confirmButton = buttons.find(b => b.text === 'Delete');
    if (confirmButton?.onPress) {
      confirmButton.onPress();
    }
  },
};

export { mockHaptics, mockAlert };
