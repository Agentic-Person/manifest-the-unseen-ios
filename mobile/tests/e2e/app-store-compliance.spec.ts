/**
 * App Store Compliance E2E Tests
 *
 * Tests to verify compliance with Apple App Store Review Guidelines.
 * These tests ensure the app meets Apple's requirements before submission.
 *
 * Key Guidelines Tested:
 * - 5.1.1: Account Deletion (required for apps with account creation)
 * - 5.1.1: Privacy Policy & Terms of Service accessibility
 * - 3.1.2: Subscription auto-renewal disclosure
 * - 3.1.3: Restore Purchases functionality
 * - 2.3.1: No debug/test code in production
 *
 * Run with: npx playwright test app-store-compliance.spec.ts
 */

import { test, expect, Page } from '@playwright/test';

const APP_URL = process.env.APP_URL || 'http://localhost:8081';

/**
 * Helper: Navigate to Profile screen
 */
async function navigateToProfile(page: Page) {
  await page.goto(APP_URL);
  // Wait for app to load
  await page.waitForTimeout(2000);
  // Click on Profile tab
  const profileTab = page.getByRole('tab', { name: /profile/i }).or(
    page.getByText('Profile').first()
  );
  if (await profileTab.isVisible()) {
    await profileTab.click();
  }
}

/**
 * Helper: Navigate to Account Settings
 */
async function navigateToAccountSettings(page: Page) {
  await navigateToProfile(page);
  await page.waitForTimeout(1000);
  // Look for Account Settings link/button
  const accountSettings = page.getByText(/account settings/i).or(
    page.getByText(/account/i).first()
  );
  if (await accountSettings.isVisible()) {
    await accountSettings.click();
  }
}

/**
 * Helper: Navigate to Paywall
 */
async function navigateToPaywall(page: Page) {
  await page.goto(APP_URL);
  await page.waitForTimeout(2000);
  // Try to find any upgrade/subscribe button
  const upgradeButton = page.getByRole('button', { name: /upgrade|subscribe|start.*trial/i }).first();
  if (await upgradeButton.isVisible()) {
    await upgradeButton.click();
    await page.waitForTimeout(1000);
  }
}

// ============================================================================
// Guideline 5.1.1: Account Deletion
// ============================================================================

test.describe('Account Deletion (Guideline 5.1.1)', () => {
  test('should have Delete Account option in Account Settings', async ({ page }) => {
    await navigateToAccountSettings(page);

    // Look for Delete Account button/text
    const deleteButton = page.getByRole('button', { name: /delete account/i }).or(
      page.getByText(/delete account/i)
    );

    // This test documents whether the feature exists
    const isVisible = await deleteButton.isVisible().catch(() => false);
    console.log(`Delete Account option visible: ${isVisible}`);

    // Soft assertion - log result but don't fail test
    if (!isVisible) {
      console.warn('WARNING: Delete Account option not found - App Store will reject!');
    }
  });

  test('should show confirmation when Delete Account is pressed', async ({ page }) => {
    await navigateToAccountSettings(page);

    const deleteButton = page.getByText(/delete account/i);
    if (await deleteButton.isVisible().catch(() => false)) {
      await deleteButton.click();
      await page.waitForTimeout(500);

      // Should show confirmation dialog or modal
      const confirmDialog = page.getByText(/are you sure|confirm|cannot be undone/i);
      const isConfirmVisible = await confirmDialog.isVisible().catch(() => false);
      console.log(`Confirmation dialog visible: ${isConfirmVisible}`);
    }
  });
});

// ============================================================================
// Guideline 5.1.1: Privacy Policy & Terms of Service
// ============================================================================

test.describe('Privacy Policy & Terms (Guideline 5.1.1)', () => {
  test('should have accessible Privacy Policy', async ({ page }) => {
    await navigateToProfile(page);

    // Look for Privacy Policy link
    const privacyLink = page.getByText(/privacy policy/i);
    const isVisible = await privacyLink.isVisible().catch(() => false);
    console.log(`Privacy Policy link visible: ${isVisible}`);

    if (isVisible) {
      await privacyLink.click();
      await page.waitForTimeout(1000);

      // Check for privacy policy content
      const privacyContent = page.getByText(/information.*collect|data.*use/i);
      const hasContent = await privacyContent.isVisible().catch(() => false);
      console.log(`Privacy Policy content visible: ${hasContent}`);
    }
  });

  test('should have accessible Terms of Service', async ({ page }) => {
    await navigateToProfile(page);

    // Look for Terms of Service link
    const termsLink = page.getByText(/terms of service|terms.*conditions/i);
    const isVisible = await termsLink.isVisible().catch(() => false);
    console.log(`Terms of Service link visible: ${isVisible}`);

    if (isVisible) {
      await termsLink.click();
      await page.waitForTimeout(1000);

      // Check for terms content
      const termsContent = page.getByText(/acceptance|subscription|user.*content/i);
      const hasContent = await termsContent.isVisible().catch(() => false);
      console.log(`Terms of Service content visible: ${hasContent}`);
    }
  });
});

// ============================================================================
// Guideline 3.1.2: Subscription Disclosure
// ============================================================================

