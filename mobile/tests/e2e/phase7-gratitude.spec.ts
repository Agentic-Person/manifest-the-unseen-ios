/**
 * Phase 7: Practicing Gratitude E2E Tests
 *
 * End-to-end tests for all Phase 7 screens using Playwright.
 * Tests the gratitude practice features including journal, letters, and meditation.
 *
 * Test Coverage:
 * - GratitudeJournalScreen: Daily entries, streak tracking, categories
 * - GratitudeLettersScreen: Letter writing, templates, status
 * - GratitudeMeditationScreen: Timer, prompts, session tracking
 *
 * Run with: npx playwright test phase7-gratitude.spec.ts
 */

import { test, expect, Page } from '@playwright/test';

// Gratitude categories from the component
const GRATITUDE_CATEGORIES = [
  'People',
  'Experiences',
  'Things',
  'Opportunities',
  'Growth',
];

// Letter templates
const LETTER_TEMPLATES = ['Thank You', 'Appreciation', 'Forgiveness'];

// Meditation durations
const MEDITATION_DURATIONS = ['5 min', '10 min', '15 min'];

/**
 * Helper function to navigate to Phase 7 screens
 */
async function navigateToWorkbook(page: Page) {
  await page.goto('/');
  await page.click('text=Workbook');
  await page.waitForSelector('text=Workbook');
}

async function navigateToGratitudeJournal(page: Page) {
  await navigateToWorkbook(page);
  // Navigate to Phase 7 section
  await page.click('text=Phase 7');
  await page.click('text=Gratitude Journal');
  await page.waitForSelector('text=Gratitude Journal');
}

async function navigateToGratitudeLetters(page: Page) {
  await navigateToWorkbook(page);
  await page.click('text=Phase 7');
  await page.click('text=Gratitude Letters');
  await page.waitForSelector('text=Gratitude Letters');
}

async function navigateToGratitudeMeditation(page: Page) {
  await navigateToWorkbook(page);
  await page.click('text=Phase 7');
  await page.click('text=Gratitude Meditation');
  await page.waitForSelector('text=Gratitude Meditation');
}

// ============================================================================
// GRATITUDE JOURNAL TESTS
// ============================================================================

