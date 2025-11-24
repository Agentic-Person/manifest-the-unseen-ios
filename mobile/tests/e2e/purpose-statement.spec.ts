/**
 * Purpose Statement Screen E2E Tests
 *
 * Tests for the Phase 2 Purpose Statement guided questionnaire.
 * Uses Playwright for E2E testing of the React Native app.
 *
 * Test scenarios:
 * - Displaying first question
 * - Navigating through questions
 * - Answering questions
 * - Generating statement
 * - Editing statement
 * - Save functionality
 */

import { test, expect } from '@playwright/test';

/**
 * Test IDs used in the Purpose Statement components
 */
const TEST_IDS = {
  // Main screen elements
  progressIndicator: 'purpose-progress',
  backButton: 'purpose-back-button',
  nextButton: 'purpose-next-button',
  saveButton: 'purpose-save-button',
  regenerateButton: 'purpose-regenerate-button',

  // Question components
  questionPrefix: 'question-q',

  // Statement display
  statementDisplay: 'purpose-statement-display',
  statementText: 'purpose-statement-display-text',
  statementInput: 'purpose-statement-display-input',
  editButton: 'purpose-statement-display-edit-button',

  // Progress dots
  progressDotPrefix: 'purpose-progress-dot-',
};

/**
 * Helper to get question input by question ID
 */
const getQuestionInput = (questionId: string) => `question-${questionId}-input`;

/**
 * Sample answers for testing
 */
const SAMPLE_ANSWERS = {
  q1: 'Reading, writing, and creating software applications',
  q2: 'I would dedicate my life to teaching and mentoring others',
  q3: 'I want to help people find their purpose and live fulfilling lives',
  q4: 'Problem solving and explaining complex concepts simply',
  q5: 'A legacy of positive impact through education and technology',
  q6: 'When I help someone understand something that was confusing them',
  q7: 'Honesty, continuous learning, and compassion for others',
};

