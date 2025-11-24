/**
 * Phase 10: Trust & Letting Go E2E Tests
 *
 * End-to-end tests for all Phase 10 screens using Playwright.
 * Tests the final phase of the transformation journey including
 * journey review, future letter, and graduation ceremony.
 *
 * Test Coverage:
 * - JourneyReviewScreen: Progress summary, phase cards, timeline, transformation
 * - FutureLetterScreen: Letter writing, prompts, sealing, countdown
 * - GraduationScreen: Commitment, daily practices, certificate, celebration
 *
 * Run with: npx playwright test phase10-graduation.spec.ts
 */

import { test, expect, Page } from '@playwright/test';

// Phase names from the app
const PHASE_NAMES = [
  'Self-Evaluation',
  'Values & Vision',
  'Goal Setting',
  'Facing Fears',
  'Self-Love',
  'Manifestation',
  'Gratitude',
  'Envy to Inspiration',
  'Trust & Surrender',
  'Trust & Letting Go',
];

// Daily practices available for selection
const DAILY_PRACTICES = [
  'Gratitude Journal',
  'Morning Meditation',
  'Self-Love Affirmations',
  'Manifestation Scripting',
  '3-6-9 Method',
  'Vision Board Review',
];

// Writing prompts for future letter
const LETTER_PROMPTS = [
  'What have you achieved?',
  'How do you feel?',
  'What are you grateful for?',
  'What wisdom do you have?',
];

/**
 * Helper function to navigate to Phase 10 screens
 */
async function navigateToWorkbook(page: Page) {
  await page.goto('/');
  await page.click('text=Workbook');
  await page.waitForSelector('text=Workbook');
}

async function navigateToJourneyReview(page: Page) {
  await navigateToWorkbook(page);
  // Navigate to Phase 10 section
  await page.click('text=Phase 10');
  await page.click('text=Journey Review');
  await page.waitForSelector('text=Your Transformation Journey');
}

async function navigateToFutureLetter(page: Page) {
  await navigateToWorkbook(page);
  await page.click('text=Phase 10');
  await page.click('text=Letter to Future Self');
  await page.waitForSelector('text=Letter to Future Self');
}

async function navigateToGraduation(page: Page) {
  await navigateToWorkbook(page);
  await page.click('text=Phase 10');
  await page.click('text=Graduation');
  await page.waitForSelector('text=Graduation');
}

// ============================================================================
// JOURNEY REVIEW SCREEN TESTS
// ============================================================================

