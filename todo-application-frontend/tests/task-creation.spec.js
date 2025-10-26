// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Task Creation', () => {

  test('Successful Task Creation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for and fill title
    const titleInput = page.locator('[data-testid="task-title-input"]');
    await titleInput.waitFor({ state: 'visible' });
    await titleInput.click();
    await titleInput.fill('Task One');

    // Wait for and fill description
    const descInput = page.locator('[data-testid="task-description-input"]');
    await descInput.waitFor({ state: 'visible' });
    await descInput.click();
    await descInput.fill('This is my first task');

    // Click Add Task
    const addButton = page.locator('[data-testid="add-task-button"]');
    await addButton.waitFor({ state: 'visible' });
    await addButton.click();
    await page.waitForTimeout(1000);

    // Verify form is cleared
    await expect(titleInput).toHaveValue('');
    await expect(descInput).toHaveValue('');

    // Verify task appears with title and description
    await expect(page.locator('[data-testid="task-title"]', { hasText: 'Task One' }).first()).toBeVisible();
    await expect(page.locator('[data-testid="task-description"]', { hasText: 'This is my first task' }).first()).toBeVisible();
  });

  test('Title Validation - Required Field', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Leave title empty and fill description
    const descInput = page.locator('[data-testid="task-description-input"]');
    await descInput.waitFor({ state: 'visible' });
    await descInput.click();
    await descInput.fill('Description without title');

    // Verify Add Task button is disabled
    const addButton = page.locator('[data-testid="add-task-button"]');
    await expect(addButton).toBeDisabled();

    // Ensure no task card is created
    await expect(page.locator('[data-testid="task-title"]', { hasText: 'Description without title' })).toHaveCount(0);
  });

  test('Description is Optional', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Enter title only, leave description empty
    const titleInput = page.locator('[data-testid="task-title-input"]');
    await titleInput.waitFor({ state: 'visible' });
    await titleInput.click();
    await titleInput.fill('Task Title Only');

    // Click Add Task
    const addButton = page.locator('[data-testid="add-task-button"]');
    await addButton.waitFor({ state: 'visible' });
    await addButton.click();
    await page.waitForTimeout(1000);

    // Verify form is cleared
    await expect(titleInput).toHaveValue('');
    await expect(page.locator('[data-testid="task-description-input"]')).toHaveValue('');

    // Verify task appears with title only (latest task)
    await expect(page.locator('[data-testid="task-title"]', { hasText: 'Task Title Only' }).first()).toBeVisible();

    // Verify description is empty
    const taskDescription = page.locator('[data-testid="task-title"]', { hasText: 'Task Title Only' })
                               .first()
                               .locator('..')
                               .locator('[data-testid="task-description"]');
    await expect(taskDescription).toHaveCount(0);
  });

});
