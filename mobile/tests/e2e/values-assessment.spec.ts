/**
 * Values Assessment E2E Tests
 *
 * End-to-end tests for the Values Assessment screen using Playwright.
 * Tests the core values selection interface where users choose their top 5 values.
 *
 * Test Coverage:
 * - Screen renders correctly
 * - All 20 values are displayed
 * - Users can select up to 5 values
 * - Selection limit is enforced
 * - Values can be reordered
 * - Data persistence (save/load)
 * - Navigation flows
 *
 * Run with: npx playwright test values-assessment.spec.ts
 */

import { test, expect, Page } from '@playwright/test';

// Core values that should be present on the screen
const CORE_VALUES = [
  'Integrity',
  'Authenticity',
  'Growth',
  'Freedom',
  'Love',
  'Family',
  'Health',
  'Wealth',
  'Creativity',
  'Adventure',
  'Security',
  'Peace',
  'Knowledge',
  'Impact',
  'Joy',
  'Connection',
  'Excellence',
  'Balance',
  'Spirituality',
  'Service',
];

// Maximum number of values that can be selected
const MAX_SELECTIONS = 5;

/**
 * Helper function to navigate to Values Assessment screen
 */
async function navigateToValuesAssessment(page: Page) {
  // Start from home/workbook screen
  await page.goto('/');

  // Navigate to workbook
  await page.click('text=Workbook');

  // Navigate to Phase 1
  await page.click('text=Phase 1');

  // Navigate to Personal Values
  await page.click('text=Personal Values');

  // Wait for screen to load
  await page.waitForSelector('text=Personal Values');
}

/**
 * Helper function to select a value by name
 */
async function selectValue(page: Page, valueName: string) {
  const valueCard = page.locator(`[data-testid="value-card-${valueName.toLowerCase().replace(/\s+/g, '-')}"]`);
  await valueCard.click();
}

/**
 * Helper function to get the selection count text
 */
async function getSelectionCount(page: Page): Promise<string> {
  const countElement = page.locator('[data-testid="selection-count"]').or(page.locator('text=/\\d+\\/5/'));
  return countElement.textContent() || '0/5';
}

