/**
 * Phase 6: Manifestation Techniques E2E Tests
 *
 * Playwright tests for Phase 6 screens covering:
 * - 3-6-9 Method screen (ThreeSixNine)
 * - Scripting screen
 * - WOOP Method screen
 */

import { test, expect, Page } from '@playwright/test';

// Test IDs used across Phase 6 screens
const TEST_IDS = {
  // 3-6-9 Method Screen
  threeSixNineScreen: 'three-six-nine-screen',
  manifestationInput: 'manifestation-input',
  cycleDuration21: 'cycle-duration-21',
  cycleDuration33: 'cycle-duration-33',
  morningTracker: 'morning-tracker',
  afternoonTracker: 'afternoon-tracker',
  eveningTracker: 'evening-tracker',
  repetitionCircle: 'repetition-circle',
  dayProgress: 'day-progress',
  cycleProgress: 'cycle-progress',
  explanationCard: 'explanation-card',

  // Scripting Screen
  scriptingScreen: 'scripting-screen',
  templateList: 'template-list',
  templateCard: 'template-card',
  newScriptButton: 'new-script-button',
  scriptEditor: 'script-editor',
  scriptTextInput: 'script-text-input',
  wordCount: 'word-count',
  saveScriptButton: 'save-script-button',
  savedScriptsButton: 'saved-scripts-button',
  savedScriptsList: 'saved-scripts-list',
  tipsCard: 'tips-card',
  closeEditorButton: 'close-editor-button',

  // WOOP Method Screen
  woopScreen: 'woop-screen',
  wishSection: 'woop-section-wish',
  outcomeSection: 'woop-section-outcome',
  obstacleSection: 'woop-section-obstacle',
  planSection: 'woop-section-plan',
  wishInput: 'wish-input',
  outcomeInput: 'outcome-input',
  obstacleInput: 'obstacle-input',
  planInput: 'plan-input',
  progressDots: 'progress-dots',
  saveWoopButton: 'save-woop-button',
  savedWoopsButton: 'saved-woops-button',
  savedWoopsList: 'saved-woops-list',
  markCompleteButton: 'mark-complete-button',
  newWoopButton: 'new-woop-button',
};

/**
 * Helper: Navigate to a specific Phase 6 screen
 */
async function navigateToPhase6Screen(page: Page, screenName: 'threesixnine' | 'scripting' | 'woop') {
  // Navigate to Workbook tab
  await page.getByRole('tab', { name: /workbook/i }).click();

  // Navigate to Phase 6
  await page.getByText('Phase 6').click();

  // Select specific screen
  switch (screenName) {
    case 'threesixnine':
      await page.getByText(/3-6-9 method/i).click();
      break;
    case 'scripting':
      await page.getByText(/scripting/i).click();
      break;
    case 'woop':
      await page.getByText(/woop method/i).click();
      break;
  }
}

// =============================================================================
// 3-6-9 Method Screen Tests
// =============================================================================

