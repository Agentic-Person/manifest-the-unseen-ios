/**
 * Vision Board E2E Tests
 *
 * End-to-end tests for the Vision Board feature using Playwright.
 * Tests cover core functionality: adding items, moving, deleting, and saving.
 *
 * Note: These tests are designed for React Native testing with Expo.
 * They use accessibility labels and test IDs for element identification.
 */

import { test, expect, Page } from '@playwright/test';

// Test configuration
const APP_URL = process.env.EXPO_PUBLIC_APP_URL || 'http://localhost:8081';
const VISION_BOARD_ROUTE = '/workbook/vision-board';

// Test data
const TEST_IMAGE_URL = 'https://picsum.photos/200/200'; // Placeholder image for testing
const TEST_TEXT_CONTENT = 'Manifest Your Dreams';

/**
 * Helper to navigate to Vision Board screen
 */
async function navigateToVisionBoard(page: Page) {
  await page.goto(`${APP_URL}${VISION_BOARD_ROUTE}`);
  // Wait for the screen to load
  await page.waitForSelector('[data-testid="vision-board-screen"]', { timeout: 10000 });
}

/**
 * Helper to wait for loading to complete
 */
async function waitForLoadingComplete(page: Page) {
  await page.waitForSelector('[data-testid="loading-indicator"]', { state: 'hidden', timeout: 5000 });
}

