import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/Herokuapp/LoginPage';

test('successful login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('tomsmith', 'SuperSecretPassword!');
    await page.waitForURL(/\/secure$/);
    await expect(page.locator('.flash.success')).toContainText('You logged into a secure area!');
});

test('unsuccessful login with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('tomsmith', 'wrongpassword');
    await page.waitForSelector('.flash.error');
    await expect(page.locator('.flash.error')).toContainText('Your password is invalid!');
});

test('unsuccessful login with empty login ', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('', 'SuperSecretPassword!');
    await page.waitForSelector('.flash.error');
    await page.waitForURL(/\/login$/);
    await expect(page.locator('.flash.error')).toContainText('Your username is invalid!');
});

test('logout button and functionality', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('tomsmith', 'SuperSecretPassword!');
    await page.waitForURL(/\/secure$/);
    await expect(loginPage.successScreen).toContainText('You logged into a secure area!');
    await expect(loginPage.LogoutLink).toBeVisible();
    await expect(loginPage.LogoutLink).toHaveText('Logout');
    await loginPage.LogoutLink.click();
    await page.waitForURL(/\/login$/);
    await expect(loginPage.successScreen).toContainText('You logged out of the secure area!');
});