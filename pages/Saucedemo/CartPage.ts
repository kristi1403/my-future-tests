import { expect, Page } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.locator('.shopping_cart_link').click();
  }

  async expectProductVisible(productName: string) {
    await expect(this.page.getByText(productName)).toBeVisible();
  }

  async expectQuantity(quantity: string) {
    await expect(this.page.locator('.cart_quantity')).toHaveText(quantity);
  }

  async expectContinueShoppingVisible() {
    await expect(
      this.page.getByRole('button', { name: 'Continue Shopping' })
    ).toBeVisible();
  }

  async expectCheckoutVisible() {
    await expect(
      this.page.getByRole('button', { name: 'Checkout' })
    ).toBeVisible();
  }
}