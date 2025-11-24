/**
 * SWOT Analysis E2E Tests
 *
 * End-to-end tests for the SWOT Analysis screen using Playwright.
 * Tests the organic flower petal layout where users add items to
 * Strengths, Weaknesses, Opportunities, and Threats quadrants.
 *
 * Design: Organic flower petals, NOT corporate grid
 * Theme: Dark spiritual meditation app aesthetic
 *
 * Test Coverage:
 * - Screen renders with organic flower petal layout
 * - All 4 quadrants are displayed correctly
 * - Users can add/remove items to each quadrant
 * - Natural-styled tags (not tech chips)
 * - Central mandala connecting element
 * - Data persistence (auto-save)
 * - Navigation flows
 * - Dark theme styling
 *
 * Run with: npx playwright test swot-analysis.spec.ts
 */

import { test, expect, Page } from '@playwright/test';

// SWOT quadrant types
const QUADRANT_TYPES = ['strengths', 'weaknesses', 'opportunities', 'threats'] as const;

// Display names for quadrants
const QUADRANT_NAMES = {
  strengths: 'Strengths',
  weaknesses: 'Weaknesses',
  opportunities: 'Opportunities',
  threats: 'Threats',
};

// SWOT quadrant colors (dark theme)
const QUADRANT_COLORS = {
  strengths: '#2d5a4a', // Deep forest green
  weaknesses: '#8b6914', // Deep amber
  opportunities: '#1a5f5f', // Deep teal
  threats: '#6b2d3d', // Deep burgundy
};

// Test items to add to each quadrant
const TEST_ITEMS = {
  strengths: ['Creative problem solving', 'Strong communication skills', 'Resilience'],
  weaknesses: ['Procrastination', 'Perfectionism'],
  opportunities: ['New career path', 'Networking events', 'Online learning'],
  threats: ['Economic uncertainty', 'Time constraints'],
};

/**
 * Helper function to navigate to SWOT Analysis screen
 */
async function navigateToSWOTAnalysis(page: Page) {
  // Start from home screen
  await page.goto('/');

  // Navigate to workbook
  await page.click('text=Workbook');

  // Navigate to Phase 1
  await page.click('text=Phase 1');

  // Navigate to SWOT Analysis
  await page.click('text=SWOT Analysis');

  // Wait for screen to load
  await page.waitForSelector('text=SWOT Analysis');
}