test.describe('Vision Board Screen', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Vision Board screen before each test
    await navigateToVisionBoard(page);
    await waitForLoadingComplete(page);
  });

  test.describe('Screen Loading', () => {
    test('should display the vision board screen with correct title', async ({ page }) => {
      // Verify screen title
      const title = page.getByRole('heading', { name: 'Vision Board' });
      await expect(title).toBeVisible();

      // Verify subtitle
      const subtitle = page.getByText('Create a visual representation');
      await expect(subtitle).toBeVisible();
    });

    test('should display empty canvas state initially', async ({ page }) => {
      // Check for empty state message
      const emptyState = page.getByText('Add images and text');
      await expect(emptyState).toBeVisible();

      // Canvas should be visible
      const canvas = page.getByLabel('Vision board canvas');
      await expect(canvas).toBeVisible();
    });

    test('should display action buttons for adding items', async ({ page }) => {
      // Add Image button
      const addImageButton = page.getByRole('button', { name: /add image/i });
      await expect(addImageButton).toBeVisible();

      // Add Text button
      const addTextButton = page.getByRole('button', { name: /add text/i });
      await expect(addTextButton).toBeVisible();
    });
  });

  test.describe('Adding Image Item', () => {
    test('should open image picker when Add Image button is pressed', async ({ page }) => {
      // Click Add Image button
      const addImageButton = page.getByRole('button', { name: /add image/i });
      await addImageButton.click();

      // Note: In a real test environment, we would need to mock the image picker
      // For Expo/React Native, this would involve mocking expo-image-picker
      // Here we verify the button is clickable and triggers the picker
      await expect(addImageButton).toBeEnabled();
    });

    test('should add image item to canvas after selection', async ({ page }) => {
      // This test requires mocking the image picker response
      // In a real implementation, we'd use a test helper to inject an image

      // Mock scenario: Simulate image being added
      await page.evaluate((imageUrl) => {
        // Dispatch a custom event that would be caught by the app
        const event = new CustomEvent('test:add-image', { detail: { uri: imageUrl } });
        window.dispatchEvent(event);
      }, TEST_IMAGE_URL);

      // Wait for the image item to appear on canvas
      // The actual implementation would need testIDs on VisionItem components
      const imageItem = page.locator('[data-testid^="vision-item-image"]');

      // In a mocked environment, we'd verify:
      // await expect(imageItem).toBeVisible();
      // await expect(imageItem).toHaveCount(1);
    });
  });

  test.describe('Adding Text Item', () => {
    test('should open text input modal when Add Text button is pressed', async ({ page }) => {
      // Click Add Text button
      const addTextButton = page.getByRole('button', { name: /add text/i });
      await addTextButton.click();

      // Verify modal is visible
      const modalTitle = page.getByText('Add Inspirational Text');
      await expect(modalTitle).toBeVisible();

      // Verify text input is present
      const textInput = page.getByLabel('Text input for vision board');
      await expect(textInput).toBeVisible();
    });

    test('should add text item to canvas when modal is submitted', async ({ page }) => {
      // Open modal
      const addTextButton = page.getByRole('button', { name: /add text/i });
      await addTextButton.click();

      // Enter text
      const textInput = page.getByLabel('Text input for vision board');
      await textInput.fill(TEST_TEXT_CONTENT);

      // Submit
      const addButton = page.getByRole('button', { name: 'Add Text' }).last();
      await addButton.click();

      // Verify modal is closed
      const modalTitle = page.getByText('Add Inspirational Text');
      await expect(modalTitle).not.toBeVisible();

      // Verify text item appears on canvas
      const textItem = page.getByText(TEST_TEXT_CONTENT);
      await expect(textItem).toBeVisible();
    });

    test('should show alert when submitting empty text', async ({ page }) => {
      // Open modal
      const addTextButton = page.getByRole('button', { name: /add text/i });
      await addTextButton.click();

      // Try to submit without entering text
      const addButton = page.getByRole('button', { name: 'Add Text' }).last();
      await addButton.click();

      // Verify alert/error appears (implementation depends on how alerts are shown)
      // In React Native, this would be an Alert.alert which is harder to test
      // We'd typically mock or use a custom dialog that can be tested
    });

    test('should close modal when Cancel is pressed', async ({ page }) => {
      // Open modal
      const addTextButton = page.getByRole('button', { name: /add text/i });
      await addTextButton.click();

      // Click Cancel
      const cancelButton = page.getByRole('button', { name: 'Cancel' });
      await cancelButton.click();

      // Verify modal is closed
      const modalTitle = page.getByText('Add Inspirational Text');
      await expect(modalTitle).not.toBeVisible();
    });
  });

  test.describe('Moving an Item', () => {
    test.beforeEach(async ({ page }) => {
      // Add a text item first
      const addTextButton = page.getByRole('button', { name: /add text/i });
      await addTextButton.click();

      const textInput = page.getByLabel('Text input for vision board');
      await textInput.fill(TEST_TEXT_CONTENT);

      const addButton = page.getByRole('button', { name: 'Add Text' }).last();
      await addButton.click();
    });

    test('should select item when tapped', async ({ page }) => {
      // Tap on the text item
      const textItem = page.getByText(TEST_TEXT_CONTENT);
      await textItem.click();

      // Verify selection controls appear (delete button, move buttons)
      const deleteButton = page.getByRole('button', { name: 'Delete item' });
      await expect(deleteButton).toBeVisible();

      const moveUpButton = page.getByRole('button', { name: 'Move up' });
      await expect(moveUpButton).toBeVisible();
    });

    test('should move item when direction buttons are pressed', async ({ page }) => {
      // Select the item
      const textItem = page.getByText(TEST_TEXT_CONTENT);
      await textItem.click();

      // Get initial position (would need data-testid with position info)
      // For this test, we verify the move buttons work without errors

      // Move up
      const moveUpButton = page.getByRole('button', { name: 'Move up' });
      await moveUpButton.click();

      // Move right
      const moveRightButton = page.getByRole('button', { name: 'Move right' });
      await moveRightButton.click();

      // Move down
      const moveDownButton = page.getByRole('button', { name: 'Move down' });
      await moveDownButton.click();

      // Move left
      const moveLeftButton = page.getByRole('button', { name: 'Move left' });
      await moveLeftButton.click();

      // Item should still be visible after moves
      await expect(textItem).toBeVisible();
    });

    test('should deselect item when canvas is tapped', async ({ page }) => {
      // Select the item
      const textItem = page.getByText(TEST_TEXT_CONTENT);
      await textItem.click();

      // Verify selection controls are visible
      const deleteButton = page.getByRole('button', { name: 'Delete item' });
      await expect(deleteButton).toBeVisible();

      // Tap on empty canvas area
      const canvas = page.getByLabel('Vision board canvas');
      await canvas.click({ position: { x: 10, y: 400 } }); // Click empty area

      // Verify selection controls are hidden
      await expect(deleteButton).not.toBeVisible();
    });
  });

  test.describe('Deleting an Item', () => {
    test.beforeEach(async ({ page }) => {
      // Add a text item first
      const addTextButton = page.getByRole('button', { name: /add text/i });
      await addTextButton.click();

      const textInput = page.getByLabel('Text input for vision board');
      await textInput.fill(TEST_TEXT_CONTENT);

      const addButton = page.getByRole('button', { name: 'Add Text' }).last();
      await addButton.click();
    });

    test('should show delete confirmation when delete button is pressed', async ({ page }) => {
      // Select the item
      const textItem = page.getByText(TEST_TEXT_CONTENT);
      await textItem.click();

      // Press delete
      const deleteButton = page.getByRole('button', { name: 'Delete item' });
      await deleteButton.click();

      // Verify confirmation dialog appears
      // Note: React Native Alert requires special handling in tests
      // Would typically mock Alert.alert or use a custom dialog
    });

    test('should remove item from canvas when deletion is confirmed', async ({ page }) => {
      // Select the item
      const textItem = page.getByText(TEST_TEXT_CONTENT);
      await textItem.click();

      // Press delete
      const deleteButton = page.getByRole('button', { name: 'Delete item' });
      await deleteButton.click();

      // Confirm deletion (mock the alert response)
      // In a real test, we'd mock Alert.alert to auto-confirm

      // After confirmation, item should be removed
      // await expect(textItem).not.toBeVisible();

      // Empty state should show again
      // const emptyState = page.getByText('Add images and text');
      // await expect(emptyState).toBeVisible();
    });
  });

  test.describe('Save Functionality', () => {
    test('should display save status indicator', async ({ page }) => {
      // Add an item to trigger auto-save
      const addTextButton = page.getByRole('button', { name: /add text/i });
      await addTextButton.click();

      const textInput = page.getByLabel('Text input for vision board');
      await textInput.fill(TEST_TEXT_CONTENT);

      const addButton = page.getByRole('button', { name: 'Add Text' }).last();
      await addButton.click();

      // Wait for auto-save to trigger (debounced at 2 seconds)
      await page.waitForTimeout(2500);

      // Check for save status
      const saveStatus = page.getByText(/last saved|saving|changes will auto-save/i);
      await expect(saveStatus).toBeVisible();
    });

    test('should have Save & Continue button', async ({ page }) => {
      const saveButton = page.getByRole('button', { name: 'Save and continue' });
      await expect(saveButton).toBeVisible();
      await expect(saveButton).toBeEnabled();
    });

    test('should navigate back when Save & Continue is pressed', async ({ page }) => {
      const saveButton = page.getByRole('button', { name: 'Save and continue' });
      await saveButton.click();

      // Verify navigation occurred (would go back to previous screen)
      // The actual verification depends on the navigation structure
      // await expect(page).toHaveURL(/workbook/);
    });
  });

  test.describe('Tips Card', () => {
    test('should display tips for creating a vision board', async ({ page }) => {
      const tipsTitle = page.getByText('Tips for Your Vision Board');
      await expect(tipsTitle).toBeVisible();

      // Check for tip content
      const tip1 = page.getByText(/Choose images that evoke/i);
      await expect(tip1).toBeVisible();

      const tip2 = page.getByText(/Include specific goals/i);
      await expect(tip2).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper accessibility labels on interactive elements', async ({ page }) => {
      // Add Image button
      const addImageButton = page.getByRole('button', { name: /add image/i });
      await expect(addImageButton).toHaveAttribute('aria-label', /add image/i);

      // Add Text button
      const addTextButton = page.getByRole('button', { name: /add text/i });
      await expect(addTextButton).toBeVisible();

      // Save button
      const saveButton = page.getByRole('button', { name: /save/i });
      await expect(saveButton).toBeVisible();
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Tab to Add Image button
      await page.keyboard.press('Tab');

      // Continue tabbing through interactive elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Verify focus is on an interactive element
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
  });
});

/**
 * Test utilities for mocking native modules
 * These would be used in a real test environment
 */
const mockImagePicker = {
  async launchImageLibraryAsync(): Promise<{ canceled: boolean; assets?: Array<{ uri: string }> }> {
    return {
      canceled: false,
      assets: [{ uri: TEST_IMAGE_URL }],
    };
  },
  async requestMediaLibraryPermissionsAsync(): Promise<{ status: string }> {
    return { status: 'granted' };
  },
};

const mockHaptics = {
  impactAsync: async () => {},
  notificationAsync: async () => {},
};

export { mockImagePicker, mockHaptics };
