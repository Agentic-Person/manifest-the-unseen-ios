/**
 * E2E Tests for Habits Audit Screen
 *
 * Tests the Current Habits Audit functionality including:
 * - Three time-of-day sections (Morning, Afternoon, Evening)
 * - Adding, editing, and removing habits
 * - Category selection (Positive, Negative, Neutral)
 * - Summary statistics and balance calculation
 * - Expand/collapse section behavior
 * - Save functionality
 *
 * @requires Playwright with Expo/React Native testing setup
 */

import { test, expect, Page } from '@playwright/test';

// Test configuration
const TEST_TIMEOUT = 30000;

// Test IDs and selectors
const SELECTORS = {
  // Sections
  morningSection: '[data-testid="morning-section"]',
  afternoonSection: '[data-testid="afternoon-section"]',
  eveningSection: '[data-testid="evening-section"]',

  // Summary
  summaryCard: '[data-testid="summary-card"]',
  positiveCount: '[data-testid="positive-count"]',
  negativeCount: '[data-testid="negative-count"]',
  neutralCount: '[data-testid="neutral-count"]',
  totalCount: '[data-testid="total-count"]',

  // Habit entries
  habitEntry: '[data-testid^="habit-entry-"]',
  habitInput: 'input[aria-label="Habit text input"]',
  categoryPositive: '[aria-label="Positive category"]',
  categoryNegative: '[aria-label="Negative category"]',
  categoryNeutral: '[aria-label="Neutral category"]',
  deleteButton: '[aria-label="Delete habit"]',

  // Buttons
  addMorningHabit: '[aria-label="Add morning habit"]',
  addAfternoonHabit: '[aria-label="Add afternoon habit"]',
  addEveningHabit: '[aria-label="Add evening habit"]',
  saveButton: '[aria-label="Save habits audit"]',
};

/**
 * Helper function to navigate to Habits Audit screen
 */
async function navigateToHabitsAudit(page: Page) {
  // Navigate to workbook
  await page.click('text=Workbook');
  await page.waitForSelector('text=Phase 1');

  // Navigate to Phase 1
  await page.click('text=Phase 1');
  await page.waitForSelector('text=Self-Evaluation');

  // Navigate to Habit Tracking
  await page.click('text=Habit Tracking');
  await page.waitForSelector('text=Current Habits Audit');
}

/**
 * Helper function to add a habit
 */
async function addHabit(
  page: Page,
  timeOfDay: 'morning' | 'afternoon' | 'evening',
  habitText: string,
  category: 'positive' | 'negative' | 'neutral' = 'neutral'
) {
  // Click add habit button
  const addButtonLabel = `Add ${timeOfDay} habit`;
  await page.click(`[aria-label="${addButtonLabel}"]`);

  // Wait for input to appear
  await page.waitForSelector(SELECTORS.habitInput);

  // Type habit text
  await page.fill(SELECTORS.habitInput, habitText);

  // Submit the text
  await page.press(SELECTORS.habitInput, 'Enter');

  // Select category
  const categoryButton = `[aria-label="${category.charAt(0).toUpperCase() + category.slice(1)} category"]`;
  await page.click(categoryButton);
}