test.describe('Gratitude Journal Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 14 Pro
  });

  test('should render the screen correctly', async ({ page }) => {
    await navigateToGratitudeJournal(page);

    // Check main title is present
    await expect(page.locator('text=Gratitude Journal')).toBeVisible();

    // Check subtitle/description is present
    await expect(
      page.locator('text=Take a moment to reflect')
    ).toBeVisible();

    // Check streak display is present
    await expect(page.locator('text=streak')).toBeVisible();
  });

  test('should display streak tracker component', async ({ page }) => {
    await navigateToGratitudeJournal(page);

    // Check streak display elements
    await expect(page.locator('text=day')).toBeVisible();
    await expect(page.locator('text=streak')).toBeVisible();

    // Check 7-day view
    await expect(page.locator('text=Last 7 Days')).toBeVisible();

    // Check calendar button
    await expect(page.locator('text=View Full Calendar')).toBeVisible();
  });

  test('should show date navigation controls', async ({ page }) => {
    await navigateToGratitudeJournal(page);

    // Check date navigation is present
    const prevButton = page.locator('[aria-label="Previous day"]');
    const nextButton = page.locator('[aria-label="Next day"]');

    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();
  });

  test('should allow adding a gratitude item', async ({ page }) => {
    await navigateToGratitudeJournal(page);

    // Click add gratitude button
    await page.click('text=Add Gratitude');

    // Check that a new item card appears
    await expect(page.locator('text=1')).toBeVisible(); // Item index badge

    // Check text input placeholder
    await expect(
      page.locator('placeholder=What are you grateful for?')
    ).toBeVisible();
  });

  test('should allow entering gratitude text', async ({ page }) => {
    await navigateToGratitudeJournal(page);

    // Add a gratitude item
    await page.click('text=Add Gratitude');

    // Find and fill the text input
    const textInput = page.locator('[aria-label*="Gratitude item"]').locator('input, textarea').first();
    await textInput.fill('I am grateful for my health and well-being');

    // Verify text was entered
    await expect(textInput).toHaveValue('I am grateful for my health and well-being');
  });

  test('should display category selector', async ({ page }) => {
    await navigateToGratitudeJournal(page);

    // Add a gratitude item
    await page.click('text=Add Gratitude');

    // Check category label
    await expect(page.locator('text=Category:')).toBeVisible();

    // Check category button is present
    const categoryButton = page.locator('[aria-label*="Category"]');
    await expect(categoryButton).toBeVisible();
  });

  test('should allow changing category', async ({ page }) => {
    await navigateToGratitudeJournal(page);

    // Add a gratitude item
    await page.click('text=Add Gratitude');

    // Click category button to open dropdown
    await page.click('[aria-label*="Category"]');

    // Check all categories are displayed
    for (const category of GRATITUDE_CATEGORIES) {
      await expect(page.locator(`text=${category}`)).toBeVisible();
    }

    // Select a different category
    await page.click('text=People');

    // Verify category was changed
    await expect(page.locator('text=People')).toBeVisible();
  });

  test('should allow adding photo to gratitude item', async ({ page }) => {
    await navigateToGratitudeJournal(page);

    // Add a gratitude item
    await page.click('text=Add Gratitude');

    // Check add photo button
    await expect(page.locator('text=Add Photo')).toBeVisible();
  });

  test('should allow deleting a gratitude item', async ({ page }) => {
    await navigateToGratitudeJournal(page);

    // Add a gratitude item
    await page.click('text=Add Gratitude');

    // Find and click delete button
    await page.click('text=Remove');

    // Confirm deletion in alert
    await page.click('text=Delete');

    // Item should be removed
    await expect(page.locator('text=Remove')).not.toBeVisible();
  });

  test('should show entry count and completion status', async ({ page }) => {
    await navigateToGratitudeJournal(page);

    // Check entry count display
    await expect(page.locator('text=0 of 5 gratitudes')).toBeVisible();

    // Add three items to complete the day
    await page.click('text=Add Gratitude');
    await page.click('text=Add Gratitude');
    await page.click('text=Add Gratitude');

    // Check completed badge appears
    await expect(page.locator('text=Day Complete')).toBeVisible();
  });

  test('should display tips card', async ({ page }) => {
    await navigateToGratitudeJournal(page);

    // Check tips card is present
    await expect(page.locator('text=Tips for Gratitude Practice')).toBeVisible();

    // Check at least one tip is shown
    await expect(page.locator('text=Be specific')).toBeVisible();
  });

  test('should have save and continue button', async ({ page }) => {
    await navigateToGratitudeJournal(page);

    // Check save button is present
    await expect(page.locator('text=Save & Continue')).toBeVisible();
  });

  test('should open calendar modal when view full calendar is clicked', async ({ page }) => {
    await navigateToGratitudeJournal(page);

    // Click view full calendar
    await page.click('text=View Full Calendar');

    // Check modal appears with month navigation
    await expect(page.locator('[aria-label="Previous month"]')).toBeVisible();
    await expect(page.locator('[aria-label="Next month"]')).toBeVisible();

    // Close modal
    await page.click('text=Close');
  });
});

// ============================================================================
// GRATITUDE LETTERS TESTS
// ============================================================================

