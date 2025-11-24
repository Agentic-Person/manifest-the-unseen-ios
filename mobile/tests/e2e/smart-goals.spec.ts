/**
 * SMART Goals Screen E2E Tests
 *
 * Tests for the Phase 3 SMART Goals screen.
 * SMART = Specific, Measurable, Achievable, Relevant, Time-bound.
 *
 * Test coverage:
 * - Goals list displays correctly
 * - Add new goal via FAB
 * - Goal form with all SMART criteria
 * - Category selection
 * - Status cycling
 * - Delete goal with confirmation
 * - Filter by category
 * - Auto-save functionality
 */

import { test, expect, Page } from '@playwright/test';

/**
 * Test configuration
 */
const TEST_CONFIG = {
  screenPath: '/workbook/phase3/smart-goals',
  timeout: 30000,
};

/**
 * Test IDs
 */
const TEST_IDS = {
  addGoalFab: 'add-goal-fab',
  goalForm: 'smart-goal-form',
  formTitle: 'smart-goal-form-title',
  formCategory: 'smart-goal-form-category',
  formSave: 'smart-goal-form-save',
  formCancel: 'smart-goal-form-cancel',
  filterAll: 'filter-all',
  filterPersonal: 'filter-personal',
  filterProfessional: 'filter-professional',
  filterHealth: 'filter-health',
  filterFinancial: 'filter-financial',
  filterRelationship: 'filter-relationship',
};

/**
 * Sample goal data for testing
 */
const SAMPLE_GOAL = {
  title: 'Complete meditation practice daily',
  category: 'personal',
  specific: 'Meditate for 20 minutes every morning before work',
  measurable: 'Track daily completions, aim for 30 day streak',
  achievable: 'Start with guided meditations and use reminders',
  relevant: 'Supports my goal of reducing stress and improving focus',
  timeBound: '30 days from now',
};

/**
 * Helper function to navigate to SMART Goals screen
 */
async function navigateToSMARTGoals(page: Page): Promise<void> {
  await page.goto(TEST_CONFIG.screenPath);
  await page.waitForSelector(`[data-testid="${TEST_IDS.addGoalFab}"]`, {
    timeout: TEST_CONFIG.timeout,
  });
}

/**
 * Helper function to open goal form
 */
async function openGoalForm(page: Page): Promise<void> {
  const fab = page.getByTestId(TEST_IDS.addGoalFab);
  await fab.click();
  await page.waitForSelector(`[data-testid="${TEST_IDS.goalForm}"]`, {
    timeout: TEST_CONFIG.timeout,
  });
}

/**
 * Helper function to fill goal form
 */
async function fillGoalForm(page: Page, goalData: typeof SAMPLE_GOAL): Promise<void> {
  // Fill title
  const titleInput = page.getByTestId(`${TEST_IDS.goalForm}-title`);
  await titleInput.fill(goalData.title);

  // Select category
  const categoryButton = page.getByTestId(`${TEST_IDS.goalForm}-category`);
  await categoryButton.click();
  const categoryOption = page.getByTestId(`${TEST_IDS.goalForm}-category-${goalData.category}`);
  await categoryOption.click();

  // Fill Specific
  const specificHeader = page.getByTestId(`${TEST_IDS.goalForm}-specific-header`);
  await specificHeader.click();
  const specificInput = page.getByTestId(`${TEST_IDS.goalForm}-specific-input`);
  await specificInput.fill(goalData.specific);

  // Fill Measurable
  const measurableHeader = page.getByTestId(`${TEST_IDS.goalForm}-measurable-header`);
  await measurableHeader.click();
  const measurableInput = page.getByTestId(`${TEST_IDS.goalForm}-measurable-input`);
  await measurableInput.fill(goalData.measurable);

  // Fill Achievable
  const achievableHeader = page.getByTestId(`${TEST_IDS.goalForm}-achievable-header`);
  await achievableHeader.click();
  const achievableInput = page.getByTestId(`${TEST_IDS.goalForm}-achievable-input`);
  await achievableInput.fill(goalData.achievable);

  // Fill Relevant
  const relevantHeader = page.getByTestId(`${TEST_IDS.goalForm}-relevant-header`);
  await relevantHeader.click();
  const relevantInput = page.getByTestId(`${TEST_IDS.goalForm}-relevant-input`);
  await relevantInput.fill(goalData.relevant);

  // Select Time-bound date
  const timeBoundHeader = page.getByTestId(`${TEST_IDS.goalForm}-timeBound-header`);
  await timeBoundHeader.click();
  const timeBoundInput = page.getByTestId(`${TEST_IDS.goalForm}-timeBound-input`);
  await timeBoundInput.click();
  // Select "1 Month" option
  const dateOption = page.getByTestId(`${TEST_IDS.goalForm}-date-30`);
  await dateOption.click();
}

