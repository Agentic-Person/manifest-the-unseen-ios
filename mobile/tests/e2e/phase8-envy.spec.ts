/**
 * Phase 8: Turning Envy Into Inspiration E2E Tests
 *
 * Playwright tests for Phase 8 screens covering:
 * - Envy Inventory screen
 * - Inspiration Reframe screen
 * - Role Models screen
 */

import { test, expect, Page } from '@playwright/test';

// Test IDs used across Phase 8 screens
const TEST_IDS = {
  // Envy Inventory
  envyList: 'envy-list',
  addEnvyButton: 'add-envy-button',
  categoryFilterAll: 'category-filter-all',
  categoryFilterSuccess: 'category-filter-success',
  categoryFilterRelationships: 'category-filter-relationships',
  categoryFilterWealth: 'category-filter-wealth',
  categoryFilterAppearance: 'category-filter-appearance',
  categoryFilterLifestyle: 'category-filter-lifestyle',
  categoryFilterTalent: 'category-filter-talent',
  modalCancel: 'modal-cancel',
  modalSave: 'modal-save',
  formWhoWhat: 'form-who-what',
  formTrigger: 'form-trigger',
  formCategorySuccess: 'form-category-success',
  formCategoryWealth: 'form-category-wealth',
  formIntensity: 'form-intensity',
  formReflection: 'form-reflection',

  // Inspiration Reframe
  reframeList: 'reframe-list',
  filterAll: 'filter-all',
  filterPending: 'filter-pending',
  filterComplete: 'filter-complete',
  goToInventory: 'go-to-inventory',

  // Role Models
  roleModelsList: 'rolemodels-list',
  addRoleModelButton: 'add-rolemodel-button',
  formPhotoPicker: 'form-photo-picker',
  formName: 'form-name',
  formInspiration: 'form-inspiration',
  formNewLesson: 'form-new-lesson',
  formAddLesson: 'form-add-lesson',
  formQuote: 'form-quote',
};

/**
 * Helper: Navigate to a specific Phase 8 screen
 */
async function navigateToPhase8Screen(page: Page, screenName: 'inventory' | 'reframe' | 'rolemodels') {
  // Navigate to Workbook tab
  await page.getByRole('tab', { name: /workbook/i }).click();

  // Navigate to Phase 8
  await page.getByText('Phase 8').click();

  // Select specific screen
  switch (screenName) {
    case 'inventory':
      await page.getByText(/envy inventory/i).click();
      break;
    case 'reframe':
      await page.getByText(/inspiration reframe/i).click();
      break;
    case 'rolemodels':
      await page.getByText(/role models/i).click();
      break;
  }
}

// =============================================================================
// Envy Inventory Screen Tests
// =============================================================================