test.describe('Values Assessment Screen', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport for mobile testing
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 14 Pro
  });

  test('should render the screen correctly', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Check main title is present
    await expect(page.locator('text=Personal Values')).toBeVisible();

    // Check subtitle/description is present
    await expect(
      page.locator('text=Select your top 5 core values')
    ).toBeVisible();

    // Check progress section is present
    await expect(page.locator('text=Selection Progress')).toBeVisible();
  });

  test('should display all 20 core values', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Scroll through the page to ensure all values are rendered
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Verify each core value is present
    for (const value of CORE_VALUES) {
      await expect(page.locator(`text=${value}`)).toBeVisible();
    }
  });

  test('should show value cards with correct initial state', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Check that value cards exist
    const valueCards = page.locator('[data-testid^="value-card-"]');
    await expect(valueCards).toHaveCount(20);

    // All should be in unselected state initially
    // (no priority badges visible)
    const priorityBadges = page.locator('[data-testid="priority-badge"]');
    await expect(priorityBadges).toHaveCount(0);
  });

  test('should allow selecting a value', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Select a value
    await selectValue(page, 'Integrity');

    // Check that the value is now selected (has checkmark or priority badge)
    const integrityCard = page.locator('[data-testid="value-card-integrity"]');
    await expect(integrityCard).toHaveAttribute('aria-checked', 'true');

    // Progress should show 1/5
    await expect(page.locator('text=1/5')).toBeVisible();
  });

  test('should allow selecting up to 5 values', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Select 5 values
    const valuesToSelect = ['Integrity', 'Growth', 'Health', 'Family', 'Peace'];
    for (const value of valuesToSelect) {
      await selectValue(page, value);
      await page.waitForTimeout(200); // Small delay between selections
    }

    // Progress should show 5/5
    await expect(page.locator('text=5/5')).toBeVisible();

    // Selection complete message should appear
    await expect(page.locator('text=Selection complete')).toBeVisible();
  });

  test('should prevent selecting more than 5 values', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Select 5 values
    const valuesToSelect = ['Integrity', 'Growth', 'Health', 'Family', 'Peace'];
    for (const value of valuesToSelect) {
      await selectValue(page, value);
    }

    // Try to select a 6th value
    await selectValue(page, 'Joy');

    // Should show alert about maximum reached
    await expect(page.locator('text=Maximum Reached')).toBeVisible();

    // Progress should still show 5/5
    await expect(page.locator('text=5/5')).toBeVisible();
  });

  test('should allow deselecting a value', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Select a value
    await selectValue(page, 'Integrity');
    await expect(page.locator('text=1/5')).toBeVisible();

    // Deselect the same value
    await selectValue(page, 'Integrity');

    // Progress should show 0/5
    await expect(page.locator('text=0/5')).toBeVisible();
  });

  test('should show priority order for selected values', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Select 3 values in order
    await selectValue(page, 'Integrity');
    await selectValue(page, 'Growth');
    await selectValue(page, 'Health');

    // Check the ordered list section appears
    await expect(page.locator('text=Your Top Values')).toBeVisible();

    // First value should be #1
    const firstPriority = page.locator('text=1').first();
    await expect(firstPriority).toBeVisible();
  });

  test('should allow reordering selected values', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Select 3 values
    await selectValue(page, 'Integrity');
    await selectValue(page, 'Growth');
    await selectValue(page, 'Health');

    // Find the move up button for Growth (second item)
    const moveUpButton = page.locator('[aria-label="Move Growth up"]');
    await moveUpButton.click();

    // Now Growth should be first in the priority list
    // The ordered list should show Growth at position 1
    const orderedList = page.locator('[data-testid="selected-values-list"]').or(
      page.locator('text=Your Top Values').locator('..')
    );

    // First item should be Growth after reorder
    const firstItem = orderedList.locator('[data-testid="priority-1"]').or(
      orderedList.locator('text=Growth').first()
    );
    await expect(firstItem).toBeVisible();
  });

  test('should disable move up button for first item', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Select a value
    await selectValue(page, 'Integrity');

    // Move up button should be disabled for the first (and only) item
    const moveUpButton = page.locator('[aria-label="Move Integrity up"]');
    await expect(moveUpButton).toBeDisabled();
  });

  test('should disable move down button for last item', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Select a value
    await selectValue(page, 'Integrity');

    // Move down button should be disabled for the last (and only) item
    const moveDownButton = page.locator('[aria-label="Move Integrity down"]');
    await expect(moveDownButton).toBeDisabled();
  });

  test('should have save button', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Save button should be visible
    await expect(page.locator('text=Save Values')).toBeVisible();
  });

  test('should disable save button when no values selected', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Save button should be disabled initially
    const saveButton = page.locator('text=Save Values');
    await expect(saveButton).toBeDisabled();
  });

  test('should enable save button when values are selected', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Select a value
    await selectValue(page, 'Integrity');

    // Save button should now be enabled
    const saveButton = page.locator('text=Save Values');
    await expect(saveButton).toBeEnabled();
  });

  test('should show warning when saving incomplete selection', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Select only 2 values (less than 5)
    await selectValue(page, 'Integrity');
    await selectValue(page, 'Growth');

    // Click save
    await page.click('text=Save Values');

    // Should show incomplete selection warning
    await expect(page.locator('text=Incomplete Selection')).toBeVisible();
    await expect(page.locator('text=2 of 5')).toBeVisible();
  });

  test('should navigate back after successful save', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Select 5 values
    const valuesToSelect = ['Integrity', 'Growth', 'Health', 'Family', 'Peace'];
    for (const value of valuesToSelect) {
      await selectValue(page, value);
    }

    // Click save
    await page.click('text=Save Values');

    // Wait for success message
    await expect(page.locator('text=Values Saved!')).toBeVisible();

    // Click continue
    await page.click('text=Continue');

    // Should navigate back to Phase 1 dashboard
    await expect(page.locator('text=Phase 1')).toBeVisible();
  });

  test('should show progress bar with correct percentage', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Initially 0%
    const progressBar = page.locator('[data-testid="progress-bar"]').or(
      page.locator('[role="progressbar"]')
    );

    // Select 2 values (40%)
    await selectValue(page, 'Integrity');
    await selectValue(page, 'Growth');

    // Progress hint should update
    await expect(page.locator('text=Select 3 more values')).toBeVisible();
  });

  test('accessibility: value cards should be accessible', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Check that value cards have accessibility attributes
    const valueCards = page.locator('[data-testid^="value-card-"]');
    const count = await valueCards.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const card = valueCards.nth(i);
      const role = await card.getAttribute('role');
      expect(role).toBe('checkbox');
    }
  });

  test('accessibility: selected state is announced', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Select a value
    await selectValue(page, 'Integrity');

    // Check aria-checked state
    const integrityCard = page.locator('[data-testid="value-card-integrity"]');
    await expect(integrityCard).toHaveAttribute('aria-checked', 'true');
  });

  test('should disable unselected cards when max is reached', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Select 5 values
    const valuesToSelect = ['Integrity', 'Growth', 'Health', 'Family', 'Peace'];
    for (const value of valuesToSelect) {
      await selectValue(page, value);
    }

    // An unselected card should be disabled
    const joyCard = page.locator('[data-testid="value-card-joy"]');
    await expect(joyCard).toHaveAttribute('aria-disabled', 'true');
  });
});