test.describe('Journey Review Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 14 Pro
  });

  test('should render the screen correctly', async ({ page }) => {
    await navigateToJourneyReview(page);

    // Check phase label
    await expect(page.locator('text=PHASE 10')).toBeVisible();

    // Check main title is present
    await expect(page.locator('text=Your Transformation Journey')).toBeVisible();

    // Check subtitle/description is present
    await expect(
      page.locator('text=Reflect on how far')
    ).toBeVisible();
  });

  test('should display overall progress card', async ({ page }) => {
    await navigateToJourneyReview(page);

    // Check progress card header
    await expect(page.locator('text=Journey Progress')).toBeVisible();

    // Check percentage display
    await expect(page.locator('text=/%/')).toBeVisible();

    // Check stats row
    await expect(page.locator('text=Days')).toBeVisible();
    await expect(page.locator('text=Exercises')).toBeVisible();
    await expect(page.locator('text=Journals')).toBeVisible();
    await expect(page.locator('text=Meditation')).toBeVisible();
  });

  test('should display phase-by-phase progress section', async ({ page }) => {
    await navigateToJourneyReview(page);

    // Check section header
    await expect(page.locator('text=Phase-by-Phase Progress')).toBeVisible();
    await expect(page.locator('text=Tap any phase to review')).toBeVisible();

    // Check at least some phases are displayed
    await expect(page.locator('text=Phase 1')).toBeVisible();
    await expect(page.locator('text=Self-Evaluation')).toBeVisible();
  });

  test('should display all 10 phase progress cards', async ({ page }) => {
    await navigateToJourneyReview(page);

    // Scroll to load all phases
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(300);

    // Check each phase number is displayed
    for (let i = 1; i <= 10; i++) {
      await expect(page.locator(`text=Phase ${i}`).first()).toBeVisible();
    }
  });

  test('should show phase progress with completion percentage', async ({ page }) => {
    await navigateToJourneyReview(page);

    // Check progress indicators exist
    const progressElements = page.locator('text=/%/');
    const count = await progressElements.count();
    expect(count).toBeGreaterThan(0);

    // Check exercises count format
    await expect(page.locator('text=/\\d+ exercises/')).toBeVisible();
  });

  test('should display transformation section', async ({ page }) => {
    await navigateToJourneyReview(page);

    // Scroll to transformation section
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(300);

    // Check section title
    await expect(page.locator('text=My Transformation')).toBeVisible();
    await expect(page.locator('text=Before and after')).toBeVisible();

    // Check before/after labels
    await expect(page.locator('text=BEFORE')).toBeVisible();
    await expect(page.locator('text=AFTER')).toBeVisible();
  });

  test('should display biggest lesson section', async ({ page }) => {
    await navigateToJourneyReview(page);

    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(300);

    await expect(page.locator('text=Biggest Lesson')).toBeVisible();
  });

  test('should display gratitude section', async ({ page }) => {
    await navigateToJourneyReview(page);

    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(300);

    await expect(page.locator('text=Grateful For')).toBeVisible();
  });

  test('should display timeline visualization', async ({ page }) => {
    await navigateToJourneyReview(page);

    // Scroll to timeline section
    await page.evaluate(() => window.scrollTo(0, 3000));
    await page.waitForTimeout(300);

    await expect(page.locator('text=Journey Timeline')).toBeVisible();

    // Check timeline items
    for (const phaseName of PHASE_NAMES.slice(0, 5)) {
      await expect(page.locator(`text=${phaseName}`).first()).toBeVisible();
    }
  });

  test('should display export button', async ({ page }) => {
    await navigateToJourneyReview(page);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    await expect(page.locator('text=Export Journey Summary')).toBeVisible();
  });

  test('should display continue button', async ({ page }) => {
    await navigateToJourneyReview(page);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    await expect(page.locator('text=Continue: Letter to Future Self')).toBeVisible();
  });

  test('should navigate to FutureLetter on continue', async ({ page }) => {
    await navigateToJourneyReview(page);

    // Scroll to bottom and click continue
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    await page.click('text=Continue: Letter to Future Self');

    // Should navigate to Future Letter screen
    await expect(page.locator('text=Letter to Future Self')).toBeVisible();
  });

  test('should have accessible phase cards', async ({ page }) => {
    await navigateToJourneyReview(page);

    // Check accessibility labels on phase cards
    const phaseCards = page.getByRole('button', { name: /Phase \d+:/ });
    const count = await phaseCards.count();
    expect(count).toBeGreaterThan(0);
  });
});

// ============================================================================
// FUTURE LETTER SCREEN TESTS
// ============================================================================