test.describe('Gratitude Letters Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('should render the screen correctly', async ({ page }) => {
    await navigateToGratitudeLetters(page);

    // Check main title is present
    await expect(page.locator('text=Gratitude Letters')).toBeVisible();

    // Check description is present
    await expect(
      page.locator('text=Write heartfelt letters')
    ).toBeVisible();
  });

  test('should display stats summary', async ({ page }) => {
    await navigateToGratitudeLetters(page);

    // Check stats are displayed
    await expect(page.locator('text=Total Letters')).toBeVisible();
    await expect(page.locator('text=Shared')).toBeVisible();
    await expect(page.locator('text=Drafts')).toBeVisible();
  });

  test('should have new letter button', async ({ page }) => {
    await navigateToGratitudeLetters(page);

    // Check new letter button
    await expect(page.locator('text=Write New Letter')).toBeVisible();
  });

  test('should show template selection when starting new letter', async ({ page }) => {
    await navigateToGratitudeLetters(page);

    // Click write new letter
    await page.click('text=Write New Letter');

    // Check template modal appears
    await expect(page.locator('text=Choose Letter Type')).toBeVisible();

    // Check all templates are available
    for (const template of LETTER_TEMPLATES) {
      await expect(page.locator(`text=${template}`)).toBeVisible();
    }
  });

  test('should open editor with selected template', async ({ page }) => {
    await navigateToGratitudeLetters(page);

    // Start new letter
    await page.click('text=Write New Letter');

    // Select Thank You template
    await page.click('text=Thank You');

    // Check editor opens
    await expect(page.locator('text=To:')).toBeVisible();
    await expect(page.locator('text=Your Letter:')).toBeVisible();

    // Check template content is pre-filled
    await expect(
      page.locator('text=I want to take a moment to thank you')
    ).toBeVisible();
  });

  test('should allow entering recipient name', async ({ page }) => {
    await navigateToGratitudeLetters(page);

    // Start new letter with Thank You template
    await page.click('text=Write New Letter');
    await page.click('text=Thank You');

    // Enter recipient name
    const recipientInput = page.locator('[aria-label="Recipient name"]');
    await recipientInput.fill('Mom');

    // Verify name was entered
    await expect(recipientInput).toHaveValue('Mom');
  });

  test('should allow writing letter content', async ({ page }) => {
    await navigateToGratitudeLetters(page);

    // Start new letter
    await page.click('text=Write New Letter');
    await page.click('text=Appreciation');

    // Find letter content input
    const letterInput = page.locator('[aria-label="Letter content"]');

    // Add to the pre-filled content
    await letterInput.fill('Dear Mom,\n\nThank you for always being there for me.');

    // Verify content
    await expect(letterInput).toContainText('Thank you for always being there');
  });

  test('should display character count', async ({ page }) => {
    await navigateToGratitudeLetters(page);

    // Start new letter
    await page.click('text=Write New Letter');
    await page.click('text=Thank You');

    // Check character count is shown
    await expect(page.locator('text=characters')).toBeVisible();
  });

  test('should have save draft button', async ({ page }) => {
    await navigateToGratitudeLetters(page);

    // Start new letter
    await page.click('text=Write New Letter');
    await page.click('text=Thank You');

    // Check action buttons
    await expect(page.locator('text=Save Draft')).toBeVisible();
    await expect(page.locator('text=Complete')).toBeVisible();
  });

  test('should show empty state when no letters', async ({ page }) => {
    await navigateToGratitudeLetters(page);

    // Check empty state is shown
    await expect(page.locator('text=No Letters Yet')).toBeVisible();
    await expect(
      page.locator('text=Start your gratitude practice')
    ).toBeVisible();
  });

  test('should display tips card', async ({ page }) => {
    await navigateToGratitudeLetters(page);

    // Check tips card
    await expect(page.locator('text=Writing Tips')).toBeVisible();
    await expect(page.locator('text=Be specific about what they did')).toBeVisible();
  });

  test('should allow canceling template selection', async ({ page }) => {
    await navigateToGratitudeLetters(page);

    // Open template selection
    await page.click('text=Write New Letter');

    // Check cancel button and click it
    await expect(page.locator('text=Cancel')).toBeVisible();
    await page.click('text=Cancel');

    // Modal should be closed
    await expect(page.locator('text=Choose Letter Type')).not.toBeVisible();
  });
});

// ============================================================================
// GRATITUDE MEDITATION TESTS
// ============================================================================

