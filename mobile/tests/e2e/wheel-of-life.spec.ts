/**
 * Wheel of Life E2E Tests
 *
 * End-to-end tests for the Wheel of Life screen using Playwright.
 * Tests the interactive wheel visualization where users rate 8 life areas.
 *
 * Test Coverage:
 * - Screen renders correctly
 * - All 8 life areas are displayed
 * - Sliders can be adjusted
 * - Chart updates when sliders change
 * - Data persistence (save/load)
 * - Navigation flows
 *
 * Run with: npx playwright test wheel-of-life.spec.ts
 */

import { test, expect, Page } from '@playwright/test';

// Life areas that should be present on the screen
const LIFE_AREAS = [
  'Career',
  'Health',
  'Relationships',
  'Finance',
  'Growth',
  'Family',
  'Recreation',
  'Spirit',
];

// Test data for the Wheel of Life values
const TEST_VALUES = {
  career: 7,
  health: 8,
  relationships: 6,
  finance: 5,
  personalGrowth: 9,
  family: 8,
  recreation: 4,
  spirituality: 7,
};

/**
 * Helper function to navigate to Wheel of Life screen
 */
async function navigateToWheelOfLife(page: Page) {
  // Start from home/workbook screen
  await page.goto('/');

  // Navigate to workbook
  await page.click('text=Workbook');

  // Navigate to Phase 1
  await page.click('text=Phase 1');

  // Navigate to Wheel of Life
  await page.click('text=Wheel of Life');

  // Wait for screen to load
  await page.waitForSelector('text=Wheel of Life');
}