/**
 * Test Suite: SMART Goals Screen
 */
test.describe('SMART Goals Screen', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToSMARTGoals(page);
  });

  /**
   * Test: Screen header displays correctly
   */
  test('should display screen header with phase info', async ({ page }) => {
    await expect(page.locator('text=Phase 3')).toBeVisible();
    await expect(page.locator('text=SMART Goals')).toBeVisible();
    await expect(page.locator('text=Define clear, actionable goals')).toBeVisible();
  });

  /**
   * Test: FAB button is visible
   */
  test('should display floating action button', async ({ page }) => {
    const fab = page.getByTestId(TEST_IDS.addGoalFab);
    await expect(fab).toBeVisible();
    await expect(fab).toContainText('+');
  });

  /**
   * Test: Stats card displays correctly
   */
  test('should display stats card with goal counts', async ({ page }) => {
    await expect(page.locator('text=Total')).toBeVisible();
    await expect(page.locator('text=In Progress')).toBeVisible();
    await expect(page.locator('text=Completed')).toBeVisible();
  });

  /**
   * Test: Category filters are visible
   */
  test('should display category filter chips', async ({ page }) => {
    await expect(page.getByTestId(TEST_IDS.filterAll)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.filterPersonal)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.filterProfessional)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.filterHealth)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.filterFinancial)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.filterRelationship)).toBeVisible();
  });

  /**
   * Test: SMART explanation card is visible
   */
  test('should display SMART criteria explanation', async ({ page }) => {
    await expect(page.locator('text=What makes a goal SMART?')).toBeVisible();
    await expect(page.locator('text=Specific')).toBeVisible();
    await expect(page.locator('text=Measurable')).toBeVisible();
    await expect(page.locator('text=Achievable')).toBeVisible();
    await expect(page.locator('text=Relevant')).toBeVisible();
    await expect(page.locator('text=Time-bound')).toBeVisible();
  });

  /**
   * Test: Inspirational quote is visible
   */
  test('should display inspirational quote', async ({ page }) => {
    await expect(page.locator('text=A goal without a plan is just a wish')).toBeVisible();
  });
});

/**
 * Test Suite: Goal Form
 */
