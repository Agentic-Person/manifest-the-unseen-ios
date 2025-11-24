/**
 * Phase 5: Cultivating Self-Love & Self-Care E2E Tests
 *
 * Playwright tests for Phase 5 screens covering:
 * - Self-Love Affirmations screen
 * - Self-Care Routine screen
 * - Inner Child Healing screen
 */

import { test, expect, Page } from '@playwright/test';

// Test IDs used across Phase 5 screens
const TEST_IDS = {
  // Self-Love Affirmations
  affirmationsScreen: 'self-love-affirmations-screen',
  categoryAll: 'category-all',
  categoryFavorites: 'category-favorites',
  categorySelfWorth: 'category-self-worth',
  categoryBodyLove: 'category-body-love',
  categoryInnerPeace: 'category-inner-peace',
  categoryConfidence: 'category-confidence',
  categoryAbundance: 'category-abundance',
  prevAffirmation: 'prev-affirmation',
  nextAffirmation: 'next-affirmation',
  mirrorTimerButton: 'mirror-timer-button',
  stopTimerButton: 'stop-timer-button',
  addAffirmationButton: 'add-affirmation-button',
  newAffirmationInput: 'new-affirmation-input',
  confirmAddAffirmation: 'confirm-add-affirmation',

  // Self-Care Routine
  routineScreen: 'self-care-routine-screen',
  tabMorning: 'tab-morning',
  tabEvening: 'tab-evening',
  addActivityButton: 'add-activity-button',
  createCustomButton: 'create-custom-button',
  customNameInput: 'custom-name-input',
  customDurationInput: 'custom-duration-input',
  confirmCustomActivity: 'confirm-custom-activity',
  dailyCheckinButton: 'daily-checkin-button',

  // Inner Child
  innerChildScreen: 'inner-child-screen',
  newLetterButton: 'new-letter-button',
  promptsButton: 'prompts-button',
  timelineButton: 'timeline-button',
  letterTitleInput: 'letter-title-input',
  letterAgeInput: 'letter-age-input',
  letterContentInput: 'letter-content-input',
  saveLetterButton: 'save-letter-button',
  startWritingButton: 'start-writing-button',
};

/**
 * Helper: Navigate to a specific Phase 5 screen
 */
async function navigateToPhase5Screen(page: Page, screenName: 'affirmations' | 'routine' | 'innerchild') {
  // Navigate to Workbook tab
  await page.getByRole('tab', { name: /workbook/i }).click();

  // Navigate to Phase 5
  await page.getByText('Phase 5').click();

  // Select specific screen
  switch (screenName) {
    case 'affirmations':
      await page.getByText(/self-love affirmations/i).click();
      break;
    case 'routine':
      await page.getByText(/self-care routine/i).click();
      break;
    case 'innerchild':
      await page.getByText(/inner child/i).click();
      break;
  }
}

// =============================================================================
// Self-Love Affirmations Screen Tests
// =============================================================================

