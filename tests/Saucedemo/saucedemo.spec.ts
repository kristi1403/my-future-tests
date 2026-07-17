import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/Saucedemo/LoginPage';
import { InventoryPage } from '../../pages/Saucedemo/InventoryPage';
import { CheckoutPage } from '../../pages/Saucedemo/CheckoutPage';
import { CartPage } from '../../pages/Saucedemo/CartPage';

test('Успешный логин через Page Object', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('standard_user', 'secret_sauce');
  const title = page.locator('.title');
  await expect(title).toHaveText('Products');
});

test('Ошибка при вводе неверного пароля', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('standard_user', 'wrong_password');
  const errorMessage = page.locator('[data-test="error"]');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText('Username and password do not match');
});

test('Полный цикл покупки (End-to-End)', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const checkoutPage = new CheckoutPage(page); // Подключили чекаут

  // 1. Логин
  await loginPage.navigate();
  await loginPage.login('standard_user', 'secret_sauce');
  
  // 2. Добавление в корзину
  await inventoryPage.addBackpackToCart();
  await inventoryPage.goToCart();

  // 3. Оформление заказа
  await checkoutPage.completeOrder('Anna', 'Petrova', '654321');

  // 4. Проверка успешной покупки
  await expect(checkoutPage.successMessage).toHaveText('Thank you for your order!');
});

  test('Logout', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('standard_user', 'secret_sauce');
  const title = page.locator('.title');
  await expect(title).toHaveText('Products');
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await expect(page.locator('[data-test="logout-sidebar-link"]')).toBeVisible();
  await page.locator('[data-test="logout-sidebar-link"]').click();
  await expect(page.locator('[data-test="username"]')).toBeVisible();
});

test('Check title Products', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page.getByText('Products')).toBeVisible();
});

test('Check product detail page', async ({ page }) => {
  const cartPage = new CartPage(page);
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('standard_user', 'secret_sauce');
  await page.getByText('Sauce Labs Backpack' ).click();
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible();
  await cartPage.open();
  await cartPage.expectProductVisible('Sauce Labs Backpack');
  await cartPage.expectQuantity('1');
  await cartPage.expectContinueShoppingVisible();
  await cartPage.expectCheckoutVisible();
});