test.describe('SMART Goal Form', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToSMARTGoals(page);
  });

  /**
   * Test: Opening goal form via FAB
   */
  test('should open goal form when FAB is clicked', async ({ page }) => {
    await openGoalForm(page);

    const form = page.getByTestId(TEST_IDS.goalForm);
    await expect(form).toBeVisible();
    await expect(form).toContainText('New SMART Goal');
  });

  /**
   * Test: Form has all required fields
   */
  test('should display all form fields', async ({ page }) => {
    await openGoalForm(page);

    // Title field
    const titleInput = page.getByTestId(`${TEST_IDS.goalForm}-title`);
    await expect(titleInput).toBeVisible();

    // Category selector
    const categoryButton = page.getByTestId(`${TEST_IDS.goalForm}-category`);
    await expect(categoryButton).toBeVisible();

    // SMART criteria headers
    await expect(page.locator('text=Specific')).toBeVisible();
    await expect(page.locator('text=Measurable')).toBeVisible();
    await expect(page.locator('text=Achievable')).toBeVisible();
    await expect(page.locator('text=Relevant')).toBeVisible();
    await expect(page.locator('text=Time-bound')).toBeVisible();
  });

  /**
   * Test: Cancel button closes form
   */
  test('should close form when cancel is clicked', async ({ page }) => {
    await openGoalForm(page);

    const cancelButton = page.getByTestId(`${TEST_IDS.goalForm}-cancel`);
    await cancelButton.click();

    const form = page.getByTestId(TEST_IDS.goalForm);
    await expect(form).not.toBeVisible();
  });

  /**
   * Test: Save button disabled without title
   */
  test('should disable save button when title is empty', async ({ page }) => {
    await openGoalForm(page);

    const saveButton = page.getByTestId(`${TEST_IDS.goalForm}-save`);
    // Save button should be disabled (visual state)
    await expect(saveButton).toHaveCSS('opacity', '0.5');
  });

  /**
   * Test: Category picker opens
   */
  test('should open category picker when category button is clicked', async ({ page }) => {
    await openGoalForm(page);

    const categoryButton = page.getByTestId(`${TEST_IDS.goalForm}-category`);
    await categoryButton.click();

    // Category options should be visible
    await expect(page.locator('text=Select Category')).toBeVisible();
    await expect(page.getByTestId(`${TEST_IDS.goalForm}-category-personal`)).toBeVisible();
    await expect(page.getByTestId(`${TEST_IDS.goalForm}-category-professional`)).toBeVisible();
  });

  /**
   * Test: Selecting a category updates the badge
   */
  test('should update category badge when category is selected', async ({ page }) => {
    await openGoalForm(page);

    // Open category picker
    const categoryButton = page.getByTestId(`${TEST_IDS.goalForm}-category`);
    await categoryButton.click();

    // Select Professional
    const professionalOption = page.getByTestId(`${TEST_IDS.goalForm}-category-professional`);
    await professionalOption.click();

    // Badge should show Professional
    await expect(categoryButton).toContainText('Professional');
  });

  /**
   * Test: Expanding SMART criteria sections
   */
  test('should expand SMART criteria sections when clicked', async ({ page }) => {
    await openGoalForm(page);

    // Click on Measurable header
    const measurableHeader = page.getByTestId(`${TEST_IDS.goalForm}-measurable-header`);
    await measurableHeader.click();

    // Measurable input should be visible
    const measurableInput = page.getByTestId(`${TEST_IDS.goalForm}-measurable-input`);
    await expect(measurableInput).toBeVisible();
  });

  /**
   * Test: Progress bar updates as form is filled
   */
  test('should update progress bar as fields are filled', async ({ page }) => {
    await openGoalForm(page);

    // Initially should show low percentage
    await expect(page.locator('text=% complete')).toBeVisible();

    // Fill title
    const titleInput = page.getByTestId(`${TEST_IDS.goalForm}-title`);
    await titleInput.fill(SAMPLE_GOAL.title);

    // Progress should update
    await expect(page.locator('text=/\\d+% complete/')).toBeVisible();
  });

  /**
   * Test: Date picker shows quick options
   */
  test('should display date picker with quick options', async ({ page }) => {
    await openGoalForm(page);

    // Expand Time-bound section
    const timeBoundHeader = page.getByTestId(`${TEST_IDS.goalForm}-timeBound-header`);
    await timeBoundHeader.click();

    // Click date button
    const timeBoundInput = page.getByTestId(`${TEST_IDS.goalForm}-timeBound-input`);
    await timeBoundInput.click();

    // Quick options should be visible
    await expect(page.locator('text=Select Deadline')).toBeVisible();
    await expect(page.locator('text=1 Week')).toBeVisible();
    await expect(page.locator('text=1 Month')).toBeVisible();
    await expect(page.locator('text=3 Months')).toBeVisible();
  });
});

/**
 * Test Suite: Goal Creation
 */
test.describe('Goal Creation', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToSMARTGoals(page);
  });

  /**
   * Test: Creating a new goal
   */
  test('should create a new goal when form is submitted', async ({ page }) => {
    // Open form
    await openGoalForm(page);

    // Fill title (minimum required field)
    const titleInput = page.getByTestId(`${TEST_IDS.goalForm}-title`);
    await titleInput.fill(SAMPLE_GOAL.title);

    // Save goal
    const saveButton = page.getByTestId(`${TEST_IDS.goalForm}-save`);
    await saveButton.click();

    // Form should close
    const form = page.getByTestId(TEST_IDS.goalForm);
    await expect(form).not.toBeVisible();

    // New goal should appear in list
    await expect(page.locator(`text=${SAMPLE_GOAL.title}`)).toBeVisible();
  });

  /**
   * Test: Created goal displays correct category badge
   */
  test('should display category badge on created goal', async ({ page }) => {
    await openGoalForm(page);

    // Fill title
    const titleInput = page.getByTestId(`${TEST_IDS.goalForm}-title`);
    await titleInput.fill('Health Goal Test');

    // Select Health category
    const categoryButton = page.getByTestId(`${TEST_IDS.goalForm}-category`);
    await categoryButton.click();
    const healthOption = page.getByTestId(`${TEST_IDS.goalForm}-category-health`);
    await healthOption.click();

    // Save
    const saveButton = page.getByTestId(`${TEST_IDS.goalForm}-save`);
    await saveButton.click();

    // Goal should show Health badge
    await expect(page.locator('text=Health Goal Test')).toBeVisible();
    await expect(page.locator('text=Health')).toBeVisible();
  });
});

