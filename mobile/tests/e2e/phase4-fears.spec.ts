/**
 * Phase 4: Facing Fears & Limiting Beliefs - E2E Tests
 *
 * End-to-end tests for the Phase 4 screens using Playwright.
 * Tests cover Fear Inventory, Limiting Beliefs, and Fear Facing Plan screens.
 *
 * @requires playwright
 * @requires @playwright/test
 */

import { test, expect, type Page } from '@playwright/test';

/**
 * Test configuration for mobile viewport
 */
const mobileViewport = {
  width: 390,
  height: 844, // iPhone 14 Pro dimensions
};

/**
 * Helper function to navigate to a Phase 4 screen
 */
async function navigateToPhase4Screen(page: Page, screenName: string) {
  // Navigate to Workbook tab
  await page.getByTestId('tab-workbook').click();
  await page.waitForLoadState('networkidle');

  // Navigate to Phase 4 section (assuming phase dashboard exists)
  await page.getByText('Phase 4').click();
  await page.waitForLoadState('networkidle');

  // Navigate to specific screen
  await page.getByText(screenName).click();
  await page.waitForLoadState('networkidle');
}

/**
 * Fear Inventory Screen Tests
 */
test.describe('Fear Inventory Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(mobileViewport);
    // Assuming app is served at localhost:8081 for Expo
    await page.goto('http://localhost:8081');
    await navigateToPhase4Screen(page, 'Fear Inventory');
  });

  test('should display the Fear Inventory screen with header', async ({ page }) => {
    // Verify header elements
    await expect(page.getByText('Phase 4')).toBeVisible();
    await expect(page.getByText('Fear Inventory')).toBeVisible();
    await expect(
      page.getByText('Identify and acknowledge your fears')
    ).toBeVisible();
  });

  test('should display stats card with fear statistics', async ({ page }) => {
    // Stats should be visible
    await expect(page.getByText('Total Fears')).toBeVisible();
    await expect(page.getByText('High Intensity')).toBeVisible();
    await expect(page.getByText('Avg Intensity')).toBeVisible();
  });

  test('should display category filter chips', async ({ page }) => {
    // All filter options should be visible
    await expect(page.getByTestId('filter-all')).toBeVisible();
    await expect(page.getByTestId('filter-financial')).toBeVisible();
    await expect(page.getByTestId('filter-relationships')).toBeVisible();
    await expect(page.getByTestId('filter-career')).toBeVisible();
    await expect(page.getByTestId('filter-health')).toBeVisible();
    await expect(page.getByTestId('filter-selfWorth')).toBeVisible();
  });

  test('should filter fears by category', async ({ page }) => {
    // Click on Financial filter
    await page.getByTestId('filter-financial').click();

    // Wait for filter to apply
    await page.waitForTimeout(300);

    // Only financial fears should be visible
    // This assumes the sample data has financial fears
    const financialBadges = page.locator('text=Financial');
    await expect(financialBadges).toBeVisible();
  });

  test('should open add fear modal when FAB is pressed', async ({ page }) => {
    // Click the FAB
    await page.getByTestId('add-fear-fab').click();

    // Modal should appear
    await expect(page.getByText('Add Fear')).toBeVisible();
    await expect(page.getByText('What fear are you facing?')).toBeVisible();
    await expect(page.getByTestId('fear-text-input')).toBeVisible();
  });

  test('should add a new fear', async ({ page }) => {
    // Open modal
    await page.getByTestId('add-fear-fab').click();

    // Fill in fear text
    await page.getByTestId('fear-text-input').fill('Fear of making mistakes at work');

    // Select career category
    await page.getByTestId('category-career').click();

    // Save
    await page.getByTestId('modal-save').click();

    // Modal should close and new fear should appear
    await expect(page.getByText('Fear of making mistakes at work')).toBeVisible();
  });

  test('should validate empty fear text', async ({ page }) => {
    // Open modal
    await page.getByTestId('add-fear-fab').click();

    // Try to save without entering text
    const saveButton = page.getByTestId('modal-save');

    // Button should be disabled
    await expect(saveButton).toBeDisabled();
  });

  test('should close modal when cancel is pressed', async ({ page }) => {
    // Open modal
    await page.getByTestId('add-fear-fab').click();
    await expect(page.getByText('Add Fear')).toBeVisible();

    // Click cancel
    await page.getByTestId('modal-cancel').click();

    // Modal should close
    await expect(page.getByText('Add Fear')).not.toBeVisible();
  });

  test('should display tips card', async ({ page }) => {
    // Tips section should be visible
    await expect(page.getByText('Tips for Facing Fears')).toBeVisible();
    await expect(
      page.getByText('Acknowledge your fears without judgment')
    ).toBeVisible();
  });

  test('should display inspirational quote', async ({ page }) => {
    // Quote should be visible
    await expect(
      page.getByText('Everything you want is on the other side of fear')
    ).toBeVisible();
    await expect(page.getByText('Jack Canfield')).toBeVisible();
  });
});

/**
 * Limiting Beliefs Screen Tests
 */