test.describe('3-6-9 Method Screen', () => {
  test.beforeEach(async ({ page }) => {
    // Assume app is running and user is authenticated
    await page.goto('/');
    await navigateToPhase6Screen(page, 'threesixnine');
  });

  test('should display screen with all required elements', async ({ page }) => {
    await expect(page.getByTestId(TEST_IDS.threeSixNineScreen)).toBeVisible();
    await expect(page.getByText(/3-6-9 method/i)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.manifestationInput)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.cycleDuration21)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.cycleDuration33)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.morningTracker)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.afternoonTracker)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.eveningTracker)).toBeVisible();
  });

  test('should enter manifestation text', async ({ page }) => {
    const manifestationText = 'I am attracting abundance and success into my life.';

    await page.getByTestId(TEST_IDS.manifestationInput).fill(manifestationText);

    await expect(page.getByTestId(TEST_IDS.manifestationInput)).toHaveValue(manifestationText);
  });

  test('should toggle between 21 and 33 day cycles', async ({ page }) => {
    // Default should be 21 days
    await expect(page.getByTestId(TEST_IDS.cycleDuration21)).toHaveAttribute('aria-selected', 'true');

    // Select 33 days
    await page.getByTestId(TEST_IDS.cycleDuration33).click();
    await expect(page.getByTestId(TEST_IDS.cycleDuration33)).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId(TEST_IDS.cycleDuration21)).toHaveAttribute('aria-selected', 'false');

    // Switch back to 21 days
    await page.getByTestId(TEST_IDS.cycleDuration21).click();
    await expect(page.getByTestId(TEST_IDS.cycleDuration21)).toHaveAttribute('aria-selected', 'true');
  });

  test('should complete morning repetitions (3 times)', async ({ page }) => {
    const morningTracker = page.getByTestId(TEST_IDS.morningTracker);

    // Complete 3 morning repetitions
    for (let i = 0; i < 3; i++) {
      await morningTracker.locator(`[testID="repetition-circle-${i}"]`).click();
      await page.waitForTimeout(100); // Wait for haptic/animation
    }

    // All 3 should be completed
    for (let i = 0; i < 3; i++) {
      await expect(morningTracker.locator(`[testID="repetition-circle-${i}"]`)).toHaveAttribute('aria-checked', 'true');
    }
  });

  test('should complete afternoon repetitions (6 times)', async ({ page }) => {
    const afternoonTracker = page.getByTestId(TEST_IDS.afternoonTracker);

    // Complete 6 afternoon repetitions
    for (let i = 0; i < 6; i++) {
      await afternoonTracker.locator(`[testID="repetition-circle-${i}"]`).click();
      await page.waitForTimeout(100);
    }

    // All 6 should be completed
    for (let i = 0; i < 6; i++) {
      await expect(afternoonTracker.locator(`[testID="repetition-circle-${i}"]`)).toHaveAttribute('aria-checked', 'true');
    }
  });

  test('should complete evening repetitions (9 times)', async ({ page }) => {
    const eveningTracker = page.getByTestId(TEST_IDS.eveningTracker);

    // Complete 9 evening repetitions
    for (let i = 0; i < 9; i++) {
      await eveningTracker.locator(`[testID="repetition-circle-${i}"]`).click();
      await page.waitForTimeout(100);
    }

    // All 9 should be completed
    for (let i = 0; i < 9; i++) {
      await expect(eveningTracker.locator(`[testID="repetition-circle-${i}"]`)).toHaveAttribute('aria-checked', 'true');
    }
  });

  test('should toggle repetition off when clicked again', async ({ page }) => {
    const morningTracker = page.getByTestId(TEST_IDS.morningTracker);
    const firstCircle = morningTracker.locator('[testID="repetition-circle-0"]');

    // Complete first repetition
    await firstCircle.click();
    await expect(firstCircle).toHaveAttribute('aria-checked', 'true');

    // Un-complete it
    await firstCircle.click();
    await expect(firstCircle).toHaveAttribute('aria-checked', 'false');
  });

  test('should display day progress counter', async ({ page }) => {
    await expect(page.getByTestId(TEST_IDS.dayProgress)).toBeVisible();
    await expect(page.getByText(/day \d+ of \d+/i)).toBeVisible();
  });

  test('should show explanation card about Tesla and 3-6-9', async ({ page }) => {
    const explanationCard = page.getByTestId(TEST_IDS.explanationCard);

    await expect(explanationCard).toBeVisible();
    await expect(explanationCard).toContainText(/tesla/i);
    await expect(explanationCard).toContainText(/3.*6.*9/i);
  });

  test('should auto-save manifestation text', async ({ page }) => {
    const manifestationText = 'Testing auto-save functionality for manifestation.';

    await page.getByTestId(TEST_IDS.manifestationInput).fill(manifestationText);

    // Wait for auto-save debounce
    await page.waitForTimeout(2000);

    // Should show saved indicator
    await expect(page.getByText(/saved/i)).toBeVisible();
  });
});

// =============================================================================
// Scripting Screen Tests
// =============================================================================

