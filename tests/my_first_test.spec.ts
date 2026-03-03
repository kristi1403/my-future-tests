import { test, expect, Page } from '@playwright/test';

async function searchWikipedia(page: Page, searchTerm: string) {
  await page.getByRole('searchbox', { name: 'Search Wikipedia' }).click();
  await page.getByRole('searchbox', { name: 'Search Wikipedia' }).fill(searchTerm);
  await page.getByRole('button', { name: 'Search' }).click();
}

test.describe('Wikipedia Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.wikipedia.org/');
  });

  test('Wikipedia search works', async ({ page }) => {
    await searchWikipedia(page, 'Software testing');
    await expect(page).toHaveURL(/.*Software_testing/);
  });

  test('Wikipedia search works for Automation', async ({ page }) => {
    await searchWikipedia(page, 'Test automation');
    await expect(page).toHaveURL(/.*Test_automation/);
  });
});