test.describe('Future Letter Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('should render the screen correctly', async ({ page }) => {
    await navigateToFutureLetter(page);

    // Check phase label
    await expect(page.locator('text=PHASE 10')).toBeVisible();

    // Check main title
    await expect(page.locator('text=Letter to Future Self')).toBeVisible();

    // Check description
    await expect(
      page.locator('text=Write a letter to yourself')
    ).toBeVisible();
  });

  test('should display open date card', async ({ page }) => {
    await navigateToFutureLetter(page);

    // Check open date information
    await expect(page.locator('text=Your letter will open on')).toBeVisible();
    await expect(page.locator('text=365 days of transformation')).toBeVisible();
  });

  test('should display mode toggle', async ({ page }) => {
    await navigateToFutureLetter(page);

    // Check mode toggle buttons
    await expect(page.locator('text=Guided Prompts')).toBeVisible();
    await expect(page.locator('text=Free Writing')).toBeVisible();
  });

  test('should show guided prompts by default', async ({ page }) => {
    await navigateToFutureLetter(page);

    // Check guided prompts intro
    await expect(page.locator('text=Dear Future Self,')).toBeVisible();

    // Check prompts are visible
    for (const prompt of LETTER_PROMPTS) {
      await expect(page.locator(`text=${prompt}`)).toBeVisible();
    }
  });

  test('should switch to free writing mode', async ({ page }) => {
    await navigateToFutureLetter(page);

    // Click free writing mode
    await page.click('text=Free Writing');

    // Check letter paper appears
    await expect(page.locator('text=Dear Future Self,')).toBeVisible();

    // Check placeholder text
    await expect(
      page.locator('text=Write your letter here')
    ).toBeVisible();
  });

  test('should allow typing in guided prompts', async ({ page }) => {
    await navigateToFutureLetter(page);

    // Find first prompt input
    const promptInputs = page.locator('input, textarea').filter({
      has: page.locator('[placeholder*="By now"]'),
    });

    // Type in the first prompt
    await promptInputs.first().fill('I have achieved inner peace');

    // Verify text was entered
    await expect(promptInputs.first()).toHaveValue('I have achieved inner peace');
  });

  test('should allow typing in free writing mode', async ({ page }) => {
    await navigateToFutureLetter(page);

    // Switch to free writing
    await page.click('text=Free Writing');

    // Find letter input
    const letterInput = page.locator('textarea, input[multiline]').first();

    // Type letter content
    await letterInput.fill('My dearest future self, I am writing to you...');

    // Verify text was entered
    await expect(letterInput).toHaveValue('My dearest future self, I am writing to you...');
  });

  test('should display save status', async ({ page }) => {
    await navigateToFutureLetter(page);

    // Check save status is displayed
    await expect(page.locator('text=/auto-save|Saving/')).toBeVisible();
  });

  test('should display seal button', async ({ page }) => {
    await navigateToFutureLetter(page);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    // Check seal button
    await expect(page.locator('text=Seal My Letter')).toBeVisible();
  });

  test('should display seal warning', async ({ page }) => {
    await navigateToFutureLetter(page);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    // Check warning text
    await expect(
      page.locator('text=cannot be edited')
    ).toBeVisible();
  });

  test('should show validation when sealing empty letter', async ({ page }) => {
    await navigateToFutureLetter(page);

    // Scroll and click seal without writing
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    await page.click('text=Seal My Letter');

    // Should show validation alert
    await expect(page.locator('text=Empty Letter')).toBeVisible();
  });

  test('should have accessible elements', async ({ page }) => {
    await navigateToFutureLetter(page);

    // Check accessible buttons
    await expect(
      page.getByRole('button', { name: /Guided prompts mode/ })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Free writing mode/ })
    ).toBeVisible();
  });
});

// ============================================================================
// GRADUATION SCREEN TESTS
// ============================================================================