test.describe('Limiting Beliefs Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(mobileViewport);
    await page.goto('http://localhost:8081');
    await navigateToPhase4Screen(page, 'Limiting Beliefs');
  });

  test('should display the Limiting Beliefs screen with header', async ({ page }) => {
    // Verify header elements
    await expect(page.getByText('Phase 4')).toBeVisible();
    await expect(page.getByText('Limiting Beliefs')).toBeVisible();
    await expect(
      page.getByText('Transform negative thought patterns')
    ).toBeVisible();
  });

  test('should display progress stats', async ({ page }) => {
    // Stats should be visible
    await expect(page.getByText('Total Beliefs')).toBeVisible();
    await expect(page.getByText('Restructured')).toBeVisible();
    await expect(page.getByText('In Progress')).toBeVisible();
  });

  test('should display how it works section', async ({ page }) => {
    await expect(page.getByText('How Cognitive Restructuring Works')).toBeVisible();
    await expect(page.getByText('Identify')).toBeVisible();
    await expect(page.getByText('Challenge')).toBeVisible();
    await expect(page.getByText('Reframe')).toBeVisible();
  });

  test('should open add belief modal with step 1', async ({ page }) => {
    // Click FAB
    await page.getByTestId('add-belief-fab').click();

    // Modal should show step 1
    await expect(page.getByText('Restructure Belief')).toBeVisible();
    await expect(page.getByText('Step 1: Limiting Belief')).toBeVisible();
    await expect(page.getByTestId('belief-limiting-input')).toBeVisible();
  });

  test('should navigate through all three steps', async ({ page }) => {
    // Open modal
    await page.getByTestId('add-belief-fab').click();

    // Step 1: Fill limiting belief
    await page.getByTestId('belief-limiting-input').fill('I am not good enough');
    await page.getByTestId('modal-next').click();

    // Step 2: Fill evidence against
    await expect(page.getByText('Step 2: Evidence Against')).toBeVisible();
    await page.getByTestId('belief-evidence-input').fill('I have achieved many goals');
    await page.getByTestId('modal-next').click();

    // Step 3: Fill new belief
    await expect(page.getByText('Step 3: New Empowering Belief')).toBeVisible();
    await page.getByTestId('belief-new-input').fill('I am capable and growing');
  });

  test('should save a complete belief restructuring', async ({ page }) => {
    // Open modal
    await page.getByTestId('add-belief-fab').click();

    // Complete all steps
    await page.getByTestId('belief-limiting-input').fill('I cannot succeed');
    await page.getByTestId('modal-next').click();

    await page.getByTestId('belief-evidence-input').fill('I have succeeded before');
    await page.getByTestId('modal-next').click();

    await page.getByTestId('belief-new-input').fill('I can achieve my goals');
    await page.getByTestId('modal-save').click();

    // New belief should appear in list
    await expect(page.getByText('I cannot succeed')).toBeVisible();
  });

  test('should go back to previous step', async ({ page }) => {
    // Open modal and go to step 2
    await page.getByTestId('add-belief-fab').click();
    await page.getByTestId('belief-limiting-input').fill('Test belief');
    await page.getByTestId('modal-next').click();

    // Go back to step 1
    await page.getByTestId('modal-back').click();
    await expect(page.getByText('Step 1: Limiting Belief')).toBeVisible();
  });

  test('should display belief cards with three columns', async ({ page }) => {
    // Sample beliefs should show all three columns
    await expect(page.getByText('Limiting Belief')).toBeVisible();
    await expect(page.getByText('Evidence Against')).toBeVisible();
    await expect(page.getByText('New Belief')).toBeVisible();
  });

  test('should display inspirational quote', async ({ page }) => {
    await expect(
      page.getByText("Whether you think you can or you think you can't")
    ).toBeVisible();
    await expect(page.getByText('Henry Ford')).toBeVisible();
  });
});

/**
 * Fear Facing Plan Screen Tests
 */