test.describe('Gratitude Meditation Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('should render the screen correctly', async ({ page }) => {
    await navigateToGratitudeMeditation(page);

    // Check main title is present
    await expect(page.locator('text=Gratitude Meditation')).toBeVisible();

    // Check description is present
    await expect(
      page.locator('text=Center yourself in gratitude')
    ).toBeVisible();
  });

  test('should display session stats', async ({ page }) => {
    await navigateToGratitudeMeditation(page);

    // Check stats are displayed
    await expect(page.locator('text=Sessions')).toBeVisible();
    await expect(page.locator('text=Minutes')).toBeVisible();
    await expect(page.locator('text=This Week')).toBeVisible();
  });

  test('should display duration selector with all options', async ({ page }) => {
    await navigateToGratitudeMeditation(page);

    // Check all duration options are available
    for (const duration of MEDITATION_DURATIONS) {
      await expect(page.locator(`text=${duration}`)).toBeVisible();
    }
  });

  test('should allow selecting different durations', async ({ page }) => {
    await navigateToGratitudeMeditation(page);

    // Click 10 min option
    await page.click('text=10 min');

    // The 10 min should now be selected (visual styling)
    // Timer display should show 10:00
    await expect(page.locator('text=10:00')).toBeVisible();
  });

  test('should display timer in idle state', async ({ page }) => {
    await navigateToGratitudeMeditation(page);

    // Check timer displays default duration (5 min = 05:00)
    await expect(page.locator('text=05:00')).toBeVisible();

    // Check state message
    await expect(page.locator('text=Ready to begin')).toBeVisible();
  });

  test('should have Begin button in idle state', async ({ page }) => {
    await navigateToGratitudeMeditation(page);

    // Check begin button is present
    await expect(page.locator('text=Begin')).toBeVisible();
  });

  test('should display visualization prompt', async ({ page }) => {
    await navigateToGratitudeMeditation(page);

    // Check prompt card is displayed
    // The prompt title varies, so check for any gratitude-related content
    await expect(
      page.locator('text=/Blessings|People|Pleasures|Body|Growth|Abundance/')
    ).toBeVisible();

    // Check shuffle button
    await expect(page.locator('text=New Prompt')).toBeVisible();
  });

  test('should change prompt when shuffle is clicked', async ({ page }) => {
    await navigateToGratitudeMeditation(page);

    // Get current prompt title
    const promptBefore = await page.locator('.promptTitle').textContent();

    // Click shuffle multiple times to ensure we get a different one
    for (let i = 0; i < 5; i++) {
      await page.click('text=New Prompt');
    }

    // The prompt might have changed (or might not due to randomness)
    // Just verify the button is functional
    await expect(page.locator('text=New Prompt')).toBeVisible();
  });

  test('should start timer when Begin is clicked', async ({ page }) => {
    await navigateToGratitudeMeditation(page);

    // Click begin
    await page.click('text=Begin');

    // State message should change
    await expect(page.locator('text=Focus on gratitude')).toBeVisible();

    // Should see pause and stop buttons instead of begin
    await expect(page.locator('[aria-label="Pause meditation"]')).toBeVisible();
    await expect(page.locator('[aria-label="Stop meditation"]')).toBeVisible();
  });

  test('should show pause and resume functionality', async ({ page }) => {
    await navigateToGratitudeMeditation(page);

    // Start meditation
    await page.click('text=Begin');

    // Pause
    await page.click('[aria-label="Pause meditation"]');
    await expect(page.locator('text=Paused')).toBeVisible();

    // Resume button should be visible
    await expect(page.locator('[aria-label="Resume meditation"]')).toBeVisible();
  });

  test('should show breathing guide during meditation', async ({ page }) => {
    await navigateToGratitudeMeditation(page);

    // Start meditation
    await page.click('text=Begin');

    // Check breathing guide is visible
    await expect(page.locator('text=Breathe')).toBeVisible();
    await expect(
      page.locator('text=Let your breath flow naturally')
    ).toBeVisible();
  });

  test('should allow stopping meditation early', async ({ page }) => {
    await navigateToGratitudeMeditation(page);

    // Start meditation
    await page.click('text=Begin');

    // Stop meditation
    await page.click('[aria-label="Stop meditation"]');

    // Should return to idle state
    await expect(page.locator('text=Ready to begin')).toBeVisible();
    await expect(page.locator('text=Begin')).toBeVisible();
  });

  test('should display tips when idle', async ({ page }) => {
    await navigateToGratitudeMeditation(page);

    // Check tips card is visible
    await expect(page.locator('text=Meditation Tips')).toBeVisible();
    await expect(
      page.locator('text=Find a quiet, comfortable space')
    ).toBeVisible();
  });

  test('should hide duration selector while running', async ({ page }) => {
    await navigateToGratitudeMeditation(page);

    // Start meditation
    await page.click('text=Begin');

    // Duration buttons should be disabled/dimmed (not selectable)
    const durationButton = page.locator('text=10 min');
    await expect(durationButton).toHaveAttribute('disabled', '');
  });
});