test.describe('Purpose Statement Screen', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Purpose Statement screen
    // In a real test, this would navigate through the app
    await page.goto('/workbook/phase2/purpose-statement');

    // Wait for the screen to load
    await page.waitForSelector(`[data-testid="${TEST_IDS.progressIndicator}"]`);
  });

  test.describe('Initial Display', () => {
    test('should display the first question on load', async ({ page }) => {
      // Check that question 1 is displayed
      const questionInput = page.getByTestId(getQuestionInput('q1'));
      await expect(questionInput).toBeVisible();

      // Check that the progress shows question 1 of 7
      const progressText = page.getByText('Question 1 of 7');
      await expect(progressText).toBeVisible();

      // Check that progress shows 14% complete (1/7)
      const percentageText = page.getByText('14% Complete');
      await expect(percentageText).toBeVisible();
    });

    test('should display progress dots for all questions', async ({ page }) => {
      // Check that all 7 progress dots are visible
      for (let i = 0; i < 7; i++) {
        const dot = page.getByTestId(`${TEST_IDS.progressDotPrefix}${i}`);
        await expect(dot).toBeVisible();
      }
    });

    test('should hide back button on first question', async ({ page }) => {
      const backButton = page.getByTestId(TEST_IDS.backButton);
      // Button should exist but be hidden (opacity: 0)
      await expect(backButton).toHaveCSS('opacity', '0');
    });

    test('should display inspirational quote', async ({ page }) => {
      // Check that the quote for question 1 is visible
      const quote = page.getByText(
        '"The soul becomes dyed with the color of its thoughts." - Marcus Aurelius'
      );
      await expect(quote).toBeVisible();
    });
  });

  test.describe('Question Navigation', () => {
    test('should navigate to next question when Continue is clicked', async ({
      page,
    }) => {
      // Click Continue button
      await page.getByTestId(TEST_IDS.nextButton).click();

      // Check that question 2 is now displayed
      const questionInput = page.getByTestId(getQuestionInput('q2'));
      await expect(questionInput).toBeVisible();

      // Check progress updated
      const progressText = page.getByText('Question 2 of 7');
      await expect(progressText).toBeVisible();
    });

    test('should navigate back to previous question', async ({ page }) => {
      // Go to question 2
      await page.getByTestId(TEST_IDS.nextButton).click();
      await expect(page.getByText('Question 2 of 7')).toBeVisible();

      // Click Back button
      await page.getByTestId(TEST_IDS.backButton).click();

      // Check that question 1 is displayed again
      const questionInput = page.getByTestId(getQuestionInput('q1'));
      await expect(questionInput).toBeVisible();
    });

    test('should allow navigation via progress dots', async ({ page }) => {
      // Answer first question to enable navigation
      const q1Input = page.getByTestId(getQuestionInput('q1'));
      await q1Input.fill(SAMPLE_ANSWERS.q1);

      // Go to question 2
      await page.getByTestId(TEST_IDS.nextButton).click();

      // Click on progress dot 0 to go back to question 1
      await page.getByTestId(`${TEST_IDS.progressDotPrefix}0`).click();

      // Check that question 1 is displayed
      await expect(page.getByText('Question 1 of 7')).toBeVisible();
    });

    test('should navigate through all 7 questions', async ({ page }) => {
      const expectedQuestions = [
        'What activities make you lose track of time?',
        'What would you do if money was not a concern?',
        'What problems do you want to solve in the world?',
        'What are you naturally good at that others appreciate?',
        'What legacy do you want to leave behind?',
        'When do you feel most alive and fulfilled?',
        'What values are non-negotiable in your life?',
      ];

      for (let i = 0; i < expectedQuestions.length; i++) {
        // Check current question is displayed
        const questionText = page.getByText(expectedQuestions[i]);
        await expect(questionText).toBeVisible();

        // Navigate to next (except for last question)
        if (i < expectedQuestions.length - 1) {
          await page.getByTestId(TEST_IDS.nextButton).click();
        }
      }
    });
  });

  test.describe('Answering Questions', () => {
    test('should save answer when typing', async ({ page }) => {
      // Type answer for question 1
      const q1Input = page.getByTestId(getQuestionInput('q1'));
      await q1Input.fill(SAMPLE_ANSWERS.q1);

      // Navigate away and back
      await page.getByTestId(TEST_IDS.nextButton).click();
      await page.getByTestId(TEST_IDS.backButton).click();

      // Check answer is preserved
      await expect(q1Input).toHaveValue(SAMPLE_ANSWERS.q1);
    });

    test('should mark progress dots as answered', async ({ page }) => {
      // Answer question 1
      const q1Input = page.getByTestId(getQuestionInput('q1'));
      await q1Input.fill(SAMPLE_ANSWERS.q1);

      // Navigate to question 2
      await page.getByTestId(TEST_IDS.nextButton).click();

      // Check that dot 0 shows as answered (has filled background)
      const dot0 = page.getByTestId(`${TEST_IDS.progressDotPrefix}0`);
      await expect(dot0).toHaveCSS('background-color', 'rgb(201, 162, 39)'); // #c9a227
    });
  });

  test.describe('Statement Generation', () => {
    test('should generate statement after answering all questions', async ({
      page,
    }) => {
      // Answer all questions
      for (let i = 0; i < 7; i++) {
        const questionId = `q${i + 1}` as keyof typeof SAMPLE_ANSWERS;
        const input = page.getByTestId(getQuestionInput(questionId));
        await input.fill(SAMPLE_ANSWERS[questionId]);
        await page.getByTestId(TEST_IDS.nextButton).click();
      }

      // After the last question, clicking "Reveal My Purpose" should show statement
      // The button text changes on the last question
      await expect(
        page.getByTestId(TEST_IDS.statementDisplay)
      ).toBeVisible();

      // Check that statement contains text from answers
      const statementText = page.getByTestId(TEST_IDS.statementText);
      await expect(statementText).toContainText('My purpose is to');
    });

    test('should show "Reveal My Purpose" button on last question', async ({
      page,
    }) => {
      // Navigate to last question
      for (let i = 0; i < 6; i++) {
        await page.getByTestId(TEST_IDS.nextButton).click();
      }

      // Check button text
      const nextButton = page.getByTestId(TEST_IDS.nextButton);
      await expect(nextButton).toContainText('Reveal My Purpose');
    });
  });

  test.describe('Statement Editing', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate through all questions to get to statement view
      for (let i = 0; i < 7; i++) {
        const questionId = `q${i + 1}` as keyof typeof SAMPLE_ANSWERS;
        const input = page.getByTestId(getQuestionInput(questionId));
        await input.fill(SAMPLE_ANSWERS[questionId]);
        await page.getByTestId(TEST_IDS.nextButton).click();
      }
    });

    test('should allow editing the statement', async ({ page }) => {
      // Click edit button
      await page.getByTestId(TEST_IDS.editButton).click();

      // Check that input is now visible
      const statementInput = page.getByTestId(TEST_IDS.statementInput);
      await expect(statementInput).toBeVisible();

      // Edit the statement
      await statementInput.clear();
      await statementInput.fill('My custom purpose statement');

      // Click done editing
      await page.getByTestId(TEST_IDS.editButton).click();

      // Check that the edited text is displayed
      const statementText = page.getByTestId(TEST_IDS.statementText);
      await expect(statementText).toContainText('My custom purpose statement');
    });

    test('should allow regenerating the statement', async ({ page }) => {
      // Get original statement
      const originalStatement = await page
        .getByTestId(TEST_IDS.statementText)
        .textContent();

      // Edit the statement
      await page.getByTestId(TEST_IDS.editButton).click();
      const statementInput = page.getByTestId(TEST_IDS.statementInput);
      await statementInput.clear();
      await statementInput.fill('Completely different text');
      await page.getByTestId(TEST_IDS.editButton).click();

      // Click regenerate
      await page.getByTestId(TEST_IDS.regenerateButton).click();

      // Check statement is regenerated (matches original)
      const regeneratedStatement = await page
        .getByTestId(TEST_IDS.statementText)
        .textContent();
      expect(regeneratedStatement).toBe(originalStatement);
    });
  });

  test.describe('Save Functionality', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate through all questions to get to statement view
      for (let i = 0; i < 7; i++) {
        const questionId = `q${i + 1}` as keyof typeof SAMPLE_ANSWERS;
        const input = page.getByTestId(getQuestionInput(questionId));
        await input.fill(SAMPLE_ANSWERS[questionId]);
        await page.getByTestId(TEST_IDS.nextButton).click();
      }
    });

    test('should display save button on statement screen', async ({ page }) => {
      const saveButton = page.getByTestId(TEST_IDS.saveButton);
      await expect(saveButton).toBeVisible();
      await expect(saveButton).toContainText('Save Statement');
    });

    test('should save the statement when save button is clicked', async ({
      page,
    }) => {
      // Click save button
      await page.getByTestId(TEST_IDS.saveButton).click();

      // Wait for save to complete (button text should change or alert appears)
      // In a real test, we'd verify the API call was made
      // For now, check that an alert appears
      const alert = page.getByRole('alertdialog');
      await expect(alert).toBeVisible();
      await expect(alert).toContainText('Purpose Statement Saved!');
    });

    test('should show saving indicator while saving', async ({ page }) => {
      // Click save button
      await page.getByTestId(TEST_IDS.saveButton).click();

      // Button should show "Saving..."
      const saveButton = page.getByTestId(TEST_IDS.saveButton);
      await expect(saveButton).toContainText('Saving...');
    });
  });

  test.describe('Accessibility', () => {
    test('should have accessible labels for navigation buttons', async ({
      page,
    }) => {
      const nextButton = page.getByTestId(TEST_IDS.nextButton);
      await expect(nextButton).toHaveAttribute(
        'accessibilityLabel',
        'Next question'
      );

      const backButton = page.getByTestId(TEST_IDS.backButton);
      await expect(backButton).toHaveAttribute(
        'accessibilityLabel',
        'Previous question'
      );
    });

    test('should have accessible labels for progress dots', async ({ page }) => {
      const dot0 = page.getByTestId(`${TEST_IDS.progressDotPrefix}0`);
      await expect(dot0).toHaveAttribute(
        'accessibilityLabel',
        'Question 1 of 7, current'
      );
    });

    test('should have accessible input labels', async ({ page }) => {
      const q1Input = page.getByTestId(getQuestionInput('q1'));
      await expect(q1Input).toHaveAttribute(
        'accessibilityLabel',
        'What activities make you lose track of time?'
      );
    });
  });

  test.describe('Back Navigation from Statement', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate through all questions to get to statement view
      for (let i = 0; i < 7; i++) {
        const questionId = `q${i + 1}` as keyof typeof SAMPLE_ANSWERS;
        const input = page.getByTestId(getQuestionInput(questionId));
        await input.fill(SAMPLE_ANSWERS[questionId]);
        await page.getByTestId(TEST_IDS.nextButton).click();
      }
    });

    test('should allow going back to edit answers', async ({ page }) => {
      // Click back button from statement view
      await page.getByTestId(TEST_IDS.backButton).click();

      // Should be back at question 7
      const progressText = page.getByText('Question 7 of 7');
      await expect(progressText).toBeVisible();

      // Answer should still be there
      const q7Input = page.getByTestId(getQuestionInput('q7'));
      await expect(q7Input).toHaveValue(SAMPLE_ANSWERS.q7);
    });
  });
});