test.describe('Self-Love Affirmations Screen', () => {
  test.beforeEach(async ({ page }) => {
    // Assume app is running and user is authenticated
    await page.goto('/');
    await navigateToPhase5Screen(page, 'affirmations');
  });

  test('should display affirmations screen with all elements', async ({ page }) => {
    await expect(page.getByTestId(TEST_IDS.affirmationsScreen)).toBeVisible();
    await expect(page.getByText(/self-love affirmations/i)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.categoryAll)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.mirrorTimerButton)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.addAffirmationButton)).toBeVisible();
  });

  test('should filter affirmations by category', async ({ page }) => {
    // Test each category filter
    await page.getByTestId(TEST_IDS.categorySelfWorth).click();
    await expect(page.getByTestId(TEST_IDS.categorySelfWorth)).toHaveAttribute('aria-selected', 'true');

    await page.getByTestId(TEST_IDS.categoryBodyLove).click();
    await expect(page.getByTestId(TEST_IDS.categoryBodyLove)).toHaveAttribute('aria-selected', 'true');

    await page.getByTestId(TEST_IDS.categoryInnerPeace).click();
    await expect(page.getByTestId(TEST_IDS.categoryInnerPeace)).toHaveAttribute('aria-selected', 'true');

    // Return to all
    await page.getByTestId(TEST_IDS.categoryAll).click();
    await expect(page.getByTestId(TEST_IDS.categoryAll)).toHaveAttribute('aria-selected', 'true');
  });

  test('should navigate between affirmations', async ({ page }) => {
    // Navigate forward
    await page.getByTestId(TEST_IDS.nextAffirmation).click();
    await page.waitForTimeout(300); // Wait for animation

    // Navigate backward
    await page.getByTestId(TEST_IDS.prevAffirmation).click();
    await page.waitForTimeout(300);

    // Verify navigation controls are visible
    await expect(page.getByTestId(TEST_IDS.nextAffirmation)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.prevAffirmation)).toBeVisible();
  });

  test('should toggle affirmation as favorite', async ({ page }) => {
    // Find and click the favorite button on the current affirmation
    const favoriteButton = page.locator('[testID^="favorite-button-"]').first();
    await favoriteButton.click();

    // Navigate to favorites category
    await page.getByTestId(TEST_IDS.categoryFavorites).click();

    // Should have at least one favorite
    await expect(page.locator('[testID^="affirmation-card-"]')).toBeVisible();
  });

  test('should open and close mirror practice timer', async ({ page }) => {
    await page.getByTestId(TEST_IDS.mirrorTimerButton).click();

    // Timer modal should be visible
    await expect(page.getByText(/mirror practice/i)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.stopTimerButton)).toBeVisible();

    // Stop timer
    await page.getByTestId(TEST_IDS.stopTimerButton).click();

    // Modal should close
    await expect(page.getByTestId(TEST_IDS.stopTimerButton)).not.toBeVisible();
  });

  test('should add custom affirmation', async ({ page }) => {
    await page.getByTestId(TEST_IDS.addAffirmationButton).click();

    // Modal should appear
    await expect(page.getByText(/create your affirmation/i)).toBeVisible();

    // Fill in custom affirmation
    await page.getByTestId(TEST_IDS.newAffirmationInput).fill('I am grateful for my journey.');

    // Select category
    await page.getByTestId('select-category-self-worth').click();

    // Submit
    await page.getByTestId(TEST_IDS.confirmAddAffirmation).click();

    // Modal should close and affirmation should be added
    await expect(page.getByText(/create your affirmation/i)).not.toBeVisible();
  });

  test('should show empty state for favorites when none selected', async ({ page }) => {
    // Navigate to favorites without adding any
    await page.getByTestId(TEST_IDS.categoryFavorites).click();

    // Should show empty message
    await expect(page.getByText(/no favorites yet/i)).toBeVisible();
  });
});

// =============================================================================
// Self-Care Routine Screen Tests
// =============================================================================