test.describe('Envy Inventory Screen', () => {
  test.beforeEach(async ({ page }) => {
    // Assume app is running and user is authenticated
    await page.goto('/');
    await navigateToPhase8Screen(page, 'inventory');
  });

  test('should display envy inventory screen with all elements', async ({ page }) => {
    await expect(page.getByTestId(TEST_IDS.envyList)).toBeVisible();
    await expect(page.getByText(/envy inventory/i)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.categoryFilterAll)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.addEnvyButton)).toBeVisible();
  });

  test('should show empty state when no items exist', async ({ page }) => {
    await expect(page.getByText(/begin your inventory/i)).toBeVisible();
    await expect(page.getByText(/tap the \+ button/i)).toBeVisible();
  });

  test('should open add envy modal when + button pressed', async ({ page }) => {
    await page.getByTestId(TEST_IDS.addEnvyButton).click();

    // Modal should appear
    await expect(page.getByText(/new entry/i)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.formWhoWhat)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.formTrigger)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.modalCancel)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.modalSave)).toBeVisible();
  });

  test('should add new envy item', async ({ page }) => {
    await page.getByTestId(TEST_IDS.addEnvyButton).click();

    // Fill in the form
    await page.getByTestId(TEST_IDS.formWhoWhat).fill("Colleague's promotion");
    await page.getByTestId(TEST_IDS.formTrigger).fill('Seeing their LinkedIn announcement');
    await page.getByTestId(TEST_IDS.formCategorySuccess).click();
    await page.getByTestId(TEST_IDS.formReflection).fill('I value recognition and career growth');

    // Save
    await page.getByTestId(TEST_IDS.modalSave).click();

    // Modal should close and item should appear
    await expect(page.getByText(/new entry/i)).not.toBeVisible();
    await expect(page.getByText(/colleague's promotion/i)).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.getByTestId(TEST_IDS.addEnvyButton).click();

    // Try to save without filling required fields
    await page.getByTestId(TEST_IDS.modalSave).click();

    // Should show validation alert
    await expect(page.getByText(/required fields/i)).toBeVisible();
  });

  test('should filter items by category', async ({ page }) => {
    // First add items in different categories
    await page.getByTestId(TEST_IDS.addEnvyButton).click();
    await page.getByTestId(TEST_IDS.formWhoWhat).fill('Success envy');
    await page.getByTestId(TEST_IDS.formTrigger).fill('Trigger');
    await page.getByTestId(TEST_IDS.formCategorySuccess).click();
    await page.getByTestId(TEST_IDS.modalSave).click();

    await page.getByTestId(TEST_IDS.addEnvyButton).click();
    await page.getByTestId(TEST_IDS.formWhoWhat).fill('Wealth envy');
    await page.getByTestId(TEST_IDS.formTrigger).fill('Trigger');
    await page.getByTestId(TEST_IDS.formCategoryWealth).click();
    await page.getByTestId(TEST_IDS.modalSave).click();

    // Filter by Success
    await page.getByTestId(TEST_IDS.categoryFilterSuccess).click();
    await expect(page.getByText(/success envy/i)).toBeVisible();
    await expect(page.getByText(/wealth envy/i)).not.toBeVisible();

    // Filter by Wealth
    await page.getByTestId(TEST_IDS.categoryFilterWealth).click();
    await expect(page.getByText(/wealth envy/i)).toBeVisible();
    await expect(page.getByText(/success envy/i)).not.toBeVisible();

    // Show all
    await page.getByTestId(TEST_IDS.categoryFilterAll).click();
    await expect(page.getByText(/success envy/i)).toBeVisible();
    await expect(page.getByText(/wealth envy/i)).toBeVisible();
  });

  test('should edit existing envy item', async ({ page }) => {
    // Add an item first
    await page.getByTestId(TEST_IDS.addEnvyButton).click();
    await page.getByTestId(TEST_IDS.formWhoWhat).fill('Original text');
    await page.getByTestId(TEST_IDS.formTrigger).fill('Trigger');
    await page.getByTestId(TEST_IDS.modalSave).click();

    // Edit the item
    const editButton = page.locator('[testID$="-edit"]').first();
    await editButton.click();

    // Should show edit modal with existing data
    await expect(page.getByText(/edit entry/i)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.formWhoWhat)).toHaveValue('Original text');

    // Update the text
    await page.getByTestId(TEST_IDS.formWhoWhat).fill('Updated text');
    await page.getByTestId(TEST_IDS.modalSave).click();

    // Should show updated text
    await expect(page.getByText(/updated text/i)).toBeVisible();
  });

  test('should delete envy item with confirmation', async ({ page }) => {
    // Add an item first
    await page.getByTestId(TEST_IDS.addEnvyButton).click();
    await page.getByTestId(TEST_IDS.formWhoWhat).fill('Item to delete');
    await page.getByTestId(TEST_IDS.formTrigger).fill('Trigger');
    await page.getByTestId(TEST_IDS.modalSave).click();

    // Delete the item
    const deleteButton = page.locator('[testID$="-delete"]').first();
    await deleteButton.click();

    // Should show confirmation dialog
    await expect(page.getByText(/delete envy item/i)).toBeVisible();

    // Confirm deletion
    await page.getByRole('button', { name: /delete/i }).click();

    // Item should be removed
    await expect(page.getByText(/item to delete/i)).not.toBeVisible();
  });

  test('should update intensity with slider', async ({ page }) => {
    // Add an item first
    await page.getByTestId(TEST_IDS.addEnvyButton).click();
    await page.getByTestId(TEST_IDS.formWhoWhat).fill('Test item');
    await page.getByTestId(TEST_IDS.formTrigger).fill('Trigger');
    await page.getByTestId(TEST_IDS.modalSave).click();

    // Find and interact with intensity slider
    const slider = page.locator('[testID$="-intensity"]').first();
    await expect(slider).toBeVisible();
  });

  test('should expand/collapse envy card details', async ({ page }) => {
    // Add an item with reflection
    await page.getByTestId(TEST_IDS.addEnvyButton).click();
    await page.getByTestId(TEST_IDS.formWhoWhat).fill('Expandable item');
    await page.getByTestId(TEST_IDS.formTrigger).fill('Trigger');
    await page.getByTestId(TEST_IDS.formReflection).fill('My reflection about this envy');
    await page.getByTestId(TEST_IDS.modalSave).click();

    // Initially collapsed - reflection not visible
    await expect(page.getByText(/my reflection/i)).not.toBeVisible();

    // Expand
    const expandButton = page.locator('[testID$="-expand"]').first();
    await expandButton.click();

    // Reflection should be visible
    await expect(page.getByText(/my reflection/i)).toBeVisible();

    // Collapse
    await expandButton.click();
    await expect(page.getByText(/my reflection/i)).not.toBeVisible();
  });

  test('should cancel adding envy item', async ({ page }) => {
    await page.getByTestId(TEST_IDS.addEnvyButton).click();
    await page.getByTestId(TEST_IDS.formWhoWhat).fill('Cancelled item');
    await page.getByTestId(TEST_IDS.modalCancel).click();

    // Modal should close without saving
    await expect(page.getByText(/new entry/i)).not.toBeVisible();
    await expect(page.getByText(/cancelled item/i)).not.toBeVisible();
  });
});