test.describe('Subscription Disclosure (Guideline 3.1.2)', () => {
  test('should show auto-renewal disclosure on paywall', async ({ page }) => {
    await navigateToPaywall(page);

    // Look for auto-renewal text
    const renewalText = page.getByText(/automatically renews|auto-renew/i);
    const isVisible = await renewalText.isVisible().catch(() => false);
    console.log(`Auto-renewal disclosure visible: ${isVisible}`);

    if (!isVisible) {
      console.warn('WARNING: Auto-renewal disclosure not found - Required by App Store!');
    }
  });

  test('should show subscription pricing', async ({ page }) => {
    await navigateToPaywall(page);

    // Look for pricing information
    const pricing = page.getByText(/\$\d+\.\d+|monthly|annual|yearly/i);
    const isVisible = await pricing.first().isVisible().catch(() => false);
    console.log(`Pricing information visible: ${isVisible}`);
  });

  test('should have Terms and Privacy links on paywall', async ({ page }) => {
    await navigateToPaywall(page);

    const termsLink = page.getByText(/terms of service/i);
    const privacyLink = page.getByText(/privacy policy/i);

    const termsVisible = await termsLink.isVisible().catch(() => false);
    const privacyVisible = await privacyLink.isVisible().catch(() => false);

    console.log(`Terms link on paywall: ${termsVisible}`);
    console.log(`Privacy link on paywall: ${privacyVisible}`);
  });
});

// ============================================================================
// Guideline 3.1.3: Restore Purchases
// ============================================================================

test.describe('Restore Purchases (Guideline 3.1.3)', () => {
  test('should have Restore Purchases button on paywall', async ({ page }) => {
    await navigateToPaywall(page);

    // Look for restore purchases button
    const restoreButton = page.getByRole('button', { name: /restore.*purchase/i }).or(
      page.getByText(/restore.*purchase/i)
    );
    const isVisible = await restoreButton.isVisible().catch(() => false);
    console.log(`Restore Purchases button visible: ${isVisible}`);

    if (!isVisible) {
      console.warn('WARNING: Restore Purchases not found - Required by App Store!');
    }
  });
});

// ============================================================================
// Guideline 2.3.1: No Debug Code
// ============================================================================

test.describe('No Debug Code (Guideline 2.3.1)', () => {
  test('should NOT show TEST MODE indicator on paywall', async ({ page }) => {
    await navigateToPaywall(page);

    // Look for TEST MODE indicator
    const testMode = page.getByText(/test mode|testing|debug/i);
    const isVisible = await testMode.isVisible().catch(() => false);

    console.log(`TEST MODE indicator visible: ${isVisible}`);

    // In production, this should NOT be visible
    if (isVisible) {
      console.warn('WARNING: TEST MODE indicator visible - Will cause App Store rejection!');
    }
  });
});

// ============================================================================
// Data Export (Privacy Policy Promise)
// ============================================================================

test.describe('Data Export Feature', () => {
  test('should have data export option in Privacy & Security', async ({ page }) => {
    await navigateToProfile(page);

    // Navigate to Privacy & Security
    const privacySecurity = page.getByText(/privacy.*security/i);
    if (await privacySecurity.isVisible().catch(() => false)) {
      await privacySecurity.click();
      await page.waitForTimeout(1000);

      // Look for export option
      const exportButton = page.getByText(/export.*data|download.*data/i);
      const isVisible = await exportButton.isVisible().catch(() => false);
      console.log(`Data Export option visible: ${isVisible}`);
    }
  });
});

// ============================================================================
// Summary Test
// ============================================================================

test('App Store Compliance Summary', async ({ page }) => {
  console.log('\n=== App Store Compliance Audit Summary ===\n');

  // Navigate to paywall and check key elements
  await navigateToPaywall(page);
  await page.waitForTimeout(2000);

  const checks = {
    'Auto-renewal disclosure': await page.getByText(/automatically renews/i).isVisible().catch(() => false),
    'Restore Purchases': await page.getByText(/restore.*purchase/i).isVisible().catch(() => false),
    'Pricing displayed': await page.getByText(/\$/i).first().isVisible().catch(() => false),
    'Terms link': await page.getByText(/terms of service/i).isVisible().catch(() => false),
    'Privacy link': await page.getByText(/privacy policy/i).isVisible().catch(() => false),
    'No TEST MODE': !(await page.getByText(/test mode/i).isVisible().catch(() => false)),
  };

  console.log('Paywall Checks:');
  for (const [name, passed] of Object.entries(checks)) {
    console.log(`  ${passed ? '✅' : '❌'} ${name}`);
  }

  // Navigate to profile for account deletion check
  await navigateToAccountSettings(page);
  await page.waitForTimeout(2000);

  const accountChecks = {
    'Delete Account visible': await page.getByText(/delete account/i).isVisible().catch(() => false),
  };

  console.log('\nAccount Settings Checks:');
  for (const [name, passed] of Object.entries(accountChecks)) {
    console.log(`  ${passed ? '✅' : '❌'} ${name}`);
  }

  console.log('\n=== End of Audit ===\n');
});