test.describe('Scripting Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await navigateToPhase6Screen(page, 'scripting');
  });

  test('should display screen with template selection', async ({ page }) => {
    await expect(page.getByTestId(TEST_IDS.scriptingScreen)).toBeVisible();
    await expect(page.getByText(/scripting/i)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.templateList)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.newScriptButton)).toBeVisible();
  });

  test('should display all six script templates', async ({ page }) => {
    const templates = [
      'dream day',
      'dream career',
      'ideal relationship',
      'financial abundance',
      'optimal health',
      'custom'
    ];

    for (const template of templates) {
      await expect(page.getByText(new RegExp(template, 'i'))).toBeVisible();
    }
  });

  test('should select template and show prompts', async ({ page }) => {
    // Select Dream Day template
    await page.locator('[testID^="template-card-"]').first().click();

    // Should highlight selected template
    await expect(page.locator('[testID^="template-card-"]').first()).toHaveAttribute('aria-selected', 'true');

    // Should show template prompts/description
    await expect(page.getByText(/morning.*routine|wake up/i)).toBeVisible();
  });

  test('should open script editor when clicking new script', async ({ page }) => {
    // Select a template first
    await page.locator('[testID^="template-card-"]').first().click();

    // Click new script
    await page.getByTestId(TEST_IDS.newScriptButton).click();

    // Editor should appear
    await expect(page.getByTestId(TEST_IDS.scriptEditor)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.scriptTextInput)).toBeVisible();
  });

  test('should write script in present tense editor', async ({ page }) => {
    await page.locator('[testID^="template-card-"]').first().click();
    await page.getByTestId(TEST_IDS.newScriptButton).click();

    const scriptText = 'I wake up feeling refreshed and energized. The sun streams through my window as I start my perfect day.';

    await page.getByTestId(TEST_IDS.scriptTextInput).fill(scriptText);

    await expect(page.getByTestId(TEST_IDS.scriptTextInput)).toHaveValue(scriptText);
  });

  test('should show word count while writing', async ({ page }) => {
    await page.locator('[testID^="template-card-"]').first().click();
    await page.getByTestId(TEST_IDS.newScriptButton).click();

    const scriptText = 'This is a test script with exactly ten words here now.';

    await page.getByTestId(TEST_IDS.scriptTextInput).fill(scriptText);

    // Word count should update
    await expect(page.getByTestId(TEST_IDS.wordCount)).toContainText(/10|words/i);
  });

  test('should save script successfully', async ({ page }) => {
    await page.locator('[testID^="template-card-"]').first().click();
    await page.getByTestId(TEST_IDS.newScriptButton).click();

    await page.getByTestId(TEST_IDS.scriptTextInput).fill('My test manifestation script.');

    await page.getByTestId(TEST_IDS.saveScriptButton).click();

    // Should show save confirmation
    await expect(page.getByText(/saved/i)).toBeVisible();
  });

  test('should view saved scripts', async ({ page }) => {
    // First create a script
    await page.locator('[testID^="template-card-"]').first().click();
    await page.getByTestId(TEST_IDS.newScriptButton).click();
    await page.getByTestId(TEST_IDS.scriptTextInput).fill('Script to find in saved list.');
    await page.getByTestId(TEST_IDS.saveScriptButton).click();

    // Close editor
    await page.getByTestId(TEST_IDS.closeEditorButton).click();

    // Open saved scripts
    await page.getByTestId(TEST_IDS.savedScriptsButton).click();

    // Saved scripts modal should appear
    await expect(page.getByTestId(TEST_IDS.savedScriptsList)).toBeVisible();
    await expect(page.getByText(/script to find/i)).toBeVisible();
  });

  test('should edit existing script from saved list', async ({ page }) => {
    // Create a script first
    await page.locator('[testID^="template-card-"]').first().click();
    await page.getByTestId(TEST_IDS.newScriptButton).click();
    await page.getByTestId(TEST_IDS.scriptTextInput).fill('Original script content.');
    await page.getByTestId(TEST_IDS.saveScriptButton).click();
    await page.getByTestId(TEST_IDS.closeEditorButton).click();

    // Open saved scripts and select one
    await page.getByTestId(TEST_IDS.savedScriptsButton).click();
    await page.locator('[testID^="saved-script-"]').first().click();

    // Editor should open with existing content
    await expect(page.getByTestId(TEST_IDS.scriptTextInput)).toHaveValue(/original script/i);
  });

  test('should display tips card with scripting guidance', async ({ page }) => {
    await expect(page.getByTestId(TEST_IDS.tipsCard)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.tipsCard)).toContainText(/present tense|feel|emotion/i);
  });

  test('should delete script from saved list', async ({ page }) => {
    // Create a script first
    await page.locator('[testID^="template-card-"]').first().click();
    await page.getByTestId(TEST_IDS.newScriptButton).click();
    await page.getByTestId(TEST_IDS.scriptTextInput).fill('Script to delete.');
    await page.getByTestId(TEST_IDS.saveScriptButton).click();
    await page.getByTestId(TEST_IDS.closeEditorButton).click();

    // Open saved scripts
    await page.getByTestId(TEST_IDS.savedScriptsButton).click();

    // Delete script
    const deleteButton = page.locator('[testID^="delete-script-"]').first();
    await deleteButton.click();

    // Confirm deletion
    await page.getByRole('button', { name: /delete/i }).click();

    // Script should be removed
    await expect(page.getByText(/script to delete/i)).not.toBeVisible();
  });
});

