import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckoutPage } from '../pages/CheckoutPage';

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
  await checkoutPage.completeOrder('Иван', 'Иванов', '123456');

  // 4. Проверка успешной покупки
  await expect(checkoutPage.successMessage).toHaveText('Thank you for your order!');
});