test.describe('Self-Care Routine Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await navigateToPhase5Screen(page, 'routine');
  });

  test('should display routine screen with all elements', async ({ page }) => {
    await expect(page.getByTestId(TEST_IDS.routineScreen)).toBeVisible();
    await expect(page.getByText(/self-care routines/i)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.tabMorning)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.tabEvening)).toBeVisible();
    await expect(page.getByTestId('streak-counter')).toBeVisible();
  });

  test('should switch between morning and evening tabs', async ({ page }) => {
    // Start on morning tab
    await expect(page.getByTestId(TEST_IDS.tabMorning)).toHaveAttribute('aria-selected', 'true');

    // Switch to evening
    await page.getByTestId(TEST_IDS.tabEvening).click();
    await expect(page.getByTestId(TEST_IDS.tabEvening)).toHaveAttribute('aria-selected', 'true');

    // Switch back to morning
    await page.getByTestId(TEST_IDS.tabMorning).click();
    await expect(page.getByTestId(TEST_IDS.tabMorning)).toHaveAttribute('aria-selected', 'true');
  });

  test('should open add activity modal with presets', async ({ page }) => {
    await page.getByTestId(TEST_IDS.addActivityButton).click();

    // Modal should appear with presets
    await expect(page.getByText(/add activity/i)).toBeVisible();
    await expect(page.getByTestId('preset-meditation')).toBeVisible();
    await expect(page.getByTestId('preset-journaling')).toBeVisible();
    await expect(page.getByTestId('preset-exercise')).toBeVisible();
  });

  test('should add preset activity to routine', async ({ page }) => {
    await page.getByTestId(TEST_IDS.addActivityButton).click();

    // Select meditation preset
    await page.getByTestId('preset-meditation').click();

    // Activity should be added (modal closes)
    await expect(page.getByText(/add activity/i)).not.toBeVisible();

    // Activity should appear in list
    await expect(page.locator('[testID^="routine-item-"]')).toBeVisible();
  });

  test('should create custom activity', async ({ page }) => {
    await page.getByTestId(TEST_IDS.addActivityButton).click();
    await page.getByTestId(TEST_IDS.createCustomButton).click();

    // Custom modal should appear
    await expect(page.getByText(/custom activity/i)).toBeVisible();

    // Fill in custom activity
    await page.getByTestId(TEST_IDS.customNameInput).fill('Yoga Practice');
    await page.getByTestId(TEST_IDS.customDurationInput).fill('30');

    // Submit
    await page.getByTestId(TEST_IDS.confirmCustomActivity).click();

    // Should be added to list
    await expect(page.getByText(/yoga practice/i)).toBeVisible();
  });

  test('should toggle activity completion', async ({ page }) => {
    // First add an activity
    await page.getByTestId(TEST_IDS.addActivityButton).click();
    await page.getByTestId('preset-meditation').click();

    // Toggle completion
    const checkbox = page.locator('[testID^="routine-checkbox-"]').first();
    await checkbox.click();

    // Should show completion state
    await expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  test('should reorder activities with up/down buttons', async ({ page }) => {
    // Add two activities
    await page.getByTestId(TEST_IDS.addActivityButton).click();
    await page.getByTestId('preset-meditation').click();

    await page.getByTestId(TEST_IDS.addActivityButton).click();
    await page.getByTestId('preset-journaling').click();

    // Find move buttons on second item
    const moveUpButton = page.locator('[testID^="routine-move-up-"]').last();
    await moveUpButton.click();

    // Order should have changed (journaling now first)
    const firstItem = page.locator('[testID^="routine-item-"]').first();
    await expect(firstItem).toContainText(/journal/i);
  });

  test('should delete activity', async ({ page }) => {
    // Add an activity
    await page.getByTestId(TEST_IDS.addActivityButton).click();
    await page.getByTestId('preset-meditation').click();

    // Count activities
    const initialCount = await page.locator('[testID^="routine-item-"]').count();

    // Delete activity
    const deleteButton = page.locator('[testID^="routine-delete-"]').first();
    await deleteButton.click();

    // Confirm deletion
    await page.getByRole('button', { name: /remove/i }).click();

    // Activity should be removed
    const newCount = await page.locator('[testID^="routine-item-"]').count();
    expect(newCount).toBeLessThan(initialCount);
  });

  test('should show daily check-in button when activities complete', async ({ page }) => {
    // Add and complete an activity
    await page.getByTestId(TEST_IDS.addActivityButton).click();
    await page.getByTestId('preset-meditation').click();

    // Complete the activity
    const checkbox = page.locator('[testID^="routine-checkbox-"]').first();
    await checkbox.click();

    // Check-in button should show ready state
    await expect(page.getByTestId(TEST_IDS.dailyCheckinButton)).toContainText(/complete check-in/i);
  });
});

// =============================================================================
// Inner Child Healing Screen Tests
// =============================================================================