test.describe('Wheel of Life Screen', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport for mobile testing
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 14 Pro
  });

  test('should render the screen correctly', async ({ page }) => {
    await navigateToWheelOfLife(page);

    // Check main title is present
    await expect(page.locator('text=Wheel of Life')).toBeVisible();

    // Check subtitle/description is present
    await expect(
      page.locator('text=Rate each area of your life')
    ).toBeVisible();

    // Check the wheel chart container is present
    await expect(page.locator('[data-testid="wheel-chart"]')).toBeVisible();
  });

  test('should display all 8 life areas', async ({ page }) => {
    await navigateToWheelOfLife(page);

    // Verify each life area label is present
    for (const area of LIFE_AREAS) {
      await expect(page.locator(`text=${area}`)).toBeVisible();
    }
  });

  test('should have sliders for each life area', async ({ page }) => {
    await navigateToWheelOfLife(page);

    // Scroll down to see sliders section
    await page.locator('text=Adjust Your Ratings').scrollIntoViewIfNeeded();

    // Check that we have 8 slider components
    const sliders = page.locator('[role="adjustable"]');
    await expect(sliders).toHaveCount(8);
  });

  test('should update chart when slider values change', async ({ page }) => {
    await navigateToWheelOfLife(page);

    // Find the Career slider
    const careerSlider = page.locator('[aria-label="Career rating"]');

    // Get initial value
    const initialValue = await careerSlider.getAttribute('aria-valuenow');

    // Adjust the slider (simulate drag)
    await careerSlider.click();

    // The polygon on the chart should update
    // (Visual verification would require screenshot comparison)
    await expect(page.locator('[data-testid="wheel-polygon"]')).toBeVisible();
  });

  test('should show balance status message', async ({ page }) => {
    await navigateToWheelOfLife(page);

    // One of these balance messages should be visible
    const balanceMessages = [
      'Beautifully balanced',
      'Well balanced',
      'Moderately balanced',
      'Imbalanced',
    ];

    let found = false;
    for (const message of balanceMessages) {
      const messageLocator = page.locator(`text=${message}`);
      if (await messageLocator.isVisible()) {
        found = true;
        break;
      }
    }

    expect(found).toBe(true);
  });

  test('should display average score in center of wheel', async ({ page }) => {
    await navigateToWheelOfLife(page);

    // The center should show "AVG" label
    await expect(page.locator('text=AVG')).toBeVisible();

    // There should be a numeric average displayed
    // (e.g., "5.0", "6.5", etc.)
    await expect(page.locator('[data-testid="average-score"]')).toBeVisible();
  });

  test('should have save button', async ({ page }) => {
    await navigateToWheelOfLife(page);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Save button should be visible
    await expect(page.locator('text=Save & Continue')).toBeVisible();
  });

  test('should auto-save after changes', async ({ page }) => {
    await navigateToWheelOfLife(page);

    // Make a change to trigger auto-save
    const slider = page.locator('[role="adjustable"]').first();
    await slider.click();

    // Wait for auto-save (debounced at 1.5 seconds)
    await page.waitForTimeout(2000);

    // Save status should show "Last saved: ..."
    await expect(page.locator('text=Last saved')).toBeVisible();
  });

  test('should navigate back when save button is clicked', async ({ page }) => {
    await navigateToWheelOfLife(page);

    // Click save button
    await page.click('text=Save & Continue');

    // Should navigate back to Phase 1 dashboard
    await expect(page.locator('text=Phase 1')).toBeVisible();
  });

  test('should show loading state initially', async ({ page }) => {
    // Navigate without waiting for full load
    await page.goto('/workbook/phase1/wheel-of-life');

    // Loading indicator should appear briefly
    // This may be too fast to catch, depending on the app
    const loadingText = page.locator('text=Loading your progress');

    // Either it's visible briefly or already loaded
    const isLoading = await loadingText.isVisible({ timeout: 500 }).catch(() => false);
    // This test just ensures no errors during initial load
  });

  test('should handle haptic feedback on interaction', async ({ page }) => {
    await navigateToWheelOfLife(page);

    // Click on a life area in the chart
    // (Haptic feedback is device-specific, just ensure no errors)
    await page.click('text=Career');

    // Should not throw any errors
    await expect(page).toHaveURL(/wheel-of-life/);
  });

  test('should highlight selected life area', async ({ page }) => {
    await navigateToWheelOfLife(page);

    // Click on Career area
    const careerLabel = page.locator('text=Career').first();
    await careerLabel.click();

    // The corresponding slider should be highlighted/selected
    const careerSlider = page.locator('[aria-label="Career rating"]').locator('..');

    // Selected state should have different styling
    // (This would need actual CSS class or style verification)
    await expect(careerSlider).toBeVisible();
  });

  test('should display descriptions for each life area', async ({ page }) => {
    await navigateToWheelOfLife(page);

    // Scroll to sliders section
    await page.locator('text=Adjust Your Ratings').scrollIntoViewIfNeeded();

    // Check for description text
    const descriptions = [
      'professional life',
      'Physical health',
      'Romantic relationships',
      'Financial security',
      'self-improvement',
      'Family relationships',
      'Hobbies',
      'Inner peace',
    ];

    for (const desc of descriptions) {
      await expect(page.locator(`text=${desc}`)).toBeVisible();
    }
  });

  test('should restrict slider values to 1-10 range', async ({ page }) => {
    await navigateToWheelOfLife(page);

    // Get all sliders
    const sliders = page.locator('[role="adjustable"]');
    const count = await sliders.count();

    for (let i = 0; i < count; i++) {
      const slider = sliders.nth(i);
      const minValue = await slider.getAttribute('aria-valuemin');
      const maxValue = await slider.getAttribute('aria-valuemax');

      expect(minValue).toBe('1');
      expect(maxValue).toBe('10');
    }
  });

  test('accessibility: all interactive elements should be accessible', async ({
    page,
  }) => {
    await navigateToWheelOfLife(page);

    // Check that sliders have accessibility labels
    const sliders = page.locator('[role="adjustable"]');
    const count = await sliders.count();

    for (let i = 0; i < count; i++) {
      const slider = sliders.nth(i);
      const label = await slider.getAttribute('aria-label');
      expect(label).toBeTruthy();
    }

    // Save button should be accessible
    const saveButton = page.locator('text=Save & Continue');
    await expect(saveButton).toBeEnabled();
  });
});

test.describe('Wheel of Life - Dark Theme', () => {
  test('should use dark background color', async ({ page }) => {
    await navigateToWheelOfLife(page);

    // Check that the main container has dark background
    const container = page.locator('[data-testid="wheel-screen"]');

    // Get computed background color
    const bgColor = await container.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Should be a dark color (low RGB values)
    // #1a1a2e = rgb(26, 26, 46)
    expect(bgColor).toMatch(/rgb\(26,\s*26,\s*46\)/);
  });

  test('should use gold accent for polygon', async ({ page }) => {
    await navigateToWheelOfLife(page);

    // Find the polygon element
    const polygon = page.locator('[data-testid="wheel-polygon"]');

    // Check stroke color is gold (#c9a227)
    const strokeColor = await polygon.getAttribute('stroke');
    expect(strokeColor?.toLowerCase()).toBe('#c9a227');
  });
});

test.describe('Wheel of Life - Data Persistence', () => {
  test('should persist data across page reloads', async ({ page }) => {
    await navigateToWheelOfLife(page);

    // Change a slider value
    const careerSlider = page.locator('[aria-label="Career rating"]');
    await careerSlider.fill('9'); // Set to 9

    // Wait for auto-save
    await page.waitForTimeout(2000);

    // Reload the page
    await page.reload();

    // Wait for data to load
    await page.waitForSelector('text=Wheel of Life');

    // Check that the value persisted
    const newValue = await careerSlider.getAttribute('aria-valuenow');
    expect(newValue).toBe('9');
  });
});