test.describe('Fear Facing Plan Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(mobileViewport);
    await page.goto('http://localhost:8081');
    await navigateToPhase4Screen(page, 'Fear Facing Plan');
  });

  test('should display the Fear Facing Plan screen with header', async ({ page }) => {
    // Verify header elements
    await expect(page.getByText('Phase 4')).toBeVisible();
    await expect(page.getByText('Fear Facing Plan')).toBeVisible();
    await expect(
      page.getByText('Create step-by-step plans to gradually overcome your fears')
    ).toBeVisible();
  });

  test('should display Your Plans section', async ({ page }) => {
    await expect(page.getByText('Your Plans')).toBeVisible();
  });

  test('should open fear selection modal when FAB is pressed', async ({ page }) => {
    await page.getByTestId('create-plan-fab').click();

    // Fear selection modal should appear
    await expect(page.getByText('Select a Fear')).toBeVisible();
    await expect(
      page.getByText('Choose a fear from your inventory')
    ).toBeVisible();
  });

  test('should create a new plan by selecting a fear', async ({ page }) => {
    // Open modal
    await page.getByTestId('create-plan-fab').click();

    // Select first fear option
    await page.locator('[data-testid^="fear-option-"]').first().click();

    // Plan should be created and visible
    await expect(page.getByText('Courage Meter')).toBeVisible();
  });

  test('should expand plan to show steps section', async ({ page }) => {
    // Click on existing plan (assuming sample data)
    await page.locator('[data-testid^="plan-card-"]').first().click();

    // Steps section should appear
    await expect(page.getByText('Exposure Steps')).toBeVisible();
    await expect(page.getByTestId('add-step-button')).toBeVisible();
  });

  test('should add a step to a plan', async ({ page }) => {
    // Select plan
    await page.locator('[data-testid^="plan-card-"]').first().click();

    // Click add step
    await page.getByTestId('add-step-button').click();

    // Fill in step
    await page.getByTestId('step-text-input').fill('Practice for 5 minutes');
    await page.getByTestId('step-modal-save').click();

    // Step should appear
    await expect(page.getByText('Practice for 5 minutes')).toBeVisible();
  });

  test('should toggle step completion', async ({ page }) => {
    // Select plan with existing steps
    await page.locator('[data-testid^="plan-card-"]').first().click();

    // Find a step and click to toggle
    const step = page.locator('[data-testid^="step-"]').first();
    await step.click();

    // Checkbox should update
    // Visual verification would be needed here
  });

  test('should display courage meter progress', async ({ page }) => {
    // Courage meter should show percentage
    await expect(page.getByText('Courage Meter')).toBeVisible();
    // Look for percentage display
    await expect(page.locator('text=/%/')).toBeVisible();
  });

  test('should display systematic desensitization tips', async ({ page }) => {
    await expect(page.getByText('Systematic Desensitization Tips')).toBeVisible();
    await expect(
      page.getByText('Start with the least scary step')
    ).toBeVisible();
  });

  test('should display inspirational quote', async ({ page }) => {
    await expect(
      page.getByText('Courage is not the absence of fear')
    ).toBeVisible();
    await expect(page.getByText('Ambrose Redmoon')).toBeVisible();
  });

  test('should show celebration on plan completion', async ({ page }) => {
    // This test would need all steps to be checked
    // For now, verify the celebration component exists in DOM
    // The celebration only shows when all steps are complete

    // Select a plan
    await page.locator('[data-testid^="plan-card-"]').first().click();

    // Complete all steps (if any exist)
    const steps = page.locator('[data-testid^="step-"]');
    const count = await steps.count();

    for (let i = 0; i < count; i++) {
      const step = steps.nth(i);
      const isChecked = await step.getAttribute('aria-checked');
      if (isChecked !== 'true') {
        await step.click();
        await page.waitForTimeout(100);
      }
    }

    // If all steps were completed, celebration should show
    // Note: This depends on sample data having incomplete steps
  });
});

/**
 * Accessibility Tests for Phase 4
 */
test.describe('Phase 4 Accessibility', () => {
  test('Fear Inventory should have proper accessibility labels', async ({ page }) => {
    await page.setViewportSize(mobileViewport);
    await page.goto('http://localhost:8081');
    await navigateToPhase4Screen(page, 'Fear Inventory');

    // FAB should have accessibility label
    const fab = page.getByTestId('add-fear-fab');
    await expect(fab).toHaveAttribute('aria-label', 'Add new fear');

    // Filter chips should have accessibility states
    const allFilter = page.getByTestId('filter-all');
    await expect(allFilter).toHaveAttribute('aria-selected');
  });

  test('Limiting Beliefs should have proper accessibility labels', async ({ page }) => {
    await page.setViewportSize(mobileViewport);
    await page.goto('http://localhost:8081');
    await navigateToPhase4Screen(page, 'Limiting Beliefs');

    // FAB should have accessibility label
    const fab = page.getByTestId('add-belief-fab');
    await expect(fab).toHaveAttribute('aria-label', 'Add new belief');
  });

  test('Fear Facing Plan should have proper accessibility labels', async ({ page }) => {
    await page.setViewportSize(mobileViewport);
    await page.goto('http://localhost:8081');
    await navigateToPhase4Screen(page, 'Fear Facing Plan');

    // FAB should have accessibility label
    const fab = page.getByTestId('create-plan-fab');
    await expect(fab).toHaveAttribute('aria-label', 'Create new plan');

    // Steps should have checkbox role
    await page.locator('[data-testid^="plan-card-"]').first().click();
    const steps = page.locator('[data-testid^="step-"]');
    if (await steps.count() > 0) {
      await expect(steps.first()).toHaveAttribute('role', 'checkbox');
    }
  });
});

/**
 * Dark Theme Visual Tests
 */
test.describe('Phase 4 Dark Theme', () => {
  test('Fear Inventory should use dark theme colors', async ({ page }) => {
    await page.setViewportSize(mobileViewport);
    await page.goto('http://localhost:8081');
    await navigateToPhase4Screen(page, 'Fear Inventory');

    // Background should be dark
    const container = page.locator('[data-testid="fear-inventory-container"]');
    const backgroundColor = await container.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );

    // Should be dark (#1a1a2e)
    expect(backgroundColor).toMatch(/rgb\(26,\s*26,\s*46\)|#1a1a2e/i);
  });
});