test.describe('Inner Child Healing Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await navigateToPhase5Screen(page, 'innerchild');
  });

  test('should display inner child screen with welcome state', async ({ page }) => {
    await expect(page.getByTestId(TEST_IDS.innerChildScreen)).toBeVisible();
    await expect(page.getByText(/inner child healing/i)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.newLetterButton)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.promptsButton)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.timelineButton)).toBeVisible();
  });

  test('should start new letter from button', async ({ page }) => {
    await page.getByTestId(TEST_IDS.newLetterButton).click();

    // Editor should appear
    await expect(page.getByTestId(TEST_IDS.letterTitleInput)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.letterContentInput)).toBeVisible();
  });

  test('should start writing from welcome screen', async ({ page }) => {
    // If no letters exist, welcome screen shows
    const startButton = page.getByTestId(TEST_IDS.startWritingButton);
    if (await startButton.isVisible()) {
      await startButton.click();
      await expect(page.getByTestId(TEST_IDS.letterContentInput)).toBeVisible();
    }
  });

  test('should open guided prompts modal', async ({ page }) => {
    await page.getByTestId(TEST_IDS.promptsButton).click();

    // Prompts modal should appear
    await expect(page.getByText(/guided prompts/i)).toBeVisible();
    await expect(page.getByTestId('prompt-comfort')).toBeVisible();
    await expect(page.getByTestId('prompt-validation')).toBeVisible();
    await expect(page.getByTestId('prompt-apology')).toBeVisible();
  });

  test('should select prompt and start writing', async ({ page }) => {
    await page.getByTestId(TEST_IDS.promptsButton).click();
    await page.getByTestId('prompt-comfort').click();

    // Editor should appear with prompt card
    await expect(page.getByTestId(TEST_IDS.letterContentInput)).toBeVisible();
    await expect(page.getByText(/comfort & safety/i)).toBeVisible();
  });

  test('should write and save letter', async ({ page }) => {
    await page.getByTestId(TEST_IDS.newLetterButton).click();

    // Fill in letter details
    await page.getByTestId(TEST_IDS.letterTitleInput).fill('Letter to Little Me');
    await page.getByTestId(TEST_IDS.letterAgeInput).fill('7');
    await page.getByTestId(TEST_IDS.letterContentInput).fill(
      'I want you to know that everything is going to be okay. You are so brave and strong.'
    );

    // Save letter
    await page.getByTestId(TEST_IDS.saveLetterButton).click();

    // Should show save confirmation
    await expect(page.getByText(/saved/i)).toBeVisible();
  });

  test('should open timeline modal with past letters', async ({ page }) => {
    // First create a letter
    await page.getByTestId(TEST_IDS.newLetterButton).click();
    await page.getByTestId(TEST_IDS.letterTitleInput).fill('Test Letter');
    await page.getByTestId(TEST_IDS.letterContentInput).fill('Test content');
    await page.getByTestId(TEST_IDS.saveLetterButton).click();

    // Open timeline
    await page.getByTestId(TEST_IDS.timelineButton).click();

    // Timeline should show the letter
    await expect(page.getByText(/your letters/i)).toBeVisible();
    await expect(page.getByText(/test letter/i)).toBeVisible();
  });

  test('should view letter from timeline', async ({ page }) => {
    // Create a letter first
    await page.getByTestId(TEST_IDS.newLetterButton).click();
    await page.getByTestId(TEST_IDS.letterTitleInput).fill('View Test Letter');
    await page.getByTestId(TEST_IDS.letterContentInput).fill('Content to view');
    await page.getByTestId(TEST_IDS.saveLetterButton).click();

    // Open timeline and select letter
    await page.getByTestId(TEST_IDS.timelineButton).click();
    await page.getByText(/view test letter/i).click();

    // Letter should load in editor
    await expect(page.getByTestId(TEST_IDS.letterTitleInput)).toHaveValue('View Test Letter');
  });

  test('should delete letter from timeline', async ({ page }) => {
    // Create a letter first
    await page.getByTestId(TEST_IDS.newLetterButton).click();
    await page.getByTestId(TEST_IDS.letterTitleInput).fill('Delete Test Letter');
    await page.getByTestId(TEST_IDS.letterContentInput).fill('Content to delete');
    await page.getByTestId(TEST_IDS.saveLetterButton).click();

    // Open timeline
    await page.getByTestId(TEST_IDS.timelineButton).click();

    // Delete letter
    const deleteButton = page.locator('[testID^="delete-letter-"]').first();
    await deleteButton.click();

    // Confirm deletion
    await page.getByRole('button', { name: /delete/i }).click();

    // Letter should be removed from timeline
    await expect(page.getByText(/delete test letter/i)).not.toBeVisible();
  });

  test('should show age addressed in letter', async ({ page }) => {
    await page.getByTestId(TEST_IDS.newLetterButton).click();

    // Enter age
    await page.getByTestId(TEST_IDS.letterAgeInput).fill('5');

    // Should display age context
    await expect(page.getByText(/year old self/i)).toBeVisible();
  });

  test('should auto-save letter content', async ({ page }) => {
    await page.getByTestId(TEST_IDS.newLetterButton).click();

    // Start typing
    await page.getByTestId(TEST_IDS.letterContentInput).fill('Auto-save test content');

    // Wait for auto-save (2 seconds debounce)
    await page.waitForTimeout(2500);

    // Should show saved status
    await expect(page.getByText(/saved/i)).toBeVisible();
  });
});