test.describe('Graduation Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('should render the screen correctly', async ({ page }) => {
    await navigateToGraduation(page);

    // Check phase label
    await expect(page.locator('text=PHASE 10')).toBeVisible();

    // Check main title
    await expect(page.locator('text=Graduation & Commitment')).toBeVisible();

    // Check description
    await expect(
      page.locator('text=Make a commitment')
    ).toBeVisible();
  });

  test('should display commitment statement section', async ({ page }) => {
    await navigateToGraduation(page);

    // Check section header
    await expect(page.locator('text=My Manifestation Commitment')).toBeVisible();
    await expect(page.locator('text=promise yourself')).toBeVisible();

    // Check commitment prompt
    await expect(page.locator('text=/I, .*, commit to/')).toBeVisible();
  });

  test('should allow typing commitment statement', async ({ page }) => {
    await navigateToGraduation(page);

    // Find commitment input
    const commitmentInput = page.locator('textarea, input[multiline]').first();

    // Type commitment
    await commitmentInput.fill('I commit to practicing gratitude daily and trusting the universe');

    // Verify text was entered
    await expect(commitmentInput).toHaveValue(
      'I commit to practicing gratitude daily and trusting the universe'
    );
  });

  test('should display daily practices section', async ({ page }) => {
    await navigateToGraduation(page);

    // Scroll to practices section
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(300);

    // Check section header
    await expect(page.locator('text=My Daily Practices')).toBeVisible();
    await expect(page.locator('text=exercises you\'ll continue')).toBeVisible();
  });

  test('should display all daily practices', async ({ page }) => {
    await navigateToGraduation(page);

    // Scroll to practices section
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(300);

    // Check each practice is displayed
    for (const practice of DAILY_PRACTICES) {
      await expect(page.locator(`text=${practice}`)).toBeVisible();
    }
  });

  test('should allow selecting practices', async ({ page }) => {
    await navigateToGraduation(page);

    // Scroll to practices section
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(300);

    // Click on first practice
    await page.click('text=Gratitude Journal');

    // Verify it's selected (check mark appears)
    // The checkbox should be in checked state
    const checkbox = page.getByRole('checkbox', { name: /Gratitude Journal/ });
    await expect(checkbox).toBeChecked();
  });

  test('should allow selecting multiple practices', async ({ page }) => {
    await navigateToGraduation(page);

    // Scroll to practices section
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(300);

    // Select multiple practices
    await page.click('text=Gratitude Journal');
    await page.click('text=Morning Meditation');
    await page.click('text=Self-Love Affirmations');

    // Verify multiple selections
    const checkboxes = page.getByRole('checkbox', { checked: true });
    const count = await checkboxes.count();
    expect(count).toBe(3);
  });

  test('should display inspirational quote', async ({ page }) => {
    await navigateToGraduation(page);

    // Scroll to quote section
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(300);

    // Check quote is displayed
    await expect(page.locator('text=impossible journey')).toBeVisible();
    await expect(page.locator('text=Tony Robbins')).toBeVisible();
  });

  test('should display graduate button', async ({ page }) => {
    await navigateToGraduation(page);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    // Check graduate button
    await expect(page.locator('text=Complete My Journey')).toBeVisible();
  });

  test('should show validation when graduating without commitment', async ({ page }) => {
    await navigateToGraduation(page);

    // Scroll to bottom and click graduate
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    await page.click('text=Complete My Journey');

    // Should show validation alert
    await expect(page.locator('text=Commitment Required')).toBeVisible();
  });

  test('should show validation when graduating without practices', async ({ page }) => {
    await navigateToGraduation(page);

    // Add commitment but no practices
    const commitmentInput = page.locator('textarea, input[multiline]').first();
    await commitmentInput.fill('I commit to my transformation');

    // Scroll to bottom and click graduate
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    await page.click('text=Complete My Journey');

    // Should show validation alert
    await expect(page.locator('text=Select Practices')).toBeVisible();
  });

  test('should show confirmation dialog before graduation', async ({ page }) => {
    await navigateToGraduation(page);

    // Fill commitment
    const commitmentInput = page.locator('textarea, input[multiline]').first();
    await commitmentInput.fill('I commit to daily practice');

    // Select a practice
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(300);
    await page.click('text=Gratitude Journal');

    // Click graduate
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    await page.click('text=Complete My Journey');

    // Should show confirmation dialog
    await expect(page.locator('text=Complete Your Journey')).toBeVisible();
    await expect(page.locator('text=Graduate!')).toBeVisible();
    await expect(page.locator('text=Not Yet')).toBeVisible();
  });

  test('should have accessible elements', async ({ page }) => {
    await navigateToGraduation(page);

    // Check accessibility
    await expect(
      page.getByRole('button', { name: /Complete graduation/ })
    ).toBeVisible();

    // Check practice checkboxes have accessibility
    const checkboxes = page.getByRole('checkbox');
    const count = await checkboxes.count();
    expect(count).toBe(DAILY_PRACTICES.length);
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

test.describe('Phase 10 Flow Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('should flow from Journey Review to Future Letter', async ({ page }) => {
    await navigateToJourneyReview(page);

    // Scroll to continue button
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    // Click continue
    await page.click('text=Continue: Letter to Future Self');

    // Should be on Future Letter screen
    await expect(page.locator('text=Letter to Future Self')).toBeVisible();
    await expect(page.locator('text=Write a letter')).toBeVisible();
  });

  test('should flow from Future Letter to Graduation', async ({ page }) => {
    await navigateToFutureLetter(page);

    // Write a letter in free mode
    await page.click('text=Free Writing');
    const letterInput = page.locator('textarea, input[multiline]').first();
    await letterInput.fill('Dear future self, I am proud of who I am becoming...');

    // Seal the letter (need to handle the confirmation)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    await page.click('text=Seal My Letter');

    // Confirm sealing
    await page.click('text=Seal Letter');

    // Should show sealed letter view with continue button
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Continue to Graduation')).toBeVisible();

    // Continue to graduation
    await page.click('text=Continue to Graduation');

    // Should be on Graduation screen
    await expect(page.locator('text=Graduation & Commitment')).toBeVisible();
  });

  test('should complete full graduation flow', async ({ page }) => {
    await navigateToGraduation(page);

    // Fill commitment
    const commitmentInput = page.locator('textarea, input[multiline]').first();
    await commitmentInput.fill('I commit to living my most authentic life');

    // Select practices
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(300);
    await page.click('text=Gratitude Journal');
    await page.click('text=Morning Meditation');

    // Click graduate
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    await page.click('text=Complete My Journey');

    // Confirm graduation
    await page.click('text=Graduate!');

    // Should show celebration
    await page.waitForTimeout(2000);

    // Check for congratulations or certificate
    await expect(page.locator('text=/Congratulations|Journey Complete/')).toBeVisible();
  });

  test('should display certificate after graduation', async ({ page }) => {
    await navigateToGraduation(page);

    // Complete graduation flow
    const commitmentInput = page.locator('textarea, input[multiline]').first();
    await commitmentInput.fill('My commitment');

    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(300);
    await page.click('text=Gratitude Journal');

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    await page.click('text=Complete My Journey');
    await page.click('text=Graduate!');

    // Wait for celebration
    await page.waitForTimeout(3000);

    // Check for certificate view option
    await expect(page.locator('text=/View My Certificate|Certificate/')).toBeVisible();
  });

  test('should allow sharing achievement after graduation', async ({ page }) => {
    // This test assumes graduation is complete (would need setup)
    await navigateToGraduation(page);

    // Complete graduation flow
    const commitmentInput = page.locator('textarea, input[multiline]').first();
    await commitmentInput.fill('My commitment');

    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(300);
    await page.click('text=Gratitude Journal');

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    await page.click('text=Complete My Journey');
    await page.click('text=Graduate!');

    // Wait for celebration
    await page.waitForTimeout(3000);

    // Check for share button
    await expect(page.locator('text=Share Achievement')).toBeVisible();
  });

  test('should allow returning to workbook after graduation', async ({ page }) => {
    await navigateToGraduation(page);

    // Complete graduation flow
    const commitmentInput = page.locator('textarea, input[multiline]').first();
    await commitmentInput.fill('My commitment');

    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(300);
    await page.click('text=Gratitude Journal');

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    await page.click('text=Complete My Journey');
    await page.click('text=Graduate!');

    // Wait for celebration
    await page.waitForTimeout(3000);

    // Check for return to workbook button
    await expect(page.locator('text=Return to Workbook')).toBeVisible();
  });
});

// ============================================================================
// ACCESSIBILITY TESTS
// ============================================================================

test.describe('Phase 10 Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('Journey Review should have proper accessibility labels', async ({ page }) => {
    await navigateToJourneyReview(page);

    // Check main elements have accessible names
    await expect(page.getByRole('button', { name: /Export/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue/ })).toBeVisible();
  });

  test('Future Letter should have proper accessibility labels', async ({ page }) => {
    await navigateToFutureLetter(page);

    // Check mode toggle accessibility
    await expect(
      page.getByRole('button', { name: /Guided prompts mode/ })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Free writing mode/ })
    ).toBeVisible();

    // Check seal button accessibility
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    await expect(page.getByRole('button', { name: /Seal letter/ })).toBeVisible();
  });

  test('Graduation should have proper accessibility labels', async ({ page }) => {
    await navigateToGraduation(page);

    // Check commitment input accessibility
    await expect(
      page.getByRole('textbox', { name: /Commitment statement/ })
    ).toBeVisible();

    // Check practice checkboxes accessibility
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(300);

    for (const practice of DAILY_PRACTICES.slice(0, 3)) {
      await expect(
        page.getByRole('checkbox', { name: new RegExp(practice) })
      ).toBeVisible();
    }
  });
});