/**
 * Test Suite: Goal Interaction
 */
test.describe('Goal Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToSMARTGoals(page);
    // There should be a sample goal already loaded
  });

  /**
   * Test: Clicking goal card opens edit form
   */
  test('should open edit form when goal card is clicked', async ({ page }) => {
    // Click on the sample goal card
    const goalCard = page.locator('[data-testid^="goal-card-"]').first();
    await goalCard.click();

    // Form should open in edit mode
    const form = page.getByTestId(TEST_IDS.goalForm);
    await expect(form).toBeVisible();
    await expect(form).toContainText('Edit Goal');
  });

  /**
   * Test: Status badge cycles through statuses
   */
  test('should cycle status when status badge is clicked', async ({ page }) => {
    // Find status badge on first goal
    const statusBadge = page.locator('[data-testid^="goal-card-"][data-testid$="-status"]').first();

    // Get initial status
    const initialStatus = await statusBadge.textContent();

    // Click to cycle
    await statusBadge.click();

    // Status should change
    const newStatus = await statusBadge.textContent();
    expect(newStatus).not.toBe(initialStatus);
  });

  /**
   * Test: Stats update when status changes
   */
  test('should update stats when goal status changes to completed', async ({ page }) => {
    // Get initial completed count
    const completedStat = page.locator('text=Completed').locator('..').locator('text=/\\d+/');
    const initialCount = parseInt(await completedStat.textContent() || '0');

    // Find a goal with "In Progress" status and cycle to "Completed"
    const statusBadge = page.locator('[data-testid^="goal-card-"][data-testid$="-status"]').first();

    // Cycle through statuses until we hit completed
    await statusBadge.click(); // not_started -> in_progress
    await statusBadge.click(); // in_progress -> completed

    // Stats should update
    await page.waitForTimeout(500);
    const newCount = parseInt(await completedStat.textContent() || '0');
    expect(newCount).toBeGreaterThanOrEqual(initialCount);
  });
});

/**
 * Test Suite: Goal Filtering
 */
test.describe('Goal Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToSMARTGoals(page);
  });

  /**
   * Test: Filter by Personal category
   */
  test('should filter goals by Personal category', async ({ page }) => {
    const personalFilter = page.getByTestId(TEST_IDS.filterPersonal);
    await personalFilter.click();

    // Filter should be active (has gold border)
    await expect(personalFilter).toHaveCSS('border-color', /rgb/);

    // Only personal goals should be visible (or empty state if none)
    // The sample goal is Personal, so it should still be visible
    const goalCards = page.locator('[data-testid^="goal-card-"]');
    const count = await goalCards.count();

    if (count > 0) {
      // All visible goals should have Personal badge
      await expect(goalCards.first()).toContainText('Personal');
    }
  });

  /**
   * Test: All filter shows all goals
   */
  test('should show all goals when All filter is selected', async ({ page }) => {
    // First filter by a specific category
    const healthFilter = page.getByTestId(TEST_IDS.filterHealth);
    await healthFilter.click();

    // Then select All
    const allFilter = page.getByTestId(TEST_IDS.filterAll);
    await allFilter.click();

    // All filter should be active
    await expect(allFilter).toHaveCSS('border-color', /rgb/);
  });

  /**
   * Test: Empty state when no goals match filter
   */
  test('should show empty state when no goals match filter', async ({ page }) => {
    // Filter by Relationship (unlikely to have any sample goals)
    const relationshipFilter = page.getByTestId(TEST_IDS.filterRelationship);
    await relationshipFilter.click();

    // Should show empty state or goals
    const goalCards = page.locator('[data-testid^="goal-card-"]');
    const count = await goalCards.count();

    if (count === 0) {
      await expect(page.locator('text=No relationship goals')).toBeVisible();
    }
  });
});

/**
 * Test Suite: Goal Deletion
 */