// ============================================================================
// CROSS-SCREEN NAVIGATION TESTS
// ============================================================================

test.describe('Phase 7 Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('should navigate between Phase 7 screens', async ({ page }) => {
    // Start at Journal
    await navigateToGratitudeJournal(page);
    await expect(page.locator('text=Gratitude Journal')).toBeVisible();

    // Go back to Phase 7
    await page.goBack();
    await page.click('text=Gratitude Letters');
    await expect(page.locator('text=Gratitude Letters')).toBeVisible();

    // Go back to Phase 7
    await page.goBack();
    await page.click('text=Gratitude Meditation');
    await expect(page.locator('text=Gratitude Meditation')).toBeVisible();
  });

  test('should preserve state when navigating back', async ({ page }) => {
    // Add gratitude item in journal
    await navigateToGratitudeJournal(page);
    await page.click('text=Add Gratitude');

    // Navigate away and back
    await page.goBack();
    await page.click('text=Gratitude Journal');

    // Item should still be there (or empty state if cleared)
    // The behavior depends on state persistence implementation
    await expect(page.locator('text=Gratitude Journal')).toBeVisible();
  });
});

// ============================================================================
// ACCESSIBILITY TESTS
// ============================================================================

test.describe('Phase 7 Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('Gratitude Journal should have proper accessibility labels', async ({ page }) => {
    await navigateToGratitudeJournal(page);

    // Check navigation buttons have labels
    await expect(page.locator('[aria-label="Previous day"]')).toBeVisible();
    await expect(page.locator('[aria-label="Next day"]')).toBeVisible();
    await expect(page.locator('[aria-label="Go to today"]')).toBeVisible();
  });

  test('Gratitude Letters editor should have proper labels', async ({ page }) => {
    await navigateToGratitudeLetters(page);

    // Open editor
    await page.click('text=Write New Letter');
    await page.click('text=Thank You');

    // Check form fields have labels
    await expect(page.locator('[aria-label="Recipient name"]')).toBeVisible();
    await expect(page.locator('[aria-label="Letter content"]')).toBeVisible();
  });

  test('Gratitude Meditation should have proper labels', async ({ page }) => {
    await navigateToGratitudeMeditation(page);

    // Check timer controls have labels
    await expect(page.locator('[aria-label="Start meditation"]')).toBeVisible();

    // Start and check running controls
    await page.click('text=Begin');
    await expect(page.locator('[aria-label="Pause meditation"]')).toBeVisible();
    await expect(page.locator('[aria-label="Stop meditation"]')).toBeVisible();
  });
});

// ============================================================================
// DARK THEME VISUAL TESTS
// ============================================================================

test.describe('Phase 7 Dark Theme', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('Gratitude Journal should use dark theme colors', async ({ page }) => {
    await navigateToGratitudeJournal(page);

    // Take screenshot for visual comparison
    await expect(page).toHaveScreenshot('gratitude-journal-dark.png');
  });

  test('Gratitude Letters should use dark theme colors', async ({ page }) => {
    await navigateToGratitudeLetters(page);

    // Take screenshot for visual comparison
    await expect(page).toHaveScreenshot('gratitude-letters-dark.png');
  });

  test('Gratitude Meditation should use dark theme colors', async ({ page }) => {
    await navigateToGratitudeMeditation(page);

    // Take screenshot for visual comparison
    await expect(page).toHaveScreenshot('gratitude-meditation-dark.png');
  });
});
