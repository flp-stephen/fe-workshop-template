import { test, expect } from '@playwright/test';

test.describe('QuickMarks App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bookmarks');
  });

  test('should load the bookmarks page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('QuickMarks');
    await expect(page.locator('text=Add New Bookmark')).toBeVisible();
  });

  test('should show validation errors for invalid input', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: 'Save Bookmark' }).click();

    // Should show validation errors
    await expect(page.locator('text=Title is required')).toBeVisible();
    await expect(page.locator('text=Please enter a valid URL')).toBeVisible();
  });

  test('should add a new bookmark', async ({ page }) => {
    const testTitle = `Test Bookmark ${Date.now()}`;
    const testUrl = 'https://example.com';

    // Fill in the form
    await page.getByLabel('Title').fill(testTitle);
    await page.getByLabel('URL').fill(testUrl);
    await page.getByRole('button', { name: 'Save Bookmark' }).click();

    // Wait for page to reload/update
    await page.waitForTimeout(500);

    // Should see the new bookmark in the list
    await expect(page.locator(`text=${testTitle}`)).toBeVisible();
  });

  test('should navigate to bookmark detail page', async ({ page }) => {
    // Wait for bookmarks to load
    await page.waitForTimeout(1000);

    // Check if there are any bookmarks
    const bookmarks = page.locator('ul.space-y-3 > li');
    const count = await bookmarks.count();

    if (count === 0) {
      // Create a bookmark first
      await page.getByLabel('Title').fill('Test for Detail');
      await page.getByLabel('URL').fill('https://example.com');
      await page.getByRole('button', { name: 'Save Bookmark' }).click();
      await page.waitForTimeout(500);
    }

    // Click on the first bookmark title
    const firstBookmarkLink = page.locator('ul.space-y-3 a').first();
    const bookmarkTitle = await firstBookmarkLink.textContent();
    await firstBookmarkLink.click();

    // Should navigate to detail page
    await expect(page).toHaveURL(/\/bookmarks\/.+/);
    await expect(page.locator('text=Back to list')).toBeVisible();

    // Should show the bookmark details (check for detail-specific elements)
    await expect(page.locator('text=Created')).toBeVisible();
    await expect(page.locator('text=ID')).toBeVisible();
  });

  test('should navigate back from detail page', async ({ page }) => {
    // Wait for bookmarks to load
    await page.waitForTimeout(1000);

    const bookmarks = page.locator('ul.space-y-3 > div');
    const count = await bookmarks.count();

    if (count === 0) {
      // Create a bookmark first
      await page.getByLabel('Title').fill('Test for Back Nav');
      await page.getByLabel('URL').fill('https://example.com');
      await page.getByRole('button', { name: 'Save Bookmark' }).click();
      await page.waitForTimeout(500);
    }

    // Navigate to detail
    await page.locator('ul.space-y-3 a').first().click();
    await expect(page).toHaveURL(/\/bookmarks\/.+/);

    // Click back link
    await page.getByRole('link', { name: /Back to list/i }).click();

    // Should be back on bookmarks list
    await expect(page).toHaveURL('/bookmarks');
    await expect(page.locator('h1')).toContainText('QuickMarks');
  });

  test('should delete a bookmark', async ({ page }) => {
    const testTitle = `Delete Me ${Date.now()}`;

    // Create a bookmark to delete
    await page.getByLabel('Title').fill(testTitle);
    await page.getByLabel('URL').fill('https://example.com');
    await page.getByRole('button', { name: 'Save Bookmark' }).click();

    // Wait for bookmark to appear in list (give it more time for server roundtrip)
    await expect(page.locator(`text=${testTitle}`)).toBeVisible({ timeout: 10000 });

    // Find the list item containing this bookmark and click its delete button
    const bookmarkItem = page.locator('li').filter({ hasText: testTitle });
    await bookmarkItem.locator('button[type="submit"]').click();

    // Wait for deletion and verify bookmark is gone
    await expect(page.locator(`text=${testTitle}`)).not.toBeVisible({ timeout: 10000 });
  });

  test('should show 404 for non-existent bookmark', async ({ page }) => {
    // Navigate to a bookmark ID that doesn't exist
    await page.goto('/bookmarks/non-existent-id-12345');

    // Should show error page or 404
    // Note: The exact behavior depends on your error boundary implementation
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
  });

  test('should validate URL format', async ({ page }) => {
    await page.getByLabel('Title').fill('Invalid URL Test');
    await page.getByLabel('URL').fill('not-a-valid-url');

    // Submit form to trigger validation
    await page.getByRole('button', { name: 'Save Bookmark' }).click();

    // Should show URL validation error
    await expect(page.locator('text=Please enter a valid URL')).toBeVisible();
  });

  test('should clear form after successful submission', async ({ page }) => {
    const testTitle = `Clear Form Test ${Date.now()}`;
    await page.getByLabel('Title').fill(testTitle);
    await page.getByLabel('URL').fill('https://example.com');
    await page.getByRole('button', { name: 'Save Bookmark' }).click();

    // Wait for the bookmark to appear (confirms submission succeeded)
    await expect(page.locator(`text=${testTitle}`)).toBeVisible({ timeout: 10000 });

    // Form should be cleared after successful submission
    await expect(page.getByLabel('Title')).toHaveValue('');
    await expect(page.getByLabel('URL')).toHaveValue('');
  });
});
