import { test, expect } from '@playwright/test';

test.describe('Mark Task as Completed', () => {

  // Setup before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
  });

  test('Clicking Done removes task from the list', async ({ page }) => {
    const uniqueTitle = `Task ${Date.now()}`;

    const titleInput = page.locator('[data-testid="task-title-input"]');
    await titleInput.waitFor({ state: 'visible' });
    await titleInput.click();
    await titleInput.fill(uniqueTitle);

    const descInput = page.locator('[data-testid="task-description-input"]');
    await descInput.waitFor({ state: 'visible' });
    await descInput.click();
    await descInput.fill('Description');

    const addButton = page.locator('[data-testid="add-task-button"]');
    await addButton.waitFor({ state: 'visible' });
    await addButton.click();

    await page.waitForTimeout(1000);

    const taskLocator = page.locator('[data-testid="task-title"]', { hasText: uniqueTitle });
    await expect(taskLocator).toHaveCount(1);

    const doneButton = page.getByRole('button', { name: 'Done' }).first();
    await doneButton.waitFor({ state: 'visible' });
    await doneButton.click();

    await page.waitForTimeout(1000);
    await expect(taskLocator).toHaveCount(0);
  });

});