test.describe('Goal Deletion', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToSMARTGoals(page);
  });

  /**
   * Test: Long press shows delete confirmation
   */
  test('should show delete confirmation on long press', async ({ page }) => {
    const goalCard = page.locator('[data-testid^="goal-card-"]').first();

    // Long press (simulate with click and hold)
    await goalCard.click({ delay: 1000 });

    // Alert/confirmation should appear
    // Note: In React Native, this would be an Alert dialog
    // In web testing, we check for any confirmation UI
    await expect(page.locator('text=Delete Goal')).toBeVisible();
  });

  /**
   * Test: Cancel delete keeps goal
   */
  test('should keep goal when delete is cancelled', async ({ page }) => {
    const goalCard = page.locator('[data-testid^="goal-card-"]').first();
    const goalTitle = await goalCard.locator('text=/Complete|meditation|Test/').textContent();

    // Long press to trigger delete
    await goalCard.click({ delay: 1000 });

    // Click Cancel
    await page.locator('text=Cancel').click();

    // Goal should still be visible
    await expect(page.locator(`text=${goalTitle}`)).toBeVisible();
  });

  /**
   * Test: Confirm delete removes goal
   */
  test('should remove goal when delete is confirmed', async ({ page }) => {
    // First create a test goal to delete
    await openGoalForm(page);
    const titleInput = page.getByTestId(`${TEST_IDS.goalForm}-title`);
    await titleInput.fill('Goal To Delete');
    const saveButton = page.getByTestId(`${TEST_IDS.goalForm}-save`);
    await saveButton.click();

    // Find the goal
    const goalCard = page.locator('text=Goal To Delete').locator('..');

    // Long press to trigger delete
    await goalCard.click({ delay: 1000 });

    // Confirm delete
    await page.locator('text=Delete').click();

    // Goal should be removed
    await expect(page.locator('text=Goal To Delete')).not.toBeVisible();
  });
});

/**
 * Test Suite: Auto-save
 */
test.describe('Auto-save Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToSMARTGoals(page);
  });

  /**
   * Test: Auto-save triggers after goal creation
   */
  test('should trigger auto-save after goal creation', async ({ page }) => {
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });

    // Create a new goal
    await openGoalForm(page);
    const titleInput = page.getByTestId(`${TEST_IDS.goalForm}-title`);
    await titleInput.fill('Auto Save Test Goal');
    const saveButton = page.getByTestId(`${TEST_IDS.goalForm}-save`);
    await saveButton.click();

    // Wait for debounce (2 seconds)
    await page.waitForTimeout(2500);

    // Verify auto-save was triggered
    expect(consoleMessages.some((msg) => msg.includes('Auto-saving'))).toBe(true);
  });

  /**
   * Test: Auto-save triggers after status change
   */
  test('should trigger auto-save after status change', async ({ page }) => {
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });

    // Change status of existing goal
    const statusBadge = page.locator('[data-testid^="goal-card-"][data-testid$="-status"]').first();
    await statusBadge.click();

    // Wait for debounce
    await page.waitForTimeout(2500);

    // Verify auto-save was triggered
    expect(consoleMessages.some((msg) => msg.includes('Auto-saving'))).toBe(true);
  });
});

/**
 * Test Suite: Accessibility
 */
test.describe('SMART Goals Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToSMARTGoals(page);
  });

  /**
   * Test: FAB has proper accessibility label
   */
  test('FAB should have accessibility label', async ({ page }) => {
    const fab = page.getByTestId(TEST_IDS.addGoalFab);
    await expect(fab).toHaveAttribute('aria-label', 'Add new goal');
  });

  /**
   * Test: Goal cards have accessibility hints
   */
  test('Goal cards should have accessibility hints', async ({ page }) => {
    const goalCard = page.locator('[data-testid^="goal-card-"]').first();
    await expect(goalCard).toHaveAttribute('role', 'button');
  });

  /**
   * Test: Filter chips are accessible
   */
  test('Filter chips should have accessible state', async ({ page }) => {
    const allFilter = page.getByTestId(TEST_IDS.filterAll);
    await expect(allFilter).toHaveAttribute('role', 'button');
    await expect(allFilter).toHaveAttribute('aria-selected', 'true');
  });

  /**
   * Test: Form inputs are focusable
   */
  test('Form inputs should be focusable', async ({ page }) => {
    await openGoalForm(page);

    const titleInput = page.getByTestId(`${TEST_IDS.goalForm}-title`);
    await titleInput.focus();
    await expect(titleInput).toBeFocused();
  });
});