// =============================================================================
// WOOP Method Screen Tests
// =============================================================================

test.describe('WOOP Method Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await navigateToPhase6Screen(page, 'woop');
  });

  test('should display screen with all WOOP sections', async ({ page }) => {
    await expect(page.getByTestId(TEST_IDS.woopScreen)).toBeVisible();
    await expect(page.getByText(/woop method/i)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.wishSection)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.outcomeSection)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.obstacleSection)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.planSection)).toBeVisible();
  });

  test('should display progress dots showing completion', async ({ page }) => {
    await expect(page.getByTestId(TEST_IDS.progressDots)).toBeVisible();

    // Should show 4 dots (W, O, O, P)
    const dots = page.locator('[testID^="progress-dot-"]');
    await expect(dots).toHaveCount(4);
  });

  test('should expand section when tapped', async ({ page }) => {
    // Wish section should start expanded
    await expect(page.getByTestId(TEST_IDS.wishInput)).toBeVisible();

    // Tap Outcome section to expand
    await page.getByTestId(TEST_IDS.outcomeSection).click();

    // Outcome input should now be visible
    await expect(page.getByTestId(TEST_IDS.outcomeInput)).toBeVisible();
  });

  test('should fill in Wish section', async ({ page }) => {
    const wishText = 'I wish to develop a daily meditation practice.';

    await page.getByTestId(TEST_IDS.wishInput).fill(wishText);

    await expect(page.getByTestId(TEST_IDS.wishInput)).toHaveValue(wishText);

    // Progress dot should update
    await expect(page.locator('[testID="progress-dot-0"]')).toHaveAttribute('aria-checked', 'true');
  });

  test('should fill in Outcome section', async ({ page }) => {
    // First fill wish
    await page.getByTestId(TEST_IDS.wishInput).fill('Test wish');

    // Expand and fill outcome
    await page.getByTestId(TEST_IDS.outcomeSection).click();
    const outcomeText = 'I will feel calm, focused, and at peace throughout my day.';
    await page.getByTestId(TEST_IDS.outcomeInput).fill(outcomeText);

    await expect(page.getByTestId(TEST_IDS.outcomeInput)).toHaveValue(outcomeText);
  });

  test('should fill in Obstacle section', async ({ page }) => {
    // Fill previous sections
    await page.getByTestId(TEST_IDS.wishInput).fill('Test wish');
    await page.getByTestId(TEST_IDS.outcomeSection).click();
    await page.getByTestId(TEST_IDS.outcomeInput).fill('Test outcome');

    // Fill obstacle
    await page.getByTestId(TEST_IDS.obstacleSection).click();
    const obstacleText = 'My biggest obstacle is finding time in my busy morning routine.';
    await page.getByTestId(TEST_IDS.obstacleInput).fill(obstacleText);

    await expect(page.getByTestId(TEST_IDS.obstacleInput)).toHaveValue(obstacleText);
  });

  test('should fill in Plan section with if-then format', async ({ page }) => {
    // Fill previous sections
    await page.getByTestId(TEST_IDS.wishInput).fill('Test wish');
    await page.getByTestId(TEST_IDS.outcomeSection).click();
    await page.getByTestId(TEST_IDS.outcomeInput).fill('Test outcome');
    await page.getByTestId(TEST_IDS.obstacleSection).click();
    await page.getByTestId(TEST_IDS.obstacleInput).fill('Test obstacle');

    // Fill plan
    await page.getByTestId(TEST_IDS.planSection).click();
    const planText = 'If I feel too busy in the morning, then I will wake up 10 minutes earlier.';
    await page.getByTestId(TEST_IDS.planInput).fill(planText);

    await expect(page.getByTestId(TEST_IDS.planInput)).toHaveValue(planText);
  });

  test('should save complete WOOP plan', async ({ page }) => {
    // Fill all sections
    await page.getByTestId(TEST_IDS.wishInput).fill('Complete test wish');

    await page.getByTestId(TEST_IDS.outcomeSection).click();
    await page.getByTestId(TEST_IDS.outcomeInput).fill('Complete test outcome');

    await page.getByTestId(TEST_IDS.obstacleSection).click();
    await page.getByTestId(TEST_IDS.obstacleInput).fill('Complete test obstacle');

    await page.getByTestId(TEST_IDS.planSection).click();
    await page.getByTestId(TEST_IDS.planInput).fill('Complete test plan');

    // Save
    await page.getByTestId(TEST_IDS.saveWoopButton).click();

    // Should show save confirmation
    await expect(page.getByText(/saved/i)).toBeVisible();
  });

  test('should show all progress dots complete when WOOP is filled', async ({ page }) => {
    // Fill all sections
    await page.getByTestId(TEST_IDS.wishInput).fill('Test wish');

    await page.getByTestId(TEST_IDS.outcomeSection).click();
    await page.getByTestId(TEST_IDS.outcomeInput).fill('Test outcome');

    await page.getByTestId(TEST_IDS.obstacleSection).click();
    await page.getByTestId(TEST_IDS.obstacleInput).fill('Test obstacle');

    await page.getByTestId(TEST_IDS.planSection).click();
    await page.getByTestId(TEST_IDS.planInput).fill('Test plan');

    // All progress dots should be complete
    for (let i = 0; i < 4; i++) {
      await expect(page.locator(`[testID="progress-dot-${i}"]`)).toHaveAttribute('aria-checked', 'true');
    }
  });

  test('should view saved WOOP plans', async ({ page }) => {
    // Create a WOOP plan first
    await page.getByTestId(TEST_IDS.wishInput).fill('Saved WOOP wish');
    await page.getByTestId(TEST_IDS.outcomeSection).click();
    await page.getByTestId(TEST_IDS.outcomeInput).fill('Saved outcome');
    await page.getByTestId(TEST_IDS.obstacleSection).click();
    await page.getByTestId(TEST_IDS.obstacleInput).fill('Saved obstacle');
    await page.getByTestId(TEST_IDS.planSection).click();
    await page.getByTestId(TEST_IDS.planInput).fill('Saved plan');
    await page.getByTestId(TEST_IDS.saveWoopButton).click();

    // Open saved WOOPs
    await page.getByTestId(TEST_IDS.savedWoopsButton).click();

    // Should show saved list
    await expect(page.getByTestId(TEST_IDS.savedWoopsList)).toBeVisible();
    await expect(page.getByText(/saved woop wish/i)).toBeVisible();
  });

  test('should mark WOOP plan as completed', async ({ page }) => {
    // Create a WOOP plan first
    await page.getByTestId(TEST_IDS.wishInput).fill('WOOP to complete');
    await page.getByTestId(TEST_IDS.outcomeSection).click();
    await page.getByTestId(TEST_IDS.outcomeInput).fill('Outcome');
    await page.getByTestId(TEST_IDS.obstacleSection).click();
    await page.getByTestId(TEST_IDS.obstacleInput).fill('Obstacle');
    await page.getByTestId(TEST_IDS.planSection).click();
    await page.getByTestId(TEST_IDS.planInput).fill('Plan');
    await page.getByTestId(TEST_IDS.saveWoopButton).click();

    // Mark as complete
    await page.getByTestId(TEST_IDS.markCompleteButton).click();

    // Should show completion celebration or status
    await expect(page.getByText(/completed|achieved/i)).toBeVisible();
  });

  test('should start new WOOP plan', async ({ page }) => {
    // Fill some content
    await page.getByTestId(TEST_IDS.wishInput).fill('Old WOOP content');

    // Save it
    await page.getByTestId(TEST_IDS.saveWoopButton).click();

    // Start new WOOP
    await page.getByTestId(TEST_IDS.newWoopButton).click();

    // All fields should be cleared
    await expect(page.getByTestId(TEST_IDS.wishInput)).toHaveValue('');
  });

  test('should show character count for each section', async ({ page }) => {
    await page.getByTestId(TEST_IDS.wishInput).fill('Testing character count');

    // Should display character count
    await expect(page.getByText(/\d+ characters|\d+\/\d+/i)).toBeVisible();
  });
});

