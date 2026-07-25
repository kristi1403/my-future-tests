import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/Saucedemo/LoginPage';
import { InventoryPage } from '../../pages/Saucedemo/InventoryPage';
import { CheckoutPage } from '../../pages/Saucedemo/CheckoutPage';
import { CartPage } from '../../pages/Saucedemo/CartPage';

test('Successfull login with Page Object', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('standard_user', 'secret_sauce');
  const title = page.locator('.title');
  await expect(title).toHaveText('Products');
});

test('Error when entering incorrect password', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('standard_user', 'wrong_password');
  const errorMessage = page.locator('[data-test="error"]');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText('Username and password do not match');
});

test('Error when login with empty fields', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await page.getByRole('button', { name: 'Login' }).click();
  const errorMessage = page.locator('[data-test="error"]');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText('Username is required');
});

test('Error when logging in with a locked out user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('locked_out_user', 'secret_sauce');
  const errorMessage = page.locator('[data-test="error"]');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText('Sorry, this user has been locked out.');
});


test('Full purchase cycle (End-to-End)', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const checkoutPage = new CheckoutPage(page); // Connected checkout

  // 1. Login
  await loginPage.navigate();
  await loginPage.login('standard_user', 'secret_sauce');
  
  // 2. Adding to cart
  await inventoryPage.addBackpackToCart();
  await inventoryPage.goToCart();

  // 3. Placing order
  await checkoutPage.completeOrder('Anna', 'Petrova', '654321');

  // 4. Checking successful purchase
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

test('Remove item from the cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const checkoutPage = new CheckoutPage(page); 
  await loginPage.navigate();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addBackpackToCart();
  await inventoryPage.goToCart();
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  await expect(page.locator('[data-test="item-quantity"]')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible();
  await page.getByRole('button', { name: 'Remove' }).click();
 const item = page.locator('.cart_item').filter({ hasText: 'Sauce Labs Backpack' });
await expect(item).toHaveCount(0);
});

test('Error in checkout form with invalid data', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const checkoutPage = new CheckoutPage(page);
  await loginPage.navigate();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addBackpackToCart();
  await inventoryPage.goToCart();
  await checkoutPage.checkoutButton.click();
  await checkoutPage.firstNameInput.fill('');
  await checkoutPage.lastNameInput.fill('Test');
  await checkoutPage.postalCodeInput.fill('11122');
  await checkoutPage.continueButton.click();
  const firstNameErrorMessage = page.locator('[data-test="error"]');
  await expect(firstNameErrorMessage).toBeVisible();
  await expect(firstNameErrorMessage).toContainText('Error: First Name is required');
  await checkoutPage.firstNameInput.fill('Test');
  await checkoutPage.lastNameInput.fill('');
  await checkoutPage.postalCodeInput.fill('11122');
  await checkoutPage.continueButton.click();
  const lastNameErrorMessage = page.locator('[data-test="error"]');
  await expect(lastNameErrorMessage).toBeVisible();
  await expect(lastNameErrorMessage).toContainText('Error: Last Name is required');
  await checkoutPage.firstNameInput.fill('Test');
  await checkoutPage.lastNameInput.fill('Test');
  await checkoutPage.postalCodeInput.fill('');
  await checkoutPage.continueButton.click();
  const postalCodeErrorMessage = page.locator('[data-test="error"]');
  await expect(postalCodeErrorMessage).toBeVisible();
  await expect(postalCodeErrorMessage).toContainText('Error: Postal Code is required');
});

test('Sorting items', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('standard_user', 'secret_sauce');

  const sortSelect = page.locator('[data-test="product-sort-container"]');
  await sortSelect.selectOption('Name (Z to A)');

  const firstItem = page.locator('.inventory_item_name').first();
  await expect(firstItem).toHaveText('Test.allTheThings() T-Shirt (Red)');

  await sortSelect.selectOption('Name (A to Z)');

  const lastItem = page.locator('.inventory_item_name').first();
  await expect(lastItem).toHaveText('Sauce Labs Backpack');
});

test('Adding several items to the cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const checkoutPage = new CheckoutPage(page); 
  await loginPage.navigate();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addBackpackToCart();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
  await inventoryPage.goToCart();
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
  await expect(page.locator('[data-test="item-quantity"]')).toHaveCount(2);
  await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
  await page.locator('[data-test="continue-shopping"]').click();
  await expect(page.getByText('Products')).toBeVisible();
});

test('Cancel button on checkout returns to the cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const checkoutPage = new CheckoutPage(page);
  await loginPage.navigate();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addBackpackToCart();
  await inventoryPage.goToCart();
  await checkoutPage.checkoutButton.click();
  await expect(checkoutPage.cancelButton).toBeVisible();
  await checkoutPage.cancelButton.click();
  await expect(page).toHaveURL(/\/cart\.html$/);
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
});