// Test Suite
test.describe('Habits Audit Screen', () => {
  test.beforeEach(async ({ page }) => {
    // Start app and navigate to habits audit
    await page.goto('/');
    await navigateToHabitsAudit(page);
  });

  test.describe('Initial State', () => {
    test('should display all three time-of-day sections', async ({ page }) => {
      // Verify all sections are visible
      await expect(page.locator('text=Morning')).toBeVisible();
      await expect(page.locator('text=Afternoon')).toBeVisible();
      await expect(page.locator('text=Evening')).toBeVisible();
    });

    test('should display header and instructions', async ({ page }) => {
      await expect(page.locator('text=Current Habits Audit')).toBeVisible();
      await expect(page.locator('text=Review your daily routines')).toBeVisible();
    });

    test('should display summary card with zero counts', async ({ page }) => {
      await expect(page.locator('text=Habit Balance')).toBeVisible();
      await expect(page.locator('text=No habits yet')).toBeVisible();
    });

    test('should display tips card', async ({ page }) => {
      await expect(page.locator('text=Tips for Success')).toBeVisible();
    });

    test('should have save button disabled initially', async ({ page }) => {
      const saveButton = page.locator(SELECTORS.saveButton);
      await expect(saveButton).toBeDisabled();
    });
  });

  test.describe('Adding Habits', () => {
    test('should add a morning habit', async ({ page }) => {
      await addHabit(page, 'morning', 'Morning meditation', 'positive');

      // Verify habit is displayed
      await expect(page.locator('text=Morning meditation')).toBeVisible();

      // Verify count updated
      await expect(page.locator('text=1 habit').first()).toBeVisible();
    });

    test('should add habits to all sections', async ({ page }) => {
      await addHabit(page, 'morning', 'Wake up at 6am', 'positive');
      await addHabit(page, 'afternoon', 'Check social media', 'negative');
      await addHabit(page, 'evening', 'Read before bed', 'positive');

      // Verify all habits are displayed
      await expect(page.locator('text=Wake up at 6am')).toBeVisible();
      await expect(page.locator('text=Check social media')).toBeVisible();
      await expect(page.locator('text=Read before bed')).toBeVisible();
    });

    test('should update summary counts when adding habits', async ({ page }) => {
      await addHabit(page, 'morning', 'Exercise', 'positive');
      await addHabit(page, 'afternoon', 'Procrastinating', 'negative');
      await addHabit(page, 'evening', 'Walking', 'neutral');

      // Verify counts (these selectors may need adjustment based on actual implementation)
      await expect(page.locator('text=3').first()).toBeVisible(); // Total
    });
  });

  test.describe('Editing Habits', () => {
    test.beforeEach(async ({ page }) => {
      // Add a habit to edit
      await addHabit(page, 'morning', 'Original habit', 'neutral');
    });

    test('should edit habit text', async ({ page }) => {
      // Click on habit text to edit
      await page.click('text=Original habit');

      // Wait for input
      await page.waitForSelector(SELECTORS.habitInput);

      // Clear and type new text
      await page.fill(SELECTORS.habitInput, 'Updated habit');
      await page.press(SELECTORS.habitInput, 'Enter');

      // Verify updated text
      await expect(page.locator('text=Updated habit')).toBeVisible();
      await expect(page.locator('text=Original habit')).not.toBeVisible();
    });

    test('should change habit category', async ({ page }) => {
      // Initially neutral, change to positive
      await page.click(SELECTORS.categoryPositive);

      // Verify category changed (check aria state)
      const positiveButton = page.locator(SELECTORS.categoryPositive);
      await expect(positiveButton).toHaveAttribute('aria-checked', 'true');
    });
  });

  test.describe('Removing Habits', () => {
    test.beforeEach(async ({ page }) => {
      await addHabit(page, 'morning', 'Habit to remove', 'neutral');
    });

    test('should remove habit after confirmation', async ({ page }) => {
      // Click delete button
      await page.click(SELECTORS.deleteButton);

      // Confirm deletion
      await page.click('text=Delete');

      // Verify habit is removed
      await expect(page.locator('text=Habit to remove')).not.toBeVisible();
    });

    test('should cancel habit removal', async ({ page }) => {
      // Click delete button
      await page.click(SELECTORS.deleteButton);

      // Cancel deletion
      await page.click('text=Cancel');

      // Verify habit still exists
      await expect(page.locator('text=Habit to remove')).toBeVisible();
    });
  });

  test.describe('Section Collapse/Expand', () => {
    test('should collapse section when header is clicked', async ({ page }) => {
      // Add a habit first
      await addHabit(page, 'morning', 'Test habit', 'neutral');

      // Click section header to collapse
      await page.click('text=Morning');

      // Wait for animation
      await page.waitForTimeout(300);

      // Verify habit is hidden (section collapsed)
      // Note: The habit should not be visible when collapsed
      await expect(page.locator('[data-testid="morning-section"] >> text=Test habit')).not.toBeVisible();
    });

    test('should expand section when header is clicked again', async ({ page }) => {
      // Add a habit
      await addHabit(page, 'morning', 'Test habit', 'neutral');

      // Collapse
      await page.click('text=Morning');
      await page.waitForTimeout(300);

      // Expand
      await page.click('text=Morning');
      await page.waitForTimeout(300);

      // Verify habit is visible again
      await expect(page.locator('text=Test habit')).toBeVisible();
    });
  });

  test.describe('Summary Statistics', () => {
    test('should calculate correct balance with mixed habits', async ({ page }) => {
      // Add 2 positive, 1 negative, 1 neutral
      await addHabit(page, 'morning', 'Meditation', 'positive');
      await addHabit(page, 'morning', 'Exercise', 'positive');
      await addHabit(page, 'afternoon', 'Junk food', 'negative');
      await addHabit(page, 'evening', 'TV watching', 'neutral');

      // Verify balance shows positive status
      await expect(page.locator('text=Good progress')).toBeVisible();
    });

    test('should show warning status for mostly negative habits', async ({ page }) => {
      // Add more negative than positive
      await addHabit(page, 'morning', 'Bad habit 1', 'negative');
      await addHabit(page, 'afternoon', 'Bad habit 2', 'negative');
      await addHabit(page, 'evening', 'Good habit', 'positive');

      // Should show attention-needed status
      await expect(page.locator('text=Needs attention')).toBeVisible();
    });
  });

  test.describe('Save Functionality', () => {
    test('should enable save button after changes', async ({ page }) => {
      // Initially disabled
      const saveButton = page.locator(SELECTORS.saveButton);
      await expect(saveButton).toBeDisabled();

      // Add a habit
      await addHabit(page, 'morning', 'New habit', 'positive');

      // Save button should be enabled
      await expect(saveButton).toBeEnabled();
    });

    test('should show loading state while saving', async ({ page }) => {
      // Add a habit
      await addHabit(page, 'morning', 'New habit', 'positive');

      // Click save
      await page.click(SELECTORS.saveButton);

      // Should show loading state (either text change or spinner)
      await expect(page.locator('text=Saving...')).toBeVisible();
    });

    test('should show success message after saving', async ({ page }) => {
      // Add a habit
      await addHabit(page, 'morning', 'New habit', 'positive');

      // Save
      await page.click(SELECTORS.saveButton);

      // Wait for save to complete
      await page.waitForSelector('text=Saved!', { timeout: 5000 });

      // Confirm alert
      await page.click('text=OK');

      // Save button should be disabled again
      await expect(page.locator(SELECTORS.saveButton)).toBeDisabled();
    });

    test('should prevent saving with empty habits', async ({ page }) => {
      // Click add but don't fill in text
      await page.click('[aria-label="Add morning habit"]');

      // Try to save
      await page.click(SELECTORS.saveButton);

      // Should show validation error
      await expect(page.locator('text=Incomplete Habits')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels on sections', async ({ page }) => {
      const morningSection = page.locator('[aria-label*="Morning habits section"]');
      await expect(morningSection).toBeVisible();
    });

    test('should have proper ARIA states on category buttons', async ({ page }) => {
      await addHabit(page, 'morning', 'Test habit', 'positive');

      const positiveButton = page.locator(SELECTORS.categoryPositive);
      await expect(positiveButton).toHaveAttribute('role', 'radio');
      await expect(positiveButton).toHaveAttribute('aria-checked', 'true');
    });

    test('should have proper ARIA labels on add buttons', async ({ page }) => {
      const addMorningButton = page.locator('[aria-label="Add morning habit"]');
      await expect(addMorningButton).toBeVisible();
      await expect(addMorningButton).toHaveAttribute('role', 'button');
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle very long habit text', async ({ page }) => {
      const longText = 'This is a very long habit description that might need to be truncated or wrapped properly in the UI to avoid breaking the layout';
      await addHabit(page, 'morning', longText, 'neutral');

      // Verify habit is added (text should be truncated in display)
      await expect(page.locator(`text=${longText.substring(0, 30)}`)).toBeVisible();
    });

    test('should handle special characters in habit text', async ({ page }) => {
      await addHabit(page, 'morning', 'Habit with "quotes" & <symbols>', 'neutral');

      // Verify habit is displayed correctly
      await expect(page.locator('text=Habit with "quotes"')).toBeVisible();
    });

    test('should maintain state when switching between sections', async ({ page }) => {
      // Add habits to multiple sections
      await addHabit(page, 'morning', 'Morning habit', 'positive');
      await addHabit(page, 'evening', 'Evening habit', 'negative');

      // Collapse morning
      await page.click('text=Morning');
      await page.waitForTimeout(300);

      // Evening habit should still be visible
      await expect(page.locator('text=Evening habit')).toBeVisible();

      // Expand morning again
      await page.click('text=Morning');
      await page.waitForTimeout(300);

      // Morning habit should be visible again
      await expect(page.locator('text=Morning habit')).toBeVisible();
    });
  });
});