// =============================================================================
// Accessibility Tests
// =============================================================================

test.describe('Phase 6 Accessibility', () => {
  test('3-6-9 screen should have proper accessibility labels', async ({ page }) => {
    await page.goto('/');
    await navigateToPhase6Screen(page, 'threesixnine');

    // Check screen accessibility
    await expect(page.getByTestId(TEST_IDS.threeSixNineScreen)).toHaveAttribute(
      'aria-label',
      expect.stringContaining('3-6-9')
    );

    // Repetition circles should have proper roles
    const morningTracker = page.getByTestId(TEST_IDS.morningTracker);
    await expect(morningTracker.locator('[testID="repetition-circle-0"]')).toHaveAttribute('role', 'checkbox');
  });

  test('scripting screen should have proper accessibility labels', async ({ page }) => {
    await page.goto('/');
    await navigateToPhase6Screen(page, 'scripting');

    // Template cards should be focusable
    await expect(page.locator('[testID^="template-card-"]').first()).toHaveAttribute('role', 'button');
  });

  test('WOOP screen should have proper accessibility labels', async ({ page }) => {
    await page.goto('/');
    await navigateToPhase6Screen(page, 'woop');

    // Sections should be expandable with proper roles
    await expect(page.getByTestId(TEST_IDS.wishSection)).toHaveAttribute('role', 'button');

    // Progress dots should have labels
    await expect(page.locator('[testID="progress-dot-0"]')).toHaveAttribute(
      'aria-label',
      expect.stringContaining('Wish')
    );
  });
});