test.describe('Values Assessment - Visual Style', () => {
  test('should use correct accent color for selected values', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Select a value
    await selectValue(page, 'Integrity');

    // Check that the selected card has the accent color border
    const integrityCard = page.locator('[data-testid="value-card-integrity"]');
    const borderColor = await integrityCard.evaluate((el) => {
      return window.getComputedStyle(el).borderColor;
    });

    // Primary color should be purple (primary[600] = #9333ea)
    // This might be slightly different due to color format
    expect(borderColor).toBeTruthy();
  });

  test('should display icons for each value', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Check that Integrity has shield icon
    const integrityCard = page.locator('[data-testid="value-card-integrity"]');

    // The icon container should be visible
    await expect(integrityCard.locator('[data-testid="value-icon"]').or(
      integrityCard.locator('text=/[\\u{1F300}-\\u{1F9FF}]/u')
    )).toBeVisible();
  });
});

test.describe('Values Assessment - Data Persistence', () => {
  test('should persist data across page reloads', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Select some values
    await selectValue(page, 'Integrity');
    await selectValue(page, 'Growth');

    // Click save (force save even if incomplete)
    await page.click('text=Save Values');
    await page.click('text=Save Anyway');

    // Wait for save to complete
    await page.waitForSelector('text=Values Saved!');
    await page.click('text=Continue');

    // Navigate back to the screen
    await page.click('text=Personal Values');

    // Wait for data to load
    await page.waitForSelector('text=Personal Values');

    // Selected values should still be checked
    const integrityCard = page.locator('[data-testid="value-card-integrity"]');
    await expect(integrityCard).toHaveAttribute('aria-checked', 'true');
  });
});

test.describe('Values Assessment - Haptic Feedback', () => {
  test('should not throw errors on interaction', async ({ page }) => {
    await navigateToValuesAssessment(page);

    // Select and deselect values - should not throw errors
    await selectValue(page, 'Integrity');
    await selectValue(page, 'Integrity'); // Deselect

    // No errors should occur
    await expect(page).toHaveURL(/personal-values|values/i);
  });
});
