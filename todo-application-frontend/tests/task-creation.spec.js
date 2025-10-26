// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Task Creation', () => {

  test('Successful Task Creation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const titleInput = page.locator('[data-testid="task-title-input"]');
    await titleInput.waitFor({ state: 'visible' });
    await titleInput.click();
    await titleInput.fill('Buy Groceries');

    const descInput = page.locator('[data-testid="task-description-input"]');
    await descInput.waitFor({ state: 'visible' });
    await descInput.click();
    await descInput.fill('Purchase vegetables, fruits, and milk from the supermarket');

    const addButton = page.locator('[data-testid="add-task-button"]');
    await addButton.waitFor({ state: 'visible' });
    await addButton.click();
    await page.waitForTimeout(1000);

    await expect(titleInput).toHaveValue('');
    await expect(descInput).toHaveValue('');

    await expect(page.locator('[data-testid="task-title"]', { hasText: 'Buy Groceries' }).first()).toBeVisible();
    await expect(page.locator('[data-testid="task-description"]', { hasText: 'Purchase vegetables, fruits, and milk from the supermarket' }).first()).toBeVisible();
  });

  test('Title Validation - Required Field', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const descInput = page.locator('[data-testid="task-description-input"]');
    await descInput.waitFor({ state: 'visible' });
    await descInput.click();
    await descInput.fill('Morning jog reminder without title');

    const addButton = page.locator('[data-testid="add-task-button"]');
    await expect(addButton).toBeDisabled();

    await expect(page.locator('[data-testid="task-title"]', { hasText: 'Morning jog reminder without title' })).toHaveCount(0);
  });

  test('Description is Optional', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const titleInput = page.locator('[data-testid="task-title-input"]');
    await titleInput.waitFor({ state: 'visible' });
    await titleInput.click();
    await titleInput.fill('Read Technical Book');

    const addButton = page.locator('[data-testid="add-task-button"]');
    await addButton.waitFor({ state: 'visible' });
    await addButton.click();
    await page.waitForTimeout(1000);

    await expect(titleInput).toHaveValue('');
    await expect(page.locator('[data-testid="task-description-input"]')).toHaveValue('');

    await expect(page.locator('[data-testid="task-title"]', { hasText: 'Read Technical Book' }).first()).toBeVisible();

    const taskDescription = page.locator('[data-testid="task-title"]', { hasText: 'Read Technical Book' })
                               .first()
                               .locator('..')
                               .locator('[data-testid="task-description"]');
    await expect(taskDescription).toHaveCount(0);
  });

});