// =============================================================================
// Performance Tests
// =============================================================================

test.describe('Phase 6 Performance', () => {
  test('3-6-9 screen should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await navigateToPhase6Screen(page, 'threesixnine');

    await page.getByTestId(TEST_IDS.threeSixNineScreen).waitFor({ state: 'visible' });

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
  });

  test('scripting screen should handle long text efficiently', async ({ page }) => {
    await page.goto('/');
    await navigateToPhase6Screen(page, 'scripting');

    await page.locator('[testID^="template-card-"]').first().click();
    await page.getByTestId(TEST_IDS.newScriptButton).click();

    // Type a long script
    const longText = 'I am living my best life. '.repeat(100);
    await page.getByTestId(TEST_IDS.scriptTextInput).fill(longText);

    // Should remain responsive
    const startTime = Date.now();
    await page.getByTestId(TEST_IDS.saveScriptButton).click();
    const responseTime = Date.now() - startTime;

    expect(responseTime).toBeLessThan(1000); // Save should be fast
  });

  test('WOOP screen transitions should be smooth', async ({ page }) => {
    await page.goto('/');
    await navigateToPhase6Screen(page, 'woop');

    // Expand each section and measure transition time
    const sections = [
      TEST_IDS.outcomeSection,
      TEST_IDS.obstacleSection,
      TEST_IDS.planSection
    ];

    for (const section of sections) {
      const startTime = Date.now();
      await page.getByTestId(section).click();
      await page.waitForTimeout(300); // Wait for animation
      const transitionTime = Date.now() - startTime;

      expect(transitionTime).toBeLessThan(500); // Transitions should be fast
    }
  });
});

// =============================================================================
// Auto-Save Tests
// =============================================================================

test.describe('Phase 6 Auto-Save', () => {
  test('3-6-9 should auto-save manifestation and progress', async ({ page }) => {
    await page.goto('/');
    await navigateToPhase6Screen(page, 'threesixnine');

    // Enter manifestation
    await page.getByTestId(TEST_IDS.manifestationInput).fill('Auto-save test manifestation');

    // Complete some repetitions
    const morningTracker = page.getByTestId(TEST_IDS.morningTracker);
    await morningTracker.locator('[testID="repetition-circle-0"]').click();

    // Wait for auto-save
    await page.waitForTimeout(2000);

    // Should show saved status
    await expect(page.getByText(/saved|synced/i)).toBeVisible();
  });

  test('scripting should auto-save script content', async ({ page }) => {
    await page.goto('/');
    await navigateToPhase6Screen(page, 'scripting');

    await page.locator('[testID^="template-card-"]').first().click();
    await page.getByTestId(TEST_IDS.newScriptButton).click();

    await page.getByTestId(TEST_IDS.scriptTextInput).fill('Auto-save script content test');

    // Wait for auto-save
    await page.waitForTimeout(2000);

    // Should show saved indicator
    await expect(page.getByText(/saved|auto-saved/i)).toBeVisible();
  });

  test('WOOP should auto-save section content', async ({ page }) => {
    await page.goto('/');
    await navigateToPhase6Screen(page, 'woop');

    await page.getByTestId(TEST_IDS.wishInput).fill('Auto-save WOOP wish');

    // Wait for auto-save
    await page.waitForTimeout(2000);

    // Should show saved indicator
    await expect(page.getByText(/saved|synced/i)).toBeVisible();
  });
});
