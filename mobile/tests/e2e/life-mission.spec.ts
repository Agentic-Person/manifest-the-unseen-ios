/**
 * Life Mission Screen E2E Tests
 *
 * Tests for the Phase 2 Life Mission worksheet screen.
 * This screen allows users to define their mission across 4 dimensions:
 * Personal, Professional, Impact, and Legacy.
 *
 * Test coverage:
 * - All 4 mission sections are visible
 * - Expand/collapse functionality
 * - Text input in sections
 * - Combined mission view
 * - Auto-save functionality
 */

import { test, expect, Page } from '@playwright/test';

/**
 * Test configuration
 */
const TEST_CONFIG = {
  screenPath: '/workbook/phase2/life-mission',
  timeout: 30000,
};

/**
 * Mission section test IDs
 */
const SECTION_IDS = {
  personal: 'mission-section-personal',
  professional: 'mission-section-professional',
  impact: 'mission-section-impact',
  legacy: 'mission-section-legacy',
};

/**
 * Sample mission text for testing
 */
const SAMPLE_MISSIONS = {
  personal: 'I aspire to be a compassionate leader who inspires others through integrity and wisdom.',
  professional: 'I create meaningful technology that empowers people to live more mindful lives.',
  impact: 'I serve my community by mentoring young professionals and supporting local education.',
  legacy: 'I want to be remembered as someone who brought light and positivity to everyone I met.',
};

/**
 * Helper function to navigate to Life Mission screen
 */
async function navigateToLifeMission(page: Page): Promise<void> {
  await page.goto(TEST_CONFIG.screenPath);
  await page.waitForSelector('[data-testid="mission-section-personal"]', {
    timeout: TEST_CONFIG.timeout,
  });
}

/**
 * Test Suite: Life Mission Screen
 */
