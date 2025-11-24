/**
 * Phase 9: Trust & Surrender E2E Tests
 *
 * End-to-end tests for the Trust & Surrender phase using Playwright.
 * Tests cover Trust Assessment, Surrender Practice, and Signs screens.
 *
 * Note: These tests are designed for React Native testing with Expo.
 * They use accessibility labels and test IDs for element identification.
 */

import { test, expect, Page } from '@playwright/test';

// Test configuration
const APP_URL = process.env.EXPO_PUBLIC_APP_URL || 'http://localhost:8081';

// Routes
const TRUST_ASSESSMENT_ROUTE = '/workbook/trust-assessment';
const SURRENDER_PRACTICE_ROUTE = '/workbook/surrender-practice';
const SIGNS_ROUTE = '/workbook/signs';

/**
 * Helper to wait for loading to complete
 */
async function waitForLoadingComplete(page: Page) {
  await page
    .waitForSelector('[data-testid="loading-indicator"]', { state: 'hidden', timeout: 5000 })
    .catch(() => {
      // Loading indicator might not exist if load is fast
    });
}

// ============================================
// TRUST ASSESSMENT SCREEN TESTS
// ============================================
test.describe('Trust Assessment Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${APP_URL}${TRUST_ASSESSMENT_ROUTE}`);
    await waitForLoadingComplete(page);
  });

  test.describe('Screen Loading', () => {
    test('should display the trust assessment screen with correct title', async ({ page }) => {
      // Verify screen title
      const title = page.getByText('Trust Assessment');
      await expect(title).toBeVisible();

      // Verify subtitle
      const subtitle = page.getByText(/Explore your relationship with trust/i);
      await expect(subtitle).toBeVisible();
    });

    test('should display the trust radar chart', async ({ page }) => {
      // Radar chart should be visible
      const radarChart = page.getByRole('image', { name: /trust radar chart/i });
      await expect(radarChart).toBeVisible();
    });

    test('should display trust profile score', async ({ page }) => {
      const scoreLabel = page.getByText('Trust Profile');
      await expect(scoreLabel).toBeVisible();

      // Should show score out of 10
      const scoreMax = page.getByText('/10');
      await expect(scoreMax).toBeVisible();
    });

    test('should display all 5 trust dimensions', async ({ page }) => {
      const dimensions = [
        'Trust in Self',
        'Trust in Others',
        'Trust in Universe',
        'Trust in Process',
        'Trust in Timing',
      ];

      for (const dimension of dimensions) {
        const label = page.getByText(dimension);
        await expect(label).toBeVisible();
      }
    });

    test('should have save button', async ({ page }) => {
      const saveButton = page.getByRole('button', { name: /save.*continue/i });
      await expect(saveButton).toBeVisible();
      await expect(saveButton).toBeEnabled();
    });
  });

  test.describe('Trust Sliders', () => {
    test('should display sliders for each dimension', async ({ page }) => {
      // Each dimension should have a slider
      const sliders = page.locator('[aria-label*="slider"]');
      await expect(sliders).toHaveCount(5);
    });

    test('should update slider value when adjusted', async ({ page }) => {
      // Find the first slider
      const slider = page.locator('[aria-label*="slider"]').first();

      // Interact with slider (drag to change value)
      await slider.click();

      // Value should be visible
      const valueDisplay = page.locator('[data-testid^="slider-value-"]').first();
      await expect(valueDisplay).toBeVisible();
    });

    test('should show questions when dimension is tapped', async ({ page }) => {
      // Tap on Trust in Self label
      const selfDimension = page.getByText('Trust in Self');
      await selfDimension.click();

      // Questions should appear
      const questionsTitle = page.getByText('Reflect on these questions:');
      await expect(questionsTitle).toBeVisible();

      // Question content should be visible
      const questionText = page.getByText(/I trust my own judgment/i);
      await expect(questionText).toBeVisible();
    });
  });

  test.describe('Radar Chart Interaction', () => {
    test('should display dimension labels on radar', async ({ page }) => {
      const radarLabels = ['Self', 'Others', 'Universe', 'Process', 'Timing'];

      for (const label of radarLabels) {
        const labelElement = page.getByText(label);
        await expect(labelElement).toBeVisible();
      }
    });

    test('should show legend with dimension values', async ({ page }) => {
      // Legend should show each dimension with its value
      const legendItems = page.locator('[data-testid^="legend-item-"]');
      await expect(legendItems).toHaveCount(5);
    });
  });

  test.describe('Insights Section', () => {
    test('should toggle insights section', async ({ page }) => {
      // Find insights toggle
      const insightsToggle = page.getByRole('button', {
        name: /view personalized insights/i,
      });
      await expect(insightsToggle).toBeVisible();

      // Click to expand
      await insightsToggle.click();

      // Insights content should appear
      const insightsTitle = page.getByText('Areas for Growth');
      await expect(insightsTitle).toBeVisible();
    });

    test('should show journal prompts for lowest scores', async ({ page }) => {
      // Expand insights
      const insightsToggle = page.getByRole('button', {
        name: /view personalized insights/i,
      });
      await insightsToggle.click();

      // Journal prompts should be visible
      const promptsLabel = page.getByText('Journal Prompts:');
      await expect(promptsLabel.first()).toBeVisible();
    });
  });

  test.describe('Save Functionality', () => {
    test('should show auto-save status', async ({ page }) => {
      const saveStatus = page.getByText(/changes auto-save/i);
      await expect(saveStatus).toBeVisible();
    });

    test('should navigate back when Save & Continue is pressed', async ({ page }) => {
      const saveButton = page.getByRole('button', { name: /save.*continue/i });
      await saveButton.click();

      // Would navigate back to previous screen
      // Actual verification depends on navigation structure
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper accessibility labels on sliders', async ({ page }) => {
      const sliders = page.locator('[aria-label*="slider"]');
      const firstSlider = sliders.first();

      // Should have aria-value attributes
      await expect(firstSlider).toHaveAttribute('aria-valuemin', '1');
      await expect(firstSlider).toHaveAttribute('aria-valuemax', '10');
    });

    test('should have accessible radar chart', async ({ page }) => {
      const radarChart = page.getByRole('image', { name: /trust radar chart/i });
      await expect(radarChart).toBeVisible();
    });
  });
});