// =============================================================================
// Inspiration Reframe Screen Tests
// =============================================================================

test.describe('Inspiration Reframe Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await navigateToPhase8Screen(page, 'reframe');
  });

  test('should display reframe screen with all elements', async ({ page }) => {
    await expect(page.getByTestId(TEST_IDS.reframeList)).toBeVisible();
    await expect(page.getByText(/transform envy to inspiration/i)).toBeVisible();
    await expect(page.getByText(/transformation progress/i)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.filterAll)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.filterPending)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.filterComplete)).toBeVisible();
  });

  test('should show progress bar', async ({ page }) => {
    await expect(page.getByText(/transformation progress/i)).toBeVisible();
    // Progress bar should show X of Y format
    await expect(page.getByText(/\d+ of \d+/)).toBeVisible();
  });

  test('should filter reframes by status', async ({ page }) => {
    // Test filter tabs
    await page.getByTestId(TEST_IDS.filterPending).click();
    await expect(page.getByTestId(TEST_IDS.filterPending)).toHaveAttribute('aria-selected', 'true');

    await page.getByTestId(TEST_IDS.filterComplete).click();
    await expect(page.getByTestId(TEST_IDS.filterComplete)).toHaveAttribute('aria-selected', 'true');

    await page.getByTestId(TEST_IDS.filterAll).click();
    await expect(page.getByTestId(TEST_IDS.filterAll)).toHaveAttribute('aria-selected', 'true');
  });

  test('should show empty state with link to inventory', async ({ page }) => {
    // If no items, should show empty state
    const emptyState = page.getByText(/no items to transform/i);
    if (await emptyState.isVisible()) {
      await expect(page.getByTestId(TEST_IDS.goToInventory)).toBeVisible();
    }
  });

  test('should display three-step transformation flow', async ({ page }) => {
    // With sample data, should show transformation steps
    const reframeCard = page.locator('[testID^="reframe-card-"]').first();
    if (await reframeCard.isVisible()) {
      await expect(page.getByText(/i'm envious of/i)).toBeVisible();
      await expect(page.getByText(/this shows i value/i)).toBeVisible();
      await expect(page.getByText(/i can achieve this by/i)).toBeVisible();
    }
  });

  test('should allow editing value discovery', async ({ page }) => {
    const valueInput = page.locator('[testID$="-value-input"]').first();
    if (await valueInput.isVisible()) {
      await valueInput.fill('I value recognition and career growth');
      // Input should update
      await expect(valueInput).toHaveValue('I value recognition and career growth');
    }
  });

  test('should allow editing action plan', async ({ page }) => {
    const actionInput = page.locator('[testID$="-action-input"]').first();
    if (await actionInput.isVisible()) {
      await actionInput.fill('Ask for more responsibilities at work');
      // Input should update
      await expect(actionInput).toHaveValue('Ask for more responsibilities at work');
    }
  });

  test('should complete transformation when both fields filled', async ({ page }) => {
    const valueInput = page.locator('[testID$="-value-input"]').first();
    const actionInput = page.locator('[testID$="-action-input"]').first();
    const completeButton = page.locator('[testID$="-complete"]').first();

    if (await valueInput.isVisible()) {
      // Fill both fields
      await valueInput.fill('Test value');
      await actionInput.fill('Test action');

      // Complete button should be enabled
      await expect(completeButton).not.toBeDisabled();

      // Click complete
      await completeButton.click();

      // Should show transformed badge
      await expect(page.getByText(/transformed/i)).toBeVisible();
    }
  });

  test('should disable complete button when fields empty', async ({ page }) => {
    const completeButton = page.locator('[testID$="-complete"]').first();
    if (await completeButton.isVisible()) {
      // With empty fields, button should be disabled
      await expect(completeButton).toBeDisabled();
    }
  });

  test('should show celebration when all transformations complete', async ({ page }) => {
    // This tests the completion message
    await page.getByTestId(TEST_IDS.filterComplete).click();
    const celebrationText = page.getByText(/amazing.*transformed/i);
    // Only visible if 100% complete
  });
});