test.describe('Life Mission Screen', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Life Mission screen before each test
    await navigateToLifeMission(page);
  });

  /**
   * Test: All 4 mission sections are visible
   */
  test('should display all 4 mission sections', async ({ page }) => {
    // Verify Personal Mission section exists
    const personalSection = page.getByTestId(SECTION_IDS.personal);
    await expect(personalSection).toBeVisible();
    await expect(personalSection).toContainText('Personal Mission');

    // Verify Professional Mission section exists
    const professionalSection = page.getByTestId(SECTION_IDS.professional);
    await expect(professionalSection).toBeVisible();
    await expect(professionalSection).toContainText('Professional Mission');

    // Verify Impact Mission section exists
    const impactSection = page.getByTestId(SECTION_IDS.impact);
    await expect(impactSection).toBeVisible();
    await expect(impactSection).toContainText('Impact Mission');

    // Verify Legacy Mission section exists
    const legacySection = page.getByTestId(SECTION_IDS.legacy);
    await expect(legacySection).toBeVisible();
    await expect(legacySection).toContainText('Legacy Mission');
  });

  /**
   * Test: Section headers display correct content
   */
  test('should display correct section headers and subtitles', async ({ page }) => {
    // Personal section
    await expect(page.getByTestId(SECTION_IDS.personal)).toContainText('Who I am at my core');

    // Professional section
    await expect(page.getByTestId(SECTION_IDS.professional)).toContainText('What I contribute through my work');

    // Impact section
    await expect(page.getByTestId(SECTION_IDS.impact)).toContainText('How I serve others');

    // Legacy section
    await expect(page.getByTestId(SECTION_IDS.legacy)).toContainText('What I leave behind');
  });

  /**
   * Test: Expanding a section reveals content
   */
  test('should expand section when header is tapped', async ({ page }) => {
    // Initially, Personal section should be expanded (default)
    const personalInput = page.getByTestId(`${SECTION_IDS.personal}-input`);
    await expect(personalInput).toBeVisible();

    // Tap on Professional section header to expand it
    const professionalHeader = page.getByTestId(`${SECTION_IDS.professional}-header`);
    await professionalHeader.click();

    // Professional section input should now be visible
    const professionalInput = page.getByTestId(`${SECTION_IDS.professional}-input`);
    await expect(professionalInput).toBeVisible();
  });

  /**
   * Test: Collapsing a section hides content
   */
  test('should collapse section when header is tapped again', async ({ page }) => {
    // Personal section is expanded by default
    const personalInput = page.getByTestId(`${SECTION_IDS.personal}-input`);
    await expect(personalInput).toBeVisible();

    // Tap on Personal section header to collapse it
    const personalHeader = page.getByTestId(`${SECTION_IDS.personal}-header`);
    await personalHeader.click();

    // Personal section input should now be hidden
    await expect(personalInput).not.toBeVisible();
  });

  /**
   * Test: Only one section expanded at a time
   */
  test('should only have one section expanded at a time', async ({ page }) => {
    // Personal section is expanded by default
    const personalInput = page.getByTestId(`${SECTION_IDS.personal}-input`);
    await expect(personalInput).toBeVisible();

    // Expand Professional section
    const professionalHeader = page.getByTestId(`${SECTION_IDS.professional}-header`);
    await professionalHeader.click();

    // Professional should be visible, Personal should be hidden
    const professionalInput = page.getByTestId(`${SECTION_IDS.professional}-input`);
    await expect(professionalInput).toBeVisible();
    await expect(personalInput).not.toBeVisible();
  });

  /**
   * Test: Entering text in a section
   */
  test('should allow text input in expanded section', async ({ page }) => {
    // Personal section is expanded by default
    const personalInput = page.getByTestId(`${SECTION_IDS.personal}-input`);

    // Type mission text
    await personalInput.fill(SAMPLE_MISSIONS.personal);

    // Verify text is entered
    await expect(personalInput).toHaveValue(SAMPLE_MISSIONS.personal);
  });

  /**
   * Test: Text persists when collapsing and re-expanding
   */
  test('should preserve text when section is collapsed and re-expanded', async ({ page }) => {
    const personalInput = page.getByTestId(`${SECTION_IDS.personal}-input`);
    const personalHeader = page.getByTestId(`${SECTION_IDS.personal}-header`);

    // Enter text
    await personalInput.fill(SAMPLE_MISSIONS.personal);

    // Collapse section
    await personalHeader.click();
    await expect(personalInput).not.toBeVisible();

    // Re-expand section
    await personalHeader.click();
    await expect(personalInput).toBeVisible();

    // Verify text is preserved
    await expect(personalInput).toHaveValue(SAMPLE_MISSIONS.personal);
  });

  /**
   * Test: Character count updates as user types
   */
  test('should display character count', async ({ page }) => {
    const personalInput = page.getByTestId(`${SECTION_IDS.personal}-input`);

    // Type some text
    const testText = 'Test mission text';
    await personalInput.fill(testText);

    // Verify character count is displayed
    const section = page.getByTestId(SECTION_IDS.personal);
    await expect(section).toContainText(`${testText.length}/500`);
  });

  /**
   * Test: Progress indicator updates
   */
  test('should update progress when missions are written', async ({ page }) => {
    // Initially progress should be 0%
    await expect(page.locator('text=0%')).toBeVisible();

    // Enter substantial text in Personal mission (more than 50 chars)
    const personalInput = page.getByTestId(`${SECTION_IDS.personal}-input`);
    await personalInput.fill(SAMPLE_MISSIONS.personal);

    // Progress should update to 25% (1 of 4 missions)
    await expect(page.locator('text=25%')).toBeVisible();
    await expect(page.locator('text=1 of 4 missions written')).toBeVisible();
  });

  /**
   * Test: View combined mission button
   */
  test('should have view combined mission button', async ({ page }) => {
    const viewCombinedButton = page.getByTestId('view-combined-button');
    await expect(viewCombinedButton).toBeVisible();
    await expect(viewCombinedButton).toContainText('View Your Complete Mission');
  });

  /**
   * Test: Combined mission button disabled when no missions written
   */
  test('should disable combined view button when no missions written', async ({ page }) => {
    const viewCombinedButton = page.getByTestId('view-combined-button');

    // Button should be disabled (has disabled state)
    await expect(viewCombinedButton).toHaveAttribute('aria-disabled', 'true');
  });

  /**
   * Test: Combined mission view opens
   */
  test('should open combined mission view when button is clicked', async ({ page }) => {
    // First enter at least one mission
    const personalInput = page.getByTestId(`${SECTION_IDS.personal}-input`);
    await personalInput.fill(SAMPLE_MISSIONS.personal);

    // Click view combined button
    const viewCombinedButton = page.getByTestId('view-combined-button');
    await viewCombinedButton.click();

    // Modal should open
    const combinedModal = page.getByTestId('combined-mission-modal');
    await expect(combinedModal).toBeVisible();
    await expect(combinedModal).toContainText('Your Life Mission');
  });

  /**
   * Test: Combined view shows entered missions
   */
  test('should display entered missions in combined view', async ({ page }) => {
    // Enter personal mission
    const personalInput = page.getByTestId(`${SECTION_IDS.personal}-input`);
    await personalInput.fill(SAMPLE_MISSIONS.personal);

    // Open combined view
    const viewCombinedButton = page.getByTestId('view-combined-button');
    await viewCombinedButton.click();

    // Verify personal mission is displayed
    const combinedModal = page.getByTestId('combined-mission-modal');
    await expect(combinedModal).toContainText(SAMPLE_MISSIONS.personal);
  });

  /**
   * Test: Close combined view
   */
  test('should close combined view when close button is clicked', async ({ page }) => {
    // Enter a mission and open combined view
    const personalInput = page.getByTestId(`${SECTION_IDS.personal}-input`);
    await personalInput.fill(SAMPLE_MISSIONS.personal);

    const viewCombinedButton = page.getByTestId('view-combined-button');
    await viewCombinedButton.click();

    // Close the modal
    const closeButton = page.getByTestId('combined-mission-modal-close');
    await closeButton.click();

    // Modal should be hidden
    const combinedModal = page.getByTestId('combined-mission-modal');
    await expect(combinedModal).not.toBeVisible();
  });

  /**
   * Test: Auto-save functionality
   */
  test('should trigger auto-save after typing', async ({ page }) => {
    // This test checks that auto-save is triggered (via console log in dev)
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });

    // Enter text
    const personalInput = page.getByTestId(`${SECTION_IDS.personal}-input`);
    await personalInput.fill(SAMPLE_MISSIONS.personal);

    // Wait for debounce (2 seconds)
    await page.waitForTimeout(2500);

    // Verify auto-save was triggered
    expect(consoleMessages.some((msg) => msg.includes('Auto-saving'))).toBe(true);
  });

  /**
   * Test: Guiding prompts are displayed
   */
  test('should display guiding prompts in expanded sections', async ({ page }) => {
    // Personal section should show its prompt
    const personalSection = page.getByTestId(SECTION_IDS.personal);
    await expect(personalSection).toContainText('Describe the person you aspire to be');
  });

  /**
   * Test: Screen header displays correctly
   */
  test('should display screen header with phase info', async ({ page }) => {
    await expect(page.locator('text=Phase 2')).toBeVisible();
    await expect(page.locator('text=Life Mission')).toBeVisible();
    await expect(page.locator('text=Define your purpose across four dimensions')).toBeVisible();
  });

  /**
   * Test: Complete all missions and view combined statement
   */
  test('should complete workflow: fill all missions and view combined', async ({ page }) => {
    // Fill Personal mission
    const personalInput = page.getByTestId(`${SECTION_IDS.personal}-input`);
    await personalInput.fill(SAMPLE_MISSIONS.personal);

    // Expand and fill Professional mission
    const professionalHeader = page.getByTestId(`${SECTION_IDS.professional}-header`);
    await professionalHeader.click();
    const professionalInput = page.getByTestId(`${SECTION_IDS.professional}-input`);
    await professionalInput.fill(SAMPLE_MISSIONS.professional);

    // Expand and fill Impact mission
    const impactHeader = page.getByTestId(`${SECTION_IDS.impact}-header`);
    await impactHeader.click();
    const impactInput = page.getByTestId(`${SECTION_IDS.impact}-input`);
    await impactInput.fill(SAMPLE_MISSIONS.impact);

    // Expand and fill Legacy mission
    const legacyHeader = page.getByTestId(`${SECTION_IDS.legacy}-header`);
    await legacyHeader.click();
    const legacyInput = page.getByTestId(`${SECTION_IDS.legacy}-input`);
    await legacyInput.fill(SAMPLE_MISSIONS.legacy);

    // Progress should be 100%
    await expect(page.locator('text=100%')).toBeVisible();
    await expect(page.locator('text=4 of 4 missions written')).toBeVisible();

    // Open combined view
    const viewCombinedButton = page.getByTestId('view-combined-button');
    await viewCombinedButton.click();

    // All missions should be displayed
    const combinedModal = page.getByTestId('combined-mission-modal');
    await expect(combinedModal).toContainText(SAMPLE_MISSIONS.personal);
    await expect(combinedModal).toContainText(SAMPLE_MISSIONS.professional);
    await expect(combinedModal).toContainText(SAMPLE_MISSIONS.impact);
    await expect(combinedModal).toContainText(SAMPLE_MISSIONS.legacy);

    // Should show "Your Complete Mission" message
    await expect(combinedModal).toContainText('Your complete mission statement');
  });
});

/**
 * Test Suite: Life Mission Accessibility
 */
test.describe('Life Mission Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToLifeMission(page);
  });

  test('sections should have proper accessibility labels', async ({ page }) => {
    const personalHeader = page.getByTestId(`${SECTION_IDS.personal}-header`);

    // Check accessibility role
    await expect(personalHeader).toHaveAttribute('role', 'button');

    // Check accessibility state
    await expect(personalHeader).toHaveAttribute('aria-expanded', 'true');
  });

  test('inputs should have accessible labels', async ({ page }) => {
    const personalInput = page.getByTestId(`${SECTION_IDS.personal}-input`);

    // Input should be focusable and have proper role
    await personalInput.focus();
    await expect(personalInput).toBeFocused();
  });
});