// =============================================================================
// Accessibility Tests
// =============================================================================

test.describe('Phase 5 Accessibility', () => {
  test('affirmations screen should have proper accessibility labels', async ({ page }) => {
    await page.goto('/');
    await navigateToPhase5Screen(page, 'affirmations');

    // Check screen accessibility
    await expect(page.getByTestId(TEST_IDS.affirmationsScreen)).toHaveAttribute(
      'aria-label',
      expect.stringContaining('Affirmation')
    );

    // Category filters should have proper roles
    await expect(page.getByTestId(TEST_IDS.categoryAll)).toHaveAttribute('role', 'button');
  });

  test('routine screen should have proper accessibility labels', async ({ page }) => {
    await page.goto('/');
    await navigateToPhase5Screen(page, 'routine');

    // Tab buttons should have proper roles
    await expect(page.getByTestId(TEST_IDS.tabMorning)).toHaveAttribute('role', 'tab');
    await expect(page.getByTestId(TEST_IDS.tabEvening)).toHaveAttribute('role', 'tab');
  });

  test('inner child screen should have proper accessibility labels', async ({ page }) => {
    await page.goto('/');
    await navigateToPhase5Screen(page, 'innerchild');

    // Buttons should have accessibility labels
    await expect(page.getByTestId(TEST_IDS.newLetterButton)).toHaveAttribute(
      'aria-label',
      expect.stringContaining('letter')
    );
  });
});

// =============================================================================
// Performance Tests
// =============================================================================

test.describe('Phase 5 Performance', () => {
  test('affirmations screen should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await navigateToPhase5Screen(page, 'affirmations');

    await page.getByTestId(TEST_IDS.affirmationsScreen).waitFor({ state: 'visible' });

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
  });

  test('routine screen should handle many activities efficiently', async ({ page }) => {
    await page.goto('/');
    await navigateToPhase5Screen(page, 'routine');

    // Add multiple activities
    for (let i = 0; i < 5; i++) {
      await page.getByTestId(TEST_IDS.addActivityButton).click();
      await page.getByTestId('preset-meditation').click();
      await page.waitForTimeout(100);
    }

    // Screen should remain responsive
    const startTime = Date.now();
    await page.getByTestId(TEST_IDS.tabEvening).click();
    const responseTime = Date.now() - startTime;

    expect(responseTime).toBeLessThan(500); // Tab switch should be fast
  });
});