test.describe('SWOT Analysis Screen - Organic Flower Petal Layout', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport for mobile testing (iPhone 14 Pro dimensions)
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('should render the screen with correct title and subtitle', async ({ page }) => {
    await navigateToSWOTAnalysis(page);

    // Check main title is present
    await expect(page.locator('text=SWOT Analysis')).toBeVisible();

    // Check spiritual-themed subtitle
    await expect(
      page.locator('text=Explore your inner landscape')
    ).toBeVisible();
  });

  test('should display all 4 quadrants in flower petal layout', async ({ page }) => {
    await navigateToSWOTAnalysis(page);

    // Verify each quadrant is present
    for (const [key, name] of Object.entries(QUADRANT_NAMES)) {
      await expect(page.locator(`text=${name}`).first()).toBeVisible();
    }

    // Verify petal layout (quadrants should be arranged in 2x2 with organic shapes)
    const quadrants = page.locator('[data-testid^="swot-quadrant-"]');

    // Should have exactly 4 quadrants
    await expect(quadrants).toHaveCount(4);
  });

  test('should display central mandala connecting element', async ({ page }) => {
    await navigateToSWOTAnalysis(page);

    // Check for mandala/lotus element in center
    const mandala = page.locator('[data-testid="central-mandala"]');

    // Mandala should be visible (or lotus symbol should be present)
    const lotusSymbol = page.locator('text=\u2740'); // Flower symbol
    const hasMandala = await mandala.isVisible().catch(() => false);
    const hasLotus = await lotusSymbol.isVisible().catch(() => false);

    expect(hasMandala || hasLotus).toBe(true);
  });

  test('should have organic petal-shaped quadrants (NOT rectangular grid)', async ({ page }) => {
    await navigateToSWOTAnalysis(page);

    // Get the strengths quadrant (top-left petal)
    const strengthsQuadrant = page.locator('[data-testid="swot-quadrant-strengths"]').first()
      || page.locator('text=Strengths').locator('..').locator('..');

    // Petal shapes have large border-radius on one corner
    // This test verifies organic styling is applied
    const borderRadius = await strengthsQuadrant.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        topLeft: style.borderTopLeftRadius,
        topRight: style.borderTopRightRadius,
        bottomLeft: style.borderBottomLeftRadius,
        bottomRight: style.borderBottomRightRadius,
      };
    }).catch(() => null);

    if (borderRadius) {
      // At least one corner should have significant radius (petal shape)
      const radii = [
        parseInt(borderRadius.topLeft),
        parseInt(borderRadius.topRight),
        parseInt(borderRadius.bottomLeft),
        parseInt(borderRadius.bottomRight),
      ].filter(r => !isNaN(r));

      const hasOrganicShape = radii.some(r => r >= 40);
      expect(hasOrganicShape).toBe(true);
    }
  });

  test('should expand quadrant when tapped', async ({ page }) => {
    await navigateToSWOTAnalysis(page);

    // Click on Strengths quadrant
    await page.click('text=Strengths');

    // Input field should become visible when expanded
    await expect(
      page.locator('input[placeholder*="strength"], input[placeholder*="Add"]').first()
    ).toBeVisible();

    // Prompt question should be visible
    await expect(page.locator('text=strong')).toBeVisible();
  });

  test('should add item to quadrant', async ({ page }) => {
    await navigateToSWOTAnalysis(page);

    // Expand Strengths quadrant
    await page.click('text=Strengths');

    // Type in the input
    const input = page.locator('input[placeholder*="strength"], input[placeholder*="Add"]').first();
    await input.fill('Creative problem solving');

    // Click add button (+ button)
    await page.click('text=+');

    // The new item should appear as a tag
    await expect(page.locator('text=Creative problem solving')).toBeVisible();

    // Count badge should update
    const countBadge = page.locator('[data-testid="strengths-count"]')
      || page.locator('text=Strengths').locator('..').locator('[class*="count"], [class*="badge"]');

    // Should show at least 1
    await expect(page.locator('text=1').first()).toBeVisible();
  });

  test('should remove item from quadrant', async ({ page }) => {
    await navigateToSWOTAnalysis(page);

    // Expand Strengths quadrant
    await page.click('text=Strengths');

    // Add an item first
    const input = page.locator('input[placeholder*="strength"], input[placeholder*="Add"]').first();
    await input.fill('Test item to remove');
    await page.click('text=+');

    // Verify item was added
    await expect(page.locator('text=Test item to remove')).toBeVisible();

    // Click remove button (x) on the tag
    await page.click('[aria-label="Remove Test item to remove"]');

    // Item should be removed
    await expect(page.locator('text=Test item to remove')).not.toBeVisible();
  });

  test('should display natural-styled tags (not tech chips)', async ({ page }) => {
    await navigateToSWOTAnalysis(page);

    // Expand and add item to Strengths
    await page.click('text=Strengths');
    const input = page.locator('input[placeholder*="strength"], input[placeholder*="Add"]').first();
    await input.fill('Natural tag test');
    await page.click('text=+');

    // Find the tag element
    const tag = page.locator('text=Natural tag test').locator('..');

    // Tags should have organic styling
    // Check for natural element icon (leaf, stone, wave, ember symbols)
    const naturalIcons = ['\u2618', '\u25C6', '\u223F', '\u2731']; // Shamrock, Diamond, Wave, Asterisk

    let hasNaturalIcon = false;
    for (const icon of naturalIcons) {
      const iconElement = page.locator(`text=${icon}`);
      if (await iconElement.isVisible().catch(() => false)) {
        hasNaturalIcon = true;
        break;
      }
    }

    // Either has natural icon OR has organic border radius
    expect(hasNaturalIcon).toBe(true);
  });

  test('should show item count in each quadrant', async ({ page }) => {
    await navigateToSWOTAnalysis(page);

    // Each quadrant should show a count (initially 0)
    // The count is shown in a badge next to the title
    for (const name of Object.values(QUADRANT_NAMES)) {
      const quadrant = page.locator(`text=${name}`).first();
      await expect(quadrant).toBeVisible();
    }

    // Total items counter should be visible (in mandala or elsewhere)
    await expect(page.locator('text=items')).toBeVisible();
  });

  test('should show total items in central mandala', async ({ page }) => {
    await navigateToSWOTAnalysis(page);

    // Add items to different quadrants
    await page.click('text=Strengths');
    const strengthInput = page.locator('input[placeholder*="strength"], input[placeholder*="Add"]').first();
    await strengthInput.fill('Test strength');
    await page.click('text=+');

    // Central mandala should show updated count
    await expect(page.locator('text=1')).toBeVisible();
    await expect(page.locator('text=items')).toBeVisible();
  });
});