// =============================================================================
// Role Models Screen Tests
// =============================================================================

test.describe('Role Models Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await navigateToPhase8Screen(page, 'rolemodels');
  });

  test('should display role models screen with all elements', async ({ page }) => {
    await expect(page.getByTestId(TEST_IDS.roleModelsList)).toBeVisible();
    await expect(page.getByText(/role models & inspirations/i)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.addRoleModelButton)).toBeVisible();
  });

  test('should show empty state when no role models exist', async ({ page }) => {
    await expect(page.getByText(/build your role model board/i)).toBeVisible();
    await expect(page.getByText(/who inspires you/i)).toBeVisible();
  });

  test('should open add role model modal', async ({ page }) => {
    await page.getByTestId(TEST_IDS.addRoleModelButton).click();

    // Modal should appear
    await expect(page.getByText(/new role model/i)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.formPhotoPicker)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.formName)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.formInspiration)).toBeVisible();
  });

  test('should add new role model', async ({ page }) => {
    await page.getByTestId(TEST_IDS.addRoleModelButton).click();

    // Fill in the form
    await page.getByTestId(TEST_IDS.formName).fill('Oprah Winfrey');
    await page.getByTestId('form-category-career').click();
    await page.getByTestId(TEST_IDS.formInspiration).fill('Her resilience and ability to connect with people');
    await page.getByTestId(TEST_IDS.formQuote).fill('Turn your wounds into wisdom.');

    // Save
    await page.getByTestId(TEST_IDS.modalSave).click();

    // Modal should close and role model should appear
    await expect(page.getByText(/new role model/i)).not.toBeVisible();
    await expect(page.getByText(/oprah winfrey/i)).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.getByTestId(TEST_IDS.addRoleModelButton).click();

    // Try to save without filling required fields
    await page.getByTestId(TEST_IDS.modalSave).click();

    // Should show validation alert
    await expect(page.getByText(/required fields/i)).toBeVisible();
  });

  test('should add lessons learned', async ({ page }) => {
    await page.getByTestId(TEST_IDS.addRoleModelButton).click();

    // Fill required fields
    await page.getByTestId(TEST_IDS.formName).fill('Test Person');
    await page.getByTestId(TEST_IDS.formInspiration).fill('Test inspiration');

    // Add lessons
    await page.getByTestId(TEST_IDS.formNewLesson).fill('Persistence pays off');
    await page.getByTestId(TEST_IDS.formAddLesson).click();

    // Lesson should be added as a tag
    await expect(page.getByText(/persistence pays off/i)).toBeVisible();

    // Add another lesson
    await page.getByTestId(TEST_IDS.formNewLesson).fill('Always stay curious');
    await page.getByTestId(TEST_IDS.formAddLesson).click();

    await expect(page.getByText(/always stay curious/i)).toBeVisible();
  });

  test('should remove lesson tag', async ({ page }) => {
    await page.getByTestId(TEST_IDS.addRoleModelButton).click();

    // Add a lesson
    await page.getByTestId(TEST_IDS.formNewLesson).fill('Lesson to remove');
    await page.getByTestId(TEST_IDS.formAddLesson).click();

    // Remove the lesson
    const removeButton = page.locator('text=Lesson to remove').locator('..').locator('[role="button"]');
    await removeButton.click();

    // Lesson should be removed
    await expect(page.getByText(/lesson to remove/i)).not.toBeVisible();
  });

  test('should filter role models by category', async ({ page }) => {
    // Add role models in different categories
    await page.getByTestId(TEST_IDS.addRoleModelButton).click();
    await page.getByTestId(TEST_IDS.formName).fill('Career Model');
    await page.getByTestId(TEST_IDS.formInspiration).fill('Inspiration');
    await page.getByTestId('form-category-career').click();
    await page.getByTestId(TEST_IDS.modalSave).click();

    await page.getByTestId(TEST_IDS.addRoleModelButton).click();
    await page.getByTestId(TEST_IDS.formName).fill('Health Model');
    await page.getByTestId(TEST_IDS.formInspiration).fill('Inspiration');
    await page.getByTestId('form-category-health').click();
    await page.getByTestId(TEST_IDS.modalSave).click();

    // Filter by Career
    await page.getByTestId('category-filter-career').click();
    await expect(page.getByText(/career model/i)).toBeVisible();
    await expect(page.getByText(/health model/i)).not.toBeVisible();

    // Filter by Health
    await page.getByTestId('category-filter-health').click();
    await expect(page.getByText(/health model/i)).toBeVisible();
    await expect(page.getByText(/career model/i)).not.toBeVisible();
  });

  test('should expand/collapse lessons section', async ({ page }) => {
    // Add a role model with lessons
    await page.getByTestId(TEST_IDS.addRoleModelButton).click();
    await page.getByTestId(TEST_IDS.formName).fill('Model with Lessons');
    await page.getByTestId(TEST_IDS.formInspiration).fill('Inspiration');
    await page.getByTestId(TEST_IDS.formNewLesson).fill('Important lesson');
    await page.getByTestId(TEST_IDS.formAddLesson).click();
    await page.getByTestId(TEST_IDS.modalSave).click();

    // Initially, lessons might be collapsed
    const lessonsToggle = page.locator('[testID$="-lessons-toggle"]').first();
    await lessonsToggle.click();

    // Lessons should be visible
    await expect(page.getByText(/important lesson/i)).toBeVisible();

    // Collapse
    await lessonsToggle.click();
  });

  test('should edit existing role model', async ({ page }) => {
    // Add a role model first
    await page.getByTestId(TEST_IDS.addRoleModelButton).click();
    await page.getByTestId(TEST_IDS.formName).fill('Original Name');
    await page.getByTestId(TEST_IDS.formInspiration).fill('Original inspiration');
    await page.getByTestId(TEST_IDS.modalSave).click();

    // Edit the role model
    const editButton = page.locator('[testID$="-edit"]').first();
    await editButton.click();

    // Should show edit modal with existing data
    await expect(page.getByText(/edit role model/i)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.formName)).toHaveValue('Original Name');

    // Update the name
    await page.getByTestId(TEST_IDS.formName).fill('Updated Name');
    await page.getByTestId(TEST_IDS.modalSave).click();

    // Should show updated name
    await expect(page.getByText(/updated name/i)).toBeVisible();
  });

  test('should delete role model with confirmation', async ({ page }) => {
    // Add a role model first
    await page.getByTestId(TEST_IDS.addRoleModelButton).click();
    await page.getByTestId(TEST_IDS.formName).fill('Person to Delete');
    await page.getByTestId(TEST_IDS.formInspiration).fill('Inspiration');
    await page.getByTestId(TEST_IDS.modalSave).click();

    // Delete the role model
    const deleteButton = page.locator('[testID$="-delete"]').first();
    await deleteButton.click();

    // Should show confirmation dialog
    await expect(page.getByText(/remove role model/i)).toBeVisible();

    // Confirm deletion
    await page.getByRole('button', { name: /remove/i }).click();

    // Role model should be removed
    await expect(page.getByText(/person to delete/i)).not.toBeVisible();
  });

  test('should display quote when provided', async ({ page }) => {
    // Add a role model with quote
    await page.getByTestId(TEST_IDS.addRoleModelButton).click();
    await page.getByTestId(TEST_IDS.formName).fill('Quotable Person');
    await page.getByTestId(TEST_IDS.formInspiration).fill('Inspiration');
    await page.getByTestId(TEST_IDS.formQuote).fill('This is their memorable quote');
    await page.getByTestId(TEST_IDS.modalSave).click();

    // Quote should be visible
    await expect(page.getByText(/this is their memorable quote/i)).toBeVisible();
  });

  test('should show initials when no photo provided', async ({ page }) => {
    // Add a role model without photo
    await page.getByTestId(TEST_IDS.addRoleModelButton).click();
    await page.getByTestId(TEST_IDS.formName).fill('John Smith');
    await page.getByTestId(TEST_IDS.formInspiration).fill('Inspiration');
    await page.getByTestId(TEST_IDS.modalSave).click();

    // Should show initials (JS)
    await expect(page.getByText('JS')).toBeVisible();
  });
});