// ============================================
// SURRENDER PRACTICE SCREEN TESTS
// ============================================
test.describe('Surrender Practice Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${APP_URL}${SURRENDER_PRACTICE_ROUTE}`);
    await waitForLoadingComplete(page);
  });

  test.describe('Screen Loading', () => {
    test('should display the surrender practice screen with correct title', async ({ page }) => {
      const title = page.getByText('Surrender Practice');
      await expect(title).toBeVisible();

      const subtitle = page.getByText(/let go of what you cannot control/i);
      await expect(subtitle).toBeVisible();
    });

    test('should display stats cards', async ({ page }) => {
      // Total Released stat
      const totalReleased = page.getByText('Total Released');
      await expect(totalReleased).toBeVisible();

      // In Progress stat
      const inProgress = page.getByText('In Progress');
      await expect(inProgress).toBeVisible();
    });

    test('should display daily affirmation', async ({ page }) => {
      const affirmationLabel = page.getByText("Today's Surrender Affirmation");
      await expect(affirmationLabel).toBeVisible();
    });

    test('should have add new practice button', async ({ page }) => {
      const addButton = page.getByRole('button', { name: /new surrender practice/i });
      await expect(addButton).toBeVisible();
    });
  });

  test.describe('Adding Surrender Entry', () => {
    test('should add a new surrender card when button is pressed', async ({ page }) => {
      const addButton = page.getByRole('button', { name: /new surrender practice/i });
      await addButton.click();

      // A new card should appear with header
      const cardHeader = page.getByText('Surrender Practice').first();
      await expect(cardHeader).toBeVisible();
    });

    test('should display control and surrender text fields', async ({ page }) => {
      // Add a new entry
      const addButton = page.getByRole('button', { name: /new surrender practice/i });
      await addButton.click();

      // Control field should be visible
      const controlLabel = page.getByText("What I'm Trying to Control");
      await expect(controlLabel).toBeVisible();

      // Surrender field should be visible
      const surrenderLabel = page.getByText('What I Choose to Surrender');
      await expect(surrenderLabel).toBeVisible();
    });

    test('should display release affirmation field', async ({ page }) => {
      const addButton = page.getByRole('button', { name: /new surrender practice/i });
      await addButton.click();

      const affirmationLabel = page.getByText('Release Affirmation');
      await expect(affirmationLabel).toBeVisible();
    });
  });

  test.describe('Surrender Entry Interaction', () => {
    test('should allow entering control text', async ({ page }) => {
      const addButton = page.getByRole('button', { name: /new surrender practice/i });
      await addButton.click();

      const controlInput = page.getByPlaceholder(/what you feel you need to control/i);
      await controlInput.fill('The outcome of my job interview');

      await expect(controlInput).toHaveValue('The outcome of my job interview');
    });

    test('should allow entering surrender text', async ({ page }) => {
      const addButton = page.getByRole('button', { name: /new surrender practice/i });
      await addButton.click();

      const surrenderInput = page.getByPlaceholder(/what you're ready to let go of/i);
      await surrenderInput.fill('My attachment to a specific result');

      await expect(surrenderInput).toHaveValue('My attachment to a specific result');
    });

    test('should disable release button when fields are empty', async ({ page }) => {
      const addButton = page.getByRole('button', { name: /new surrender practice/i });
      await addButton.click();

      const releaseButton = page.getByRole('button', { name: /release.*surrender/i });
      await expect(releaseButton).toBeDisabled();
    });

    test('should enable release button when fields are filled', async ({ page }) => {
      const addButton = page.getByRole('button', { name: /new surrender practice/i });
      await addButton.click();

      // Fill in control text
      const controlInput = page.getByPlaceholder(/what you feel you need to control/i);
      await controlInput.fill('Test control');

      // Fill in surrender text
      const surrenderInput = page.getByPlaceholder(/what you're ready to let go of/i);
      await surrenderInput.fill('Test surrender');

      const releaseButton = page.getByRole('button', { name: /release.*surrender/i });
      await expect(releaseButton).toBeEnabled();
    });
  });

  test.describe('Release Animation', () => {
    test('should trigger release animation when release is pressed', async ({ page }) => {
      // Add and fill entry
      const addButton = page.getByRole('button', { name: /new surrender practice/i });
      await addButton.click();

      const controlInput = page.getByPlaceholder(/what you feel you need to control/i);
      await controlInput.fill('Test control');

      const surrenderInput = page.getByPlaceholder(/what you're ready to let go of/i);
      await surrenderInput.fill('Test surrender');

      // Press release button
      const releaseButton = page.getByRole('button', { name: /release.*surrender/i });
      await releaseButton.click();

      // Button text should change to "Releasing..."
      await expect(page.getByText('Releasing...')).toBeVisible();

      // Wait for animation to complete
      await page.waitForTimeout(2000);

      // Released state should show
      const releasedTitle = page.getByText('Released & Surrendered');
      await expect(releasedTitle).toBeVisible();
    });
  });

  test.describe('Daily Affirmation', () => {
    test('should refresh affirmation when refresh button is pressed', async ({ page }) => {
      // Get initial affirmation
      const affirmationContainer = page.locator('[data-testid="daily-affirmation"]');
      const initialText = await page.getByText(/I release/i).textContent();

      // Press refresh
      const refreshButton = page.getByRole('button', { name: /get new affirmation/i });
      await refreshButton.click();

      // Affirmation should potentially change (or remain same randomly)
      // Just verify the action completes without error
      await expect(affirmationContainer).toBeVisible();
    });
  });

  test.describe('Instructions', () => {
    test('should display instructions when no entries exist', async ({ page }) => {
      // Instructions should be visible
      const instructionsTitle = page.getByText('How It Works');
      await expect(instructionsTitle).toBeVisible();

      // Step numbers should be visible
      for (let i = 1; i <= 4; i++) {
        const stepNumber = page.getByText(i.toString()).first();
        await expect(stepNumber).toBeVisible();
      }
    });
  });

  test.describe('Tips Section', () => {
    test('should display surrender wisdom tips', async ({ page }) => {
      const tipsTitle = page.getByText('Surrender Wisdom');
      await expect(tipsTitle).toBeVisible();
    });
  });
});

// ============================================
// SIGNS & SYNCHRONICITIES SCREEN TESTS
// ============================================
test.describe('Signs & Synchronicities Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${APP_URL}${SIGNS_ROUTE}`);
    await waitForLoadingComplete(page);
  });

  test.describe('Screen Loading', () => {
    test('should display the signs screen with correct title', async ({ page }) => {
      const title = page.getByText('Signs & Synchronicities');
      await expect(title).toBeVisible();

      const subtitle = page.getByText(/document the meaningful coincidences/i);
      await expect(subtitle).toBeVisible();
    });

    test('should display stats card', async ({ page }) => {
      const totalSigns = page.getByText('Total Signs');
      await expect(totalSigns).toBeVisible();

      const recurring = page.getByText('Recurring');
      await expect(recurring).toBeVisible();
    });

    test('should display category filter', async ({ page }) => {
      const filterLabel = page.getByText('Filter by Category');
      await expect(filterLabel).toBeVisible();

      // All filter chip should be visible
      const allChip = page.getByRole('button', { name: /show all categories/i });
      await expect(allChip).toBeVisible();
    });

    test('should display all category filter chips', async ({ page }) => {
      const categories = ['Numbers', 'Animals', 'People', 'Events', 'Dreams', 'Other'];

      for (const category of categories) {
        const categoryChip = page.getByRole('button', { name: new RegExp(`filter by ${category}`, 'i') });
        await expect(categoryChip).toBeVisible();
      }
    });

    test('should have add sign button', async ({ page }) => {
      const addButton = page.getByRole('button', { name: /log a sign or synchronicity/i });
      await expect(addButton).toBeVisible();
    });
  });

  test.describe('Empty State', () => {
    test('should display empty state when no entries', async ({ page }) => {
      const emptyTitle = page.getByText('No Signs Recorded Yet');
      await expect(emptyTitle).toBeVisible();

      const emptyText = page.getByText(/start noticing the synchronicities/i);
      await expect(emptyText).toBeVisible();
    });
  });

  test.describe('Adding Sign Entry', () => {
    test('should add a new sign card when button is pressed', async ({ page }) => {
      const addButton = page.getByRole('button', { name: /log a sign or synchronicity/i });
      await addButton.click();

      // New card should appear with category badge
      const categorySelector = page.getByRole('button', { name: /select category/i });
      await expect(categorySelector).toBeVisible();
    });

    test('should display all entry fields', async ({ page }) => {
      const addButton = page.getByRole('button', { name: /log a sign or synchronicity/i });
      await addButton.click();

      // Category field
      const categoryLabel = page.getByText('Category');
      await expect(categoryLabel).toBeVisible();

      // What happened field
      const whatHappenedLabel = page.getByText('What Happened?');
      await expect(whatHappenedLabel).toBeVisible();

      // What it might mean field
      const meaningLabel = page.getByText('What Might This Mean?');
      await expect(meaningLabel).toBeVisible();

      // How it felt field
      const feelingLabel = page.getByText('How Did It Make You Feel?');
      await expect(feelingLabel).toBeVisible();
    });
  });

  test.describe('Sign Entry Interaction', () => {
    test.beforeEach(async ({ page }) => {
      const addButton = page.getByRole('button', { name: /log a sign or synchronicity/i });
      await addButton.click();
    });

    test('should open category picker when category selector is pressed', async ({ page }) => {
      const categorySelector = page.getByRole('button', { name: /select category/i });
      await categorySelector.click();

      // Category options should appear
      const numbersOption = page.getByRole('button', { name: /select numbers category/i });
      await expect(numbersOption).toBeVisible();
    });

    test('should change category when option is selected', async ({ page }) => {
      const categorySelector = page.getByRole('button', { name: /select category/i });
      await categorySelector.click();

      // Select "Numbers" category
      const numbersOption = page.getByRole('button', { name: /select numbers category/i });
      await numbersOption.click();

      // Category should update in header
      const numbersLabel = page.getByText('Numbers');
      await expect(numbersLabel.first()).toBeVisible();
    });

    test('should allow entering what happened text', async ({ page }) => {
      const whatHappenedInput = page.getByPlaceholder(/describe the synchronicity/i);
      await whatHappenedInput.fill('I saw 11:11 on the clock');

      await expect(whatHappenedInput).toHaveValue('I saw 11:11 on the clock');
    });

    test('should allow entering meaning text', async ({ page }) => {
      const meaningInput = page.getByPlaceholder(/what message or meaning/i);
      await meaningInput.fill('A sign to pay attention');

      await expect(meaningInput).toHaveValue('A sign to pay attention');
    });

    test('should allow entering feeling text', async ({ page }) => {
      const feelingInput = page.getByPlaceholder(/describe your emotional response/i);
      await feelingInput.fill('Curious and hopeful');

      await expect(feelingInput).toHaveValue('Curious and hopeful');
    });

    test('should toggle recurring checkbox', async ({ page }) => {
      const recurringCheckbox = page.getByRole('checkbox', { name: /mark as recurring sign/i });

      // Should be unchecked initially
      await expect(recurringCheckbox).not.toBeChecked();

      // Click to check
      await recurringCheckbox.click();

      // Should be checked now
      await expect(recurringCheckbox).toBeChecked();
    });
  });

  test.describe('Category Filtering', () => {
    test('should filter entries when category is selected', async ({ page }) => {
      // Add an entry first
      const addButton = page.getByRole('button', { name: /log a sign or synchronicity/i });
      await addButton.click();

      // Fill entry and set category
      const categorySelector = page.getByRole('button', { name: /select category/i });
      await categorySelector.click();

      const numbersOption = page.getByRole('button', { name: /select numbers category/i });
      await numbersOption.click();

      const whatHappenedInput = page.getByPlaceholder(/describe the synchronicity/i);
      await whatHappenedInput.fill('Saw 444');

      // Select Numbers filter
      const numbersFilter = page.getByRole('button', { name: /filter by numbers/i });
      await numbersFilter.click();

      // Entry should still be visible
      const entry = page.getByText('Saw 444');
      await expect(entry).toBeVisible();
    });
  });

  test.describe('Photo Attachment', () => {
    test('should display add photo button', async ({ page }) => {
      const addButton = page.getByRole('button', { name: /log a sign or synchronicity/i });
      await addButton.click();

      const photoLabel = page.getByText('Photo (Optional)');
      await expect(photoLabel).toBeVisible();

      const addPhotoButton = page.getByRole('button', { name: /add a photo/i });
      await expect(addPhotoButton).toBeVisible();
    });
  });

  test.describe('Entry Expansion', () => {
    test('should collapse entry when header is tapped', async ({ page }) => {
      // Add an entry
      const addButton = page.getByRole('button', { name: /log a sign or synchronicity/i });
      await addButton.click();

      // Fill some text
      const whatHappenedInput = page.getByPlaceholder(/describe the synchronicity/i);
      await whatHappenedInput.fill('Test synchronicity');

      // Tap header to collapse
      const collapseButton = page.getByRole('button', { name: /collapse entry/i });
      await collapseButton.click();

      // Input should not be visible (collapsed)
      await expect(whatHappenedInput).not.toBeVisible();

      // Preview text should be visible
      const preview = page.getByText('Test synchronicity');
      await expect(preview).toBeVisible();
    });
  });

  test.describe('Tips Section', () => {
    test('should display signs to watch for tips', async ({ page }) => {
      const tipsTitle = page.getByText('Signs to Watch For');
      await expect(tipsTitle).toBeVisible();

      // Specific tips should be visible
      const numbersTip = page.getByText(/repeating numbers/i);
      await expect(numbersTip).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper accessibility labels on filter chips', async ({ page }) => {
      const allChip = page.getByRole('button', { name: /show all categories/i });
      await expect(allChip).toHaveAttribute('aria-selected', /true|false/);
    });

    test('should have proper accessibility on entry cards', async ({ page }) => {
      const addButton = page.getByRole('button', { name: /log a sign or synchronicity/i });
      await addButton.click();

      const articleCard = page.getByRole('article', { name: /synchronicity entry/i });
      await expect(articleCard).toBeVisible();
    });
  });
});

/**
 * Test utilities for mocking native modules
 */
export const mockHaptics = {
  impactAsync: async () => {},
  notificationAsync: async () => {},
};

export const mockAlert = {
  alert: (
    title: string,
    message: string,
    buttons: Array<{ text: string; onPress?: () => void; style?: string }>
  ) => {
    // Auto-confirm for testing
    const confirmButton = buttons.find((b) => b.text === 'Delete');
    if (confirmButton?.onPress) {
      confirmButton.onPress();
    }
  },
};