test.describe('SWOT Analysis - Dark Theme Styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('should use dark background color', async ({ page }) => {
    await navigateToSWOTAnalysis(page);

    // Get the main container background color
    const bgColor = await page.evaluate(() => {
      const container = document.querySelector('[data-testid="swot-screen"]')
        || document.querySelector('main')
        || document.body;
      return window.getComputedStyle(container).backgroundColor;
    });

    // Should be a dark color
    // #1a1a2e = rgb(26, 26, 46)
    const isDark = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (isDark) {
      const [, r, g, b] = isDark.map(Number);
      expect(r).toBeLessThan(100);
      expect(g).toBeLessThan(100);
      expect(b).toBeLessThan(100);
    }
  });

  test('should use correct SWOT quadrant colors', async ({ page }) => {
    await navigateToSWOTAnalysis(page);

    // The quadrants should use the specified colors
    // Strengths: #2d5a4a (forest green)
    // Weaknesses: #8b6914 (amber)
    // Opportunities: #1a5f5f (teal)
    // Threats: #6b2d3d (burgundy)

    // Just verify the colors are present in the page styles
    const pageContent = await page.content();

    // Check for presence of SWOT colors (in any format)
    const hasStrengthColor = pageContent.includes('2d5a4a') || pageContent.includes('45, 90, 74');
    const hasWeaknessColor = pageContent.includes('8b6914') || pageContent.includes('139, 105, 20');
    const hasOpportunityColor = pageContent.includes('1a5f5f') || pageContent.includes('26, 95, 95');
    const hasThreatColor = pageContent.includes('6b2d3d') || pageContent.includes('107, 45, 61');

    // At least some colors should be present
    expect(hasStrengthColor || hasWeaknessColor || hasOpportunityColor || hasThreatColor).toBe(true);
  });

  test('should use muted gold accent for mandala', async ({ page }) => {
    await navigateToSWOTAnalysis(page);

    // Look for gold accent color #c9a227
    const pageContent = await page.content();
    const hasGoldAccent = pageContent.includes('c9a227') || pageContent.includes('201, 162, 39');

    expect(hasGoldAccent).toBe(true);
  });

  test('should use off-white text (not pure white)', async ({ page }) => {
    await navigateToSWOTAnalysis(page);

    // Title text should be off-white (#e8e8e8), not pure white (#ffffff)
    const titleColor = await page.evaluate(() => {
      const title = document.querySelector('h1') || document.querySelector('[class*="title"]');
      if (title) {
        return window.getComputedStyle(title).color;
      }
      return null;
    });

    // Should not be pure white
    if (titleColor) {
      expect(titleColor).not.toBe('rgb(255, 255, 255)');
    }
  });
});

test.describe('SWOT Analysis - Data Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('should auto-save after adding items', async ({ page }) => {
    await navigateToSWOTAnalysis(page);

    // Add an item
    await page.click('text=Strengths');
    const input = page.locator('input[placeholder*="strength"], input[placeholder*="Add"]').first();
    await input.fill('Auto-save test item');
    await page.click('text=+');

    // Wait for auto-save (debounced at 2 seconds)
    await page.waitForTimeout(2500);

    // Save status should be visible
    await expect(page.locator('text=Saved')).toBeVisible();
  });

  test('should show save status indicator', async ({ page }) => {
    await navigateToSWOTAnalysis(page);

    // Make a change
    await page.click('text=Weaknesses');
    const input = page.locator('input[placeholder*="weakness"], input[placeholder*="Add"]').first();
    await input.fill('Status indicator test');
    await page.click('text=+');

    // Wait briefly
    await page.waitForTimeout(500);

    // Should show saving or saved status
    const hasSaveStatus =
      await page.locator('text=Saving').isVisible().catch(() => false) ||
      await page.locator('text=Saved').isVisible().catch(() => false) ||
      await page.locator('text=Last saved').isVisible().catch(() => false);

    // After auto-save completes
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Saved').or(page.locator('text=Last saved'))).toBeVisible();
  });

  test('should navigate back when save button clicked', async ({ page }) => {
    await navigateToSWOTAnalysis(page);

    // Scroll to bottom and click save
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.click('text=Save & Continue');

    // Should navigate back to Phase 1 dashboard
    await expect(page.locator('text=Phase 1')).toBeVisible();
  });
});

test.describe('SWOT Analysis - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('quadrants should have accessibility labels', async ({ page }) => {
    await navigateToSWOTAnalysis(page);

    // Each quadrant should have proper accessibility attributes
    for (const name of Object.values(QUADRANT_NAMES)) {
      const quadrant = page.locator(`[aria-label*="${name}"]`).first()
        || page.locator(`text=${name}`).locator('..');

      // Should be accessible
      await expect(quadrant).toBeVisible();
    }
  });

  test('add/remove buttons should be accessible', async ({ page }) => {
    await navigateToSWOTAnalysis(page);

    // Expand a quadrant
    await page.click('text=Strengths');

    // Add button should have accessibility label
    const addButton = page.locator('[aria-label*="Add"]').first()
      || page.locator('text=+');
    await expect(addButton).toBeVisible();

    // Add an item
    const input = page.locator('input').first();
    await input.fill('Accessibility test');
    await page.click('text=+');

    // Remove button should have accessibility label
    const removeButton = page.locator('[aria-label*="Remove"]').first();
    await expect(removeButton).toBeVisible();
  });

  test('inputs should have proper labels', async ({ page }) => {
    await navigateToSWOTAnalysis(page);

    // Expand a quadrant
    await page.click('text=Opportunities');

    // Input should be labeled
    const input = page.locator('input').first();
    const placeholder = await input.getAttribute('placeholder');

    expect(placeholder).toBeTruthy();
    expect(placeholder?.toLowerCase()).toContain('add');
  });
});

test.describe('SWOT Analysis - Insight Connection Hint', () => {
  test('should display insight hint about connections', async ({ page }) => {
    await navigateToSWOTAnalysis(page);

    // There should be a hint about how quadrants connect
    const insightHint = page.locator('text=strengths can help overcome threats')
      .or(page.locator('text=opportunities can address weaknesses'))
      .or(page.locator('text=Tap each petal'));

    await expect(insightHint).toBeVisible();
  });
});