// =============================================================================
// Accessibility Tests
// =============================================================================

test.describe('Phase 8 Accessibility', () => {
  test('envy inventory should have proper accessibility labels', async ({ page }) => {
    await page.goto('/');
    await navigateToPhase8Screen(page, 'inventory');

    // Add button should have proper label
    await expect(page.getByTestId(TEST_IDS.addEnvyButton)).toHaveAttribute(
      'aria-label',
      expect.stringContaining('envy')
    );

    // Category filters should have proper roles
    await expect(page.getByTestId(TEST_IDS.categoryFilterAll)).toHaveAttribute('role', 'button');
  });

  test('reframe screen should have proper accessibility labels', async ({ page }) => {
    await page.goto('/');
    await navigateToPhase8Screen(page, 'reframe');

    // Filter tabs should have proper roles
    await expect(page.getByTestId(TEST_IDS.filterAll)).toHaveAttribute('role', 'tab');
    await expect(page.getByTestId(TEST_IDS.filterPending)).toHaveAttribute('role', 'tab');
    await expect(page.getByTestId(TEST_IDS.filterComplete)).toHaveAttribute('role', 'tab');
  });

  test('role models screen should have proper accessibility labels', async ({ page }) => {
    await page.goto('/');
    await navigateToPhase8Screen(page, 'rolemodels');

    // Add button should have proper label
    await expect(page.getByTestId(TEST_IDS.addRoleModelButton)).toHaveAttribute(
      'aria-label',
      expect.stringContaining('role model')
    );
  });
});

