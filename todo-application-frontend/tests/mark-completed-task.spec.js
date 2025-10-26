import { test, expect } from '@playwright/test';

test.describe('Mark Task as Completed', () => {

  // Setup before each test
  test.beforeEach(async ({ page }) => {
    // Go to the app
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('Clicking Done removes task from the list', async ({ page }) => {
    // Generate a unique task title
    const uniqueTitle = `Task ${Date.now()}`;

    // Fill in title
    const titleInput = page.locator('[data-testid="task-title-input"]');
    await titleInput.waitFor({ state: 'visible' });
    await titleInput.click();
    await titleInput.fill(uniqueTitle);

    // Fill in description
    const descInput = page.locator('[data-testid="task-description-input"]');
    await descInput.waitFor({ state: 'visible' });
    await descInput.click();
    await descInput.fill('Description');

    // Click Add Task button
    const addButton = page.locator('[data-testid="add-task-button"]');
    await addButton.waitFor({ state: 'visible' });
    await addButton.click();

    // Wait for task to appear
    await page.waitForTimeout(1000);

    // Locate the task and wait for it to appear
    const taskLocator = page.locator('[data-testid="task-title"]', { hasText: uniqueTitle });
    await expect(taskLocator).toHaveCount(1);

    // Find and click the Done button (just click the first visible Done button since we just added this task)
    const doneButton = page.getByRole('button', { name: 'Done' }).first();
    await doneButton.waitFor({ state: 'visible' });
    await doneButton.click();

    // Wait for the task to disappear
    await page.waitForTimeout(1000);
    await expect(taskLocator).toHaveCount(0);
  });

});