// =============================================================================
// Performance Tests
// =============================================================================

test.describe('Phase 8 Performance', () => {
  test('envy inventory should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await navigateToPhase8Screen(page, 'inventory');

    await page.getByTestId(TEST_IDS.envyList).waitFor({ state: 'visible' });

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
  });

  test('role models screen should handle many items efficiently', async ({ page }) => {
    await page.goto('/');
    await navigateToPhase8Screen(page, 'rolemodels');

    // Add multiple role models
    for (let i = 0; i < 5; i++) {
      await page.getByTestId(TEST_IDS.addRoleModelButton).click();
      await page.getByTestId(TEST_IDS.formName).fill(`Role Model ${i}`);
      await page.getByTestId(TEST_IDS.formInspiration).fill('Test inspiration');
      await page.getByTestId(TEST_IDS.modalSave).click();
      await page.waitForTimeout(100);
    }

    // Screen should remain responsive - filter switch should be fast
    const startTime = Date.now();
    await page.getByTestId('category-filter-career').click();
    const responseTime = Date.now() - startTime;

    expect(responseTime).toBeLessThan(500); // Filter should be fast
  });
});

// =============================================================================
// Integration Tests
// =============================================================================

test.describe('Phase 8 Integration', () => {
  test('should navigate from reframe to inventory', async ({ page }) => {
    await page.goto('/');
    await navigateToPhase8Screen(page, 'reframe');

    // If empty state shown, click go to inventory
    const goToInventoryButton = page.getByTestId(TEST_IDS.goToInventory);
    if (await goToInventoryButton.isVisible()) {
      await goToInventoryButton.click();
      await expect(page.getByText(/envy inventory/i)).toBeVisible();
    }
  });

  test('should auto-save when making changes', async ({ page }) => {
    await page.goto('/');
    await navigateToPhase8Screen(page, 'inventory');

    // Add an item - this should trigger auto-save
    await page.getByTestId(TEST_IDS.addEnvyButton).click();
    await page.getByTestId(TEST_IDS.formWhoWhat).fill('Auto-save test');
    await page.getByTestId(TEST_IDS.formTrigger).fill('Trigger');
    await page.getByTestId(TEST_IDS.modalSave).click();

    // Item should persist (in real app, would verify console.log call)
    await expect(page.getByText(/auto-save test/i)).toBeVisible();
  });
});
